import { useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
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

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/auth/analysis-history");
      setHistory(data.history);
    } catch (error) {
      console.error(error);
    }
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
        style={{ marginTop: "20px", marginRight: "10px" }}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      <button
        onClick={fetchHistory}
        style={{ marginTop: "20px" }}
      >
        View History
      </button>

      {analysis && (
        <div className="result">
          <h2>AI Analysis</h2>
          <pre>{analysis}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div className="result">
          <h2>Previous Analyses</h2>

          {history.map((item, index) => (
            <div
              key={item._id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #444",
                borderRadius: "10px",
              }}
            >
              <h3>Analysis #{index + 1}</h3>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <pre>{item.analysis}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;