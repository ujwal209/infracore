'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Target, 
  Settings2, 
} from 'lucide-react'

const AVATARS = [
  {
    title: "Neural Study Buddy",
    shortName: "Study",
    label: "Scholar",
    description: (
      <ul className="list-disc pl-5 space-y-2 mt-2 font-outfit text-zinc-500 dark:text-zinc-400">
        <li>Personalized AI tutoring</li>
        <li>Adaptive quiz generation</li>
        <li>Complex query resolution</li>
        <li>Learning progress tracking</li>
      </ul>
    ),
    useCase: "Technical Synthesis",
    href: "/dashboard/chat/study",
  },
  {
    title: "General Assistant",
    shortName: "Assistant",
    label: "Core AI",
    description: (
      <ul className="list-disc pl-5 space-y-2 mt-2 font-outfit text-zinc-500 dark:text-zinc-400">
        <li>Multi-domain query handling</li>
        <li>Advanced problem solving</li>
        <li>Intelligent content generation</li>
        <li>Structured response delivery</li>
      </ul>
    ),
    useCase: "General Intelligence",
    href: "/dashboard/chat",
  }
]

export default function HeroHighlight() {

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Outfit:wght@100..900&display=swap');
        
        .font-outfit {
          font-family: 'Outfit', sans-serif !important;
        }
        
        .font-google-sans {
          font-family: 'Google Sans', sans-serif !important;
        }
      `}} />

      <div className="font-outfit w-full min-h-screen bg-white dark:bg-[#050505] transition-colors duration-300 relative pb-24 overflow-hidden">
        
        {/* Subtle top glow to blend with navbar if needed */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[300px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24 pt-8 md:pt-12 tracking-tight px-4 sm:px-6 lg:px-8">
          
          {/* --- SECTION 1: HIGHLIGHT SHOWCASE --- */}
          <section className="relative w-full flex flex-col mt-4 md:mt-8">
            
            {/* Removed Initialize Agent Header per user request */}

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full pb-8">
              {AVATARS.map((avatar, i) => {
                return (
                  <div 
                    key={i} 
                    className="w-full h-full"
                  >
                    <Link 
                      href={avatar.href}
                      className="group relative block w-full outline-none h-full"
                    >
                      <div className={`relative flex flex-col h-full bg-white dark:bg-[#0c0c0e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden min-h-[380px] hover:-translate-y-1`}>
                        
                        {/* Subtle hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* CONTENT BLOCK */}
                        <div className="p-8 md:p-10 flex flex-col flex-1 justify-between relative z-10">
                          
                          {/* Branding Identity Row */}
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 bg-zinc-50 dark:bg-[#111] border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
                                <Image 
                                  src="/logo.png" 
                                  fill 
                                  alt="Brand Logo" 
                                  className="dark:invert object-contain p-2.5 opacity-80 group-hover:opacity-100 transition-opacity relative z-10" 
                                />
                              </div>
                              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
                              <span className="font-google-sans text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">
                                {avatar.shortName}
                              </span>
                            </div>
                            <span className="hidden sm:inline-flex items-center px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-full border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                              {avatar.label}
                            </span>
                          </div>

                          {/* Detailed Explanation Area */}
                          <div className="space-y-4 mb-12">
                            <h3 className="font-google-sans text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {avatar.title}
                            </h3>
                            <div className="text-zinc-600 dark:text-zinc-400 text-base md:text-[17px] font-medium leading-relaxed max-w-xl">
                              {avatar.description}
                            </div>
                          </div>

                          {/* Action Row */}
                          <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between relative">
                            <div className="space-y-1">
                              <p className="font-google-sans text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em]">Primary Application</p>
                              <p className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">
                                {avatar.useCase}
                              </p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
                              <ArrowRight size={22} className="group-hover:-rotate-45 transition-transform duration-300 group-hover:text-white" />
                            </div>
                          </div>

                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

          </section>

          {/* --- SECTION 2: SYSTEM MANUAL REMOVED --- */}

        </div>
      </div>
    </>
  )
}