'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

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
// 2. GOOGLE OAUTH LOGIN (Dynamic URL)
// ------------------------------------------------------------------
export async function loginWithGoogleAction() {
  const supabase = await createClient()
  
  // Dynamically get the current URL from request headers
  const headersList = await headers()
  const host = headersList.get('host')
  // Determine protocol (Vercel uses x-forwarded-proto, localhost is http)
  const protocol = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
  const origin = `${protocol}://${host}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Points exactly to your dynamic origin's callback route
      redirectTo: `${origin}/auth/callback`, 
      // Forces the prompt to ensure the user selects the right account
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect the user to the Google Authentication screen
  if (data.url) {
    redirect(data.url)
  }
}