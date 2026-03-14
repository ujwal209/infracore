'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth/logout'
import { 
  Home,
  Newspaper,
  User,
  MessageSquare,
  Loader2,
  Settings,
  LogOut
} from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  userEmail?: string
  loading?: boolean
}

export function Sidebar({ userEmail, loading = false }: SidebarProps) {
  const pathname = usePathname()

  const navGroups = [
    {
      label: 'Intelligence Terminal',
      items: [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'News Feed', path: '/news', icon: Newspaper },
        { name: 'AI Mentor', path: '/dashboard/chat', icon: MessageSquare },
        { name: 'Profile', path: '/profile', icon: User },
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
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#09090b] font-sans border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300">
      
      {/* 1. Branding Header - High Spacing & Centered */}
      <div className="h-24 flex-shrink-0 flex items-center px-8 z-10 pt-4">
        <Link href="/" className="inline-flex items-center group transition-transform hover:scale-[1.02]">
          <Image 
            src="/logo.png" 
            alt="Infracore Logo" 
            width={180} 
            height={60} 
            className="h-10 w-auto object-contain transition-all dark:invert dark:brightness-[10]"
            priority
          />
        </Link>
      </div>

      <div className="px-6 mb-8 mt-4">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent opacity-50" />
      </div>

      {/* 2. Main Navigation - Professional Spacing */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar space-y-8">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <div className="px-4 mb-4">
              <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                {group.label}
              </p>
            </div>
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.path === '/dashboard' 
                  ? pathname === item.path 
                  : pathname.startsWith(item.path)
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all group relative ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25' 
                        : 'text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <item.icon 
                      size={20} 
                      className={`shrink-0 transition-all ${
                        isActive ? "text-white scale-110" : "text-zinc-400 group-hover:text-blue-600"
                      }`} 
                    />
                    <span className="tracking-wide">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Footer / User Settings */}
      <div className="flex-shrink-0 p-6 mt-auto">
        
        {/* User Identity Area */}
        <div className="relative group mb-6 px-2">
          <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800/50 pt-8">
            <div className="flex flex-col min-w-0">
               <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Authenticated As</p>
               <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate pr-4">{userEmail || 'operator'}</h4>
            </div>
            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:text-blue-600 transition-colors border border-zinc-100 dark:border-zinc-800">
               <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 px-2">
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="w-full group flex items-center justify-between px-5 py-3.5 rounded-2xl text-[12px] font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-zinc-100 dark:border-zinc-800"
            >
              <span className="group-hover:translate-x-1 transition-transform">Disconnect Session</span>
              <LogOut size={16} className="opacity-60" />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}