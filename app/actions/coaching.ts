'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- SESSION MANAGEMENT ---

export async function getSessions() {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return [];

  const { data } = await supabaseAdmin
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return data || [];
}

export async function deleteSession(id: string) {
  await supabaseAdmin.from('chat_sessions').delete().eq('id', id);
}

export async function renameSession(id: string, title: string) {
  await supabaseAdmin.from('chat_sessions').update({ title }).eq('id', id);
}

export async function getChatMessages(sessionId: string) {
  const { data } = await supabaseAdmin
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return data || [];
}

// --- MAIN CHAT ACTION ---

export async function sendCoachingMessage(sessionId: string | null, content: string) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Resolve or Create Session
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    const { data: session } = await supabaseAdmin
      .from('chat_sessions')
      .insert({ user_id: user.id, title: content.slice(0, 35) })
      .select().single();
    currentSessionId = session.id;
  }

  // 2. Save the user message to DB
  await supabaseAdmin.from('chat_messages').insert({ 
    session_id: currentSessionId, 
    role: 'user', 
    content 
  });

  let finalContent = "";

  // 3. Send request to Agent with EMPTY history as requested
  try {
    const response = await fetch("https://inferaagent.onrender.com/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: content, 
        history: [] // Always empty
      }),
    });

    if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`Agent Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    finalContent = data.response || data.answer || data.message;

  } catch (error: any) {
    console.error("Fetch Error:", error);
    finalContent = "### ⨯ ERROR\nNeural link disrupted. Check your Render logs.";
  }

  // 4. Save Assistant response to DB
  await supabaseAdmin.from('chat_messages').insert({ 
    session_id: currentSessionId, 
    role: 'assistant', 
    content: finalContent 
  });

  // 5. Update timestamp
  await supabaseAdmin.from('chat_sessions').update({ 
    updated_at: new Date().toISOString() 
  }).eq('id', currentSessionId);

  return { sessionId: currentSessionId, content: finalContent };
}