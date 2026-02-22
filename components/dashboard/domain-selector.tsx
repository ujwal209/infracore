'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, Filter } from 'lucide-react'

const DOMAINS = [
  "Software Engineering",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Data Science",
  "Cybersecurity",
  "Electronics & VLSI",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering"
]

export function DomainSelector({ currentDomain }: { currentDomain: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('domain', e.target.value)
    // Pushing the new URL triggers the Server Component to refetch data
    router.push(pathname + '?' + params.toString())
  }

  return (
    <div className="relative inline-flex items-center group">
      <div className="absolute left-3 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors">
        <Filter size={14} />
      </div>
      <select 
        value={currentDomain}
        onChange={handleChange}
        className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-widest rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-slate-400 hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
      >
        {!DOMAINS.includes(currentDomain) && <option value={currentDomain}>{currentDomain}</option>}
        {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
    </div>
  )
}