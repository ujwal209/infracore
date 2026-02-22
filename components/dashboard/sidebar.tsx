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
      <div className="h-full w-full flex flex-col bg-white border-r border-slate-200">
        <div className="h-16 border-b border-slate-200 flex items-center px-6">
          <Loader2 className="animate-spin text-slate-300" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#FDFDFD] font-sans border-r border-slate-200">
      
      {/* 1. Branding Header */}
      <div className="h-16 flex-shrink-0 border-b border-slate-200 flex items-center px-6 bg-white/50 backdrop-blur-sm z-10">
        <Link href="/" className="inline-flex items-center gap-2 group min-w-0">
          <div className="bg-slate-900 p-1.5 rounded-lg group-hover:rotate-90 transition-transform duration-500 shadow-sm shrink-0">
            <Cpu size={16} className="text-yellow-400" />
          </div>
          <span className="font-black tracking-tighter uppercase text-lg italic text-slate-900 truncate">
            INFRA<span className="text-yellow-500">CORE</span>
          </span>
        </Link>
      </div>

      {/* 2. Menu Filter (SaaS Style) */}
      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input 
            type="text"
            placeholder="Filter menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400 shadow-sm"
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
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
                        ? 'bg-slate-900 text-yellow-400 shadow-md shadow-slate-900/10' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-yellow-400" : "text-slate-400 group-hover:text-slate-900"}`} 
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
            <p className="text-xs text-slate-400 font-medium">No modules found matching "{searchQuery}"</p>
          </div>
        )}
      </nav>

      {/* 4. Footer / User Settings */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
        
        {/* Connection Status Badge */}
        <div className="mb-4 px-3 flex items-center gap-2 min-w-0">
           <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">Secure Node Active</span>
        </div>

        {/* User Identity Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-2 flex items-center justify-between group cursor-pointer hover:border-slate-400 hover:shadow-sm transition-all min-w-0">
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 group-hover:text-slate-600 transition-colors truncate">
              Identity Operator
            </p>
            <p className="text-xs font-bold text-slate-900 truncate pr-2">
              {userEmail || 'Engineer'}
            </p>
          </div>
          <Settings size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
        </div>

        {/* Secure Logout Action */}
        <form action={logoutAction}>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent transition-all"
          >
            <LogOut size={16} /> Disconnect Session
          </button>
        </form>

      </div>
    </div>
  )
}