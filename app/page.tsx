'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Newspaper, ArrowRight, Activity, Network, 
  Target, Layers, Zap, Database, ChevronRight, Loader2,
  BarChart3, ShieldCheck, Cpu, Code2, Menu, X, Globe, Terminal, ExternalLink
} from "lucide-react"

// --- CONSTANTS ---
const DOMAIN_FILTERS = [
  { id: 'all', label: 'All Intelligence', query: 'latest engineering breakthroughs 2026' },
  { id: 'software', label: 'Software & Cloud', query: 'system architecture AI infrastructure 2026' },
  { id: 'mechanical', label: 'Mechanical', query: 'robotics aerospace thermodynamics 2026' },
  { id: 'electrical', label: 'Electrical', query: 'semiconductors power grids 2026' },
  { id: 'civil', label: 'Structural', query: 'smart cities civil engineering 2026' }
]

// --- COMPONENTS ---

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-slate-900 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-sm">
            <Cpu size={18} className="text-yellow-400" />
          </div>
          <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900">
            INFRA<span className="text-yellow-500">CORE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Platform', 'Live Intel', 'Architecture'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
            >
              {item}
            </Link>
          ))}
          <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          <Link href="/auth/login" className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/auth/signup"
            className="bg-slate-900 text-white hover:bg-slate-800 hover:text-yellow-400 rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-slate-900 p-2 -mr-2 hover:bg-slate-100 rounded-lg transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100vh-60px)] bg-white border-t border-slate-100 md:hidden flex flex-col p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 mb-8">
            {['Platform', 'Live Intel', 'Architecture'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-black uppercase tracking-tight text-slate-900"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 pb-8">
            <Link 
              href="/auth/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-slate-600"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center bg-slate-900 text-yellow-400 rounded-xl font-black uppercase tracking-widest shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function LandingPage() {
  const [intelData, setIntelData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeFilter, setActiveFilter] = React.useState(DOMAIN_FILTERS[0])

  React.useEffect(() => {
    const fetchIntel = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
            query: activeFilter.query,
            search_depth: "advanced",
            topic: "news",
            max_results: 5,
          })
        })
        const data = await response.json()
        setIntelData(data.results || [])
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchIntel()
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-yellow-400 selection:text-black font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        {/* Subtle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          <div className="mb-8 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-slate-600">Platform v2.0 is Live</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] max-w-4xl text-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            ENGINEER YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900">CAREER ARCHITECTURE</span>
          </h1>
          
          <p className="text-slate-500 text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The cross-domain intelligence engine. Map your technical skills, analyze global market gaps, and deploy your career trajectory like production code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 hover:text-yellow-400 font-bold px-8 sm:px-10 h-14 rounded-xl shadow-xl transition-all group tracking-widest text-xs uppercase flex items-center justify-center border border-slate-800"
            >
              Start Building <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <Link 
              href="#architecture"
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-bold px-8 sm:px-10 h-14 rounded-xl transition-all group tracking-widest text-xs uppercase flex items-center justify-center shadow-sm"
            >
              <Terminal size={16} className="mr-2 text-slate-400 group-hover:text-slate-600 transition-colors" /> View Features
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="architecture" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
            <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-3">System Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Built for modern engineers.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              title="Skill Fingerprinting" 
              icon={<Target />} 
              desc="AI-driven analysis maps your exact technical profile to identify hidden competitive advantages in the job market." 
            />
            <Feature 
              title="Market Arbitrage" 
              icon={<Activity />} 
              desc="Connect your tech stack directly to real-time industrial demand signals and discover high-premium roles." 
            />
            <Feature 
              title="Path Optimization" 
              icon={<Network />} 
              desc="Automated career roadmaps that evolve dynamically as you build, ensuring zero wasted learning hours." 
            />
          </div>
        </div>
      </section>

      {/* --- LIVE INTEL FEED --- */}
      <section id="live-intel" className="py-24 lg:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header & Premium Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-8 border-b border-slate-800 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-400 rounded-xl shadow-inner shrink-0">
                  <Activity size={24} className="text-slate-900" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Live Intelligence</h2>
              </div>
              <p className="text-slate-400 text-sm font-medium">Global engineering breakthroughs and market signals synced every 60 minutes.</p>
            </div>

            {/* SaaS Segmented Control Filter */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <div className="inline-flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 backdrop-blur-sm min-w-max">
                {DOMAIN_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      activeFilter.id === f.id 
                      ? 'bg-slate-800 text-yellow-400 shadow-md border border-slate-700/50' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Intel Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
              <div className="md:col-span-7 h-[400px] bg-slate-900 rounded-3xl border border-slate-800" />
              <div className="md:col-span-5 flex flex-col gap-6">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 bg-slate-900 rounded-2xl border border-slate-800" />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Featured Intel */}
              <div className="lg:col-span-7 flex flex-col">
                <a href={intelData[0]?.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                  <div className="h-full bg-slate-900 border border-slate-800 p-8 lg:p-10 rounded-3xl hover:border-yellow-400/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="bg-yellow-400 text-slate-900 font-black px-3 py-1 text-[10px] rounded-md uppercase tracking-widest">
                          Top Signal
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={12} className="text-slate-500" />
                          {intelData[0] ? new URL(intelData[0].url).hostname.replace('www.', '') : 'Global Network'}
                        </span>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-[1.15] tracking-tight group-hover:text-yellow-400 transition-colors line-clamp-3">
                          {intelData[0]?.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 max-w-xl">
                          {intelData[0]?.content}
                        </p>
                      </div>

                      <div className="mt-auto inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white group-hover:gap-4 transition-all w-fit">
                        Extract Full Report <ExternalLink size={16} className="text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Secondary Intel List */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {intelData.slice(1, 4).map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                    <div className="h-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      <div className="pl-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                          <Globe size={12} className="text-yellow-500" /> 
                          {new URL(item.url).hostname.replace('www.', '')}
                        </span>
                        <h4 className="text-base font-bold text-slate-200 group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 bg-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ca8a04_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-8 leading-tight">
            Ready to deploy <br className="hidden sm:block"/> your architecture?
          </h2>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center justify-center bg-slate-900 text-white hover:text-yellow-400 font-black h-16 px-12 rounded-xl text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Cpu size={16} className="text-slate-900" />
            <span className="font-black tracking-tighter uppercase text-sm italic text-slate-900">
              INFRA<span className="text-yellow-500">CORE</span>
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-right">
            © 2026 Infracore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 mb-6 group-hover:bg-slate-900 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300 shadow-sm">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  )
}