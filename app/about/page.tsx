'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { 
  Target, Network, Activity, Database, TerminalSquare, 
  LineChart, Briefcase, MapPin, ArrowRight, ShieldCheck, 
  Cpu, Users, Sparkles
} from "lucide-react"

// --- CONSTANTS ---
const TEAM_MEMBERS = [
  { 
    name: 'K.V. Maheedhara Kashyap', 
    role: 'Founder & CEO', 
    college: 'NMIT, Bangalore',
    type: 'leadership',
    desc: 'The driving force behind INFERA CORE, architecting the next-generation AI intelligence system to transform human-data interaction.',
    icon: <Target size={32} />,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 dark:bg-blue-500/10',
    gradient: 'from-blue-600 to-cyan-400'
  },
  { 
    name: 'Rahul C A', 
    role: 'Co-Founder', 
    college: 'NMIT, Bangalore',
    type: 'leadership',
    desc: 'Co-leading the platform\'s strategic direction and foundational engineering to ensure robust, scalable intelligent systems.',
    icon: <Network size={32} />,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/10',
    gradient: 'from-indigo-600 to-purple-400'
  },
  { 
    name: 'Ujwal', 
    role: 'Managing Director', 
    college: 'BMSCE, Bangalore',
    type: 'leadership',
    desc: 'Leading major development and operational advancements. His technical contributions are pivotal in shaping the architecture and execution.',
    icon: <Activity size={32} />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-400'
  },
  { 
    name: 'Harshavardhana P M', 
    role: 'Data Architect', 
    college: 'NMIT, Bangalore',
    type: 'technical',
    desc: 'Efficiently structuring approved data pipelines to build highly accurate AI agents.',
    icon: <Database size={24} />,
    hoverColor: 'group-hover:text-blue-500 group-hover:bg-blue-500/10'
  },
  { 
    name: 'Pratham S', 
    role: 'Data Scientist', 
    college: 'NMIT, Bangalore',
    type: 'technical',
    desc: 'Developing the core analytical models powering the intelligence engine.',
    icon: <TerminalSquare size={24} />,
    hoverColor: 'group-hover:text-indigo-500 group-hover:bg-indigo-500/10'
  },
  { 
    name: 'Karan Sable', 
    role: 'Data Analyst', 
    college: 'NMIT, Bangalore',
    type: 'technical',
    desc: 'Translating complex datasets into actionable insights for real-world value.',
    icon: <LineChart size={24} />,
    hoverColor: 'group-hover:text-purple-500 group-hover:bg-purple-500/10'
  },
  { 
    name: 'R Rishi', 
    role: 'Sales & Marketing', 
    college: 'NMIT, Bangalore',
    type: 'technical',
    desc: 'Driving market adoption and connecting advanced capabilities with users.',
    icon: <Briefcase size={24} />,
    hoverColor: 'group-hover:text-emerald-500 group-hover:bg-emerald-500/10'
  },
]

export default function AboutPage() {
  return (
    <>
      {/* --- FONT INJECTION --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Outfit:wght@100..900&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif !important; }
        .font-google-sans { font-family: 'Google Sans', sans-serif !important; }
      `}} />

      <div className="min-h-screen font-outfit bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 tracking-tight antialiased flex flex-col relative overflow-hidden">
        
        {/* Global Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-40 -z-20" />
        
        <Navbar />

        <main className="flex-1 relative z-10">
          
          {/* HERO SECTION */}
          <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center flex flex-col items-center">
              <div className="mb-8 px-5 py-2.5 bg-white border border-zinc-200 dark:bg-[#0c0c0e] dark:border-zinc-800 rounded-full shadow-sm flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Image src="/logo.png" width={100} height={24} alt="Inferacore" className="h-[14px] w-auto dark:invert opacity-90" />
              </div>
              
              <h1 className="font-google-sans text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter mb-8 leading-[1.05] max-w-5xl text-zinc-900 dark:text-white animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                Converting data into <br className="hidden sm:block" />
                <span className="text-blue-600 dark:text-blue-500">
                  pure intelligence.
                </span>
              </h1>
              
              <p className="font-outfit text-zinc-500 dark:text-zinc-400 text-[18px] sm:text-[21px] leading-[1.8] max-w-3xl font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                INFERA CORE was built on a single guiding principle: to engineer an ecosystem that makes advanced artificial intelligence accessible, reliable, and highly practical for real-world execution.
              </p>
            </div>
          </section>

          {/* EXUBERANT BENTO BOX STORY */}
          <section className="py-20 lg:py-28 relative z-10">
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                
                {/* The Vision Box (Large) */}
                <div className="md:col-span-8 group relative p-8 sm:p-12 rounded-[2.5rem] bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-google-sans text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">The Vision</h3>
                    <p className="text-[17px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
                      Founded and led by <strong className="text-zinc-800 dark:text-zinc-200">K. V. Maheedhara Kashyap</strong> and co-founded by <strong className="text-zinc-800 dark:text-zinc-200">Rahul C A</strong> from NMIT, INFERA CORE was architected to transform how humans interact with knowledge. We wanted a system that doesn't just chat, but actively builds, plans, and executes alongside you.
                    </p>
                  </div>
                </div>

                {/* The Execution Box (Small) */}
                <div className="md:col-span-4 group relative p-8 sm:p-10 rounded-[2.5rem] bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className="font-google-sans text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4">The Architecture</h3>
                    <p className="text-[16px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                      Operational execution is led by <strong className="text-zinc-800 dark:text-zinc-200">Ujwal</strong>, Managing Director from BMSCE. His technical contributions dictate the robust, scalable architecture of the platform.
                    </p>
                  </div>
                </div>

                {/* The Data Engine Box (Full Width) */}
                <div className="md:col-span-12 group relative p-8 sm:p-12 rounded-[2.5rem] bg-zinc-900 dark:bg-[#111113] border border-zinc-800 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden mt-2">
                   <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                     <div>
                       <h3 className="font-google-sans text-2xl sm:text-3xl font-extrabold text-white mb-4">The Intelligence Engine</h3>
                       <p className="text-[17px] text-zinc-400 font-medium leading-relaxed max-w-4xl">
                         Our analytical infrastructure is supported by an elite team from NMIT. <strong className="text-zinc-200">Pratham S</strong> (Scientist), <strong className="text-zinc-200">Karan Sable</strong> (Analyst), and <strong className="text-zinc-200">Harshavardhana P M</strong> (Architect) engineer the robust data pipelines that prevent hallucinations and guarantee accuracy. <strong className="text-zinc-200">Rishi</strong> drives our strategic market outreach.
                       </p>
                     </div>
                   </div>
                </div>

              </div>
            </div>
          </section>

          {/* TEAM PORTFOLIO SECTION */}
          <section className="py-24 lg:py-32 relative border-t border-zinc-200/50 dark:border-zinc-800/50 bg-[#fafafa] dark:bg-[#050505]">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
              
              <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
                <h2 className="font-google-sans text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-5">
                  The Minds Behind the Core
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
                  The leadership, data specialists, and architects building the future.
                </p>
              </div>

              {/* LEADERSHIP TIER */}
              <div className="mb-24">
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="font-google-sans text-[14px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Leadership</h3>
                  <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {TEAM_MEMBERS.filter(m => m.type === 'leadership').map((member, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-8 sm:p-10 flex flex-col h-full shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                      
                      <div className="relative z-10 flex-1 flex flex-col">
                        <h3 className="font-google-sans text-[24px] font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
                          {member.name}
                        </h3>
                        <span className={`inline-block font-google-sans text-[13px] font-bold uppercase tracking-wider mb-3 ${member.color}`}>
                          {member.role}
                        </span>
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-zinc-400 dark:text-zinc-500 mb-6 tracking-wide uppercase">
                          <MapPin size={14} /> {member.college}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[16px] font-medium leading-relaxed mt-auto border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
                          {member.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TECHNICAL TIER */}
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="font-google-sans text-[14px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Data & Engineering</h3>
                  <div className="h-px flex-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TEAM_MEMBERS.filter(m => m.type === 'technical').map((member, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/80 rounded-[2rem] p-6 sm:p-8 flex flex-col h-full shadow-sm hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1.5 transition-all duration-300 group relative">
                      <div className="flex flex-col gap-5 mb-5">
                        <div>
                          <h3 className="font-google-sans text-[18px] font-bold text-zinc-900 dark:text-white tracking-tight mb-1">
                            {member.name}
                          </h3>
                          <span className="font-google-sans block text-[12px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-5">
                        <MapPin size={12} /> {member.college}
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[14.5px] font-medium leading-relaxed mt-auto border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
                        {member.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* FOOTER CTA */}
          {/* Section removed per user request */}

        </main>

        <Footer />
      </div>
    </>
  )
}