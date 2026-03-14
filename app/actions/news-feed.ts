'use server'

export async function getEducationNews(searchQuery?: string) {
  const API_KEY = process.env.NEWS_API_KEY; 
  
  if (!API_KEY) {
    throw new Error("NEWS_API_KEY is missing in your .env file.");
  }

  // =========================================================================
  // EXTREME STRICTNESS GUARDRAIL
  // These keywords act as a mandatory filter. At least ONE of these words 
  // MUST be present in the news article for it to be fetched.
  // =========================================================================
  const EDUCATION_CONSTRAINT = '(education OR university OR college OR student OR campus OR degree OR academic OR school OR curriculum)';
  
  let finalQuery = '';
  
  if (searchQuery && searchQuery.trim() !== '') {
    // If the user searches for "AI", the query becomes: 
    // ("AI") AND (education OR university OR college...)
    finalQuery = `(${searchQuery}) AND ${EDUCATION_CONSTRAINT}`;
  } else {
    // Default fallback if no search is provided
    finalQuery = '("higher education" OR "engineering college" OR "tech education" OR "university")';
  }

  const encodedQuery = encodeURIComponent(finalQuery);

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodedQuery}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error(`API failed with status: ${res.status}`);
    }

    const data = await res.json();
    
    // Final layer of defense: Ensure the article is valid, isn't tagged as [Removed], and has an image
    const validArticles = data.articles?.filter((article: any) => 
      article.title && article.title !== '[Removed]' && article.url && article.urlToImage
    ) || [];

    return { success: true, articles: validArticles };

  } catch (error: any) {
    console.error("News Fetch Error:", error);
    return { success: false, error: error.message, articles: [] };
  }
}