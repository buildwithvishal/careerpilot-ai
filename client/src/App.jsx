import { useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/auth/analyze-resume", {
        resumeText,
      });

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(error);

      setAnalysis(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  return (
    <div className="container">
      <h1>CareerPilot AI</h1>

      <textarea
        placeholder="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {resumeFile && (
          <p>
            Selected File: <strong>{resumeFile.name}</strong>
          </p>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <div className="result">
          <h2>AI Analysis</h2>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default App;