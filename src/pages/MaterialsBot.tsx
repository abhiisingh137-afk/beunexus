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
  Save
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

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
  const [activeTab, setActiveTab] = useState<"directory" | "setup">("directory");
  const [materials, setMaterials] = useState<TelegramMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<TelegramMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("ALL");
  const [filterSemester, setFilterSemester] = useState<string>("ALL");

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

      {/* Navigation & Actions Row */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-none justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === "directory"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Materials Directory
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition cursor-pointer ${
              activeTab === "setup"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            Bot Setup & Admin
          </button>
        </div>
        <button
          onClick={fetchMaterials}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition focus:outline-none cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Directory
        </button>
      </div>

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
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">Webhook Online</span>
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

      {/* 2. SETUP & ADMIN VIEW */}
      {activeTab === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Settings configuration form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
              Configure Bot Credentials
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Connect your Telegram Bot and channel. The webhook is automatically bound, verified, and maintained by our servers. No manual action is required.
            </p>

            {configError && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-800 dark:text-rose-400 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{configError}</span>
              </div>
            )}

            {configSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{configSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Telegram Bot Token
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="e.g. 7183958195:AAHzg8-2f1K5H7qW3..."
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  Obtained from <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">@BotFather</a>. Ensure the token is copied exactly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Channel ID (or Private Group ID)
                </label>
                <div className="relative">
                  <Share2 className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="e.g. -100204918204"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  The numerical ID of your channel (must start with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold">-100</code>). Paste the ID you copied.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Admin Secret Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Enter admin secret code to authorize"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  Provide the admin secret code to configure the webhook pipeline.
                </p>
              </div>

              <button
                type="submit"
                disabled={configLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md disabled:opacity-50 transition cursor-pointer"
              >
                {configLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Bot Credentials
              </button>
            </form>

            {/* Current webhook info */}
            {botStatus && (
              <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
                  Webhook Environment Info
                </h4>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150/50 dark:border-slate-850/50 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Webhook Enabled:</span>
                    <span className={botStatus.webhookRegistered ? "text-emerald-500 font-bold" : "text-amber-500"}>
                      {botStatus.webhookRegistered ? "YES" : "NO"}
                    </span>
                  </div>
                  {botStatus.url && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-400">Target Webhook URI:</span>
                      <span className="text-slate-600 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        {botStatus.url}
                      </span>
                    </div>
                  )}
                  {botStatus.pendingUpdateCount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pending Updates Queue:</span>
                      <span>{botStatus.pendingUpdateCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick-start guidelines panel */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                Quick Bot Setup Guide
              </h3>
              
              <ol className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-350">
                <li className="flex gap-2.5">
                  <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full w-5 h-5 shrink-0 font-bold">1</span>
                  <span>Open <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-semibold hover:underline">@BotFather</a> in Telegram, send <code className="font-mono font-bold">/newbot</code>, choose a name and username, and copy the token.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full w-5 h-5 shrink-0 font-bold">2</span>
                  <span>Create a private Telegram Channel. Open the channel settings, go to Administrators, add your bot as an administrator with posting rights.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full w-5 h-5 shrink-0 font-bold">3</span>
                  <span>Obtain your Channel ID (you've copied this!). Paste both credentials into the form on the left, and click <strong>Save Bot Credentials</strong>. The webhook binds automatically.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full w-5 h-5 shrink-0 font-bold">4</span>
                  <span>To upload: direct students to open the Telegram Bot, upload their file (PDF/Image), and add a caption like: <br />
                  <code className="block bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono mt-1 text-[10px] break-all">
                    CSE 5th Sem - Compiler Design Formula notes by Rohan
                  </code>
                  The bot will process the files and list them immediately in our app!
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30">
              <h4 className="font-bold text-indigo-950 dark:text-indigo-300 text-xs uppercase tracking-wider mb-3">
                Supported Formats
              </h4>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                The bot handles PDF notes, study sheets (images), archives (ZIP/RAR), Word documents, and text files. All uploads are processed instantly and secured within your private Telegram Channel.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
