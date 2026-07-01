import { GoogleGenAI } from "@google/genai";

export const analyzeResumeWithGemini = async (
  resumeText,
  targetRole = "Software Engineer"
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a strict ATS Resume Analyzer and Technical Recruiter.

Analyze the following resume ONLY for the role of ${targetRole}.

Return ONLY valid JSON.

Format:

{
  "atsScore": 0,
  "roleFit": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "keywords": [],
  "interviewQuestions": []
}

Rules:
- ATS Score must be between 0 and 100.
- Be strict and realistic.
- ATS Score should be based ONLY on suitability for ${targetRole}.
- Missing critical skills must significantly reduce the ATS score.
- Do NOT give high scores simply because the resume is generally good.
- Compare the candidate against an ideal ${targetRole} candidate.

roleFit values:

High:
Strong candidate for student internships and entry-level opportunities in the target role.

Medium:
Has some relevant foundations but requires significant additional skills, projects, or knowledge before being competitive.

Low:
Lacks most of the core skills, projects, or knowledge required for the target role.

Evaluate the candidate as a college student applying for internships and placement opportunities, not as an experienced industry professional.

- missingSkills should contain the most important skills, tools, technologies, or concepts missing for the target role.
- Include only highly relevant missing skills.
- Return 3 to 8 missing skills.

Important:

- weaknesses should describe resume-level limitations, gaps in experience, project quality, project depth, achievements, or overall profile.

- missingSkills should contain only specific technologies, tools, frameworks, libraries, concepts, or technical skills required for the target role.

- Do not repeat the same point in both weaknesses and missingSkills.

Examples:
- If the role is ML Engineer and the resume lacks Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, Data Science, Statistics, or ML projects, the ATS score should generally not exceed 50.
- If the role is Frontend Developer and the resume lacks JavaScript, React, HTML, CSS, or frontend projects, the ATS score should generally not exceed 50.
- If the role is Backend Developer and the resume lacks APIs, Databases, Node.js, Java, Python, System Design, or backend projects, the ATS score should generally not exceed 50.

Requirements:
- strengths: role-relevant strengths.
- weaknesses: role-relevant weaknesses.
- suggestions: actionable improvements.
- keywords: important ATS keywords missing or present for the role.

Return ONLY JSON. No markdown. No explanation.

Resume:
${resumeText}
`,
  });

  return response.text;
};