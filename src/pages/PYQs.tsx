import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { PYQItem, BranchType, SemesterType } from "../types";
import { GraduationCap, Search, Download, RefreshCw, AlertCircle, FileSpreadsheet, Calendar, Bot, User } from "lucide-react";

const isPYQFile = (fileName: string, caption: string) => {
  const text = `${fileName} ${caption}`.toLowerCase();
  return (
    text.includes("pyq") ||
    text.includes("paper") ||
    text.includes("question") ||
    text.includes("exam") ||
    text.includes("midsem") ||
    text.includes("endsem") ||
    text.includes("mid-sem") ||
    text.includes("end-sem") ||
    text.includes("sessional")
  );
};

const parseYearFromText = (text: string): number => {
  const match = text.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
};

const parseExamTypeFromText = (text: string): "End Sem" | "Mid Sem" | "Sessional" => {
  const clean = text.toLowerCase();
  if (clean.includes("mid")) return "Mid Sem";
  if (clean.includes("session")) return "Sessional";
  return "End Sem";
};

export default function PYQs() {
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [filteredPyqs, setFilteredPyqs] = useState<PYQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | "ALL">("CSE");
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const branches: BranchType[] = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters: SemesterType[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultPyqs: PYQItem[] = [
    {
      id: "pyq-demo-1",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      year: 2024,
      examType: "End Sem",
      fileUrl: "https://drive.google.com"
    },
    {
      id: "pyq-demo-2",
      branch: "CSE",
      semester: 3,
      subject: "Object Oriented Programming (Java)",
      year: 2024,
      examType: "End Sem",
      fileUrl: "https://drive.google.com"
    },
    {
      id: "pyq-demo-3",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      year: 2023,
      examType: "Mid Sem",
      fileUrl: "https://drive.google.com"
    },
    {
      id: "pyq-demo-4",
      branch: "ECE",
      semester: 3,
      subject: "Analog Electronics",
      year: 2024,
      examType: "End Sem",
      fileUrl: "https://drive.google.com"
    }
  ];

  const fetchPyqs = async () => {
    setLoading(true);
    try {
      // 1. Fetch official PYQs
      const pyqsCollectionRef = collection(db, "pyqs");
      const pyqsSnapshot = await getDocs(pyqsCollectionRef);
      const officialItems: PYQItem[] = [];
      pyqsSnapshot.forEach((doc) => {
        officialItems.push({ id: doc.id, ...doc.data() } as PYQItem);
      });

      // If official items are empty, use defaults as starter
      const basePyqs = officialItems.length === 0 ? defaultPyqs : officialItems;

      // 2. Fetch telegram bot materials
      let telegramItems: PYQItem[] = [];
      try {
        const tgCollectionRef = collection(db, "telegram_materials");
        const tgSnapshot = await getDocs(tgCollectionRef);
        tgSnapshot.forEach((doc) => {
          const data = doc.data();
          const fileName = data.fileName || "";
          const caption = data.caption || "";
          
          // Classify as PYQ if matches the keywords
          if (isPYQFile(fileName, caption)) {
            const parsedYear = parseYearFromText(`${fileName} ${caption}`);
            const parsedExamType = parseExamTypeFromText(`${fileName} ${caption}`);

            telegramItems.push({
              id: doc.id,
              branch: (data.branch || "CSE") as BranchType,
              semester: (data.semester || 3) as SemesterType,
              subject: data.subject || fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
              year: parsedYear,
              examType: parsedExamType,
              fileUrl: `/api/telegram/file/${data.fileId}`,
              uploader: data.uploaderName || "Student Contributor",
              telegramUsername: data.uploaderUsername || "",
              isTelegram: true,
              fileId: data.fileId,
              createdAt: data.createdAt
            } as any);
          }
        });
      } catch (err) {
        console.error("Error fetching telegram PYQs: ", err);
      }

      // Combine both lists
      setPyqs([...basePyqs, ...telegramItems]);
    } catch (error) {
      console.error("Error fetching PYQs: ", error);
      setPyqs(defaultPyqs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPyqs();
  }, []);

  useEffect(() => {
    let result = pyqs;

    if (selectedBranch !== "ALL") {
      result = result.filter((p) => p.branch === selectedBranch);
    }
    if (selectedSemester !== "ALL") {
      result = result.filter((p) => p.semester === selectedSemester);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.subject.toLowerCase().includes(term) ||
        p.year.toString().includes(term) ||
        p.examType.toLowerCase().includes(term)
      );
    }

    setFilteredPyqs(result);
  }, [selectedBranch, selectedSemester, searchTerm, pyqs]);

  return (
    <div id="pyqs-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Previous Year Questions (PYQs)
          </h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
            Review past test papers, mid-semester keys, and end-sem exams designed by BEU.
          </p>
        </div>
        <button
          onClick={fetchPyqs}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync PYQs
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Branch Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Branch
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBranch("ALL")}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedBranch === "ALL"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                ALL
              </button>
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    selectedBranch === b
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSemester(val === "ALL" ? "ALL" : (parseInt(val) as SemesterType));
              }}
              className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 focus:outline-none transition cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Search by Keyword or Year
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type e.g., 2024, DSA, Mid Sem..."
                className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading exam repository...</p>
        </div>
      ) : filteredPyqs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No PYQs Available</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            Our library is empty for {selectedBranch} Semester {selectedSemester}. Admin members will upload previous years questions shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPyqs.map((pyq: any) => (
            <div
              key={pyq.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl shadow-sm transition p-6 flex flex-col justify-between ${
                pyq.isTelegram
                  ? "border-indigo-150 dark:border-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-indigo-500/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-md uppercase ${
                    pyq.isTelegram
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  }`}>
                    {pyq.branch} • Sem {pyq.semester}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/30">
                    <Calendar className="w-3 h-3" />
                    {pyq.year}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl border shrink-0 ${
                    pyq.isTelegram
                      ? "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400"
                      : "bg-red-50 border-red-100 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400"
                  }`}>
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {pyq.subject}
                    </h3>
                    <span className={`block text-xs font-bold mt-1 uppercase tracking-wide flex items-center gap-1 ${
                      pyq.isTelegram ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400"
                    }`}>
                      {pyq.isTelegram && <Bot className="w-3 h-3" />}
                      {pyq.examType} Question Paper {pyq.isTelegram && "(BOT)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and Uploader info */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {pyq.isTelegram && (
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-4 text-[10px] font-semibold">
                    <User className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    <span>
                      By: <strong className="text-slate-600 dark:text-slate-300">{pyq.uploader}</strong>
                      {pyq.telegramUsername && (
                        <span className="text-indigo-500 font-extrabold ml-1.5">
                          (Telegram: @{pyq.telegramUsername})
                        </span>
                      )}
                    </span>
                  </div>
                )}
                <a
                  href={pyq.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition focus:outline-none cursor-pointer ${
                    pyq.isTelegram
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-50 hover:shadow-lg"
                      : "bg-slate-900 hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Paper
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
