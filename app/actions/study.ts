'use server'



import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

// Admin client bypasses RLS for guaranteed database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🚀 CRITICAL FIX: Clean the URL so we never get double slashes (//)
const getAgentUrl = () => {
  const url = process.env.NEXT_PUBLIC_AGENT_URL || process.env.AGENT_URL || "http://127.0.0.1:8789";
  return url.replace(/\/$/, ""); 
};

// 🚀 NEW: Creates the session FIRST so the frontend can upload files directly to Python
export async function initializeSession(title: string, initData?: { subject: string, level: string }) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const sessionTitle = initData ? `Study: ${initData.subject}` : (title || "New Session").slice(0, 35) + '...';

  const { data: session, error } = await supabaseAdmin
    .from('study_sessions')
    .insert({ 
      user_id: user.id, 
      title: sessionTitle,
      subject: initData?.subject,
      level: initData?.level
    })
    .select().single();

  if (error || !session) {
    console.error("Session Init Error:", error);
    throw new Error("Failed to initialize session");
  }

  return session.id;
}

export async function getStudySessions() {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return [];

  const { data } = await supabaseAdmin
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  return data || [];
}

export async function getStudyMessages(sessionId: string) {
  const { data } = await supabaseAdmin
    .from('study_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return data || [];
}

export async function deleteStudySession(id: string) {
  await supabaseAdmin.from('study_sessions').delete().eq('id', id);
}

export async function renameStudySession(id: string, title: string) {
  await supabaseAdmin.from('study_sessions').update({ title }).eq('id', id);
}

// 🚀 UPDATED: Now receives pre-uploaded file URLs from the frontend!
export async function sendStudyMessage(
  sessionId: string | null, 
  content: string, 
  fileUrls: string[] = [], // No more FormData passing through Vercel!
  options?: { webSearch?: boolean, deepThink?: boolean },
  truncateIndex?: number,
  initData?: { subject: string, level: string }
) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let currentSessionId = sessionId;
  let chatHistory: { role: string; content: string }[] = [];

  // Fallback creation if session wasn't initialized first
  if (!currentSessionId) {
    const sessionTitle = initData ? `Study: ${initData.subject}` : (content || "New Session").slice(0, 35) + '...';
    const { data: session } = await supabaseAdmin
      .from('study_sessions')
      .insert({ 
        user_id: user.id, 
        title: sessionTitle,
        subject: initData?.subject,
        level: initData?.level
      })
      .select().single();
    currentSessionId = session.id;
  } else {
    // SECURITY CHECK
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('study_sessions')
      .select('user_id')
      .eq('id', currentSessionId)
      .single();

    if (sessionError || !sessionData || sessionData.user_id !== user.id) {
      throw new Error("Unauthorized: Invalid session access.");
    }

    // FETCH CONTEXT
    const { data: pastMessages } = await supabaseAdmin
      .from('study_messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true });

    if (pastMessages) {
      if (typeof truncateIndex === 'number' && truncateIndex < pastMessages.length) {
        const { data: allMsgs } = await supabaseAdmin
          .from('study_messages')
          .select('id')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true });
          
        if (allMsgs && truncateIndex < allMsgs.length) {
          const idsToDelete = allMsgs.slice(truncateIndex).map(m => m.id);
          await supabaseAdmin.from('study_messages').delete().in('id', idsToDelete);
        }
        chatHistory = pastMessages.slice(0, truncateIndex);
      } else {
        chatHistory = pastMessages;
      }
    }
  }

  // --- 🚀 FILE MARKDOWN INJECTION ---
  if (fileUrls.length > 0) {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    const fileMarkdown = fileUrls
      .map((url) => {
        const ext = url.split('.').pop()?.toLowerCase();
        const fileName = url.split('/').pop() || "Document";
        if (ext && imageExtensions.includes(ext)) {
          return `\n\n![${fileName}](${url})`;
        } else {
          return `\n\n[📁 Attached File: ${fileName}](${url})`;
        }
      })
      .join("");
    
    content += fileMarkdown;
  }

  await supabaseAdmin.from('study_messages').insert({ session_id: currentSessionId, role: 'user', content });

  let finalContent = "";
  try {
    const AGENT_URL = getAgentUrl();
    const response = await fetch(`${AGENT_URL}/api/v1/study`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: content, 
        history: chatHistory,
        sessionId: currentSessionId,
        images: fileUrls, // Pass the URLs to Python
        webSearch: options?.webSearch,
        deepThink: options?.deepThink
      }),
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    let rawContent = data.response || data.answer || data.message;
    finalContent = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);

  } catch (error: any) {
    console.error("Study Chat Error:", error);
    if (error.message?.includes("413") || error.message?.includes("too large")) {
      finalContent = "### ⨯ Conversation Too Large\nThis session has exceeded the processing limit. **Please start a new chat** to continue smoothly!";
    } else {
      // 🚀 EXPOSE REAL ERROR
      finalContent = `### ⨯ Connection Disrupted\nCould not reach the INFERA Study engine. \n**Details:** ${error.message}`;
    }
  }

  await supabaseAdmin.from('study_messages').insert({ session_id: currentSessionId, role: 'assistant', content: finalContent });
  await supabaseAdmin.from('study_sessions').update({ updated_at: new Date().toISOString() }).eq('id', currentSessionId);

  return { sessionId: currentSessionId, content: finalContent };
}

// ✅ UPGRADED: Using supabaseAdmin for reliable DB insertion
export async function saveQuizResult(data: {
  session_id: string;
  topic: string;
  score: number;
  total_questions: number;
  quiz_data: any;
}) {
  const supabaseAuth = await createServerClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  
  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabaseAdmin.from('study_quiz_results').insert({
    user_id: user.id,
    session_id: data.session_id,
    topic: data.topic,
    score: data.score,
    total_questions: data.total_questions,
    quiz_data: data.quiz_data
  });

  if (error) throw error;
  return { success: true };
}

// ✅ Study Progress: DB-backed progress tracking per session
export async function getStudyProgress(sessionId: string) {
  const { data } = await supabaseAdmin
    .from('study_progress')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data || null;
}

export async function upsertStudyProgress(sessionId: string, update: {
  mastery_percentage?: number;
  completed_concepts?: string[];
  current_topic?: string;
}) {
  const existing = await getStudyProgress(sessionId);
  
  if (existing) {
    // Cap mastery at 100, ensure it never drops
    const newMastery = Math.min(100, Math.max(existing.mastery_percentage, update.mastery_percentage ?? existing.mastery_percentage));
    const { error } = await supabaseAdmin
      .from('study_progress')
      .update({
        mastery_percentage: newMastery,
        completed_concepts: update.completed_concepts ?? existing.completed_concepts,
        current_topic: update.current_topic ?? existing.current_topic,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
      
    if (error) {
      console.error("UPSERT ERROR (UPDATE):", error);
      throw error;
    }
  } else {
    const { error } = await supabaseAdmin
      .from('study_progress')
      .insert({
        session_id: sessionId,
        mastery_percentage: Math.min(100, update.mastery_percentage ?? 0),
        completed_concepts: update.completed_concepts ?? [],
        current_topic: update.current_topic ?? 'Initialization'
      });
      
    if (error) {
      console.error("UPSERT ERROR (INSERT):", error);
      throw error;
    }
  }
  
  return getStudyProgress(sessionId);
}

// ✅ UPGRADED: Using supabaseAdmin for reliable DB fetching
export async function getQuizHistory() {
  const supabaseAuth = await createServerClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  
  if (authError || !user) return [];

  const { data, error } = await supabaseAdmin
    .from('study_quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}