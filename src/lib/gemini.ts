/**
 * Google Gemini AI Integration for Professional ATS Resume Translation
 * Models: gemini-2.0-flash (primary) with fallback to gemini-1.5-flash
 */

interface GeminiTranslateOptions {
  type?: 'summary' | 'experience';
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

  const isSummary = options.type === 'summary';

  const roleContext = options.role?.trim() ? `Job Title/Role: "${options.role}"` : '';
  const companyContext = options.company?.trim() ? `Company: "${options.company}"` : '';
  const contextHeader = [roleContext, companyContext].filter(Boolean).join(' | ');

  const systemInstruction = isSummary
    ? `You are a world-class executive resume writer, career coach, and ATS (Applicant Tracking System) optimization expert.
Your task is to translate and elevate the provided Indonesian professional summary / bio into flawless, executive-level, high-impact business English.

STRICT RULES:
1. Elevate the summary into confident, polished, executive-level prose standard in top US/UK/International resumes.
2. Never produce literal word-for-word translations. Frame skills, experience, and accomplishments to showcase maximum authority and business value.
3. Preserve all numbers, metrics, technologies, frameworks, and key credentials accurately (e.g., 5+ years, React, Next.js, 40%, etc.).
4. Structure the output as a cohesive, impactful 2-4 sentence paragraph.
5. Return ONLY the translated resume summary text. DO NOT add any greeting, preamble, markdown code blocks, explanation, notes, or quotes.`
    : `You are a world-class executive resume writer, certified career coach, and ATS (Applicant Tracking System) optimization expert.
Your task is to translate and elevate the provided Indonesian job description into flawless, high-impact, professional business English.

STRICT RULES:
1. Use strong, decisive resume action verbs in the past tense for past roles or present for current roles (e.g., Spearheaded, Architected, Orchestrated, Engineered, Streamlined, Cultivated, Championed, Accelerated).
2. Never produce literal word-for-word translations like Google Translate. Transform sentences into punchy, metric-driven achievements.
3. Preserve all numbers, metrics, dates, currencies, and technical terms/frameworks accurately (e.g., Rp, %, KPIs, React, SQL, OKRs).
4. If input has bullet points or multiple lines, format each point starting with "• " (bullet) followed by a space.
5. If input is a paragraph, translate it into polished, professional prose.
6. Return ONLY the translated resume text. DO NOT add any greeting, preamble, markdown code blocks (\`\`\`), explanation, notes, or quotes.`;

  const userPrompt = isSummary
    ? `${contextHeader ? `Context:\n${contextHeader}\n\n` : ''}Translate and elevate this Indonesian professional resume summary into executive-level English:
"""
${text.trim()}
"""`
    : `${contextHeader ? `Context:\n${contextHeader}\n\n` : ''}Translate and optimize this Indonesian job experience into professional English:
"""
${text.trim()}
"""`;

  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];
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

        // Try next model if 404, 503, or overloaded
        if (res.status === 404 || res.status === 503) {
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

export interface FullCVTranslateInput {
  jobTitle?: string;
  summary?: string;
  experiences?: Array<{
    id: string;
    role: string;
    company?: string;
    description?: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution?: string;
    description?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

export interface FullCVTranslateOutput {
  jobTitle?: string;
  summary?: string;
  experiences?: Array<{
    id: string;
    role: string;
    description?: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    description?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

export async function translateFullCVWithGemini(
  cvInput: FullCVTranslateInput,
  options: { customApiKey?: string } = {}
): Promise<FullCVTranslateOutput> {
  const apiKey =
    options.customApiKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    const error: any = new Error(
      'Google Gemini API Key belum dikonfigurasi di server.'
    );
    error.needsKey = true;
    error.status = 400;
    throw error;
  }

  const systemInstruction = `You are a world-class executive resume writer, certified career coach, and ATS (Applicant Tracking System) optimization expert.
Your task is to translate and elevate an entire Indonesian CV / resume into flawless, high-impact, professional business English.

STRICT ELEVATION RULES:
1. Job Title: Translate into the standard international/corporate title (e.g. "Pengembang Web Full Stack" -> "Full Stack Web Developer", "Manajer Pemasaran" -> "Marketing Manager").
2. Professional Summary: Elevate into polished, executive-level narrative (2-4 sentences) highlighting authority, key technical competencies, and value proposition.
3. Work Experiences:
   - Role: Translate each position role to standard international job titles.
   - Description: For each bullet point, begin with strong decisive action verbs in past tense for past jobs or present for current jobs (e.g., Spearheaded, Architected, Engineered, Streamlined, Orchestrated).
   - If description has lines starting with bullets (•, -, *), ensure each point begins with "• " followed by a space.
   - Preserve all metrics, percentages, numbers, and tech stack terms accurately.
4. Education:
   - Degree: Translate Indonesian degree names into standard English equivalents (e.g., "Sarjana Ilmu Komputer (S.Kom)" -> "Bachelor of Computer Science").
   - Description: Elevate honors and coursework descriptions into professional English.
5. Languages:
   - Translate language names and levels to international ILR / CEFR standards:
     * "Bahasa Indonesia" -> "Indonesian", "Penutur Asli" -> "Native"
     * "Bahasa Inggris" -> "English", "Profesional Aktif" / "Mahir" -> "Full Professional Proficiency" / "Professional Working Proficiency"
6. Schema:
   Return a valid JSON object matching the input IDs:
   {
     "jobTitle": "...",
     "summary": "...",
     "experiences": [{ "id": "...", "role": "...", "description": "..." }],
     "education": [{ "id": "...", "degree": "...", "description": "..." }],
     "languages": [{ "id": "...", "name": "...", "level": "..." }]
   }
   Return ONLY raw JSON, with no markdown code fences.`;

  const models = [
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(cvInput) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            topP: 0.85,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData?.error?.message || `Status ${res.status}`;
        if (res.status === 404 || res.status === 503) {
          lastError = new Error(message);
          continue;
        }
        throw new Error(message);
      }

      const data = await res.json();
      const rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawOutput) {
        throw new Error('Gemini AI tidak mengembalikan respons teks.');
      }

      const parsed: FullCVTranslateOutput = JSON.parse(rawOutput);
      return parsed;
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Gagal menerjemahkan seluruh CV dengan Google Gemini AI.');
}

