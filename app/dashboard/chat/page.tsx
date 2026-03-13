'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sidebar } from '@/components/dashboard/sidebar' 
import { ThemeToggle } from '@/components/theme-toggle'
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
    setMobileMenuOpen(false);
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
      <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 max-w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">{children}</thead>,
    th: ({ children }: any) => <th className="px-4 py-3 border-r border-zinc-100 dark:border-zinc-800 last:border-0">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 text-sm border-r border-zinc-100 dark:border-zinc-800 last:border-0 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">{children}</td>,
    pre: ({ children }: any) => <pre className="overflow-x-auto max-w-full p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg my-4 border border-zinc-100 dark:border-zinc-800">{children}</pre>,
    code: ({ inline, children, ...props }: any) => {
      return inline ? (
        <code className="break-all whitespace-pre-wrap bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-[0.9em] font-medium" {...props}>{children}</code>
      ) : (
        <code className="break-all whitespace-pre-wrap text-sm" {...props}>{children}</code>
      )
    },
    p: ({ children }: any) => <p className="break-words whitespace-pre-wrap mb-4 last:mb-0 leading-relaxed">{children}</p>
  };

  const HistorySidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-50/80 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Clock size={14}/> Session History
          </h3>
          <button 
            onClick={() => {setMessages([]); setSessionId(null); setMobileMenuOpen(false);}} 
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm group"
            title="New Session"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              placeholder="Filter sessions..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
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
              ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm' 
              : 'hover:bg-white dark:hover:bg-zinc-900 border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {editingId === s.id ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus 
                  value={editTitle} 
                  onChange={(e)=>setEditTitle(e.target.value)} 
                  className="bg-transparent text-sm font-semibold outline-none w-full border-b border-blue-600 dark:border-blue-500 text-zinc-900 dark:text-white" 
                  onKeyDown={(e) => e.key === 'Enter' && saveRename(e as any, s.id)}
                />
                <button onClick={(e)=>saveRename(e, s.id)} className="p-1 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded text-blue-600 dark:text-blue-400 transition-colors">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Terminal size={14} className={sessionId === s.id ? "text-blue-600 dark:text-blue-500" : "text-zinc-400"} />
                  <p className={`text-sm font-medium truncate pr-10 ${sessionId === s.id ? 'text-zinc-900 dark:text-white' : ''}`}>
                    {s.title}
                  </p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-white dark:from-zinc-900 via-white dark:via-zinc-900 to-transparent pl-4">
                  <button onClick={(e)=>{ e.stopPropagation(); setEditingId(s.id); setEditTitle(s.title); }} className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={(e)=>handleDelete(e, s.id)} className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="text-center px-4 py-8 text-zinc-400 dark:text-zinc-500 text-sm font-medium">
            No sessions found.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* 1. MAIN GLOBAL SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20">
        <Sidebar userEmail="operator@infracore.io" />
      </aside>

      {/* 2. SESSION HISTORY RAIL (Tablet/Desktop) */}
      <aside className="hidden md:flex w-80 flex-shrink-0 z-10">
        <HistorySidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm md:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Terminal size={18} className="text-blue-600 dark:text-blue-500" />
                Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
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
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 relative transition-colors duration-300">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              className="md:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0 border border-blue-100 dark:border-blue-500/20">
              <Terminal size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight truncate">Architect Prime</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                  {sessionId ? `SID: ${sessionId.slice(0,8)}` : 'System Standby'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-md transition-colors">
              <Shield size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Secure Link</span>
            </div>
          </div>
        </header>

        {/* Messaging Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10 space-y-8 bg-zinc-50 dark:bg-zinc-950/50 custom-scrollbar scroll-smooth">
          <div className="max-w-4xl mx-auto w-full">
            {messages.length === 0 && (
              <div className="py-20 sm:py-32 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex items-center justify-center shadow-sm relative transition-colors">
                  <Bot size={36} className="text-blue-600 dark:text-blue-400" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-xl border-2 border-white dark:border-zinc-900 shadow-sm">
                    <Sparkles size={16} className="text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                   <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">System Initialized</h1>
                   <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-medium">
                     Ready for engineering data analysis. Enter your command below to begin a new secure session.
                   </p>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 sm:gap-6 mb-8 w-full ${m.role === 'user' ? 'flex-row-reverse' : 'animate-in fade-in slide-in-from-bottom-2'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400' 
                  : 'bg-blue-600 border-blue-600 text-white'
                }`}>
                  {m.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
                </div>
                
                <div className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[85%] min-w-0`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      {m.role === 'user' ? 'Operator' : 'Architect Prime'}
                    </span>
                  </div>
                  <div className={`px-5 py-4 sm:px-6 sm:py-5 rounded-2xl text-[14px] leading-relaxed shadow-sm min-w-0 w-full overflow-hidden transition-colors ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white border border-blue-600 rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
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
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 border border-blue-600 text-white shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm shadow-sm transition-colors">
                  <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={18}/> 
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Processing request...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Input Command Dock */}
        <footer className="p-4 sm:p-6 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
          <div className="max-w-4xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent to-transparent rounded-xl blur opacity-0 group-focus-within:opacity-100 group-focus-within:from-blue-500/20 dark:group-focus-within:from-blue-500/20 group-focus-within:to-blue-400/20 transition duration-500" />
              <div className="relative bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center p-1.5 shadow-sm group-focus-within:border-blue-600 dark:group-focus-within:border-blue-500 group-focus-within:shadow-md transition-all w-full">
                <div className="pl-4 pr-2 text-zinc-400 dark:text-zinc-500 shrink-0 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <Command size={20} />
                </div>
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Type a command or ask a question..." 
                  className="flex-1 bg-transparent px-2 py-3 text-sm font-medium text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 min-w-0" 
                  disabled={loading}
                />
                <button 
                  disabled={loading || !input.trim()} 
                  className="bg-blue-600 text-white h-10 sm:h-12 px-4 sm:px-6 rounded-lg font-medium text-sm hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 active:scale-95 shadow-sm"
                >
                  <span className="hidden sm:inline">Execute</span>
                  <Send size={16} />
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wider">
                Architect Prime may produce inaccurate information about system specs or configurations.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}