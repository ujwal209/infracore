'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { getStudentProfile, updateStudentProfile } from '@/app/actions/profile'
import { 
  User, School, GraduationCap, Target, Cpu, Save, 
  Loader2, Camera, Sparkles, CheckCircle2, Shield, 
  Menu, X, ChevronDown
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
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 space-y-4">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={40} />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans antialiased w-full transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* 1. Global Sidebar (Desktop) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30 shadow-sm">
        <Sidebar userEmail={profile?.email || 'student@infracore.edu'} />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm lg:hidden transition-all" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 shadow-2xl flex flex-col transform transition-transform duration-300 border-r border-zinc-200 dark:border-zinc-800" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Cpu size={18} className="text-blue-600 dark:text-blue-500" /> Navigation
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
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
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950 relative">
        
        {/* Superior Header */}
        <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Menu */}
            <button 
              className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg shrink-0 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
            
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0 hidden sm:flex border border-blue-100 dark:border-blue-500/20">
              <GraduationCap size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate text-zinc-900 dark:text-zinc-100">Student Portfolio</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate">Academic Vault Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-4">
             <ThemeToggle />
             
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-md transition-colors shadow-sm">
                <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Verified</span>
             </div>
          </div>
        </header>

        {/* Form Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full relative">
            
            {/* Scrollable Content Body */}
            <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">
              
              {/* Identity Hero - Premium Dark Zinc Card */}
              <div className="bg-zinc-900 dark:bg-zinc-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-sm relative overflow-hidden min-w-0 border border-zinc-800">
                <div className="absolute -top-10 -right-10 p-8 opacity-[0.05] rotate-12 pointer-events-none text-blue-500"><Cpu size={180}/></div>
                
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 min-w-0 z-10">
                  
                  {/* Avatar Upload */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-zinc-800 border-4 border-zinc-700 overflow-hidden shadow-lg transition-all group-hover:border-zinc-600 backdrop-blur-sm">
                      {avatarPreview || profile?.avatar_url ? (
                        <img src={avatarPreview || profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500"><User size={40}/></div>
                      )}
                    </div>
                    <input type="file" name="avatar" id="avatar-input" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    <label htmlFor="avatar-input" className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:scale-105 transition-all shadow-md border border-zinc-200 dark:border-zinc-700 z-10">
                      <Camera size={16} />
                    </label>
                    <input type="hidden" name="current_avatar_url" value={profile?.avatar_url || ''} />
                  </div>
                  
                  {/* Hero Text */}
                  <div className="text-center sm:text-left space-y-2.5 pt-2 min-w-0 flex-1">
                    <div className="flex items-center gap-3 justify-center sm:justify-start min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">{profile?.full_name || 'New Architect'}</h1>
                      <Sparkles className="text-blue-400 shrink-0 hidden sm:block" size={20} />
                    </div>
                    <p className="text-zinc-400 font-medium text-[11px] sm:text-xs uppercase tracking-wider break-words leading-relaxed">
                      {profile?.degree || 'Degree Not Set'} • Semester {profile?.current_semester || '?'}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700 mt-2 backdrop-blur-md text-zinc-300">
                       <School size={12} className="text-blue-400" />
                       <span className="text-[10px] font-medium uppercase tracking-wider truncate max-w-[200px]">{profile?.college_name || 'Institution Pending'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                
                {/* Left Column (Personal & Academic) */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                  
                  {/* Personal Info */}
                  <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 transition-colors">
                    <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                      <h3 className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-2">
                        <User size={14} className="text-blue-600 dark:text-blue-500" /> Personal Meta
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Full Name</label>
                        <input 
                          name="full_name" 
                          defaultValue={profile?.full_name} 
                          placeholder="John Doe" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">System Email (Locked)</label>
                        <input 
                          disabled 
                          value={profile?.email} 
                          className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-500 cursor-not-allowed select-none" 
                        />
                      </div>
                    </div>
                  </section>

                  {/* Academic Context */}
                  <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 transition-colors">
                    <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                      <h3 className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-2">
                        <School size={14} className="text-blue-600 dark:text-blue-500" /> Institution Data
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">College / University Name</label>
                        <input 
                          name="college_name" 
                          defaultValue={profile?.college_name} 
                          placeholder="e.g. Indian Institute of Technology" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Degree Title</label>
                        <input 
                          name="degree" 
                          defaultValue={profile?.degree} 
                          placeholder="e.g. B.Tech in Computer Science" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Graduation Year</label>
                        <input 
                          name="graduation_year" 
                          type="number" 
                          defaultValue={profile?.graduation_year} 
                          placeholder="2026" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Current Semester</label>
                        <input 
                          name="current_semester" 
                          type="number" 
                          defaultValue={profile?.current_semester} 
                          placeholder="6" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column (Career & Status) */}
                <div className="space-y-6 sm:space-y-8 min-w-0 block">
                  
                  {/* Career Vector */}
                  <section className="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 transition-colors">
                    <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                      <h3 className="text-[11px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-2">
                        <Target size={14} className="text-blue-600 dark:text-blue-500" /> Career Vector
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1">Target Domain</label>
                        <div className="relative">
                          <select 
                            name="target_domain" 
                            defaultValue={profile?.target_domain} 
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3.5 rounded-xl text-[11px] font-medium uppercase tracking-wider outline-none transition-all appearance-none cursor-pointer text-zinc-900 dark:text-zinc-100"
                          >
                            <option value="frontend">Frontend Engineering</option>
                            <option value="backend">Backend & Scalability</option>
                            <option value="ai_ml">AI / Machine Learning</option>
                            <option value="devops">DevOps & Cloud</option>
                            <option value="fullstack">Full Stack Development</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1 flex justify-between">
                          <span>Current Skills</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 normal-case">Comma separated</span>
                        </label>
                        <textarea 
                          name="skills" 
                          defaultValue={profile?.skills?.join(', ')} 
                          placeholder="React, Node.js, Python, AWS..." 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider ml-1 flex justify-between">
                          <span>Core Interests</span>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 normal-case">Comma separated</span>
                        </label>
                        <textarea 
                          name="core_interests" 
                          defaultValue={profile?.core_interests?.join(', ')} 
                          placeholder="Open Source, Distributed Systems, UI/UX..." 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 px-4 py-3 rounded-xl text-sm font-medium outline-none h-24 resize-none custom-scrollbar transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100" 
                        />
                      </div>
                    </div>
                  </section>

                  {/* System Status Box */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl sm:rounded-[2rem] p-6 flex items-start gap-4 shadow-sm transition-colors">
                     <div className="w-10 h-10 bg-blue-500 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-white dark:text-blue-400 shrink-0 shadow-sm"><CheckCircle2 size={20}/></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-blue-800 dark:text-blue-400 uppercase leading-none tracking-wider mt-1">Identity Verified</p>
                        <p className="text-[10px] font-medium text-blue-600/80 dark:text-blue-500 uppercase mt-2 leading-relaxed tracking-wide">System is ready to analyze your career trajectory against industry requirements.</p>
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Save Dock (Fixed to Bottom) */}
            <div className="sticky bottom-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-4 py-4 sm:px-8 sm:py-6 w-full z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] transition-colors">
              <div className="max-w-5xl mx-auto flex justify-end">
                <button 
                  type="submit"
                  disabled={saving} 
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl text-[11px] font-semibold uppercase tracking-wider shadow-sm hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
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