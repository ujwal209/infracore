'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { 
  ArrowRight, Activity, Network, Target, Layers, Zap, 
  ChevronRight, ShieldCheck, Cpu, Menu, X, 
  Globe, Terminal, ExternalLink, Sun, Moon
} from "lucide-react"

// --- CONSTANTS ---
const DOMAIN_FILTERS = [
  { id: 'all', label: 'All Intelligence', query: 'latest engineering breakthroughs 2026' },
  { id: 'software', label: 'Software & Cloud', query: 'system architecture AI infrastructure 2026' },
  { id: 'mechanical', label: 'Mechanical', query: 'robotics aerospace thermodynamics 2026' },
  { id: 'electrical', label: 'Electrical', query: 'semiconductors power grids 2026' },
  { id: 'civil', label: 'Structural', query: 'smart cities civil engineering 2026' }
]

const NAV_LINKS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Live Intel', href: '/#live-intel' },
  { label: 'Architecture', href: '/#architecture' },
  { label: 'About', href: '/about' }
]

// --- COMPONENTS ---

// Separate Theme Toggle Component for clean hydration management
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => setMounted(true), [])
  
  if (!mounted) return <div className="w-9 h-9" /> // Placeholder while loading

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

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
      scrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-sm border border-[#01005A]/20 dark:border-[#6B8AFF]/20">
            <Cpu size={18} className="text-[#01005A] dark:text-[#6B8AFF]" />
          </div>
          <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900 dark:text-white">
            INFERA<span className="text-[#01005A] dark:text-[#6B8AFF]">CORE</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <Link href="/auth/login" className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors">
              Sign In
            </Link>
            
            <Link 
              href="/auth/signup"
              className="bg-[#01005A] dark:bg-[#6B8AFF] text-white hover:bg-[#020080] dark:hover:bg-[#5274FF] rounded-lg px-6 py-2.5 font-bold text-xs uppercase tracking-widest transition-all shadow-[0_4px_14px_rgba(1,0,90,0.25)] dark:shadow-[0_4px_14px_rgba(107,138,255,0.25)] hover:shadow-[0_6px_20px_rgba(1,0,90,0.4)] dark:hover:shadow-[0_6px_20px_rgba(107,138,255,0.4)] active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* MOBILE ICONS */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            className="text-slate-900 dark:text-white p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100vh-60px)] bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 md:hidden flex flex-col p-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 mb-8">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 pb-8 border-t border-slate-100 dark:border-slate-800 pt-8">
            <Link 
              href="/auth/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center border border-slate-200 dark:border-slate-800 rounded-xl font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center bg-[#01005A] dark:bg-[#6B8AFF] text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#01005A]/25 dark:shadow-[#6B8AFF]/25 active:scale-95 transition-transform"
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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white font-sans transition-colors duration-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="platform" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-900">
        {/* Themed Background Grids & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-40 dark:opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#01005A]/10 dark:bg-[#6B8AFF]/15 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">      
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            ENGINEER YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01005A] to-[#2523D4] dark:from-[#6B8AFF] dark:to-[#A3C0FF]">CAREER ARCHITECTURE</span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The cross-domain intelligence engine. Map your technical skills, analyze global market gaps, and deploy your career trajectory like production code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto bg-[#01005A] dark:bg-[#6B8AFF] text-white hover:bg-[#020080] dark:hover:bg-[#5274FF] font-bold px-8 sm:px-10 h-14 rounded-xl shadow-[0_8px_30px_rgba(1,0,90,0.25)] dark:shadow-[0_8px_30px_rgba(107,138,255,0.25)] transition-all group tracking-widest text-xs uppercase flex items-center justify-center border border-[#01005A]/50 dark:border-[#6B8AFF]/50"
            >
              Start Building <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <Link 
              href="#architecture"
              className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold px-8 sm:px-10 h-14 rounded-xl transition-all group tracking-widest text-xs uppercase flex items-center justify-center shadow-sm"
            >
              <Terminal size={16} className="mr-2 text-slate-400 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors" /> View Features
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="architecture" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
            <h2 className="text-sm font-black text-[#01005A] dark:text-[#6B8AFF] uppercase tracking-widest mb-3">System Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Built for modern engineers.</h3>
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
      <section id="live-intel" className="py-24 lg:py-32 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#01005A 1px, transparent 1px), linear-gradient(90deg, #01005A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header & Premium Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-8 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#01005A]/10 dark:bg-[#6B8AFF]/10 border border-[#01005A]/20 dark:border-[#6B8AFF]/20 rounded-xl shadow-inner shrink-0">
                  <Activity size={24} className="text-[#01005A] dark:text-[#6B8AFF]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Live Intelligence</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Global engineering breakthroughs and market signals synced every 60 minutes.</p>
            </div>

            {/* SaaS Segmented Control Filter */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <div className="inline-flex bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800/80 min-w-max">
                {DOMAIN_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      activeFilter.id === f.id 
                      ? 'bg-white dark:bg-slate-800 text-[#01005A] dark:text-[#6B8AFF] shadow-sm border border-slate-200 dark:border-slate-700/50' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
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
              <div className="md:col-span-7 h-[400px] bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700" />
              <div className="md:col-span-5 flex flex-col gap-6">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Featured Intel */}
              <div className="lg:col-span-7 flex flex-col">
                <a href={intelData[0]?.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                  <div className="h-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 lg:p-10 rounded-3xl group-hover:border-[#01005A]/50 dark:group-hover:border-[#6B8AFF]/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#01005A]/5 dark:bg-[#6B8AFF]/10 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="bg-[#01005A] dark:bg-[#6B8AFF] text-white font-black px-3 py-1 text-[10px] rounded-md uppercase tracking-widest shadow-sm">
                          Top Signal
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={12} className="text-[#01005A] dark:text-[#6B8AFF]" /> 
                          {intelData[0] ? new URL(intelData[0].url).hostname.replace('www.', '') : 'Global Network'}
                        </span>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-[1.15] tracking-tight group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors line-clamp-3">
                          {intelData[0]?.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 max-w-xl">
                          {intelData[0]?.content}
                        </p>
                      </div>

                      <div className="mt-auto inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:gap-4 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-all w-fit">
                        Extract Full Report <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Secondary Intel List */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {intelData.slice(1, 4).map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                    <div className="h-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-900 transition-all flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#01005A] dark:bg-[#6B8AFF] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      <div className="pl-2">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                          <Globe size={12} className="text-[#01005A] dark:text-[#6B8AFF]" /> 
                          {new URL(item.url).hostname.replace('www.', '')}
                        </span>
                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] leading-snug line-clamp-2 transition-colors">
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
      <section className="py-24 bg-[#01005A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.1]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8 leading-tight">
            Ready to deploy <br className="hidden sm:block"/> your architecture?
          </h2>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center justify-center bg-white text-[#01005A] font-black h-16 px-12 rounded-xl text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] active:scale-95"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Cpu size={16} className="text-slate-900 dark:text-slate-50" />
            <span className="font-black tracking-tighter uppercase text-sm italic text-slate-900 dark:text-slate-50">
              INFRA<span className="text-[#01005A] dark:text-[#6B8AFF]">CORE</span>
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors">Documentation</Link>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center md:text-right">
            © 2026 Infracore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#01005A]/5 dark:hover:shadow-[#6B8AFF]/10 hover:border-[#01005A]/50 dark:hover:border-[#6B8AFF]/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-[#01005A]/5 dark:bg-[#6B8AFF]/10 border border-[#01005A]/10 dark:border-[#6B8AFF]/20 rounded-2xl flex items-center justify-center text-[#01005A] dark:text-[#6B8AFF] mb-6 group-hover:bg-[#01005A] dark:group-hover:bg-[#6B8AFF] group-hover:text-white transition-all duration-300 shadow-sm group-hover:-rotate-6 group-hover:scale-110">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  )
}