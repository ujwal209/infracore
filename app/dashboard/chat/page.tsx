'use client'

import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  getSessions, deleteSession, renameSession, 
  getChatMessages, sendCoachingMessage 
} from '@/app/actions/coaching'
import { 
  Search, Clock, Menu, X, RefreshCw, Sparkles,
  Plus, Send, Edit3, Trash2, Loader2, Check, ChevronRight, Copy, PenLine, CheckCircle2
} from 'lucide-react'

// --- 1. UTILITY COMPONENTS ---

const extractTextFromNode = (node: any): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (node && node.props && node.props.children) return extractTextFromNode(node.props.children);
  return '';
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Copy message">
      {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
};

// FLOATING PROMPT BAR COMPONENT
const PromptBar = ({ onSubmit, loading, editTrigger }: { onSubmit: (val: string) => void, loading: boolean, editTrigger: {text: string, ts: number} | null }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editTrigger && editTrigger.text) {
      setText(editTrigger.text);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    }
  }, [editTrigger]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !loading) {
        onSubmit(text);
        setText('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSubmit(text);
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full shrink-0 bg-gradient-to-t from-white via-white dark:from-[#0a0a0a] dark:via-[#0a0a0a] to-transparent pt-6 pb-[120px] md:pb-10 px-4 sm:px-8 z-20 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full space-y-3 pointer-events-auto">
        
        {/* Floating Suggestion Pills - Hidden on Mobile (md:flex) */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          {[
            "Highest paying tech jobs in India?", 
            "Best NPTEL courses for Data Science", 
            "Civil vs Mechanical Engineering scope",
            "How to prepare for off-campus placements?",
            "What is the syllabus for GATE CSE?"
          ].map((q, idx) => (
            <button 
              key={idx}
              onClick={() => { onSubmit(q); }}
              disabled={loading}
              className="whitespace-nowrap px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all shadow-sm disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Sleek Blue Border Floating Input */}
        <div className="relative bg-white dark:bg-[#111113] border-2 border-blue-500/40 hover:border-blue-500/70 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15 rounded-[2rem] p-2.5 transition-all shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)] flex items-end gap-3">
          <textarea 
            ref={textareaRef}
            value={text} 
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Mentor anything..." 
            className="flex-1 bg-transparent px-4 py-3.5 text-[17px] font-medium text-zinc-900 dark:text-white outline-none placeholder:text-zinc-500 min-h-[56px] max-h-[250px] resize-none custom-scrollbar" 
            disabled={loading}
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !text.trim()} 
            className={`h-[52px] w-[52px] mb-0.5 shrink-0 flex items-center justify-center rounded-[1.5rem] transition-all shadow-md ${
              loading || !text.trim()
              ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-700'
              : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-blue-500/30'
            }`}
          >
            {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} className="-ml-1 mt-1" />}
          </button>
        </div>
        
      </div>
    </div>
  );
};


// --- 2. MAIN COMPONENT ---
export default function AICoachingMentor() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [editTrigger, setEditTrigger] = useState<{text: string, ts: number} | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { refreshSessions(); }, []);
  
  useEffect(() => { 
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

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

  const submitPrompt = async (text: string) => {
    if (!text.trim() || loading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await sendCoachingMessage(sessionId, text);
      setSessionId(res.sessionId);
      if (!sessionId) refreshSessions();
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
    } catch (err) {
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  const handleRegenerate = async (index: number) => {
    let lastUserMsg = "";
    for (let i = index; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].content;
        break;
      }
    }
    if (!lastUserMsg || loading) return;
    
    setMessages(messages.slice(0, index));
    setLoading(true);
    
    try {
      const res = await sendCoachingMessage(sessionId, lastUserMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
    } finally { 
      setLoading(false); 
    }
  };

  const handleEditUserMessage = (text: string) => {
    setEditTrigger({ text, ts: Date.now() });
  };

  // --- 3. ROBUST MARKDOWN COMPONENTS ---
  const MarkdownComponents = {
    table: ({ children }: any) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <table className="w-full text-left border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">{children}</thead>,
    th: ({ children }: any) => <th className="px-4 py-3 border-r border-zinc-200 dark:border-zinc-800 last:border-0">{children}</th>,
    td: ({ children }: any) => <td className="px-4 py-3 border-r border-zinc-100 dark:border-zinc-800/50 last:border-0 border-b border-zinc-100 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-300 font-medium">{children}</td>,
    pre: ({ children }: any) => <pre className="overflow-x-auto p-4 bg-zinc-900 dark:bg-[#0a0a0a] text-zinc-100 rounded-xl my-4 border border-zinc-800 font-mono text-sm shadow-inner">{children}</pre>,
    code: ({ inline, children, ...props }: any) => {
      return inline ? (
        <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 px-1.5 py-0.5 rounded-md font-mono text-[0.85em] font-bold" {...props}>{children}</code>
      ) : (
        <code className="break-all whitespace-pre-wrap font-mono text-sm" {...props}>{children}</code>
      )
    },
    p: ({ children }: any) => <p className="mb-4 last:mb-0 leading-relaxed text-[16px] text-zinc-800 dark:text-zinc-200">{children}</p>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mt-8 mb-4">{children}</h3>,
    ul: ({ children }: any) => <ul className="list-disc pl-5 space-y-2 mb-4 text-[16px] text-zinc-800 dark:text-zinc-200">{children}</ul>,
    strong: ({ children }: any) => <strong className="font-bold text-zinc-900 dark:text-white">{children}</strong>,
    blockquote: ({ children }: any) => {
      const text = extractTextFromNode(children).trim();
      
      return (
        <button 
          onClick={() => submitPrompt(text)}
          disabled={loading}
          className="w-full text-left mt-2 p-4 bg-zinc-50 hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-500/10 border border-zinc-200 hover:border-blue-500 dark:border-zinc-800 dark:hover:border-blue-500/50 rounded-xl text-sm font-bold text-zinc-700 hover:text-blue-700 dark:text-zinc-300 dark:hover:text-blue-400 transition-all flex items-center justify-between group shadow-sm disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="leading-snug">{text}</span>
          </div>
          <ChevronRight size={16} className="text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )
    }
  };

  // --- 4. MESSAGE ITEM (Memoized) ---
  const MessageItem = React.memo(({ m, index, isLast, loading, onRegenerate, onEdit }: any) => {
    const isUser = m.role === 'user';

    return (
      <div className={`group flex flex-col gap-1 w-full animate-in fade-in ${isUser ? 'items-end' : 'items-start'}`}>
        
        <div className={`relative max-w-[90%] sm:max-w-[80%] ${
          isUser 
          ? 'bg-zinc-100 dark:bg-zinc-800/80 px-6 py-4 rounded-[1.5rem] rounded-tr-md text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50' 
          : 'bg-transparent text-zinc-900 dark:text-zinc-100 w-full'
        }`}>
          <div className={`prose prose-zinc dark:prose-invert max-w-none break-words w-full ${isUser ? 'prose-p:leading-relaxed prose-p:my-0' : ''}`}>
            {isUser ? (
              <p className="text-[16px] m-0 font-medium">{m.content}</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                {m.content}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {/* Hover Action Bar */}
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
          {!isUser && <CopyButton text={m.content} />}
          
          {isUser && (
            <button onClick={() => onEdit(m.content)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Edit prompt">
              <PenLine size={14} />
            </button>
          )}

          {!isUser && isLast && !loading && (
            <button onClick={() => onRegenerate(index)} className="p-1.5 text-zinc-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/10" title="Regenerate response">
              <RefreshCw size={14} />
            </button>
          )}
        </div>

      </div>
    );
  });
  MessageItem.displayName = 'MessageItem';

  // --- 5. SIDEBAR (Memoized) ---
  const HistorySidebar = React.memo(({ sessions, sessionId, filter, setFilter, loadSession, setEditingId, editingId, editTitle, setEditTitle, saveRename, handleDelete, createNewSession }: any) => (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            History
          </h3>
          <button onClick={createNewSession} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
          <input 
            placeholder="Search..." 
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        {sessions.filter((s:any) => s.title.toLowerCase().includes(filter.toLowerCase())).map((s:any) => (
          <div key={s.id} onClick={() => loadSession(s.id)} className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${sessionId === s.id ? 'bg-zinc-200/50 dark:bg-zinc-800/50' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}>
            {editingId === s.id ? (
              <div className="flex items-center gap-2">
                <input autoFocus value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className="bg-transparent text-sm font-medium outline-none w-full border-b border-zinc-400" onKeyDown={(e) => e.key === 'Enter' && saveRename(e as any, s.id)} />
                <button onClick={(e)=>saveRename(e, s.id)} className="p-1 hover:text-green-600"><Check size={14} /></button>
              </div>
            ) : (
              <>
                <p className={`text-sm truncate pr-8 ${sessionId === s.id ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium text-zinc-600 dark:text-zinc-400'}`}>{s.title}</p>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-zinc-100 dark:from-zinc-900 pl-4">
                  <button onClick={(e)=>{ e.stopPropagation(); setEditingId(s.id); setEditTitle(s.title); }} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Edit3 size={14} /></button>
                  <button onClick={(e)=>handleDelete(e, s.id)} className="p-1 text-zinc-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  ));
  HistorySidebar.displayName = 'HistorySidebar';

  return (
    <div className="flex flex-1 overflow-hidden h-screen w-full relative">
        <aside className="hidden md:flex w-72 flex-shrink-0 z-10 border-r border-zinc-200 dark:border-zinc-800">
          <HistorySidebar sessions={sessions} sessionId={sessionId} filter={filter} setFilter={setFilter} loadSession={loadSession} setEditingId={setEditingId} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} saveRename={saveRename} handleDelete={handleDelete} createNewSession={() => {setMessages([]); setSessionId(null); setMobileMenuOpen(false);}} />
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-[80vw] max-w-sm bg-white dark:bg-zinc-950 flex flex-col border-r border-zinc-800" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="font-bold text-lg">History</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-hidden">
                <HistorySidebar sessions={sessions} sessionId={sessionId} filter={filter} setFilter={setFilter} loadSession={loadSession} setEditingId={setEditingId} editingId={editingId} editTitle={editTitle} setEditTitle={setEditTitle} saveRename={saveRename} handleDelete={handleDelete} createNewSession={() => {setMessages([]); setSessionId(null); setMobileMenuOpen(false);}} />
              </div>
            </div>
          </div>
        )}

        {/* The main container uses relative layout to support the absolute/floating PromptBar */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0a0a0a] relative">
          
          <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 z-30 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50">
            <button className="md:hidden flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
               <h2 className="text-sm font-bold text-zinc-900 dark:text-white">AI Mentor</h2>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto w-full space-y-8">
              
              {messages.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-4 shadow-sm border border-blue-100 dark:border-blue-500/20">
                    <Sparkles size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                    How can I assist you?
                  </h1>
                </div>
              )}

              {messages.map((m, i) => (
                <MessageItem 
                  key={i} 
                  m={m} 
                  index={i}
                  isLast={m.role === 'assistant' && i === messages.length - 1} 
                  loading={loading} 
                  onRegenerate={handleRegenerate}
                  onEdit={handleEditUserMessage} 
                />
              ))}

              {loading && (
                <div className="flex w-full items-start animate-in fade-in">
                  <div className="flex items-center gap-3 text-zinc-500 ml-2">
                    <Loader2 className="animate-spin text-blue-600" size={20} /> 
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Processing...</span>
                  </div>
                </div>
              )}
              
              {/* Huge bottom padding spacer so chat isn't hidden behind the floating bar */}
              <div className="h-[200px]" />
            </div>
          </div>

          {/* Floating Prompt Bar sits absolutely at the bottom */}
          <div className="absolute bottom-0 left-0 right-0">
             <PromptBar onSubmit={submitPrompt} loading={loading} editTrigger={editTrigger} />
          </div>

        </main>
    </div>
  )
}