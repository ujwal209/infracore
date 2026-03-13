'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getBranchRoadmaps, getAvailableBranches } from '@/app/actions/database/branch-details'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Map, 
  RefreshCcw,
  Cpu,
  Menu,
  X,
  Layers,
  Lightbulb,
  Rocket,
  Zap,
  ChevronDown,
  Check
} from 'lucide-react'

export default function BranchRoadmapsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [branchSearchQuery, setBranchSearchQuery] = useState('')
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: roadmaps, count: totalCount } = await getBranchRoadmaps({
        page,
        pageSize,
        branch: selectedBranch
      })
      setData(roadmaps || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
    }
  }, [page, selectedBranch])

  useEffect(() => {
    async function init() {
      const { data: br } = await getAvailableBranches()
      setBranches(br || [])
      fetchData()
    }
    init()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [selectedBranch])

  const totalPages = Math.ceil(count / pageSize)

  // Filter branches for the custom dropdown
  const filteredBranches = branches.filter(br => 
    br.toLowerCase().includes(branchSearchQuery.toLowerCase())
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
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-zinc-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <span className="font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
                <Map size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-hidden"><Sidebar userEmail="system@infracore.edu" /></div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950 relative">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
             <button className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg shrink-0 transition-colors" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={20} />
             </button>
             <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm shrink-0">
               <Map size={18} />
             </div>
             <div className="min-w-0">
               <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Branch Roadmaps</h2>
               <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">Strategic Career Protocols</p>
             </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Action Header */}
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-colors">
             
             {/* CUSTOM SEARCHABLE DROPDOWN */}
             <div className="relative w-full sm:w-72" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-700 dark:text-zinc-300 shadow-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers size={16} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{selectedBranch === 'all' ? 'All Branches' : selectedBranch}</span>
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
                        placeholder="Search branch..." 
                        value={branchSearchQuery}
                        onChange={(e) => setBranchSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 transition-all"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
                      <button 
                        onClick={() => { setSelectedBranch('all'); setIsDropdownOpen(false); setBranchSearchQuery(''); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedBranch === 'all' 
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium'
                        }`}
                      >
                        All Branches
                        {selectedBranch === 'all' && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                      </button>
                      
                      {filteredBranches.length > 0 ? (
                        filteredBranches.map((br) => (
                          <button 
                            key={br}
                            onClick={() => { setSelectedBranch(br); setIsDropdownOpen(false); setBranchSearchQuery(''); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                              selectedBranch === br 
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium'
                            }`}
                          >
                            <span className="truncate text-left">{br}</span>
                            {selectedBranch === br && <Check size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                          No branches found
                        </div>
                      )}
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* Cards Container */}
          <div className="space-y-6 pb-10">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 animate-pulse shadow-sm"></div>
              ))
            ) : data.length === 0 ? (
               <div className="h-40 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm gap-3 text-zinc-400 dark:text-zinc-500">
                 <Map size={32} className="opacity-20" />
                 <span className="font-semibold text-xs tracking-wider uppercase">No Strategic Data Available</span>
               </div>
            ) : (
              data.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-950 rounded-[2rem] p-6 sm:p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col gap-8">
                      
                      {/* Card Header */}
                      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
                         <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Strategic Pathway</span>
                         <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{item.branch_name}</h3>
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                         
                         {/* Project Ideas Section */}
                         <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                               <Lightbulb size={16} className="text-amber-500" /> Project Initialization
                            </h4>
                            <div className="space-y-4">
                               {item.project_ideas.split('.').map((idea: string, i: number) => idea.trim() && (
                                 <div key={i} className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 mt-2" />
                                    {idea.trim()}
                                 </div>
                               ))}
                            </div>
                         </div>

                         {/* Internship Prep Section */}
                         <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                               <Rocket size={16} className="text-blue-500" /> Professional Prep
                            </h4>
                            <div className="space-y-4">
                               {item.internship_preparation.split('.').map((prep: string, i: number) => prep.trim() && (
                                 <div key={i} className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0 mt-2" />
                                    {prep.trim()}
                                 </div>
                               ))}
                            </div>
                         </div>

                      </div>
                   </div>
                </div>
              ))
            )}

            {/* Pagination Dock */}
            {!loading && data.length > 0 && (
              <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * pageSize, count)}</span> of <span className="text-zinc-900 dark:text-white">{count}</span> Roadmaps
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
        </div>
      </main>
    </div>
  )
}