import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Settings, 
  Info, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  User, 
  Calendar, 
  FileText, 
  ArrowRight, 
  ExternalLink,
  Plus,
  Lock,
  Share2,
  ListFilter,
  Save,
  BookOpen,
  Check,
  XCircle,
  Video,
  FileCheck2,
  HelpCircle
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import InteractiveVideoTutorial from "../components/InteractiveVideoTutorial";

interface TelegramMaterial {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileId: string;
  caption: string;
  uploaderName: string;
  uploaderUsername?: string;
  channelPostId?: number;
  createdAt: string;
  branch?: string;
  semester?: number;
}

export default function MaterialsBot() {
  const [activeTab, setActiveTab] = useState<"directory" | "instructions" | "setup">("directory");
  const [materials, setMaterials] = useState<TelegramMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<TelegramMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("ALL");
  const [filterSemester, setFilterSemester] = useState<string>("ALL");

  // Naming helper interactive state
  const [namingBranch, setNamingBranch] = useState("CSE");
  const [namingSem, setNamingSem] = useState("5thSem");
  const [namingSubject, setNamingSubject] = useState("CompilerDesign");
  const [namingTopic, setNamingTopic] = useState("HandwrittenNotes");
  const [namingUploader, setNamingUploader] = useState("Neha");

  // Admin Config State
  const [botToken, setBotToken] = useState("8876998350:AAGIJk0Cb7pX5dPGqeqdyzhx1Qv2hy6pZSM");
  const [channelId, setChannelId] = useState("-1003994463295");
  const [secretCode, setSecretCode] = useState("");
  const [configLoading, setConfigLoading] = useState(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<any>(null);

  const branches = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const defaultMaterials: TelegramMaterial[] = [
    {
      id: "demo-material-1",
      fileName: "Compiler_Design_EndSem_CheatSheet.pdf",
      fileSize: 1048576,
      mimeType: "application/pdf",
      fileId: "demo-1",
      caption: "Compiler Design formula sheet and token recognition algorithms. Branch: CSE, Sem: 5",
      uploaderName: "Aman Verma",
      uploaderUsername: "aman_verma",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      branch: "CSE",
      semester: 5
    },
    {
      id: "demo-material-2",
      fileName: "Analog_Circuits_BJT_Biasing.pdf",
      fileSize: 2560000,
      mimeType: "application/pdf",
      fileId: "demo-2",
      caption: "Analog circuit load line analysis & Q-point determination. ECE 3rd Semester.",
      uploaderName: "Neha Kumari",
      uploaderUsername: "neha_ece",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      branch: "ECE",
      semester: 3
    }
  ];

  // Fetch submitted materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = collection(db, "telegram_materials");
      const snap = await getDocs(q);
      const list: TelegramMaterial[] = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as TelegramMaterial);
      });

      // Sort by createdAt descending
      const sorted = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (sorted.length === 0) {
        setMaterials(defaultMaterials);
      } else {
        setMaterials(sorted);
      }
    } catch (err) {
      console.error("Error fetching materials from Firestore: ", err);
      setMaterials(defaultMaterials);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing bot config
  const fetchBotConfig = async () => {
    try {
      const docRef = doc(db, "settings", "telegram");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.botToken) setBotToken(data.botToken);
        if (data.channelId) setChannelId(data.channelId);
      }
    } catch (err) {
      console.error("Error fetching bot settings: ", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchBotConfig();
    checkBotStatus();
  }, []);

  // Filter materials
  useEffect(() => {
    let result = materials;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.fileName.toLowerCase().includes(term) ||
          m.caption.toLowerCase().includes(term) ||
          m.uploaderName.toLowerCase().includes(term)
      );
    }

    if (filterBranch !== "ALL") {
      result = result.filter((m) => m.branch === filterBranch);
    }

    if (filterSemester !== "ALL") {
      result = result.filter((m) => m.semester === parseInt(filterSemester));
    }

    setFilteredNotesAndMaterials(result);
  }, [searchTerm, filterBranch, filterSemester, materials]);

  const [filteredNotesAndMaterials, setFilteredNotesAndMaterials] = useState<TelegramMaterial[]>([]);

  // Check Webhook & Bot Status from server
  const checkBotStatus = async () => {
    try {
      const res = await fetch("/api/telegram/status");
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
      }
    } catch (err) {
      console.error("Failed to query bot status: ", err);
    }
  };

  // Handle saving config & registering Webhook
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botToken.trim() || !channelId.trim()) {
      setConfigError("Bot Token and Channel ID are required.");
      return;
    }
    if (!secretCode.trim()) {
      setConfigError("Admin Secret Code is required to authorize webhook registration.");
      return;
    }

    setConfigLoading(true);
    setConfigError(null);
    setConfigSuccess(null);

    try {
      // Setup Webhook and save settings via server endpoint
      const res = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          botToken: botToken.trim(),
          channelId: channelId.trim(),
          secretCode: secretCode.trim()
        })
      });

      let data: any = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned HTTP ${res.status}`);
      }

      if (res.ok && data.success) {
        setConfigSuccess("Bot configured and Webhook successfully registered with Telegram!");
        checkBotStatus();
        setSecretCode(""); // Clear secret code input on success
      } else {
        setConfigError(data.error || "Failed to set up Telegram webhook connection.");
      }
    } catch (err: any) {
      console.error(err);
      setConfigError(err.message || "Network error occurred during configuration registration.");
    } finally {
      setConfigLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-8 sm:p-12 text-white mb-10 shadow-xl shadow-indigo-500/5">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-100 mb-6 border border-white/15">
            <Bot className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            Official Telegram Bot Pipeline
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
            Student Materials Bot Hub
          </h1>
          <p className="mt-4 text-base sm:text-lg text-indigo-100 font-sans leading-relaxed">
            Submit files directly inside Telegram to store, list, and download study resources. Our bot captures notes, maps them to branch modules, and logs them instantly.
          </p>
          <div className="mt-6">
            <a
              href="https://t.me/nexusbeubot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-55 text-indigo-700 font-bold px-6 py-3 rounded-2xl shadow-lg transition-all focus:outline-none cursor-pointer text-sm"
            >
              <Send className="w-4 h-4 fill-indigo-700 text-indigo-700" />
              Launch @nexusbeubot
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all focus:outline-none cursor-pointer whitespace-nowrap ${
            activeTab === "directory"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          Materials Directory
        </button>
        <button
          onClick={() => setActiveTab("instructions")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-bold transition-all focus:outline-none cursor-pointer whitespace-nowrap ${
            activeTab === "instructions"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Upload Instructions
        </button>
      </div>

      {/* Directory Header Row */}
      {activeTab === "directory" && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 pb-3 justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
            <FileText className="w-5 h-5" />
            Materials Directory
          </div>
          <button
            onClick={fetchMaterials}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition focus:outline-none cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync Directory
          </button>
        </div>
      )}

      {/* 1. DIRECTORY VIEW */}
      {activeTab === "directory" && (
        <div className="space-y-8">
          {/* Active Status Banner */}
          {botStatus?.webhookRegistered && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-3xl p-5 flex items-center justify-between flex-col md:flex-row gap-4">
              <div className="flex gap-3.5 items-center">
                <div className="bg-emerald-100 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-400 p-2.5 rounded-2xl">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                    Our Telegram Upload Bot is Live!
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-0.5 font-medium">
                    Send papers or documents directly to your Telegram Bot to upload them into the directory.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  {botStatus?.isPolling ? "Polling Online" : "Webhook Online"}
                </span>
              </div>
            </div>
          )}

          {/* Filters card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              
              {/* Search */}
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Search Materials
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by title, topic, or uploader..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Filter Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Filter Branch
                </label>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="ALL">All Branches</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Filter Semester */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Filter Semester
                </label>
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="ALL">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <div className="text-center py-16">
              <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold animate-pulse">Syncing materials database...</p>
            </div>
          ) : filteredNotesAndMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotesAndMaterials.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {item.branch && (
                          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                            {item.branch}
                          </span>
                        )}
                        {item.semester && (
                          <span className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-250 dark:border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold">
                            SEM {item.semester}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                        <Bot className="w-3 h-3" /> BOT
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-950 dark:text-white leading-snug mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.fileName}
                    </h4>

                    {item.caption && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 font-medium leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150/40 dark:border-slate-800/40">
                        {item.caption}
                      </p>
                    )}

                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        <span>Submitted by: <strong className="text-slate-600 dark:text-slate-300">{item.uploaderName}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        <span>Date: {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                        <span>Size: {formatBytes(item.fileSize)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a
                      href={`/api/telegram/file/${item.fileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow-indigo-500/10 transition duration-150"
                    >
                      <Download className="w-4 h-4" />
                      Download Material
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <Bot className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white">No materials uploaded yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 max-w-sm mx-auto font-medium">
                Be the first to submit a file! Send your files to our Telegram Bot <a href="https://t.me/nexusbeubot" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">@nexusbeubot</a> to list notes, syllabus or PYQs here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. INSTRUCTIONS VIEW */}
      {activeTab === "instructions" && (
        <div className="space-y-10 animate-fade-in font-sans">
          
          {/* Top Banner Message with Interactive Video Tutorial */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-indigo-50/50 dark:bg-slate-900/40 border border-indigo-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="lg:col-span-2 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-950/50 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
                <HelpCircle className="w-8 h-8 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Peer-to-Peer Academic Hub Guidelines</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                  nexusBEU runs on student contributions. When you submit resources, they are instantly cataloged and made downloadable on our portal. To maintain high directories quality, follow our simple contribution guidelines below.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-medium">
                  Watch the live interactive simulator on the right to see exactly how our Telegram Bot compiles, verifies, and publishes notes and video lectures in under 60 seconds!
                </p>
                <div className="mt-6">
                  <a
                    href="https://t.me/nexusbeubot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4 fill-white text-white" />
                    Launch @nexusbeubot
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <InteractiveVideoTutorial />
            </div>
          </div>

          {/* Stepper Grid (Steps to Upload) */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-500" />
              Core Upload Pathways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Notes & Books */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Pathway 1</div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Handwritten Notes & Books
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Share your handwritten notes, course modules, or official reference material PDFs.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">1.</span>
                      <span>Attach your document (PDF, ZIP) to `@nexusbeubot`.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">2.</span>
                      <span>Include <strong>Branch</strong>, <strong>Semester</strong>, and <strong>Subject</strong> in the Caption message.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">3.</span>
                      <span>Send! The bot files it automatically.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-105 dark:border-slate-850 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 rounded-lg">
                  💡 Example Caption: <br/>
                  <code className="text-[10px] text-slate-800 dark:text-slate-250">CSE 5th Sem - Compiler Design unit 3 notes by Neha</code>
                </div>
              </div>

              {/* Step 2: PYQs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Pathway 2</div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-indigo-500" />
                    Previous Year Papers
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Provide students with high-yield previous year question papers mapped to exam seasons.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">1.</span>
                      <span>Gather question scans and merge into a single PDF.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">2.</span>
                      <span>In the caption, state <strong>PYQ</strong>, <strong>Year</strong>, <strong>Branch</strong>, and <strong>Sem</strong>.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">3.</span>
                      <span>Upload to `@nexusbeubot` to publish instantly.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-105 dark:border-slate-850 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/10 p-2.5 rounded-lg">
                  💡 Example Caption: <br/>
                  <code className="text-[10px] text-slate-800 dark:text-slate-250">ECE 3rd Semester - Analog Circuits PYQ 2024 Exam</code>
                </div>
              </div>

              {/* Step 3: Video Lectures */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Pathway 3</div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-500" />
                    YouTube Lectures
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Submit high-quality YouTube lectures mapped to courses and chapters.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">1.</span>
                      <span>Copy a high-quality, academic YouTube video URL.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">2.</span>
                      <span>In the chat box, send the <code>/lecture</code> command.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500 font-bold">3.</span>
                      <span>Provide fields like Branch, Sem, Subject, Chapter, Title, URL.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-105 dark:border-slate-850 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/10 p-2.5 rounded-lg">
                  💡 Format Example: <br/>
                  <code className="text-[10px] text-slate-800 dark:text-slate-250 whitespace-pre-wrap">/lecture CSE | 3rd Sem | Data Structures | Chap 1 | Big O | youtube_link</code>
                </div>
              </div>

            </div>
          </div>

          {/* PDF Naming Rules & Interactive Rename Tool */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Guide Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  PDF File Naming Guidelines
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Standardized file names make materials searchable on web search engines and easily filterable on our website. Please rename your PDF files before uploading them via the Telegram Bot.
                </p>

                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Ideal File Format Formula:</span>
                  <div className="bg-slate-950 text-indigo-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 text-center leading-relaxed">
                    [Branch]_[Sem]_[Subject]_[Topic/Year]_[Uploader].pdf
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Correct Real-world Examples:</span>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono">CSE_5thSem_CompilerDesign_Notes_Neha.pdf</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono">ECE_3rdSem_AnalogCircuits_PYQ2024_Aman.pdf</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Naming tool */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-5"></div>
              
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-indigo-200 mb-4 border border-white/5">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Interactive Helper
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Instant PDF Name Generator</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Fill in the details below to instantly generate a clean file name. Copy, rename your PDF, and submit!
                </p>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-bold">Branch Code</label>
                      <input
                        type="text"
                        value={namingBranch}
                        onChange={(e) => setNamingBranch(e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase())}
                        placeholder="e.g. CSE"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-bold">Semester</label>
                      <input
                        type="text"
                        value={namingSem}
                        onChange={(e) => setNamingSem(e.target.value.replace(/\s+/g, ""))}
                        placeholder="e.g. 5thSem"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1.5 font-bold">Subject Name (CamelCase)</label>
                    <input
                      type="text"
                      value={namingSubject}
                      onChange={(e) => setNamingSubject(e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                      placeholder="e.g. CompilerDesign"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-bold">Topic / Type</label>
                      <input
                        type="text"
                        value={namingTopic}
                        onChange={(e) => setNamingTopic(e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                        placeholder="e.g. HandwrittenNotes"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1.5 font-bold">Your Name</label>
                      <input
                        type="text"
                        value={namingUploader}
                        onChange={(e) => setNamingUploader(e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                        placeholder="e.g. Neha"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 pt-5 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Your Ready-to-use Filename:</span>
                <div className="bg-slate-950 border border-indigo-500/20 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <span className="truncate selection:bg-indigo-500 selection:text-white">
                    {namingBranch || "BRANCH"}_{namingSem || "SEM"}_{namingSubject || "SUBJECT"}_{namingTopic || "TOPIC"}_{namingUploader || "NAME"}.pdf
                  </span>
                  <button
                    onClick={() => {
                      const text = `${namingBranch || "BRANCH"}_${namingSem || "SEM"}_${namingSubject || "SUBJECT"}_${namingTopic || "TOPIC"}_${namingUploader || "NAME"}.pdf`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition"
                  >
                    Copy Name
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* DOs & DONTs (Comparison Bento Grid) */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-indigo-500" />
              Do's & Don'ts (Wrong Methods vs Proper Methods)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* WRONG METHODS CARD (Left) */}
              <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-900/30 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400 mb-6 font-extrabold text-lg">
                  <XCircle className="w-6 h-6 shrink-0" />
                  Wrong Methods to Avoid
                </div>

                <div className="space-y-6">
                  
                  <div className="flex gap-3">
                    <span className="text-rose-500 font-extrabold text-sm shrink-0 mt-0.5">✕</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Uploading Documents with Blank Caption</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Uploading a PDF to the Telegram bot without a caption message. The system will fail to identify the branch or semester, leaving the file uncategorized.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-rose-500 font-extrabold text-sm shrink-0 mt-0.5">✕</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Ambiguous/Default File Names</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Leaving names like <code className="text-rose-600 dark:text-rose-400 font-mono text-[10px]">Doc12.pdf</code>, <code className="text-rose-600 dark:text-rose-400 font-mono text-[10px]">Untitled.pdf</code>, or <code className="text-rose-600 dark:text-rose-400 font-mono text-[10px]">CamScanner_07-08-2026.pdf</code>. This damages search engine optimization (SEO).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-rose-500 font-extrabold text-sm shrink-0 mt-0.5">✕</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Poorly Formatted YouTube Submissions</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Entering partial text like <code className="text-rose-600 dark:text-rose-400 font-mono text-[10px]">/lecture Data Structures</code> or missing pipe dividers. If fields are omitted, the video cannot be mapped.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-rose-500 font-extrabold text-sm shrink-0 mt-0.5">✕</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Low-quality Picture Spams</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Taking direct camera photos of copy pages with blurry focus, skewed angles, or shadows. These are impossible to read on smaller mobile screens.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT METHODS CARD (Right) */}
              <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 mb-6 font-extrabold text-lg">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  Proper Methods to Follow
                </div>

                <div className="space-y-6">
                  
                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-extrabold text-sm shrink-0 mt-0.5">✓</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Always Attach PDF and Include Tag Details</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Write a brief caption specifying the Course Code, Semester, and Subject. The parser reads these keywords and publishes them in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-extrabold text-sm shrink-0 mt-0.5">✓</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Follow standard CamelCase file names</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Rename file to <code className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">CSE_5thSem_CompilerDesign_Notes_Neha.pdf</code>. This lists clearly on student desks and supports Google searches.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-extrabold text-sm shrink-0 mt-0.5">✓</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Use standard multi-line or pipe /lecture commands</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Type the full structure when submitting videos. Let the bot guide you with standard prompts to make sure it matches your branch and sem.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-extrabold text-sm shrink-0 mt-0.5">✓</span>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-sm">Convert Images to Clear PDF Documents</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Use smartphone scanning apps (like Adobe Scan, Microsoft Lens, vFlat) to auto-crop, apply document filters (high contrast/black and white), and compile sheets into a single, clean PDF.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
