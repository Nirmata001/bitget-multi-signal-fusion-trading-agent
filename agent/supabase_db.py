import json
import os
import urllib.request
import urllib.error

def get_supabase_config():
    url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    return url, anon_key

def is_supabase_configured():
    url, anon_key = get_supabase_config()
    return bool(url and anon_key)

def save_decision_to_supabase(decision: dict) -> bool:
    url, anon_key = get_supabase_config()
    if not url or not anon_key:
        return False
    
    endpoint = f"{url.rstrip('/')}/rest/v1/decisions"
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    payload = {
        "coin": decision.get("coin"),
        "action": decision.get("action"),
        "confidence": decision.get("confidence"),
        "rationale": decision.get("rationale"),
        "committee_votes": decision.get("committeeVotes"),
        "analyst_reports": decision.get("analystReports"),
        "timestamp": decision.get("timestamp")
    }
    
    try:
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status in (200, 201, 204)
    except Exception as e:
        print(f"[Supabase Error] Failed to save decision to Supabase: {e}")
        return False

def get_decisions_from_supabase() -> list | None:
    url, anon_key = get_supabase_config()
    if not url or not anon_key:
        return None
        
    endpoint = f"{url.rstrip('/')}/rest/v1/decisions?order=timestamp.desc&limit=20"
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
    }
    
    try:
        req = urllib.request.Request(
            endpoint,
            headers=headers,
            method="GET"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                rows = json.loads(response.read().decode("utf-8"))
                decisions = []
                for row in rows:
                    decisions.append({
                        "id": row.get("id"),
                        "coin": row.get("coin"),
                        "action": row.get("action"),
                        "confidence": row.get("confidence"),
                        "rationale": row.get("rationale"),
                        "committeeVotes": row.get("committee_votes"),
                        "analystReports": row.get("analyst_reports"),
                        "timestamp": row.get("timestamp")
                    })
                return decisions
    except Exception as e:
        print(f"[Supabase Error] Failed to fetch decisions from Supabase: {e}")
        return None
