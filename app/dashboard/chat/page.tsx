'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sidebar } from '@/components/dashboard/sidebar' 
import { ThemeToggle } from '@/components/theme-toggle' // Imported Theme Toggle
import { 
  getSessions, deleteSession, renameSession, 
  getChatMessages, sendCoachingMessage 
} from '@/app/actions/coaching'
import { 
  Send, Bot, Terminal, User, Loader2, Plus, 
  Sparkles, Command, Shield, Trash2, Edit3, Check, 
  Search, Clock, Menu, X, Filter
} from 'lucide-react'

export default function ArchitectChat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { refreshSessions(); }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const refreshSessions = async () => { setSessions(await getSessions()); };

  const loadSession = async (id: string) => {
    setLoading(true);
    setSessionId(id);
    const msgs = await getChatMessages(id);
    setMessages(msgs);
    setLoading(false);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteSession(id);
    if (sessionId === id) { setMessages([]); setSessionId(null); }
    refreshSessions();
  };

  const saveRename = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await renameSession(id, editTitle);
    setEditingId(null);
    refreshSessions();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input; setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await sendCoachingMessage(sessionId, text);
      setSessionId(res.sessionId);
      if (!sessionId) refreshSessions();
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
    } finally { setLoading(false); }
  };

  const MarkdownComponents = {
    table: ({ children }: any) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 max-w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">{children}</thead>,
    th: ({ children }: any) => <th className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 last:border-0">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 text-sm border-r border-slate-100 dark:border-slate-800 last:border-0 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">{children}</td>,
    pre: ({ children }: any) => <pre className="overflow-x-auto max-w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-lg my-4 border border-slate-100 dark:border-slate-800">{children}</pre>,
    code: ({ inline, children, ...props }: any) => {
      return inline ? (
        <code className="break-all whitespace-pre-wrap bg-[#01005A]/10 dark:bg-blue-500/20 text-[#01005A] dark:text-blue-400 px-1.5 py-0.5 rounded text-[0.9em]" {...props}>{children}</code>
      ) : (
        <code className="break-all whitespace-pre-wrap text-sm" {...props}>{children}</code>
      )
    },
    p: ({ children }: any) => <p className="break-words whitespace-pre-wrap mb-4 last:mb-0 leading-relaxed">{children}</p>
  };

  // Reusable History Sidebar Content
  const HistorySidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-50/80 dark:bg-[#09090b] border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock size={14}/> Session History
          </h3>
          <button 
            onClick={() => {setMessages([]); setSessionId(null); setMobileMenuOpen(false);}} 
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#01005A] dark:hover:border-blue-500 hover:text-[#01005A] dark:hover:text-blue-400 transition-all shadow-sm group"
            title="New Session"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
          </button>
        </div>
        
        {/* SaaS Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#01005A] dark:group-focus-within:text-blue-400 transition-colors" size={16} />
            <input 
              placeholder="Filter sessions..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 focus:border-[#01005A] dark:focus:border-blue-500 transition-all shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-blue-400 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        {sessions.filter(s => s.title.toLowerCase().includes(filter.toLowerCase())).map((s) => (
          <div 
            key={s.id} onClick={() => loadSession(s.id)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${
              sessionId === s.id 
              ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm' 
              : 'hover:bg-white dark:hover:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {editingId === s.id ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus 
                  value={editTitle} 
                  onChange={(e)=>setEditTitle(e.target.value)} 
                  className="bg-transparent text-sm font-semibold outline-none w-full border-b border-[#01005A] dark:border-blue-500 text-slate-900 dark:text-white" 
                  onKeyDown={(e) => e.key === 'Enter' && saveRename(e as any, s.id)}
                />
                <button onClick={(e)=>saveRename(e, s.id)} className="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400 transition-colors">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Terminal size={14} className={sessionId === s.id ? "text-[#01005A] dark:text-blue-500" : "text-slate-400"} />
                  <p className={`text-sm font-medium truncate pr-10 ${sessionId === s.id ? 'text-slate-900 dark:text-white' : ''}`}>
                    {s.title}
                  </p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white dark:from-slate-900 via-white dark:via-slate-900 to-transparent pl-4">
                  <button onClick={(e)=>{ e.stopPropagation(); setEditingId(s.id); setEditTitle(s.title); }} className="p-1.5 text-slate-400 hover:text-[#01005A] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={(e)=>handleDelete(e, s.id)} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="text-center px-4 py-8 text-slate-400 dark:text-slate-500 text-sm">
            No sessions found.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#09090b] overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-[#01005A]/20 selection:text-[#01005A] dark:selection:bg-blue-500/30 dark:selection:text-blue-200">
      
      {/* 1. MAIN GLOBAL SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <Sidebar userEmail="operator@infracore.io" />
      </aside>

      {/* 2. SESSION HISTORY RAIL (Tablet/Desktop) */}
      <aside className="hidden md:flex w-80 flex-shrink-0 z-10">
        <HistorySidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm md:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal size={18} className="text-[#01005A] dark:text-blue-400" />
                Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <HistorySidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN COMMAND CENTER */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#09090b] relative transition-colors duration-300">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-[#01005A] dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-white dark:text-blue-400 shadow-md shrink-0 border border-transparent dark:border-blue-500/20">
              <Terminal size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">Architect Prime</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {sessionId ? `SID: ${sessionId.slice(0,8)}` : 'System Standby'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-md transition-colors">
              <Shield size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Secure Link</span>
            </div>
          </div>
        </header>

        {/* Messaging Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10 space-y-8 bg-[#f8fafc] dark:bg-[#09090b] custom-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto w-full">
            {messages.length === 0 && (
              <div className="py-20 sm:py-32 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-center shadow-xl relative transition-colors">
                  <Bot size={36} className="text-[#01005A] dark:text-blue-400" />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-2 border-white dark:border-slate-900 shadow-sm">
                    <Sparkles size={16} className="text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                   <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Initialized</h1>
                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                     Ready for engineering data analysis. Enter your command below to begin a new secure session.
                   </p>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 sm:gap-6 mb-8 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'animate-in fade-in slide-in-from-bottom-2'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[#01005A] dark:text-blue-400' 
                  : 'bg-[#01005A] dark:bg-blue-600 border-[#01005A] dark:border-blue-600 text-white'
                }`}>
                  {m.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
                </div>
                
                <div className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[85%] min-w-0`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {m.role === 'user' ? 'Operator' : 'Architect Prime'}
                    </span>
                  </div>
                  <div className={`px-5 py-4 sm:px-6 sm:py-5 rounded-2xl text-[14px] leading-relaxed shadow-sm min-w-0 w-full overflow-hidden transition-colors ${
                    m.role === 'user' 
                    ? 'bg-[#01005A] dark:bg-blue-600 text-white border border-[#01005A] dark:border-blue-600 rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-sm'
                  }`}>
                     <div className={`prose prose-sm max-w-none break-words w-full ${m.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{m.content}</ReactMarkdown>
                     </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-6 items-center animate-in fade-in">
                <div className="w-10 h-10 rounded-xl bg-[#01005A] dark:bg-blue-600 flex items-center justify-center shrink-0 border border-[#01005A] dark:border-blue-600 text-white shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm shadow-sm transition-colors">
                  <Loader2 className="animate-spin text-[#01005A] dark:text-blue-400" size={18}/> 
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Processing request...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Input Command Dock */}
        <footer className="p-4 sm:p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent to-transparent rounded-xl blur opacity-0 group-focus-within:opacity-100 group-focus-within:from-[#01005A]/20 dark:group-focus-within:from-blue-500/20 group-focus-within:to-emerald-400/20 transition duration-500" />
              <div className="relative bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center p-1.5 shadow-sm group-focus-within:border-[#01005A] dark:group-focus-within:border-blue-500 group-focus-within:shadow-md transition-all w-full">
                <div className="pl-4 pr-2 text-slate-400 dark:text-slate-500 shrink-0 group-focus-within:text-[#01005A] dark:group-focus-within:text-blue-400 transition-colors">
                  <Command size={20} />
                </div>
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Type a command or ask a question..." 
                  className="flex-1 bg-transparent px-2 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 min-w-0" 
                  disabled={loading}
                />
                <button 
                  disabled={loading || !input.trim()} 
                  className="bg-[#01005A] dark:bg-blue-600 text-white h-10 sm:h-12 px-4 sm:px-6 rounded-lg font-semibold text-sm hover:bg-[#01005A]/90 dark:hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 active:scale-95 shadow-sm"
                >
                  <span className="hidden sm:inline">Execute</span>
                  <Send size={16} />
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                Architect Prime may produce inaccurate information about system specs or configurations.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}