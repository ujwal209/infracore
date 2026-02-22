'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import PDFParser from "pdf2json";
import Groq from "groq-sdk";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. RESUME PROCESSING ---
export async function uploadAndProcessResume(formData: FormData) {
  const file = formData.get('file') as File;
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const pdfParser = new (PDFParser as any)(null, 1);
  
  const resumeText: string = await new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
    pdfParser.parseBuffer(buffer);
  });

  const uploadRes = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'resumes', resource_type: 'raw' }, (error, result) => {
      if (error) reject(error); else resolve(result);
    }).end(buffer);
  }) as any;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "Analyze this resume. Return JSON with 'summary', 'skills' (array), and 'tips' (array)." },
      { role: "user", content: resumeText }
    ],
    response_format: { type: "json_object" }
  });

  const analysis = JSON.parse(completion.choices[0].message.content || '{}');

  const { data, error } = await supabaseAdmin.from('user_resumes').upsert({
    user_id: user.id,
    raw_text: resumeText,
    file_url: uploadRes.secure_url,
    analysis: analysis,
    updated_at: new Date().toISOString()
  }).select().single();

  if (error) throw error;
  return data;
}

export async function getExistingResume() {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return null;
  const { data } = await supabaseAdmin.from('user_resumes').select('*').eq('user_id', user.id).single();
  return data;
}

// --- 2. DEDICATED RESUME CHAT LOGIC ---
export async function getResumeChatMessages(resumeId: string) {
  const { data } = await supabaseAdmin
    .from('resume_messages')
    .select('*')
    .eq('resume_id', resumeId)
    .order('created_at', { ascending: true });
  return data || [];
}

export async function sendResumeChatMessage(resumeId: string, content: string) {
  // 1. Get Resume Context
  const { data: resume } = await supabaseAdmin.from('user_resumes').select('raw_text').eq('id', resumeId).single();
  if (!resume) throw new Error("Resume context not found");

  // 2. Get Previous Chat Context
  const prevMessages = await getResumeChatMessages(resumeId);
  const formattedHistory = prevMessages.map(m => ({ role: m.role, content: m.content }));

  // 3. Save User Message
  await supabaseAdmin.from('resume_messages').insert({ resume_id: resumeId, role: 'user', content });

  // 4. Invoke Groq with RAG context
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { 
        role: "system", 
        content: `You are Architect Prime. You are a career coach. You have access to the following resume text. Answer the user's questions specifically about this resume. Be professional, direct, and slightly technical.\n\nRESUME_CONTEXT:\n${resume.raw_text}` 
      },
      ...formattedHistory,
      { role: "user", content }
    ]
  });

  const aiContent = response.choices[0].message.content || "Internal Protocol Error.";

  // 5. Save AI Response
  await supabaseAdmin.from('resume_messages').insert({ resume_id: resumeId, role: 'assistant', content: aiContent });

  return aiContent;
}