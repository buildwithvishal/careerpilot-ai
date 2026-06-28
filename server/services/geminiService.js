import { GoogleGenAI } from "@google/genai";

export const analyzeResumeWithGemini = async (resumeText) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a professional ATS Resume Analyzer.

Analyze the resume and return ONLY valid JSON.

Format:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "keywords": []
}

Resume:
${resumeText}
`,
  });

  return response.text;
};