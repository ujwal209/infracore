'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowRight, AlertCircle, Loader2, 
  Eye, EyeOff, Sun, Moon
} from "lucide-react"
import { loginAction, loginWithGoogleAction } from '@/app/actions/auth/login'

// --- THEME TOGGLE COMPONENT FOR AUTH PAGES ---
function AuthThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-10 h-10" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors border border-transparent flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Standard Email/Password Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  // Google OAuth Submission
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    
    const result = await loginWithGoogleAction()
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0a0a0a] font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row">
      
      {/* ================= LEFT PANEL (DESKTOP FIXED) ================= */}
      <div className="hidden lg:flex w-[45%] fixed inset-y-0 left-0 bg-zinc-950 flex-col justify-center p-12 xl:p-16 border-r border-zinc-800 z-10">
        
        {/* Subtle grid background, strictly monochrome */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Pinned Top Logo */}
        <div className="absolute top-10 left-10 xl:left-12 z-20">
          <Link href="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
            <div className="relative w-36 h-10 origin-left">
              <Image 
                src="/logo.png" 
                alt="InferaCore Logo" 
                fill 
                className="object-contain object-left dark:invert invert"
                priority 
              />
            </div>
          </Link>
        </div>

        {/* Centered Pitch */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Access Your <br/>
            <span className="text-blue-500">Workspace</span>
          </h1>
          
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-12">
            Access your personalized engineering roadmap, track live market trends, and build your skills across technical domains.
          </p>
          
          <div className="space-y-6">
             <div className="pl-4 border-l-2 border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-1">Live Market Insights</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed">Real-time job market trends across engineering disciplines.</p>
             </div>

             <div className="pl-4 border-l-2 border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-1">Smart Career Roadmaps</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed">Personalized paths to identify and learn missing skills.</p>
             </div>
          </div>
        </div>

        {/* Pinned Bottom Footer */}
        <div className="absolute bottom-10 left-10 xl:left-12 right-10 xl:right-12 z-10 flex items-center justify-between text-xs font-medium text-zinc-600 border-t border-zinc-800 pt-6">
           <span>© 2026 INFERACORE</span>
           <span>System Operational</span>
        </div>
      </div>

      {/* ================= RIGHT PANEL (SCROLLABLE CANVAS) ================= */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex flex-col min-h-screen relative bg-zinc-50 dark:bg-[#0a0a0a]">
        
        {/* Desktop Absolute Theme Toggle */}
        <div className="hidden lg:block absolute top-8 right-8 z-50">
          <AuthThemeToggle />
        </div>

        {/* MOBILE HEADER */}
        <div className="lg:hidden h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-800 z-30 sticky top-0">
          <Link href="/" className="inline-flex items-center">
            <div className="relative w-28 h-8 origin-left">
              <Image 
                src="/logo.png" 
                alt="InferaCore Logo" 
                fill 
                className="object-contain object-left dark:invert" 
                priority 
              />
            </div>
          </Link>
          <AuthThemeToggle />
        </div>

        {/* FORM CONTAINER */}
        <main className="flex-1 flex flex-col px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[420px] mx-auto my-auto relative">
            
            <div className="bg-white dark:bg-[#111113] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 w-full">
              
              <div className="mb-8 text-left">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-[14px]">
                  Enter your credentials to securely access your account.
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <Button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  variant="outline" 
                  className="w-full h-12 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center bg-white dark:bg-[#111113]"
                >
                  {loading ? <Loader2 className="animate-spin text-zinc-400" size={18} /> : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs font-medium text-zinc-500">
                  <span className="bg-white dark:bg-[#111113] px-2 text-zinc-400">Or continue with email</span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                  <Input 
                    name="email" 
                    type="email" 
                    required 
                    className="h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 transition-colors" 
                    placeholder="user@example.com" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                    <Link href="/auth/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-500 hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="h-11 pl-3 pr-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 transition-colors font-mono" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold h-11 rounded-lg mt-4 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Don't have an account? 
                  <Link href="/auth/signup" className="text-blue-600 dark:text-blue-500 hover:underline transition-colors ml-1.5">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  )
}