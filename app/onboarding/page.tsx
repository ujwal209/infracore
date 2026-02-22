'use client'

import * as React from 'react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { completeOnboardingAction } from '@/app/actions/onboarding'
import { 
  Cpu, ArrowRight, Loader2, UploadCloud, 
  User, GraduationCap, Code2, AlertCircle, ShieldCheck, Target, Network
} from "lucide-react"

export default function OnboardingPage() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = React.useState<string>('')

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
    <div className="h-screen bg-white flex font-sans selection:bg-yellow-400 selection:text-black overflow-hidden">
      
      {/* LEFT PANEL: Fixed Branding & Value Prop */}
      <div className="hidden lg:flex w-[45%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden h-full">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Setup Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
            Configure <br/>
            <span className="text-yellow-400">Your Node</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
            To generate your precise engineering roadmap, our AI requires baseline telemetry. This data is strictly encrypted and used solely for market arbitrage.
          </p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Target className="text-yellow-400 shrink-0" size={24} />
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-0.5">Skill Fingerprinting</h4>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Maps your current stack against 2026 industry demands.</p>
                </div>
             </div>
             <div className="flex items-center gap-4 text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
                <Network className="text-yellow-400 shrink-0" size={24} />
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-0.5">Trajectory Mapping</h4>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Aligns academic metrics with high-premium global vacancies.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-6 mt-12">
           <div className="flex items-center gap-2 text-slate-400">
               <ShieldCheck size={14} className="text-emerald-500" />
               End-to-End Encryption Active
           </div>
           <span>v1.0.4 Live</span>
        </div>
      </div>

      {/* RIGHT PANEL: Scrollable Form */}
      <div className="w-full lg:w-[55%] h-full overflow-y-auto bg-[#FDFDFD] relative custom-scrollbar">
        <div className="min-h-full flex flex-col justify-center p-6 md:p-12 lg:px-20 py-16">
            
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

            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2 uppercase">Initialize Profile</h2>
              <p className="text-slate-500 text-sm font-medium">Configure your engineering parameters to access the dashboard.</p>
            </div>

            <div className="w-full max-w-2xl bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40">
              
              {error && (
                <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in zoom-in-95">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Section 1: Identity & Avatar */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                        <User className="text-yellow-600" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">1. Identity Profile</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Cloudinary Avatar Upload */}
                    <div className="flex flex-col gap-3 shrink-0">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Avatar</label>
                      <CldUploadWidget 
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "infracore_avatars"}
                        onSuccess={(result: any) => setAvatarUrl(result.info.secure_url)}
                      >
                        {({ open }) => (
                          <div 
                            onClick={() => open()}
                            className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all overflow-hidden relative group"
                          >
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <UploadCloud size={24} className="text-slate-400 group-hover:text-yellow-600 transition-colors" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                              </>
                            )}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                               <span className="text-yellow-400 text-[9px] font-bold uppercase tracking-widest">Update</span>
                            </div>
                          </div>
                        )}
                      </CldUploadWidget>
                    </div>

                    <div className="flex-1 space-y-5 w-full">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Full Legal Name</label>
                        <Input name="full_name" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="e.g. Alan Turing" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Target Engineering Domain</label>
                        <Input name="target_domain" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="e.g. Backend Architecture" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Intel */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                        <GraduationCap className="text-yellow-600" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">2. Academic Matrix</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Institution</label>
                      <Input name="college_name" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="University Name" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Degree / Major</label>
                      <Input name="degree" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="B.S. Computer Science" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Graduation Year</label>
                      <Input name="graduation_year" type="number" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="2026" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Current Semester</label>
                      <Input name="current_semester" type="number" required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="e.g. 5" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Technical Arsenal */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                        <Code2 className="text-yellow-600" size={16} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">3. Technical Arsenal</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Current Skills (Comma Separated)</label>
                      <Input name="skills" className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="Python, React, AutoCAD, Thermodynamics" />
                      <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mt-2">These act as the foundation for your AI-generated roadmaps.</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Core Interests (Comma Separated)</label>
                      <Input name="core_interests" className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-yellow-400 text-sm font-bold shadow-sm" placeholder="Distributed Systems, Renewable Energy" />
                    </div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="pt-8 border-t border-slate-100">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-yellow-400 hover:bg-slate-800 font-black h-16 rounded-2xl transition-all shadow-xl shadow-yellow-500/10 active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
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