import React from "react";
import { GraduationCap, ArrowUpRight, Github, ExternalLink, Heart } from "lucide-react";

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Slogan */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-800 shadow-sm shrink-0">
                <img
                  src="https://i.ibb.co/SwwsnFM2/logo2.png"
                  alt="nexusBEU Logo"
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span>nexus<span className="text-blue-500">BEU</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              nexusBEU is a modern, student-centric digital hub designed exclusively for students of Bihar Engineering University (BEU), Patna. Get instant access to syllabi, custom notes, previous year papers, and curated YouTube video lectures.
            </p>
          </div>

          {/* Quick Academic Portals */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Portals</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setPage("syllabus")} className="hover:text-blue-400 transition text-left cursor-pointer">Syllabus Directory</button>
              </li>
              <li>
                <button onClick={() => setPage("notes")} className="hover:text-blue-400 transition text-left cursor-pointer">Notes Repository</button>
              </li>
              <li>
                <button onClick={() => setPage("pyqs")} className="hover:text-blue-400 transition text-left cursor-pointer">PYQs Catalog</button>
              </li>
              <li>
                <button onClick={() => setPage("lectures")} className="hover:text-blue-400 transition text-left cursor-pointer">Curated Lectures</button>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Support */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Legal & Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setPage("about")} className="hover:text-blue-400 transition text-left cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => setPage("privacy")} className="hover:text-blue-400 transition text-left cursor-pointer">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setPage("contact")} className="hover:text-blue-400 transition text-left cursor-pointer">Contact Us</button>
              </li>
              <li>
                <button onClick={() => setPage("sitemap")} className="hover:text-blue-400 transition text-left cursor-pointer font-semibold">Interactive Sitemap</button>
              </li>
            </ul>
          </div>

          {/* External Useful Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Official Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="http://beu-bih.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  BEU Patna Web <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://beu-bih.ac.in/BEU_Exam/Result/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  Results Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://beu-bih.ac.in/BEU_Exam/ExamForm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  Exam Forms <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => setPage("admin-login")} className="hover:text-amber-400 text-xs text-slate-500 block pt-2">Admin Dashboard Panel</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} nexusBEU. All rights reserved. Created for Bihar Engineering Students.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" /> for academic excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
