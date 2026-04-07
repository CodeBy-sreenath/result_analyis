import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // fast + large context, great for extraction

// ================================
//  SAFE JSON PARSER
// ================================
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("❌ JSON parse failed. Raw output:");
    console.log(text.substring(0, 300));
    throw new Error("Groq returned invalid JSON");
  }
}

// ==========================================
//  MAIN FUNCTION - EXTRACT DATA FROM PDF TEXT
// ==========================================
export const extractDataFromPDFText = async (pdfText) => {
  console.log(`➡ Using Groq model: ${MODEL}`);

  const prompt = `
You must extract KTU exam result data and return STRICT JSON ONLY.

JSON MUST BE WRAPPED INSIDE <json> ... </json> TAGS.

NO markdown.
NO commentary.
NO extra text.

FOLLOW THIS EXACT JSON STRUCTURE:

{
  "examInfo": {
    "examName": "string",
    "semester": number,
    "examDate": "string"
  },
  "departments": [
    {
      "name": "string",
      "courses": [
        { "code": "string", "name": "string" }
      ],
      "students": [
        {
          "registerNumber": "string",
          "subjects": [
            { "code": "string", "grade": "string" }
          ]
        }
      ]
    }
  ]
}

Now extract JSON from this PDF text:

${pdfText}

RETURN ONLY:

<json>
{ ... }
</json>
`;

  const body = {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,        // deterministic output for structured data
    max_tokens: 8192,
  };

  console.log("📤 Sending request to Groq API...");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,   // ← Groq uses Bearer token, not query param
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Groq API error: ${data.error.message}`);
  }

  const text = data.choices?.[0]?.message?.content || "";

  console.log("📥 Raw text received, length:", text.length);

  // Extract JSON inside <json>...</json>
  const match = text.match(/<json>([\s\S]*?)<\/json>/);

  if (!match) {
    throw new Error("Groq did not return JSON inside <json> tags");
  }

  const jsonString = match[1].trim();
  console.log("🔍 Extracted JSON size:", jsonString.length);

  return safeJSONParse(jsonString);
};