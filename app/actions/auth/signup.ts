'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { sendOtpEmail } from '@/utils/email'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 1. GENERATE OTP
export async function initiateSignup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      data: { full_name: name }
    })

    if (error) return { error: error.message }

    const otp = data.properties?.email_otp
    if (!otp) return { error: "Failed to generate security token." }

    await sendOtpEmail(email, otp, 'signup')

    // Prepare profile early
    await supabaseAdmin.from('profiles').upsert({ id: data.user.id, email, full_name: name })

    return { success: true, email }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." }
  }
}

// 2. VERIFY OTP
export async function verifySignupOtp(email: string, otp: string) {
  const supabase = await createServerClient()
  
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'signup'
  })

  if (error) return { error: "Invalid or expired code." }
  return { success: true }
}