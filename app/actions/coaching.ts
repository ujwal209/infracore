'use server'

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getAgentUrl = () => {
  const url = process.env.NEXT_PUBLIC_AGENT_URL || process.env.AGENT_URL || "http://127.0.0.1:8789";
  return url.replace(/\/$/, ""); 
};

// 🚀 NEW: Creates the session FIRST so the frontend can upload files directly to Python
export async function initializeSession(title: string) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const sessionTitle = (title || "New Session").slice(0, 35) + '...';

  const { data: session } = await supabaseAdmin
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      title: sessionTitle
    })
    .select().single();

  if (!session) throw new Error("Failed to initialize session");

  return session.id;
}

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

// 🚀 UPDATED: Now receives pre-uploaded file URLs from the frontend!
export async function sendCoachingMessage(
  sessionId: string, 
  content: string, 
  model: string = 'gpt-4o',
  fileUrls: string[] = [], // No more FormData!
  truncateIndex?: number
) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let chatHistory: { role: string; content: string }[] = [];

  const { data: pastMessages } = await supabaseAdmin
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (pastMessages) {
    if (typeof truncateIndex === 'number' && truncateIndex < pastMessages.length) {
      const { data: allMsgs } = await supabaseAdmin
        .from('chat_messages')
        .select('id')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
        
      if (allMsgs && truncateIndex < allMsgs.length) {
        const idsToDelete = allMsgs.slice(truncateIndex).map(m => m.id);
        await supabaseAdmin.from('chat_messages').delete().in('id', idsToDelete);
      }
      chatHistory = pastMessages.slice(0, truncateIndex);
    } else {
      chatHistory = pastMessages;
    }
  }

  // Append file markdown to the database record so history renders correctly
  if (fileUrls.length > 0) {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    const fileMarkdown = fileUrls.map((url) => {
      const ext = url.split('.').pop()?.toLowerCase();
      const fileName = url.split('/').pop() || "Document";
      if (ext && imageExtensions.includes(ext)) {
        return `\n\n![${fileName}](${url})`;
      } else {
        return `\n\n[${fileName}](attachment)`;
      }
    }).join("");
    content += fileMarkdown;
  }

  await supabaseAdmin.from('chat_messages').insert({ session_id: sessionId, role: 'user', content });

  let finalContent = "";
  try {
    const AGENT_URL = getAgentUrl();
    const response = await fetch(`${AGENT_URL}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: content, 
        history: chatHistory,
        sessionId: sessionId,
        images: fileUrls, // Pass URLs directly to Python
        model: model 
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    let rawContent = data.response || data.answer || data.message;
    
    if (Array.isArray(rawContent)) {
      finalContent = rawContent.map((block: any) => typeof block === 'string' ? block : block.text || block.content || JSON.stringify(block)).join('');
    } else if (typeof rawContent === 'object' && rawContent !== null) {
      finalContent = rawContent.text || rawContent.content || JSON.stringify(rawContent);
    } else {
      finalContent = String(rawContent || "");
    }

  } catch (error: any) {
    console.error("Chat Error:", error);
    if (error.message?.includes("413") || error.message?.includes("too large")) {
      finalContent = "### ⨯ Conversation Too Large\nThis session has exceeded the processing limit. **Please start a new chat** to continue smoothly!";
    } else {
      finalContent = `### ⨯ Connection Disrupted\nFailed to reach the INFERA engine. \n**Details:** ${error.message}`;
    }
  }

  await supabaseAdmin.from('chat_messages').insert({ session_id: sessionId, role: 'assistant', content: finalContent });
  await supabaseAdmin.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', sessionId);

  return { sessionId: sessionId, content: finalContent };
}