import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Clock, 
  Sliders, 
  Tv,
  Info
} from "lucide-react";

export default function InteractiveVideoTutorial() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds, total 75s
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const duration = 75; // 75 seconds total runtime

  // Subtitles / Visual Guide instructions for step-by-step learning
  const subtitles = [
    {
      start: 0,
      end: 14,
      text: "📌 STEP 1: Connect with Bot. Click start or send '/start' to @nexusbeubot to load commands.",
    },
    {
      start: 15,
      end: 27,
      text: "📌 STEP 2: Send Materials (PDFs). Attach your PDF file. IMPORTANT: Name it cleanly (e.g. CompilerDesign_Notes.pdf) and write a descriptive caption.",
    },
    {
      start: 28,
      end: 32,
      text: "📌 STEP 3: Automated Indexing. The Bot detects branch (CSE/ECE/CE/ME) and semester keywords inside the caption to catalog the file.",
    },
    {
      start: 33,
      end: 44,
      text: "📌 STEP 4: Live Approval. Once parsed, your document goes live on nexusbeu.com under your contributor profile!",
    },
    {
      start: 45,
      end: 58,
      text: "📌 STEP 5: Add YouTube Lecture. Send the '/lecture' command. The bot responds with the template format to follow.",
    },
    {
      start: 59,
      end: 67,
      text: "📌 STEP 6: Map details with Pipes (|). Submit with schema: 'Branch | Sem | Subject | Chapter | Topic | YouTube URL'.",
    },
    {
      start: 68,
      end: 75,
      text: "📌 STEP 7: Instant Integration. Your lecture is synced and appears directly under the mapped video section on the web app!",
    }
  ];

  // Current subtitle based on currentTime
  const currentSubtitleObj = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Automatic scrolling down of messages as content is played
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedTime = Math.min(Math.max(0, Math.floor((clickX / width) * duration)), duration);
    setCurrentTime(clickedTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get current state of the animated Telegram app
  const getTelegramMessages = () => {
    const msgs: Array<{
      sender: "user" | "bot";
      type: "text" | "file" | "status" | "typing";
      content: string;
      fileName?: string;
      fileSize?: string;
      caption?: string;
      timestamp: string;
    }> = [];

    // Base conversation logic mapped strictly to seconds
    if (currentTime >= 2) {
      msgs.push({
        sender: "user",
        type: "text",
        content: "/start",
        timestamp: "02:55 PM"
      });
    }

    if (currentTime >= 5) {
      msgs.push({
        sender: "bot",
        type: "text",
        content: "👋 <b>Welcome to nexusBEU Bot!</b>\n\nI am your community-powered academic helper. Use me to upload study materials, notes, previous year question papers, or map useful video lectures directly onto our web portal.\n\n📚 <b>How to contribute:</b>\n• <b>For PDFs/Notes:</b> Just send any PDF and specify the Branch and Semester in its caption (e.g. <i>CSE 5th Sem - Compiler Design notes</i>).\n• <b>For YouTube Lectures:</b> Send /lecture to begin.",
        timestamp: "02:55 PM"
      });
    }

    // Notes & PYQs Upload Phase (15s to 45s)
    if (currentTime >= 18) {
      msgs.push({
        sender: "user",
        type: "file",
        content: "Document Upload",
        fileName: "CSE_5thSem_CompilerDesign_Notes_Neha.pdf",
        fileSize: "4.8 MB",
        caption: currentTime >= 23 ? "CSE | 5th Semester | Compiler Design | Unit 3 notes by Neha" : "Typing caption...",
        timestamp: "02:56 PM"
      });
    }

    if (currentTime >= 28 && currentTime < 33) {
      msgs.push({
        sender: "bot",
        type: "typing",
        content: "Bot is verifying syllabus matching & branch details...",
        timestamp: "02:56 PM"
      });
    }

    if (currentTime >= 33) {
      msgs.push({
        sender: "bot",
        type: "text",
        content: "✅ <b>Resource Validated & Approved!</b> 🚀\n\nThank you, <b>Neha</b>, for backing your peer network! Your document has been cataloged and published live.\n\n📝 <b>Metadata Processed:</b>\n• <b>File:</b> <code>CSE_5thSem_CompilerDesign_Notes_Neha.pdf</code>\n• <b>Branch:</b> Computer Science & Eng. (CSE)\n• <b>Semester:</b> 5th Semester\n• <b>Subject:</b> Compiler Design\n• <b>Status:</b> Live on study portal! 🌟",
        timestamp: "02:56 PM"
      });
    }

    // YouTube Lectures Upload Phase (45s to 75s)
    if (currentTime >= 48) {
      msgs.push({
        sender: "user",
        type: "text",
        content: "/lecture",
        timestamp: "02:57 PM"
      });
    }

    if (currentTime >= 52) {
      msgs.push({
        sender: "bot",
        type: "text",
        content: "📹 <b>Add Curated Video Lecture</b>\n\nPlease submit the video details strictly in this pipe-separated format to map it to our syllabus sections:\n\n<code>Branch | Semester | Subject | Chapter | Topic Name | YouTube URL</code>\n\n<b>Example entry:</b>\n<code>CSE | 3rd Sem | Data Structures | Chap 1 | Big O Notation | https://www.youtube.com/watch?v=hRcvD_rpxXg</code>",
        timestamp: "02:57 PM"
      });
    }

    if (currentTime >= 59) {
      msgs.push({
        sender: "user",
        type: "text",
        content: "CSE | 3rd Sem | Data Structures | Chap 1 | Big O Notation | https://www.youtube.com/watch?v=hRcvD_rpxXg",
        timestamp: "02:58 PM"
      });
    }

    if (currentTime >= 64 && currentTime < 68) {
      msgs.push({
        sender: "bot",
        type: "typing",
        content: "Mapping lecture URL to Data Structures syllabus tree...",
        timestamp: "02:58 PM"
      });
    }

    if (currentTime >= 68) {
      msgs.push({
        sender: "bot",
        type: "text",
        content: "🎉 <b>Video Lecture Mapped successfully!</b> 📹\n\nYour contribution is now synced and visible in the Video Tutorials section of nexusBEU.\n\n• <b>Topic:</b> Big O Notation (Chapter 1)\n• <b>Subject:</b> Data Structures\n• <b>Branch:</b> CSE (3rd Semester)\n\nThank you for making peer education effortless! 🚀",
        timestamp: "02:58 PM"
      });
    }

    return msgs;
  };

  const messages = getTelegramMessages();

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-white/10 shadow-2xl relative font-sans overflow-hidden max-w-[340px] mx-auto">
      
      {/* Mini Header Info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Tv className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-white font-bold text-xs flex items-center gap-1">
              9:16 Video Guide
              <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold uppercase">Live</span>
            </span>
          </div>
        </div>
        <span className="text-[9px] text-slate-400 font-medium">Silent Tutorial</span>
      </div>

      {/* 9:16 PORTRAIT SMARTPHONE VIDEO SCREEN */}
      <div className="relative mx-auto">
        <div className="w-full aspect-[9/16] bg-slate-950 rounded-[28px] border-[5px] border-slate-800 relative overflow-hidden shadow-2xl flex flex-col justify-between">
          
          {/* Smartphone Camera Notch Notch and Speaker design */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-800 rounded-b-xl z-30 flex items-center justify-center gap-1.5 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <span className="w-8 h-1 rounded-full bg-slate-900"></span>
          </div>

          {/* Cover Art Poster (visible before user clicks play) */}
          {currentTime === 0 && !isPlaying && (
            <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="/src/assets/images/telegram_bot_tutorial_1783504827198.jpg" 
                  alt="Tutorial Poster" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <button 
                  onClick={handlePlayPause}
                  className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/50 hover:scale-105 transition duration-300 mb-4 cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </button>
                <h4 className="text-sm font-extrabold text-white leading-snug px-2">
                  Play 9:16 Tutorial Video
                </h4>
                <p className="text-[10px] text-slate-400 mt-2 px-3 leading-relaxed">
                  Interactive simulation showing notes upload captioned formats & video maps.
                </p>
                <div className="mt-3 flex gap-2 text-[9px] text-indigo-300 font-bold bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/10">
                  <Clock className="w-3 h-3" /> {formatTime(duration)} mins
                </div>
              </div>
            </div>
          )}

          {/* TELEGRAM SIMULATOR HEADER */}
          <div className="bg-slate-900 border-b border-white/5 px-3 pt-5 pb-2 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs border border-indigo-400 shadow-sm">
                NB
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-extrabold text-white">nexusBEU Bot</span>
                  <CheckCircle2 className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                </div>
                <span className="text-[8px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span>
                  online
                </span>
              </div>
            </div>

            <div className="text-[8px] font-bold bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
              {currentTime < 15 ? "Ch1: Connect" : currentTime < 45 ? "Ch2: Notes" : "Ch3: YouTube"}
            </div>
          </div>

          {/* TELEGRAM CONVERSATION BODY (WITH AUTO-SCROLL TO BOTTOM) */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 space-y-3.5 flex flex-col justify-start relative scroll-smooth bg-slate-950"
          >
            <div className="max-w-md mx-auto text-center shrink-0">
              <span className="inline-block bg-slate-900/40 border border-white/5 text-[8px] text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Today, 02:55 PM
              </span>
            </div>

            <div className="space-y-3.5 pb-2">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-2 max-w-[92%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Profile Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 border ${msg.sender === "user" ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300"}`}>
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex flex-col min-w-0">
                    {/* Message Bubble - Increased contrast and font sizes */}
                    <div className={`rounded-xl p-3 shadow-md border text-[11px] leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none" 
                        : "bg-slate-800 border-slate-700 text-slate-100 rounded-tl-none"
                    }`}>
                      {msg.type === "typing" ? (
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <span className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                          </span>
                          <span className="text-indigo-200">{msg.content}</span>
                        </div>
                      ) : msg.type === "file" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 bg-slate-950/60 p-2 rounded-lg border border-white/10">
                            <div className="p-1.5 bg-red-500/20 rounded-md text-red-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-mono text-[9px] text-slate-100 truncate font-semibold">{msg.fileName}</p>
                              <span className="text-[8px] text-slate-400 font-bold block mt-0.5">{msg.fileSize}</span>
                            </div>
                          </div>
                          {msg.caption && (
                            <p className="mt-1.5 border-t border-white/10 pt-1.5 italic text-indigo-100 font-medium bg-indigo-550/20 p-2 rounded text-[10px]">
                              📝 Caption: "{msg.caption}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="break-words" dangerouslySetInnerHTML={{ __html: msg.content }} />
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <span className={`text-[7px] text-slate-500 font-bold mt-0.5 px-0.5 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VISUAL STEPS / SUBTITLES OVERLAY (Statically positioned, never hides chat) */}
          {currentSubtitleObj && (
            <div className="bg-indigo-950 border-t border-indigo-500/20 p-2 text-center backdrop-blur-md animate-fade-in shrink-0 relative z-20">
              <p className="text-[10px] text-indigo-200 font-bold leading-normal">
                {currentSubtitleObj.text}
              </p>
            </div>
          )}

          {/* TELEGRAM INPUT BAR */}
          <div className="bg-slate-900 border-t border-white/5 p-2 flex items-center gap-1.5 shrink-0 relative z-10">
            <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 bg-slate-950 rounded-lg px-2 py-1 border border-white/5 text-[9px] text-slate-500 flex items-center justify-between">
              <span>
                {currentTime >= 20 && currentTime < 23 ? "Typing..." : 
                 currentTime >= 54 && currentTime < 59 ? "Typing..." : 
                 "Message..."}
              </span>
            </div>
            <button className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-md">
              <Send className="w-3 h-3 fill-white" />
            </button>
          </div>

        </div>
      </div>

      {/* TIMELINE & PLAYER CONTROLS (Extremely Compact) */}
      <div className="mt-3 bg-slate-950 p-2 rounded-xl border border-white/5 space-y-2 relative z-10">
        
        {/* Progress Bar Timeline */}
        <div 
          onClick={handleProgressBarClick}
          className="relative h-1.5 bg-slate-900 rounded-full cursor-pointer group transition-all"
        >
          <div className="absolute inset-y-0 left-0 bg-white/5 rounded-full w-full"></div>
          
          <div 
            style={{ width: `${(currentTime / duration) * 100}%` }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
          ></div>
        </div>

        {/* Media Control actions */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-300">
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePlayPause}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition cursor-pointer flex items-center justify-center hover:scale-105"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white translate-x-0.2" />}
            </button>

            <button 
              onClick={handleRestart}
              className="p-1 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-full transition border border-white/5 cursor-pointer flex items-center justify-center"
              title="Restart"
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            <div className="font-mono text-[9px] text-slate-400">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span>/{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Speed controller */}
            <div className="flex items-center bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded-lg">
              <select 
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-transparent text-white border-none text-[9px] focus:outline-none font-bold font-mono cursor-pointer"
              >
                <option value="0.5" className="bg-slate-900 text-white">0.5x</option>
                <option value="1" className="bg-slate-900 text-white">1x</option>
                <option value="1.5" className="bg-slate-900 text-white">1.5x</option>
                <option value="2" className="bg-slate-900 text-white">2x</option>
              </select>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
