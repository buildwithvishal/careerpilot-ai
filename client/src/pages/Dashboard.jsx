import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [inputType, setInputType] = useState("text");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
    );

    const getScoreColor = (score) => {
    if (score < 40) return "#d33939";
    if (score < 70) return "#eab308";
    return "#21ae55"; 
    };

    const getScoreLabel = (score) => {
    if (score < 40) return "Needs Improvement";
    if (score < 70) return "Average";
    if (score < 85) return "Good";
    return "Excellent";
    };

    const getRoleFitColor = (fit) => {
    if (fit === "High") return "#22c55e";
    if (fit === "Medium") return "#eab308";
    return "#ef4444";
    };
  

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
    alert("Please paste your resume");
    return;
  }
    try {
      setLoading(true);

      const { data } = await API.post(
        "/auth/analyze-resume",
        {
            resumeText,
            targetRole,
        },
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );

      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePdf = async () => {
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const { data } = await API.get(
        "/auth/analysis-history",
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
      setHistory(data.history);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-3">
            <h1 className="text-5xl font-extrabold">
                CareerPilot AI
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-lg font-medium">
                  Hi, {user?.name}
                </span>

                <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                >
                Logout
                </button>
        </div>
        </div>

        <p className="text-center text-slate-400 mb-10">
          AI Powered Resume Analyzer & ATS Score Checker
        </p>

<div className="bg-slate-900 rounded-2xl p-6 shadow-xl">

    <p className="text-slate-400 mb-3">
        Choose Input Method
    </p>

    <div className="flex w-fit mb-5 bg-slate-800 rounded-xl p-1">
        <button
            onClick={() => setInputType("text")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                inputType === "text"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400"
            }`}
        >
            Paste Resume
        </button>

        <button
            onClick={() => setInputType("pdf")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                inputType === "pdf"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400"
            }`}
        >
            Upload PDF
        </button>
    </div>

    <div className="mb-5">
        <label className="block text-slate-300 mb-2 font-medium">
            Target Role
        </label>

        <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-80 bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
        >
            <option>Software Engineer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>Data Analyst</option>
            <option>ML Engineer</option>
        </select>
    </div>

    {inputType === "text" && (
        <textarea
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-72 bg-slate-800 rounded-xl p-4 text-white outline-none border border-slate-700"
        />
    )}

    {inputType === "pdf" && (
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
          )}

          <div className="flex gap-4 mt-6 flex-wrap">

            {inputType === "text" && (
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        loading
                        ? "bg-blue-600 opacity-60 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>
            )}

            {inputType === "pdf" && (
                <button
                    onClick={handleAnalyzePdf}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loading ? "Analyzing PDF..." : "Analyze PDF"}
                    </button>
            )}

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
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6">
                    ATS Score
                </h2>
                <p
                    className="mt-2 text-lg font-semibold"
                    style={{
                        color: getRoleFitColor(analysis.roleFit),
                    }}
                    >
                    Role Fit: {analysis.roleFit}
                </p>

                <div className="w-40 h-40">
                    <CircularProgressbar
                    value={analysis.atsScore}
                    text={`${analysis.atsScore}%`}
                    styles={buildStyles({
                        textColor: getScoreColor(analysis.atsScore),
                        pathColor: getScoreColor(analysis.atsScore),
                        trailColor: "#1e293b",
                    })}
                    />
                </div>

                <p
                className="mt-4 text-lg font-semibold"
                style={{
                    color: getScoreColor(analysis.atsScore),
                }}
                >
                {getScoreLabel(analysis.atsScore)}
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

            {analysis?.missingSkills?.length > 0 && (
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl mt-6">
                <h3 className="text-xl font-bold mb-4 text-white">
                Missing Skills
                </h3>

                <ul className="list-disc pl-6 space-y-2">
                {analysis.missingSkills.map((skill, index) => (
                    <li key={index} className="text-white leading-relaxed">
                    {skill}
                    </li>
                ))}
                </ul>
            </div>
            )}

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

export default Dashboard;