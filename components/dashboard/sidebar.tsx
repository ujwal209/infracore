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
  Search,
  Database,
  Trophy,
  Briefcase,
  TrendingUp,
  Map,
  Code,
  Building2,
  School,
  BookOpen,
  User
} from 'lucide-react'

interface SidebarProps {
  userEmail?: string
  loading?: boolean
}

export function Sidebar({ userEmail, loading = false }: SidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState('')

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
      label: 'Knowledge Base',
      items: [
        { name: 'AICTE Branches', path: '/dashboard/database/branches', icon: Database },
        { name: 'Universities', path: '/dashboard/database/universities', icon: Building2 },
        { name: 'Eng. Colleges', path: '/dashboard/database/colleges', icon: School },
        { name: 'NIRF Engineering', path: '/dashboard/database/rankings/engineering', icon: Trophy },
        { name: 'NIRF University', path: '/dashboard/database/rankings/university', icon: Trophy },
      ]
    },
    {
      label: 'Career Intelligence',
      items: [
        { name: 'Branch Courses', path: '/dashboard/database/branches/courses', icon: BookOpen },
        { name: 'Job Roles', path: '/dashboard/database/branches/roles', icon: Briefcase },
        { name: 'Salaries', path: '/dashboard/database/branches/salaries', icon: TrendingUp },
        { name: 'Roadmaps', path: '/dashboard/database/branches/roadmaps', icon: Map },
        { name: 'Tech Domains', path: '/dashboard/database/branches/domains', icon: Code },
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
      <div className="h-full w-full flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50 font-sans border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      
      {/* 1. Branding Header */}
      <div className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <Link href="/" className="inline-flex items-center gap-2 group min-w-0">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-500 shadow-sm border border-blue-100 dark:border-blue-500/20 shrink-0">
            <Cpu size={16} className="text-blue-600 dark:text-blue-500" />
          </div>
          <span className="font-bold tracking-tight uppercase text-lg italic text-zinc-900 dark:text-white truncate">
            INFERA<span className="text-blue-600 dark:text-blue-500">CORE</span>
          </span>
        </Link>
      </div>

      {/* 2. Menu Filter */}
      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Filter menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 shadow-sm"
          />
        </div>
      </div>

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-4 pb-6 overflow-y-auto custom-scrollbar space-y-6 mt-2">
        {navGroups.map((group, idx) => {
          const filteredItems = group.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="px-2 mb-2">
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                  {group.label}
                </p>
              </div>
              
              {filteredItems.map((item) => {
                const isActive = item.path === '/dashboard' 
                  ? pathname === item.path 
                  : pathname.startsWith(item.path)
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all min-w-0 group ${
                      isActive 
                        ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-sm'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive 
                          ? "text-white" 
                          : "text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-500"
                      }`} 
                    />
                    <span className="tracking-wide truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}

        {searchQuery && navGroups.every(g => g.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && (
          <div className="text-center py-6 px-2">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">No modules found matching "{searchQuery}"</p>
          </div>
        )}
      </nav>

      {/* 4. Footer / User Settings */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        
        {/* Connection Status Badge */}
        <div className="mb-4 px-3 flex items-center gap-2 min-w-0">
           <ShieldCheck size={14} className="text-blue-500 shrink-0" />
           <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">Secure Node Active</span>
        </div>

        {/* User Identity Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 mb-2 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 dark:hover:border-blue-500/40 hover:shadow-sm transition-all min-w-0">
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              Identity Operator
            </p>
            <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate pr-2">
              {userEmail || 'Engineer'}
            </p>
          </div>
          <Settings size={16} className="text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0 group-hover:rotate-45 duration-300" />
        </div>

        {/* Secure Logout Action */}
        <form action={logoutAction}>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-200 dark:hover:border-zinc-700 border border-transparent transition-all"
          >
            <LogOut size={16} /> Disconnect Session
          </button>
        </form>

      </div>
    </div>
  )
}