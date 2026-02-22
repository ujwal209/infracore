'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth/logout'
import { 
  Cpu, 
  LayoutDashboard, 
  Map as MapIcon, 
  MessageSquare, 
  LogOut, 
  Settings,
  ShieldCheck,
  Loader2,
  FileText,
  User,
  Search
} from 'lucide-react'

interface SidebarProps {
  userEmail?: string
  loading?: boolean
}

export function Sidebar({ userEmail, loading = false }: SidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState('')

  // Grouped navigation for a more professional SaaS structure
  const navGroups = [
    {
      label: 'Platform Core',
      items: [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Roadmaps', path: '/dashboard/roadmaps', icon: MapIcon },
        { name: 'AI Mentor', path: '/dashboard/chat', icon: MessageSquare },
        { name: 'Resume Analyzer', path: '/dashboard/resume', icon: FileText },
      ]
    },
    {
      label: 'Account',
      items: [
        { name: 'Profile', path: '/dashboard/profile', icon: User },
      ]
    }
  ]

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6">
          <Loader2 className="animate-spin text-[#01005A] dark:text-[#6B8AFF]" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50 font-sans border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* 1. Branding Header */}
      <div className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <Link href="/" className="inline-flex items-center gap-2 group min-w-0">
          <div className="bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-500 shadow-sm border border-[#01005A]/20 dark:border-[#6B8AFF]/20 shrink-0">
            <Cpu size={16} className="text-[#01005A] dark:text-[#6B8AFF]" />
          </div>
          <span className="font-black tracking-tighter uppercase text-lg italic text-slate-900 dark:text-white truncate">
            INFRA<span className="text-[#01005A] dark:text-[#6B8AFF]">CORE</span>
          </span>
        </Link>
      </div>

      {/* 2. Menu Filter (SaaS Style) */}
      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#01005A] dark:group-focus-within:text-[#6B8AFF] transition-colors" />
          <input 
            type="text"
            placeholder="Filter menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#01005A] dark:focus:ring-[#6B8AFF] focus:border-transparent transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
          />
        </div>
      </div>

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-4 pb-6 overflow-y-auto custom-scrollbar space-y-6 mt-2">
        {navGroups.map((group, idx) => {
          // Filter items based on search query
          const filteredItems = group.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )

          // Hide group if all items are filtered out
          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="px-2 mb-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
                  {group.label}
                </p>
              </div>
              
              {filteredItems.map((item) => {
                // Smart active state: highlights exact match for dashboard, and sub-routes for others
                const isActive = item.path === '/dashboard' 
                  ? pathname === item.path 
                  : pathname.startsWith(item.path)
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all min-w-0 group ${
                      isActive 
                        ? 'bg-[#01005A] dark:bg-[#6B8AFF] text-white shadow-md shadow-[#01005A]/20 dark:shadow-[#6B8AFF]/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-[#01005A] dark:hover:text-[#6B8AFF] border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-sm'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive 
                          ? "text-white" 
                          : "text-slate-400 dark:text-slate-500 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF]"
                      }`} 
                    />
                    <span className="tracking-wide uppercase text-[11px] truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}

        {/* Empty state for filter */}
        {searchQuery && navGroups.every(g => g.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && (
          <div className="text-center py-6 px-2">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No modules found matching "{searchQuery}"</p>
          </div>
        )}
      </nav>

      {/* 4. Footer / User Settings */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        
        {/* Connection Status Badge */}
        <div className="mb-4 px-3 flex items-center gap-2 min-w-0">
           <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">Secure Node Active</span>
        </div>

        {/* User Identity Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-2 flex items-center justify-between group cursor-pointer hover:border-[#01005A]/30 dark:hover:border-[#6B8AFF]/50 hover:shadow-sm transition-all min-w-0">
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors truncate">
              Identity Operator
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate pr-2">
              {userEmail || 'Engineer'}
            </p>
          </div>
          <Settings size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors shrink-0 group-hover:rotate-45 duration-300" />
        </div>

        {/* Secure Logout Action */}
        <form action={logoutAction}>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut size={16} /> Disconnect Session
          </button>
        </form>

      </div>
    </div>
  )
}