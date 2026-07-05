import React from "react";
import { GraduationCap, Award, BookOpen, ShieldCheck, Heart, Sparkles, Users, Code, Github, Linkedin, Mail, Terminal, Cpu } from "lucide-react";

const abhinavAvatar = "/abhinav_avatar_1783240955691.jpg";

export default function AboutUs() {
  const milestones = [
    {
      icon: GraduationCap,
      title: "Student-First Mission",
      desc: "Our primary objective is to democratize education resources across Bihar Engineering University (BEU) affiliated colleges, ensuring high-quality resources are free and instantly accessible."
    },
    {
      icon: BookOpen,
      title: "Verified Study Material",
      desc: "We collaborate with topper students and academic representatives to collect, digitize, and categorize accurate chapter notes, syllabi, and solved previous year questions (PYQs)."
    },
    {
      icon: ShieldCheck,
      title: "Bypass Technical Hurdles",
      desc: "We understand that slow-loading official servers on result days or announcement hours can be frustrating. Our caching proxies ensure high uptime and instant rendering."
    }
  ];

  return (
    <div id="about-us-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10">
          <GraduationCap className="w-96 h-96" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-100 mb-6 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Learn Our Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            About <span className="text-blue-200">nexusBEU</span>
          </h1>
          <p className="text-lg text-blue-100 font-medium leading-relaxed">
            We are building the definitive academic companion hub for engineering students under Bihar Engineering University (BEU), Patna. Designed for speed, reliability, and distraction-free learning.
          </p>
        </div>
      </div>

      {/* Grid: Vision & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Our Vision & Journey
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            <p>
              Originally conceptualized as an independent student gateway, <strong>nexusBEU</strong> was born out of a real-world necessity. Undergraduates across Bihar frequently faced sluggish web interfaces, scattered Google Drive links for question papers, and outdated syllabus sheets.
            </p>
            <p>
              To solve this, we compiled a high-speed repository containing curated course material. We integrated interactive tools like a custom <strong>SGPA Calculator</strong> that mirrors the official BEU grading ordinance, and an <strong>Exam Routine Maker</strong> to organize study sessions seamlessly.
            </p>
            <p>
              Today, nexusBEU is one of the most reliable educational portals run by engineering students, for engineering students. We focus purely on speed, data clarity, and delivering a modern UX for college preparation.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Community Vouched
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
              nexusBEU serves thousands of engineering students from Mit Muzaffarpur, BCE Bhagalpur, MCE Motihari, GCE Gaya, and other prestigious colleges affiliated with Bihar Engineering University.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">100%</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Community-Driven and Free</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              We pledge to never host invasive popups, cookie trackers, or paywalls. Our code is streamlined strictly to aid your semester preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values / Milestones */}
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
        Our Key Pillars
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {milestones.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* About the Developer Section */}
      <div className="mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4 border border-blue-100/30 dark:border-blue-900/20">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            The Mind Behind the Code
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Meet the <span className="text-blue-600">Developer</span>
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            nexusBEU was designed, developed, and is maintained by a dedicated student developer committed to improving the academic ecosystem.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Developer Avatar */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-25 group-hover:opacity-40 transition duration-300 blur-sm"></div>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden shadow-sm">
                <img
                  src={abhinavAvatar}
                  alt="Abhinav Raj"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Developer Bio & Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Abhinav Raj
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    Lead Developer & 2nd Year Civil Engineering Student
                  </p>
                </div>
                {/* Social Connect Badge Links */}
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="LinkedIn Connect"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:abhiisingh137@gmail.com"
                    className="p-2 bg-slate-50 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                Abhinav Raj is a dedicated student of Civil Engineering, currently studying in his 2nd year at Saharsa College of Engineering, Saharsa (an esteemed engineering college affiliated with Bihar Engineering University). Driven by his passion for technology and structural design, Abhinav developed and curated nexusBEU to offer students instant access to previous year solved questions (PYQs), syllabus paths, notes, and academic routine trackers.
              </p>

              {/* Developer Skill Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Code className="w-3.5 h-3.5 text-blue-500" />
                  React & Vite
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  TypeScript
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  Tailwind CSS
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Firebase Cloud Sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heartfelt Footer Note */}
      <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-800 pt-10">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> by engineering students, for academic excellence.
        </p>
      </div>
    </div>
  );
}
