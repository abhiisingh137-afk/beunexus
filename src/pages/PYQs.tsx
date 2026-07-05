import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { PYQItem, BranchType, SemesterType } from "../types";
import { GraduationCap, Search, Download, RefreshCw, AlertCircle, FileSpreadsheet, Calendar } from "lucide-react";

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
      const q = collection(db, "pyqs");
      const querySnapshot = await getDocs(q);
      const items: PYQItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PYQItem);
      });

      if (items.length === 0) {
        setPyqs(defaultPyqs);
      } else {
        setPyqs(items);
      }
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Previous Year Questions (PYQs)
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Review past test papers, mid-semester keys, and end-sem exams designed by BEU.
          </p>
        </div>
        <button
          onClick={fetchPyqs}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync PYQs
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8">
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
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
              className="block w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition cursor-pointer"
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
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
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
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No PYQs Available</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto font-medium">
            Our library is empty for {selectedBranch} Semester {selectedSemester}. Admin members will upload previous years questions shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPyqs.map((pyq) => (
            <div
              key={pyq.id}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-400 transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-blue-50 text-blue-700 rounded-md uppercase">
                    {pyq.branch} • Sem {pyq.semester}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    <Calendar className="w-3 h-3" />
                    {pyq.year}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-50 text-red-600 p-2 rounded-xl border border-red-100/55 shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {pyq.subject}
                    </h3>
                    <span className="block text-xs text-blue-600 font-bold mt-1">
                      {pyq.examType} Question Paper
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={pyq.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition focus:outline-none cursor-pointer"
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
