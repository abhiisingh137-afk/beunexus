import React, { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Info, 
  FileCheck, 
  TrendingUp, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Zap, 
  Settings, 
  Activity, 
  Layers, 
  Database,
  Terminal,
  HelpCircle
} from "lucide-react";

type BranchCode = "CS" | "EC" | "EE" | "ME" | "CE";

interface SyllabusSubject {
  name: string;
  topics: string[];
}

export default function Gate() {
  const [activeTab, setActiveTab] = useState<"about" | "syllabus" | "pyqs">("about");
  const [syllabusBranch, setSyllabusBranch] = useState<BranchCode>("CS");
  const [pyqBranch, setPyqBranch] = useState<BranchCode | "ALL">("ALL");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  // Toggle syllabus subjects
  const toggleSubject = (subjectName: string) => {
    setExpandedSubject((prev) => (prev === subjectName ? null : subjectName));
  };

  // Branch names map
  const branchNames: Record<BranchCode, string> = {
    CS: "Computer Science & IT (CS)",
    EC: "Electronics & Communication (EC)",
    EE: "Electrical Engineering (EE)",
    ME: "Mechanical Engineering (ME)",
    CE: "Civil Engineering (CE)"
  };

  // Detailed Syllabus Data
  const syllabusData: Record<BranchCode, SyllabusSubject[]> = {
    CS: [
      {
        name: "Engineering Mathematics",
        topics: [
          "Discrete Mathematics: Propositional and first order logic, Sets, relations, functions, partial orders and lattices. Monoids, Groups. Graphs: connectivity, matching, coloring. Combinatorics: generating functions, recurrence relations, summation, counting, generating functions.",
          "Linear Algebra: Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition.",
          "Calculus: Limits, continuity and differentiability. Maxima and minima. Mean value theorem. Integration.",
          "Probability and Statistics: Random variables. Uniform, normal, exponential, poisson and binomial distributions. Mean, median, mode and standard deviation. Conditional probability and Bayes theorem."
        ]
      },
      {
        name: "Digital Logic",
        topics: [
          "Boolean algebra. Combinational circuits: minimization, multiplexers, decoders, encoders.",
          "Sequential circuits: flip-flops, registers, counters.",
          "Number representations and computer arithmetic (fixed and floating point)."
        ]
      },
      {
        name: "Computer Organization and Architecture",
        topics: [
          "Machine instructions and addressing modes.",
          "ALU, data-path and control unit.",
          "Instruction pipelining, pipeline hazards.",
          "Memory hierarchy: cache, main memory and secondary storage.",
          "I/O interface (interrupt and DMA mode)."
        ]
      },
      {
        name: "Programming and Data Structures",
        topics: [
          "Programming in C.",
          "Recursion.",
          "Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs."
        ]
      },
      {
        name: "Algorithms",
        topics: [
          "Searching, sorting, hashing.",
          "Asymptotic worst case time and space complexity.",
          "Algorithm design techniques: greedy, dynamic programming and divide-and-conquer.",
          "Graph traversals, minimum spanning trees, shortest paths."
        ]
      },
      {
        name: "Theory of Computation",
        topics: [
          "Regular expressions and finite automata.",
          "Context-free grammars and push-down automata.",
          "Regular and context-free languages, pumping lemma.",
          "Turing machines and undecidability."
        ]
      },
      {
        name: "Compiler Design",
        topics: [
          "Lexical analysis, parsing, syntax-directed translation.",
          "Runtime environments.",
          "Intermediate code generation.",
          "Local optimization, data flow analyses: constant propagation, liveness analysis, common subexpression elimination."
        ]
      },
      {
        name: "Operating System",
        topics: [
          "System calls, processes, threads, CPU scheduling.",
          "Inter-process communication, concurrency and synchronization, semaphores, critical section, deadlocks.",
          "Memory management: paging, segmentation, virtual memory, page replacement algorithms.",
          "File systems, disk scheduling."
        ]
      },
      {
        name: "Databases",
        topics: [
          "ER-model. Relational model: relational algebra, tuple calculus.",
          "SQL query writing and integrity constraints.",
          "Database design: normal forms, functional dependencies.",
          "Transactions and concurrency control: serializability, locking protocols."
        ]
      },
      {
        name: "Computer Networks",
        topics: [
          "Concept of layering: OSI and TCP/IP Protocol Suites.",
          "Data link layer: framing, error detection, Medium Access Control (MAC) protocols, sliding window.",
          "Network layer: routing algorithms, congestion control, IPv4/IPv6 addressing, CIDR.",
          "Transport layer: TCP, UDP, flow control, socket congestion control.",
          "Application layer protocols: HTTP, DNS, SMTP, POP, FTP, DHCP."
        ]
      }
    ],
    EC: [
      {
        name: "Networks, Signals and Systems",
        topics: [
          "Circuit analysis: Node and mesh analysis, superposition, Thevenin and Norton's theorem, transient response of RLC networks.",
          "Signals & Systems: Continuous-time and discrete-time Fourier series, Laplace, Fourier and z-transforms. LTI systems: causality, stability, impulse response."
        ]
      },
      {
        name: "Electronic Devices",
        topics: [
          "Energy bands in intrinsic and extrinsic silicon.",
          "Carrier transport: diffusion current, drift current, mobility and resistivity.",
          "P-N junction diode, Zener diode, BJT, MOS capacitor, MOSFET, LED, photodiode and solar cell."
        ]
      },
      {
        name: "Analog Circuits",
        topics: [
          "Diode circuits: clipping, clamping and rectifiers.",
          "BJT and MOSFET amplifiers: biasing, small-signal equivalent circuits.",
          "Op-Amp circuits: amplifiers, integrators, differentiators, active filters, oscillators and feedback amplifiers."
        ]
      },
      {
        name: "Control Systems",
        topics: [
          "Basic control system components, feedback principle, transfer function.",
          "Transient and steady-state analysis of LTI systems.",
          "Frequency response, Routh-Hurwitz and Nyquist stability criteria, Bode and root-locus plots, State-variable analysis."
        ]
      },
      {
        name: "Communications",
        topics: [
          "Random processes: autocorrelation and power spectral density.",
          "Analog communications: amplitude modulation, angle modulation, transmitters and receivers.",
          "Digital communications: PCM, DPCM, digital modulation schemes (ASK, FSK, PSK, QAM), error control coding."
        ]
      },
      {
        name: "Electromagnetics",
        topics: [
          "Maxwell's equations: boundary conditions, wave equation, Poynting vector.",
          "Plane waves and properties: reflection and refraction, polarization, phase and group velocity.",
          "Transmission lines: impedance matching, S-parameters, Waveguides and Antennas."
        ]
      }
    ],
    EE: [
      {
        name: "Electric Circuits",
        topics: [
          "Network graph, KVL, KCL, node and mesh analysis.",
          "Transient response of dc and ac networks.",
          "Theorems: Thevenin's, Norton's, Superposition, Maximum Power Transfer.",
          "Two-port networks, three phase circuits, resonance."
        ]
      },
      {
        name: "Electrical Machines",
        topics: [
          "Single phase transformer: equivalent circuit, phasor diagram, open circuit and short circuit tests, efficiency and regulation.",
          "Three-phase transformers, auto-transformer.",
          "DC machines, Three-phase induction machines, Synchronous machines."
        ]
      },
      {
        name: "Power Systems",
        topics: [
          "Basic power generation concepts, transmission line models and performance.",
          "Insulators, cables, corona. Bus admittance matrix, load flow classification.",
          "Symmetrical and unsymmetrical faults, protection principles, power system stability."
        ]
      },
      {
        name: "Power Electronics",
        topics: [
          "Characteristics of semiconductor power devices: Diode, Thyristor, Triac, GTO, MOSFET, IGBT.",
          "Phase controlled rectifiers, Choppers, Inverters, AC voltage controllers."
        ]
      }
    ],
    ME: [
      {
        name: "Applied Mechanics and Design",
        topics: [
          "Engineering Mechanics: Free-body diagrams and equilibrium, trusses and frames, virtual work, impulse and momentum.",
          "Mechanics of Materials: Stress and strain, elastic constants, shear force and bending moment diagrams, torsion, deflection of beams.",
          "Theory of Machines: Displacement, velocity and acceleration analysis, gears and gear trains, flywheels, governors.",
          "Vibrations: Single degree of freedom systems, free and forced vibration, resonance, critical speeds of shafts.",
          "Machine Design: Design for static and dynamic loading, failure theories, joints, shafts, gears, brakes and clutches."
        ]
      },
      {
        name: "Fluid Mechanics and Thermal Sciences",
        topics: [
          "Fluid Mechanics: Fluid properties, fluid statics, manometry, buoyancy, Bernoulli's equation, viscous flow, boundary layer.",
          "Heat-Transfer: Modes of heat transfer, steady 1D conduction, resistance concept, fins, lumped parameter system, heat exchangers.",
          "Thermodynamics: Thermodynamic systems and processes, laws of thermodynamics, entropy, availability, behavior of ideal gases.",
          "Applications: Power Engineering, I.C. Engines, Refrigeration and Air-conditioning."
        ]
      },
      {
        name: "Materials, Manufacturing and Industrial Engineering",
        topics: [
          "Engineering Materials: Structure and properties of engineering materials, phase diagrams, heat treatment, stress-strain diagrams.",
          "Metal Casting: Types of patterns, moulds and cores, solidification, riser and gating design.",
          "Metal Forming, Joining, Machining and Machine Tool Operations.",
          "Metrology and Inspection: Limits, fits and tolerances, linear and angular measurements, interferometry.",
          "Computer Integrated Manufacturing, Production Planning and Control, Inventory Control, Operations Research."
        ]
      }
    ],
    CE: [
      {
        name: "Structural Engineering",
        topics: [
          "Engineering Mechanics: System of forces, free-body diagrams, equations of equilibrium.",
          "Solid Mechanics: Bending moment and shear force in statically determinate beams, simple theories of tension, shear, bending and torsion.",
          "Structural Analysis: Statically determinate and indeterminate structures, influence lines, matrix methods of structural analysis.",
          "Construction Materials and Management, Concrete Structures, Steel Structures."
        ]
      },
      {
        name: "Geotechnical Engineering",
        topics: [
          "Soil Mechanics: Three-phase system and phase relationships, index properties, unified soil classification, permeability, effective stress.",
          "Foundation Engineering: Sub-surface investigations, earth pressure theories, effect of water table, bearing capacity of shallow/deep foundations."
        ]
      },
      {
        name: "Water Resources Engineering",
        topics: [
          "Fluid Mechanics: Properties of fluids, fluid statics, continuity, momentum, energy, dimensional analysis.",
          "Hydrology: Hydrologic cycle, precipitation, evaporation, infiltration, unit hydrograph, flood estimation.",
          "Irrigation: Duty, delta, crop water requirements, design of lined and unlined canals, headworks."
        ]
      },
      {
        name: "Environmental Engineering",
        topics: [
          "Water Quality and Treatment, Wastewater Treatment, Air Pollution, Municipal Solid Wastes, Noise Pollution."
        ]
      },
      {
        name: "Transportation and Geomatics Engineering",
        topics: [
          "Transportation Engineering: Geometric design of highways, railway track alignment, airport runway design, highway materials and pavement design.",
          "Geomatics Engineering: Principles of surveying, errors and adjustments, maps, distance and angle measurements, photogrammetry."
        ]
      }
    ]
  };

  // Curated PYQ papers from 2018 to 2025
  const pyqPapers = [
    { year: 2025, branch: "CS", title: "GATE CS 2025 Question Paper with Answer Key", size: "2.8 MB", url: "https://gate2025.iitr.ac.in/" },
    { year: 2025, branch: "EC", title: "GATE EC 2025 Question Paper with Answer Key", size: "3.1 MB", url: "https://gate2025.iitr.ac.in/" },
    { year: 2025, branch: "EE", title: "GATE EE 2025 Question Paper with Answer Key", size: "2.9 MB", url: "https://gate2025.iitr.ac.in/" },
    { year: 2025, branch: "ME", title: "GATE ME 2025 Question Paper with Answer Key", size: "3.4 MB", url: "https://gate2025.iitr.ac.in/" },
    { year: 2025, branch: "CE", title: "GATE CE 2025 Question Paper with Answer Key", size: "3.5 MB", url: "https://gate2025.iitr.ac.in/" },
    
    { year: 2024, branch: "CS", title: "GATE CS 2024 Solved Question Paper", size: "2.4 MB", url: "https://gate2024.iisc.ac.in/" },
    { year: 2024, branch: "EC", title: "GATE EC 2024 Solved Question Paper", size: "2.6 MB", url: "https://gate2024.iisc.ac.in/" },
    { year: 2024, branch: "EE", title: "GATE EE 2024 Solved Question Paper", size: "2.5 MB", url: "https://gate2024.iisc.ac.in/" },
    { year: 2024, branch: "ME", title: "GATE ME 2024 Solved Question Paper", size: "3.1 MB", url: "https://gate2024.iisc.ac.in/" },
    { year: 2024, branch: "CE", title: "GATE CE 2024 Solved Question Paper", size: "3.0 MB", url: "https://gate2024.iisc.ac.in/" },
    
    { year: 2023, branch: "CS", title: "GATE CS 2023 Original Paper PDF", size: "1.9 MB", url: "https://gate.iitk.ac.in/" },
    { year: 2023, branch: "EC", title: "GATE EC 2023 Original Paper PDF", size: "2.1 MB", url: "https://gate.iitk.ac.in/" },
    { year: 2023, branch: "EE", title: "GATE EE 2023 Original Paper PDF", size: "2.0 MB", url: "https://gate.iitk.ac.in/" },
    { year: 2023, branch: "ME", title: "GATE ME 2023 Original Paper PDF", size: "2.8 MB", url: "https://gate.iitk.ac.in/" },
    { year: 2023, branch: "CE", title: "GATE CE 2023 Original Paper PDF", size: "2.9 MB", url: "https://gate.iitk.ac.in/" },

    { year: 2022, branch: "CS", title: "GATE CS 2022 Question & Solution Key", size: "2.2 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2022, branch: "EC", title: "GATE EC 2022 Question & Solution Key", size: "2.4 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2022, branch: "EE", title: "GATE EE 2022 Question & Solution Key", size: "2.3 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2022, branch: "ME", title: "GATE ME 2022 Question & Solution Key", size: "3.0 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2022, branch: "CE", title: "GATE CE 2022 Question & Solution Key", size: "3.1 MB", url: "https://gate.iitb.ac.in/" },

    { year: 2021, branch: "CS", title: "GATE CS 2021 Previous Year Paper", size: "2.1 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2021, branch: "ME", title: "GATE ME 2021 Previous Year Paper", size: "2.7 MB", url: "https://gate.iitb.ac.in/" },
    { year: 2020, branch: "CS", title: "GATE CS 2020 Exam Paper & Key", size: "1.8 MB", url: "https://gate.iitd.ac.in/" },
    { year: 2019, branch: "CS", title: "GATE CS 2019 Exam Paper & Key", size: "2.0 MB", url: "https://gate.iitm.ac.in/" },
    { year: 2018, branch: "CS", title: "GATE CS 2018 Official Paper", size: "1.7 MB", url: "https://gate.iitg.ac.in/" }
  ];

  const filteredPyqs = pyqPapers.filter((paper) => {
    return pyqBranch === "ALL" ? true : paper.branch === pyqBranch;
  });

  return (
    <div id="gate-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 p-8 sm:p-12 text-white mb-10 shadow-xl shadow-blue-500/5">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-blue-100 mb-6 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 fill-blue-300" />
            GATE Preparation Companion Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
            Graduate Aptitude Test in Engineering
          </h1>
          <p className="mt-4 text-base sm:text-lg text-blue-100 font-sans leading-relaxed">
            All-in-one resource page for BEU students preparing for the GATE Exam. Explore syllabus branches, download historical question papers, and decode test structures instantly.
          </p>
        </div>
      </div>

      {/* Main Tab Controller */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition cursor-pointer ${
            activeTab === "about"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Info className="w-4 h-4" />
          About GATE Exam
        </button>
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition cursor-pointer ${
            activeTab === "syllabus"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          GATE Syllabus
        </button>
        <button
          onClick={() => setActiveTab("pyqs")}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition cursor-pointer ${
            activeTab === "pyqs"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          GATE PYQs (2018-2025)
        </button>
      </div>

      {/* 1. ABOUT GATE VIEW */}
      {activeTab === "about" && (
        <div className="space-y-10 animate-fadeIn">
          {/* Main info blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">What is GATE?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The Graduate Aptitude Test in Engineering (GATE) is a national-level examination that tests the comprehensive understanding of various undergraduate subjects in engineering and science. It is conducted jointly by IISc and seven IITs on behalf of the National Coordination Board (NCB).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Career Benefits</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Qualifying GATE opens multiple doors: admission to premier Master of Technology (M.Tech) / Doctor of Philosophy (Ph.D.) courses in IITs, IISc, NITs, and IIITs with financial fellowships, along with prestigious jobs in Public Sector Undertakings (PSUs) like ONGC, IOCL, NTPC, GAIL, and BARC.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">Exam Eligibility</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                A student who is currently studying in the 3rd year or higher of any undergraduate degree program, or who has already completed any government-approved degree in Engineering, Technology, Architecture, Science, Commerce, or Arts is eligible to appear.
              </p>
            </div>
          </div>

          {/* Exam pattern guidelines */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              GATE Exam Pattern & Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Duration</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">3 Hours (180 mins)</span>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Questions</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">65 Questions</span>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Maximum Marks</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">100 Marks</span>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Question Types</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight block mt-1">MCQ, MSQ & Numerical Answer Type (NAT)</span>
              </div>
            </div>

            {/* Distribution chart */}
            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">Mark Distribution Criteria:</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Core Subject Syllabus (CSE, ECE, CE, etc.)</span>
                    <span className="text-blue-600">72% Weightage (72 Marks)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">General Aptitude (Verbal, Quantitative, Spatial, Analytical)</span>
                    <span className="text-emerald-600">15% Weightage (15 Marks)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Engineering Mathematics</span>
                    <span className="text-purple-600">13% Weightage (13 Marks)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "13%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Info block */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-6 sm:p-8 rounded-3xl">
            <h3 className="font-extrabold text-blue-950 dark:text-blue-300 text-lg mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Frequently Asked Prep Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <h4 className="font-bold text-blue-950 dark:text-blue-300">Is there any negative marking?</h4>
                <p className="text-blue-900/80 dark:text-blue-400/80 leading-relaxed font-medium">
                  Yes, for Multiple Choice Questions (MCQs), there is negative marking. For 1-mark MCQs, 1/3 mark is deducted for a wrong answer. For 2-mark MCQs, 2/3 mark is deducted. There is <strong>no negative marking</strong> for MSQ or NAT questions.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-blue-950 dark:text-blue-300">What is the validity of the GATE Scorecard?</h4>
                <p className="text-blue-900/80 dark:text-blue-400/80 leading-relaxed font-medium">
                  A qualified candidate's GATE Scorecard remains officially valid for <strong>three (3) years</strong> from the date of announcement of results.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GATE SYLLABUS VIEW */}
      {activeTab === "syllabus" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Branch Select Pill Tabs */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200 dark:border-slate-800 shrink-0">
            {(Object.keys(syllabusData) as BranchCode[]).map((branch) => (
              <button
                key={branch}
                onClick={() => {
                  setSyllabusBranch(branch);
                  setExpandedSubject(null);
                }}
                className={`flex-1 min-w-[90px] text-center px-4 py-2.5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                  syllabusBranch === branch
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {branch}
              </button>
            ))}
          </div>

          {/* Core Subject lists with expandable topics */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {branchNames[syllabusBranch]} Syllabus
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Click on any subject to explore the detailed topics list approved by the GATE organizing IIT.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-3.5 py-1.5 rounded-xl border border-blue-100/30 dark:border-blue-900/30 text-xs font-bold shrink-0 self-start sm:self-auto">
                {syllabusData[syllabusBranch].length} Core Subject Areas
              </div>
            </div>

            {/* Accordion list */}
            <div className="space-y-3.5">
              {syllabusData[syllabusBranch].map((subject, index) => {
                const isExpanded = expandedSubject === subject.name;
                return (
                  <div 
                    key={index} 
                    className={`border rounded-2xl transition duration-150 overflow-hidden ${
                      isExpanded 
                        ? "border-blue-500 bg-blue-50/10 dark:bg-slate-950/30 dark:border-blue-800" 
                        : "border-slate-150 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/30 dark:hover:bg-slate-850/40"
                    }`}
                  >
                    <button
                      onClick={() => toggleSubject(subject.name)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-lg w-7 h-7 font-bold text-xs">
                          {index + 1}
                        </span>
                        <span>{subject.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-850">
                        <ul className="space-y-2.5">
                          {subject.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. GATE PYQS VIEW */}
      {activeTab === "pyqs" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Filtering options */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Solved Previous Year Question Papers
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Download fully solved question papers to test your level of knowledge.
              </p>
            </div>

            {/* Branch select filter dropdown / list */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPyqBranch("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  pyqBranch === "ALL"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                All Papers
              </button>
              {(Object.keys(syllabusData) as BranchCode[]).map((branch) => (
                <button
                  key={branch}
                  onClick={() => setPyqBranch(branch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pyqBranch === branch
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid list */}
          {filteredPyqs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPyqs.map((paper, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                        {branchNames[paper.branch as BranchCode] || paper.branch}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {paper.year} Exam
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                      {paper.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                      <Layers className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" /> Size: {paper.size} &bull; PDF Download
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex gap-2">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition duration-150"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Solved Paper
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-400 text-sm font-medium">No previous year papers matching the selected filters found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
