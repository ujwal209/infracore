'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cpu, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck, Network, Zap } from "lucide-react"
import { loginAction } from '@/app/actions/auth/login'

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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

  return (
    <div className="min-h-screen bg-white flex font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* LEFT PANEL: Branding & Intel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-yellow-400 p-2 rounded-xl group-hover:rotate-90 transition-transform duration-500 shadow-sm">
              <Cpu size={24} className="text-black" />
            </div>
            <span className="font-black tracking-tighter uppercase text-2xl italic text-white">
              INFRA<span className="text-yellow-500">CORE</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Network Synchronized</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            Command Your <br/>
            <span className="text-yellow-400">Architecture</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
            Access your personalized engineering roadmap, track live market arbitrage, and deploy new skill nodes across 14+ technical domains.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Network className="text-yellow-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wide">Live Domain Market Mapping</span>
             </div>
             <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Zap className="text-yellow-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wide">AI-Accelerated Mentorship</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6 mt-12">
           <span>© 2026 Infracore System</span>
           <span>v1.0.4 Live</span>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#FDFDFD] relative">
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
                <Cpu size={24} className="text-black" />
              </div>
              <span className="font-black tracking-tighter uppercase text-2xl italic text-slate-900">
                INFRA<span className="text-yellow-500">CORE</span>
              </span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2 uppercase">Authenticate</h2>
            <p className="text-slate-500 text-sm font-medium">Enter your credentials to securely access your workspace.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in zoom-in-95">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
              <Input
                name="email"
                type="email"
                required
                className="h-14 px-4 rounded-2xl bg-white border-slate-200 text-sm font-bold text-slate-900 focus-visible:ring-yellow-400 focus-visible:border-yellow-400 transition-all shadow-sm"
                placeholder="engineer@infracore.io"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Secure Password</label>
                <Link href="/auth/forgot-password" className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="h-14 pl-4 pr-12 rounded-2xl bg-white border-slate-200 text-sm font-bold text-slate-900 focus-visible:ring-yellow-400 focus-visible:border-yellow-400 transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl transition-all shadow-xl shadow-yellow-500/10 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            No active node? 
            <Link href="/auth/signup" className="ml-2 text-black hover:text-yellow-600 transition-colors">
              Deploy Account
            </Link>
          </p>

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-300">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">256-bit Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}