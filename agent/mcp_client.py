import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

MCP_SERVER_URL = "https://datahub.noxiaohao.com/mcp"

# Tool assignments per analyst
ANALYST_TOOLS = {
    "macro": [
        "rates_yields", "macro_indicators", "global_assets",
        "cross_asset", "tradfi_news", "cn_market", "global_data"
    ],
    "technical": [
        "technical_analysis", "crypto_derivatives", "backtest"
    ],
    "sentiment": [
        "sentiment_index", "derivatives_sentiment"
    ],
    "market_intel": [
        "crypto_market", "defi_analytics", "dex_market",
        "network_status", "crypto_price"
    ],
    "news": [
        "news_feed", "social_trending", "tradfi_news"
    ]
}

async def get_all_tools(session: ClientSession) -> dict:
    """Fetch all tools from MCP server and return as dict keyed by name"""
    tools_response = await session.list_tools()
    return {tool.name: tool for tool in tools_response.tools}

def filter_tools_for_analyst(all_tools: dict, analyst: str) -> list:
    """Return only the tools assigned to a specific analyst"""
    assigned = ANALYST_TOOLS.get(analyst, [])
    return [tool for name, tool in all_tools.items() if name in assigned]

def tools_to_gemini_format(tools: list) -> list:
    """Convert MCP tool objects to Gemini function declaration format"""
    gemini_tools = []
    for tool in tools:
        gemini_tools.append({
            "function_declaration": {
                "name": tool.name,
                "description": tool.description or f"Execute {tool.name}",
                "parameters": tool.inputSchema
            }
        })
    return gemini_tools

async def call_mcp_tool(session: ClientSession, tool_name: str, arguments: dict) -> str:
    """Execute a tool call against the MCP server and return result as string"""
    try:
        result = await session.call_tool(tool_name, arguments=arguments)
        return "".join([
            content.text for content in result.content
            if hasattr(content, "text")
        ])
    except Exception as e:
        return f"Tool error: {str(e)}"
