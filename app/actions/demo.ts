'use server'

export async function sendDemoMessage(message: string, history: any[]) {
  try {
    const response = await fetch('https://inferaagent.onrender.com/api/v1/study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, deepThink: false, webSearch: false }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Demo API Error response:", errorText);
      throw new Error(errorText);
    }
    
    const data = await response.json();
    let rawContent = data.response || data.answer || data.message;
    return typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);
  } catch (error: any) {
    console.error('Demo connection error:', error?.message || error);
    throw new Error('Demo API connection failed.');
  }
}
