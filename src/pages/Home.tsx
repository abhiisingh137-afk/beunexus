import React from "react";
import { BookOpen, FileText, GraduationCap, Video, Bell, Trophy, Calculator, Calendar, ArrowRight, Sparkles, Server, CheckCircle2, Search, Star, Quote, Shield, Zap, Users, ThumbsUp, Send, Award, Bot } from "lucide-react";

interface HomeProps {
  setPage: (page: string) => void;
}

export default function Home({ setPage }: HomeProps) {
  const cards = [
    {
      id: "syllabus",
      title: "Syllabus Directory",
      desc: "Instant access to syllabus outlines structured branch and semester wise.",
      icon: BookOpen,
      color: "from-blue-500 to-blue-700",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "notes",
      title: "Notes Vault",
      desc: "Exhaustive, chapter-wise reference notes contributed by top performers.",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "pyqs",
      title: "PYQs Library",
      desc: "Prepare efficiently with previous years exam papers (Mid & End Sem).",
      icon: GraduationCap,
      color: "from-blue-600 to-teal-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "gate",
      title: "GATE Preparation Hub",
      desc: "Crack your GATE exam with branch-wise core syllabus plans and 2018-2025 solved papers.",
      icon: Award,
      color: "from-blue-500 to-indigo-700",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      id: "bot-materials",
      title: "Telegram Upload Bot",
      desc: "Submit class notes and papers on Telegram and access them in our live web directory.",
      icon: Bot,
      color: "from-indigo-500 to-slate-900",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50/50"
    },
    {
      id: "lectures",
      title: "Curated Video Lectures",
      desc: "Structured branch-semester-subject YouTube tutorials and explanations.",
      icon: Video,
      color: "from-blue-600 to-red-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "notices",
      title: "Live notice Board",
      desc: "Official and real-time notices direct from Bihar Engineering University.",
      icon: Bell,
      color: "from-blue-500 to-orange-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "results",
      title: "University Results",
      desc: "Check your academic results responsively through the embedded exam portal.",
      icon: Trophy,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "sgpa",
      title: "SGPA & CGPA Calc",
      desc: "Calculate semester grade points instantly with personalized credits.",
      icon: Calculator,
      color: "from-blue-500 to-violet-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "routine",
      title: "Routine Builder",
      desc: "Create and customize your weekly class routine, schedules and save it locally.",
      icon: Calendar,
      color: "from-blue-500 to-violet-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div id="home-page" className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <div className="hidden lg:block relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 sm:py-24 transition-colors duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] opacity-8 dark:opacity-4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-6 border border-blue-100 dark:border-blue-900/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              Empowering Bihar Engineering Students
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans max-w-4xl mx-auto leading-tight sm:leading-none">
              The Ultimate Academic Companion for <span className="text-blue-600 bg-clip-text">BEU Students</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
              Check results, review official syllabi, download premium study notes, solve previous year papers, watch lectures, calculate SGPAs, and structure class schedules—all in one elegant dashboard.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setPage("syllabus")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-100/55 transition-all focus:outline-none cursor-pointer"
              >
                Explore Syllabus
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage("results")}
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition focus:outline-none cursor-pointer"
              >
                Check Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:py-16">
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            <span className="lg:hidden">Academic Tools</span>
            <span className="hidden lg:inline">Academic Portals & Utilities</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
            Select a hub below to jump directly into your required tools, curated lectures, or study assets.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`card-${card.id}`}
                onClick={() => setPage(card.id)}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 p-4 sm:p-6 flex flex-col justify-between cursor-pointer group transition duration-300"
              >
                <div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center ${card.bgColor} dark:bg-blue-950/40 ${card.textColor} dark:text-blue-400 mb-3 sm:mb-5 group-hover:scale-105 transition duration-200 shadow-sm`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-4 sm:mt-6 flex items-center text-xs font-semibold text-blue-600 gap-1 group-hover:gap-1.5 transition-all">
                  Open Hub <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights / About BEU Info */}
      <div className="bg-white dark:bg-slate-900 py-16 border-t border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4">
                Bihar Engineering University, Patna
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                Streamlining Academic Success Across Affiliated Colleges
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                Bihar Engineering University (BEU), Patna manages technical, pharmacy, and management education across the state. nexusBEU acts as an independent student gateway, allowing undergraduates and candidates to bypass slow loading portals and securely manage resources needed to excel in their academic semesters.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Organized YouTube Curations</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Video tutorials are meticulously arranged branch, semester, subject, and chapter-wise to eliminate video scrolling and distraction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Instant SGPA Calculators</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Built-in grade calculator tuned with BEU's relative credit system to fetch precise estimates of semester performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100/30 dark:from-slate-800/40 dark:to-slate-800/10 p-8 rounded-3xl border border-blue-100/40 dark:border-slate-800 relative shadow-sm">
              <h3 className="text-lg font-bold text-blue-950 dark:text-blue-400 mb-4">Quick University Overview</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-100/20 dark:border-slate-800">
                  <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-500">38+</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Affiliated Tech Colleges</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-100/20 dark:border-slate-800">
                  <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-500">8+</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Core B.Tech Streams</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-100/20 dark:border-slate-800">
                  <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-500">10k+</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Engineering Undergrads</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-blue-100/20 dark:border-slate-800">
                  <span className="block text-3xl font-extrabold text-blue-600 dark:text-blue-500">100%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Access Portal</span>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-blue-600/80 font-medium flex items-center justify-center gap-1">
                <Server className="w-3.5 h-3.5" /> Fast Cloud Storage via Google Firestore
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why to choose nexusBEU? Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4 border border-blue-100/30 dark:border-blue-900/20">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            Designed for Academic Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose <span className="text-blue-600">nexusBEU?</span>
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Standard university websites are often cluttered with advertisements, slow response times, and disorganized resource boards. We solved that by building a fast, dedicated academic ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">Zero Latency Sync</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We leverage cloud proxies and caching to render BEU notifications and results instantly, bypassing server downs or heavy-load timeouts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">100% Ad-Free & Safe</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We prioritize your focus. Our academic dashboard is clean, distraction-free, and contains absolutely no annoying popups or ad scripts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">Topper-Vouched Content</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Every chapter note, PDF sheet, and previous year solution (PYQ) is verified and vetted by high-scoring student representatives.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">Interactive Utility Suite</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Go beyond simple file downloads with our customized SGPA Calculator, Exam Routine Maker, and streamlined YouTube study lanes.
            </p>
          </div>
        </div>
      </div>

      {/* Student Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4 border border-blue-100/30 dark:border-blue-900/20">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
            Vouched by Your Peers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What Fellow Students Say
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Discover how undergrads across affiliated Bihar engineering colleges use nexusBEU to optimize their semester preparation and scorecard outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300">
            <div>
              <div className="flex gap-1 mb-4 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic font-medium">
                "Finding chapter-wise notes aligned with BEU's exact syllabus used to take hours. nexusBEU made it simple. The PYQs with proper subject categorization literally saved my 6th-semester exams!"
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/60 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 text-sm">
                AS
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Abhishek Sharma</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Computer Science &bull; MIT Muzaffarpur</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300">
            <div>
              <div className="flex gap-1 mb-4 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic font-medium">
                "The server-side proxy is amazing. Whenever the main BEU Patna results page goes slow due to heavy traffic on result day, this portal loads the embeds smoothly without breaking!"
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/60 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 text-sm">
                PK
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Priti Kumari</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Civil Engineering &bull; BCE Bhagalpur</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300">
            <div>
              <div className="flex gap-1 mb-4 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic font-medium">
                "Calculating exact semester SGPA used to be tedious because of different subject credits and the relative grading rules. The interactive SGPA calculator here solved it in 15 seconds."
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/60 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 text-sm">
                RS
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Rohan Singh</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Electrical Engineering &bull; MCE Motihari</p>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Send Resources via Telegram Section */}
      <div id="send-resources-telegram-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-500/10 border border-blue-400/20">
          {/* Subtle decorative background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-4 border border-white/15">
                <Send className="w-3.5 h-3.5 animate-pulse" />
                Contribute to the Community
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Have Study Materials? Send Resources to Us via Telegram!
              </h2>
              <p className="mt-4 text-blue-100 font-medium leading-relaxed">
                Help your juniors and classmates excel. Share your hand-written notes, exam papers, syllabus resources, or class materials. Send them directly to our active Telegram channel or bot, and we'll credit you on our platform!
              </p>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-blue-100 font-medium">
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Syllabus Matches
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Vetted PDFs Only
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Contributor Badge & Credit
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 shrink-0 w-full mt-8">
                <a
                  id="join-telegram-btn"
                  href="https://t.me/nexusBEU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-lg transition-all focus:outline-none cursor-pointer text-center text-sm"
                >
                  <Send className="w-4 h-4 fill-blue-600 text-blue-600" />
                  Join Telegram Channel
                </a>
                <a
                  id="send-telegram-bot-btn"
                  href="https://t.me/nexusbeubot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700/40 hover:bg-blue-700/60 text-white font-bold px-8 py-4 rounded-2xl border border-white/20 transition-all focus:outline-none cursor-pointer text-center text-sm"
                >
                  Send via Bot
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
