'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronsUpDown, Search, Briefcase } from 'lucide-react'

const ENGINEERING_DOMAINS = [
  "Software Engineering",
  "Computer Science",
  "Artificial Intelligence",
  "Data Science",
  "Machine Learning",
  "Electronics and Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Aerospace Engineering",
  "Information Technology",
  "Cyber Security",
  "Robotics and Automation",
  "Biotechnology",
  "Chemical Engineering"
]

export function DomainSelector({ currentDomain }: { currentDomain: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filteredDomains = ENGINEERING_DOMAINS.filter(domain =>
    domain.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (domain: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('domain', domain)
    router.push(`/dashboard?${params.toString()}`)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="relative w-full md:w-[340px]">
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/10"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start truncate">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Market Domain</span>
            <span className="text-[15px] font-bold text-zinc-900 dark:text-white truncate">
              {currentDomain}
            </span>
          </div>
        </div>
        <ChevronsUpDown size={18} className="text-zinc-400 shrink-0 ml-2" />
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute top-full right-0 mt-3 w-full md:w-[380px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* SEARCH INPUT */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
            <Search size={18} className="text-zinc-400 mr-3 shrink-0" />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search engineering domains..."
              className="w-full bg-transparent outline-none text-[15px] font-semibold text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
          </div>

          {/* LIST */}
          <div className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar">
            {filteredDomains.length === 0 ? (
              <p className="p-6 text-center text-sm font-semibold text-zinc-500">No domains found.</p>
            ) : (
              filteredDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleSelect(domain)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold rounded-xl transition-colors ${
                    currentDomain === domain 
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="truncate">{domain}</span>
                  {currentDomain === domain && <Check size={18} strokeWidth={3} className="shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* BACKDROP TO CLOSE */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  )
}