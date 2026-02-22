'use client'

import * as React from 'react'
import { useState, useEffect, use, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getRoadmapDetails } from '@/app/actions/roadmaps'
import { chatWithRoadmap } from '@/app/actions/chat'
import { 
  ArrowLeft, Clock, Activity, ExternalLink, 
  MessageSquare, Send, X, Bot, Zap, ShieldCheck, Circle
} from 'lucide-react'

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const roadmapId = resolvedParams.id
  
  const [roadmap, setRoadmap] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
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
      const details = await getRoadmapDetails(roadmapId, user.id)
      if (!details.roadmap) return router.push('/dashboard/roadmaps')
      setRoadmap(details.roadmap)
      setEnrollment(details.enrollment)
    }
    loadData()
  }, [roadmapId])

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

  if (!roadmap) return <div className="h-screen bg-white flex items-center justify-center font-black uppercase tracking-widest animate-pulse text-slate-400 text-xs">Loading Protocol...</div>

  const curriculum = Array.isArray(roadmap.curriculum) ? roadmap.curriculum : []

  return (
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar - Prevent Shrinking */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 bg-white z-50">
        <Sidebar userEmail="student@node.ai" />
      </aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/30">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-10">
          <Link href="/dashboard/roadmaps" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
            <ArrowLeft size={16} /> Library
          </Link>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-black text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            <MessageSquare size={14} /> AI Mentor
          </button>
        </header>

        {/* Roadmap Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-24">
            
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex gap-3 mb-6">
                  <span className="px-2 py-1 bg-yellow-400 text-black text-[9px] font-black uppercase rounded">{roadmap.domain}</span>
                  <span className="px-2 py-1 bg-white/10 text-slate-300 text-[9px] font-black uppercase rounded border border-white/10">{roadmap.difficulty}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">{roadmap.title}</h1>
                <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{roadmap.description}</p>
              </div>
            </div>

            <div className="space-y-10">
              {curriculum.map((phase: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black shadow-lg shadow-yellow-400/20">{phase.module || idx + 1}</div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{phase.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5 md:ml-12 border-l-2 border-slate-100 pl-6 py-2">
                    {phase.steps?.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-yellow-400 transition-all group shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Step {step.step}</span>
                          <span className="text-[8px] font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{step.hours}H</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-3">{step.title}</h4>
                        <div className="flex gap-2">
                          {step.links?.slice(0, 3).map((link: string, lIdx: number) => (
                            <a key={lIdx} href={link} target="_blank" className="p-1.5 bg-slate-50 hover:bg-black hover:text-yellow-400 rounded-lg transition-colors border border-slate-100"><ExternalLink size={12} /></a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIXED AI CHAT SIDEBAR - Does not stretch page */}
        <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-[-30px_0_60px_rgba(0,0,0,0.15)] z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-black shadow-lg shadow-yellow-400/20"><Bot size={20} /></div>
              <span className="font-black uppercase tracking-widest text-xs">Node AI Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                <MessageSquare size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">System Standby</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-black text-white rounded-br-none shadow-xl' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100 flex-shrink-0">
            <div className="relative group">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this roadmap..." 
                className="w-full bg-slate-100 border-2 border-transparent focus:border-yellow-400 focus:bg-white rounded-2xl py-4 pl-5 pr-14 text-sm font-medium transition-all outline-none"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="absolute right-2 top-2 w-10 h-10 bg-black text-yellow-400 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}