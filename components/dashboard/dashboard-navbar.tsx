'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { logoutAction } from '@/app/actions/auth/logout'
import { getQuizHistory } from '@/app/actions/study'
import { 
  User, Bell, Menu, X, Home, 
  Newspaper, MessageSquare, LogOut,
  Sun, Moon, Star, BookOpen, Sparkles, Clock, CheckCircle2, Target
} from 'lucide-react'

interface DashboardNavbarProps {
  userEmail?: string
  avatarUrl?: string | null
}

const NAV_LINKS = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'News Feed', path: '/news-feed', icon: Newspaper },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Reviews', path: '/review', icon: Star },
]

// --- NOTIFICATION TYPES ---
interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  link: string
}

// Default payload injected if DB is empty
const DEFAULT_LOCAL_NOTIFICATIONS: NotificationItem[] = []

// Helper to format time nicely
function timeSince(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// --- THEME TOGGLE COMPONENT ---
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => setMounted(true), [])
  
  if (!mounted) return <div className="w-9 h-9" />
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#111113] rounded-xl transition-all duration-200 flex items-center justify-center outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export function DashboardNavbar({ userEmail, avatarUrl }: DashboardNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  
  // Notification State
  const [isNotifOpen, setIsNotifOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const notifRef = React.useRef<HTMLDivElement>(null)

  // FETCH LIVE QUIZ HISTORY FROM DB
  React.useEffect(() => {
    setMounted(true);
    
    const loadLiveNotifications = async () => {
      try {
        const history = await getQuizHistory();
        
        if (history && history.length > 0) {
          // Take the top 3 most recent quizzes and format them into notifications
          const dynamicNotifs: NotificationItem[] = history.slice(0, 3).map((record: any) => {
            let title = 'Assessment Graded';
            const percentage = (record.score / record.total_questions) * 100;

            if (percentage === 100) {
              title = 'Perfect Score!';
            } else if (percentage < 60) {
              title = 'Review Recommended';
            }

            return {
              id: record.id,
              title: title,
              message: `You scored ${record.score}/${record.total_questions} on "${record.topic}".`,
              time: timeSince(record.created_at),
              unread: true, // New fetched items start unread
              link: '/dashboard/chat/study' // ✅ Fixed Route
            };
          });

          setNotifications(dynamicNotifs);
        } else {
          // Fallback if no history yet
          setNotifications(DEFAULT_LOCAL_NOTIFICATIONS);
        }
      } catch (err) {
        console.error("Failed to load live notifications", err);
        setNotifications(DEFAULT_LOCAL_NOTIFICATIONS);
      }
    };

    loadLiveNotifications();
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length

  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileOpen])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const handleNotifClick = (link: string, id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n))
    setIsNotifOpen(false)
    router.push(link)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Outfit:wght@100..900&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif !important; }
        .font-google-sans { font-family: 'Google Sans', sans-serif !important; }
      `}} />

      <header className="h-[64px] sm:h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0c0c0e] border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-40 relative transition-colors duration-300 sticky top-0 font-outfit">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#111113] rounded-xl transition-all outline-none"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="transition-transform hover:scale-[1.02] outline-none">
            <Image
              src="/logo.png"
              alt="InfraCore"
              width={140}
              height={36}
              className="h-6 sm:h-7 w-auto object-contain dark:invert opacity-95"
              priority
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? pathname === item.path 
              : pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full font-google-sans text-[13px] font-bold transition-all duration-300 outline-none border ${
                  isActive 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm' 
                    : 'bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#111113] hover:border-zinc-200 dark:hover:border-zinc-800'
                }`}
              >
                <item.icon 
                  size={15} 
                  className={isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors'} 
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle />

          {/* NOTIFICATION CENTER */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl transition-all duration-200 outline-none ${
                isNotifOpen 
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#111113]'
              }`}
            >
              <Bell size={18} />
              {mounted && unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white dark:border-[#0c0c0e]"></span>
                </span>
              )}
            </button>

            {isNotifOpen && mounted && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-[#111113]/50">
                  <h3 className="font-google-sans text-[14px] font-bold text-zinc-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotifClick(notif.link, notif.id)}
                          className={`p-5 flex gap-4 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/40 last:border-0 ${
                            notif.unread 
                            ? 'bg-blue-50/30 dark:bg-blue-500/5 hover:bg-blue-50 dark:hover:bg-blue-500/10' 
                            : 'hover:bg-zinc-50 dark:hover:bg-[#111113]'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${notif.unread ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className={`text-[14px] truncate ${notif.unread ? 'font-bold text-zinc-900 dark:text-white' : 'font-semibold text-zinc-700 dark:text-zinc-300'}`}>
                                {notif.title}
                              </h4>
                              {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 dark:bg-zinc-200 shrink-0" />}
                            </div>
                            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                            <span className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-zinc-400">
                              <Clock size={10} /> {notif.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                        <Bell size={20} />
                      </div>
                      <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-300">You're all caught up!</p>
                      <p className="text-[13px] text-zinc-400 mt-1">Check back later for new updates.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1.5" />

          <Link href="/profile" className="flex items-center gap-3 pl-1 group outline-none cursor-pointer">
            <div className="hidden sm:flex flex-col items-end min-w-0">
              <span className="font-google-sans text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {userEmail?.split('@')[0] || 'Operator'}
              </span>
            </div>

            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-500/30 transition-all duration-300 shadow-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} className="text-zinc-400" />
              )}
            </div>
          </Link>

          {/* Desktop Sign Out */}
          <div className="hidden sm:block">
            <form action={logoutAction}>
              <button 
                type="submit" 
                className="p-2 ml-1 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all outline-none"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-zinc-900/20 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <div className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] bg-[#fafafa] dark:bg-[#0c0c0e] flex flex-col border-r border-zinc-200 dark:border-zinc-800/80 shadow-[20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[20px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out font-outfit
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="h-[64px] sm:h-[72px] flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800/80 shrink-0 bg-white dark:bg-[#050505]">
          <Image
            src="/logo.png"
            alt="InfraCore"
            width={110}
            height={28}
            className="h-6 w-auto object-contain dark:invert opacity-95"
          />
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#111113] rounded-xl transition-all outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto space-y-2 custom-scrollbar">
          <p className="font-google-sans px-4 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-[0.15em]">
            Platform Menu
          </p>
          
          {NAV_LINKS.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? pathname === item.path 
              : pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-google-sans text-[15px] font-bold transition-all duration-200 outline-none ${
                  isActive 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#111113] hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-5 mt-auto border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#050505]">
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-google-sans text-[14px] font-bold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 outline-none group"
            >
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Secure Sign Out
            </button>
          </form>
        </div>
      </div>
    </>
  )
}