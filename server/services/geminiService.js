import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY;

// ================================
//  SAFE JSON PARSER (works 100%)
// ================================
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("❌ JSON parse failed. Raw output:");
    console.log(text.substring(0, 300));
    throw new Error("Gemini returned invalid JSON");
  }
}

// ==========================================
//  MAIN FUNCTION - EXTRACT DATA FROM PDF TEXT
// ==========================================
export const extractDataFromPDFText = async (pdfText) => {
  console.log("📡 Fetching available v1 models...");

  // Fetch ALL models
  const modelList = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
  );
  const modelJson = await modelList.json();

  if (!modelJson.models) {
    throw new Error("Unable to fetch model list");
  }

  // Choose fast, cheap model
  const model =
    modelJson.models.find((m) => m.name.includes("gemini-2.5-flash"))?.name ||
    modelJson.models.find((m) => m.name.includes("flash"))?.name;

  if (!model) {
    throw new Error("No compatible Gemini v1 model found");
  }

  console.log("➡ Using model:", model);

  // REST endpoint
  const url = `https://generativelanguage.googleapis.com/v1/${model}:generateContent?key=${API_KEY}`;

  // JSON output forced with delimiter trick
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
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  console.log("📤 Sending request to Google AI...");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("📥 Raw text received, length:", text.length);

  // Extract JSON inside <json>...</json>
  const match = text.match(/<json>([\s\S]*?)<\/json>/);

  if (!match) {
    throw new Error("Gemini did not return JSON inside <json> tags");
  }

  const jsonString = match[1].trim();

  console.log("🔍 Extracted JSON size:", jsonString.length);

  // Safe parse
  return safeJSONParse(jsonString);
};
