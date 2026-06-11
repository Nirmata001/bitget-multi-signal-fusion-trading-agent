import asyncio
import json
import re
import time
from datetime import datetime, timezone
from agent.prompts import SYNTHESIS_PROMPT
from agent.qwen_client import call_qwen_with_retry


async def synthesize_reports(
    reports: list,
    coin: str,
    ai_client = None,
    model: str = "qwen3.6-plus"
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

    messages = [
        {"role": "user", "content": prompt}
    ]

    response_data = await call_qwen_with_retry(
        messages=messages,
        temperature=0.1
    )

    choice = response_data['choices'][0]
    final_text = choice['message'].get('content') or ""
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
