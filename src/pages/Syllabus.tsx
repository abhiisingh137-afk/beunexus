import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { SyllabusItem, BranchType, SemesterType } from "../types";
import { BookOpen, Search, Download, AlertCircle, RefreshCw, FileText } from "lucide-react";

export default function Syllabus() {
  const [syllabi, setSyllabi] = useState<SyllabusItem[]>([]);
  const [filteredSyllabi, setFilteredSyllabi] = useState<SyllabusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<BranchType | "ALL">("CSE");
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const branches: BranchType[] = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters: SemesterType[] = [1, 2, 3, 4, 5, 6, 7, 8];

  // Default syllabus sample list for students if DB is empty
  const defaultSyllabi: SyllabusItem[] = [
    {
      id: "syllabus-demo-1",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      description: "Fundamental concepts of data structure structures, optimization, algorithms analysis, and asymptotic notations.",
      modules: "Module 1: Introduction to Data Structures, Arrays, Stacks, Queues.\nModule 2: Linked Lists - Singly, Doubly, and Circular. Applications.\nModule 3: Trees - Binary Trees, Traversals, BST, AVL Trees, Heaps.\nModule 4: Graphs - Representations, BFS, DFS, MST, Shortest Paths.\nModule 5: Searching & Sorting - Bubble, Selection, Quick, Merge, Heap Sort, Hashing.",
      pdfUrl: "http://beu-bih.ac.in/Syllabus"
    },
    {
      id: "syllabus-demo-2",
      branch: "CSE",
      semester: 3,
      subject: "Object Oriented Programming (Java)",
      description: "Core java programming language constructs, object-oriented concepts, and multithreading basics.",
      modules: "Module 1: OOP principles - Classes, Objects, Abstraction, Encapsulation, Inheritance, Polymorphism.\nModule 2: Java fundamentals - Data types, control flow, arrays, string handling.\nModule 3: Packages & Interfaces, Exception Handling in Java.\nModule 4: Multithreading and Multitasking, Synchronisation.\nModule 5: I/O Streams, Collection Framework and basic file utilities.",
      pdfUrl: "http://beu-bih.ac.in/Syllabus"
    },
    {
      id: "syllabus-demo-3",
      branch: "ECE",
      semester: 3,
      subject: "Analog Electronics",
      description: "Operating models and design guidelines for semiconductor diodes, BJTs, FETs, and Operational Amplifiers.",
      modules: "Module 1: Diode circuits, rectifiers, clippers, clampers.\nModule 2: Bipolar Junction Transistor (BJT) DC biasing, small signal model.\nModule 3: Field Effect Transistors (FET) and MOSFETs characteristics.\nModule 4: Feedback Amplifiers and Oscillators circuits.\nModule 5: Operational Amplifiers (Op-Amps) and operational configurations.",
      pdfUrl: "http://beu-bih.ac.in/Syllabus"
    }
  ];

  const fetchSyllabi = async () => {
    setLoading(true);
    try {
      const q = collection(db, "syllabi");
      const querySnapshot = await getDocs(q);
      const items: SyllabusItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as SyllabusItem);
      });

      if (items.length === 0) {
        setSyllabi(defaultSyllabi);
      } else {
        setSyllabi(items);
      }
    } catch (error) {
      console.error("Error fetching syllabi: ", error);
      setSyllabi(defaultSyllabi);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  useEffect(() => {
    let result = syllabi;

    if (selectedBranch !== "ALL") {
      result = result.filter((s) => s.branch === selectedBranch);
    }
    if (selectedSemester !== "ALL") {
      result = result.filter((s) => s.semester === selectedSemester);
    }
    if (searchTerm.trim() !== "") {
      result = result.filter((s) =>
        s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.modules.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSyllabi(result);
  }, [selectedBranch, selectedSemester, searchTerm, syllabi]);

  return (
    <div id="syllabus-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Syllabus Directory
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Check and download syllabus for Bihar Engineering University branches and semesters.
          </p>
        </div>
        <button
          onClick={fetchSyllabi}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Syllabus
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
              Search Subjects
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject names, topics..."
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading syllabus documents...</p>
        </div>
      ) : filteredSyllabi.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Syllabus Found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto font-medium">
            We couldn't find any syllabus matching "{selectedBranch}" and Semester {selectedSemester}. Feel free to search other criteria or check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSyllabi.map((syllabus) => (
            <div
              key={syllabus.id}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-400 transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 uppercase">
                    {syllabus.branch} • Sem {syllabus.semester}
                  </span>
                  {syllabus.pdfUrl && (
                    <a
                      href={syllabus.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  {syllabus.subject}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                  {syllabus.description}
                </p>

                {/* Modules breakdown */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Course Modules / Chapters
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-200">
                    {syllabus.modules}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
