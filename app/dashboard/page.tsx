import * as React from 'react'
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getDashboardData } from '@/app/actions/dashboard'
import { getIntelligenceFeed } from '@/app/actions/news'
import { DomainSelector } from '@/components/dashboard/domain-selector'
import Link from 'next/link'
import { 
  LayoutDashboard, BarChart3, ShieldCheck, 
  ChevronRight, Cpu, User, ExternalLink, 
  ShieldAlert, Zap, Calendar, Newspaper,
  Menu, X // Added missing imports for mobile menu
} from 'lucide-react'

// --- 1. SKELETON LOADER ---
function IntelFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 h-[360px] bg-slate-100/50 rounded-[2rem] border border-slate-200"></div>
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex-1 bg-slate-100/50 rounded-2xl border border-slate-200 min-h-[100px]"></div>
        <div className="flex-1 bg-slate-100/50 rounded-2xl border border-slate-200 min-h-[100px]"></div>
        <div className="flex-1 bg-slate-100/50 rounded-2xl border border-slate-200 min-h-[100px]"></div>
      </div>
    </div>
  )
}

// --- 2. ISOLATED NEWS FEED COMPONENT ---
async function IntelligenceFeed({ domain }: { domain: string }) {
  const { news: newsResults, error: newsError } = await getIntelligenceFeed(domain);

  if (newsError) {
    return (
      <div className="h-[360px] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-[2rem] border border-red-100 p-8 text-center shadow-sm">
        <ShieldAlert size={36} className="mb-4 text-red-400" />
        <span className="text-sm font-black uppercase tracking-widest text-red-600">Signal_Interrupted</span>
        <p className="text-xs text-red-500/80 font-medium mt-3 max-w-sm leading-relaxed">{newsError}</p>
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
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 hover:border-yellow-400/50 transition-all relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 group-hover:bg-yellow-400/20 transition-all duration-700 ease-out" />
            <div className="relative z-10 flex-1 flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-6 min-w-0">
                <span className="px-3 py-1.5 bg-yellow-400 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg shrink-0 shadow-sm">
                  Primary_Signal
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {featuredNews.source}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:text-yellow-400 transition-colors line-clamp-3 tracking-tight">
                {featuredNews.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium flex-1 max-w-2xl">
                {featuredNews.content}
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white bg-white/5 px-5 py-3 rounded-xl border border-white/10 group-hover:bg-white/10 w-fit mt-auto transition-all backdrop-blur-sm group-hover:gap-4">
                Decrypt Report <ExternalLink size={16} className="text-yellow-400" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Side List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {secondaryNews.map((item: any, idx: number) => (
          <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 sm:p-6 hover:bg-white hover:border-slate-300 transition-all hover:shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[100px]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300 ease-out" />
            <div className="pl-1 space-y-2.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate">
                <Newspaper size={12} className="shrink-0" />
                {item.source}
              </span>
              <h5 className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors">
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
// FIX: Next.js 15+ requires searchParams to be treated as a Promise
export default async function DashboardPage(props: { searchParams: Promise<{ domain?: string }> }) {
  // Await the searchParams object
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
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden font-sans text-slate-900 w-full selection:bg-yellow-400 selection:text-slate-900">
      
      {/* GLOBAL SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 bg-white z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail={user?.email} />
      </aside>

      {/* MOBILE DRAWER OVERLAY (Zero-JS CSS Peer Hack) */}
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <label 
        htmlFor="mobile-menu-toggle" 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 hidden peer-checked:block lg:hidden cursor-pointer transition-opacity"
        aria-label="Close menu"
      ></label>

      {/* MOBILE DRAWER */}
      <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-white shadow-2xl z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out lg:hidden flex flex-col">
        <div className="h-16 px-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <span className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <Cpu size={16} className="text-yellow-500" /> Navigation
          </span>
          <label htmlFor="mobile-menu-toggle" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </label>
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar userEmail={user?.email} />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
        
        {/* SUPERIOR HEADER */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {/* FIXED HAMBURGER ICON */}
            <label 
              htmlFor="mobile-menu-toggle"
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Menu size={24} />
            </label>
            
            <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="hidden sm:flex w-8 h-8 bg-slate-900 rounded-lg items-center justify-center text-yellow-400 shadow-sm shrink-0">
                <LayoutDashboard size={16} />
              </div>
              Control_Center
            </h2>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Network Secure</span>
            </div>
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Profile" className="w-9 h-9 rounded-xl border border-slate-200 object-cover shadow-sm shrink-0" />
             ) : (
               <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                 <User size={16} />
               </div>
             )}
          </div>
        </header>

        {/* SCROLLABLE WORKSPACE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-32">
            
            {/* Identity Ribbon */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Welcome, {profile?.full_name?.split(' ')[0] || 'Operator'}
              </h1>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                System Initialized • Semester {profile?.current_semester || 'X'}
              </p>
            </div>

            {/* ACTION BANNER */}
            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

                <div className="relative z-10 max-w-2xl min-w-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                        <Zap size={14} /> Path Initialization Ready
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                        Generate Your 2026 <br className="hidden sm:block"/> Career Roadmap
                    </h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-lg">
                        Our AI core is ready to synthesize a career trajectory tailored to your current academic standing and market demands.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Link href="/dashboard/roadmaps" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 uppercase tracking-widest text-[11px] group border border-yellow-300">
                        Initialize Path <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* INTEL FEED SECTION WITH SUSPENSE */}
            <div className="space-y-6 bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm relative z-10">
                
                {/* Header with the Domain Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 pb-6 mb-8">
                   <h3 className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 shrink-0">
                     <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100">
                       <Newspaper size={14} className="text-slate-500"/> 
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Active Paths', value: roadmapsCount, icon: BarChart3 },
                { label: 'Skills Indexed', value: profile?.skills?.length || 0, icon: Zap },
                { label: 'Grad Year', value: profile?.graduation_year, icon: Calendar },
                { label: 'Verification', value: '100%', icon: ShieldCheck, color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 sm:gap-5 hover:border-slate-300 hover:shadow-md transition-all group ${stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200' : ''}`}>
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-yellow-400'}`}>
                      <stat.icon size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                   </div>
                   <div className="min-w-0">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate mb-1 ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-slate-400'}`}>{stat.label}</p>
                      <p className={`text-xl sm:text-2xl font-black leading-none truncate ${stat.color === 'emerald' ? 'text-emerald-900' : 'text-slate-900'}`}>{stat.value || 0}</p>
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