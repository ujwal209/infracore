'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function FeaturesPage() {
  // Restructured for a 5-item bento grid with a cohesive Blue/Cyan/Indigo theme
  const features = [
    { 
      title: 'General Assistant', 
      desc: [
        'Handles diverse and complex queries',
        'Delivers structured and precise responses',
        'Assists in high-quality writing and content',
        'Enables effective problem-solving and analysis'
      ],
      colSpan: 'md:col-span-2',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20',
      glow: 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    },
    { 
      title: 'Neural Study Buddy', 
      desc: [
        'Provides personalized AI tutoring',
        'Conducts adaptive quizzes and assessments',
        'Solves complex academic queries',
        'Tracks learning progress and performance'
      ],
      colSpan: 'md:col-span-1',
      color: 'text-sky-500',
      bg: 'bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20',
      glow: 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    },
    { 
      title: 'Live Intelligence Feed', 
      desc: [
        'Delivers real-time information updates',
        'Aggregates insights across multiple sources',
        'Highlights relevant trends and developments',
        'Enables quick and informed awareness'
      ],
      colSpan: 'md:col-span-1',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
      glow: 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    },
    { 
      title: 'Community Feedback', 
      desc: [
        'Collects user insights and opinions',
        'Enables collaborative discussions and input',
        'Highlights valuable suggestions and trends',
        'Improves quality through shared feedback'
      ],
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-100 dark:border-cyan-500/20',
      glow: 'hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    }
  ]

  return (
    <>
      {/* --- FONT INJECTION --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Outfit:wght@100..900&display=swap');
        
        .font-outfit { font-family: 'Outfit', sans-serif !important; }
        .font-google-sans { font-family: 'Google Sans', sans-serif !important; }
      `}} />

      <div className="min-h-screen font-outfit bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 tracking-tight antialiased flex flex-col relative overflow-hidden">
        
        {/* Minimalist Background Setting */}
        <div className="absolute inset-0 bg-[#fafafa] dark:bg-[#050505] -z-30" />

        <Navbar />
        
        <main className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-32 relative z-10">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
            
            {/* Page Header */}
            <div className="text-center mb-16 sm:mb-24">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-bold font-google-sans uppercase tracking-[0.2em] mb-8 shadow-sm">
                Core Modules
              </div>
              <h1 className="font-google-sans text-5xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6 leading-[1.05]">
                Everything you need. <br className="hidden sm:block" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  Nothing you don't.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Infera Core is a collection of precision-built AI modules — each focused, fast, and deeply integrated into your daily workflow.
              </p>
            </div>

            {/* SaaS Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className={`group relative flex flex-col bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] p-8 sm:p-12 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-sm ${f.glow}`}
                >
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 flex flex-col items-start gap-4">
                      <div className="h-12 px-4 bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center rounded-xl shadow-sm">
                        <Image src="/logo.png" width={120} height={30} alt="Inferacore" className="h-[22px] w-auto dark:invert opacity-[0.85]" />
                      </div>
                      <h3 className="font-google-sans text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        {f.title}
                      </h3>
                    </div>
                    <ul className="text-[15px] sm:text-[16px] text-zinc-500 dark:text-zinc-400 font-medium leading-[1.8] mt-auto list-disc pl-5 space-y-2">
                      {f.desc.map((bullet, idx) => (
                        <li key={idx} className="pl-1 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Bottom Exuberant CTA */}
            {/* CTA section removed upon user request */}

          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}