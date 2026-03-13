import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getDashboardData } from '@/app/actions/dashboard'
import { getIntelligenceFeed } from '@/app/actions/news'
import { DomainSelector } from '@/components/dashboard/domain-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  LayoutDashboard, BarChart3, ShieldCheck, 
  ChevronRight, Cpu, User, ExternalLink, 
  ShieldAlert, Zap, Calendar, Newspaper, Menu, X
} from 'lucide-react'

// --- 1. SKELETON LOADER ---
function IntelFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 h-[360px] bg-zinc-100 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800"></div>
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-h-[100px]"></div>
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-h-[100px]"></div>
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-h-[100px]"></div>
      </div>
    </div>
  )
}

// --- 2. ISOLATED NEWS FEED COMPONENT ---
async function IntelligenceFeed({ domain }: { domain: string }) {
  const { news: newsResults, error: newsError } = await getIntelligenceFeed(domain);

  if (newsError) {
    return (
      <div className="h-[360px] flex flex-col items-center justify-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-[2rem] border border-red-100 dark:border-red-500/20 p-8 text-center shadow-sm">
        <ShieldAlert size={36} className="mb-4 text-red-400 dark:text-red-500" />
        <span className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Signal Interrupted</span>
        <p className="text-xs text-red-500/80 dark:text-red-400/80 font-medium mt-3 max-w-sm leading-relaxed">{newsError}</p>
      </div>
    );
  }

  const featuredNews = newsResults?.[0];
  const secondaryNews = newsResults?.slice(1, 4) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700">
      {/* Featured Intel */}
      {featuredNews && (
        <div className="lg:col-span-8 flex flex-col">
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-10 hover:border-blue-500/50 transition-all relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-700 ease-out" />
            <div className="relative z-10 flex-1 flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6 min-w-0">
                <span className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg shrink-0 shadow-sm">
                  Primary Signal
                </span>
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider truncate flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  {featuredNews.source}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors line-clamp-3 tracking-tight">
                {featuredNews.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium flex-1 max-w-2xl">
                {featuredNews.content}
              </p>
              <div className="inline-flex items-center gap-2 text-[12px] font-medium text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 group-hover:bg-white/10 w-fit mt-auto transition-all backdrop-blur-sm group-hover:gap-3">
                Decrypt Report <ExternalLink size={16} className="text-blue-400" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Secondary Intel List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {secondaryNews.map((item: any, idx: number) => (
          <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] p-5 sm:p-6 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md dark:hover:shadow-none relative overflow-hidden flex flex-col justify-center min-h-[100px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 ease-out" />
            <div className="pl-2 space-y-2.5">
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2 truncate">
                <Newspaper size={14} className="shrink-0 text-blue-500" />
                {item.source}
              </span>
              <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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

  const activeDomain = domainParam || profile?.target_domain || 'Software Engineering';

  // Fetch Dashboard Stats
  const { roadmapsCount } = await getDashboardData(user?.id as string, activeDomain)

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex overflow-hidden font-sans text-zinc-900 dark:text-zinc-50 w-full selection:bg-blue-500/30 dark:selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* GLOBAL SIDEBAR */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30">
        <Sidebar userEmail={user?.email} />
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <label 
        htmlFor="mobile-menu-toggle" 
        className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-40 hidden peer-checked:block lg:hidden cursor-pointer transition-opacity"
        aria-label="Close menu"
      ></label>

      {/* MOBILE DRAWER */}
      <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out lg:hidden flex flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="h-16 px-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
          <span className="font-semibold text-zinc-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <Cpu size={16} className="text-blue-600 dark:text-blue-500" /> Navigation
          </span>
          <label htmlFor="mobile-menu-toggle" className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </label>
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar userEmail={user?.email} />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        
        {/* SUPERIOR HEADER */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 sm:px-6 justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <label 
              htmlFor="mobile-menu-toggle"
              className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Menu size={24} />
            </label>
            
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-3">
              <div className="hidden sm:flex w-8 h-8 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 transition-colors">
                <LayoutDashboard size={16} />
              </div>
              Control Center
            </h2>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Network Secure</span>
            </div>
            
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Profile" className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 object-cover shrink-0" />
             ) : (
               <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                 <User size={16} />
               </div>
             )}
          </div>
        </header>

        {/* SCROLLABLE WORKSPACE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-32">
            
            {/* Identity Ribbon */}
            <div className="flex flex-col space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                Welcome, {profile?.full_name?.split(' ')[0] || 'Operator'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                System Initialized • Semester {profile?.current_semester || 'X'}
              </p>
            </div>

            {/* ACTION BANNER */}
            <div className="bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[11px] font-semibold uppercase tracking-wider mb-6">
                        <Zap size={14} /> Path Initialization Ready
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4 leading-tight">
                        Generate Your 2026 <br className="hidden sm:block"/> Career Roadmap
                    </h3>
                    <p className="text-zinc-400 font-medium leading-relaxed text-sm max-w-lg">
                        Our AI core is ready to synthesize a career trajectory tailored to your current academic standing and market demands.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Link href="/dashboard/roadmaps" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors shadow-sm text-sm group">
                        Initialize Path <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* INTEL FEED SECTION */}
            <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8">
                   <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-3 shrink-0">
                     <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                       <Newspaper size={16} className="text-blue-600 dark:text-blue-500"/> 
                     </div>
                     Live Intel Feed
                   </h3>
                   <div className="w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                     <DomainSelector currentDomain={activeDomain} />
                   </div>
                </div>
                
                <Suspense key={activeDomain} fallback={<IntelFeedSkeleton />}>
                  <IntelligenceFeed domain={activeDomain} />
                </Suspense>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {[
                { label: 'Active Paths', value: roadmapsCount, icon: BarChart3 },
                { label: 'Skills Indexed', value: profile?.skills?.length || 0, icon: Zap },
                { label: 'Grad Year', value: profile?.graduation_year, icon: Calendar },
                { label: 'Verification', value: '100%', icon: ShieldCheck }
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-950 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4 sm:gap-5 transition-all group hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <stat.icon size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] sm:text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-none truncate">
                        {stat.value || 0}
                      </p>
                   </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}