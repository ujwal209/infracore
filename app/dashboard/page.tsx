import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { getDashboardData } from '@/app/actions/dashboard'
import { getIntelligenceFeed } from '@/app/actions/news'
import { DomainSelector } from '@/components/dashboard/domain-selector'
import { 
  BarChart3, ShieldCheck, ChevronRight, Briefcase, 
  TrendingUp, Zap, Calendar, Newspaper, ArrowUpRight, GraduationCap, LineChart
} from 'lucide-react'

// --- 1. SKELETON LOADER (Professional Blue) ---
function IntelFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 animate-pulse">
      <div className="xl:col-span-8 h-[450px] bg-zinc-100 dark:bg-zinc-800/40 rounded-[2rem]"></div>
      <div className="xl:col-span-4 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800/40 rounded-[1.5rem] min-h-[130px]"></div>
        ))}
      </div>
    </div>
  )
}

// --- 2. CAREER INSIGHTS FEED ---
async function IntelligenceFeed({ domain }: { domain: string }) {
  const { news: newsResults, error: newsError } = await getIntelligenceFeed(domain);

  if (newsError) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 text-center">
        <TrendingUp size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-semibold">Insights currently unavailable for this domain.</p>
      </div>
    );
  }

  const featuredNews = newsResults?.[0];
  const secondaryNews = newsResults?.slice(1, 4) || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
      {featuredNews && (
        <div className="xl:col-span-8 flex flex-col">
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" 
             className="group block flex-1 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-10 hover:border-blue-600 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Featured Insight
                </span>
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {featuredNews.source}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight mb-6 group-hover:text-blue-600 transition-colors line-clamp-2">
                {featuredNews.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed line-clamp-3 mb-10 max-w-2xl">
                {featuredNews.content}
              </p>
              <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                Read Analysis <ArrowUpRight size={18} />
              </div>
            </div>
          </a>
        </div>
      )}

      <div className="xl:col-span-4 flex flex-col gap-4">
        {secondaryNews.map((item: any, idx: number) => (
          <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" 
             className="group block flex-1 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[1.75rem] p-6 hover:border-blue-600 transition-all shadow-sm hover:shadow-lg relative flex flex-col justify-center">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <LineChart size={14} /> {item.source}
              </span>
              <h5 className="text-[16px] font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h5>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// --- 3. MAIN DASHBOARD PAGE ---
export default async function DashboardPage(props: { searchParams: Promise<{ domain?: string }> }) {
  const searchParams = await props.searchParams;
  const domainParam = searchParams?.domain;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const activeDomain = domainParam || profile?.target_domain || 'Engineering';
  const { roadmapsCount } = await getDashboardData(user?.id as string, activeDomain)

  return (
    <main className="flex-1 flex flex-col h-full bg-zinc-50 dark:bg-[#09090b] pb-12 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full p-6 sm:p-10 lg:p-12 space-y-12">
        
        {/* CLEAN PROFESSIONAL HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-blue-600">{profile?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
               <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  <GraduationCap size={14} className="text-blue-600" />
                  Class of {profile?.graduation_year || '2028'}
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  <Briefcase size={14} className="text-blue-600" />
                  {activeDomain}
               </div>
            </div>
          </div>

          <div className="w-full md:w-[320px]">
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Change Focus Area</p>
             <DomainSelector currentDomain={activeDomain} />
          </div>
        </div>

        {/* HERO BANNER - Cleaned and Professional */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 space-y-4">
                <h3 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                    Strategic Career <br/> Development.
                </h3>
                <p className="text-zinc-400 text-lg max-w-md">Access your personalized learning paths and industry insights to accelerate your career trajectory.</p>
            </div>
            <div className="relative z-10 shrink-0">
                <Link href="/dashboard/roadmaps" className="h-16 px-10 bg-blue-600 text-white hover:bg-blue-500 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20">
                    View My Paths <ChevronRight size={20} />
                </Link>
            </div>
        </section>

        {/* METRICS GRID - Meaningful Labels */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Enrolled Courses', value: roadmapsCount, icon: GraduationCap, color: 'text-blue-600' },
            { label: 'Skills Mastered', value: profile?.skills?.length || 0, icon: Zap, color: 'text-zinc-900 dark:text-white' },
            { label: 'Industry Rank', value: 'Top 10%', icon: LineChart, color: 'text-blue-600' },
            { label: 'Account Status', value: 'Verified', icon: ShieldCheck, color: 'text-zinc-900 dark:text-white' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 shadow-sm group hover:border-blue-600 transition-all duration-300">
               <div className={`mb-6 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all ${stat.color}`}>
                  <stat.icon size={24} strokeWidth={2.5} />
               </div>
               <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
               <p className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{stat.value || '--'}</p>
            </div>
          ))}
        </section>

        {/* FEED SECTION - No more "Intelligence Index" */}
        <section className="space-y-8">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
               <Newspaper className="text-blue-600" />
               <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Market Trends & Career Insights</h2>
            </div>
            <Suspense key={activeDomain} fallback={<IntelFeedSkeleton />}>
              <IntelligenceFeed domain={activeDomain} />
            </Suspense>
        </section>

      </div>
    </main>
  )
}