'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getNirfRankings, getRankingStates } from '@/app/actions/database/rankings'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Trophy,
  Database,
  Menu,
  X,
  MapPin,
  RefreshCcw,
  Building2,
  ChevronDown,
  Check
} from 'lucide-react'

export default function EngineeringRankingsPage() {
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

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [stateSearchQuery, setStateSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      const { data: rankings, count: totalCount } = await getNirfRankings({
        type: 'engineering',
        page,
        pageSize,
        search,
        state: selectedState
      })
      setData(rankings || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [page, search, selectedState])

  useEffect(() => {
    async function init() {
      const { data: st } = await getRankingStates('engineering')
      setStates(st || [])
      fetchData()
    }
    init()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [search, selectedState])

  const totalPages = Math.ceil(count / pageSize)
  
  // Filter states for the custom dropdown
  const filteredStates = states.filter(st => 
    st.toLowerCase().includes(stateSearchQuery.toLowerCase())
  )

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
                <Trophy size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
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
              <Trophy size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Engineering Rankings</h2>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">NIRF Performance Metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
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
                placeholder="Search institutions..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              
              {/* CUSTOM SEARCHABLE DROPDOWN */}
              <div className="relative w-full sm:w-64" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-700 dark:text-zinc-300 shadow-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin size={16} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{selectedState === 'all' ? 'All States' : selectedState}</span>
                  </div>
                  <ChevronDown size={14} className={`text-zinc-400 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 relative">
                      <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search state..." 
                        value={stateSearchQuery}
                        onChange={(e) => setStateSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 transition-all"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
                      <button 
                        onClick={() => { setSelectedState('all'); setIsDropdownOpen(false); setStateSearchQuery(''); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedState === 'all' 
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium'
                        }`}
                      >
                        All States
                        {selectedState === 'all' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                      </button>
                      
                      {filteredStates.length > 0 ? (
                        filteredStates.map((st) => (
                          <button 
                            key={st}
                            onClick={() => { setSelectedState(st); setIsDropdownOpen(false); setStateSearchQuery(''); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                              selectedState === st 
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium'
                            }`}
                          >
                            <span className="truncate text-left">{st}</span>
                            {selectedState === st && <Check size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                          No states found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => fetchData(true)}
                className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center h-[38px] w-[38px] shrink-0"
                title="Refresh Data"
              >
                <RefreshCcw size={16} className={isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-950 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[500px] flex flex-col transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <th className="px-6 py-4 w-24 text-center">Rank</th>
                    <th className="px-6 py-4">Institution</th>
                    <th className="px-6 py-4">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {loading ? (Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse opacity-60">
                      <td className="px-6 py-5.5"><div className="h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-8 mx-auto"></div></td>
                      <td className="px-6 py-5.5"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4"></div></td>
                      <td className="px-6 py-5.5"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4"></div></td>
                    </tr>
                  ))) : data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                          <Trophy size={40} className="opacity-20" />
                          <p className="text-sm font-semibold uppercase tracking-wider">No Rankings Identified</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold shadow-sm ${
                            parseInt(item.rank) <= 3 
                              ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400' 
                              : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                          }`}>
                            {item.rank}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.name}
                        </td>
                        <td className="px-6 py-5 text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide">
                          {item.city}, {item.state}
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
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Entry { (page-1)*pageSize + 1 } - { Math.min(page*pageSize, count) } of {count}
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