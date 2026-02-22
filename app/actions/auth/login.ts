'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Helper function to reliably get the base URL in any environment
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your production URL in Vercel/Netlify
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000'

  // Ensure it includes the protocol
  url = url.includes('http') ? url : `https://${url}`
  // Ensure it does not end with a trailing slash so we can append easily
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url
  
  return url
}

// ------------------------------------------------------------------
// 1. STANDARD EMAIL/PASSWORD LOGIN
// ------------------------------------------------------------------
export async function loginAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Purge router cache and securely redirect to the workspace
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ------------------------------------------------------------------
// 2. GOOGLE OAUTH LOGIN
// ------------------------------------------------------------------
export async function loginWithGoogleAction() {
  const supabase = await createClient()
  
  // Get the reliable absolute URL
  const origin = getURL()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`, 
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}