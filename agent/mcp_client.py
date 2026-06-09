import asyncio
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
from google.genai import types

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

def clean_schema(schema: dict) -> dict:
    if not isinstance(schema, dict):
        return schema
    cleaned = {}
    for key, value in schema.items():
        if key == 'enum' and isinstance(value, list):
            filtered = [v for v in value if v != '' and v is not None]
            if filtered:
                cleaned[key] = filtered
        elif isinstance(value, dict):
            cleaned[key] = clean_schema(value)
        elif isinstance(value, list):
            cleaned[key] = [clean_schema(item) if isinstance(item, dict) else item for item in value]
        else:
            cleaned[key] = value
    return cleaned

def tools_to_gemini_format(tools: list) -> list:
    """Convert MCP tool objects to Gemini Tool objects"""
    function_declarations = []
    for tool in tools:
        # Clean the input schema
        schema = tool.inputSchema or {}
        properties = schema.get('properties', {})
        cleaned_properties = clean_schema(properties)
        required = schema.get('required', [])

        # Build parameters schema
        params = {
            'type': 'object',
            'properties': cleaned_properties,
        }
        if required:
            params['required'] = required

        function_declarations.append(
            types.FunctionDeclaration(
                name=tool.name,
                description=tool.description or f'Execute {tool.name}',
                parameters=params
            )
        )

    return [types.Tool(function_declarations=function_declarations)]

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
