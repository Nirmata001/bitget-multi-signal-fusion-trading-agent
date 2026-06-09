import asyncio
import json
import re
import time
from google import genai
from google.genai import types
from mcp import ClientSession
from agent.mcp_client import filter_tools_for_analyst, tools_to_gemini_format, call_mcp_tool
from agent.prompts import ANALYST_PROMPTS

async def call_gemini_with_retry(ai_client, model, contents, config, retries=3, delay=10):
    for attempt in range(retries):
        try:
            return ai_client.models.generate_content(
                model=model,
                contents=contents,
                config=config
            )
        except Exception as e:
            if '503' in str(e) or 'UNAVAILABLE' in str(e):
                if attempt < retries - 1:
                    print(f'    ⚠️  Gemini overloaded, retrying in {delay}s... ({attempt + 2}/{retries})')
                    await asyncio.sleep(delay)
                else:
                    raise
            else:
                raise

MAX_ITERATIONS = 8

async def run_specialist(
    session: ClientSession,
    all_tools: dict,
    analyst_key: str,
    coin: str,
    ai_client: genai.Client,
    model: str = "gemini-2.5-flash"
) -> dict:
    """Run a single specialist analyst agent and return its structured report"""

    print(f"  🔍 {analyst_key.upper()} analyst starting for {coin}...")

    # Get tools for this analyst
    analyst_tools = filter_tools_for_analyst(all_tools, analyst_key)
    gemini_tools = tools_to_gemini_format(analyst_tools)

    # Build system prompt
    system_prompt = ANALYST_PROMPTS[analyst_key].format(coin=coin)
    user_message = f"Analyze {coin} now. Use your tools to gather data then provide your structured JSON report."

    # Conversation history
    contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=user_message)])
    ]

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        tools=gemini_tools,
        temperature=0.1
    )

    # Agentic loop
    for iteration in range(MAX_ITERATIONS):
        response = await call_gemini_with_retry(
            ai_client, model=model, contents=contents, config=config
        )

        # Check for function calls
        function_calls = response.function_calls

        if not function_calls:
            # No more tool calls — extract final JSON response
            final_text = response.text or ""
            return parse_analyst_report(final_text, analyst_key, coin)

        # Add model response to history
        contents.append(response.candidates[0].content)

        # Execute all tool calls in parallel
        tool_results = await asyncio.gather(*[
            call_mcp_tool(session, fc.name, dict(fc.args))
            for fc in function_calls
        ])

        # Add tool results to conversation
        tool_parts = [
            types.Part.from_function_response(
                name=fc.name,
                response={"result": result}
            )
            for fc, result in zip(function_calls, tool_results)
        ]
        contents.append(types.Content(role="user", parts=tool_parts))

        print(f"    ↳ [{analyst_key}] iter {iteration + 1}: called {[fc.name for fc in function_calls]}")

    # Max iterations reached — return what we have
    return parse_analyst_report(response.text or "", analyst_key, coin)


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
    ai_client: genai.Client,
    model: str = "gemini-2.5-flash"
) -> list:
    """Run all 5 specialist analysts in parallel and return their reports"""
    print(f"\n📊 Running 5 specialist analysts for {coin} in parallel...")

    analysts = ["macro", "technical", "sentiment", "market_intel", "news"]

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
