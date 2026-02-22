'use client'

import * as React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Newspaper, ArrowRight, Activity, Network, 
  Target, Layers, Zap, PenTool, Database, ChevronRight, Loader2,
  BarChart3, ShieldCheck, Cpu, Code2
} from "lucide-react"

// Filter Categories for the News Feed
const DOMAIN_FILTERS = [
  { id: 'all', label: 'All Engineering', query: 'latest breakthroughs in structural mechanical civil electrical software engineering 2026' },
  { id: 'software', label: 'Software', query: 'latest breakthroughs in software engineering system architecture AI infrastructure 2026' },
  { id: 'mechanical', label: 'Mechanical', query: 'latest breakthroughs in mechanical engineering robotics thermodynamics 2026' },
  { id: 'electrical', label: 'Electrical', query: 'latest breakthroughs in electrical engineering power grids microprocessors 2026' },
  { id: 'civil', label: 'Civil / Structural', query: 'latest breakthroughs in civil structural engineering smart cities materials 2026' }
]

export default function LandingPage() {
  const [intelData, setIntelData] = React.useState<any[]>([])
  const [isMounted, setIsMounted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeFilter, setActiveFilter] = React.useState(DOMAIN_FILTERS[0])

  // 1. HYDRATION GUARD & DYNAMIC FETCHING
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isMounted) return;

    const fetchEngineeringIntel = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_TAVILY_API_KEY || 'tvly-YOUR_KEY',
            query: activeFilter.query,
            search_depth: "advanced",
            topic: "news",
            max_results: 6,
            days: 30 
          })
        })
        const data = await response.json()
        setIntelData(data.results || [])
      } catch (error) {
        console.error("Engineering Intel Fetch Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEngineeringIntel()
  }, [activeFilter, isMounted])

  const featuredArticle = intelData?.[0]
  const secondaryArticles = intelData?.slice(1, 6) || []

  // Global Hydration Check
  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-400 selection:text-black">
      <Navbar />

      {/* --- 1. HERO SECTION: HIGH VISUAL IMPACT --- */}
      <section className="relative pt-32 lg:pt-40 overflow-hidden bg-[#FDFDFD]">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-60" />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
        
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-slate-200 text-slate-600 bg-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />
            System v1.0.4 Live
          </Badge>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 text-slate-900 leading-[0.85] uppercase max-w-5xl mx-auto">
            Engineer Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 italic pr-4">Infrastructure</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Infracore maps technical skills across major domains including Structural, Mechanical, and Software engineering to build hyper-optimized career trajectories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="bg-black text-yellow-400 hover:bg-slate-800 font-bold px-10 h-14 rounded-xl shadow-xl shadow-yellow-500/10 transition-all group">
              <Link href="/dashboard">
                INITIALIZE PROTOCOL <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl border-slate-200 font-bold hover:bg-slate-50 text-slate-700">
              VIEW ARCHITECTURE
            </Button>
          </div>
        </div>
      </section>

      {/* --- 2. INTEL FEED WITH FILTERS --- */}
      <section id="news" className="bg-slate-900 py-32 rounded-[2.5rem] mx-4 md:mx-8 mb-4 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[100px] -mt-[400px] -mr-[400px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400 rounded-lg">
                      <Activity size={20} className="text-black" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                    Live Intel Feed
                  </h2>
              </div>
              <p className="text-slate-400 font-medium text-lg">Real-time engineering sector breakthroughs filtered by domain.</p>
            </div>
            
            {/* SaaS Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {DOMAIN_FILTERS.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                            activeFilter.id === filter.id 
                            ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                <Loader2 className="text-yellow-500 animate-spin mb-4" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Core Data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {featuredArticle && (
                <div className="lg:col-span-7">
                  <a href={featuredArticle.url} target="_blank" rel="noreferrer" className="group block h-full">
                    <div className="bg-slate-800/40 border border-slate-700 p-8 md:p-12 rounded-[2rem] h-full flex flex-col hover:bg-slate-800 transition-all hover:border-yellow-400/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full pointer-events-none transition-all group-hover:bg-yellow-400/20" />
                      
                      <Badge className="w-fit mb-6 bg-yellow-400 text-black font-black text-[10px] border-none px-3 py-1">SECTOR LEAD</Badge>
                      <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-yellow-400 transition-colors tracking-tight">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                        {featuredArticle.content}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-bold text-white uppercase tracking-widest group-hover:gap-4 transition-all gap-2">
                        Read Analysis <ChevronRight size={18} className="text-yellow-400" />
                      </div>
                    </div>
                  </a>
                </div>
              )}

              <div className="lg:col-span-5 flex flex-col gap-4">
                {secondaryArticles.map((item: any, i: number) => (
                  <a key={`news-${i}`} href={item.url} target="_blank" rel="noreferrer" className="group block h-full">
                    <div className="bg-slate-800/30 border border-slate-700 p-6 rounded-[1.5rem] hover:bg-slate-800 transition-all flex flex-col justify-center h-full hover:border-yellow-400/30">
                      <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                         {new URL(item.url).hostname.replace('www.', '')}
                      </span>
                      <h4 className="font-bold text-white text-lg leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- 3. METRICS RIBBON --- */}
      <section className="border-y border-slate-200 bg-slate-50 py-12">
          <div className="container mx-auto px-6 max-w-5xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
                  <div>
                      <p className="text-3xl font-black text-slate-900">14+</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Disciplines</p>
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900">Live</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Data Sync</p>
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900">480</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Protocols</p>
                  </div>
                  <div>
                      <p className="text-3xl font-black text-slate-900">24/7</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">AI Mentor</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- 4. CORE MECHANICS (VALUE PROPS) --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 text-yellow-600 border-yellow-200 bg-yellow-50">SYSTEM ARCHITECTURE</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-6">How The Core Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">We replace generic advice with data-driven, cross-domain career pipelines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
                num="01" 
                icon={<Target />} 
                title="Skill Fingerprinting" 
                desc="Our AI identifies latent technical strengths across mechanical, electrical, and software stacks."
            />
            <FeatureCard 
                num="02" 
                icon={<Network />} 
                title="Market Arbitrage" 
                desc="We track live infrastructure projects to find high-premium technical skill gaps."
            />
            <FeatureCard 
                num="03" 
                icon={<Layers />} 
                title="Validated Growth" 
                desc="Structured modules designed to build high-fidelity expertise in complex systems."
            />
          </div>
        </div>
      </section>

      {/* --- 5. SUPPORTED DOMAINS GRID --- */}
      <section id="domains" className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">Supported Nodes</h2>
                <p className="text-slate-500 text-lg font-medium">Infracore covers the hardest domains in the industry, synthesizing cross-disciplinary knowledge.</p>
              </div>
              <Button variant="outline" className="rounded-xl border-slate-300 font-bold text-slate-700 h-12 px-6">
                  View All Specs
              </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Software Systems", icon: Database },
              { name: "Mechanical", icon: Cpu },
              { name: "Electrical Power", icon: Zap },
              { name: "Civil Structures", icon: PenTool }
            ].map((domain, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-yellow-400 hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-yellow-400 group-hover:text-black transition-colors text-slate-400">
                    <domain.icon size={28} strokeWidth={2} />
                </div>
                <h4 className="font-bold text-slate-900 tracking-tight text-sm uppercase">{domain.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. BOTTOM CTA --- */}
      <section className="py-32 bg-yellow-400 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-8 leading-[0.9]">
            Ready to upgrade your node?
          </h2>
          <p className="text-slate-900/80 text-xl font-bold mb-12">
            Join Infracore today and let AI build your professional roadmap.
          </p>
          <Button asChild size="lg" className="bg-black text-white hover:bg-slate-800 font-black px-12 h-16 text-lg rounded-xl shadow-2xl transition-transform hover:scale-105">
            <Link href="/signup">DEPLOY ACCOUNT</Link>
          </Button>
        </div>
      </section>

      {/* --- 7. FOOTER --- */}
      <footer className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
            <div className="text-3xl font-black italic tracking-tighter text-slate-200 mb-8">
                INFRA<span className="text-slate-300">CORE</span>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8">
                <Link href="#" className="hover:text-black transition-colors">Data Privacy</Link>
                <Link href="#" className="hover:text-black transition-colors">System Architecture</Link>
                <Link href="#" className="hover:text-black transition-colors">Career API</Link>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-widest uppercase">© 2026 INFRACORE ENGINEERING GROUP. GLOBAL DEPLOYMENT v1.0.4</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ num, icon, title, desc }: { num: string, icon: React.ReactNode, title: string, desc: string }) {
    return (
        <Card className="p-8 md:p-10 rounded-[2rem] border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-yellow-400 transition-all relative overflow-hidden group bg-white">
            <span className="absolute -top-4 -right-4 text-slate-50 font-black text-9xl group-hover:text-yellow-50 transition-colors pointer-events-none select-none">{num}</span>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-yellow-400 group-hover:text-black flex items-center justify-center mb-8 text-slate-400 transition-colors border border-slate-100">
                    {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 2 })}
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight leading-none">{title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{desc}</p>
            </div>
        </Card>
    )
}