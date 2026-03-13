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
      className="w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-all border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 shrink-0"
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
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-500 text-xs transition-colors duration-300 gap-4">
      <Zap size={24} className="animate-pulse" />
      Loading Protocol...
    </div>
  )

  const curriculum = Array.isArray(roadmap.curriculum) ? roadmap.curriculum : []

  return (
    <div className="h-screen bg-zinc-50 dark:bg-zinc-950 flex overflow-hidden font-sans text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30 dark:selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Sidebar - Prevent Shrinking */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-50">
        <Sidebar userEmail={userEmail || "Operator"} />
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between shadow-sm z-10 transition-colors duration-300">
          <Link href="/dashboard/roadmaps" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            <ArrowLeft size={16} /> Library
          </Link>
          
          <div className="flex items-center gap-4">
            <DashboardThemeToggle />
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-[11px] font-semibold uppercase tracking-wider hover:bg-blue-500 hover:scale-105 transition-all shadow-sm"
            >
              <MessageSquare size={14} /> AI Mentor
            </button>
          </div>
        </header>

        {/* Roadmap Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-24">
            
            {/* Hero Banner */}
            <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-sm border border-zinc-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

              <div className="relative z-10">
                <div className="flex gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-semibold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-sm">
                    {roadmap.domain}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-zinc-300 text-[10px] font-semibold uppercase tracking-wider rounded-lg border border-white/10 backdrop-blur-sm">
                    {roadmap.difficulty}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6 leading-tight">
                  {roadmap.title}
                </h1>
                <p className="text-zinc-400 text-base leading-relaxed max-w-2xl font-medium">
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
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-500 shadow-sm shrink-0">
                      {phase.module || idx + 1}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight">
                      {phase.title}
                    </h3>
                  </div>

                  {/* Phase Steps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6 md:ml-[3.25rem] border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 sm:pl-8 py-2">
                    {phase.steps?.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-md flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4 gap-4">
                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider shrink-0 mt-0.5">
                            Step {step.step}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md uppercase tracking-wider shrink-0">
                            {step.hours}H
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-5 flex-1 leading-snug">
                          {step.title}
                        </h4>
                        
                        {/* Links/Resources */}
                        {step.links && step.links.length > 0 && (
                          <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            {step.links.slice(0, 3).map((link: string, lIdx: number) => (
                              <a 
                                key={lIdx} 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white text-zinc-500 dark:text-zinc-400 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 group/link"
                                aria-label="External Resource"
                              >
                                <ExternalLink size={14} className="group-hover/link:text-white transition-colors" />
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
        <div className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Chat Header */}
          <div className="h-20 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <span className="font-semibold uppercase tracking-wider text-xs block leading-tight text-zinc-900 dark:text-white">Node AI</span>
                <span className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-wider">Active Mentor</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-950/50 scroll-smooth custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <MessageSquare size={32} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">System Standby</p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-5 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
            <div className="relative group">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this roadmap..." 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded-2xl py-4 pl-5 pr-14 text-sm font-medium transition-all outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-blue-600 shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                AI may generate inaccurate telemetry
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}