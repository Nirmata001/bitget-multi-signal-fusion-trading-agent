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
from agent.prompts import ANALYST_PROMPTS
from agent.qwen_client import call_qwen_with_retry
from agent.config import (
    MAX_ITERATIONS,
    MAX_TOOLS_PER_ROUND,
    SPEED_INSTRUCTION,
    ANALYST_STAGGER_SECONDS,
)

ANALYSTS = ["macro", "sentiment", "market_intel", "news"]


async def run_specialist(
    session: ClientSession,
    all_tools: dict,
    analyst_key: str,
    coin: str,
    ai_client=None,
    model: str = "qwen3.6-plus",
) -> dict:
    """Run a single specialist analyst agent and return its structured report"""

    print(f"  🔍 {analyst_key.upper()} analyst starting for {coin}...")

    analyst_tools = filter_tools_for_analyst(all_tools, analyst_key)
    openai_tools = tools_to_openai_format(analyst_tools)

    system_prompt = ANALYST_PROMPTS[analyst_key].format(coin=coin) + SPEED_INSTRUCTION
    user_message = (
        f"Analyze {coin} now. Use at most 2 tools, then output ONLY the JSON report."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message},
    ]

    for iteration in range(MAX_ITERATIONS):
        # On the last iteration, withhold tools so the model must return JSON
        allow_tools = iteration < MAX_ITERATIONS - 1 and openai_tools
        qwen_tools = openai_tools if allow_tools else None

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
        tool_calls = tool_calls[:MAX_TOOLS_PER_ROUND]

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
    """Parse JSON from analyst response with fallback"""
    json_match = re.search(r"\{[\s\S]*\}", text)
    if json_match:
        try:
            report = json.loads(json_match.group())
            report["analyst"] = analyst_key  # Force key name for frontend matching
            return report
        except json.JSONDecodeError:
            pass

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
    analyst_key: str, coin: str, stagger_index: int = 0
) -> dict:
    """Each analyst gets its own MCP connection for true parallel tool calls."""
    if stagger_index > 0 and ANALYST_STAGGER_SECONDS > 0:
        await asyncio.sleep(stagger_index * ANALYST_STAGGER_SECONDS)

    async with streamable_http_client(MCP_SERVER_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            all_tools = await get_all_tools(session)
            return await run_specialist(session, all_tools, analyst_key, coin)


async def run_all_specialists(
    session: ClientSession,
    all_tools: dict,
    coin: str,
    ai_client=None,
    model: str = "qwen3.6-plus",
) -> list:
    """Run all specialist analysts in parallel, each with its own MCP session."""
    del session, all_tools  # kept for backward-compatible signature

    print(f"\n📊 Running {len(ANALYSTS)} specialist analysts for {coin} in parallel...")

    reports = await asyncio.gather(
        *[
            _run_specialist_with_session(analyst, coin, i)
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
