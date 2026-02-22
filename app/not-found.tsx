'use client'

import Link from 'next/link'
import { Cpu, Home, ChevronLeft, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* Background Visuals */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl animate-bounce duration-[2000ms]">
            <Cpu size={48} className="text-yellow-400" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full animate-pulse shadow-lg shadow-red-500/50">
            <AlertTriangle size={16} className="text-white" />
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-4">
          <h1 className="text-8xl sm:text-9xl font-black text-white tracking-tighter opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] select-none">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Node Not <span className="text-yellow-400">Found</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto">
            The coordinates you requested do not exist within the Infracore Nexus. This sector might have been decommissioned or the uplink is severed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            asChild
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-2xl border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 hover:text-yellow-400 transition-all font-bold uppercase tracking-widest text-[11px]"
          >
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeft size={16} /> Return to Nexus
            </Link>
          </Button>

          <Button 
            asChild
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-yellow-400 text-slate-900 hover:bg-yellow-500 transition-all font-black uppercase tracking-widest text-[11px] shadow-lg shadow-yellow-400/10"
          >
            <Link href="/auth/login" className="flex items-center gap-2">
              <Home size={16} /> Access Terminal
            </Link>
          </Button>
        </div>

        {/* Technical Metadata */}
        <div className="pt-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
              Error Code: INFRA_NULL_POINTER
            </span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
         <span className="font-black tracking-tighter uppercase text-xl italic text-white">
            INFRA<span className="text-yellow-500">CORE</span>
         </span>
      </div>
    </div>
  )
}