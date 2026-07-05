import React, { useState, useEffect } from "react";
import { RoutineClass } from "../types";
import { Calendar, Plus, Trash2, Download, Trash, Check, CheckCircle } from "lucide-react";

export default function RoutineMaker() {
  const [classes, setClasses] = useState<RoutineClass[]>([]);
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [day, setDay] = useState<RoutineClass["day"]>("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState("bg-blue-50 border-blue-200 text-blue-700");

  const days: RoutineClass["day"][] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const colors = [
    { name: "Sleek Blue", value: "bg-blue-50 border-blue-200 text-blue-700" },
    { name: "Emerald Green", value: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { name: "Crimson Red", value: "bg-rose-50 border-rose-200 text-rose-700" },
    { name: "Amber Gold", value: "bg-amber-50 border-amber-200 text-amber-700" },
    { name: "Cyan Teal", value: "bg-cyan-50 border-cyan-200 text-cyan-700" }
  ];

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("apnabeu_routine_classes");
    if (saved) {
      try {
        setClasses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load routine classes", e);
      }
    } else {
      // Default classes for demo
      const demo: RoutineClass[] = [
        {
          id: "demo-c1",
          subject: "Data Structures",
          teacher: "Dr. K. Jha",
          room: "LT-102",
          day: "Monday",
          startTime: "09:30",
          endTime: "10:30",
          color: "bg-blue-50 border-blue-200 text-blue-700"
        },
        {
          id: "demo-c2",
          subject: "Object Oriented Programming",
          teacher: "Prof. S. Sinha",
          room: "LT-204",
          day: "Monday",
          startTime: "11:00",
          endTime: "12:00",
          color: "bg-emerald-50 border-emerald-200 text-emerald-700"
        },
        {
          id: "demo-c3",
          subject: "Analog Electronics",
          teacher: "Dr. Roy",
          room: "Lab-3",
          day: "Wednesday",
          startTime: "14:00",
          endTime: "16:00",
          color: "bg-rose-50 border-rose-200 text-rose-700"
        }
      ];
      setClasses(demo);
      localStorage.setItem("apnabeu_routine_classes", JSON.stringify(demo));
    }
  }, []);

  const saveToLocalStorage = (newList: RoutineClass[]) => {
    setClasses(newList);
    localStorage.setItem("apnabeu_routine_classes", JSON.stringify(newList));
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newClass: RoutineClass = {
      id: Date.now().toString(),
      subject: subject.trim(),
      teacher: teacher.trim() || undefined,
      room: room.trim() || undefined,
      day,
      startTime,
      endTime,
      color
    };

    const updated = [...classes, newClass].sort((a, b) => a.startTime.localeCompare(b.startTime));
    saveToLocalStorage(updated);

    // Reset inputs
    setSubject("");
    setTeacher("");
    setRoom("");
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    saveToLocalStorage(updated);
  };

  const clearRoutine = () => {
    if (window.confirm("Are you sure you want to clear your entire weekly schedule?")) {
      saveToLocalStorage([]);
    }
  };

  return (
    <div id="routine-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Weekly Routine Maker
          </h1>
          <p className="mt-1.5 text-slate-500 text-sm font-medium">
            Map out your semester lecture timings, labs, and revisions. Locally saved in your browser cache.
          </p>
        </div>
        <button
          onClick={clearRoutine}
          className="flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition focus:outline-none cursor-pointer"
        >
          <Trash className="w-3.5 h-3.5" /> Clear Routine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar inputs */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm self-start">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Session
          </h2>

          <form onSubmit={handleAddClass} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject / Class Name</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Graphics"
                className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor Name</label>
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="e.g., Prof. Verma"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Room / Lab No.</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g., Room 102"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Scheduled Day</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as RoutineClass["day"])}
                className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Theme Color Code</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-xl border-2 transition ${c.value} flex items-center justify-center shrink-0 cursor-pointer`}
                    title={c.name}
                  >
                    {color === c.value && <Check className="w-4 h-4 text-current" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-100/50 transition focus:outline-none mt-2 cursor-pointer"
            >
              Add to Weekly Grid
            </button>
          </form>
        </div>

        {/* Dynamic Display Grid */}
        <div className="lg:col-span-2 space-y-6">
          {days.map((d) => {
            const dayClasses = classes.filter((c) => c.day === d);
            return (
              <div key={d} className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
                <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4 uppercase tracking-wider text-xs">
                  {d}
                </h3>

                {dayClasses.length === 0 ? (
                  <p className="text-slate-400 text-xs italic font-medium">No academic classes scheduled.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dayClasses.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-2xl p-4 flex justify-between items-start transition hover:scale-[1.01] ${item.color}`}
                      >
                        <div>
                          <span className="block text-xs font-bold font-mono">
                            {item.startTime} - {item.endTime}
                          </span>
                          <h4 className="font-bold text-sm mt-1">{item.subject}</h4>
                          <div className="flex flex-wrap gap-2 text-[10px] font-semibold mt-2 text-current opacity-85">
                            {item.teacher && <span>Instructor: {item.teacher}</span>}
                            {item.room && <span>• Room: {item.room}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteClass(item.id)}
                          className="text-current opacity-40 hover:opacity-100 p-1 rounded-lg hover:bg-black/5 transition cursor-pointer"
                          title="Delete class"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
