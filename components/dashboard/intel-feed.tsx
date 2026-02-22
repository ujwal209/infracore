'use client'

import * as React from 'react'
import { getEngineeringIntel } from '@/app/actions/intel'
import { Activity, ExternalLink, Loader2, ShieldAlert } from 'lucide-react'

interface IntelFeedProps {
  targetDomain: string
  coreInterests: string[]
}

export function IntelFeed({ targetDomain, coreInterests }: IntelFeedProps) {
  const [news, setNews] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      const res = await getEngineeringIntel(targetDomain, coreInterests)
      if (res.success) {
        setNews(res.results)
      } else {
        setError(res.error || 'Failed to sync intelligence.')
      }
      setLoading(false)
    }

    fetchNews()
  }, [targetDomain, coreInterests])

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col h-full">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
            <h4 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Activity size={18} className="text-yellow-400" /> 
                Live Market Intel
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Filtered for: {targetDomain || 'General'}
            </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Sync Active</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
        {loading ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="animate-spin mb-3 text-yellow-400" size={28} />
                <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Establishing Uplink...</span>
            </div>
        ) : error ? (
            <div className="h-40 flex flex-col items-center justify-center text-red-400 bg-red-400/10 rounded-xl border border-red-400/20 p-4 text-center">
                <ShieldAlert size={24} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
            </div>
        ) : news.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                No active signals found.
            </div>
        ) : (
            news.map((item, idx) => (
                <a 
                    key={idx} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-yellow-400/50 p-5 rounded-xl transition-all relative overflow-hidden"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                                {new URL(item.url).hostname.replace('www.', '')}
                            </span>
                            <h5 className="text-sm font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2">
                                {item.title}
                            </h5>
                        </div>
                        <ExternalLink size={16} className="text-slate-500 group-hover:text-yellow-400 transition-colors shrink-0 mt-1" />
                    </div>
                </a>
            ))
        )}
      </div>
    </div>
  )
}