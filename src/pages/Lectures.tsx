import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { LectureItem, BranchType, SemesterType } from "../types";
import { Video, ChevronRight, Play, ArrowLeft, RefreshCw, Layers, Calendar, GraduationCap, AlertCircle } from "lucide-react";

export default function Lectures() {
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Staged State
  const [stage, setStage] = useState<"branch" | "semester" | "subject" | "chapter" | "lectures" | "watch">("branch");
  const [selectedBranch, setSelectedBranch] = useState<BranchType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeLecture, setActiveLecture] = useState<LectureItem | null>(null);

  const branches: BranchType[] = ["CSE", "ECE", "ME", "CE", "EE", "IT"];
  const semesters: SemesterType[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const defaultLectures: LectureItem[] = [
    {
      id: "lec-1",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      chapter: "Chapter 1: Introduction to DSA",
      title: "Complexity Analysis and Big-O Notation",
      videoId: "V39Z-VepnBY", // Real educational YouTube ID
      order: 1,
      description: "An introductory tutorial explaining Time Complexity, Space Complexity, and the difference between Best, Average, and Worst cases with practical code loops."
    },
    {
      id: "lec-2",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      chapter: "Chapter 1: Introduction to DSA",
      title: "Asymptotic Notation Solved Proofs",
      videoId: "V39Z-VepnBY",
      order: 2,
      description: "Meticulous proofs on Big O, Theta, and Omega bounds as per the Bihar Engineering University exam questions syllabus."
    },
    {
      id: "lec-3",
      branch: "CSE",
      semester: 3,
      subject: "Data Structures and Algorithms",
      chapter: "Chapter 2: Stacks and Queues",
      title: "Stack Implementation using Arrays and Pointers",
      videoId: "A3Zu0682Yg0",
      order: 1,
      description: "Learn how to implement stacks, pop, push, and peek functions using static arrays in C."
    },
    {
      id: "lec-4",
      branch: "CSE",
      semester: 3,
      subject: "Object Oriented Programming (Java)",
      chapter: "Chapter 1: Java OOP Classes",
      title: "Classes, Objects and Constructors in Java",
      videoId: "M2uOpxm3-60",
      order: 1,
      description: "Comprehensive class on Java variables, object instantions, parameterised vs non-parameterised constructors, and reference pointers."
    },
    {
      id: "lec-5",
      branch: "ECE",
      semester: 3,
      subject: "Analog Electronics",
      chapter: "Chapter 1: Semiconductors",
      title: "P-N Junction Diode Energy Bands",
      videoId: "7ukS2_23Teg",
      order: 1,
      description: "Detailed semiconductor physics video on depletion layers, forward and reverse bias saturation currents, and energy bands."
    }
  ];

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const q = collection(db, "lectures");
      const querySnapshot = await getDocs(q);
      const items: LectureItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as LectureItem);
      });

      if (items.length === 0) {
        setLectures(defaultLectures);
      } else {
        setLectures(items);
      }
    } catch (error) {
      console.error("Error fetching lectures: ", error);
      setLectures(defaultLectures);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Helpers to fetch filtered collections
  const getSubjects = () => {
    const list = lectures.filter((l) => l.branch === selectedBranch && l.semester === selectedSemester);
    return Array.from(new Set(list.map((l) => l.subject)));
  };

  const getChapters = () => {
    const list = lectures.filter(
      (l) => l.branch === selectedBranch && l.semester === selectedSemester && l.subject === selectedSubject
    );
    return Array.from(new Set(list.map((l) => l.chapter)));
  };

  const getChapterLectures = () => {
    return lectures
      .filter(
        (l) =>
          l.branch === selectedBranch &&
          l.semester === selectedSemester &&
          l.subject === selectedSubject &&
          l.chapter === selectedChapter
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getYoutubeEmbedUrl = (id: string) => {
    // Return standard embed link
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div id="lecture-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Curated Lectures
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Watch quality academic lectures, filtered branch, semester, subject, and chapter.
          </p>
        </div>
        <button
          onClick={fetchLectures}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Videos
        </button>
      </div>

      {/* Breadcrumb / Back Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <button
          onClick={() => {
            setStage("branch");
            setSelectedBranch(null);
            setSelectedSemester(null);
            setSelectedSubject(null);
            setSelectedChapter(null);
            setActiveLecture(null);
          }}
          className="hover:text-blue-600 transition cursor-pointer"
        >
          Home (Branch)
        </button>

        {selectedBranch && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => {
                setStage("semester");
                setSelectedSemester(null);
                setSelectedSubject(null);
                setSelectedChapter(null);
                setActiveLecture(null);
              }}
              className="hover:text-blue-600 transition uppercase cursor-pointer"
            >
              {selectedBranch}
            </button>
          </>
        )}

        {selectedSemester && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => {
                setStage("subject");
                setSelectedSubject(null);
                setSelectedChapter(null);
                setActiveLecture(null);
              }}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Sem {selectedSemester}
            </button>
          </>
        )}

        {selectedSubject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => {
                setStage("chapter");
                setSelectedChapter(null);
                setActiveLecture(null);
              }}
              className="hover:text-blue-600 transition truncate max-w-[120px] cursor-pointer"
            >
              {selectedSubject}
            </button>
          </>
        )}

        {selectedChapter && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={() => {
                setStage("lectures");
                setActiveLecture(null);
              }}
              className="hover:text-blue-600 transition truncate max-w-[120px] cursor-pointer"
            >
              {selectedChapter}
            </button>
          </>
        )}

        {activeLecture && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-blue-600 truncate max-w-[150px]">{activeLecture.title}</span>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading curriculum catalog...</p>
        </div>
      ) : (
        <div>
          {/* STAGE 1: BRANCH SELECTION */}
          {stage === "branch" && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6 font-sans">Step 1: Choose Your Engineering Branch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((b) => (
                  <div
                    key={b}
                    onClick={() => {
                      setSelectedBranch(b);
                      setStage("semester");
                    }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 p-6 flex items-center justify-between cursor-pointer group transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{b} Engineering</h3>
                        <p className="text-xs text-slate-500 font-medium">View semester-wise curated YouTube playlists</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 2: SEMESTER SELECTION */}
          {stage === "semester" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStage("branch")}
                  className="bg-white p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Step 2: Choose Your Semester ({selectedBranch})</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {semesters.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setSelectedSemester(s);
                      setStage("subject");
                    }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 p-6 text-center cursor-pointer group transition"
                  >
                    <span className="block text-2xl font-extrabold text-blue-600 group-hover:scale-110 transition duration-200">
                      Sem {s}
                    </span>
                    <span className="block text-xs text-slate-400 font-semibold mt-1">
                      Academic Term
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: SUBJECT SELECTION */}
          {stage === "subject" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStage("semester")}
                  className="bg-white p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Step 3: Choose Academic Course ({selectedBranch} • Sem {selectedSemester})</h2>
              </div>

              {getSubjects().length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">No Lecture Subjects Uploaded</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto font-medium">
                    The administrator has not curated subjects for {selectedBranch} Semester {selectedSemester} yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getSubjects().map((subject) => (
                    <div
                      key={subject}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setStage("chapter");
                      }}
                      className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 p-6 flex items-center justify-between cursor-pointer group transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{subject}</h3>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Chapters & Video Playlists</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STAGE 4: CHAPTER SELECTION */}
          {stage === "chapter" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStage("subject")}
                  className="bg-white p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Step 4: Select Syllabus Chapter ({selectedSubject})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getChapters().map((chapter) => (
                  <div
                    key={chapter}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setStage("lectures");
                    }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 p-6 flex items-center justify-between cursor-pointer group transition"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{chapter}</h3>
                      <span className="text-[10px] text-blue-600 font-bold mt-1 block">
                        Watch playlist lessons
                      </span>
                    </div>
                    <Play className="w-5 h-5 text-blue-500 fill-blue-100 group-hover:text-blue-600 transition shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: LECTURES LIST */}
          {stage === "lectures" && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStage("chapter")}
                  className="bg-white p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Step 5: Select Lecture Module ({selectedChapter})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getChapterLectures().map((lec) => (
                  <div
                    key={lec.id}
                    onClick={() => {
                      setActiveLecture(lec);
                      setStage("watch");
                    }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 p-6 cursor-pointer group transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-red-600 p-2.5 rounded-xl border border-red-100 shrink-0 group-hover:scale-105 transition">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                          Lesson {lec.order || 1}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug mt-1.5">{lec.title}</h3>
                        {lec.description && (
                          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 font-medium">{lec.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 6: WATCH LECTURE */}
          {stage === "watch" && activeLecture && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStage("lectures")}
                  className="bg-white p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Step 6: Watching Lecture</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Embedded Video Panel */}
                <div className="lg:col-span-2">
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-lg border border-slate-800">
                    <iframe
                      src={getYoutubeEmbedUrl(activeLecture.videoId)}
                      title={activeLecture.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-extrabold text-slate-900 font-sans">{activeLecture.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                        {activeLecture.branch} Engineering • Sem {activeLecture.semester}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {activeLecture.subject}
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mt-6">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Lecture Description
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {activeLecture.description || "No metadata description was provided for this lecture by the college administrators. Focus on topics listed in your course syllabi."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Playlist Sidebar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm self-start">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4">
                    Other lessons in chapter
                  </h3>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {getChapterLectures().map((lec) => {
                      const isActive = lec.id === activeLecture.id;
                      return (
                        <div
                          key={lec.id}
                          onClick={() => setActiveLecture(lec)}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition ${
                            isActive
                              ? "bg-blue-50/50 border border-blue-100"
                              : "hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-600">
                              Lesson {lec.order || 1}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                              {lec.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
