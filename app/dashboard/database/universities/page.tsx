'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getAllUniversities, getUniversityStates } from '@/app/actions/database/universities'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Globe, 
  MapPin,
  RefreshCcw,
  School,
  Menu,
  X
} from 'lucide-react'

export default function UniversitiesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [states, setStates] = useState<string[]>([])
  
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 12

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      const { data: univs, count: totalCount } = await getAllUniversities({
        page,
        pageSize,
        search,
        state: selectedState
      })
      setData(univs || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [page, search, selectedState])

  useEffect(() => {
    async function init() {
      const { data: st } = await getUniversityStates()
      setStates(st || [])
      fetchData()
    }
    init()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [search, selectedState])

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
                <School size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
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

      {/* Main Work Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950 relative">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm shrink-0">
              <School size={18} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Universities Explorer</h2>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Higher Education Network</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            
            <div className="flex-1 relative max-w-md group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name or AISHE..." 
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
                  className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-700 dark:text-zinc-300"
                >
                  <option value="all">Filter State</option>
                  {states.map((st) => (<option key={st} value={st}>{st}</option>))}
                </select>
                {/* Custom dropdown arrow to match theme */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[500px] transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <th className="px-6 py-4">University Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Established</th>
                    <th className="px-6 py-4">Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm font-medium">
                  {loading ? (Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse opacity-50">
                      <td colSpan={4} className="px-6 py-5.5">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
                      </td>
                    </tr>
                  ))) : data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider text-xs">
                        No Higher Education Entities Found
                      </td>
                    </tr>
                  ) : (
                    data.map((univ, idx) => (
                      <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-5 font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs leading-snug">
                          {univ.name}
                        </td>
                        <td className="px-6 py-5 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wide">
                          {univ.district}, {univ.state}
                        </td>
                        <td className="px-6 py-5 text-zinc-500 dark:text-zinc-400 text-xs">
                          {univ.year_of_establishment || 'N/A'}
                        </td>
                        <td className="px-6 py-5">
                          {univ.website && (
                             <a 
                               href={univ.website.startsWith('http') ? univ.website : `https://${univ.website}`} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-400 dark:text-zinc-500 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors inline-block shadow-sm"
                               title="Visit Website"
                             >
                               <Globe size={14} />
                             </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!loading && data.length > 0 && (
              <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider leading-none">
                  Record { (page-1)*pageSize + 1 } / {count}
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="p-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(p => p + 1)} 
                    className="p-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm"
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