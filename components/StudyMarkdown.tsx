'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  BookOpen, CheckCircle2, X, Sparkles, Check, 
  Loader2, BarChart, ArrowRight, Copy, Maximize2, Download 
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

// ==========================================
// WIDGETS
// ==========================================

export const QuizWidget = ({ topic, questions, question, options, correctIndex, explanation, onAnswerSubmitted, sessionId, isHistorical }: any) => {
  const quizList = questions || [{ question, options, correctIndex, explanation }]
  
  const [selectedMap, setSelectedMap] = useState<Record<number, number>>(
    isHistorical ? quizList.reduce((acc: any, _: any, i: number) => ({...acc, [i]: quizList[i].correctIndex}), {}) : {}
  )
  const [submitted, setSubmitted] = useState(isHistorical || false)
  const [saving, setSaving] = useState(false)

  const isAllAnswered = Object.keys(selectedMap).length === quizList.length

  const handleSubmit = async () => {
    if (!isAllAnswered || submitted || isHistorical) return
    setSubmitted(true)
    setSaving(true)
    
    let score = 0
    quizList.forEach((q: any, i: number) => {
      if (selectedMap[i] === q.correctIndex) score++
    })

    if (sessionId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('study_quiz_results').insert({
          session_id: sessionId,
          user_id: user.id,
          topic: topic || 'General Concept',
          question: `Exam: ${quizList.length} Questions`,
          is_correct: score === quizList.length
        })
      }
    }
    setSaving(false)

    const feedbackMsg = `I submitted the assessment and scored ${score} out of ${quizList.length}. Let's continue.`
    if (onAnswerSubmitted) onAnswerSubmitted(feedbackMsg)
  }

  return (
    <div className="my-8 rounded-2xl sm:rounded-[2rem] bg-white dark:bg-[#0c0c0e] border border-blue-200/60 dark:border-blue-900/50 shadow-2xl shadow-blue-500/5 w-full max-w-full sm:max-w-3xl font-outfit overflow-hidden flex flex-col">
      <div className="bg-zinc-50 dark:bg-[#111113] border-b border-zinc-100 dark:border-zinc-800/80 px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 w-full min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-sm">
            <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-google-sans text-[12px] sm:text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-0.5 truncate">
              {quizList.length > 1 ? 'Comprehensive Assessment' : 'Knowledge Check'}
            </h3>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate w-full">{topic}</p>
          </div>
        </div>
        {isHistorical && (
          <span className="shrink-0 ml-2 px-2 sm:px-3 py-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5">
            <CheckCircle2 size={13} /> <span className="hidden sm:inline">Completed</span>
          </span>
        )}
      </div>
      
      <div className="p-4 sm:p-6 md:p-8 space-y-10 sm:space-y-12 w-full">
        {quizList.map((q: any, qIndex: number) => (
          <div key={qIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full" style={{ animationDelay: `${qIndex * 100}ms` }}>
            <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5">
              {quizList.length > 1 && (
                <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[13px] sm:text-[14px] shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
              )}
              <div className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 dark:text-white leading-relaxed prose prose-zinc dark:prose-invert max-w-none prose-p:my-0 prose-headings:my-0 break-words w-full">
                <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[[rehypeKatex, { strict: false }]]}>
                  {q.question}
                </ReactMarkdown>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3 ml-0 sm:ml-10 md:ml-11 w-full">
              {q.options.map((opt: string, i: number) => {
                let stateClass = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300"
                let badgeClass = "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                
                if (submitted) {
                  if (i === q.correctIndex) {
                    stateClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20 shadow-sm"
                    badgeClass = "bg-emerald-500 text-white shadow-sm"
                  } else if (i === selectedMap[qIndex]) {
                    stateClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 shadow-sm"
                    badgeClass = "bg-red-500 text-white shadow-sm"
                  } else {
                    stateClass = "border-zinc-200 dark:border-zinc-800 opacity-40"
                  }
                } else {
                  if (selectedMap[qIndex] === i) {
                    stateClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 ring-2 ring-blue-500/20 shadow-sm"
                    badgeClass = "bg-blue-500 text-white shadow-sm"
                  } else {
                    stateClass += " hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={submitted}
                    onClick={() => setSelectedMap(prev => ({...prev, [qIndex]: i}))}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex items-start sm:items-center gap-3 sm:gap-4 ${stateClass}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold font-mono text-[12px] sm:text-[13px] shrink-0 transition-colors mt-0.5 sm:mt-0 ${badgeClass}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="text-[14px] sm:text-[15px] leading-snug prose prose-zinc dark:prose-invert max-w-none prose-p:my-0 break-words flex-1 min-w-0 pt-1 sm:pt-0">
                      <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[[rehypeKatex, { strict: false }]]}>
                        {opt}
                      </ReactMarkdown>
                    </div>
                    {submitted && i === q.correctIndex && <CheckCircle2 size={18} className="text-emerald-500 ml-2 shrink-0 self-center sm:self-auto" />}
                    {submitted && i === selectedMap[qIndex] && i !== q.correctIndex && <X size={18} className="text-red-500 ml-2 shrink-0 self-center sm:self-auto" />}
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div className="mt-4 sm:mt-5 ml-0 sm:ml-10 md:ml-11 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 text-[14px] sm:text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 flex items-start gap-2.5 sm:gap-3 w-full overflow-hidden">
                <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert max-w-none w-full break-words">
                  <span className="font-bold text-zinc-900 dark:text-white mr-2">Explanation:</span>
                  <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[[rehypeKatex, { strict: false }]]}>
                    {q.explanation}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}

        {!isHistorical && (
          <div className="pt-5 sm:pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-6 sm:mt-8">
            <button 
              onClick={handleSubmit} 
              disabled={!isAllAnswered || submitted || saving}
              className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[15px] sm:text-[16px] rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : submitted ? <><Check size={20} /> Assessment Recorded</> : 'Submit Assessment'}
            </button>
            {!isAllAnswered && !submitted && (
              <p className="text-center text-zinc-400 text-[12px] sm:text-[13px] font-medium mt-3">
                Answer all {quizList.length} questions to submit
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const ProgressWidget = ({ topic, masteryPercentage, completedConcepts, nextConcept }: any) => {
  const radius = 80;
  const arc = Math.PI * radius; 
  const percentage = Math.max(0, Math.min(100, masteryPercentage || 0));
  const offset = arc - (percentage / 100) * arc;

  return (
    <div className="my-6 sm:my-8 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-200/50 dark:border-blue-900/50 w-full max-w-full sm:max-w-2xl font-outfit shadow-xl shadow-blue-500/5 overflow-hidden">
      <div className="flex items-center justify-between mb-8 sm:mb-10 w-full">
        <div className="flex items-center gap-3 sm:gap-4 w-full min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <BarChart size={20} className="text-white sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-google-sans text-[10px] sm:text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-0.5 sm:mb-1">Live Tracker</h3>
            <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-tight truncate w-full">{topic}</p>
          </div>
        </div>
      </div>
      
      <div className="relative flex justify-center items-end h-[90px] sm:h-[110px] mb-8 sm:mb-10 w-full">
        <svg className="w-[180px] sm:w-[220px] h-full drop-shadow-md" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet">
          <path 
            d="M 20 90 A 80 80 0 0 1 180 90" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="14" 
            strokeLinecap="round" 
            className="text-zinc-200 dark:text-zinc-800" 
          />
          <path 
            d="M 20 90 A 80 80 0 0 1 180 90" 
            fill="none" 
            stroke="url(#progress-gradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeDasharray={arc} 
            strokeDashoffset={offset} 
            className="transition-all duration-1000 ease-out" 
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" /> 
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 sm:mt-1.5">Mastery</span>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 sm:mb-3">Mastered Concepts</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {completedConcepts?.length > 0 ? completedConcepts.map((c: string, i: number) => (
              <span key={i} className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[12px] sm:text-[13px] font-bold rounded-xl border border-emerald-500/20 flex items-center gap-1.5 shadow-sm break-words max-w-full">
                <CheckCircle2 size={13} className="shrink-0" /> <span className="truncate">{c}</span>
              </span>
            )) : (
              <span className="text-zinc-400 text-[13px] sm:text-sm italic">Learning in progress...</span>
            )}
          </div>
        </div>
        
        <div className="p-4 sm:p-5 bg-white/60 dark:bg-black/20 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm w-full">
          <p className="text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">Up Next</p>
          <p className="text-[14px] sm:text-[16px] font-semibold text-zinc-900 dark:text-zinc-200 flex items-start sm:items-center gap-2 break-words w-full">
            <ArrowRight size={18} className="text-blue-500 shrink-0 mt-0.5 sm:mt-0" /> 
            <span>{nextConcept}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const extractTextFromNode = (node: any): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (node && node.props && node.props.children) return extractTextFromNode(node.props.children);
  return '';
};

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Copy message">
      {copied ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Copy size={15} />}
    </button>
  );
};

export const CodeCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 text-zinc-400 hover:text-white transition-all rounded-md hover:bg-zinc-700 shrink-0"
    >
      {copied ? (
        <>
          <CheckCircle2 size={12} className="text-emerald-400" />
          <span className="text-[10px] font-google-sans font-bold uppercase tracking-wider text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span className="text-[10px] font-google-sans font-bold uppercase tracking-wider">Copy</span>
        </>
      )}
    </button>
  );
};

export const InteractiveImage = ({ src, alt }: { src?: string; alt?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!src || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = alt ? `${alt.replace(/\s+/g, '-').toLowerCase()}.png` : 'infera-generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(src, '_blank'); 
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative group my-4 sm:my-6 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 cursor-zoom-in shadow-sm transition-all hover:shadow-md max-w-full sm:max-w-lg w-full"
      >
        <img 
          src={src} 
          alt={alt || 'Generated output'} 
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-2 font-google-sans font-bold text-[12px] sm:text-[13px] shadow-xl transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Maximize2 size={14} className="sm:w-4 sm:h-4" />
            <span>Expand Image</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 sm:-top-12 right-0 left-0 flex justify-between items-center px-2">
              <span className="text-white/70 font-google-sans text-[12px] sm:text-[13px] font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">
                {alt || 'Generated Image'}
              </span>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <img 
              src={src} 
              alt={alt || 'Expanded output'} 
              className="w-auto h-auto max-w-full max-h-[75vh] sm:max-h-[80vh] rounded-lg shadow-2xl object-contain bg-zinc-900/50" 
            />
            <div className="absolute -bottom-14 sm:-bottom-16 flex justify-center w-full">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-google-sans font-bold text-[13px] sm:text-[14px] shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isDownloading ? <Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" /> : <Download size={16} className="sm:w-[18px] sm:h-[18px]" />}
                <span>{isDownloading ? 'Downloading...' : 'Download Image'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ==========================================
// CUSTOM MARKDOWN COMPONENT BUILDER
// ==========================================

export const getCustomComponents = ({ sessionId, onAnswerSubmitted, isLast, isTyping }: { sessionId?: string | null, onAnswerSubmitted?: any, isLast?: boolean, isTyping?: boolean }) => {
  return {
    // ENFORCED RESPONSIVE TABLE WRAPPER
    table: ({ children }: any) => (
      <div className="my-4 sm:my-6 w-full max-w-full overflow-x-auto rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse text-sm font-outfit min-w-[350px] sm:min-w-[500px]">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead className="bg-zinc-50 dark:bg-[#111113] text-zinc-500 dark:text-zinc-400 font-google-sans font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">{children}</thead>,
    th: ({ children }: any) => <th className="px-3 py-2 sm:px-4 sm:py-3 border-r border-zinc-200 dark:border-zinc-800 last:border-0 whitespace-nowrap">{children}</th>,
    td: ({ children }: any) => <td className="px-3 py-2 sm:px-4 sm:py-3 border-r border-zinc-100 dark:border-zinc-800/50 last:border-0 border-b border-zinc-100 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-300 font-medium break-words">{children}</td>,
    
    // RESPONSIVE TYPOGRAPHY
    h3: ({ children }: any) => <h3 className="font-google-sans text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-6 sm:mt-8 mb-3 sm:mb-4 break-words w-full">{children}</h3>,
    h2: ({ children }: any) => <h2 className="font-google-sans text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 sm:mt-10 mb-4 sm:mb-6 break-words w-full">{children}</h2>,
    h1: ({ children }: any) => <h1 className="font-google-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 sm:mt-10 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-zinc-200 dark:border-zinc-800 break-words w-full">{children}</h1>,
    p: ({ children }: any) => <p className="mb-4 font-outfit text-[15.5px] sm:text-[16px] leading-relaxed text-zinc-800 dark:text-zinc-300 break-words w-full">{children}</p>,
    
    // RESPONSIVE LISTS
    ul: ({ children }: any) => <ul className="list-disc pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 mb-4 font-outfit text-[15px] sm:text-[16px] text-zinc-800 dark:text-zinc-300 w-full break-words">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 mb-4 font-outfit text-[15px] sm:text-[16px] text-zinc-800 dark:text-zinc-300 w-full break-words">{children}</ol>,
    li: ({ children, ...props }: any) => <li className="pl-1 leading-relaxed marker:text-zinc-400 dark:marker:text-zinc-600 break-words w-full" {...props}>{children}</li>,
    
    strong: ({ children }: any) => <strong className="font-bold text-zinc-900 dark:text-white">{children}</strong>,
    
    a: ({ node, href, children, ...props }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 font-semibold transition-colors break-all sm:break-words" 
        {...props}
      >
        {children}
        <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[9px] font-google-sans uppercase font-bold px-1.5 py-0.5 rounded ml-1 align-middle whitespace-nowrap">
          Source
        </span>
      </a>
    ),

    blockquote: ({ children }: any) => {
      const text = extractTextFromNode(children).trim();
      return (
        <div className="w-full mt-4 mb-4 p-4 sm:p-5 bg-blue-50/50 dark:bg-[#111113] border border-blue-200/50 dark:border-zinc-800 rounded-xl sm:rounded-2xl flex items-start gap-2.5 sm:gap-3 shadow-sm max-w-full overflow-hidden">
          <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <span className="leading-snug text-[14px] sm:text-[15px] font-outfit font-semibold text-zinc-700 dark:text-zinc-300 break-words flex-1 min-w-0">{text}</span>
        </div>
      )
    },

    img: ({ src, alt }: any) => <InteractiveImage src={src} alt={alt} />,

    // RESPONSIVE CODE BLOCKS
    code: ({ node, className, inline, children, ...props }: any) => {
      const text = String(children).replace(/\n$/, '');
      const match = /language-([a-zA-Z0-9_?\-]+)/.exec(className || '');
      let lang = match ? match[1] : '';

      // Auto-detect missing tags if the text strongly resembles our JSON widgets
      if (lang === '' && text.trim().startsWith('{') && text.trim().includes('"component"')) {
        lang = 'json';
      }

      if (!inline && (lang === 'json?chameleon' || lang === 'json')) {
        let parsed = null;
        let isWidget = false;

        try {
          parsed = JSON.parse(text);
        } catch (err) {
          try {
            const fixedStr = text.replace(/\\(?!["\\/bfnrt])/g, '\\\\');
            parsed = JSON.parse(fixedStr);
          } catch (err2) {
            parsed = null;
          }
        }

        if (parsed && (parsed.component === 'QuizWidget' || parsed.component === 'ProgressWidget')) {
          isWidget = true;
          if (parsed.component === 'QuizWidget') {
            return <QuizWidget {...parsed.props} sessionId={sessionId} onAnswerSubmitted={onAnswerSubmitted} isHistorical={!isLast} />;
          }
          if (parsed.component === 'ProgressWidget') {
            return <ProgressWidget {...parsed.props} />;
          }
        }

        if (!parsed && isTyping) {
          return (
            <div className="my-4 sm:my-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 flex items-center gap-2 sm:gap-3 text-blue-600 dark:text-blue-400 shadow-inner animate-pulse w-full">
              <Loader2 className="animate-spin shrink-0 w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className="font-google-sans font-bold text-[11px] sm:text-[13px] uppercase tracking-widest break-words flex-1">Generating Interactive Module...</span>
            </div>
          );
        }
      }

      // Standard Syntax Highlighting (for normal code or broken JSON)
      if (!inline && lang) {
        return (
          <div className="relative my-4 w-full max-w-full overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="bg-zinc-50 dark:bg-[#111113] px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center w-full">
              <span className="font-google-sans font-bold tracking-wider uppercase truncate max-w-[60%]">
                {lang.replace('?chameleon', '') || 'code'}
              </span>
              <CodeCopyButton text={text} />
            </div>
            {/* The wrapper below forces horizontal scrolling within the code block instead of breaking the parent container */}
            <div className="w-full overflow-x-auto custom-scrollbar bg-white dark:bg-[#0c0c0e]">
              <SyntaxHighlighter
                style={oneDark}
                language={lang.replace('?chameleon', '')}
                PreTag="div"
                className="!m-0 !bg-transparent !p-4 sm:!p-5 min-w-fit"
                codeTagProps={{ className: "text-[12px] sm:text-[14px] font-mono leading-relaxed text-zinc-800 dark:text-zinc-200" }}
              >
                {text}
              </SyntaxHighlighter>
            </div>
          </div>
        )
      }

      // Inline code
      return (
        <code className={`${inline ? 'bg-zinc-100 dark:bg-[#1f1f22] text-zinc-900 dark:text-zinc-200 px-1.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800/50' : 'block p-3 sm:p-4 bg-zinc-50 dark:bg-[#0c0c0e] text-zinc-800 dark:text-zinc-200 overflow-x-auto max-w-full w-full custom-scrollbar'} font-mono text-[0.85em] font-semibold break-words`} {...props}>
          {children}
        </code>
      );
    }
  }
}