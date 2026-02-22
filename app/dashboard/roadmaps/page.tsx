'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getGlobalRoadmaps } from '@/app/actions/roadmaps'
import { 
  User, ArrowRight, Search, 
  Clock, Library, Activity, LayoutGrid, Menu, X, Filter, ChevronDown, Check
} from 'lucide-react'

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
    <div className="h-screen bg-[#f8fafc] flex overflow-hidden font-sans text-slate-900 w-full">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 h-full flex-shrink-0 border-r border-slate-200 bg-white z-30 shadow-sm">
        <Sidebar userEmail={user?.email || 'Loading...'} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="font-bold text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                <Library size={16} className="text-yellow-500" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
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
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 justify-between z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Hamburger Icon for Mobile */}
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-yellow-400 hidden sm:flex">
                <Library size={16} />
              </div>
              Architecture Library
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">System Online</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pb-24">
            
            {/* Hero Section */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Protocol Registry
              </h1>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <LayoutGrid size={16} className="text-slate-400" /> Explore specialized engineering roadmaps and architectures.
              </p>
            </div>

            {/* Premium SaaS Control Bar (Search + Dropdown Filter) */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 sticky top-0 z-10 w-full">
              
              {/* Search */}
              <div className="relative w-full flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search protocols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Custom Dropdown Filter */}
              <div className="relative w-full sm:w-64 shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <span className="truncate">{activeTab === 'All' ? 'All Domains' : activeTab}</span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {filterDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-full bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 mb-1">
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
                            ? 'bg-slate-50 text-slate-900 font-bold' 
                            : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{domain === 'All' ? 'All Domains' : domain}</span>
                          {activeTab === domain && <Check size={16} className="text-emerald-500 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="min-h-[300px] bg-white animate-pulse rounded-[1.5rem] border border-slate-200" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {filteredRoadmaps.length > 0 ? (
                  filteredRoadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap.id} roadmap={roadmap} userId={user?.id} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No protocols found</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your search or domain filter to find what you're looking for.</p>
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
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full group">
      
      {/* Card Padding Wrapper */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 h-full">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase tracking-widest rounded-lg">
            {roadmap.domain}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            <Activity size={12} className="text-emerald-500" /> {roadmap.difficulty}
          </span>
        </div>

        {/* Title & Full Description */}
        <div className="flex-1 mb-8">
          <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-slate-700 transition-colors">
            {roadmap.title}
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed break-words">
            {roadmap.description}
          </p>
        </div>

        {/* Bottom Section: Meta + Button */}
        <div className="mt-auto">
          {/* Metadata */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-500 mb-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="uppercase tracking-wider">{roadmap.estimated_total_hours} Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="uppercase tracking-wider">Public</span>
            </div>
          </div>

          {/* SaaS Action Button */}
          <Link 
            href={`/dashboard/roadmaps/${roadmap.id}`} 
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-yellow-400 transition-all active:scale-[0.98] shadow-md border border-slate-800"
          >
            Access Roadmap <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  )
}