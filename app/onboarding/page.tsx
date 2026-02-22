'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { completeOnboardingAction } from '@/app/actions/onboarding'
import { 
  Cpu, ArrowRight, Loader2, UploadCloud, 
  User, GraduationCap, Code2, AlertCircle, ShieldCheck, Target, Network,
  Menu, X, Fingerprint, Layers, Lock, Sun, Moon
} from "lucide-react"

// --- THEME TOGGLE COMPONENT ---
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

export default function OnboardingPage() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = React.useState<string>('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('avatar_url', avatarUrl)

    const result = await completeOnboardingAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-[#01005A] dark:selection:bg-[#6B8AFF] selection:text-white flex flex-col lg:flex-row overflow-hidden transition-colors duration-300">
      
      {/* ================= MOBILE DRAWER MENU ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 px-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="bg-[#01005A]/10 dark:bg-[#6B8AFF]/20 p-2 rounded-xl border border-[#01005A]/20 dark:border-[#6B8AFF]/20">
              <Cpu size={20} className="text-[#01005A] dark:text-[#6B8AFF]" />
            </div>
            <span className="font-black tracking-tighter uppercase text-xl italic text-slate-900 dark:text-white">
              INFRA<span className="text-[#01005A] dark:text-[#6B8AFF]">CORE</span>
            </span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] flex items-center gap-3 transition-colors">
            <Layers size={16}/> Return to Nexus
          </Link>
          <Link href="/auth/login" className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-[#01005A] dark:hover:text-[#6B8AFF] flex items-center gap-3 transition-colors">
            <Lock size={16}/> Existing Node Login
          </Link>
        </div>
      </div>


      {/* ================= LEFT PANEL (DESKTOP FIXED) ================= */}
      <div className="hidden lg:flex w-[45%] bg-slate-900 flex-col justify-between p-12 xl:p-16 relative overflow-hidden h-full border-r border-slate-800">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#6B8AFF]/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#01005A]/40 rounded-full blur-[100px] pointer-events-none" />

        {/* Pinned Top Logo */}
        <div className="relative z-20">
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
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-sm">
            <div className="w-1.5 h-1.5 bg-[#6B8AFF] rounded-full animate-pulse shadow-[0_0_8px_rgba(107,138,255,0.8)]" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Setup Protocol</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            Configure <br/>
            <span className="text-[#8B98FF] drop-shadow-[0_2px_15px_rgba(139,152,255,0.2)]">Your Node</span>
          </h1>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
            To generate your precise engineering roadmap, our AI requires baseline telemetry. This data is strictly encrypted and used solely for market arbitrage.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-[#6B8AFF]/50 transition-colors">
                  <Target className="text-[#6B8AFF]" size={16} />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-0.5">Skill Fingerprinting</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">Maps your current stack against industry demands.</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-[#6B8AFF]/50 transition-colors">
                  <Network className="text-[#6B8AFF]" size={16} />
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-0.5">Trajectory Mapping</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">Aligns academic metrics with high-premium roles.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6 mt-12">
           <div className="flex items-center gap-2">
               <Fingerprint size={12} className="text-[#6B8AFF]" />
               End-to-End Encryption
           </div>
           <span>v1.0.4 Live</span>
        </div>
      </div>

      {/* ================= RIGHT PANEL (SCROLLABLE FORM) ================= */}
      <div className="w-full lg:w-[55%] h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 relative custom-scrollbar">
        
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
          <div className="flex items-center gap-2">
            <AuthThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>

        <div className="min-h-full flex flex-col justify-center p-6 md:p-12 xl:px-24 py-12 lg:py-20">
            
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">Initialize Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configure your engineering parameters to access the dashboard.</p>
            </div>

            {/* The SaaS Form Card */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-none">
              
              {error && (
                <div className="mb-8 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 animate-in fade-in zoom-in-95">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-14">
                
                {/* Section 1: Identity & Avatar */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#01005A]/10 dark:bg-[#6B8AFF]/10 flex items-center justify-center border border-[#01005A]/10 dark:border-[#6B8AFF]/20">
                        <User className="text-[#01005A] dark:text-[#6B8AFF]" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">1. Identity Profile</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Cloudinary Avatar Upload */}
                    <div className="flex flex-col gap-3 shrink-0">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Node Avatar</label>
                      <CldUploadWidget 
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "infracore_avatars"}
                        onSuccess={(result: any) => setAvatarUrl(result.info.secure_url)}
                      >
                        {({ open }) => (
                          <div 
                            onClick={() => open()}
                            className="w-28 h-28 rounded-[1.5rem] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#01005A] dark:hover:border-[#6B8AFF] hover:bg-[#01005A]/5 dark:hover:bg-[#6B8AFF]/5 transition-all overflow-hidden relative group"
                          >
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <UploadCloud size={24} className="text-slate-400 group-hover:text-[#01005A] dark:group-hover:text-[#6B8AFF] transition-colors" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                              </>
                            )}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                               <span className="text-white text-[9px] font-bold uppercase tracking-widest">Update</span>
                            </div>
                          </div>
                        )}
                      </CldUploadWidget>
                    </div>

                    <div className="flex-1 space-y-5 w-full">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Full Legal Name</label>
                        <Input 
                          name="full_name" 
                          required 
                          className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                          placeholder="e.g. Alan Turing" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Target Engineering Domain</label>
                        <Input 
                          name="target_domain" 
                          required 
                          className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                          placeholder="e.g. Backend Architecture" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Intel */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#01005A]/10 dark:bg-[#6B8AFF]/10 flex items-center justify-center border border-[#01005A]/10 dark:border-[#6B8AFF]/20">
                        <GraduationCap className="text-[#01005A] dark:text-[#6B8AFF]" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">2. Academic Matrix</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Institution</label>
                      <Input 
                        name="college_name" 
                        required 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="University Name" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Degree / Major</label>
                      <Input 
                        name="degree" 
                        required 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="B.S. Computer Science" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Graduation Year</label>
                      <Input 
                        name="graduation_year" 
                        type="number" 
                        required 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="2026" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Current Semester</label>
                      <Input 
                        name="current_semester" 
                        type="number" 
                        required 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="e.g. 5" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Technical Arsenal */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#01005A]/10 dark:bg-[#6B8AFF]/10 flex items-center justify-center border border-[#01005A]/10 dark:border-[#6B8AFF]/20">
                        <Code2 className="text-[#01005A] dark:text-[#6B8AFF]" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">3. Technical Arsenal</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Current Skills (Comma Separated)</label>
                      <Input 
                        name="skills" 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="Python, React, AutoCAD, Thermodynamics" 
                      />
                      <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mt-2 ml-1">These act as the foundation for your AI-generated roadmaps.</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 block ml-1">Core Interests (Comma Separated)</label>
                      <Input 
                        name="core_interests" 
                        className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus-visible:ring-2 focus-visible:ring-[#01005A] dark:focus-visible:ring-[#6B8AFF] focus-visible:border-transparent text-sm font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" 
                        placeholder="Distributed Systems, Renewable Energy" 
                      />
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#01005A] dark:bg-[#6B8AFF] text-white hover:bg-[#020080] dark:hover:bg-[#5274FF] font-black h-16 rounded-2xl transition-all shadow-[0_8px_30px_rgba(1,0,90,0.25)] dark:shadow-[0_8px_30px_rgba(107,138,255,0.25)] active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        SYNCHRONIZE & DEPLOY <ArrowRight size={20} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  )
}