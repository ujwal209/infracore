'use client'

import * as React from 'react'
import { useState, useEffect, use, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getRoadmapDetails } from '@/app/actions/roadmaps'
import { chatWithRoadmap } from '@/app/actions/chat'
import { 
  ArrowLeft, Clock, Activity, ExternalLink, 
  MessageSquare, Send, X, Bot, Zap, ShieldCheck, Circle,
  Sun, Moon
} from 'lucide-react'

// --- THEME TOGGLE COMPONENT ---
function DashboardThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" /> // Placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600 shrink-0"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const roadmapId = resolvedParams.id
  
  const [roadmap, setRoadmap] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | undefined>()
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth/login')
      setUserEmail(user.email)
      
      const details = await getRoadmapDetails(roadmapId, user.id)
      if (!details.roadmap) return router.push('/dashboard/roadmaps')
      
      setRoadmap(details.roadmap)
      setEnrollment(details.enrollment)
    }
    loadData()
  }, [roadmapId, router, supabase.auth])

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return
    
    const userMsg = chatInput
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatInput('')
    setIsLoading(true)

    try {
      const result = await chatWithRoadmap(roadmap.title, roadmap.curriculum, userMsg)
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.answer || '' }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${result.error}` }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection failed. Check console." }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!roadmap) return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-black uppercase tracking-widest text-[#01005A] dark:text-[#6B8AFF] text-xs transition-colors duration-300 gap-4">
      <Zap size={24} className="animate-pulse" />
      Loading Protocol...
    </div>
  )

  const curriculum = Array.isArray(roadmap.curriculum) ? roadmap.curriculum : []

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans text-slate-900 dark:text-slate-50 selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white transition-colors duration-300">
      
      {/* Sidebar - Prevent Shrinking */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50">
        <Sidebar userEmail={userEmail || "Operator"} />
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/30 dark:bg-slate-950/30">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between shadow-sm z-10 transition-colors duration-300">
          <Link href="/dashboard/roadmaps" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors">
            <ArrowLeft size={16} /> Library
          </Link>
          
          <div className="flex items-center gap-4">
            <DashboardThemeToggle />
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#01005A] dark:bg-[#6B8AFF] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#020080] dark:hover:bg-[#5274FF] hover:scale-105 transition-all shadow-[0_4px_14px_rgba(1,0,90,0.25)] dark:shadow-[0_4px_14px_rgba(107,138,255,0.25)]"
            >
              <MessageSquare size={14} /> AI Mentor
            </button>
          </div>
        </header>

        {/* Roadmap Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-24">
            
            {/* Hero Banner */}
            <div className="bg-[#01005A] dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl dark:shadow-none border border-transparent dark:border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B8AFF]/20 dark:bg-[#6B8AFF]/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10">
                <div className="flex gap-3 mb-6">
                  <span className="px-3 py-1 bg-[#6B8AFF]/20 border border-[#6B8AFF]/30 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-sm">
                    {roadmap.domain}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-slate-200 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 backdrop-blur-sm">
                    {roadmap.difficulty}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
                  {roadmap.title}
                </h1>
                <p className="text-[#8B98FF] dark:text-slate-400 text-base leading-relaxed max-w-2xl font-medium">
                  {roadmap.description}
                </p>
              </div>
            </div>

            {/* Curriculum Nodes */}
            <div className="space-y-10">
              {curriculum.map((phase: any, idx: number) => (
                <div key={idx} className="relative animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  
                  {/* Phase Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 border border-[#01005A]/20 dark:border-[#6B8AFF]/30 rounded-xl flex items-center justify-center font-black text-[#01005A] dark:text-[#6B8AFF] shadow-sm shrink-0">
                      {phase.module || idx + 1}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                      {phase.title}
                    </h3>
                  </div>

                  {/* Phase Steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 md:ml-[3.25rem] border-l-2 border-slate-200 dark:border-slate-800 pl-6 sm:pl-8 py-2">
                    {phase.steps?.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#01005A] dark:hover:border-[#6B8AFF] transition-all group shadow-sm hover:shadow-md dark:shadow-none flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0 mt-0.5">
                            Step {step.step}
                          </span>
                          <span className="text-[9px] font-black text-[#01005A] dark:text-[#6B8AFF] bg-[#01005A]/5 dark:bg-[#6B8AFF]/10 px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                            {step.hours}H
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5 flex-1 leading-snug">
                          {step.title}
                        </h4>
                        
                        {/* Links/Resources */}
                        {step.links && step.links.length > 0 && (
                          <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                            {step.links.slice(0, 3).map((link: string, lIdx: number) => (
                              <a 
                                key={lIdx} 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-50 dark:bg-slate-950 hover:bg-[#01005A] dark:hover:bg-[#6B8AFF] hover:text-white dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-800 group/link"
                                aria-label="External Resource"
                              >
                                <ExternalLink size={14} className="text-slate-500 group-hover/link:text-white transition-colors" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIXED AI CHAT SIDEBAR */}
        <div className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Chat Header */}
          <div className="h-20 px-6 bg-[#01005A] dark:bg-slate-950 text-white flex items-center justify-between flex-shrink-0 border-b border-transparent dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6B8AFF]/20 dark:bg-[#6B8AFF]/10 border border-[#6B8AFF]/30 rounded-xl flex items-center justify-center text-[#6B8AFF] shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <span className="font-black uppercase tracking-widest text-xs block leading-tight">Node AI</span>
                <span className="text-[9px] font-medium text-[#8B98FF] uppercase tracking-widest">Active Mentor</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/50 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <MessageSquare size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">System Standby</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-[#01005A] dark:bg-[#6B8AFF] text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#01005A] dark:bg-[#6B8AFF] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-[#01005A] dark:bg-[#6B8AFF] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-[#01005A] dark:bg-[#6B8AFF] rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
            <div className="relative group">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this roadmap..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-[#6B8AFF] focus:ring-1 focus:ring-[#01005A] dark:focus:ring-[#6B8AFF] rounded-2xl py-4 pl-5 pr-14 text-sm font-semibold transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-[#01005A] dark:bg-[#6B8AFF] text-white rounded-xl flex items-center justify-center hover:bg-[#020080] dark:hover:bg-[#5274FF] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                AI may generate inaccurate telemetry
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}