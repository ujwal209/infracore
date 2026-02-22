'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Cpu, Loader2, Eye, EyeOff, ShieldCheck, 
  Target, Layers, Zap, ChevronRight, Menu, X, Fingerprint, Lock, AlertCircle
} from "lucide-react"
import { initiateSignup, verifySignupOtp } from '@/app/actions/auth/signup'

export default function SignupPage() {
  const router = useRouter()
  
  // State
  const [step, setStep] = React.useState<'form' | 'otp'>('form')
  const [emailCache, setEmailCache] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  
  // Toggles
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [otp, setOtp] = React.useState('')

  // 1. Submit Initial Form
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError("Security breach: Passwords do not match.")
      setLoading(false)
      return
    }

    const result = await initiateSignup(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setEmailCache(email)
      setStep('otp') // Switch to OTP View
    }
    setLoading(false)
  }

  // 2. Submit OTP
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const result = await verifySignupOtp(emailCache, otp)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-yellow-400 selection:text-slate-900 flex flex-col lg:flex-row">
      
      {/* ================= MOBILE DRAWER MENU ================= */}
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 px-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-xl">
              <Cpu size={20} className="text-yellow-400" />
            </div>
            <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900">
              INFRA<span className="text-yellow-500">CORE</span>
            </span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center gap-3">
            <Layers size={16}/> Return to Nexus
          </Link>
          <Link href="/auth/login" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center gap-3">
            <Lock size={16}/> Existing Node Login
          </Link>
        </div>
      </div>


      {/* ================= LEFT PANEL (DESKTOP FIXED) ================= */}
      <div className="hidden lg:flex w-[45%] fixed inset-y-0 left-0 bg-slate-900 flex-col justify-center p-12 xl:p-16 overflow-hidden z-10 border-r border-slate-800">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Pinned Top Logo */}
        <div className="absolute top-10 left-10 xl:left-12 z-20">
          <Link href="/" className="inline-flex items-center gap-3 group hover:opacity-80 transition-opacity">
            <div className="bg-yellow-400 p-2.5 rounded-xl group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-yellow-400/20">
              <Cpu size={20} className="text-slate-900" />
            </div>
            <span className="font-black tracking-tighter uppercase text-2xl italic text-white">
              INFRA<span className="text-yellow-500">CORE</span>
            </span>
          </Link>
        </div>

        {/* Centered Pitch */}
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-sm">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global Intelligence Protocol</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            Build Your <br/><span className="text-yellow-400">Future Node</span>
          </h1>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
            Join the most advanced engineering intelligence network. Stop guessing what the market wants, and start building what commands a premium.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-yellow-400/50 transition-colors">
                  <Layers className="text-yellow-400" size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Cross-Domain Context</h4>
                  <p className="text-xs text-slate-400 font-medium">Real-time market signals across engineering disciplines.</p>
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-yellow-400/50 transition-colors">
                  <Target className="text-yellow-400" size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Automated Gap Analysis</h4>
                  <p className="text-xs text-slate-400 font-medium">AI identifies missing skills between you and your target role.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Pinned Bottom Footer */}
        <div className="absolute bottom-10 left-10 xl:left-12 right-10 xl:right-12 z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6">
           <span>© 2026 Infracore System</span>
           <span className="flex items-center gap-2">
             <Fingerprint size={12} className="text-emerald-500"/> Vault Active
           </span>
        </div>
      </div>


      {/* ================= RIGHT PANEL (SCROLLABLE CANVAS) ================= */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex flex-col min-h-screen relative bg-slate-50">
        
        {/* MOBILE HEADER (Only visible on small screens) */}
        <div className="lg:hidden h-20 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 z-30 sticky top-0">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-slate-900 p-2 rounded-xl shadow-sm">
              <Cpu size={18} className="text-yellow-400" />
            </div>
            <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900">
              INFRA<span className="text-yellow-500">CORE</span>
            </span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={28} />
          </button>
        </div>

        {/* FORM CONTAINER */}
        <main className="flex-1 flex flex-col px-4 py-12 sm:px-8 lg:px-12">
          
          {/* my-auto is the magic bullet. It centers the form when there's space, but allows normal scrolling without overlapping if the screen is too small! */}
          <div className="w-full max-w-[460px] mx-auto my-auto relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* The SaaS Form Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-200 p-8 sm:p-12 relative z-10 w-full">
              
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3 uppercase">
                  {step === 'form' ? 'Deploy Node' : 'Verify Identity'}
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {step === 'form' ? 'Create your engineering intelligence profile.' : 'Enter the 8-digit authorization code.'}
                </p>
              </div>

              {/* Inline Error Block */}
              {error && (
                <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in zoom-in-95">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}

              {step === 'form' ? (
                <form className="space-y-6" onSubmit={handleSignupSubmit}>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Commander Name</label>
                    <Input 
                      name="name" 
                      required 
                      className="h-14 px-5 rounded-2xl bg-slate-50 border-slate-200 font-semibold text-slate-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-normal" 
                      placeholder="John Doe" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                    <Input 
                      name="email" 
                      type="email" 
                      required 
                      className="h-14 px-5 rounded-2xl bg-slate-50 border-slate-200 font-semibold text-slate-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-normal" 
                      placeholder="engineer@infracore.io" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                    <div className="relative">
                      <Input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        className="h-14 pl-5 pr-14 rounded-2xl font-semibold bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-normal" 
                        placeholder="••••••••" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1">
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Verify Password</label>
                    <div className="relative">
                      <Input 
                        name="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        required 
                        className="h-14 pl-5 pr-14 rounded-2xl font-semibold bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-slate-900 transition-all shadow-sm placeholder:text-slate-400 placeholder:font-normal" 
                        placeholder="••••••••" 
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1">
                        {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl uppercase mt-8 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 tracking-widest text-[11px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>Deploy Account <ChevronRight size={18} /></>
                    )}
                  </Button>
                </form>
              ) : (
                <form className="space-y-6 animate-in slide-in-from-right-8 duration-500" onSubmit={handleOtpSubmit}>
                  <div className="space-y-4 text-center">
                    <Input 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={8}
                      required
                      className="h-24 text-center text-3xl sm:text-4xl font-mono font-bold tracking-[0.4em] pl-[0.4em] rounded-3xl bg-slate-50 border-2 border-slate-200 focus:bg-white focus-visible:ring-0 focus-visible:border-slate-900 transition-all uppercase shadow-inner text-slate-900" 
                      placeholder="--------" 
                    />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5 flex-wrap">
                      <span>Sent to</span>
                      <span className="text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{emailCache}</span>
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading || otp.length < 8} 
                    className="w-full bg-slate-900 text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl uppercase mt-4 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10 tracking-widest text-[11px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
                  </Button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setStep('form')
                      setError(null)
                    }}
                    className="w-full text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mt-6 pt-4 border-t border-slate-100"
                  >
                    Incorrect Email? Abort Process
                  </button>
                </form>
              )}

              {/* Login Link below form inside card */}
              {step === 'form' && (
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center flex-wrap gap-2">
                    Already Authenticated? 
                    <Link href="/auth/login" className="text-slate-900 hover:text-yellow-600 transition-colors border-b border-transparent hover:border-yellow-600 pb-0.5">
                      Access Terminal
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Global Security Badge perfectly spaced below card */}
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 shrink-0">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption Active</span>
            </div>
            
          </div>
        </main>
      </div>

    </div>
  )
}