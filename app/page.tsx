'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { 
  ArrowRight, Activity, Target, Network, Zap, 
  ChevronRight, ShieldCheck, Menu, X, 
  Globe, Terminal, ExternalLink, Sun, Moon, Cpu
} from "lucide-react"

// --- CONSTANTS ---
const DOMAIN_FILTERS = [
  { id: 'all', label: 'All News', query: 'latest engineering breakthroughs 2026' },
  { id: 'software', label: 'Software & Cloud', query: 'system architecture AI infrastructure 2026' },
  { id: 'mechanical', label: 'Mechanical', query: 'robotics aerospace thermodynamics 2026' },
  { id: 'electrical', label: 'Electrical', query: 'semiconductors power grids 2026' },
  { id: 'civil', label: 'Structural', query: 'smart cities civil engineering 2026' }
]

const NAV_LINKS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Tech News', href: '/#news' },
  { label: 'Features', href: '/#features' },
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
        ? 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/50 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        
        {/* BRAND LOGO - Now significantly larger, text removed */}
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative w-36 h-10 sm:w-48 sm:h-12 group-hover:scale-105 transition-transform origin-left">
            <Image 
              src="/logo.png" 
              alt="InferaCore Logo" 
              fill 
              className="object-contain object-left dark:invert" 
              priority 
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-[13px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
          
          <div className="flex items-center gap-5">
            <ThemeToggle />
            
            <Link href="/auth/login" className="text-[13px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            
            <Link 
              href="/auth/signup"
              className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl px-6 py-3 font-bold text-[13px] uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95 border border-transparent"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* MOBILE ICONS */}
        <div className="flex items-center gap-3 md:hidden">
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
        <div className="absolute top-full left-0 w-full h-[calc(100vh-70px)] bg-white dark:bg-[#0a0a0a] border-t border-zinc-100 dark:border-zinc-800 md:hidden flex flex-col p-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 mb-8 mt-4">
            {NAV_LINKS.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 pb-8 border-t border-zinc-100 dark:border-zinc-800 pt-8">
            <Link 
              href="/auth/login" 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 text-center bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-md active:scale-95 transition-transform"
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
  const [newsData, setNewsData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeFilter, setActiveFilter] = React.useState(DOMAIN_FILTERS[0])

  React.useEffect(() => {
    const fetchNews = async () => {
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
        setNewsData(data.results || [])
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchNews()
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 font-sans transition-colors duration-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="platform" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-zinc-200 dark:border-zinc-800/50">
        
        {/* Themed Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-40 dark:opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center flex flex-col items-center">      
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tighter mb-8 leading-[1.05] max-w-5xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 text-zinc-900 dark:text-white">
            ACCELERATE YOUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">ENGINEERING CAREER</span>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            The ultimate career platform for tech students. Build your skills, analyze industry trends, and get AI-powered roadmaps to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500 font-bold px-10 h-16 rounded-[1.25rem] shadow-xl shadow-blue-500/20 transition-all group tracking-widest text-[13px] uppercase flex items-center justify-center active:scale-95"
            >
              Start Building <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} strokeWidth={2.5} />
            </Link>
            <Link 
              href="#features"
              className="w-full sm:w-auto bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold px-10 h-16 rounded-[1.25rem] transition-all group tracking-widest text-[13px] uppercase flex items-center justify-center shadow-sm active:scale-95"
            >
               View Features
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 lg:py-32 bg-zinc-50 dark:bg-[#050505]">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-sm font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-4">Core Platform</h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Everything you need to succeed.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              title="Skill Tracking" 
              icon={<Target />} 
              desc="Log your technical skills, projects, and certifications to build a comprehensive profile that stands out to recruiters." 
            />
            <Feature 
              title="Market Insights" 
              icon={<Activity />} 
              desc="Discover high-demand roles, track salary trends, and connect your skills directly to what the industry is actively hiring for." 
            />
            <Feature 
              title="Smart Roadmaps" 
              icon={<Network />} 
              desc="Get personalized, step-by-step learning paths generated by AI to guide you from beginner to job-ready professional." 
            />
          </div>
        </div>
      </section>

      {/* --- LIVE NEWS FEED --- */}
      <section id="news" className="py-24 lg:py-32 bg-white dark:bg-[#0a0a0a] border-y border-zinc-200 dark:border-zinc-800/50 relative">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          {/* Header & Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-8 border-b-2 border-zinc-100 dark:border-zinc-800/80 pb-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">Latest Tech News</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">Stay updated with global engineering breakthroughs and market trends.</p>
            </div>

            {/* Segmented Control Filter */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <div className="inline-flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 min-w-max">
                {DOMAIN_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`px-5 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                      activeFilter.id === f.id 
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-white shadow-sm' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* News Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
              <div className="lg:col-span-7 h-[450px] bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem]" />
              <div className="lg:col-span-5 flex flex-col gap-6">
                {[1, 2, 3].map(i => <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] min-h-[130px]" />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Featured News */}
              <div className="lg:col-span-7 flex flex-col">
                <a href={newsData[0]?.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                  <div className="h-full bg-zinc-50 dark:bg-[#111113] border-2 border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 rounded-[2.5rem] hover:border-blue-500 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="bg-blue-600 text-white font-bold px-4 py-1.5 text-[11px] rounded-lg uppercase tracking-widest shadow-md">
                          Featured
                        </span>
                        <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={14} className="text-blue-600 dark:text-blue-500" /> 
                          {newsData[0] ? new URL(newsData[0].url).hostname.replace('www.', '') : 'Global News'}
                        </span>
                      </div>
                      
                      <div className="mb-10">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white mb-6 leading-[1.1] tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                          {newsData[0]?.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium line-clamp-3 max-w-2xl">
                          {newsData[0]?.content}
                        </p>
                      </div>

                      <div className="mt-auto inline-flex items-center gap-3 text-[13px] font-black uppercase tracking-widest text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-6 py-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all w-fit">
                        Read Full Article <ExternalLink size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Secondary News List */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {newsData.slice(1, 4).map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex-1">
                    <div className="h-full bg-white dark:bg-[#111113] border-2 border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] hover:border-blue-500 transition-all flex flex-col justify-center relative overflow-hidden shadow-sm hover:shadow-md">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                      <div className="pl-2 space-y-3">
                        <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={14} className="text-blue-600 dark:text-blue-500" /> 
                          {new URL(item.url).hostname.replace('www.', '')}
                        </span>
                        <h4 className="text-[17px] font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug line-clamp-2 transition-colors tracking-tight">
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
      <section className="py-32 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.05]">
            Ready to launch <br className="hidden sm:block"/> your career?
          </h2>
          <div className="flex justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-white text-blue-600 font-black h-16 px-12 rounded-[1.25rem] text-[13px] uppercase tracking-widest hover:bg-zinc-50 hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white dark:bg-[#050505] border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* BRAND LOGO - Enlarged, Text Removed */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative w-32 h-8 sm:w-40 sm:h-10 group-hover:scale-105 transition-transform origin-left">
              <Image 
                src="/logo.png" 
                alt="InferaCore Logo" 
                fill 
                className="object-contain object-center md:object-left dark:invert opacity-80 group-hover:opacity-100 transition-opacity" 
              />
            </div>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</Link>
          </div>
          
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest text-center md:text-right">
            © 2026 INFERACORE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-[1.25rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:-rotate-6 group-hover:scale-110">
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  )
}