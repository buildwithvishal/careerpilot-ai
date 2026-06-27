import { GoogleGenAI } from "@google/genai";

export const analyzeResumeWithGemini = async (resumeText) => {
  console.log("Gemini Key =", process.env.GEMINI_API_KEY);

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an expert career coach.

Analyze this resume:

${resumeText}
`,
  });

  return response.text;
};