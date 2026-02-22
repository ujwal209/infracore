'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Cpu, ArrowRight, AlertCircle, Loader2, 
  Eye, EyeOff, ShieldCheck, Network, Zap, Fingerprint, Sun, Moon
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
      className="p-2 text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* ================= LEFT PANEL (DESKTOP FIXED) ================= */}
      <div className="hidden lg:flex w-[45%] fixed inset-y-0 left-0 bg-slate-900 flex-col justify-center p-12 xl:p-16 overflow-hidden z-10 border-r border-slate-800">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6B8AFF]/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#01005A]/40 rounded-full blur-[100px] pointer-events-none" />

        {/* Pinned Top Logo */}
        <div className="absolute top-10 left-10 xl:left-12 z-20">
          <Link href="/" className="inline-flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <div className="bg-[#01005A] dark:bg-[#6B8AFF]/20 p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-[#01005A]/20 border border-[#6B8AFF]/20">
              <Cpu size={20} className="text-[#6B8AFF]" />
            </div>
            <span className="font-black tracking-tighter uppercase text-2xl italic text-white">
              INFRA<span className="text-[#6B8AFF]">CORE</span>
            </span>
          </Link>
        </div>

        {/* Centered Pitch */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-sm">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Network Synchronized</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            Command Your <br/>
            {/* Highly visible solid color with drop shadow to prevent clipping bugs */}
            <span className="text-[#8B98FF] drop-shadow-[0_2px_15px_rgba(139,152,255,0.2)]">Architecture</span>
          </h1>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
            Access your personalized engineering roadmap, track live market arbitrage, and deploy new skill nodes across 14+ technical domains.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-[#6B8AFF]/50 transition-colors">
                  <Network className="text-[#6B8AFF]" size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Live Domain Mapping</h4>
                  <p className="text-xs text-slate-400 font-medium">Real-time market signals across engineering disciplines.</p>
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-[#6B8AFF]/50 transition-colors">
                  <Zap className="text-[#6B8AFF]" size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">AI-Accelerated Mentorship</h4>
                  <p className="text-xs text-slate-400 font-medium">Automated gap analysis to identify missing skills.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Pinned Bottom Footer */}
        <div className="absolute bottom-10 left-10 xl:left-12 right-10 xl:right-12 z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6">
           <span>© 2026 Infracore System</span>
           <span className="flex items-center gap-2">
             <Fingerprint size={12} className="text-[#6B8AFF]"/> Connection Secure
           </span>
        </div>
      </div>

      {/* ================= RIGHT PANEL (SCROLLABLE CANVAS) ================= */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex flex-col min-h-screen relative bg-slate-50 dark:bg-slate-950">
        
        {/* Desktop Absolute Theme Toggle */}
        <div className="hidden lg:block absolute top-10 right-10 z-50">
          <AuthThemeToggle />
        </div>

        {/* MOBILE HEADER (Only visible on small screens) */}
        <div className="lg:hidden h-20 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 sticky top-0 shadow-sm">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 p-2 rounded-xl shadow-sm border border-[#01005A]/20 dark:border-[#6B8AFF]/20">
              <Cpu size={18} className="text-[#01005A] dark:text-[#6B8AFF]" />
            </div>
            <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900 dark:text-white">
              INFRA<span className="text-[#01005A] dark:text-[#6B8AFF]">CORE</span>
            </span>
          </Link>
          <AuthThemeToggle />
        </div>

        {/* FORM CONTAINER */}
        <main className="flex-1 flex flex-col px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px] mx-auto my-auto relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* The SaaS Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 sm:p-12 relative z-10 w-full">
              
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3 uppercase">
                  Authenticate
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  Enter your credentials to securely access your workspace.
                </p>
              </div>

              {/* Inline Error Block */}
              {error && (
                <div className="mb-8 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-in fade-in zoom-in-95">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}

              {/* Google Social Login */}
              <div className="mb-6">
                <Button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  variant="outline" 
                  className="w-full h-14 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center bg-white dark:bg-slate-900"
                >
                  {loading ? <Loader2 className="animate-spin text-slate-400" size={20} /> : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="bg-white dark:bg-slate-900 px-4">Or sign in with email</span>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                  <Input 
                    name="email" 
                    type="email" 
                    required 
                    className="h-14 px-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-normal" 
                    placeholder="engineer@infracore.io" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1 pr-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Secure Password</label>
                    <Link href="/auth/forgot-password" className="text-[10px] font-black text-[#01005A] dark:text-[#6B8AFF] hover:underline transition-colors uppercase tracking-widest">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="h-14 pl-5 pr-14 rounded-2xl font-semibold bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-normal" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#01005A] dark:bg-[#6B8AFF] text-white hover:bg-[#020080] dark:hover:bg-[#5274FF] font-black h-14 rounded-2xl uppercase mt-8 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(1,0,90,0.25)] dark:shadow-[0_4px_14px_rgba(107,138,255,0.25)] flex items-center justify-center gap-2 tracking-widest text-xs"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Initialize Session <ArrowRight size={16} /></>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-center flex-wrap gap-2">
                  No active node? 
                  <Link href="/auth/signup" className="text-slate-900 dark:text-white hover:text-[#01005A] dark:hover:text-[#6B8AFF] transition-colors border-b border-transparent hover:border-[#01005A] dark:hover:border-[#6B8AFF] pb-0.5">
                    Deploy Account
                  </Link>
                </p>
              </div>
            </div>

            {/* Global Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 shrink-0">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">256-bit Encrypted Connection</span>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  )
}