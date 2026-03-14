import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Standard Client: Reads cookies to securely verify WHO the user is
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/auth/login')
  }

  // 2. Admin Client: Bypasses RLS to read the profile data
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  // Deflect to onboarding if not completed (or if profile row doesn't exist yet)
  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  // Render Dashboard
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardNavbar userEmail={user.email} />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}   