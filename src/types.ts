export type BranchType = "CSE" | "ECE" | "ME" | "CE" | "EE" | "IT";

export type SemesterType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SyllabusItem {
  id?: string;
  branch: BranchType;
  semester: SemesterType;
  subject: string;
  description: string;
  modules: string; // Stored as a raw text with modules or structured text
  pdfUrl?: string;
  createdAt?: any;
}

export interface NoteItem {
  id?: string;
  branch: BranchType;
  semester: SemesterType;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  fileUrl: string;
  uploader?: string;
  createdAt?: any;
}

export interface PYQItem {
  id?: string;
  branch: BranchType;
  semester: SemesterType;
  subject: string;
  year: number;
  examType: "End Sem" | "Mid Sem" | "Sessional";
  fileUrl: string;
  createdAt?: any;
}

export interface LectureItem {
  id?: string;
  branch: BranchType;
  semester: SemesterType;
  subject: string;
  chapter: string;
  title: string;
  videoId: string; // YouTube Video ID
  order?: number;
  description?: string;
  createdAt?: any;
}

export interface NoticeItem {
  id?: string;
  title: string;
  content: string;
  date: string;
  link?: string;
  category?: string; // "Academic", "Exam", "Event", "General"
  createdAt?: any;
}

export interface RoutineClass {
  id: string;
  subject: string;
  teacher?: string;
  room?: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:00"
  color: string; // Tailwind class e.g. "bg-blue-100 border-blue-300"
}
