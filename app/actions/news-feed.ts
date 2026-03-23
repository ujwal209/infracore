'use server'

export async function getEducationNews(searchQuery?: string) {
  // Grab the key from your .env file
  const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.error("NewsAPI Key is missing!");
    return { success: false, error: "Missing API Key", articles: [] };
  }

  // Default to education news if no specific query is clicked
  const activeQuery = (searchQuery && searchQuery.trim() !== '') 
    ? searchQuery 
    : 'education technology OR edtech OR university';

  try {
    const encodedQuery = encodeURIComponent(activeQuery);
    // NewsAPI 'everything' endpoint sorted by newest
    const url = `https://newsapi.org/v2/everything?q=${encodedQuery}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;

    const res = await fetch(url, {
      method: "GET",
      cache: 'no-store' // Keep the feed fresh
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`NewsAPI failed: ${errorData.message || res.status}`);
    }

    const data = await res.json();
    
    // Clean up the data and filter out '[Removed]' articles which NewsAPI sometimes sends
    const validArticles = (data.articles || [])
      .filter((article: any) => article.title && article.title !== '[Removed]')
      .map((article: any) => ({
        title: article.title,
        description: article.description || 'No description available.',
        content: article.content || '',
        url: article.url || '#',
        urlToImage: article.urlToImage || null,
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: { name: article.source?.name || 'News Source' },
        author: article.author || null,
      }));

    return { success: true, articles: validArticles };

  } catch (error: any) {
    console.error("News Fetch Error:", error);
    return { success: false, error: error.message, articles: [] };
  }
}