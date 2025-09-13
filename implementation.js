function validateAPIKey(apiKey) {
  if (!apiKey) {
    throw new Error('Please set a SerpStat API Key in the plugin settings.');
  }
}

function validateDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error('Please provide a valid domain name (e.g., example.com)');
  }
}

async function makeAPIRequest(apiKey, method, params) {
  const apiUrl = 'https://api.serpstat.com/v4/';

  const requestBody = {
    id: Date.now(),
    method: method,
    params: params
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': apiKey
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`SerpStat API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`SerpStat API error: ${data.error.message || 'Unknown error'}`);
  }

  return data.result;
}

function formatKeywordData(data) {
  if (!data || !Array.isArray(data)) {
    return 'No keyword data found.';
  }

  let markdown = '# Keyword Research Results\n\n';

  data.slice(0, 20).forEach((item, index) => {
    markdown += `## ${index + 1}. ${item.keyword || item.query || 'N/A'}\n\n`;
    markdown += `- **Search Volume**: ${item.search_volume || 'N/A'}\n`;
    markdown += `- **Competition**: ${item.competition || 'N/A'}\n`;
    markdown += `- **CPC**: $${item.cpc || 'N/A'}\n`;
    markdown += `- **Difficulty**: ${item.difficulty || 'N/A'}\n`;
    if (item.trend) {
      markdown += `- **Trend**: ${item.trend}\n`;
    }
    markdown += '\n';
  });

  return markdown;
}

function formatCompetitorData(data, domain) {
  if (!data) {
    return `No competitor data found for ${domain}.`;
  }

  let markdown = `# Competitor Analysis for ${domain}\n\n`;

  if (data.organic) {
    markdown += '## Organic Search Performance\n\n';
    markdown += `- **Total Keywords**: ${data.organic.total_keywords || 'N/A'}\n`;
    markdown += `- **Organic Traffic**: ${data.organic.traffic || 'N/A'}\n`;
    markdown += `- **Traffic Cost**: $${data.organic.traffic_cost || 'N/A'}\n`;
    markdown += `- **Visibility**: ${data.organic.visibility || 'N/A'}\n\n`;
  }

  if (data.ads) {
    markdown += '## Paid Search Performance\n\n';
    markdown += `- **Total Ads**: ${data.ads.total_ads || 'N/A'}\n`;
    markdown += `- **Ad Traffic**: ${data.ads.traffic || 'N/A'}\n`;
    markdown += `- **Ad Cost**: $${data.ads.cost || 'N/A'}\n\n`;
  }

  if (data.top_keywords && Array.isArray(data.top_keywords)) {
    markdown += '## Top Keywords\n\n';
    data.top_keywords.slice(0, 10).forEach((keyword, index) => {
      markdown += `${index + 1}. **${keyword.keyword}** - Position: ${keyword.position}, Volume: ${keyword.search_volume}\n`;
    });
  }

  return markdown;
}

function formatBacklinkData(data, domain) {
  if (!data || !Array.isArray(data)) {
    return `No backlink data found for ${domain}.`;
  }

  let markdown = `# Backlink Analysis for ${domain}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Backlinks**: ${data.length}\n\n`;

  markdown += `## Recent Backlinks\n\n`;

  data.slice(0, 15).forEach((link, index) => {
    markdown += `### ${index + 1}. ${link.from_domain || 'Unknown Domain'}\n\n`;
    markdown += `- **URL**: ${link.from_url || 'N/A'}\n`;
    markdown += `- **Anchor Text**: ${link.anchor || 'N/A'}\n`;
    markdown += `- **Domain Authority**: ${link.domain_rank || 'N/A'}\n`;
    markdown += `- **Link Type**: ${link.link_type || 'N/A'}\n`;
    if (link.first_seen) {
      markdown += `- **First Seen**: ${link.first_seen}\n`;
    }
    markdown += '\n';
  });

  return markdown;
}

function formatSERPData(data, keyword) {
  if (!data || !Array.isArray(data)) {
    return `No SERP data found for keyword: ${keyword}.`;
  }

  let markdown = `# SERP Analysis for "${keyword}"\n\n`;

  data.slice(0, 10).forEach((result, index) => {
    markdown += `## ${result.position || index + 1}. ${result.title || 'No Title'}\n\n`;
    markdown += `- **URL**: ${result.url || 'N/A'}\n`;
    markdown += `- **Domain**: ${result.domain || 'N/A'}\n`;
    if (result.description) {
      markdown += `- **Description**: ${result.description}\n`;
    }
    if (result.features && result.features.length > 0) {
      markdown += `- **SERP Features**: ${result.features.join(', ')}\n`;
    }
    markdown += '\n';
  });

  return markdown;
}

async function keyword_research(params, userSettings) {
  const { query, database, limit } = params;
  const { serpstatAPIKey, defaultDatabase, maxResults } = userSettings;

  validateAPIKey(serpstatAPIKey);

  if (!query || query.trim().length === 0) {
    throw new Error('Please provide a keyword to research.');
  }

  try {
    const apiParams = {
      query: query.trim(),
      se: database || defaultDatabase || 'g_us',
      limit: Math.min(limit || maxResults || 100, 1000)
    };

    const data = await makeAPIRequest(serpstatAPIKey, 'SerpstatKeywordProcedure.getKeywordInfo', apiParams);
    return formatKeywordData(data);
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    throw new Error(`Keyword research failed: ${error.message}`);
  }
}

async function competitor_analysis(params, userSettings) {
  const { domain, database, analysisType } = params;
  const { serpstatAPIKey, defaultDatabase } = userSettings;

  validateAPIKey(serpstatAPIKey);
  validateDomain(domain);

  try {
    const apiParams = {
      domain: domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
      se: database || defaultDatabase || 'g_us'
    };

    let data = {};

    if (analysisType === 'organic' || analysisType === 'both' || !analysisType) {
      try {
        const organicData = await makeAPIRequest(serpstatAPIKey, 'SerpstatDomainProcedure.getDomainInfo', apiParams);
        data.organic = organicData;
      } catch (error) {
        console.warn('Organic data fetch failed:', error.message);
      }
    }

    if (analysisType === 'ads' || analysisType === 'both' || !analysisType) {
      try {
        const adsData = await makeAPIRequest(serpstatAPIKey, 'SerpstatDomainProcedure.getDomainAdKeywords', apiParams);
        data.ads = adsData;
      } catch (error) {
        console.warn('Ads data fetch failed:', error.message);
      }
    }

    try {
      const keywordParams = { ...apiParams, limit: 10 };
      const topKeywords = await makeAPIRequest(serpstatAPIKey, 'SerpstatDomainProcedure.getDomainKeywords', keywordParams);
      data.top_keywords = topKeywords;
    } catch (error) {
      console.warn('Top keywords fetch failed:', error.message);
    }

    return formatCompetitorData(data, domain);
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw new Error(`Competitor analysis failed: ${error.message}`);
  }
}

async function backlink_analysis(params, userSettings) {
  const { domain, limit } = params;
  const { serpstatAPIKey, maxResults } = userSettings;

  validateAPIKey(serpstatAPIKey);
  validateDomain(domain);

  try {
    const apiParams = {
      domain: domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
      limit: Math.min(limit || maxResults || 100, 1000)
    };

    const data = await makeAPIRequest(serpstatAPIKey, 'SerpstatBacklinksProcedure.getDomainBacklinks', apiParams);
    return formatBacklinkData(data, domain);
  } catch (error) {
    console.error('Error fetching backlink data:', error);
    throw new Error(`Backlink analysis failed: ${error.message}`);
  }
}

async function serp_analysis(params, userSettings) {
  const { keyword, database } = params;
  const { serpstatAPIKey, defaultDatabase } = userSettings;

  validateAPIKey(serpstatAPIKey);

  if (!keyword || keyword.trim().length === 0) {
    throw new Error('Please provide a keyword to analyze SERP results for.');
  }

  try {
    const apiParams = {
      query: keyword.trim(),
      se: database || defaultDatabase || 'g_us'
    };

    const data = await makeAPIRequest(serpstatAPIKey, 'SerpstatSerpProcedure.getSerp', apiParams);
    return formatSERPData(data, keyword);
  } catch (error) {
    console.error('Error fetching SERP data:', error);
    throw new Error(`SERP analysis failed: ${error.message}`);
  }
}