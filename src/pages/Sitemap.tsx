import React from "react";
import { Network, ArrowRight, ExternalLink, Globe, Compass } from "lucide-react";

export default function Sitemap({ setPage }: { setPage: (page: string) => void }) {
  const sections = [
    {
      title: "Academic Core Hubs",
      items: [
        { name: "Homepage Dashboard", id: "home", desc: "Main landing panel, Peer Reviews & Hub triggers" },
        { name: "Syllabus Directory", id: "syllabus", desc: "Detailed department syllabus modules" },
        { name: "Notes Repository", id: "notes", desc: "Subject notes compiled and vetted by toppers" },
        { name: "PYQs Catalog", id: "pyqs", desc: "Semester previous year question papers" },
        { name: "Video Lectures", id: "lectures", desc: "Curated YouTube playlists mapped to BEU courses" }
      ]
    },
    {
      title: "Interactive Student Tools",
      items: [
        { name: "SGPA Calculator", id: "sgpa", desc: "Custom calculator aligning with official relative grading rules" },
        { name: "Exam Routine Maker", id: "routine", desc: "Design and export personalized study schedules locally" },
        { name: "BEU Live Results Embed", id: "results", desc: "High-uptime, cached gateway for semester scorecard queries" },
        { name: "BEU Official Notices Proxy", id: "notices", desc: "Proxy board delivering announcements without server lags" }
      ]
    },
    {
      title: "Organizational & Legal Info",
      items: [
        { name: "About Us Story", id: "about", desc: "Learn about our student-first mission and coordinates" },
        { name: "Privacy & Consent Policy", id: "privacy", desc: "Strict data safety norms and localStorage descriptions" },
        { name: "Support & Help Desk", id: "contact", desc: "Contact our reps, submit papers, or report link bugs" },
        { name: "Administrator Console", id: "admin-login", desc: "Protected gateway for material upload permissions" }
      ]
    }
  ];

  return (
    <div id="sitemap-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4 border border-blue-100/30 dark:border-blue-900/20">
          <Network className="w-3.5 h-3.5 text-blue-500" />
          Interactive Site Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-fade-in">
          nexusBEU <span className="text-blue-600">Sitemap</span>
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
          Navigate quickly across any sub-section, database module, cached academic proxy, or tool in our digital university ecosystem.
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setPage(item.id)}
                    className="group w-full text-left focus:outline-none"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-150">
                          {item.name}
                        </span>
                        <p className="text-xs text-slate-400 mt-1 leading-normal font-medium">
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition duration-150 shrink-0 mt-0.5 ml-2" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Search Engine Optimization Link Card */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-blue-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Search Engine Crawl Feed</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-md">
              Are you an indexing crawler or search-bot looking for the official structure? Access the live XML file directly.
            </p>
          </div>
        </div>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition cursor-pointer shrink-0"
        >
          View Sitemap.xml <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
