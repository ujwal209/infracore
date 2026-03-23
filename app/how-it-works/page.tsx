'use client'

import * as React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Sparkles, Zap, Target, ArrowRight, Layers, MessageSquare, CheckCircle } from "lucide-react"

export default function HowItWorksPage() {
  const screens = [
    {
      number: '01',
      title: 'Initialization & Context',
      bullets: [
        'Share your academic background and goals',
        'Identify your current skills and interests',
        'Enable personalized guidance from the start'
      ],
      icon: <Sparkles size={28} className="text-blue-500" />,
      color: 'blue-500',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      number: '02',
      title: 'Agent Assignment',
      bullets: [
        'Select the right assistant for your task',
        'Switch seamlessly based on your needs',
        'Receive responses powered by real-time insights'
      ],
      icon: <Zap size={28} className="text-sky-500" />,
      color: 'sky-500',
      gradient: 'from-sky-500 to-blue-500'
    },
    {
      number: '03',
      title: 'Actionable Intelligence',
      bullets: [
        'Get clear and structured answers',
        'Access ready-to-use outputs instantly',
        'Take action with simplified guidance'
      ],
      icon: <Target size={28} className="text-cyan-500" />,
      color: 'cyan-500',
      gradient: 'from-cyan-500 to-blue-400'
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
            <div className="text-center mb-24 sm:mb-32">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-bold font-google-sans uppercase tracking-[0.2em] mb-8 shadow-sm">
                The Process
              </div>
              <h1 className="font-google-sans text-5xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-6 leading-[1.05]">
                Simple steps. <br className="md:hidden" />
                <span className="text-blue-600 dark:text-blue-500">
                  Powerful results.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                We removed all the complicated settings. Experience a frictionless, step-by-step breakdown of how you will use the platform to learn and grow.
              </p>
            </div>

            {/* Circular Path Layout */}
            
            {/* Sleek Horizontal Flowchart Layout */}
            <div className="relative max-w-6xl mx-auto mt-16 lg:mt-24">
              
              {/* Desktop Connecting dashed path (Background) */}
              <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-blue-500/20 z-0" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 relative z-10">
                {screens.map((step, idx) => (
                  <div key={idx} className="relative flex flex-col items-center lg:items-start group">
                    
                    {/* Floating Node matching the background path */}
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-blue-100 dark:border-blue-900/30 shadow-sm flex items-center justify-center mb-8 relative z-20 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-500">
                      <span className="font-google-sans text-2xl font-black text-zinc-900 dark:text-white">{step.number}</span>
                      
                      {/* Connection Dot on the line */}
                      <div className="hidden lg:block absolute top-1/2 -right-[calc(3rem)] w-4 h-4 bg-zinc-100 dark:bg-zinc-900 border-2 border-blue-500/30 rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                      <div className="hidden lg:block absolute top-1/2 -left-[calc(3rem)] w-4 h-4 bg-zinc-100 dark:bg-zinc-900 border-2 border-blue-500/30 rounded-full -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                    </div>

                    {/* Step Card */}
                    <div className="w-full bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 p-8 sm:p-10 rounded-[2.5rem] shadow-sm group-hover:shadow-xl dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden flex-1 flex flex-col">
                      
                      {/* Enormous Watermark Number */}
                      <div className="absolute -right-8 -top-8 font-google-sans text-[120px] font-black tracking-tighter select-none pointer-events-none opacity-[0.03] dark:opacity-[0.02] text-zinc-500 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.04] transition-all duration-500 transform group-hover:scale-110">
                        {step.number}
                      </div>

                      {/* Header */}
                      <div className="relative z-10 mb-6 text-center lg:text-left">
                        <span className="font-google-sans text-[12px] font-bold uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 mb-2 block">
                          Phase {step.number}
                        </span>
                        <h3 className="font-google-sans text-2xl sm:text-[26px] font-extrabold text-zinc-900 dark:text-white leading-[1.2] tracking-tight">
                          {step.title}
                        </h3>
                      </div>

                      {/* Content Bullets */}
                      <ul className="relative z-10 list-none space-y-3.5 text-[15.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mt-auto">
                        {step.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-blue-400/50" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}