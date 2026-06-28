import { useState } from "react";
import API from "./api";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/auth/analyze-resume", {
        resumeText,
      });

      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePDFAnalyze = async () => {
    try {
      if (!resumeFile) {
        alert("Please select a PDF");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const { data } = await API.post(
        "/auth/analyze-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);

      setAnalysis(
        error.response?.data?.message ||
          "PDF analysis failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/auth/analysis-history");
      setHistory(data.history);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-extrabold text-center mb-3">
          CareerPilot AI 
        </h1>

        <p className="text-center text-slate-400 mb-10">
          AI Powered Resume Analyzer & ATS Score Checker
        </p>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
          <textarea
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-72 bg-slate-800 rounded-xl p-4 text-white outline-none border border-slate-700"
          />

            <div className="mt-5">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-medium transition">
              📄 Upload Resume PDF

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {resumeFile ? (
              <p className="mt-3 text-green-400 font-medium">
                ✅ {resumeFile.name}
              </p>
            ) : (
              <p className="mt-3 text-slate-400">
                No PDF selected
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-6 flex-wrap">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            <button
              onClick={handlePDFAnalyze}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Analyze PDF
            </button>

            <button
              onClick={fetchHistory}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              View History
            </button>
          </div>
        </div>

        
        {analysis && (
          <div className="mt-8 grid gap-6">

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-2">
                ATS Score
              </h2>

              <p className="text-6xl font-extrabold text-green-400">
                {analysis.atsScore}/100
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">
                Strengths
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                {analysis.strengths?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">
                Weaknesses
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                {analysis.weaknesses?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">
                Suggestions
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                {analysis.suggestions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-4">
                Missing Keywords
              </h2>

              <div className="flex flex-wrap gap-2">
                {analysis.keywords?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-purple-600 px-3 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {history.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6">
              Previous Analyses
            </h2>

            <div className="space-y-6">
              {history.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-slate-900 rounded-2xl p-5 shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Analysis #{index + 1}
                  </h3>

                  <p className="text-slate-400 mb-4">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  <p className="text-green-400 font-bold text-lg">
                    ATS Score: {item.analysis?.atsScore}/100
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

