'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { 
  Menu, X, ArrowRight, ShieldCheck, 
  Database, Network, Layers, Users, Target, Activity, 
  TerminalSquare, Code2, LineChart, Sun, Moon
} from "lucide-react"

// --- CONSTANTS ---
const NAV_LINKS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Tech News', href: '/news' },
  { label: 'Features', href: '/#features' },
  { label: 'About Us', href: '/about' }
]

const TEAM_MEMBERS = [
  { 
    name: 'K.V. Maheedhara Kashyap', 
    role: 'Founder & CEO', 
    type: 'leadership',
    desc: 'Driving the strategic vision and core architecture of the INFERACORE platform.',
    icon: <Target size={24} />
  },
  { 
    name: 'Rahul C A', 
    role: 'Co-Founder', 
    type: 'leadership',
    desc: 'Scaling platform infrastructure and leading cross-domain integration.',
    icon: <Network size={24} />
  },
  { 
    name: 'Ujwal', 
    role: 'Managing Director', 
    type: 'leadership',
    desc: 'Overseeing global operations, market expansion, and enterprise partnerships.',
    icon: <Activity size={24} />
  },
  { 
    name: 'Harsha P M', 
    role: 'Data Architect', 
    type: 'technical',
    desc: 'Designing highly scalable pipelines for real-time market data ingestion.',
    icon: <Database size={20} />
  },
  { 
    name: 'Rishi', 
    role: 'Data Architect', 
    type: 'technical',
    desc: 'Structuring complex engineering datasets into actionable career roadmaps.',
    icon: <Layers size={20} />
  },
  { 
    name: 'Pratham S', 
    role: 'Data Scientist', 
    type: 'technical',
    desc: 'Developing machine learning models to predict future industry skill demands.',
    icon: <TerminalSquare size={20} />
  },
  { 
    name: 'Karan S', 
    role: 'Data Analyst', 
    type: 'technical',
    desc: 'Transforming complex market data into precise, semester-aware learning paths.',
    icon: <LineChart size={20} />
  },
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
        ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        
        {/* BRAND LOGO */}
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

// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 font-sans transition-colors duration-300">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-zinc-50 dark:bg-[#111113] border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center flex flex-col items-center">
          <div className="mb-8 px-5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck size={16} className="text-blue-600 dark:text-blue-500" />
            <span className="font-bold uppercase tracking-widest text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400">The INFERACORE Mission</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.05] max-w-5xl text-zinc-900 dark:text-white animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            ARCHITECTING THE <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">FUTURE OF ENGINEERING</span>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed max-w-3xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            INFERACORE is the premier engineering career platform designed to bridge the gap between academic foundations and industry demands. We analyze global job markets and data to empower the next generation of builders.
          </p>
        </div>
      </section>

      {/* CORE INFO SECTION */}
      <section className="py-24 lg:py-32 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-[1.25rem] flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                <Target size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Our Objective</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                To eliminate the guesswork from career progression. We provide students and professionals with clear, real-time insights into the exact skills required to secure high-demand roles.
              </p>
            </div>
            
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-[1.25rem] flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                <Layers size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">The Infrastructure</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                Built on a foundation of advanced data architecture, INFERACORE actively analyzes millions of data points across the engineering landscape to formulate precise career roadmaps.
              </p>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-[1.25rem] flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                <Code2 size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">The Execution</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                We don't just provide data; we provide a clear guide for your career. From resume building to specific skill mapping, we turn market trends into actionable steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM PORTFOLIO SECTION */}
      <section className="py-24 lg:py-32 bg-zinc-50 dark:bg-[#111113] border-t border-zinc-200 dark:border-zinc-800/50 relative overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
            <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-[1.25rem] mb-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <Users size={32} className="text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
              The Core Team
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
              The engineering minds and data specialists building INFERACORE.
            </p>
          </div>

          {/* LEADERSHIP TIER */}
          <div className="mb-20">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4">Leadership Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEAM_MEMBERS.filter(m => m.type === 'leadership').map((member, idx) => (
                <LeadershipCard key={idx} member={member} />
              ))}
            </div>
          </div>

          {/* TECHNICAL TIER */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4">Data & Engineering Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM_MEMBERS.filter(m => m.type === 'technical').map((member, idx) => (
                <TechnicalCard key={idx} member={member} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.05]">
            Ready to launch <br className="hidden sm:block"/> your career?
          </h2>
          <div className="flex justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-white text-blue-600 font-black h-16 px-12 rounded-[1.25rem] text-[13px] uppercase tracking-widest hover:bg-zinc-50 hover:scale-105 transition-all shadow-2xl active:scale-95 gap-3"
            >
              Create Free Account <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
          </div>
          
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest text-center md:text-right">
            © 2026 INFERACORE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// --- PORTFOLIO CARD COMPONENTS ---

function LeadershipCard({ member }: { member: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 sm:p-10 flex flex-col h-full shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.02] group-hover:scale-110 transition-transform duration-500 text-blue-600">
        {React.cloneElement(member.icon, { size: 120 })}
      </div>
      
      <div className="w-16 h-16 mb-8 rounded-[1.25rem] bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
        {React.cloneElement(member.icon, { size: 28, strokeWidth: 2.5 })}
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
          {member.name}
        </h3>
        <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">
          {member.role}
        </span>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-medium leading-relaxed mt-auto border-t-2 border-zinc-100 dark:border-zinc-800 pt-6">
          {member.desc}
        </p>
      </div>
    </div>
  )
}

function TechnicalCard({ member }: { member: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 flex flex-col h-full shadow-sm hover:shadow-lg hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors shadow-sm shrink-0">
          {React.cloneElement(member.icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div>
          <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-tight mb-1">
            {member.name}
          </h3>
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            {member.role}
          </span>
        </div>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed mt-auto border-t-2 border-zinc-100 dark:border-zinc-800 pt-5">
        {member.desc}
      </p>
    </div>
  )
}