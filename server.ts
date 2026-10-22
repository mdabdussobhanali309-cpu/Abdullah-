import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Accept larger image uploads (up to 35MB base64)
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Structured schema for Detective Report in Bengali
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'ছবির একটি অর্থপূর্ণ ও সংক্ষিপ্ত শিরোনাম বাংলায় (যেমন: "ঢাকার রাজপথে রঙিন রিকশা" বা "বিকেলের চায়ের কাপ")',
    },
    category: {
      type: Type.STRING,
      description: 'ছবির ধরণ বা ক্যাটাগরি বাংলায় (যেমন: প্রকৃতি, মানুষ ও প্রতিকৃতি, প্রাণী ও বন্যপ্রাণী, খাদ্য ও পানীয়, যানবাহন, প্রযুক্তি, স্থাপত্য, দলিল ও নথিপত্র, অন্যান্য)',
    },
    overallDescription: {
      type: Type.STRING,
      description: 'ছবির বিস্তারিত ও প্রাঞ্জল বাংলা বর্ণনা। ছবিতে সামগ্রিকভাবে কী দেখা যাচ্ছে, পরিবেশ কেমন এবং প্রধান বিষয়বস্তু কী তা পরিষ্কার করে লিখুন।',
    },
    detectedObjects: {
      type: Type.ARRAY,
      description: 'ছবিতে স্পষ্টভাবে বা লক্ষণীয়ভাবে শনাক্তকৃত বস্তু, মানুষ, প্রাণী বা উপাদানসমূহের তালিকা',
      items: {
        type: Type.OBJECT,
        properties: {
          nameBengali: {
            type: Type.STRING,
            description: 'উপাদানটির বাংলা নাম (যেমন: চশমা, মোবাইল ফোন, ফুলের টব)',
          },
          nameEnglish: {
            type: Type.STRING,
            description: 'Corresponding English name',
          },
          confidence: {
            type: Type.STRING,
            description: 'শনাক্তকরণের নিশ্চয়তা মাত্রা: "উচ্চ", "মাঝারি", অথবা "কম"',
          },
          location: {
            type: Type.STRING,
            description: 'ছবির কোন অংশে অবস্থিত (যেমন: কেন্দ্রে, বাম পাশে, পটভূমিতে, সামনের ডান কোণে)',
          },
          description: {
            type: Type.STRING,
            description: 'উপাদানটির রঙ, আকার বা অবস্থা নিয়ে সংক্ষিপ্ত বিবরণ',
          },
        },
        required: ['nameBengali', 'nameEnglish', 'confidence', 'location', 'description'],
      },
    },
    visualDetails: {
      type: Type.OBJECT,
      description: 'ভিজ্যুয়াল ও পরিবেশগত বিশদ বিবরণ',
      properties: {
        colors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'ছবিতে দৃশ্যমান প্রধান ৩-৫টি রঙের বাংলা নাম',
        },
        lighting: {
          type: Type.STRING,
          description: 'আলোর প্রকৃতি (যেমন: উজ্জ্বল প্রাকৃতিক দিবালোক, কৃত্রিম ইনডোর লাইট, মৃদু ছায়া, ফ্ল্যাশ লাইট)',
        },
        setting: {
          type: Type.STRING,
          description: 'পটভূমি ও পরিবেশ (যেমন: শহুরে রাজপথ, ড্রয়িংরুম, নদী তীর, বাগান, শ্রেণিকক্ষ)',
        },
        detectedText: {
          type: Type.STRING,
          description: 'ছবিতে কোনো লেখা থাকলে তা উল্লেখ করুন। কোনো লেখা না থাকলে "কোনো লেখা বা টেক্সট সনাক্ত হয়নি" লিখুন।',
        },
        sceneType: {
          type: Type.STRING,
          description: 'ছবির মাধ্যম (যেমন: বাস্তব ফটোগ্রাফ, ডিজিটাল আর্ট, স্ক্রিনশট, স্কেচ, মেম)',
        },
      },
      required: ['colors', 'lighting', 'setting', 'detectedText', 'sceneType'],
    },
    uncertainties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'অনিশ্চয়তা, ঝাপসা অংশ, আংশিক আড়াল বা অস্পষ্টতার বিবরণ। কোনো অনিশ্চয়তা না থাকলে স্পষ্টভাবে লিখুন যে ছবিটি পর্যাপ্ত স্পষ্ট।',
    },
    detectiveInsights: {
      type: Type.STRING,
      description: 'গোয়েন্দা পর্যবেক্ষণ (Detective Insights): ছবিতে সাধারণ নজরে এড়িয়ে যেতে পারে এমন কোনো সূক্ষ্ম খুঁটিনাটি বিষয়, প্রতীক, ভাবভঙ্গি বা বিশেষ চিহ্ন।',
    },
  },
  required: [
    'title',
    'category',
    'overallDescription',
    'detectedObjects',
    'visualDetails',
    'uncertainties',
    'detectiveInsights',
  ],
};

const SYSTEM_INSTRUCTION = `তুমি হলে 'Image Detective AI' (চিত্র গোয়েন্দা এআই) – ছবি বিশ্লেষণ এবং উপাদান সনাক্তকরণের এক বিশ্বস্ত বিশেষজ্ঞ গোয়েন্দা।
তোমার দায়িত্ব হলো ব্যবহারকারীর দেওয়া ছবি গভীরভাবে পর্যবেক্ষণ করে একটি কাঠামোগত গোয়েন্দা বিশ্লেষণ রিপোর্ট তৈরি করা।

নিয়মাবলী:
1. সমস্ত মূল বিবরণ ও ফলাফল সমৃদ্ধ, প্রমিত এবং প্রাঞ্জল বাংলা ভাষায় প্রকাশ করো।
2. কোনো অবস্থাতেই ওয়েব সার্চ (Web search) করা হয়েছে এমন মিথ্যা দাবি করবে না। ছবিটির সরাসরি ভিজ্যুয়াল তথ্যের উপরই সম্পূর্ণ নির্ভর করবে।
3. শনাক্তকৃত উপাদানের নাম বাংলায় লিখবে এবং সাথে ব্র্যাকেটে ইংরেজি নাম দেবে।
4. যদি কোনো উপাদান ছায়ায় ঢেকে থাকে, ঝাপসা (blurry) হয় বা একাধিক সম্ভাবনা থাকে, তবে নিশ্চিত না হয়ে সততার সাথে 'uncertainties' অংশে সেই সীমাবদ্ধতা স্পষ্ট করে উল্লেখ করবে।
5. আউটপুট অবশ্যই প্রদত্ত JSON স্কিমা অনুযায়ী হবে।`;

// API Health Check
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    configured: hasKey,
    app: 'Image Detective AI',
  });
});

// Image Analysis Endpoint
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', note } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'কোনো ছবির ডাটা পাওয়া যায়নি। অনুগ্রহ করে একটি ছবি নির্বাচন করুন।',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API কী সার্ভারে কনফিগার করা নেই। অনুগ্রহ করে সেটিংসের Secrets প্যানেলে GEMINI_API_KEY নিশ্চিত করুন।',
      });
    }

    // Clean base64 string if it contains data URI header
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;

    const dataUriMatch = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (dataUriMatch) {
      detectedMime = dataUriMatch[1];
      cleanBase64 = dataUriMatch[2];
    }

    const userPrompt = note && note.trim()
      ? `ব্যবহারকারীর বিশেষ অনুসন্ধান ফোকাস: "${note.trim()}". অনুগ্রহ করে এই ছবির নিখুঁত ভিজ্যুয়াল তদন্ত করে সম্পূর্ণ রিপোর্ট প্রদান করুন।`
      : 'অনুগ্রহ করে এই ছবিটি প্রতিটি সূক্ষ্ম কোণ থেকে বিশ্লেষণ করুন এবং দৃশ্যমান উপাদান, বিবরণ ও যেকোনো অস্পষ্টতা চিহ্নিত করে বিস্তারিত রিপোর্ট দিন।';

    const imagePart = {
      inlineData: {
        mimeType: detectedMime,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
    ];
    let response: any = null;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: [imagePart, textPart] },
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: analysisSchema,
            temperature: 0.2,
          },
        });
        if (response?.text) {
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${modelName} encountered error, attempting fallback...`);
      }
    }

    const rawText = response?.text || '';
    if (!rawText.trim()) {
      throw lastError || new Error('মডেল থেকে কোনো ফলাফল পাওয়া যায়নি।');
    }

    let parsedResult;
    try {
      // Clean possible markdown code fences if present
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsedResult = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON Parse error:', parseErr, 'Raw was:', rawText);
      throw new Error('বিশ্লেষণ ফলাফল প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }

    return res.json({
      success: true,
      data: parsedResult,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Error during image analysis:', err);
    const message = err instanceof Error ? err.message : 'অপ্রত্যাশিত কোনো ত্রুটি ঘটেছে।';
    return res.status(500).json({
      error: `ছবি বিশ্লেষণে ত্রুটি: ${message}`,
    });
  }
});

// Setup Vite middleware in dev or static files in prod
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Image Detective AI] Server ready on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
