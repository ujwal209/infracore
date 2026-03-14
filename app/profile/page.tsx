'use client'

import React, { useState, useEffect } from 'react'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'
import { getStudentProfile, updateStudentProfile } from '@/app/actions/profile'
import { 
  User, School, Target, Cpu, Save, 
  Loader2, Camera, Sparkles, CheckCircle2, ChevronDown
} from 'lucide-react'

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#0a0a0a]">
        <DashboardNavbar userEmail="Loading..." />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-500" size={40} strokeWidth={2.5} />
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Loading Configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* GLOBAL NAVBAR */}
      <DashboardNavbar userEmail={profile?.email || 'student@infracore.edu'} />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col w-full relative">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full">
          
          <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-10 lg:py-12 space-y-8 sm:space-y-12">
            
            {/* HEADER */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                Identity & Config
              </h1>
              <p className="text-zinc-500 font-medium">Manage your personal details, academic status, and career vector.</p>
            </div>

            {/* HERO CARD - Premium Dark Zinc */}
            <div className="bg-zinc-950 dark:bg-[#111113] rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-zinc-800">
              <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] rotate-12 pointer-events-none text-blue-500"><Cpu size={250}/></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-8 sm:gap-10 z-10">
                
                {/* Avatar Upload */}
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-zinc-900 border-[6px] border-zinc-800 overflow-hidden shadow-2xl transition-all group-hover:border-zinc-700">
                    {avatarPreview || profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview || profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900"><User size={48} strokeWidth={2}/></div>
                    )}
                  </div>
                  <input type="file" name="avatar" id="avatar-input" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                  <label htmlFor="avatar-input" className="absolute -bottom-3 -right-3 p-3.5 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-900/30 z-10 border-4 border-zinc-950 dark:border-[#111113]">
                    <Camera size={20} strokeWidth={2.5} />
                  </label>
                  <input type="hidden" name="current_avatar_url" value={profile?.avatar_url || ''} />
                </div>
                
                {/* Hero Text */}
                <div className="text-center sm:text-left space-y-4 pt-2 flex-1">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">{profile?.full_name || 'New Operator'}</h2>
                    <Sparkles className="text-blue-500 shrink-0 hidden sm:block" size={24} />
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-300">
                      {profile?.degree || 'Degree Not Set'}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-widest text-blue-400">
                      Sem {profile?.current_semester || '?'}
                    </span>
                  </div>
                  <p className="text-zinc-400 font-medium flex items-center justify-center sm:justify-start gap-2">
                     <School size={16} className="text-blue-500" />
                     {profile?.college_name || 'Institution Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              
              {/* LEFT COLUMN: Personal & Academic Data */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Personal Meta */}
                <section className="bg-white dark:bg-[#111113] p-8 sm:p-10 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-8">
                  <div className="border-b-2 border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 tracking-widest flex items-center gap-2">
                      <User size={16} strokeWidth={3} /> Personal Meta
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">Full Name</label>
                      <input 
                        name="full_name" 
                        defaultValue={profile?.full_name} 
                        placeholder="John Doe" 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">System Email (Locked)</label>
                      <input 
                        disabled 
                        value={profile?.email} 
                        className="w-full bg-zinc-100 dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 px-5 py-4 rounded-xl text-[15px] font-bold text-zinc-400 dark:text-zinc-600 cursor-not-allowed select-none" 
                      />
                    </div>
                  </div>
                </section>

                {/* Institution Data */}
                <section className="bg-white dark:bg-[#111113] p-8 sm:p-10 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-8">
                  <div className="border-b-2 border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 tracking-widest flex items-center gap-2">
                      <School size={16} strokeWidth={3} /> Institution Data
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">College / University Name</label>
                      <input 
                        name="college_name" 
                        defaultValue={profile?.college_name} 
                        placeholder="e.g. Indian Institute of Technology" 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">Degree Title</label>
                      <input 
                        name="degree" 
                        defaultValue={profile?.degree} 
                        placeholder="e.g. B.Tech in Computer Science" 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">Graduation Year</label>
                      <input 
                        name="graduation_year" 
                        type="number" 
                        defaultValue={profile?.graduation_year} 
                        placeholder="2026" 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">Current Semester</label>
                      <input 
                        name="current_semester" 
                        type="number" 
                        defaultValue={profile?.current_semester} 
                        placeholder="6" 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Career Vector */}
              <div className="space-y-8">
                <section className="bg-white dark:bg-[#111113] p-8 sm:p-10 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-8">
                  <div className="border-b-2 border-zinc-100 dark:border-zinc-800/80 pb-4">
                    <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 tracking-widest flex items-center gap-2">
                      <Target size={16} strokeWidth={3} /> Career Vector
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3 relative">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1">Target Domain</label>
                      <div className="relative">
                        <select 
                          name="target_domain" 
                          defaultValue={profile?.target_domain} 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[13px] font-bold uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer text-zinc-900 dark:text-white"
                        >
                          <option value="frontend">Frontend Engineering</option>
                          <option value="backend">Backend & Scalability</option>
                          <option value="ai_ml">AI / Machine Learning</option>
                          <option value="devops">DevOps & Cloud</option>
                          <option value="fullstack">Full Stack Development</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                          <ChevronDown size={18} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1 flex justify-between">
                        <span>Current Skills</span>
                      </label>
                      <textarea 
                        name="skills" 
                        defaultValue={profile?.skills?.join(', ')} 
                        placeholder="React, Node.js, Python, AWS..." 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none h-32 resize-none custom-scrollbar transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-widest ml-1 flex justify-between">
                        <span>Core Interests</span>
                      </label>
                      <textarea 
                        name="core_interests" 
                        defaultValue={profile?.core_interests?.join(', ')} 
                        placeholder="Open Source, Distributed Systems, UI/UX..." 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus:border-blue-600 dark:focus:border-blue-500 px-5 py-4 rounded-xl text-[15px] font-bold outline-none h-32 resize-none custom-scrollbar transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-white" 
                      />
                    </div>
                  </div>
                </section>

                {/* System Status Box */}
                <div className="bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-100 dark:border-blue-500/20 rounded-[2rem] p-8 flex flex-col items-center text-center gap-4 shadow-sm">
                   <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                     <CheckCircle2 size={28} strokeWidth={2.5}/>
                   </div>
                   <div>
                     <h4 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-widest mb-2">Identity Verified</h4>
                     <p className="text-xs font-bold text-blue-600/80 dark:text-blue-500/80 leading-relaxed max-w-[200px] mx-auto">
                       System is primed to align your portfolio with market arbitrage.
                     </p>
                   </div>
                </div>
              </div>

            </div>
          </div>

          {/* STICKY SAVE DOCK */}
          <div className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 p-4 sm:px-8 sm:py-6 z-20">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <p className="hidden sm:block text-xs font-bold text-zinc-500 uppercase tracking-widest">Unsaved changes will be lost</p>
              <button 
                type="submit"
                disabled={saving} 
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={18} strokeWidth={3}/> : <Save size={18} strokeWidth={3} />}
                {saving ? 'Synchronizing...' : 'Save Configuration'}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  )
}