'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { createClient } from '@/utils/supabase/client'
// Adjust this import path to wherever your getSessionUser function actually lives
import { getSessionUser } from '@/app/auth/get-user' 
import { Sun, Moon, Menu, X, User, LayoutDashboard, LogOut, Layers, Lock } from "lucide-react"

// STRICT ROUTING ORDER: Features -> About -> How It Works
const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' }
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all flex items-center justify-center outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [user, setUser] = React.useState<{ id: string; avatar_url: string | null; email?: string; full_name?: string } | null>(null)
  
  // Independent dropdown states so desktop and mobile don't conflict
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = React.useState(false)
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = React.useState(false)
  
  const [isLoading, setIsLoading] = React.useState(true)
  
  const desktopDropdownRef = React.useRef<HTMLDivElement>(null)
  const mobileDropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    getSessionUser().then((data) => { 
      if (data) setUser(data as any) 
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : 'unset' }, [isOpen])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setIsDesktopDropdownOpen(false)
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null); 
    setIsDesktopDropdownOpen(false); 
    setIsMobileDropdownOpen(false);
    setIsOpen(false);
    router.refresh()
  }

  // --- REUSABLE AVATAR DROPDOWN COMPONENT ---
  const UserAvatarDropdown = ({ 
    isOpenState, 
    setIsOpenState, 
    dropdownRef,
    isMobile = false
  }: { 
    isOpenState: boolean, 
    setIsOpenState: (v: boolean) => void, 
    dropdownRef: React.RefObject<HTMLDivElement>,
    isMobile?: boolean
  }) => {
    
    if (isLoading) {
      return <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse border border-zinc-200 dark:border-zinc-700" />
    }

    if (!user && !isMobile) {
      return (
        <>
          <Link href="/auth/login" className="font-google-sans text-[14px] font-bold tracking-tight text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-2 outline-none">Sign In</Link>
          <Link href="/auth/signup" className="font-google-sans bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-bold tracking-tight px-6 py-2.5 rounded-full transition-all shadow-md active:scale-95 outline-none">Get Started</Link>
        </>
      )
    }

    if (!user && isMobile) {
      return null; // On mobile, if not logged in, we let the hamburger menu handle Login/Signup
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpenState(!isOpenState)} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:ring-2 ring-blue-500/50 dark:ring-blue-500/40 transition-all overflow-hidden border border-zinc-200 dark:border-zinc-700 outline-none shadow-sm"
        >
          {user?.avatar_url ? (
            <Image src={user.avatar_url} alt="Profile" width={40} height={40} className="object-cover w-full h-full" unoptimized />
          ) : (
            <User size={18} className="text-zinc-500 dark:text-zinc-400" />
          )}
        </button>
        
        {isOpenState && (
          <div className={`absolute ${isMobile ? 'right-0 top-12' : 'right-0 mt-3'} w-64 bg-white/95 dark:bg-[#111113]/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50`}>
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-2">
              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate font-google-sans">{user?.full_name || 'User'}</p>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="px-2">
              <Link 
                href="/dashboard" 
                onClick={() => { setIsOpenState(false); setIsOpen(false); }} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <LayoutDashboard size={16} className="text-blue-500" /> Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 font-outfit ${
        scrolled || isOpen ? 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-b border-zinc-200/60 dark:border-zinc-800/60 py-3 shadow-sm' : 'bg-transparent py-4 sm:py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center group shrink-0 outline-none z-[101]">
            <Image src="/logo.png" alt="InfraCore" width={140} height={35} className="w-[110px] sm:w-[140px] h-auto object-contain object-left dark:invert opacity-95 transition-opacity group-hover:opacity-100 shrink-0" priority />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-google-sans text-[13px] font-bold tracking-wider uppercase transition-colors outline-none ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* DESKTOP CONTROLS */}
          <div className="hidden md:flex items-center gap-3 relative z-[101]">
            <ThemeToggle />
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <UserAvatarDropdown 
              isOpenState={isDesktopDropdownOpen} 
              setIsOpenState={setIsDesktopDropdownOpen} 
              dropdownRef={desktopDropdownRef} 
            />
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex items-center gap-2 md:hidden z-[101]">
            <ThemeToggle />
            
            {/* Show Avatar on Mobile ONLY if user is logged in */}
            {user && (
              <div className="mx-1">
                <UserAvatarDropdown 
                  isOpenState={isMobileDropdownOpen} 
                  setIsOpenState={setIsMobileDropdownOpen} 
                  dropdownRef={mobileDropdownRef}
                  isMobile={true}
                />
              </div>
            )}

            <button 
              className="p-2 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors outline-none" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl md:hidden flex flex-col h-[100dvh] animate-in fade-in duration-300 pt-24 px-6 pb-8 overflow-y-auto">
          
          <div className="flex flex-col gap-6 flex-1">
            {NAV_LINKS.map((item, i) => (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsOpen(false)} 
                className="text-4xl font-google-sans font-extrabold tracking-tight text-zinc-900 dark:text-white animate-in slide-in-from-bottom-4 fade-in hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Only show Login/Signup on mobile menu if NOT logged in */}
          {!user && !isLoading && (
            <div className="flex flex-col gap-3 mt-auto pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <Link 
                href="/auth/login" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 text-center border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full font-google-sans font-bold text-[16px] text-zinc-900 dark:text-white transition-all shadow-sm"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-full font-google-sans font-bold text-[16px] shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      )}
    </>
  )
}