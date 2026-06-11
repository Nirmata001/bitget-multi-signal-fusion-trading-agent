import asyncio
import json
import re
import time
from mcp import ClientSession
from agent.mcp_client import filter_tools_for_analyst, tools_to_openai_format, call_mcp_tool
from agent.prompts import ANALYST_PROMPTS
from agent.qwen_client import call_qwen_with_retry

MAX_ITERATIONS = 8

async def run_specialist(
    session: ClientSession,
    all_tools: dict,
    analyst_key: str,
    coin: str,
    ai_client = None,
    model: str = "qwen3.6-plus"
) -> dict:
    """Run a single specialist analyst agent and return its structured report"""

    print(f"  🔍 {analyst_key.upper()} analyst starting for {coin}...")

    # Get tools for this analyst
    analyst_tools = filter_tools_for_analyst(all_tools, analyst_key)
    openai_tools = tools_to_openai_format(analyst_tools)

    # Build system prompt
    system_prompt = ANALYST_PROMPTS[analyst_key].format(coin=coin)
    user_message = f"Analyze {coin} now. Use your tools to gather data then provide your structured JSON report."

    # Conversation history with OpenAI roles/messages structure
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    # Agentic loop
    for iteration in range(MAX_ITERATIONS):
        # Only pass tools if the analyst actually has tools defined
        qwen_tools = openai_tools if openai_tools else None
        
        response_data = await call_qwen_with_retry(
            messages=messages,
            tools=qwen_tools,
            temperature=0.1
        )

        choice = response_data['choices'][0]
        message = choice['message']

        # Add assistant response to history
        messages.append(message)

        # Check for tool/function calls
        tool_calls = message.get("tool_calls")

        if not tool_calls:
            # No more tool calls — extract final JSON response
            final_text = message.get("content") or ""
            return parse_analyst_report(final_text, analyst_key, coin)

        # Execute all tool calls in parallel
        calls = []
        for tc in tool_calls:
            fn_name = tc['function']['name']
            fn_args_str = tc['function'].get('arguments', '{}')
            try:
                fn_args = json.loads(fn_args_str) if isinstance(fn_args_str, str) else fn_args_str
            except:
                fn_args = {}
            calls.append(call_mcp_tool(session, fn_name, fn_args))

        tool_results = await asyncio.gather(*calls)

        # Add tool results to conversation
        for tc, result in zip(tool_calls, tool_results):
            messages.append({
                "role": "tool",
                "tool_call_id": tc["id"],
                "name": tc["function"]["name"],
                "content": result
            })

        print(f"    ↳ [{analyst_key}] iter {iteration + 1}: called {[tc['function']['name'] for tc in tool_calls]}")

    # Max iterations reached — return what we have (content of last message)
    return parse_analyst_report(messages[-1].get("content") or "", analyst_key, coin)


def parse_analyst_report(text: str, analyst_key: str, coin: str) -> dict:
    """Parse JSON from analyst response with fallback"""
    # Try to extract JSON from response
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass

    # Fallback report if parsing fails
    print(f"  ⚠️  Could not parse {analyst_key} report — using fallback")
    return {
        "analyst": analyst_key,
        "signal": "NEUTRAL",
        "confidence": 0,
        "summary": "Analysis failed — data unavailable",
        "keyPoints": ["Could not retrieve data"],
        "fullReport": text[:500] if text else "No response"
    }


async def run_all_specialists(
    session: ClientSession,
    all_tools: dict,
    coin: str,
    ai_client = None,
    model: str = "qwen3.6-plus"
) -> list:
    """Run all 4 specialist analysts in parallel and return their reports"""
    print(f"\n📊 Running 4 specialist analysts for {coin} in parallel...")

    analysts = ["macro", "sentiment", "market_intel", "news"]

    reports = await asyncio.gather(*[
        run_specialist(session, all_tools, analyst, coin, ai_client, model)
        for analyst in analysts
    ], return_exceptions=True)

    # Handle any exceptions
    clean_reports = []
    for analyst, report in zip(analysts, reports):
        if isinstance(report, Exception):
            print(f"  ❌ {analyst} failed: {report}")
            clean_reports.append({
                "analyst": analyst,
                "signal": "NEUTRAL",
                "confidence": 0,
                "summary": f"Analyst failed: {str(report)}",
                "keyPoints": [],
                "fullReport": str(report)
            })
        else:
            clean_reports.append(report)
            signal = report.get('signal', 'NEUTRAL')
            confidence = report.get('confidence', 0)
            print(f"  ✅ {analyst}: {signal} ({confidence}%)")

    return clean_reports
