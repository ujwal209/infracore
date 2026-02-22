'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sidebar } from '@/components/dashboard/sidebar'
import { 
  uploadAndProcessResume, 
  getExistingResume, 
  sendResumeChatMessage, 
  getResumeChatMessages 
} from '@/app/actions/resume'
import { 
  FileText, Upload, CheckCircle2, Zap, 
  Loader2, Sparkles, Shield, Cpu, Layout, 
  ArrowRight, Command, Bot, User, X, 
  MessageSquare, Menu, Search, Filter
} from 'lucide-react'

export default function ResumeIntelligence() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  
  // Chat & UI State
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [skillFilter, setSkillFilter] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const data = await getExistingResume();
      if (data) {
        setResumeData(data);
        const msgs = await getResumeChatMessages(data.id);
        setChatMessages(msgs);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isChatting, showChatDrawer]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const data = await uploadAndProcessResume(formData);
      setResumeData(data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting || !resumeData) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsChatting(true);
    setShowChatDrawer(true);

    try {
      const aiResponse = await sendResumeChatMessage(resumeData.id, userText);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "### ⨯ SYSTEM_FAILURE\nNeural link disrupted. Attempting to reconnect..." }]);
    } finally {
      setIsChatting(false);
    }
  };

  // --- Professional Markdown Components ---
  const MarkdownComponents = {
    table: ({ children }: any) => (
      <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white max-w-full">
        <table className="w-full text-left border-collapse text-[12px] whitespace-nowrap">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">{children}</thead>
    ),
    th: ({ children }: any) => <th className="px-4 py-3 border-r border-slate-100 last:border-0">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 border-r border-slate-100 last:border-0 border-b border-slate-50 text-slate-700">{children}</td>,
    p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed break-words">{children}</p>,
    strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
    li: ({ children }: any) => <li className="ml-4 list-disc mb-1 break-words">{children}</li>,
    pre: ({ children }: any) => <pre className="overflow-x-auto max-w-full p-4 bg-slate-50 rounded-lg my-4 border border-slate-100">{children}</pre>,
    code: ({ inline, children }: any) => inline 
      ? <code className="bg-slate-100 text-emerald-600 px-1.5 py-0.5 rounded text-xs break-all">{children}</code>
      : <code className="text-xs">{children}</code>
  };

  const filteredSkills = resumeData?.analysis?.skills?.filter((skill: string) => 
    skill.toLowerCase().includes(skillFilter.toLowerCase())
  ) || [];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans antialiased w-full">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 bg-white z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail="operator@infracore.io" />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Cpu size={18} className="text-slate-900" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar userEmail="operator@infracore.io" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Work Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="p-2 bg-slate-900 rounded-lg text-yellow-400 shadow-md shrink-0 hidden sm:block">
              <Cpu size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest truncate">Resume_Intel_v2.6</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Data_Cubes_Linked</p>
              </div>
            </div>
          </div>
          
          {resumeData && (
             <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                <button 
                  onClick={() => setShowChatDrawer(!showChatDrawer)}
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-all border ${
                    showChatDrawer 
                    ? 'bg-slate-900 text-yellow-400 border-slate-900 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare size={14}/> 
                  <span className="hidden sm:inline">{showChatDrawer ? 'Close Feed' : 'Neural Feed'}</span>
                </button>
                <a href={resumeData.file_url} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-all">
                  <FileText size={14} /> Source PDF
                </a>
             </div>
          )}
        </header>

        {/* Dynamic Layout Wrapper */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 flex flex-col relative min-w-0">
            <div className="flex-1 p-4 sm:p-8 lg:p-10 w-full max-w-5xl mx-auto space-y-8">
              
              {!resumeData && !loading && (
                <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-500 px-4 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center shadow-xl relative">
                    <Upload size={32} className="text-slate-400" />
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-xl border-2 border-white shadow-sm">
                      <Sparkles size={16} className="text-slate-900"/>
                    </div>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Initialize Extraction</h1>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Upload an Engineering PDF for high-granularity parsing and AI-driven capability mapping.</p>
                  </div>
                  <input type="file" id="res-upload" className="hidden" onChange={handleUpload} accept=".pdf" />
                  <label htmlFor="res-upload" className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-800 hover:text-yellow-400 transition-all shadow-lg flex items-center gap-2">
                    <Upload size={16} /> Engage Upload
                  </label>
                </div>
              )}

              {loading && (
                <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="animate-spin text-emerald-500" size={48} strokeWidth={2} />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Processing Neural Link...</p>
                </div>
              )}

              {resumeData && !loading && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* Profile Summary */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0">
                      <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-5 tracking-widest flex items-center gap-2 border-b border-slate-100 pb-4">
                        <User size={14} className="text-emerald-500" /> Profile Summary
                      </h3>
                      <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed overflow-hidden break-words">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                          {resumeData.analysis.summary}
                        </ReactMarkdown>
                      </div>
                    </section>

                    {/* Technical Stack with SaaS Filter */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
                        <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 shrink-0">
                          <Cpu size={14} className="text-yellow-500" /> Tech Stack
                        </h3>
                        {/* Filter Input */}
                        <div className="relative w-full sm:w-48 group">
                          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                          <input 
                            placeholder="Filter skills..." 
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                        {filteredSkills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold tracking-wide hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-default">
                            {skill}
                          </span>
                        ))}
                        {filteredSkills.length === 0 && (
                          <p className="text-xs text-slate-400 py-4 w-full text-center">No skills matched your filter.</p>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Growth Vectors */}
                  <section className="bg-slate-900 p-6 sm:p-10 rounded-2xl text-white shadow-xl relative overflow-hidden min-w-0">
                     <div className="absolute -top-10 -right-10 p-8 opacity-5"><Zap size={200}/></div>
                     <h3 className="text-[11px] font-bold uppercase text-yellow-400 mb-6 tracking-widest relative z-10 flex items-center gap-2">
                       <ArrowRight size={14} /> Growth Vectors & Strategy
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {resumeData.analysis.tips.map((tip: string, i: number) => (
                          <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                             <div className="text-yellow-400 font-black text-sm opacity-50 group-hover:opacity-100 shrink-0">0{i+1}</div>
                             <p className="text-xs font-medium leading-relaxed opacity-90 group-hover:opacity-100 break-words">{tip}</p>
                          </div>
                        ))}
                     </div>
                  </section>
                </div>
              )}
            </div>

            {/* Floating Initiator Command Bar (Only visible if chat drawer is closed) */}
            {resumeData && !showChatDrawer && (
              <div className="sticky bottom-0 p-4 sm:p-8 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-10">
                <div className="max-w-3xl mx-auto w-full">
                  <form onSubmit={handleChatSubmit} className="relative bg-white border border-slate-300 rounded-xl flex items-center p-1.5 shadow-lg group focus-within:border-slate-500 transition-all">
                     <div className="pl-4 pr-2 text-slate-400 shrink-0"><Command size={18} /></div>
                     <input 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about specific career roadmaps, skills, or gaps..." 
                      className="flex-1 bg-transparent py-3 px-2 text-sm font-medium outline-none placeholder:text-slate-400 min-w-0" 
                     />
                     <button 
                      disabled={isChatting || !chatInput.trim()}
                      className="bg-slate-900 text-white px-5 sm:px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide hover:bg-slate-800 hover:text-yellow-400 transition-all disabled:opacity-50 shrink-0 flex items-center gap-2"
                     >
                        <span className="hidden sm:inline">Analyze</span> <ArrowRight size={14}/>
                     </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* 3. Neural Feed Sidebar (Chat Drawer) */}
          <aside 
            className={`absolute sm:relative right-0 top-0 bottom-0 bg-white border-l border-slate-200 transition-all duration-300 z-30 flex flex-col shadow-2xl sm:shadow-none overflow-hidden shrink-0 ${
              showChatDrawer ? 'w-full sm:w-[380px] lg:w-[450px] translate-x-0' : 'w-0 translate-x-full sm:translate-x-0 sm:border-transparent'
            }`}
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
               <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-slate-100 rounded text-slate-600 shrink-0"><Bot size={16} /></div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-800 truncate">Neural_Handshake</span>
               </div>
               <button onClick={() => setShowChatDrawer(false)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors shrink-0">
                 <X size={18}/>
               </button>
            </div>
            
            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                  <MessageSquare size={32} className="text-slate-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">System ready. Awaiting operational queries.</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex gap-3 w-full ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                    m.role === 'user' ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-yellow-400'
                  }`}>
                    {m.role === 'user' ? <User size={14}/> : <Sparkles size={14}/>}
                  </div>
                  <div className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] min-w-0`}>
                    <div className={`px-4 py-3 rounded-xl text-[13px] leading-relaxed shadow-sm min-w-0 w-full overflow-hidden ${
                      m.role === 'user' 
                      ? 'bg-slate-900 text-white border border-slate-800 rounded-tr-sm' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                    }`}>
                      <div className={m.role === 'user' ? 'prose prose-sm prose-invert max-w-none break-words w-full' : 'prose prose-sm prose-slate max-w-none break-words w-full'}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                      {m.role === 'user' ? 'Operator' : 'Prime_Core'}
                    </span>
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
                  <div className="h-10 w-24 bg-slate-200 rounded-xl rounded-tl-sm" />
                </div>
              )}
            </div>

            {/* Chat Drawer Input Form */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
               <form onSubmit={handleChatSubmit} className="relative bg-slate-50 border border-slate-200 rounded-xl flex items-center p-1 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                 <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type command..." 
                  className="flex-1 bg-transparent py-2.5 px-3 text-sm font-medium outline-none placeholder:text-slate-400 min-w-0" 
                  disabled={isChatting}
                 />
                 <button 
                  disabled={isChatting || !chatInput.trim()}
                  className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-800 hover:text-yellow-400 transition-all disabled:opacity-50 shrink-0"
                 >
                    {isChatting ? <Loader2 className="animate-spin" size={14}/> : <ArrowRight size={14}/>}
                 </button>
               </form>
            </div>
          </aside>
          
        </div>
      </main>
    </div>
  )
}