import { NextRequest, NextResponse } from 'next/server';
import Mixedbread from '@mixedbread/sdk';

// Safely parse the keys
const MIXBREAD_API_KEYS = (process.env.MIXBREAD_API_KEYS || process.env.MIXBREAD_API_KEY || "")
  .split(",")
  .map(k => k.trim())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  console.log("\n=============================================");
  console.log("📥 [UPLOAD API] Request received!");

  try {
    const formData = await request.formData();
    const file = formData.get('file') as unknown as File; // Strict cast to bypass TS errors

    if (!file) {
      console.error("❌ [UPLOAD API] No file found in FormData.");
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`📄 [UPLOAD API] File detected: ${file.name} (${file.size} bytes) | Type: ${file.type}`);

    if (MIXBREAD_API_KEYS.length === 0) {
      console.error("❌ [UPLOAD API] Mixbread API keys are missing from .env!");
      return NextResponse.json({ error: 'Mixbread API keys not configured' }, { status: 500 });
    }

    let lastError: any = null;

    // --- FALLBACK LOOP ---
    for (const apiKey of MIXBREAD_API_KEYS) {
      try {
        console.log(`🔄 [UPLOAD API] Trying Mixbread Key starting with: ${apiKey.substring(0, 5)}...`);
        
        const client = new Mixedbread({ apiKey });

        // SDK natively handles the file upload
        const uploadedFile = await client.files.create({ file: file });

        console.log(`✅ [UPLOAD API] SUCCESS! Mixbread File ID: ${uploadedFile.id}`);
        console.log("=============================================\n");

        return NextResponse.json({
          success: true,
          data: uploadedFile,
          url: uploadedFile.id, // Mixbread returns an ID, not a public URL
        });

      } catch (error: any) {
        console.warn(`⚠️ [UPLOAD API] Key failed. Error: ${error.message || error}`);
        lastError = error;
      }
    }

    // If loop finishes, all keys failed
    console.error("❌ [UPLOAD API] All Mixbread keys failed.");
    console.log("=============================================\n");
    return NextResponse.json({ 
      error: 'All Mixbread API keys failed. Rate limited or out of credits.',
      details: lastError?.message || String(lastError)
    }, { status: 500 });

  } catch (error: any) {
    console.error('💥 [UPLOAD API] FATAL ROUTE ERROR:', error);
    console.log("=============================================\n");
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}