import * as React from 'react'
import Link from 'next/link'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'
import { ArrowLeft, Clock, Globe, ExternalLink, ChevronRight } from 'lucide-react'
import { getEducationNews } from '@/app/actions/news-feed' // Import the server action

function formatDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  } catch {
    return 'Recent';
  }
}

export default async function ArticleDetailPage(props: { searchParams: Promise<{ data?: string }> }) {
  const searchParams = await props.searchParams;
  const encodedData = searchParams?.data;

  if (!encodedData) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] items-center justify-center">
        <h1 className="text-2xl font-bold">Article not found.</h1>
        <Link href="/news" className="mt-4 text-blue-600 font-bold hover:underline">Return to News Feed</Link>
      </div>
    );
  }

  // 1. Decode the current article
  const article = JSON.parse(decodeURIComponent(encodedData));
  const cleanContent = article.content ? article.content.split('[+')[0].trim() : '';

  // 2. Fetch related news for the sidebar
  const { articles: allArticles } = await getEducationNews();
  
  // Filter out the current article so we don't suggest what they are already reading, and grab the top 5
  const relatedArticles = allArticles
    ?.filter((a: any) => a.title !== article.title)
    .slice(0, 5) || [];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
      <DashboardNavbar userEmail="Operator" />

      {/* Expanded to full width layout matching the main news page */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-12">
        
        <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Headlines
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: MAIN ARTICLE                  */}
          {/* ========================================== */}
          <div className="lg:w-[65%] xl:w-[70%]">
            
            <header className="space-y-6 mb-10">
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-6">
                <span className="uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-md">
                  {article.source?.name || 'Global News'}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Clock size={16} /> {formatDate(article.publishedAt)}
                </span>
                {article.author && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-zinc-600 dark:text-zinc-400">By {article.author}</span>
                  </>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[1.05]">
                {article.title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-4xl">
                {article.description}
              </p>
            </header>

            {/* MASSIVE FULL-WIDTH IMAGE */}
            {article.urlToImage && (
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] relative bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] overflow-hidden mb-12 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* EDITORIAL CONTENT */}
            <article className="relative max-w-3xl">
              
              <p className="text-lg sm:text-[21px] font-medium text-zinc-800 dark:text-zinc-200 leading-[1.8]">
                {cleanContent}
              </p>

              {/* Seamless fade out gradient over the text */}
              <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-white via-white/90 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/90 to-transparent flex items-end justify-start sm:justify-center pb-4">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-5 bg-zinc-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-zinc-900 dark:hover:text-white rounded-full font-bold tracking-widest uppercase text-sm transition-all flex items-center justify-center gap-3 shadow-2xl shadow-zinc-900/20 dark:shadow-white/10 active:scale-95"
                >
                  Read Full Story on {article.source?.name || 'Publisher'} <ExternalLink size={18} strokeWidth={2.5} />
                </a>
              </div>
              
              {/* Bottom spacer to account for the absolute fade block */}
              <div className="h-56" />

            </article>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: STICKY SIDEBAR               */}
          {/* ========================================== */}
          <aside className="lg:w-[35%] xl:w-[30%]">
            <div className="sticky top-24 bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/50 rounded-[2rem] p-6 sm:p-8">
              
              <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <Globe size={20} className="text-blue-600 dark:text-blue-500" />
                <h3 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                  More Top Stories
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {relatedArticles.length > 0 ? relatedArticles.map((relArticle: any, idx: number) => (
                  <Link 
                    key={idx}
                    href={`/news/article?data=${encodeURIComponent(JSON.stringify(relArticle))}`}
                    className="group flex gap-5 items-start border-b border-zinc-200 dark:border-zinc-800/50 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
                        {relArticle.source?.name}
                      </span>
                      <h4 className="text-[15px] sm:text-base font-bold text-zinc-900 dark:text-white leading-snug tracking-tight line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relArticle.title}
                      </h4>
                      <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                        <Clock size={12} /> {formatDate(relArticle.publishedAt)}
                      </p>
                    </div>
                    
                    {/* Sidebar Image Thumbnail */}
                    {relArticle.urlToImage && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={relArticle.urlToImage} 
                          alt={relArticle.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                        />
                      </div>
                    )}
                  </Link>
                )) : (
                  <p className="text-sm font-medium text-zinc-500">No additional stories available at the moment.</p>
                )}
              </div>

              <Link href="/news" className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between group text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                View All Intelligence <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}