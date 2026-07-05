import React, { useState } from "react";
import { Calculator, Plus, Trash2, RotateCcw, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

interface SubjectRow {
  id: string;
  name: string;
  credits: number;
  gradePoints: number;
}

interface SemRow {
  id: string;
  semester: number;
  sgpa: number;
  credits: number;
}

export default function SGPACalculator() {
  // SGPA States
  const [sgpaRows, setSgpaRows] = useState<SubjectRow[]>([
    { id: "1", name: "Subject 1", credits: 4, gradePoints: 9 },
    { id: "2", name: "Subject 2", credits: 4, gradePoints: 8 },
    { id: "3", name: "Subject 3", credits: 3, gradePoints: 10 },
    { id: "4", name: "Subject 4", credits: 3, gradePoints: 7 },
    { id: "5", name: "Subject 5", credits: 2, gradePoints: 8 }
  ]);

  // CGPA States
  const [cgpaRows, setCgpaRows] = useState<SemRow[]>([
    { id: "1", semester: 1, sgpa: 8.2, credits: 20 },
    { id: "2", semester: 2, sgpa: 7.9, credits: 22 }
  ]);

  const grades = [
    { label: "O (Outstanding) [10]", points: 10 },
    { label: "E (Excellent) [9]", points: 9 },
    { label: "A (Very Good) [8]", points: 8 },
    { label: "B (Good) [7]", points: 7 },
    { label: "C (Average) [6]", points: 6 },
    { label: "D (Pass) [5]", points: 5 },
    { label: "F (Fail) [0]", points: 0 }
  ];

  // SGPA calculation
  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    sgpaRows.forEach((row) => {
      totalPoints += row.credits * row.gradePoints;
      totalCredits += row.credits;
    });
    return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2));
  };

  const addSgpaRow = () => {
    const id = Date.now().toString();
    setSgpaRows([...sgpaRows, { id, name: `Subject ${sgpaRows.length + 1}`, credits: 3, gradePoints: 8 }]);
  };

  const deleteSgpaRow = (id: string) => {
    setSgpaRows(sgpaRows.filter((r) => r.id !== id));
  };

  const updateSgpaRow = (id: string, field: keyof SubjectRow, value: any) => {
    setSgpaRows(
      sgpaRows.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const resetSGPA = () => {
    setSgpaRows([
      { id: "1", name: "Subject 1", credits: 4, gradePoints: 9 },
      { id: "2", name: "Subject 2", credits: 4, gradePoints: 8 }
    ]);
  };

  // CGPA calculation
  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    cgpaRows.forEach((row) => {
      totalPoints += row.sgpa * row.credits;
      totalCredits += row.credits;
    });
    return totalCredits === 0 ? 0 : parseFloat((totalPoints / totalCredits).toFixed(2));
  };

  const addCgpaRow = () => {
    const id = Date.now().toString();
    const nextSem = cgpaRows.length + 1;
    setCgpaRows([...cgpaRows, { id, semester: nextSem, sgpa: 8.0, credits: 20 }]);
  };

  const deleteCgpaRow = (id: string) => {
    setCgpaRows(cgpaRows.filter((r) => r.id !== id));
  };

  const updateCgpaRow = (id: string, field: keyof SemRow, value: any) => {
    setCgpaRows(
      cgpaRows.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const resetCGPA = () => {
    setCgpaRows([]);
  };

  const sgpaValue = calculateSGPA();
  const cgpaValue = calculateCGPA();

  const getPerformanceMessage = (val: number) => {
    if (val >= 9.0) return { text: "Outstanding Performance! O Grade Equivalent.", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (val >= 8.0) return { text: "Excellent Work! Maintain this consistency.", color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (val >= 7.0) return { text: "Very Good. Strong academic standing.", color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (val >= 6.0) return { text: "Good. Keep striving for higher grades.", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { text: "Average Standing. Focus on core subjects.", color: "text-slate-600 bg-slate-50 border-slate-100" };
  };

  return (
    <div id="calculator-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          SGPA & CGPA Grade Calculator
        </h1>
        <p className="mt-1.5 text-slate-500 text-sm font-medium">
          Quickly compute your Bihar Engineering University (BEU) semester indices and aggregate marks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SGPA Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Semester SGPA
            </h2>
            <button
              onClick={resetSGPA}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition focus:outline-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              <div className="col-span-5">Subject Title / Code</div>
              <div className="col-span-3">Credits</div>
              <div className="col-span-3">Grade obtained</div>
              <div className="col-span-1 text-center"></div>
            </div>

            {sgpaRows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateSgpaRow(row.id, "name", e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={row.credits}
                    onChange={(e) => updateSgpaRow(row.id, "credits", parseInt(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    {[1, 2, 3, 4, 5].map((c) => (
                      <option key={c} value={c}>
                        {c} Credits
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <select
                    value={row.gradePoints}
                    onChange={(e) => updateSgpaRow(row.id, "gradePoints", parseInt(e.target.value))}
                    className="w-full text-xs font-semibold px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    {grades.map((g) => (
                      <option key={g.points} value={g.points}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => deleteSgpaRow(row.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition focus:outline-none cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSgpaRow}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 mb-8 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Academic Course
          </button>

          {/* SGPA Score Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center relative">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Computed Semester SGPA
            </span>
            <div className="text-4xl font-extrabold text-blue-600 font-mono">
              {sgpaValue}
            </div>
            {sgpaValue > 0 && (
              <div className={`mt-4 text-xs font-semibold py-2 px-4 rounded-xl border inline-block ${getPerformanceMessage(sgpaValue).color}`}>
                {getPerformanceMessage(sgpaValue).text}
              </div>
            )}
          </div>
        </div>

        {/* CGPA Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Cumulative CGPA
            </h2>
            <button
              onClick={resetCGPA}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition focus:outline-none cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              <div className="col-span-5">Academic Semester</div>
              <div className="col-span-3">SGPA</div>
              <div className="col-span-3">Credits</div>
              <div className="col-span-1 text-center"></div>
            </div>

            {cgpaRows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5 text-xs font-bold text-slate-700">
                  Semester {row.semester}
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={row.sgpa}
                    onChange={(e) => updateCgpaRow(row.id, "sgpa", parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={row.credits}
                    onChange={(e) => updateCgpaRow(row.id, "credits", parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => deleteCgpaRow(row.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition focus:outline-none cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addCgpaRow}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-200 text-slate-500 hover:text-blue-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 mb-8 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Previous Semester
          </button>

          {/* CGPA Score Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center relative">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Cumulative CGPA Index
            </span>
            <div className="text-4xl font-extrabold text-blue-600 font-mono">
              {cgpaValue}
            </div>
            {cgpaValue > 0 && (
              <div className={`mt-4 text-xs font-semibold py-2 px-4 rounded-xl border inline-block ${getPerformanceMessage(cgpaValue).color}`}>
                {getPerformanceMessage(cgpaValue).text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
