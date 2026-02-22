'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- TOOLS & LOGIC ---
async function web_search(query: string) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, max_results: 3 }),
  });
  const data = await response.json();
  return JSON.stringify(data.results || []);
}

const TOOLS_SCHEMA = [{
  type: "function",
  function: {
    name: "web_search",
    description: "Search for Indian engineering courses and tech trends.",
    parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
}];

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

  let currentSessionId = sessionId;
  if (!currentSessionId) {
    const { data: session } = await supabaseAdmin
      .from('chat_sessions')
      .insert({ user_id: user.id, title: content.slice(0, 35) })
      .select().single();
    currentSessionId = session.id;
  }

  await supabaseAdmin.from('chat_messages').insert({ session_id: currentSessionId, role: 'user', content });

  const history = await getChatMessages(currentSessionId);
  const messages: any[] = [
    { role: "system", content: "You are Architect Prime. Expert in Indian Engineering. Use Markdown tables." },
    ...history
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    tools: TOOLS_SCHEMA as any,
  });

  const responseMessage = response.choices[0].message;
  let finalContent = responseMessage.content;

  if (responseMessage.tool_calls) {
    messages.push(responseMessage);
    for (const toolCall of responseMessage.tool_calls) {
      const result = await web_search(JSON.parse(toolCall.function.arguments).query);
      messages.push({ tool_call_id: toolCall.id, role: "tool", name: "web_search", content: result });
    }
    const secondRes = await groq.chat.completions.create({ model: "llama-3.1-8b-instant", messages });
    finalContent = secondRes.choices[0].message.content;
  }

  await supabaseAdmin.from('chat_messages').insert({ session_id: currentSessionId, role: 'assistant', content: finalContent });
  await supabaseAdmin.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', currentSessionId);

  return { sessionId: currentSessionId, content: finalContent };
}