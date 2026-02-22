'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { getStudentProfile, updateStudentProfile } from '@/app/actions/profile'
import { 
  User, School, GraduationCap, Target, Cpu, Save, 
  Loader2, Camera, Sparkles, CheckCircle2, Shield, 
  Menu, X
} from 'lucide-react'

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const data = await getStudentProfile();
      if (data) setProfile(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudentProfile(new FormData(e.currentTarget));
      alert("Academic Identity Synchronized.");
    } catch (err) {
      alert("Error updating profile.");
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-4">
        <Loader2 className="animate-spin text-slate-900" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading_Profile_Data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans antialiased w-full">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 bg-white z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar userEmail={profile?.email || 'student@infracore.edu'} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Cpu size={18} className="text-slate-900" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Sidebar userEmail={profile?.email || 'student@infracore.edu'} />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-yellow-400 shadow-md shrink-0 hidden sm:flex">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest truncate">Student_Portfolio</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Academic_Vault_Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-md">
                <Shield size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
             </div>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] relative flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full relative">
            
            {/* Scrollable Content Body */}
            <div className="flex-1 p-4 sm:p-8 lg:p-10 w-full max-w-5xl mx-auto space-y-8">
              
              {/* Identity Hero */}
              <div className="bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0">
                <div className="absolute -top-10 -right-10 p-8 opacity-5 rotate-12 pointer-events-none"><Cpu size={180}/></div>
                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 min-w-0">
                  
                  {/* Avatar Upload */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-slate-800 border-4 border-slate-800 overflow-hidden shadow-2xl transition-all group-hover:border-slate-700">
                      {avatarPreview || profile?.avatar_url ? (
                        <img src={avatarPreview || profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={40}/></div>
                      )}
                    </div>
                    <input type="file" name="avatar" id="avatar-input" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    <label htmlFor="avatar-input" className="absolute -bottom-2 -right-2 p-3 bg-yellow-400 text-slate-900 rounded-xl cursor-pointer hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg border-2 border-slate-900 z-10">
                      <Camera size={16} />
                    </label>
                    <input type="hidden" name="current_avatar_url" value={profile?.avatar_url || ''} />
                  </div>
                  
                  {/* Hero Text */}
                  <div className="text-center sm:text-left space-y-2.5 pt-2 min-w-0 flex-1">
                    <div className="flex items-center gap-3 justify-center sm:justify-start min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight truncate">{profile?.full_name || 'New Architect'}</h1>
                      <Sparkles className="text-yellow-400 shrink-0 hidden sm:block" size={20} />
                    </div>
                    <p className="text-yellow-400/90 font-bold text-[10px] sm:text-xs uppercase tracking-widest break-words leading-relaxed">
                      {profile?.degree || 'Degree Not Set'} • Semester {profile?.current_semester || '?'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/5 mt-2">
                       <School size={12} className="text-slate-300" />
                       <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider truncate max-w-[200px]">{profile?.college_name || 'Institution Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                
                {/* Left Column (Personal & Academic) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                  
                  {/* Personal Info */}
                  <section className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm space-y-6 block">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <User size={14} className="text-emerald-500" /> Personal_Meta
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Full Name</label>
                        <input name="full_name" defaultValue={profile?.full_name} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">System Email (Locked)</label>
                        <input disabled value={profile?.email} className="w-full bg-slate-100/50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed select-none" />
                      </div>
                    </div>
                  </section>

                  {/* Academic Context */}
                  <section className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm space-y-6 block">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <School size={14} className="text-blue-500" /> Institution_Data
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">College / University Name</label>
                        <input name="college_name" defaultValue={profile?.college_name} placeholder="e.g. Indian Institute of Technology" className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Degree Title</label>
                        <input name="degree" defaultValue={profile?.degree} placeholder="e.g. B.Tech in Computer Science" className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Graduation Year</label>
                        <input name="graduation_year" type="number" defaultValue={profile?.graduation_year} placeholder="2026" className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Current Semester</label>
                        <input name="current_semester" type="number" defaultValue={profile?.current_semester} placeholder="6" className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column (Career & Status) */}
                <div className="space-y-6 sm:space-y-8 min-w-0 block">
                  
                  {/* Career Vector */}
                  <section className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Target size={14} className="text-yellow-500" /> Career_Vector
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Target Domain</label>
                        <select name="target_domain" defaultValue={profile?.target_domain} className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase outline-none transition-all appearance-none cursor-pointer">
                          <option value="frontend">Frontend Engineering</option>
                          <option value="backend">Backend & Scalability</option>
                          <option value="ai_ml">AI / Machine Learning</option>
                          <option value="devops">DevOps & Cloud</option>
                          <option value="fullstack">Full Stack Development</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 top-[26px] flex items-center pointer-events-none text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex justify-between">
                          <span>Current Skills</span>
                          <span className="text-[9px] text-slate-400 font-medium normal-case">Comma separated</span>
                        </label>
                        <textarea name="skills" defaultValue={profile?.skills?.join(', ')} placeholder="React, Node.js, Python, AWS..." className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-slate-400" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1 flex justify-between">
                          <span>Core Interests</span>
                          <span className="text-[9px] text-slate-400 font-medium normal-case">Comma separated</span>
                        </label>
                        <textarea name="core_interests" defaultValue={profile?.core_interests?.join(', ')} placeholder="Open Source, Distributed Systems, UI/UX..." className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 px-4 py-3 rounded-xl text-sm font-semibold outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                  </section>

                  {/* System Status Box */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
                     <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"><CheckCircle2 size={20}/></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-black text-emerald-800 uppercase leading-none tracking-widest mt-1">Identity Verified</p>
                        <p className="text-[10px] font-semibold text-emerald-600/80 uppercase mt-2 leading-relaxed">System is ready to analyze your career trajectory against industry requirements.</p>
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Save Dock (Fixed to Bottom) */}
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-4 sm:px-8 sm:py-6 w-full z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
              <div className="max-w-5xl mx-auto flex justify-end">
                <button 
                  type="submit"
                  disabled={saving} 
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl hover:bg-slate-800 hover:text-yellow-400 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {saving ? <Loader2 className="animate-spin text-yellow-400" size={18}/> : <Save size={18} className="text-yellow-400" />}
                  {saving ? 'Synchronizing...' : 'Save Configuration'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}