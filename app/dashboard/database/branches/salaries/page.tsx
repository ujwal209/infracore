'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getBranchSalaries } from '@/app/actions/database/branch-details'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  RefreshCcw,
  Cpu,
  Menu,
  X,
  ExternalLink,
  DollarSign,
  Briefcase,
  Activity
} from 'lucide-react'

export default function BranchSalariesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 12

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      const { data: salaries, count: totalCount } = await getBranchSalaries({
        page,
        pageSize,
        search
      })
      setData(salaries || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [search])

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans antialiased w-full transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* Sidebar */}
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
                <TrendingUp size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
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
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm shrink-0">
              <TrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Economic Yields</h2>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">Salary Benchmark Index</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            <div className="flex-1 relative max-w-md group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Filter by branch..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm" 
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => fetchData(true)} 
                className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center h-[38px] w-[38px] shrink-0"
                title="Refresh Data"
              >
                <RefreshCcw size={16} className={isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''} />
              </button>
            </div>
          </div>

          {/* Grid Cards Container */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {loading ? (Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] animate-pulse shadow-sm"></div>
            ))) : data.length === 0 ? (
                <div className="col-span-full h-40 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm gap-3 text-zinc-400 dark:text-zinc-500">
                  <TrendingUp size={32} className="opacity-20" />
                  <span className="font-semibold text-xs tracking-wider uppercase">No Economic Records Found</span>
                </div>
            ) : (
              data.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-950 rounded-[2rem] p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full">
                  <div className="flex flex-col h-full gap-8">
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-5">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Engineering Sector</span>
                        <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{item.branch_name}</h3>
                      </div>
                      <a 
                        href={item.salary_source_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors shadow-sm shrink-0"
                        title="View Source"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-auto">
                      
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider leading-none">
                           <Briefcase size={12} className="text-blue-500 dark:text-blue-400" /> Freshers
                         </div>
                         <div className="text-2xl font-semibold text-zinc-900 dark:text-white leading-none">
                           {item.freshers_salary_lpa}
                           <span className="text-[10px] font-medium ml-1 text-zinc-400 dark:text-zinc-500">LPA</span>
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider leading-none">
                           <TrendingUp size={12} className="text-emerald-500 dark:text-emerald-400" /> Experience
                         </div>
                         <div className="text-2xl font-semibold text-zinc-900 dark:text-white leading-none">
                           {item.experienced_salary_lpa}
                           <span className="text-[10px] font-medium ml-1 text-zinc-400 dark:text-zinc-500">LPA</span>
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider leading-none">
                           <DollarSign size={12} className="text-blue-500 dark:text-blue-400" /> Global
                         </div>
                         <div className="text-2xl font-semibold text-zinc-900 dark:text-white leading-none truncate" title={item.international_salary_usd}>
                           {item.international_salary_usd.split(' ')[0]}
                           <span className="text-[10px] font-medium ml-1 text-zinc-400 dark:text-zinc-500">USD</span>
                         </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Dock */}
          {!loading && data.length > 0 && (
            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * pageSize, count)}</span> of <span className="text-zinc-900 dark:text-white">{count}</span> Records
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
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
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all shadow-sm ${
                          page === pageNum 
                            ? 'bg-blue-600 text-white shadow-blue-500/20' 
                            : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
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
                  className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}