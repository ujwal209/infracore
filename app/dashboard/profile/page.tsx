'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle' // Imported Theme Toggle
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#09090b] space-y-4">
        <Loader2 className="animate-spin text-[#01005A] dark:text-blue-400" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Loading_Profile_Data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#09090b] overflow-hidden text-slate-900 dark:text-slate-100 font-sans antialiased w-full transition-colors duration-300 selection:bg-[#01005A]/20 selection:text-[#01005A] dark:selection:bg-blue-500/30 dark:selection:text-blue-200">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <Sidebar userEmail={profile?.email || 'student@infracore.edu'} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-slate-200 dark:border-slate-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu size={18} className="text-[#01005A] dark:text-blue-400" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
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
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#09090b] relative">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Menu - Proper responsive display */}
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-[#01005A] dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-white dark:text-blue-400 shadow-md shrink-0 hidden sm:flex border border-transparent dark:border-blue-500/20">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest truncate text-slate-900 dark:text-slate-100">Student_Portfolio</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">Academic_Vault_Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-4">
             {/* Theme Toggle Component */}
             <ThemeToggle />
             
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-md transition-colors">
                <Shield size={14} className="text-emerald-500 dark:text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verified</span>
             </div>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full relative">
            
            {/* Scrollable Content Body */}
            <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">
              
              {/* Identity Hero - Primary Brand Color #01005A */}
              <div className="bg-[#01005A] dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl dark:shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-0 border border-transparent dark:border-slate-800">
                <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] dark:opacity-[0.02] rotate-12 pointer-events-none"><Cpu size={180}/></div>
                
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 min-w-0 z-10">
                  
                  {/* Avatar Upload */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white/10 dark:bg-slate-800 border-4 border-white/20 dark:border-slate-700 overflow-hidden shadow-2xl transition-all group-hover:border-white/40 dark:group-hover:border-slate-600 backdrop-blur-sm">
                      {avatarPreview || profile?.avatar_url ? (
                        <img src={avatarPreview || profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50 dark:text-slate-500"><User size={40}/></div>
                      )}
                    </div>
                    <input type="file" name="avatar" id="avatar-input" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    <label htmlFor="avatar-input" className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 text-[#01005A] dark:text-blue-400 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-lg border-2 border-slate-100 dark:border-slate-700 z-10">
                      <Camera size={16} />
                    </label>
                    <input type="hidden" name="current_avatar_url" value={profile?.avatar_url || ''} />
                  </div>
                  
                  {/* Hero Text */}
                  <div className="text-center sm:text-left space-y-2.5 pt-2 min-w-0 flex-1">
                    <div className="flex items-center gap-3 justify-center sm:justify-start min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight truncate">{profile?.full_name || 'New Architect'}</h1>
                      <Sparkles className="text-blue-300 dark:text-blue-400 shrink-0 hidden sm:block" size={20} />
                    </div>
                    <p className="text-blue-200 dark:text-blue-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest break-words leading-relaxed">
                      {profile?.degree || 'Degree Not Set'} • Semester {profile?.current_semester || '?'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 dark:bg-slate-800/50 rounded-lg border border-white/10 dark:border-slate-700 mt-2 backdrop-blur-md">
                       <School size={12} className="text-white/80 dark:text-slate-300" />
                       <span className="text-[10px] font-semibold text-white/90 dark:text-slate-300 uppercase tracking-wider truncate max-w-[200px]">{profile?.college_name || 'Institution Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                
                {/* Left Column (Personal & Academic) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                  
                  {/* Personal Info */}
                  <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-6 transition-colors">
                    <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-2">
                        <User size={14} className="text-emerald-500 dark:text-emerald-400" /> Personal_Meta
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">Full Name</label>
                        <input 
                          name="full_name" 
                          defaultValue={profile?.full_name} 
                          placeholder="John Doe" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">System Email (Locked)</label>
                        <input 
                          disabled 
                          value={profile?.email} 
                          className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed select-none" 
                        />
                      </div>
                    </div>
                  </section>

                  {/* Academic Context */}
                  <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-6 transition-colors">
                    <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-2">
                        <School size={14} className="text-blue-500 dark:text-blue-400" /> Institution_Data
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">College / University Name</label>
                        <input 
                          name="college_name" 
                          defaultValue={profile?.college_name} 
                          placeholder="e.g. Indian Institute of Technology" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">Degree Title</label>
                        <input 
                          name="degree" 
                          defaultValue={profile?.degree} 
                          placeholder="e.g. B.Tech in Computer Science" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">Graduation Year</label>
                        <input 
                          name="graduation_year" 
                          type="number" 
                          defaultValue={profile?.graduation_year} 
                          placeholder="2026" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">Current Semester</label>
                        <input 
                          name="current_semester" 
                          type="number" 
                          defaultValue={profile?.current_semester} 
                          placeholder="6" 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column (Career & Status) */}
                <div className="space-y-6 sm:space-y-8 min-w-0 block">
                  
                  {/* Career Vector */}
                  <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md space-y-6 transition-colors">
                    <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-2">
                        <Target size={14} className="text-[#01005A] dark:text-blue-400" /> Career_Vector
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1">Target Domain</label>
                        <select 
                          name="target_domain" 
                          defaultValue={profile?.target_domain} 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase outline-none transition-all appearance-none cursor-pointer text-slate-900 dark:text-slate-100"
                        >
                          <option value="frontend">Frontend Engineering</option>
                          <option value="backend">Backend & Scalability</option>
                          <option value="ai_ml">AI / Machine Learning</option>
                          <option value="devops">DevOps & Cloud</option>
                          <option value="fullstack">Full Stack Development</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 top-[26px] flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1 flex justify-between">
                          <span>Current Skills</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium normal-case">Comma separated</span>
                        </label>
                        <textarea 
                          name="skills" 
                          defaultValue={profile?.skills?.join(', ')} 
                          placeholder="React, Node.js, Python, AWS..." 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider ml-1 flex justify-between">
                          <span>Core Interests</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium normal-case">Comma separated</span>
                        </label>
                        <textarea 
                          name="core_interests" 
                          defaultValue={profile?.core_interests?.join(', ')} 
                          placeholder="Open Source, Distributed Systems, UI/UX..." 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-[#01005A] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#01005A] dark:focus:ring-blue-500 px-4 py-3 rounded-xl text-sm font-semibold outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-slate-100" 
                        />
                      </div>
                    </div>
                  </section>

                  {/* System Status Box */}
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl sm:rounded-[2rem] p-6 flex items-start gap-4 shadow-sm transition-colors">
                     <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-white dark:text-emerald-400 shrink-0 shadow-sm"><CheckCircle2 size={20}/></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase leading-none tracking-widest mt-1">Identity Verified</p>
                        <p className="text-[10px] font-semibold text-emerald-600/80 dark:text-emerald-500 uppercase mt-2 leading-relaxed">System is ready to analyze your career trajectory against industry requirements.</p>
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Save Dock (Fixed to Bottom) */}
            <div className="sticky bottom-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-8 sm:py-6 w-full z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] transition-colors">
              <div className="max-w-5xl mx-auto flex justify-end">
                <button 
                  type="submit"
                  disabled={saving} 
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 bg-[#01005A] text-white rounded-xl sm:rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl dark:shadow-blue-900/20 hover:bg-[#01005A]/90 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {saving ? <Loader2 className="animate-spin text-white" size={18}/> : <Save size={18} className="text-white" />}
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