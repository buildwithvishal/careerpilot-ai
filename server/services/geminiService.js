import { GoogleGenAI } from "@google/genai";

export const analyzeResumeWithGemini = async (resumeText) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a professional ATS Resume Analyzer and Career Coach.

Analyze the following resume and provide the output in EXACTLY this format:

ATS SCORE: <score out of 100>

STRENGTHS:
- Point 1
- Point 2
- Point 3

WEAKNESSES:
- Point 1
- Point 2
- Point 3

IMPROVEMENT SUGGESTIONS:
- Point 1
- Point 2
- Point 3

MISSING KEYWORDS:
- Keyword 1
- Keyword 2
- Keyword 3

FINAL VERDICT:
<Short overall evaluation>

Resume:

${resumeText}
`,
  });

  return response.text;
};