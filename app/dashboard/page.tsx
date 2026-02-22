import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getDashboardData } from '@/app/actions/dashboard'
import { getIntelligenceFeed } from '@/app/actions/news'
import { DomainSelector } from '@/components/dashboard/domain-selector'
import { ThemeToggle } from '@/components/theme-toggle' // <--- Imported our new client component
import { 
  LayoutDashboard, BarChart3, ShieldCheck, 
  ChevronRight, Cpu, User, ExternalLink, 
  ShieldAlert, Zap, Calendar, Newspaper, Menu, X
} from 'lucide-react'

// --- 1. SKELETON LOADER ---
function IntelFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 h-[360px] bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700/50"></div>
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 min-h-[100px]"></div>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 min-h-[100px]"></div>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 min-h-[100px]"></div>
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
        <span className="text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400">Signal_Interrupted</span>
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
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-[#01005A] dark:bg-slate-900 border border-[#01005A] dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 hover:border-[#6B8AFF]/50 transition-all relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#6B8AFF]/10 dark:bg-[#6B8AFF]/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 group-hover:bg-[#6B8AFF]/20 transition-all duration-700 ease-out" />
            <div className="relative z-10 flex-1 flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6 min-w-0">
                <span className="px-3 py-1.5 bg-[#6B8AFF] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shrink-0 shadow-sm shadow-[#6B8AFF]/20">
                  Primary_Signal
                </span>
                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-400 uppercase tracking-widest truncate flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  {featuredNews.source}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#6B8AFF] dark:group-hover:text-[#8B98FF] transition-colors line-clamp-3 tracking-tight">
                {featuredNews.title}
              </h3>
              <p className="text-slate-300 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium flex-1 max-w-2xl">
                {featuredNews.content}
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 group-hover:bg-white/10 w-fit mt-auto transition-all backdrop-blur-sm group-hover:gap-4">
                Decrypt Report <ExternalLink size={16} className="text-[#6B8AFF]" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Secondary Intel List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {secondaryNews.map((item: any, idx: number) => (
          <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-[1.5rem] p-5 sm:p-6 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg dark:hover:shadow-none relative overflow-hidden flex flex-col justify-center min-h-[100px]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#01005A] dark:bg-[#6B8AFF] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 ease-out" />
            <div className="pl-1 space-y-2.5">
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate">
                <Newspaper size={12} className="shrink-0 text-[#6B8AFF]" />
                {item.source}
              </span>
              <h5 className="text-[13px] font-bold text-slate-900 dark:text-slate-200 leading-snug line-clamp-2 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors">
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

  // 1. URL Param wins. 2. Profile wins. 3. Fallback wins.
  const activeDomain = domainParam || profile?.target_domain || 'Software Engineering';

  // Fetch Dashboard Stats
  const { roadmapsCount } = await getDashboardData(user?.id as string, activeDomain)

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans text-slate-900 dark:text-slate-50 w-full selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white transition-colors duration-300">
      
      {/* GLOBAL SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail={user?.email} />
      </aside>

      {/* MOBILE DRAWER OVERLAY (Zero-JS CSS Peer Hack) */}
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <label 
        htmlFor="mobile-menu-toggle" 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 hidden peer-checked:block lg:hidden cursor-pointer transition-opacity"
        aria-label="Close menu"
      ></label>

      {/* MOBILE DRAWER */}
      <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out lg:hidden flex flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
            <Cpu size={16} className="text-[#01005A] dark:text-[#6B8AFF]" /> Navigation
          </span>
          <label htmlFor="mobile-menu-toggle" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </label>
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar userEmail={user?.email} />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        
        {/* SUPERIOR HEADER */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {/* FIXED HAMBURGER ICON */}
            <label 
              htmlFor="mobile-menu-toggle"
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Menu size={24} />
            </label>
            
            <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-3">
              <div className="hidden sm:flex w-8 h-8 bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 border border-[#01005A]/10 dark:border-[#6B8AFF]/20 rounded-lg items-center justify-center text-[#01005A] dark:text-[#6B8AFF] shadow-sm shrink-0 transition-colors">
                <LayoutDashboard size={16} />
              </div>
              Control_Center
            </h2>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Network Secure</span>
            </div>
            
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Profile" className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 object-cover shadow-sm shrink-0" />
             ) : (
               <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
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
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                Welcome, {profile?.full_name?.split(' ')[0] || 'Operator'}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                System Initialized • Semester {profile?.current_semester || 'X'}
              </p>
            </div>

            {/* ACTION BANNER */}
            <div className="bg-[#01005A] dark:bg-slate-900 border border-[#01005A] dark:border-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-[0_10px_40px_rgba(1,0,90,0.15)] dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B8AFF]/20 dark:bg-[#6B8AFF]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

                <div className="relative z-10 max-w-2xl min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#6B8AFF]/20 dark:bg-[#6B8AFF]/10 border border-[#6B8AFF]/30 dark:border-[#6B8AFF]/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm backdrop-blur-md">
                        <Zap size={14} className="text-[#6B8AFF]" /> Path Initialization Ready
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                        Generate Your 2026 <br className="hidden sm:block"/> Career Roadmap
                    </h3>
                    <p className="text-[#8B98FF] dark:text-slate-400 font-medium leading-relaxed text-sm max-w-lg">
                        Our AI core is ready to synthesize a career trajectory tailored to your current academic standing and market demands.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Link href="/dashboard/roadmaps" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 bg-white dark:bg-[#6B8AFF] text-[#01005A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#5274FF] rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[11px] group border border-transparent dark:border-[#6B8AFF]/50">
                        Initialize Path <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* INTEL FEED SECTION WITH SUSPENSE */}
            <div className="space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                
                {/* Header with the Domain Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
                   <h3 className="text-[11px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 shrink-0">
                     <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
                       <Newspaper size={14} className="text-[#01005A] dark:text-[#6B8AFF]"/> 
                     </div>
                     Live Intel Feed
                   </h3>
                   <div className="w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0">
                     <DomainSelector currentDomain={activeDomain} />
                   </div>
                </div>
                
                {/* Suspense forces a re-render and shows the skeleton when activeDomain changes */}
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
                { label: 'Verification', value: '100%', icon: ShieldCheck, color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-2xl border shadow-sm flex items-center gap-4 sm:gap-5 transition-all group ${
                  stat.color === 'emerald' 
                    ? 'border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-500/40' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#01005A]/30 dark:hover:border-[#6B8AFF]/50 hover:shadow-md dark:hover:shadow-[#6B8AFF]/5'
                }`}>
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                     stat.color === 'emerald' 
                       ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                       : 'bg-slate-50 dark:bg-slate-800 text-[#01005A] dark:text-[#6B8AFF] border border-slate-100 dark:border-slate-700 group-hover:bg-[#01005A] dark:group-hover:bg-[#6B8AFF] group-hover:text-white'
                   }`}>
                      <stat.icon size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                   </div>
                   <div className="min-w-0">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate mb-1 ${
                        stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400'
                      }`}>{stat.label}</p>
                      <p className={`text-xl sm:text-2xl font-black leading-none truncate ${
                        stat.color === 'emerald' ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}>{stat.value || 0}</p>
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