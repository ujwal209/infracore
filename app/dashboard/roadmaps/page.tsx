'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getGlobalRoadmaps } from '@/app/actions/roadmaps'
import { 
  User, ArrowRight, Search, 
  Clock, Library, Activity, LayoutGrid, Menu, X, Filter, ChevronDown, Check,Cpu,
  Sun, Moon
} from 'lucide-react'

// --- THEME TOGGLE COMPONENT ---
function DashboardThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" /> // Placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600 shrink-0"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default function RoadmapsCatalogPage() {
  const [allRoadmaps, setAllRoadmaps] = useState<any[]>([])
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Mobile UI & Dropdown State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Click outside to close filter dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { roadmaps } = await getGlobalRoadmaps(user.id)
      setAllRoadmaps(roadmaps || [])
      setFilteredRoadmaps(roadmaps || [])
      setLoading(false)
    }
    init()
  }, [])

  // Filtering Logic
  useEffect(() => {
    let result = allRoadmaps

    if (activeTab !== 'All') {
      result = result.filter(r => r.domain.toLowerCase() === activeTab.toLowerCase())
    }

    if (searchQuery) {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRoadmaps(result)
  }, [searchQuery, activeTab, allRoadmaps])

  const domains = ['All', ...Array.from(new Set(allRoadmaps.map(r => r.domain)))]

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden font-sans text-slate-900 dark:text-slate-50 w-full selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white transition-colors duration-300">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail={user?.email || 'Loading...'} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-slate-200 dark:border-slate-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                <Cpu size={16} className="text-[#01005A] dark:text-[#6B8AFF]" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar userEmail={user?.email || 'Loading...'} />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sm:px-6 justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Hamburger Icon for Mobile */}
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-3">
              <div className="hidden sm:flex w-8 h-8 bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 border border-[#01005A]/10 dark:border-[#6B8AFF]/20 rounded-lg items-center justify-center text-[#01005A] dark:text-[#6B8AFF] shadow-sm shrink-0 transition-colors">
                <Library size={16} />
              </div>
              Architecture_Library
            </h2>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            
            <DashboardThemeToggle />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">System Online</span>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors cursor-pointer shrink-0">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-32">
            
            {/* Hero Section */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                Protocol Registry
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <LayoutGrid size={16} className="text-[#01005A] dark:text-[#6B8AFF]" /> Explore specialized engineering roadmaps and architectures.
              </p>
            </div>

            {/* Premium SaaS Control Bar (Search + Dropdown Filter) */}
            <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 sticky top-4 z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              
              {/* Search */}
              <div className="relative w-full flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#01005A] dark:group-focus-within:text-[#6B8AFF] transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search protocols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#01005A] dark:focus:ring-[#6B8AFF] focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                />
              </div>

              {/* Custom Dropdown Filter */}
              <div className="relative w-full sm:w-64 shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all outline-none focus:ring-2 focus:ring-[#01005A] dark:focus:ring-[#6B8AFF] focus:border-transparent"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Filter size={16} className="text-[#01005A] dark:text-[#6B8AFF] shrink-0" />
                    <span className="truncate">{activeTab === 'All' ? 'All Domains' : activeTab}</span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {filterDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                      Filter by Domain
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => {
                            setActiveTab(domain)
                            setFilterDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            activeTab === domain 
                            ? 'bg-slate-50 dark:bg-slate-800 text-[#01005A] dark:text-[#6B8AFF] font-bold' 
                            : 'text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="truncate">{domain === 'All' ? 'All Domains' : domain}</span>
                          {activeTab === domain && <Check size={16} className="text-[#01005A] dark:text-[#6B8AFF] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="min-h-[300px] bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                {filteredRoadmaps.length > 0 ? (
                  filteredRoadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap.id} roadmap={roadmap} userId={user?.id} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900/50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#01005A]/5 dark:bg-[#6B8AFF]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#01005A]/10 dark:border-[#6B8AFF]/20">
                      <Search className="text-[#01005A] dark:text-[#6B8AFF]" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No protocols found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Try adjusting your search or domain filter to find what you're looking for.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

function RoadmapCard({ roadmap, userId }: { roadmap: any, userId: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-[#01005A]/5 dark:hover:shadow-[#6B8AFF]/10 hover:border-[#01005A]/30 dark:hover:border-[#6B8AFF]/50 transition-all duration-300 flex flex-col h-full group">
      
      {/* Card Padding Wrapper */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 h-full">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="px-3 py-1 bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 text-[#01005A] dark:text-[#6B8AFF] border border-[#01005A]/20 dark:border-[#6B8AFF]/30 text-[10px] font-black uppercase tracking-widest rounded-lg">
            {roadmap.domain}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            <Activity size={12} className="text-emerald-500" /> {roadmap.difficulty}
          </span>
        </div>

        {/* Title & Full Description */}
        <div className="flex-1 mb-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors">
            {roadmap.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed break-words">
            {roadmap.description}
          </p>
        </div>

        {/* Bottom Section: Meta + Button */}
        <div className="mt-auto">
          {/* Metadata */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-500 mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#01005A] dark:text-[#6B8AFF]" />
              <span className="uppercase tracking-wider">{roadmap.estimated_total_hours} Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="uppercase tracking-wider text-slate-500 dark:text-slate-400">Public</span>
            </div>
          </div>

          {/* SaaS Action Button */}
          <Link 
            href={`/dashboard/roadmaps/${roadmap.id}`} 
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#01005A] dark:bg-[#6B8AFF] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#020080] dark:hover:bg-[#5274FF] transition-all active:scale-[0.98] shadow-md shadow-[#01005A]/20 dark:shadow-[#6B8AFF]/20 border border-transparent"
          >
            Access Roadmap <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  )
}