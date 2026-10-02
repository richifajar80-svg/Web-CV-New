/**
 * Google Gemini AI Integration for Professional ATS Resume Translation
 * Models: gemini-2.0-flash (primary) with fallback to gemini-1.5-flash
 */

interface GeminiTranslateOptions {
  role?: string;
  company?: string;
  targetLanguage?: string;
  customApiKey?: string;
}

export async function translateJobDescriptionWithGemini(
  text: string,
  options: GeminiTranslateOptions = {}
): Promise<string> {
  const apiKey =
    options.customApiKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    const error: any = new Error(
      'Google Gemini API Key belum dikonfigurasi. Masukkan API Key Anda untuk menggunakan fitur ini.'
    );
    error.needsKey = true;
    error.status = 400;
    throw error;
  }

  const roleContext = options.role?.trim() ? `Job Title/Role: "${options.role}"` : '';
  const companyContext = options.company?.trim() ? `Company: "${options.company}"` : '';
  const contextHeader = [roleContext, companyContext].filter(Boolean).join(' | ');

  const systemInstruction = `You are a world-class executive resume writer, certified career coach, and ATS (Applicant Tracking System) optimization expert.
Your task is to translate and elevate the provided Indonesian job description into flawless, high-impact, professional business English.

STRICT RULES:
1. Use strong, decisive resume action verbs in the past tense for past roles or present for current roles (e.g., Spearheaded, Architected, Orchestrated, Engineered, Streamlined, Cultivated, Championed, Accelerated).
2. Never produce literal word-for-word translations like Google Translate. Transform sentences into punchy, metric-driven achievements.
3. Preserve all numbers, metrics, dates, currencies, and technical terms/frameworks accurately (e.g., Rp, %, KPIs, React, SQL, OKRs).
4. If input has bullet points or multiple lines, format each point starting with "• " (bullet) followed by a space.
5. If input is a paragraph, translate it into polished, professional prose.
6. Return ONLY the translated resume text. DO NOT add any greeting, preamble, markdown code blocks (\`\`\`), explanation, notes, or quotes.`;

  const userPrompt = `${contextHeader ? `Context:\n${contextHeader}\n\n` : ''}Translate and optimize this Indonesian job experience into professional English:
"""
${text.trim()}
"""`;

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topP: 0.85,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData?.error?.message || `Gemini API returned status ${res.status} (${res.statusText})`;
        
        // If API key is invalid/expired
        if (res.status === 400 && message.toLowerCase().includes('api key')) {
          const keyErr: any = new Error('Google Gemini API Key tidak valid. Silakan periksa kembali API Key Anda.');
          keyErr.needsKey = true;
          keyErr.status = 400;
          throw keyErr;
        }

        // Try next model if 404 or unsupported
        if (res.status === 404) {
          lastError = new Error(message);
          continue;
        }

        throw new Error(message);
      }

      const data = await res.json();
      const rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawOutput || typeof rawOutput !== 'string') {
        throw new Error('Gemini AI tidak mengembalikan respons teks yang valid.');
      }

      // Clean output: remove markdown wrappers if any like ``` or ```markdown
      let cleaned = rawOutput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
      }

      return cleaned;
    } catch (err: any) {
      if (err.needsKey) {
        throw err;
      }
      lastError = err;
      // If quota or network error on primary, try fallback model
    }
  }

  throw lastError || new Error('Gagal menghubungi Google Gemini AI.');
}

