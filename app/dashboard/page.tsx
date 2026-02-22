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
  ShieldAlert, Zap, Calendar, Newspaper
} from 'lucide-react'

// --- 1. SKELETON LOADER ---
function IntelFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 h-[320px] bg-slate-100 rounded-[2rem] border border-slate-200"></div>
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 min-h-[90px]"></div>
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 min-h-[90px]"></div>
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 min-h-[90px]"></div>
      </div>
    </div>
  )
}

// --- 2. ISOLATED NEWS FEED COMPONENT ---
async function IntelligenceFeed({ domain }: { domain: string }) {
  const { news: newsResults, error: newsError } = await getIntelligenceFeed(domain);

  if (newsError) {
    return (
      <div className="h-[320px] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-[2rem] border border-red-100 p-8 text-center">
        <ShieldAlert size={32} className="mb-4 text-red-400" />
        <span className="text-sm font-black uppercase tracking-widest tracking-tighter">Signal_Interrupted</span>
        <p className="text-xs text-red-400 font-medium mt-2 max-w-xs">{newsError}</p>
      </div>
    );
  }

  const featuredNews = newsResults?.[0];
  const secondaryNews = newsResults?.slice(1, 4) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700">
      {/* Featured Intel */}
      {featuredNews && (
        <div className="lg:col-span-8">
          <a href={featuredNews.url} target="_blank" rel="noopener noreferrer" className="group block h-full min-h-[320px] bg-slate-900 border border-slate-800 rounded-[2rem] p-8 sm:p-10 hover:border-yellow-400/50 transition-all relative overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-bl-[10rem] pointer-events-none group-hover:bg-yellow-400/10 transition-all duration-700" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-yellow-400 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-md shrink-0">Primary_Signal</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{featuredNews.source}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4 group-hover:text-yellow-400 transition-colors line-clamp-3 uppercase tracking-tighter">
                {featuredNews.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium flex-1">{featuredNews.content}</p>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 w-fit mt-auto transition-colors">
                Decrypt Report <ExternalLink size={14} className="text-yellow-400" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Side List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {secondaryNews.map((item: any, idx: number) => (
          <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="group block flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 sm:p-6 hover:bg-white hover:border-slate-300 transition-all hover:shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[90px]">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 block truncate">{item.source}</span>
            <h5 className="text-[12px] sm:text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 uppercase tracking-tight">{item.title}</h5>
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

  // Fetch Dashboard Stats (Fast)
  const { roadmapsCount } = await getDashboardData(user?.id as string, activeDomain)

  return (
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden font-sans text-slate-900 w-full selection:bg-yellow-400 selection:text-slate-900">
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 bg-white z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail={user?.email} />
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-6 justify-between z-20 sticky top-0">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-yellow-400 shadow-sm">
              <LayoutDashboard size={16} />
            </div>
            Control_Center
          </h2>
          <div className="flex items-center gap-4">
             {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Profile" className="w-9 h-9 rounded-xl border border-slate-200 object-cover shadow-sm" />
             ) : (
               <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500"><User size={16} /></div>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 pb-24">
            
            {/* Identity Ribbon */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Welcome, {profile?.full_name?.split(' ')[0] || 'Operator'}
              </h1>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                System Initialized • Semester {profile?.current_semester || 'X'}
              </p>
            </div>

            {/* ACTION BANNER */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
                        <Zap size={14} /> Path Initialization Ready
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                        Generate Your 2026 <br/> Career Roadmap
                    </h3>
                    <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-lg">
                        Our AI core is ready to synthesize a career trajectory tailored to your current academic standing.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Link href="/dashboard/roadmaps" className="h-16 px-10 bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 uppercase tracking-widest text-[11px]">
                        Initialize Path <ChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {/* INTEL FEED SECTION WITH SUSPENSE */}
            <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative">
                
                {/* Header with the Domain Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Newspaper size={14} className="text-slate-500"/> Live Intel Feed
                   </h3>
                   <DomainSelector currentDomain={activeDomain} />
                </div>
                
                {/* Suspense forces a re-render and shows the skeleton when activeDomain changes */}
                <Suspense key={activeDomain} fallback={<IntelFeedSkeleton />}>
                  <IntelligenceFeed domain={activeDomain} />
                </Suspense>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Paths', value: roadmapsCount, icon: BarChart3 },
                { label: 'Skills Indexed', value: profile?.skills?.length || 0, icon: Zap },
                { label: 'Grad Year', value: profile?.graduation_year, icon: Calendar },
                { label: 'Verification', value: '100%', icon: ShieldCheck, color: 'emerald' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-slate-300 transition-all ${stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : ''}`}>
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      <stat.icon size={20}/>
                   </div>
                   <div className="min-w-0">
                      <p className={`text-[9px] font-black uppercase tracking-widest ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-slate-400'}`}>{stat.label}</p>
                      <p className={`text-xl font-black leading-none mt-1 ${stat.color === 'emerald' ? 'text-emerald-900' : 'text-slate-900'}`}>{stat.value || 0}</p>
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