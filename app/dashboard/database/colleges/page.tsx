'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getEngineeringColleges, getCollegeStates } from '@/app/actions/database/colleges'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Database,
  Cpu,
  Menu,
  X,
  ExternalLink,
  MapPin,
  RefreshCcw,
  Hash,
  GraduationCap
} from 'lucide-react'

export default function CollegesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [states, setStates] = useState<string[]>([])
  
  // Filter States
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      const { data: colleges, count: totalCount } = await getEngineeringColleges({
        page,
        pageSize,
        search,
        state: selectedState
      })
      setData(colleges || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [page, search, selectedState])

  useEffect(() => {
    async function init() {
      const { data: st } = await getCollegeStates()
      setStates(st || [])
      fetchData()
    }
    init()
  }, [fetchData])

  // Reset page on search or state change
  useEffect(() => {
    setPage(1)
  }, [search, selectedState])

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans antialiased w-full transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30 shadow-sm">
        <Sidebar userEmail="system@infracore.edu" />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-zinc-200 dark:border-zinc-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Cpu size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar userEmail="system@infracore.edu" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950 relative">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0 border border-blue-100 dark:border-blue-500/20">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Engineering Colleges</h2>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">Technical Institution Directory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-md">
              <RefreshCcw size={12} className={`text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Active Service</span>
            </div>
          </div>
        </header>

        {/* Explorer Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            <div className="flex-1 relative max-w-md group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search colleges by name/AISHE..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer text-zinc-700 dark:text-zinc-300 transition-all"
                >
                  <option value="all">Everywhere</option>
                  {states.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              
              <button 
                onClick={() => fetchData(true)}
                className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm shrink-0"
              >
                <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-950 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[500px] transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      College Details
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      State / Region
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Discovery
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5.5 space-y-2">
                          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-3/4"></div>
                          <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md w-1/4"></div>
                        </td>
                        <td className="px-6 py-5.5"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-32"></div></td>
                        <td className="px-6 py-5.5"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-md w-24"></div></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                          <Database size={40} className="opacity-20" />
                          <p className="text-sm font-semibold uppercase tracking-wider">No Colleges Found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((college, idx) => (
                      <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-5 min-w-[300px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {college.name}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Hash size={10} /> {college.aishe_code || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-blue-500 dark:text-blue-400" />
                            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                              {college.state}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {college.website && college.website !== '#' ? (
                            <a 
                              href={college.website.startsWith('http') ? college.website : `https://${college.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-[10px] font-semibold uppercase tracking-wider rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all shadow-sm active:scale-95 group/btn"
                            >
                              Explore Portal <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">No Link Available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Dock */}
            {!loading && data.length > 0 && (
              <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * pageSize, count)}</span> of <span className="text-zinc-900 dark:text-white">{count}</span> Institutions
                </p>
                
                <div className="flex items-center gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && page > 3) {
                        pageNum = page - 3 + i;
                        if (pageNum + 4 > totalPages) pageNum = totalPages - 4 + i;
                      }
                      if (pageNum <= 0) return null;
                      if (pageNum > totalPages) return null;

                      return (
                        <button 
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                            page === pageNum 
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}