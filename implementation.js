async function serpstat_keyword_research(params, userSettings) {
  const { keyword } = params;
  const { serpstatApiKey, database } = userSettings;

  if (!serpstatApiKey) {
    throw new Error('Please set a SerpStat API Key in the plugin settings.');
  }

  if (!keyword) {
    throw new Error('Please provide a keyword to research.');
  }

  try {
    const response = await fetch('https://api.serpstat.com/v4/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': serpstatApiKey
      },
      body: JSON.stringify({
        id: 1,
        method: 'SerpstatKeywordProcedure.getKeywordInfo',
        params: {
          query: keyword,
          se: database || 'g_us'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`SerpStat API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`SerpStat API error: ${data.error.message || 'Unknown error'}`);
    }

    // Format the response as markdown
    const result = data.result;
    let markdown = `# Keyword Research: "${keyword}"\n\n`;

    if (result) {
      markdown += `## Key Metrics\n\n`;
      markdown += `- **Search Volume**: ${result.search_volume || 'N/A'}\n`;
      markdown += `- **Competition**: ${result.competition || 'N/A'}\n`;
      markdown += `- **CPC**: $${result.cpc || 'N/A'}\n`;
      markdown += `- **Difficulty**: ${result.difficulty || 'N/A'}\n`;
      markdown += `- **Database**: ${database || 'g_us'}\n\n`;

      if (result.related_keywords && result.related_keywords.length > 0) {
        markdown += `## Related Keywords\n\n`;
        result.related_keywords.slice(0, 10).forEach((kw, index) => {
          markdown += `${index + 1}. **${kw.keyword}** - Volume: ${kw.search_volume || 'N/A'}\n`;
        });
      }
    } else {
      markdown += 'No data found for this keyword.';
    }

    return markdown;
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    throw new Error(`Keyword research failed: ${error.message}`);
  }
}