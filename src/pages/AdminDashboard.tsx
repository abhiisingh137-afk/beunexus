import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { SyllabusItem, NoteItem, PYQItem, LectureItem, BranchType, SemesterType } from "../types";
import { LayoutDashboard, BookOpen, FileText, GraduationCap, Video, Plus, Trash2, RefreshCw, LogOut, CheckCircle, AlertCircle, Eye, Search, Layers, Edit3, Save, X, Bot } from "lucide-react";

interface TelegramMaterial {
  id?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileId: string;
  caption: string;
  uploaderName: string;
  uploaderUsername?: string;
  channelPostId?: number;
  createdAt: string;
  branch?: BranchType;
  semester?: SemesterType;
  subject?: string;
  secretCode?: string;
}

interface AdminDashboardProps {
  showToast: (text: string, type: "success" | "error" | "info" | "warning") => void;
  onLogout: () => void;
}

export default function AdminDashboard({ showToast, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "notes" | "pyqs" | "lectures" | "telegram">("syllabus");
  const [loading, setLoading] = useState(false);

  // Lists from Firestore
  const [syllabi, setSyllabi] = useState<SyllabusItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [telegramMaterials, setTelegramMaterials] = useState<TelegramMaterial[]>([]);

  // Telegram editing state
  const [editingMaterial, setEditingMaterial] = useState<TelegramMaterial | null>(null);
  const [editBranch, setEditBranch] = useState<BranchType>("CSE");
  const [editSemester, setEditSemester] = useState<SemesterType>(3);
  const [editSubject, setEditSubject] = useState("");
  const [editCaption, setEditCaption] = useState("");

  // Form Fields
  const branches: BranchType[] = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters: SemesterType[] = [1, 2, 3, 4, 5, 6, 7, 8];

  // Syllabus Form Fields
  const [sBranch, setSBranch] = useState<BranchType>("CSE");
  const [sSemester, setSSemester] = useState<SemesterType>(3);
  const [sSubject, setSSubject] = useState("");
  const [sDesc, setSDesc] = useState("");
  const [sModules, setSModules] = useState("");
  const [sPdfUrl, setSPdfUrl] = useState("");

  // Notes Form Fields
  const [nBranch, setNBranch] = useState<BranchType>("CSE");
  const [nSemester, setNSemester] = useState<SemesterType>(3);
  const [nSubject, setNSubject] = useState("");
  const [nChapter, setNChapter] = useState("");
  const [nTitle, setNTitle] = useState("");
  const [nDesc, setNDesc] = useState("");
  const [nFileUrl, setNFileUrl] = useState("");
  const [nUploader, setNUploader] = useState("");

  // PYQ Form Fields
  const [pBranch, setPBranch] = useState<BranchType>("CSE");
  const [pSemester, setPSemester] = useState<SemesterType>(3);
  const [pSubject, setPSubject] = useState("");
  const [pYear, setPYear] = useState(2025);
  const [pExamType, setPExamType] = useState<PYQItem["examType"]>("End Sem");
  const [pFileUrl, setPFileUrl] = useState("");

  // Lecture Form Fields
  const [lBranch, setLBranch] = useState<BranchType>("CSE");
  const [lSemester, setLSemester] = useState<SemesterType>(3);
  const [lSubject, setLSubject] = useState("");
  const [lChapter, setLChapter] = useState("");
  const [lTitle, setLTitle] = useState("");
  const [lVideoId, setLVideoId] = useState("");
  const [lOrder, setLOrder] = useState(1);
  const [lDesc, setLDesc] = useState("");

  const secretCode = "apnaBEU@admin2026"; // Code required by Firestore rules

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Syllabi
      const sSnap = await getDocs(collection(db, "syllabi"));
      const sList: SyllabusItem[] = [];
      sSnap.forEach((doc) => sList.push({ id: doc.id, ...doc.data() } as SyllabusItem));
      setSyllabi(sList);

      // Notes
      const nSnap = await getDocs(collection(db, "notes"));
      const nList: NoteItem[] = [];
      nSnap.forEach((doc) => nList.push({ id: doc.id, ...doc.data() } as NoteItem));
      setNotes(nList);

      // PYQs
      const pSnap = await getDocs(collection(db, "pyqs"));
      const pList: PYQItem[] = [];
      pSnap.forEach((doc) => pList.push({ id: doc.id, ...doc.data() } as PYQItem));
      setPyqs(pList);

      // Lectures
      const lSnap = await getDocs(collection(db, "lectures"));
      const lList: LectureItem[] = [];
      lSnap.forEach((doc) => lList.push({ id: doc.id, ...doc.data() } as LectureItem));
      setLectures(lList);

      // Telegram materials
      const tSnap = await getDocs(collection(db, "telegram_materials"));
      const tList: TelegramMaterial[] = [];
      tSnap.forEach((doc) => tList.push({ id: doc.id, ...doc.data() } as TelegramMaterial));
      // Sort by createdAt descending safely
      tList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setTelegramMaterials(tList);
    } catch (error) {
      console.error("Error loading administrative datasets: ", error);
      showToast("Fail-safe: Connecting to Firestore failed or is offline.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ADD SYLLABUS
  const handleAddSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sSubject || !sModules) return showToast("Subject and Modules are required fields.", "warning");

    try {
      const payload = {
        branch: sBranch,
        semester: sSemester,
        subject: sSubject.trim(),
        description: sDesc.trim(),
        modules: sModules.trim(),
        pdfUrl: sPdfUrl.trim() || undefined,
        secretCode,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "syllabi"), payload);
      showToast("Syllabus uploaded successfully!", "success");
      // Reset
      setSSubject("");
      setSDesc("");
      setSModules("");
      setSPdfUrl("");
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to upload syllabus. Verify write credentials.", "error");
    }
  };

  // ADD NOTES
  const handleAddNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nSubject || !nChapter || !nTitle || !nFileUrl) {
      return showToast("Subject, Chapter, Title, and Link are required.", "warning");
    }

    try {
      const payload = {
        branch: nBranch,
        semester: nSemester,
        subject: nSubject.trim(),
        chapter: nChapter.trim(),
        title: nTitle.trim(),
        description: nDesc.trim(),
        fileUrl: nFileUrl.trim(),
        uploader: nUploader.trim() || "Administrator",
        secretCode,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "notes"), payload);
      showToast("Study notes added to vault!", "success");
      setNSubject("");
      setNChapter("");
      setNTitle("");
      setNDesc("");
      setNFileUrl("");
      setNUploader("");
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to upload note to database.", "error");
    }
  };

  // ADD PYQ
  const handleAddPYQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pSubject || !pFileUrl) return showToast("Subject and paper file link are required.", "warning");

    try {
      const payload = {
        branch: pBranch,
        semester: pSemester,
        subject: pSubject.trim(),
        year: pYear,
        examType: pExamType,
        fileUrl: pFileUrl.trim(),
        secretCode,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "pyqs"), payload);
      showToast("Past exam paper uploaded successfully!", "success");
      setPSubject("");
      setPFileUrl("");
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to write paper file to database.", "error");
    }
  };

  // ADD LECTURE
  const handleAddLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lSubject || !lChapter || !lTitle || !lVideoId) {
      return showToast("Subject, Chapter, Lesson Title, and Video URL/ID are required.", "warning");
    }

    // Extract Video ID from YouTube link if a full URL is entered
    let videoId = lVideoId.trim();
    if (videoId.includes("youtube.com") || videoId.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoId.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }
    }

    try {
      const payload = {
        branch: lBranch,
        semester: lSemester,
        subject: lSubject.trim(),
        chapter: lChapter.trim(),
        title: lTitle.trim(),
        videoId,
        order: lOrder,
        description: lDesc.trim(),
        secretCode,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "lectures"), payload);
      showToast("Curated video lecture added to directory!", "success");
      setLSubject("");
      setLChapter("");
      setLTitle("");
      setLVideoId("");
      setLDesc("");
      setLOrder(1);
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to upload lecture metadata.", "error");
    }
  };

  // DELETE DOCUMENT
  const handleDeleteDoc = async (col: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this document from Firestore? This action is irreversible.")) return;

    try {
      // Due to rule configurations, we can just delete directly because our Firestore rule validates write privileges based on the existing resource or payload
      // In firestore.rules we have: allow delete: if isAdminWrite(resource.data);
      // resource.data has secretCode inside it since we added it on creation! This is extremely smart!
      await deleteDoc(doc(db, col, id));
      showToast("Record deleted from cloud server.", "success");
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Access Denied: Incompatible delete credentials.", "error");
    }
  };

  // DELETE TELEGRAM MATERIAL
  const handleDeleteTelegramMaterial = async (id: string, existingSecretCode?: string) => {
    if (!window.confirm("Are you sure you want to delete this student upload? This action is irreversible.")) return;

    try {
      const docRef = doc(db, "telegram_materials", id);
      // If there's no secretCode stored on the existing doc, we add it first so that the firestore.rules allow deletion
      if (existingSecretCode !== secretCode) {
        await updateDoc(docRef, {
          secretCode: secretCode
        });
      }
      await deleteDoc(docRef);
      showToast("Student upload removed from cloud.", "success");
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to remove student upload.", "error");
    }
  };

  // START EDITING TELEGRAM MATERIAL
  const handleStartEditTelegram = (mat: TelegramMaterial) => {
    setEditingMaterial(mat);
    setEditBranch(mat.branch || "CSE");
    setEditSemester(mat.semester || 3);
    setEditSubject(mat.subject || "");
    setEditCaption(mat.caption || "");
  };

  // UPDATE TELEGRAM MATERIAL
  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial || !editingMaterial.id) return;

    try {
      const docRef = doc(db, "telegram_materials", editingMaterial.id);
      await updateDoc(docRef, {
        branch: editBranch,
        semester: editSemester,
        subject: editSubject.trim(),
        caption: editCaption.trim(),
        secretCode: secretCode
      });
      showToast("Telegram material details updated successfully!", "success");
      setEditingMaterial(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast("Failed to update telegram material details.", "error");
    }
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Admin Workspace
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Configure course guides, manage PDFs, organize lectures, and monitor student academic streams.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchAllData}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Synchronize DB
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 border border-transparent hover:border-rose-100 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Terminate Session
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Syllabi</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{syllabi.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Uploaded Notes</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{notes.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Exam PYQs</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{pyqs.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Lectures Curated</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{lectures.length}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Student Uploads</span>
          <span className="text-2xl font-extrabold text-indigo-600 font-mono">{telegramMaterials.length}</span>
        </div>
      </div>

      {/* Tab controls */}
      <div className="border-b border-slate-200 mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-0.5 cursor-pointer ${
            activeTab === "syllabus"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-blue-600"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Manage Syllabus
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-0.5 cursor-pointer ${
            activeTab === "notes"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-blue-600"
          }`}
        >
          <FileText className="w-4 h-4" /> Manage Notes
        </button>
        <button
          onClick={() => setActiveTab("pyqs")}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-0.5 cursor-pointer ${
            activeTab === "pyqs"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-blue-600"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Manage PYQs
        </button>
        <button
          onClick={() => setActiveTab("lectures")}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-0.5 cursor-pointer ${
            activeTab === "lectures"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-blue-600"
          }`}
        >
          <Video className="w-4 h-4" /> Manage Lectures
        </button>
        <button
          onClick={() => setActiveTab("telegram")}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition border-b-2 -mb-0.5 cursor-pointer ${
            activeTab === "telegram"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-indigo-600"
          }`}
        >
          <Bot className="w-4 h-4" /> Student Uploads
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: ADD NEW FORM */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm self-start">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider font-sans">
            {activeTab === "telegram" ? (
              <>
                <Bot className="w-5 h-5 text-indigo-500" />
                Student Material Panel
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-blue-500" />
                Upload {activeTab}
              </>
            )}
          </h2>

          {/* SYLLABUS FORM */}
          {activeTab === "syllabus" && (
            <form onSubmit={handleAddSyllabus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Branch</label>
                <select
                  value={sBranch}
                  onChange={(e) => setSBranch(e.target.value as BranchType)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                >
                  {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                <select
                  value={sSemester}
                  onChange={(e) => setSSemester(parseInt(e.target.value) as SemesterType)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                >
                  {semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Organization & Architecture"
                  value={sSubject}
                  onChange={(e) => setSSubject(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Brief Description</label>
                <textarea
                  placeholder="Brief course objectives..."
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Modules (Structured Line-By-Line)</label>
                <textarea
                  required
                  placeholder="Module 1: Basic Structure of Computers...&#10;Module 2: Instruction Set Architecture..."
                  value={sModules}
                  onChange={(e) => setSModules(e.target.value)}
                  rows={4}
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Download PDF Link (Drive / Web)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={sPdfUrl}
                  onChange={(e) => setSPdfUrl(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Publish Syllabus
              </button>
            </form>
          )}

          {/* NOTES FORM */}
          {activeTab === "notes" && (
            <form onSubmit={handleAddNotes} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Branch & Semester</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={nBranch}
                    onChange={(e) => setNBranch(e.target.value as BranchType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select
                    value={nSemester}
                    onChange={(e) => setNSemester(parseInt(e.target.value) as SemesterType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {semesters.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Data Structures"
                  value={nSubject}
                  onChange={(e) => setNSubject(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Chapter / Unit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Chapter 3: Graph Traversals"
                  value={nChapter}
                  onChange={(e) => setNChapter(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solved MST and BFS/DFS guides"
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Brief Summary</label>
                <textarea
                  placeholder="Highlights of this PDF doc..."
                  value={nDesc}
                  onChange={(e) => setNDesc(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                ></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Document Download Link (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={nFileUrl}
                  onChange={(e) => setNFileUrl(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Uploader / Faculty Name</label>
                <input
                  type="text"
                  placeholder="e.g., Technical Club or Prof. Sharma"
                  value={nUploader}
                  onChange={(e) => setNUploader(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Add Notes Entry
              </button>
            </form>
          )}

          {/* PYQS FORM */}
          {activeTab === "pyqs" && (
            <form onSubmit={handleAddPYQ} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Branch & Semester</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={pBranch}
                    onChange={(e) => setPBranch(e.target.value as BranchType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select
                    value={pSemester}
                    onChange={(e) => setPSemester(parseInt(e.target.value) as SemesterType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {semesters.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Subject Course</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Operating Systems"
                  value={pSubject}
                  onChange={(e) => setPSubject(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Exam Year</label>
                  <input
                    type="number"
                    required
                    value={pYear}
                    onChange={(e) => setPYear(parseInt(e.target.value) || 2025)}
                    className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Exam Type</label>
                  <select
                    value={pExamType}
                    onChange={(e) => setPExamType(e.target.value as PYQItem["examType"])}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition cursor-pointer"
                  >
                    <option value="End Sem">End Sem</option>
                    <option value="Mid Sem">Mid Sem</option>
                    <option value="Sessional">Sessional</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Paper Link (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={pFileUrl}
                  onChange={(e) => setPFileUrl(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Upload PYQ Entry
              </button>
            </form>
          )}

          {/* LECTURES FORM */}
          {activeTab === "lectures" && (
            <form onSubmit={handleAddLecture} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Branch & Semester</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={lBranch}
                    onChange={(e) => setLBranch(e.target.value as BranchType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select
                    value={lSemester}
                    onChange={(e) => setLSemester(parseInt(e.target.value) as SemesterType)}
                    className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    {semesters.map((s) => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Subject Course</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Data Structures and Algorithms"
                  value={lSubject}
                  onChange={(e) => setLSubject(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Chapter 1: Introduction to DSA"
                  value={lChapter}
                  onChange={(e) => setLChapter(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Time Complexity analysis"
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">YouTube Link / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., V39Z-VepnBY"
                    value={lVideoId}
                    onChange={(e) => setLVideoId(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Order</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={lOrder}
                    onChange={(e) => setLOrder(parseInt(e.target.value) || 1)}
                    className="w-full text-xs font-semibold px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Detailed Description</label>
                <textarea
                  placeholder="Write topics covered..."
                  value={lDesc}
                  onChange={(e) => setLDesc(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Curate Lecture
              </button>
            </form>
          )}

          {activeTab === "telegram" && (
            <div>
              {editingMaterial ? (
                <form onSubmit={handleUpdateMaterial} className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-4 text-xs text-indigo-800">
                    <p className="font-bold mb-1">Editing Student Upload:</p>
                    <p className="font-mono truncate">{editingMaterial.fileName}</p>
                    <p className="mt-1">By: <strong>{editingMaterial.uploaderName}</strong> {editingMaterial.uploaderUsername && `@${editingMaterial.uploaderUsername}`}</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Branch</label>
                    <select
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value as BranchType)}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                    >
                      {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                    <select
                      value={editSemester}
                      onChange={(e) => setEditSemester(parseInt(e.target.value) as SemesterType)}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
                    >
                      {semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Subject mapping</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Operating Systems"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Caption / Description</label>
                    <textarea
                      required
                      placeholder="Brief summary or details..."
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      rows={3}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMaterial(null)}
                      className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Bot className="w-10 h-10 mx-auto text-slate-300 mb-2 animate-pulse" />
                  <p className="text-xs font-medium leading-relaxed">
                    Select any student upload from the list and click the <strong>Edit icon</strong> to re-classify its branch, semester, subject or description.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIST AND MANAGE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-between font-sans">
            <span>Database Records</span>
            {loading && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
          </h2>

          <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
            {activeTab === "syllabus" && syllabi.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                <div className="truncate">
                  <span className="inline-block text-[9px] font-bold tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase mr-2">
                    {s.branch} • Sem {s.semester}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1">{s.subject}</h4>
                  <p className="text-xs text-slate-500 truncate mt-1.5 font-medium">{s.description || "No description provided."}</p>
                </div>
                <button
                  onClick={() => handleDeleteDoc("syllabi", s.id!)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}

            {activeTab === "notes" && notes.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                <div className="truncate">
                  <span className="inline-block text-[9px] font-bold tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase mr-2">
                    {n.branch} • Sem {n.semester}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{n.subject}</span>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1">{n.title}</h4>
                  <p className="text-[10px] text-blue-600 font-bold truncate mt-1.5">{n.chapter}</p>
                </div>
                <button
                  onClick={() => handleDeleteDoc("notes", n.id!)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}

            {activeTab === "pyqs" && pyqs.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                <div className="truncate">
                  <span className="inline-block text-[9px] font-bold tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase mr-2">
                    {p.branch} • Sem {p.semester}
                  </span>
                  <span className="text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">{p.year}</span>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1">{p.subject}</h4>
                  <p className="text-xs text-blue-600 font-bold mt-1.5">{p.examType} Exam Paper</p>
                </div>
                <button
                  onClick={() => handleDeleteDoc("pyqs", p.id!)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}

            {activeTab === "lectures" && lectures.map((l) => (
              <div key={l.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                <div className="truncate">
                  <span className="inline-block text-[9px] font-bold tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase mr-2">
                    {l.branch} • Sem {l.semester}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold truncate">{l.subject}</span>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1">Lesson {l.order}: {l.title}</h4>
                  <p className="text-[10px] text-blue-600 font-bold truncate mt-1.5">{l.chapter}</p>
                </div>
                <button
                  onClick={() => handleDeleteDoc("lectures", l.id!)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}

            {activeTab === "telegram" && telegramMaterials.map((t) => (
              <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                <div className="truncate flex-grow">
                  <span className="inline-block text-[9px] font-bold tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase mr-2">
                    {t.branch || "Not Set"} • Sem {t.semester || "Not Set"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold truncate">
                    {t.subject || "Peer Contributed"}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm truncate mt-1" title={t.fileName}>{t.fileName}</h4>
                  <p className="text-[10px] text-slate-500 truncate mt-1">
                    Uploaded by: <span className="font-bold text-slate-700">{t.uploaderName}</span> {t.uploaderUsername ? `@${t.uploaderUsername}` : ""}
                  </p>
                  <p className="text-[10px] text-blue-600 font-medium truncate mt-1" title={t.caption}>
                    {t.caption || "No description provided."}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEditTelegram(t)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                    title="Edit/Re-classify Material"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTelegramMaterial(t.id!, t.secretCode)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Delete Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {((activeTab === "syllabus" && syllabi.length === 0) ||
              (activeTab === "notes" && notes.length === 0) ||
              (activeTab === "pyqs" && pyqs.length === 0) ||
              (activeTab === "lectures" && lectures.length === 0) ||
              (activeTab === "telegram" && telegramMaterials.length === 0)) && (
              <div className="text-center py-20 text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No records available for this collection in Firestore.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
