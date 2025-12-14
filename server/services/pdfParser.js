import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (base64) => {
  try {
    console.log("📄 Converting PDF base64 → buffer...");
    const buffer = Buffer.from(base64, "base64");

    console.log("⏳ Extracting text using pdf-parse...");
    const data = await pdfParse(buffer);

    console.log("✅ PDF text extracted.");
    return data.text;

  } catch (error) {
    console.error("❌ PDF parse error:", error.message);
    throw new Error("Failed to extract text from PDF");
  }
};
