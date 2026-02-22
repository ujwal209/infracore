'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cpu, AlertCircle, Loader2, ShieldCheck, KeyRound, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import { initiateRecovery, verifyRecoveryOtp, updatePassword } from '@/app/actions/auth/forgot-password'

export default function ForgotPasswordPage() {
  const router = useRouter()
  
  // State: 'email' -> 'otp' -> 'password'
  const [step, setStep] = React.useState<'email' | 'otp' | 'password'>('email')
  const [emailCache, setEmailCache] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Input states
  const [otp, setOtp] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // STEP 1: Request Email
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const email = new FormData(e.currentTarget).get('email') as string
    
    const result = await initiateRecovery(new FormData(e.currentTarget))
    if (result.error) setError(result.error)
    else { setEmailCache(email); setStep('otp') }
    setLoading(false)
  }

  // STEP 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    
    const result = await verifyRecoveryOtp(emailCache, otp)
    if (result.error) setError(result.error)
    else setStep('password')
    setLoading(false)
  }

  // STEP 3: Update Password
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true); setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError("Security breach: Keys do not match."); setLoading(false); return
    }

    const result = await updatePassword(password)
    if (result.error) setError(result.error)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-row font-sans selection:bg-red-400 selection:text-black">
      
      {/* LEFT PANEL: Red Security Theme */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />

        <div className="relative z-10 flex justify-start">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-yellow-400 p-2 rounded-xl group-hover:rotate-90 transition-transform duration-500 shadow-sm">
              <Cpu size={24} className="text-black" />
            </div>
            <span className="font-black tracking-tighter uppercase text-2xl italic text-white">INFRA<span className="text-yellow-500">CORE</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md mr-auto text-left mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-6 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Security Override</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            System <br/><span className="text-red-400">Recovery</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
            Initiate a secure protocol to recover your neural link. Verify your designation to recalibrate your cryptographic keys.
          </p>

          <div className="space-y-4 flex flex-col items-start">
             <div className="flex items-center justify-start gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit hover:bg-white/10 transition-colors">
                <KeyRound className="text-yellow-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wide">Identity Verification</span>
             </div>
             <div className="flex items-center justify-start gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit hover:bg-white/10 transition-colors">
                <ShieldCheck className="text-yellow-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wide">Secure Token Exchange</span>
             </div>
             <div className="flex items-center justify-start gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit hover:bg-white/10 transition-colors">
                <Lock className="text-yellow-400" size={24} />
                <span className="text-sm font-bold uppercase tracking-wide">AES-256 Recalibration</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6 mt-12">
           <span>© 2026 Infracore System</span>
           <span>v1.0.4 Live</span>
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#FDFDFD] relative overflow-y-auto">
        <div className="absolute top-8 left-8">
           <Link href="/auth/login" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={14} /> Abort Request
           </Link>
        </div>

        <div className="w-full max-w-[420px] py-10">
          
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center justify-center gap-2 group mb-2">
              <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
                <Cpu size={24} className="text-black" />
              </div>
              <span className="font-black tracking-tighter uppercase text-2xl italic text-slate-900">
                INFRA<span className="text-yellow-500">CORE</span>
              </span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2 uppercase">
              {step === 'email' ? 'Identify Node' : step === 'otp' ? 'Verify Code' : 'New Key Entry'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {step === 'email' && 'Enter your email to receive recovery instructions.'}
              {step === 'otp' && `Enter the 8-digit code sent to ${emailCache}`}
              {step === 'password' && 'Input your new access code below.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in zoom-in-95">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {step === 'email' && (
            <form className="space-y-5 animate-in slide-in-from-right-4" onSubmit={handleEmailSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                <Input name="email" type="email" required className="h-14 px-4 rounded-2xl bg-white border-slate-200 font-bold" placeholder="engineer@infracore.io" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-black text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl uppercase mt-4 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "REQUEST OVERRIDE"}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form className="space-y-5 animate-in slide-in-from-right-4" onSubmit={handleOtpSubmit}>
              <div className="space-y-4 text-center">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Authorization Code</label>
                <Input 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  maxLength={8} 
                  required 
                  className="h-20 text-center text-[32px] font-black tracking-[0.4em] pl-[0.4em] rounded-2xl bg-slate-50 border-2 border-slate-200 focus-visible:border-slate-900 transition-all uppercase" 
                  placeholder="--------" 
                />
              </div>
              <Button type="submit" disabled={loading || otp.length < 8} className="w-full bg-black text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl uppercase mt-4 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "VERIFY CODE"}
              </Button>
            </form>
          )}

          {step === 'password' && (
            <form className="space-y-5 animate-in slide-in-from-right-4" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">New Password</label>
                <div className="relative">
                  <Input name="password" type={showPassword ? "text" : "password"} required className="h-14 pl-4 pr-12 rounded-2xl font-bold" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Confirm New Password</label>
                <div className="relative">
                  <Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required className="h-14 pl-4 pr-12 rounded-2xl font-bold" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-black text-yellow-400 hover:bg-slate-800 font-black h-14 rounded-2xl uppercase mt-4 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "RECALIBRATE KEYS"}
              </Button>
            </form>
          )}

          <div className="mt-12 flex items-center justify-center gap-2 text-slate-300">
             <ShieldCheck size={14} /><span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encryption</span>
          </div>
        </div>
      </div>
    </div>
  )
}