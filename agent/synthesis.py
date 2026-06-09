import asyncio
import json
import re
import time
from datetime import datetime, timezone
from google import genai
from google.genai import types
from agent.prompts import SYNTHESIS_PROMPT


async def call_gemini_with_retry(ai_client, model, contents, config, retries=3):
    import re
    for attempt in range(retries):
        try:
            return ai_client.models.generate_content(
                model=model,
                contents=contents,
                config=config
            )
        except Exception as e:
            err_str = str(e)
            if '429' in err_str or 'RESOURCE_EXHAUSTED' in err_str:
                match = re.search(r'retry in (\d+)', err_str)
                wait = int(match.group(1)) + 5 if match else 60
                if attempt < retries - 1:
                    print(f'    ⚠️  Rate limited, waiting {wait}s... ({attempt + 2}/{retries})')
                    await asyncio.sleep(wait)
                else:
                    raise
            elif '503' in err_str or 'UNAVAILABLE' in err_str:
                if attempt < retries - 1:
                    print(f'    ⚠️  Gemini overloaded, retrying in 10s... ({attempt + 2}/{retries})')
                    await asyncio.sleep(10)
                else:
                    raise
            else:
                raise


async def synthesize_reports(
    reports: list,
    coin: str,
    ai_client: genai.Client,
    model: str = "gemini-2.5-flash"
) -> dict:
    """Synthesize all analyst reports into a final trading decision"""

    print(f"\n🧠 Head of Advisory Board synthesizing {len(reports)} reports for {coin}...")

    # Format reports as readable text for the synthesis prompt
    reports_text = ""
    for i, report in enumerate(reports, 1):
        reports_text += f"""
ANALYST {i} — {report.get('analyst', 'Unknown')}:
Signal: {report.get('signal', 'NEUTRAL')}
Confidence: {report.get('confidence', 0)}%
Summary: {report.get('summary', '')}
Key Points: {', '.join(report.get('keyPoints', []))}
Full Report: {report.get('fullReport', '')[:500]}
---"""

    timestamp = datetime.now(timezone.utc).isoformat()
    prompt = SYNTHESIS_PROMPT.format(
        coin=coin,
        reports=reports_text,
        timestamp=timestamp
    )

    # No tools for synthesis — pure reasoning
    config = types.GenerateContentConfig(temperature=0.1)

    response = await call_gemini_with_retry(
        ai_client, model=model, contents=prompt, config=config
    )

    final_text = response.text or ""
    return parse_final_decision(final_text, coin, reports, timestamp)


def parse_final_decision(text: str, coin: str, reports: list, timestamp: str) -> dict:
    """Parse final decision JSON with fallback"""
    json_match = re.search(r'\{[\s\S]*\}', text)
    if json_match:
        try:
            decision = json.loads(json_match.group())
            decision['analystReports'] = reports
            decision['timestamp'] = timestamp
            return decision
        except json.JSONDecodeError:
            pass

    # Count votes as fallback
    votes = {"bullish": 0, "bearish": 0, "neutral": 0}
    for r in reports:
        signal = r.get('signal', 'NEUTRAL').upper()
        if signal == 'BULLISH': votes['bullish'] += 1
        elif signal == 'BEARISH': votes['bearish'] += 1
        else: votes['neutral'] += 1

    action = 'BUY' if votes['bullish'] > votes['bearish'] else 'SELL' if votes['bearish'] > votes['bullish'] else 'HOLD'

    return {
        "coin": coin,
        "action": action,
        "confidence": 50,
        "rationale": text[:500] if text else "Synthesis failed",
        "committeeVotes": votes,
        "analystReports": reports,
        "timestamp": timestamp
    }
