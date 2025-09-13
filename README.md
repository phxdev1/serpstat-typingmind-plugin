# SerpStat SEO Data Plugin for TypingMind

A comprehensive SEO data plugin that integrates SerpStat's powerful API with TypingMind, providing access to keyword research, competitor analysis, backlink data, and SERP analysis capabilities.

## Features

🔍 **Keyword Research** - Get search volume, competition data, CPC, and related keywords
📊 **Competitor Analysis** - Analyze competitors' organic and paid search performance
🔗 **Backlink Analysis** - Discover backlink profiles and referring domains
📈 **SERP Analysis** - Analyze search engine results pages for specific keywords

## Prerequisites

- TypingMind account
- SerpStat API key (Team subscription or higher required)

## Installation

1. Get your SerpStat API key:
   - Sign up at [SerpStat](https://serpstat.com/)
   - Navigate to [Profile > API](https://serpstat.com/users/profile/api/)
   - Generate your API key

2. Install the plugin in TypingMind:
   - Copy the `plugin.json` content
   - Go to TypingMind Settings > Plugins
   - Click "Add Plugin" and paste the JSON
   - Configure your API key in the plugin settings

## Configuration

### Required Settings

- **SerpStat API Key**: Your personal API token from SerpStat

### Optional Settings

- **Default Database**: Choose your preferred search engine database (default: Google US)
- **Maximum Results**: Set the default number of results to return (1-1000, default: 100)

### Available Databases

- `g_us` - Google US
- `g_uk` - Google UK
- `g_ca` - Google Canada
- `g_au` - Google Australia
- `g_de` - Google Germany
- `g_fr` - Google France
- `g_es` - Google Spain
- `g_it` - Google Italy
- `g_br` - Google Brazil
- `g_mx` - Google Mexico

## Usage Examples

### Keyword Research

```
Research the keyword "digital marketing" and show me search volume, competition, and related data
```

```
Find keyword data for "SEO tools" in the UK market with top 50 results
```

### Competitor Analysis

```
Analyze the SEO performance of competitor.com including their organic and paid search data
```

```
Show me organic search performance for example.com in the German market
```

### Backlink Analysis

```
Get backlink data for mysite.com and show the top referring domains
```

```
Analyze the backlink profile for competitor.com with 200 recent backlinks
```

### SERP Analysis

```
Analyze the search results for "best CRM software" and show me the top ranking pages
```

```
Show me SERP analysis for "digital marketing agency" in the Canadian market
```

## Function Reference

### keyword_research

Get comprehensive keyword data including search volume, competition, CPC, and related keywords.

**Parameters:**
- `query` (required): The keyword or phrase to research
- `database` (optional): Search engine database (uses default if not specified)
- `limit` (optional): Number of results to return (uses default if not specified)

### competitor_analysis

Analyze competitors' organic and paid search performance, top keywords, and market share.

**Parameters:**
- `domain` (required): The domain to analyze (e.g., example.com)
- `database` (optional): Search engine database (uses default if not specified)
- `analysisType` (optional): Type of analysis - "organic", "ads", or "both" (default: "both")

### backlink_analysis

Get backlink data for a domain including referring domains, anchor texts, and link quality metrics.

**Parameters:**
- `domain` (required): The domain to analyze backlinks for
- `limit` (optional): Number of backlinks to return (uses default if not specified)

### serp_analysis

Analyze search engine results pages (SERP) for specific keywords, including ranking positions and featured snippets.

**Parameters:**
- `keyword` (required): The keyword to analyze SERP results for
- `database` (optional): Search engine database (uses default if not specified)

## API Limits and Pricing

This plugin uses the SerpStat API which has usage limits based on your subscription plan:

- **Team Plan**: 2,000 API calls/month
- **Growth Plan**: 5,000 API calls/month
- **Agency Plan**: 10,000 API calls/month
- **Enterprise Plan**: Custom limits

Each function call consumes API credits based on the data requested. Monitor your usage in your SerpStat dashboard.

## Error Handling

The plugin includes comprehensive error handling for:

- Invalid API keys
- Malformed domain names
- API rate limits
- Network connectivity issues
- Invalid parameters

Error messages will guide you to resolve common issues.

## Data Privacy

- API keys are stored securely in TypingMind
- No data is cached or stored by the plugin
- All requests go directly to SerpStat's API
- Follow SerpStat's terms of service for data usage

## Support

For plugin issues:
- Check your API key configuration
- Verify your SerpStat subscription includes API access
- Ensure domain names are properly formatted (no http/https prefixes)

For SerpStat API issues:
- Visit [SerpStat Support](https://serpstat.com/knowledge-base/)
- Check [API Documentation](https://api-docs.serpstat.com/)

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please feel free to submit issues and enhancement requests.