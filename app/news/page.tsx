import * as React from 'react'
import Link from 'next/link'
import { getEducationNews } from '@/app/actions/news-feed'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'
import { Search, Clock, ArrowRight } from 'lucide-react'

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  } catch {
    return 'Recent';
  }
}

export const dynamic = 'force-dynamic';

export default async function NewsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  
  const { articles, success } = await getEducationNews(query);

  // Safely slice the articles for the new balanced layout
  const featuredArticle = articles?.[0];
  const sidebarArticles = articles?.slice(1, 4) || []; // Only take 3 for the right column
  const gridArticles = articles?.slice(4) || []; // The rest go into the bottom grid

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
      <DashboardNavbar userEmail="Operator" />

      {/* EDITORIAL LAYOUT */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-12">
        
        {/* SLEEK HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 border-zinc-100 dark:border-zinc-800/80 pb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-tight">
              Global Education News
            </h1>
            <p className="text-zinc-500 font-medium mt-2">
              Latest trends in university programs, engineering, and tech education.
            </p>
          </div>

          <form action="/news" method="GET" className="relative w-full md:w-80 group shrink-0">
            <Search size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search news..." 
              className="w-full pl-11 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-2 border-transparent focus:border-blue-600 dark:focus:border-blue-500 rounded-xl transition-all text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-500 outline-none"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {!success || !featuredArticle ? (
          <div className="text-center py-20">
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">No articles found</h3>
            <p className="text-zinc-500 mt-2 font-medium">Try adjusting your search parameters.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-16">
            
            {/* TOP SECTION: Featured (Left) + 3 Trending (Right) */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* LEFT: HERO FEATURED ARTICLE */}
              <div className="lg:w-[65%] flex flex-col">
                <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-2 mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Top Story</h2>
                </div>
                
                <Link 
                  href={`/news/article?data=${encodeURIComponent(JSON.stringify(featuredArticle))}`}
                  className="group block space-y-6"
                >
                  <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featuredArticle.urlToImage} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
                      <span>{featuredArticle.source?.name}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-zinc-500 flex items-center gap-1.5"><Clock size={14}/> {formatDate(featuredArticle.publishedAt)}</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-[1.15] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed line-clamp-3">
                      {featuredArticle.description}
                    </p>
                  </div>
                </Link>
              </div>

              {/* RIGHT: 3 TRENDING ARTICLES */}
              <div className="lg:w-[35%] flex flex-col">
                <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-2 mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Trending</h2>
                </div>
                
                <div className="flex flex-col h-full justify-between">
                  {sidebarArticles.map((article: any, index: number) => (
                    <Link 
                      key={index}
                      href={`/news/article?data=${encodeURIComponent(JSON.stringify(article))}`}
                      className="group py-6 border-b border-zinc-200 dark:border-zinc-800 last:border-0 flex gap-5 items-start justify-between"
                    >
                      <div className="flex-1 space-y-2 pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
                          {article.source?.name}
                        </span>
                        <h4 className="text-[17px] font-bold text-zinc-900 dark:text-white leading-snug tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                          {article.title}
                        </h4>
                        <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                          <Clock size={14} /> {formatDate(article.publishedAt)}
                        </p>
                      </div>
                      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: RESPONSIVE GRID FOR REMAINING ARTICLES */}
            {gridArticles.length > 0 && (
              <div className="pt-10 border-t-2 border-zinc-200 dark:border-zinc-800">
                <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-2 mb-8 inline-block">
                  <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-900 dark:text-white">More Updates</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {gridArticles.map((article: any, index: number) => (
                    <Link 
                      key={index}
                      href={`/news/article?data=${encodeURIComponent(JSON.stringify(article))}`}
                      className="group flex flex-col space-y-4"
                    >
                      <div className="w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 rounded-[1.25rem] overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col flex-1 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
                          {article.source?.name}
                        </span>
                        <h4 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[15px] font-medium line-clamp-2 leading-relaxed">
                          {article.description}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-bold">
                           <span className="flex items-center gap-1.5 text-zinc-400">
                             <Clock size={14} /> {formatDate(article.publishedAt)}
                           </span>
                           <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                             Read <ArrowRight size={14} />
                           </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}