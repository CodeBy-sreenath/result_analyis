import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =================================
// REGEX PARSER (PRIMARY ENGINE)
// =================================
function parseKTUResult(text) {
  const lines = text.split("\n");

  const students = [];
  let currentStudent = null;

  const regRegex = /[A-Z]{3}\d{2}[A-Z]{2}\d{3}/;
  const subjectRegex = /([A-Z]{3}\d{3})\s*\(?([A-Z+]+|Absent|F|FE|P)\)?/g;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const regMatch = line.match(regRegex);

    if (regMatch) {
      if (currentStudent) students.push(currentStudent);

      currentStudent = {
        registerNumber: regMatch[0],
        subjects: [],
      };

      line = line.replace(regMatch[0], "").trim();
    }

    let match;
    while ((match = subjectRegex.exec(line)) !== null) {
      if (currentStudent) {
        currentStudent.subjects.push({
          code: match[1],
          grade: match[2],
        });
      }
    }
  }

  if (currentStudent) students.push(currentStudent);

  return students;
}

// =================================
// OPTIONAL: GROQ CLEANUP (LIGHT)
// =================================
async function enhanceWithGroq(students) {
  try {
    const sample = students.slice(0, 10); // small batch

    const prompt = `
Clean and normalize this JSON.

Rules:
- Keep structure SAME
- Fix wrong grades if any
- Return JSON only

${JSON.stringify(sample)}
`;

    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Return only JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
    });

    let text = res.choices[0]?.message?.content || "";
    text = text.replace(/```json|```/g, "").trim();

    const fixed = JSON.parse(text);

    // merge back cleaned data
    return students.map((s, i) => fixed[i] || s);
  } catch {
    return students; // fallback
  }
}

// =================================
// MAIN FUNCTION (FINAL)
// =================================
export const extractDataFromPDFText = async (pdfText) => {
  console.log("📡 HYBRID extraction started...");

  // ✅ STEP 1: Extract ALL students using regex
  const students = parseKTUResult(pdfText);

  console.log("🎯 Total students extracted (regex):", students.length);

  // ✅ STEP 2: Optional cleanup using Groq
  const enhancedStudents = await enhanceWithGroq(students);

  // =================================
  // FINAL OUTPUT (TABLE COMPATIBLE)
  // =================================
  return {
    examInfo: {},
    departments: [
      {
        name: "Combined",
        students: enhancedStudents,
      },
    ],
  };
};