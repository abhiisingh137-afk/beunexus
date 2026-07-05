import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { NoteItem, BranchType, SemesterType } from "../types";
import { FileText, Search, Download, RefreshCw, AlertCircle, Eye, User } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | "ALL">("CSE");
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const branches: BranchType[] = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters: SemesterType[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultNotes: NoteItem[] = [
    {
      id: "note-demo-1",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures & Algorithms",
      chapter: "Chapter 1: Arrays & Stacks",
      title: "Unit 1 Lecture Notes & Core Implementations",
      description: "Full detailed handwritten class notes on arrays representation, memory allocation, multi-dimensional addressing, stack operations and recursion algorithms.",
      fileUrl: "https://drive.google.com",
      uploader: "Prof. R. Sharma (BEU Board)"
    },
    {
      id: "note-demo-2",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures & Algorithms",
      chapter: "Chapter 3: Binary Search Trees",
      title: "BST, AVL, and Heap Trees Cheat Sheet",
      description: "Concise cheat-sheet outlining insertion, deletion and tree rotation guidelines for Balanced BSTs and Max/Min Heaps with complexity summaries.",
      fileUrl: "https://drive.google.com",
      uploader: "Technical Club BEU"
    },
    {
      id: "note-demo-3",
      branch: "ECE",
      semester: 3,
      subject: "Analog Electronics",
      chapter: "Chapter 2: BJT Amplifiers",
      title: "BJT AC Equivalent Model Analysis Notes",
      description: "Detailed solved proofs for small-signal r-parameter model and hybrid equivalent circuits of Common Emitter and Common Collector configurations.",
      fileUrl: "https://drive.google.com",
      uploader: "ECE Dept Board"
    }
  ];

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const q = collection(db, "notes");
      const querySnapshot = await getDocs(q);
      const items: NoteItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as NoteItem);
      });

      if (items.length === 0) {
        setNotes(defaultNotes);
      } else {
        setNotes(items);
      }
    } catch (error) {
      console.error("Error fetching notes: ", error);
      setNotes(defaultNotes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    let result = notes;

    if (selectedBranch !== "ALL") {
      result = result.filter((n) => n.branch === selectedBranch);
    }
    if (selectedSemester !== "ALL") {
      result = result.filter((n) => n.semester === selectedSemester);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((n) =>
        n.subject.toLowerCase().includes(term) ||
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.chapter.toLowerCase().includes(term)
      );
    }

    setFilteredNotes(result);
  }, [selectedBranch, selectedSemester, searchTerm, notes]);

  return (
    <div id="notes-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Notes Repository
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Download semester reference notes, study sheets, and quick chapter summaries.
          </p>
        </div>
        <button
          onClick={fetchNotes}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Notes
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
              Search Topics or Chapter
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject, title, chapter..."
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
          <p className="text-slate-500 text-sm font-medium">Loading study notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Study Notes Uploaded</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto font-medium">
            Our admin team and contributors are preparing the notes catalog for {selectedBranch} Semester {selectedSemester}. Please select another stream or search topics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-400 transition duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-blue-50 text-blue-700 rounded-md uppercase">
                    {note.branch} • Sem {note.semester}
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold truncate max-w-[150px]">
                    {note.subject}
                  </span>
                </div>

                {/* Main Content */}
                <span className="block text-xs font-bold text-blue-600 mb-1">
                  {note.chapter}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                  {note.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-6 font-medium">
                  {note.description}
                </p>
              </div>

              {/* Action and Uploader info */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 border-t border-slate-100 pt-4 mb-4 text-[10px] font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                  <span>By: {note.uploader || "Administrator"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-50 hover:shadow-lg transition focus:outline-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </a>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition focus:outline-none cursor-pointer"
                    title="Preview Document"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
