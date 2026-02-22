'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getStudentProfile() {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
}

export async function updateStudentProfile(formData: FormData) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const avatarFile = formData.get('avatar') as File | null;
  let avatar_url = formData.get('current_avatar_url') as string;

  if (avatarFile && avatarFile.size > 0) {
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'student_avatars', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
        (error, result) => {
          if (error) reject(error); else resolve(result);
        }
      ).end(buffer);
    }) as any;
    avatar_url = uploadRes.secure_url;
  }

  const payload = {
    id: user.id,
    full_name: formData.get('full_name'),
    college_name: formData.get('college_name'),
    degree: formData.get('degree'),
    graduation_year: parseInt(formData.get('graduation_year') as string),
    current_semester: parseInt(formData.get('current_semester') as string),
    target_domain: formData.get('target_domain'),
    skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
    core_interests: (formData.get('core_interests') as string).split(',').map(s => s.trim()).filter(Boolean),
    onboarding_completed: true,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseAdmin.from('profiles').upsert(payload);
  if (error) throw error;
  return { success: true };
}