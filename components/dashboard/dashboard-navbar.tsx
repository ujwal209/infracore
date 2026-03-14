'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { logoutAction } from '@/app/actions/auth/logout'
import { 
  LayoutGrid, 
  Rss, 
  Sparkles, 
  UserCircle, 
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react'

export function DashboardNavbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutGrid },
    { name: 'Insights', path: '/news', icon: Rss },
    { name: 'AI Mentor', path: '/dashboard/chat', icon: Sparkles },
    { name: 'Account', path: '/profile', icon: UserCircle },
  ]

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'E'

  return (
    <>
      {/* 1. DESKTOP NAVBAR */}
      <nav className="h-16 flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-6 sm:px-10 z-50 sticky top-0">
        
        <div className="flex items-center w-1/4">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={160} 
              height={40} 
              className="h-8 w-auto object-contain dark:invert brightness-110" 
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
            {navItems.map((item) => {
              const isActive = item.path === '/dashboard' ? pathname === item.path : pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                    isActive 
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <item.icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="uppercase tracking-tight">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/4">
          <ThemeToggle />
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black shadow-md">
                {userInitial}
              </div>
              <ChevronDown size={14} className="text-zinc-400" />
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 min-w-[200px]">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-900 mb-1">
                  <p className="text-sm font-bold truncate">{userEmail || 'Engineer'}</p>
                </div>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                  <Settings size={16} /> Settings
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <LogOut size={16} /> Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. SLIM MOBILE NAVIGATION */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-[340px] h-14 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl flex items-center justify-around z-50">
        {navItems.map((item) => {
          const isActive = item.path === '/dashboard' ? pathname === item.path : pathname.startsWith(item.path)
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110' : 'scale-100'} />
              <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">
                {item.name.split(' ')[0]} {/* Keeps labels short (e.g., "AI Mentor" -> "AI") */}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}