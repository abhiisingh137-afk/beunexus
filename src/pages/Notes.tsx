import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { NoteItem, BranchType, SemesterType } from "../types";
import { FileText, Search, Download, RefreshCw, AlertCircle, Eye, User, Bot } from "lucide-react";

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
      // 1. Fetch official notes
      const notesCollectionRef = collection(db, "notes");
      const notesSnapshot = await getDocs(notesCollectionRef);
      const officialItems: NoteItem[] = [];
      notesSnapshot.forEach((doc) => {
        officialItems.push({ id: doc.id, ...doc.data() } as NoteItem);
      });

      // If official notes are empty, use default ones as starter
      const baseNotes = officialItems.length === 0 ? defaultNotes : officialItems;

      // 2. Fetch telegram bot materials
      let telegramItems: NoteItem[] = [];
      try {
        const tgCollectionRef = collection(db, "telegram_materials");
        const tgSnapshot = await getDocs(tgCollectionRef);
        tgSnapshot.forEach((doc) => {
          const data = doc.data();
          const fileName = data.fileName || "";
          const caption = data.caption || "";
          
          // Classify as notes if it's NOT a PYQ file
          if (!isPYQFile(fileName, caption)) {
            telegramItems.push({
              id: doc.id,
              branch: (data.branch || "CSE") as BranchType,
              semester: (data.semester || 3) as SemesterType,
              subject: data.subject || "Peer Contributed Notes",
              chapter: "Telegram Bot Upload",
              title: fileName,
              description: caption || "No description provided.",
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
        console.error("Error fetching telegram materials: ", err);
      }

      // Combine both lists
      setNotes([...baseNotes, ...telegramItems]);
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
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
            Notes Repository
          </h1>
          <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
            Download semester reference notes, study sheets, and quick chapter summaries.
          </p>
        </div>
        <button
          onClick={fetchNotes}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Notes
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
              Search Topics or Chapter
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject, title, chapter..."
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
          <p className="text-slate-500 text-sm font-medium">Loading study notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Study Notes Uploaded</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            Our admin team and contributors are preparing the notes catalog for {selectedBranch} Semester {selectedSemester}. Please select another stream or search topics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note: any) => (
            <div
              key={note.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl shadow-sm transition duration-300 p-6 flex flex-col justify-between ${
                note.isTelegram
                  ? "border-indigo-150 dark:border-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-indigo-500/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-md uppercase ${
                    note.isTelegram
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  }`}>
                    {note.branch} • Sem {note.semester}
                  </span>
                  {note.isTelegram ? (
                    <span className="flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      <Bot className="w-3 h-3" /> BOT UPLOAD
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono font-bold truncate max-w-[150px]">
                      {note.subject}
                    </span>
                  )}
                </div>

                {/* Main Content */}
                <span className={`block text-xs font-bold mb-1 ${
                  note.isTelegram ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400"
                }`}>
                  {note.chapter}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2">
                  {note.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6 font-medium">
                  {note.description}
                </p>
              </div>

              {/* Action and Uploader info */}
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-805 pt-4 mb-4 text-[10px] font-semibold">
                  <User className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                  <span>
                    By: <strong className="text-slate-600 dark:text-slate-300">{note.uploader || "Administrator"}</strong>
                    {note.isTelegram && note.telegramUsername && (
                      <span className="text-indigo-500 font-extrabold ml-1.5">
                        (Telegram: @{note.telegramUsername})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition focus:outline-none cursor-pointer ${
                      note.isTelegram
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-50 hover:shadow-lg"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-50 hover:shadow-lg"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </a>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition focus:outline-none cursor-pointer"
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
