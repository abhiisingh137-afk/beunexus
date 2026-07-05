import React from "react";
import { Shield, EyeOff, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const policies = [
    {
      icon: EyeOff,
      title: "No Personal Data Tracking",
      desc: "nexusBEU does not track, collect, or store any personal credentials, IP addresses, or location data. You can access syllabi, notes, lectures, and notices anonymously."
    },
    {
      icon: Lock,
      title: "Local State Only",
      desc: "Any customizable configurations you create—such as custom class timetables in the Routine Maker or dark theme preferences—are saved locally in your browser's localStorage. No server databases sync this unless explicitly requested by administrators."
    },
    {
      icon: Shield,
      title: "University Portal Caching",
      desc: "Our server-side caching proxies fetch official notifications and result tables directly from Bihar Engineering University's servers (beu-bih.ac.in). We do not record your search queries or roll numbers."
    }
  ];

  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 mb-4 border border-blue-100/30 dark:border-blue-900/20">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          Student Privacy Matters
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Learn about our strict data privacy standards, transparency, and why nexusBEU is one of the safest academic portals for engineering undergraduates.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Last updated: July 05, 2026
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {policies.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Text Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            1. Consent and Scope
          </h2>
          <p>
            By utilizing the <strong>nexusBEU</strong> educational hub, you acknowledge and agree to the guidelines specified in this Privacy Policy. We exist solely to organize, cache, and streamline official academic resources for Bihar Engineering University students in Patna, India.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            2. Cookies and Third-Party Assets
          </h2>
          <p>
            We do not load third-party analytics scripts, marketing trackers, or advertisements that generate tracking cookies in your browser. Some embedded official pages or proxies may serve woff2 font files, style elements, or basic javascript libraries required by the original Bihar Engineering University website to render correctly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            3. Local Storage Guidelines
          </h2>
          <p>
            Our core dynamic tools—including dark mode preference toggling, custom routine maker schedules, and similar client preference variables—store simple string identifiers inside your browser’s <strong>localStorage</strong>. They are non-transferable, never synced with a remote database, and you can clear them entirely at any time by wiping your browser's site cache.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            4. External Hyperlinks Disclaimer
          </h2>
          <p>
            This website provides links to external official sites (such as <code>beu-bih.ac.in</code> for result verification and online exam form entry). Once you click these redirects, you are bound by their respective privacy terms. We do not exercise control over or assume responsibility for their independent data handling policies.
          </p>
        </section>

        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For questions regarding this privacy policy or to report digital discrepancies, you can connect directly through our official <strong>Contact Us</strong> page.
          </p>
        </section>
      </div>
    </div>
  );
}
