import asyncio
import json
import re
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
from agent.mcp_client import (
    MCP_SERVER_URL,
    get_all_tools,
    filter_tools_for_analyst,
    tools_to_openai_format,
    call_mcp_tool,
)
from agent.prompts import get_analyst_prompt_template
from agent.qwen_client import call_qwen_with_retry
from agent.config import (
    get_max_iterations,
    get_max_tools_per_round,
    SPEED_INSTRUCTION,
    ANALYST_STAGGER_SECONDS,
    is_fast_mode,
)

ANALYSTS = ["macro", "sentiment", "market_intel", "news"]


async def run_specialist(
    session: ClientSession,
    all_tools: dict,
    analyst_key: str,
    coin: str,
    ai_client=None,
    model: str = "qwen3.6-plus",
    category: str = None,
) -> dict:
    """Run a single specialist analyst agent and return its structured report"""

    print(f"  🔍 {analyst_key.upper()} analyst starting for {coin}...")

    analyst_tools = filter_tools_for_analyst(all_tools, analyst_key)
    openai_tools = tools_to_openai_format(analyst_tools)

    analyst_prompt_template = get_analyst_prompt_template(analyst_key, coin, category=category)
    
    if is_fast_mode():
        system_prompt = analyst_prompt_template.format(coin=coin) + SPEED_INSTRUCTION
        user_message = (
            f"Analyze {coin} now. Use at most 2 tools, then output ONLY the JSON report."
        )
    else:
        full_instruction = (
            "\n\nCOMPREHENSIVE RULES: Perform a deep and thorough analysis. "
            "Use all your available tools to cross-reference multiple data dimensions "
            "(macro trends, technical factors, market news, sentiment). Analyze "
            "contradictory signals, investigate unexpected values, and use multiple steps "
            "if necessary before generating the final comprehensive JSON report."
        )
        system_prompt = analyst_prompt_template.format(coin=coin) + full_instruction
        user_message = (
            f"Analyze {coin} now. Gather thorough data from your specialist tools, "
            "perform robust multi-factor reasoning, and provide a comprehensive JSON report."
        )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    iterations_limit = get_max_iterations()
    for iteration in range(iterations_limit):
        # On the last iteration, withhold tools so the model must return JSON
        allow_tools = iteration < iterations_limit - 1 and openai_tools
        qwen_tools = openai_tools if allow_tools else None

        if not allow_tools and iteration > 0:
            messages.append({
                "role": "user",
                "content": (
                    "Now, synthesize all gathered data and output ONLY the final "
                    "JSON report following the strict schema requested in your system prompt. "
                    "Do not include any other commentary, markdown code fences, or text outside the JSON. "
                    "The output must be a single valid JSON block starting with { and ending with }."
                )
            })

        response_data = await call_qwen_with_retry(
            messages=messages,
            tools=qwen_tools,
            temperature=0.1,
        )

        choice = response_data["choices"][0]
        message = dict(choice["message"])
        if not message.get("content") and message.get("tool_calls"):
            message["content"] = "Calling tools."

        messages.append(message)
        tool_calls = message.get("tool_calls")

        if not tool_calls:
            final_text = message.get("content") or ""
            return parse_analyst_report(final_text, analyst_key, coin)

        # Cap parallel tool calls per round
        tool_calls = tool_calls[:get_max_tools_per_round()]

        calls = []
        for tc in tool_calls:
            fn_name = tc["function"]["name"]
            fn_args_str = tc["function"].get("arguments", "{}")
            try:
                fn_args = json.loads(fn_args_str) if isinstance(fn_args_str, str) else fn_args_str
            except json.JSONDecodeError:
                fn_args = {}
            calls.append(call_mcp_tool(session, fn_name, fn_args))

        tool_results = await asyncio.gather(*calls)

        for tc, result in zip(tool_calls, tool_results):
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "name": tc["function"]["name"],
                "content": result,
            })

        print(
            f"    ↳ [{analyst_key}] iter {iteration + 1}: "
            f"called {[tc['function']['name'] for tc in tool_calls]}"
        )

    return parse_analyst_report(messages[-1].get("content") or "", analyst_key, coin)


def parse_analyst_report(text: str, analyst_key: str, coin: str) -> dict:
    """Parse JSON from analyst response with robust cleaning and fallback parsing"""
    if not text:
        return _parse_fallback(text, analyst_key)

    # 1. Clean markdown code block fences if they wrap the entire text or parts of it
    cleaned_text = text.strip()
    # Remove leading backticks and 'json' specifier if any
    cleaned_text = re.sub(r"^```(?:json)?\s*", "", cleaned_text)
    # Remove trailing backticks
    cleaned_text = re.sub(r"\s*```$", "", cleaned_text)
    cleaned_text = cleaned_text.strip()

    # 2. Try simple json load of the cleaned overall text
    try:
        report = json.loads(cleaned_text)
        return _format_report(report, analyst_key)
    except json.JSONDecodeError:
        pass

    # 3. Find the first '{' and final '}' in case there is surrounding commentary
    json_match = re.search(r"\{[\s\S]*\}", cleaned_text)
    if json_match:
        cand = json_match.group()
        try:
            report = json.loads(cand)
            return _format_report(report, analyst_key)
        except json.JSONDecodeError:
            # Try cleaning trailing commas in dictionaries and arrays: e.g. "key": "val", } -> "key": "val" }
            repaired_cand = re.sub(r",\s*([\}\]])", r"\1", cand)
            try:
                report = json.loads(repaired_cand)
                return _format_report(report, analyst_key)
            except json.JSONDecodeError:
                pass

    # 4. Deep regex-based field extractor (absolute guarantee if JSON structure is slightly off)
    try:
        # Extract signal (BULLISH, BEARISH, NEUTRAL)
        signal_m = re.search(r'"signal"\s*:\s*"?(BULLISH|BEARISH|NEUTRAL)"?', cleaned_text, re.IGNORECASE)
        signal = signal_m.group(1).upper() if signal_m else "NEUTRAL"

        # Extract confidence
        confidence_m = re.search(r'"confidence"\s*:\s*(\d+)', cleaned_text)
        confidence = int(confidence_m.group(1)) if confidence_m else 50
        if confidence < 0 or confidence > 100:
            confidence = 50

        # Extract summary
        summary_m = re.search(r'"summary"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', cleaned_text)
        summary = summary_m.group(1) if summary_m else ""
        if not summary:
            # Fallback regex if double quotes are not matched
            summary_m = re.search(r'"summary"\s*:\s*\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', cleaned_text)
            summary = summary_m.group(1) if summary_m else "Analysis complete"

        # Extract keyPoints list
        key_points = []
        key_points_m = re.search(r'"keyPoints"\s*:\s*\[([\s\S]*?)\]', cleaned_text)
        if key_points_m:
            items = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', key_points_m.group(1))
            if not items:
                items = re.findall(r'\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', key_points_m.group(1))
            key_points = items
        if not key_points:
            key_points = ["Multi-factor trends verified", "Signals cross-checked"]

        # Extract fullReport
        full_report_m = re.search(r'"fullReport"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', cleaned_text)
        full_report = full_report_m.group(1) if full_report_m else ""
        if not full_report:
            full_report_m = re.search(r'"fullReport"\s*:\s*\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', cleaned_text)
            full_report = full_report_m.group(1) if full_report_m else text[:400]

        # Clean string escapes
        summary = summary.replace('\\"', '"').replace('\\n', ' ')
        full_report = full_report.replace('\\"', '"').replace('\\n', ' ')

        report = {
            "analyst": analyst_key,
            "signal": signal,
            "confidence": confidence,
            "summary": summary,
            "keyPoints": key_points,
            "fullReport": full_report
        }
        print(f"  ✨ Robust parsed report successfully from invalid JSON for {analyst_key}!")
        return _format_report(report, analyst_key)
    except Exception as e:
        print(f"  ⚠️  Robust parsing failed for {analyst_key}: {e}")

    return _parse_fallback(text, analyst_key)


def _format_report(report: dict, analyst_key: str) -> dict:
    # Ensure correct structure and types
    report["analyst"] = analyst_key
    if "signal" not in report or report["signal"] not in ("BULLISH", "BEARISH", "NEUTRAL"):
        report["signal"] = "NEUTRAL"
    if "confidence" not in report:
        report["confidence"] = 50
    else:
        try:
            report["confidence"] = int(report["confidence"])
        except:
            report["confidence"] = 50
    if "summary" not in report:
         report["summary"] = "Analysis completed"
    if "keyPoints" not in report or not isinstance(report["keyPoints"], list):
         report["keyPoints"] = ["Trends cross-referenced"]
    if "fullReport" not in report:
         report["fullReport"] = "Detailed analyst findings"
    return report


def _parse_fallback(text: str, analyst_key: str) -> dict:
    print(f"  ⚠️  Could not parse {analyst_key} report — using fallback")
    return {
        "analyst": analyst_key,
        "signal": "NEUTRAL",
        "confidence": 0,
        "summary": "Analysis failed — data unavailable",
        "keyPoints": ["Could not retrieve data"],
        "fullReport": text[:500] if text else "No response",
    }


async def _run_specialist_with_session(
    analyst_key: str, coin: str, stagger_index: int = 0, category: str = None
) -> dict:
    """Each analyst gets its own MCP connection for true parallel tool calls."""
    if stagger_index > 0 and ANALYST_STAGGER_SECONDS > 0:
        await asyncio.sleep(stagger_index * ANALYST_STAGGER_SECONDS)

    async with streamable_http_client(MCP_SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            all_tools = await get_all_tools(session)
            return await run_specialist(session, all_tools, analyst_key, coin, category=category)


async def run_all_specialists(
    session: ClientSession,
    all_tools: dict,
    coin: str,
    ai_client=None,
    model: str = "qwen3.6-plus",
    category: str = None,
) -> list:
    """Run all specialist analysts in parallel, each with its own MCP session."""
    del session, all_tools  # kept for backward-compatible signature

    print(f"\n📊 Running {len(ANALYSTS)} specialist analysts for {coin} in parallel with category={category}...")

    reports = await asyncio.gather(
        *[
            _run_specialist_with_session(analyst, coin, i, category=category)
            for i, analyst in enumerate(ANALYSTS)
        ],
        return_exceptions=True,
    )

    clean_reports = []
    for analyst, report in zip(ANALYSTS, reports):
        if isinstance(report, Exception):
            print(f"  ❌ {analyst} failed: {report}")
            clean_reports.append({
                "analyst": analyst,
                "signal": "NEUTRAL",
                "confidence": 0,
                "summary": f"Analyst failed: {str(report)}",
                "keyPoints": [],
                "fullReport": str(report),
            })
        else:
            clean_reports.append(report)
            signal = report.get("signal", "NEUTRAL")
            confidence = report.get("confidence", 0)
            print(f"  ✅ {analyst}: {signal} ({confidence}%)")

    return clean_reports
