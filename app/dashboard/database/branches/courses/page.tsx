'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getBranchCourses, getAvailableBranches } from '@/app/actions/database/branch-details'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ExternalLink,
  RefreshCcw,
  Cpu,
  Menu,
  X,
  Layers,
  Monitor,
  ChevronDown,
  Check
} from 'lucide-react'

export default function BranchCoursesPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [branches, setBranches] = useState<string[]>([])
  
  const [search, setSearch] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true)
    else setLoading(true)
    
    try {
      const { data: courses, count: totalCount } = await getBranchCourses({
        page,
        pageSize,
        search,
        branch: selectedBranch
      })
      setData(courses || [])
      setCount(totalCount)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [page, search, selectedBranch])

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
  }, [search, selectedBranch])

  const totalPages = Math.ceil(count / pageSize)

  // Filter branches for the custom dropdown
  const filteredBranches = branches.filter(br => 
    br.toLowerCase().includes(branchSearchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans antialiased w-full transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30 shadow-sm">
        <Sidebar userEmail="system@infracore.edu" />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-zinc-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <span className="font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
                <Cpu size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
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
              <BookOpen size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Branch Courses</h2>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">Curated Learning Signals</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors">
              <RefreshCcw size={12} className={`text-zinc-500 dark:text-zinc-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Active Stream</span>
            </div>
          </div>
        </header>

        {/* Data Explorer */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
            <div className="flex-1 relative max-w-md group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses or roles..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              
              {/* CUSTOM SEARCHABLE DROPDOWN */}
              <div className="relative w-full sm:w-64" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-700 dark:text-zinc-300 shadow-sm"
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
          <div className="bg-white dark:bg-zinc-950 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col min-h-[500px] transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Course & Role</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Platform</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Branch</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loading ? (Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse opacity-60">
                      <td className="px-6 py-5.5 space-y-2"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-3/4"></div><div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md w-1/4"></div></td>
                      <td className="px-6 py-5.5"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-24"></div></td>
                      <td className="px-6 py-5.5"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-24"></div></td>
                      <td className="px-6 py-5.5"><div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-md w-20"></div></td>
                    </tr>
                  ))) : data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                          <BookOpen size={40} className="opacity-20" />
                          <p className="text-sm font-semibold uppercase tracking-wider">No Courses Mapped</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((course, idx) => (
                      <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-5 min-w-[250px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {course.course_name}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                              {course.job_role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                            <Monitor size={14} className="text-blue-500 dark:text-blue-400" /> 
                            {course.platform}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                            {course.branch_name}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <a 
                            href={course.course_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg hover:bg-blue-500 transition-all shadow-sm active:scale-95 group/btn"
                          >
                            Enroll <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
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
                  Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="text-zinc-900 dark:text-white">{Math.min(page * pageSize, count)}</span> of <span className="text-zinc-900 dark:text-white">{count}</span> Courses
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