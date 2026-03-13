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

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all flex items-center justify-center"
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

  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-sm border border-blue-100 dark:border-blue-500/20">
            <Cpu size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold tracking-tight uppercase text-xl italic text-zinc-900 dark:text-white">
            INFERA<span className="text-blue-600 dark:text-blue-500">CORE</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <Link href="/auth/login" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            
            <Link 
              href="/auth/signup"
              className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 rounded-lg px-6 py-2.5 font-semibold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-95 border border-transparent"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* MOBILE ICONS */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            className="text-zinc-900 dark:text-white p-2 -mr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100vh-60px)] bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 md:hidden flex flex-col p-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 mb-8">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold uppercase tracking-wide text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 pb-8 border-t border-zinc-100 dark:border-zinc-800 pt-8">
            <Link 
              href="/auth/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center bg-blue-600 text-white rounded-xl font-semibold uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 font-sans transition-colors duration-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="platform" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-zinc-200 dark:border-zinc-900">
        {/* Themed Background Grids & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-40 dark:opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">      
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] max-w-4xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 text-zinc-900 dark:text-white">
            ENGINEER YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">CAREER ARCHITECTURE</span>
          </h1>
          
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The cross-domain intelligence engine. Map your technical skills, analyze global market gaps, and deploy your career trajectory like production code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 font-semibold px-8 sm:px-10 h-14 rounded-xl shadow-md transition-all group tracking-wider text-xs uppercase flex items-center justify-center border border-transparent"
            >
              Start Building <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <Link 
              href="#architecture"
              className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold px-8 sm:px-10 h-14 rounded-xl transition-all group tracking-wider text-xs uppercase flex items-center justify-center shadow-sm"
            >
              <Terminal size={16} className="mr-2 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" /> View Features
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="architecture" className="py-20 lg:py-32 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
            <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-3">System Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">Built for modern engineers.</h3>
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
      <section id="live-intel" className="py-24 lg:py-32 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 relative">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header & Premium Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl shadow-sm shrink-0">
                  <Activity size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Live Intelligence</h2>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Global engineering breakthroughs and market signals synced every 60 minutes.</p>
            </div>

            {/* SaaS Segmented Control Filter */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <div className="inline-flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 min-w-max">
                {DOMAIN_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                      activeFilter.id === f.id 
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-700' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
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
              <div className="md:col-span-7 h-[400px] bg-zinc-100 dark:bg-zinc-800 rounded-3xl border border-zinc-200 dark:border-zinc-700" />
              <div className="md:col-span-5 flex flex-col gap-6">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700" />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Featured Intel */}
              <div className="lg:col-span-7 flex flex-col">
                <a href={intelData[0]?.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                  <div className="h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10 rounded-3xl group-hover:border-blue-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="bg-blue-600 text-white font-semibold px-3 py-1 text-[10px] rounded-md uppercase tracking-wider shadow-sm">
                          Top Signal
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Globe size={12} className="text-blue-600 dark:text-blue-500" /> 
                          {intelData[0] ? new URL(intelData[0].url).hostname.replace('www.', '') : 'Global Network'}
                        </span>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-[1.15] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                          {intelData[0]?.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium line-clamp-3 max-w-xl">
                          {intelData[0]?.content}
                        </p>
                      </div>

                      <div className="mt-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-white group-hover:gap-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all w-fit">
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
                    <div className="h-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl group-hover:bg-white dark:group-hover:bg-zinc-900 transition-all flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      <div className="pl-2">
                        <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                          <Globe size={12} className="text-blue-600 dark:text-blue-500" /> 
                          {new URL(item.url).hostname.replace('www.', '')}
                        </span>
                        <h4 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug line-clamp-2 transition-colors">
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
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.1]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
            Ready to deploy <br className="hidden sm:block"/> your architecture?
          </h2>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold h-16 px-12 rounded-xl text-sm uppercase tracking-wider hover:bg-zinc-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Cpu size={16} className="text-zinc-900 dark:text-zinc-50" />
            <span className="font-bold tracking-tight uppercase text-sm italic text-zinc-900 dark:text-zinc-50">
              INFRA<span className="text-blue-600 dark:text-blue-500">CORE</span>
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</Link>
          </div>
          
          <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-center md:text-right">
            © 2026 Infracore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:-rotate-6 group-hover:scale-110">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight mb-3">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  )
}