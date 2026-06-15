import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CKEditor } from "ckeditor4-react";
import { EditorModal } from "@/components/EditorModal";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ExamPaperView,
  type ExamHeader,
  type ExamPaper,
  type Question,
  type SubQuestion,
} from "@/components/ExamPaperView";
import { HHWView, type HHWHeader, type HHWPacket, type HHWTemplate } from "@/components/HHWView";
import {
  TimetableView,
  type TimetableHeader,
  type TimetableData,
  type TimetableTemplate,
  type TimetablePeriod,
  type TimetableCell,
} from "@/components/TimetableView";
import { exportExamDocx, exportExamPdf } from "@/lib/exam-export";
import { exportHHWDocx, exportHHWPdf } from "@/lib/hhw-export";
import { exportTimetableDocx, exportTimetablePdf } from "@/lib/timetable-export";
import { exportRawHtmlPdf, exportRawHtmlDocx } from "@/lib/raw-html-export";
import { generateExamOffline, generateHHWOffline } from "@/lib/offline-generator";
import {
  ResumeView,
  type JobResumeData,
  type MatrimonialBiodataData,
  type ResumeTemplate,
  type BiodataTemplate,
} from "@/components/ResumeView";
import { exportResumePdf, exportResumeDocx, exportBiodataDocx } from "@/lib/resume-export";
import { TemplateGallery } from "@/components/TemplateGallery";
import {
  CustomTemplateDesigner,
  DEFAULT_CUSTOM_CONFIG,
  type CustomTemplateConfig,
} from "@/components/CustomTemplateDesigner";
import {
  Loader2,
  Printer,
  FileText,
  Download,
  FileType,
  Upload,
  X,
  GraduationCap,
  Sparkles,
  CalendarClock,
  Plus,
  Trash2,
  KeyRound,
  Mail,
  LogOut,
  Paintbrush,
  Save,
  FolderOpen,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Exam Paper & Holiday Homework Generator" },
      {
        name: "description",
        content:
          "Generate properly formatted exam papers and beautiful holiday homework packets — including a premium VVIP school template — from any text or website.",
      },
    ],
  }),
});

const SUBJECT_PRESETS = [
  "English",
  "Hindi",
  "Maths",
  "Science",
  "EVS",
  "Social Studies",
  "Computer",
  "General Knowledge",
  "Sanskrit",
];

function AuthCard({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSignUp = false;
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.session) {
        // Store token in localStorage
        localStorage.setItem("auth_token", data.session.access_token);
        toast.success(
          isSignUp ? "Account created and signed in successfully!" : "Signed in successfully!",
        );
        onAuthSuccess(data.session.user);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl border border-border/50 bg-card/85 backdrop-blur-md">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <GraduationCap className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Enter your email below to register for Exam Formatter Pro"
            : "Sign in to access your dashboard and templates"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isSignUp ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Card>
  );
}

function Index() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/auth/session", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.session?.user ?? null);
          setAuthLoading(false);
        })
        .catch(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Shared header
  const [schoolName, setSchoolName] = useState("MERRY CITY SCHOOL & HOSTEL");
  const [schoolAddress, setSchoolAddress] = useState("NARAYANPUR NEAR BYPASS DAFI VARANASI");
  const [className, setClassName] = useState("VIII");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#1E2761");
  const [footer, setFooter] = useState("All the best!");

  // Exam-only
  const [examTitle, setExamTitle] = useState("UNIT TEST 1ST 2026 -2027");
  const [time, setTime] = useState("1:30 hrs.");
  const [subject, setSubject] = useState("English");
  const [maxMarks, setMaxMarks] = useState(25);
  const [examTemplate, setExamTemplate] = useState<"standard" | "board" | "custom">("standard");

  // HHW-only
  const [hhwTitle, setHhwTitle] = useState("SUMMER VACATION HOMEWORK");
  const [hhwSubjects, setHhwSubjects] = useState<string[]>([
    "English",
    "Hindi",
    "Maths",
    "EVS",
    "Computer",
  ]);
  const [hhwSubjectInput, setHhwSubjectInput] = useState("");
  const [hhwTemplate, setHhwTemplate] = useState<HHWTemplate>("standard");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  // Source
  const [sourceText, setSourceText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instructions, setInstructions] = useState("");

  const [mode, setMode] = useState<"exam" | "hhw" | "timetable" | "resume" | "admin" | "saved">("exam");
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [savedTemplatesLoading, setSavedTemplatesLoading] = useState(false);
  const [saveTemplateTitle, setSaveTemplateTitle] = useState("");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const fetchSavedTemplates = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    setSavedTemplatesLoading(true);
    try {
      const res = await fetch("/api/user/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedTemplates(data.templates || []);
    } catch {
      toast.error("Failed to load saved templates.");
    } finally {
      setSavedTemplatesLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!saveTemplateTitle) {
      toast.error("Please enter a name for your template.");
      return;
    }
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    setIsSavingTemplate(true);

    let content = "";
    if (mode === "exam") content = customHtmlMap["exam"];
    else if (mode === "hhw") content = customHtmlMap["hhw"];
    else if (mode === "timetable") content = customHtmlMap["timetable"];
    else if (mode === "resume") {
      content = resumeMode === "job" ? customHtmlMap["resume"] : customHtmlMap["biodata"];
    }

    try {
      const res = await fetch("/api/user/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: saveTemplateTitle, mode, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Template saved successfully!");
      setShowSaveDialog(false);
      setSaveTemplateTitle("");
      if (mode === "saved") fetchSavedTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to save template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`/api/user/templates?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Template deleted!");
        fetchSavedTemplates();
      } else {
        toast.error("Failed to delete template");
      }
    } catch {
      toast.error("Failed to delete template");
    }
  };

  const handleLoadTemplate = (template: any) => {
    const mapKey = template.mode === "resume" ? "resume" : template.mode;
    setCustomHtmlMap(prev => ({ ...prev, [mapKey]: template.content }));
    setMode(template.mode);
    if (template.mode === "exam") setExamTemplate("custom");
    if (template.mode === "hhw") setHhwTemplate("custom" as any);
    if (template.mode === "timetable") setTtTemplate("custom" as any);
    if (template.mode === "resume") setResumeTemplate("custom" as any);
    toast.success("Template loaded successfully! You can now continue editing.");
  };

  useEffect(() => {
    if (mode === "saved") fetchSavedTemplates();
  }, [mode]);

  const [logs, setLogs] = useState<any[]>([]);
  const [addedUsers, setAddedUsers] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState<string | null>(null);
  const [editUserPassword, setEditUserPassword] = useState("");

  const fetchAdminData = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    setAdminLoading(true);
    try {
      const logsRes = await fetch("/api/admin/manage?action=logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const logsData = await logsRes.json();
      setLogs(logsData.logs || []);

      const usersRes = await fetch("/api/admin/manage?action=users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      setAddedUsers(usersData.users || []);
    } catch {
      toast.error("Failed to load admin logs/users.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast.error("Please fill in email and password.");
      return;
    }
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Unauthorized. Please log in again.");
      return;
    }
    setAdminLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }
      toast.success("User added successfully!");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteUser = async (emailToDelete: string) => {
    if (!confirm(`Are you sure you want to delete ${emailToDelete}?`)) return;
    const token = localStorage.getItem("auth_token");
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/admin/manage?email=${encodeURIComponent(emailToDelete)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      toast.success("User deleted successfully!");
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleUpdateUser = async (emailToUpdate: string) => {
    if (!editUserPassword) {
      toast.error("Please enter a new password");
      return;
    }
    const token = localStorage.getItem("auth_token");
    setAdminLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: emailToUpdate, password: editUserPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      toast.success("User updated successfully!");
      setEditUserEmail(null);
      setEditUserPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "admin") {
      fetchAdminData();
    }
  }, [mode]);

  const [engine, setEngine] = useState<"ai" | "offline">("ai");
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [examHdr, setExamHdr] = useState<ExamHeader | null>(null);
  const [packet, setPacket] = useState<HHWPacket | null>(null);
  const [hhwHdr, setHhwHdr] = useState<HHWHeader | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Resume / Biodata State
  const [resumeMode, setResumeMode] = useState<"job" | "wedding">("job");
  const [resumeTemplate, setResumeTemplate] = useState<ResumeTemplate>("modern");
  const [biodataTemplate, setBiodataTemplate] = useState<BiodataTemplate>("traditional");

  const [resumeData, setResumeData] = useState<JobResumeData>({
    name: "John Doe",
    title: "Senior Full Stack Engineer",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    website: "github.com/johndoe",
    summary:
      "Experienced software engineer specializing in building premium React/TypeScript web applications and cloud architecture.",
    education: [
      {
        school: "Stanford University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startYear: "2018",
        endYear: "2022",
        grade: "GPA 3.9",
      },
    ],
    experience: [
      {
        company: "TechCorp Inc.",
        role: "Senior Engineer",
        location: "San Francisco, CA",
        startYear: "2022",
        endYear: "Present",
        description:
          "Lead development of core analytics platform. Optimized web app performance by 40%.",
      },
    ],
    projects: [
      {
        title: "Exam Formatter Pro",
        description: "Offline-capable exam paper and holiday homework generator with AI assist.",
        link: "exam-formatter.pro",
      },
    ],
    skills: ["React", "TypeScript", "Node.js", "Vite", "Tailwind CSS", "AWS"],
    languages: ["English", "Spanish"],
  });

  const [biodataData, setBiodataData] = useState<MatrimonialBiodataData>({
    name: "Aarav Sharma",
    dob: "15 August 1996",
    tob: "08:45 AM",
    pob: "New Delhi, Delhi",
    height: "5'11\"",
    complexion: "Fair",
    gotra: "Bhardwaj",
    rashi: "Leo",
    nakshatra: "Magha",
    caste: "Brahmin",
    religion: "Hindu",
    education: "B.Tech in Computer Science from IIT Delhi",
    occupation: "Senior Software Engineer",
    company: "Google India",
    income: "35 LPA",
    fatherName: "Rajesh Sharma",
    fatherOccupation: "Government Officer (Class-I)",
    motherName: "Sushma Sharma",
    motherOccupation: "School Principal",
    siblings: "1 Younger Sister (Pursuing MBA)",
    familyStatus: "Upper Middle Class",
    familyValues: "Moderate",
    address: "Sec-12, RK Puram, New Delhi",
    contactPerson: "Rajesh Sharma (Father)",
    contactPhone: "+91 98765 43210",
    expectations:
      "Looking for a well-educated, cultured, and professional partner from a decent family background who values family bonds.",
  });

  // Timetable
  const [ttTitle, setTtTitle] = useState("Academic Schedule 2026 - 27");
  const [ttTemplate, setTtTemplate] = useState<TimetableTemplate>("modern");

  // Custom template designer config (shared across all modes)
  const [customConfig, setCustomConfig] = useState<CustomTemplateConfig>(DEFAULT_CUSTOM_CONFIG);

  // Custom HTML map to store raw HTML for each mode when in Custom Template
  const [customHtmlMap, setCustomHtmlMap] = useState<Record<string, string>>({
    exam: "<h1>My Exam Document</h1><p>Start typing here...</p>",
    hhw: "<h1>My Holiday Homework</h1><p>Start typing here...</p>",
    timetable: "<h1>My Timetable</h1><p>Start typing here...</p>",
    resume: "<h1>My Resume</h1><p>Start typing here...</p>",
    biodata: "<h1>My Bio Data</h1><p>Start typing here...</p>",
  });

  // Track which mode currently has "custom" selected
  const examIsCustom = examTemplate === "custom";
  const hhwIsCustom = hhwTemplate === ("custom" as HHWTemplate);
  const ttIsCustom = ttTemplate === ("custom" as TimetableTemplate);
  const resumeIsCustom = resumeTemplate === ("custom" as ResumeTemplate);
  const biodataIsCustom = biodataTemplate === ("custom" as BiodataTemplate);

  const [ttPeriods, setTtPeriods] = useState<TimetablePeriod[]>([
    { label: "Period 0", time: "7:50-8:20" },
    { label: "Period 1", time: "8:20-9:00" },
    { label: "Period 2", time: "9:00-9:40" },
    { label: "Period 3", time: "9:40-10:20" },
    { label: "Lunch", time: "10:20-10:35", isBreak: true },
    { label: "Period 4", time: "10:35-11:15" },
    { label: "Period 5", time: "11:15-11:55" },
    { label: "Period 6", time: "11:55-12:30" },
    { label: "Period 7", time: "12:30-1:00" },
  ]);
  const [ttDays, setTtDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [ttGrid, setTtGrid] = useState<TimetableCell[][]>(() =>
    Array.from({ length: 6 }, () =>
      Array.from({ length: 9 }, () => ({ subject: "", teacher: "" })),
    ),
  );
  const [ttNotes, setTtNotes] = useState<string>(
    "B.St = Business Studies | PE = Physical Education",
  );

  function resizeGrid(days: number, periods: number) {
    setTtGrid((cur) => {
      const next: TimetableCell[][] = [];
      for (let d = 0; d < days; d++) {
        const row: TimetableCell[] = [];
        for (let p = 0; p < periods; p++) {
          row.push(cur[d]?.[p] || { subject: "", teacher: "" });
        }
        next.push(row);
      }
      return next;
    });
  }

  function updateCell(di: number, pi: number, key: keyof TimetableCell, val: string) {
    setTtGrid((cur) => {
      const next = cur.map((r) => r.slice());
      next[di] = next[di] || [];
      next[di][pi] = { ...(next[di][pi] || { subject: "", teacher: "" }), [key]: val };
      return next;
    });
  }

  function addPeriod(isBreak = false) {
    const next = [
      ...ttPeriods,
      { label: isBreak ? "Break" : `Period ${ttPeriods.length}`, time: "", isBreak },
    ];
    setTtPeriods(next);
    resizeGrid(ttDays.length, next.length);
  }
  function removePeriod(idx: number) {
    if (ttPeriods.length <= 1) return;
    const next = ttPeriods.filter((_, i) => i !== idx);
    setTtPeriods(next);
    setTtGrid((cur) => cur.map((row) => row.filter((_, i) => i !== idx)));
  }
  function updatePeriod(idx: number, key: keyof TimetablePeriod, val: string | boolean) {
    setTtPeriods((cur) => cur.map((p, i) => (i === idx ? { ...p, [key]: val } : p)));
  }
  function addDay() {
    const next = [...ttDays, `Day ${ttDays.length + 1}`];
    setTtDays(next);
    resizeGrid(next.length, ttPeriods.length);
  }
  function removeDay(idx: number) {
    if (ttDays.length <= 1) return;
    setTtDays(ttDays.filter((_, i) => i !== idx));
    setTtGrid((cur) => cur.filter((_, i) => i !== idx));
  }
  function updateDay(idx: number, val: string) {
    setTtDays((cur) => cur.map((d, i) => (i === idx ? val : d)));
  }
  function fillFirstRowToAll() {
    setTtGrid((cur) => {
      if (!cur[0]) return cur;
      const first = cur[0];
      return cur.map(() => first.map((c) => ({ ...c })));
    });
    toast.success("Copied Monday's row to all days");
  }
  function clearGrid() {
    setTtGrid(
      Array.from({ length: ttDays.length }, () =>
        Array.from({ length: ttPeriods.length }, () => ({ subject: "", teacher: "" })),
      ),
    );
  }

  function readImage(file: File | undefined, set: (v: string | null) => void, maxMb = 2) {
    if (!file) return;
    if (file.size > maxMb * 1_000_000) {
      toast.error(`Image too large (max ${maxMb}MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set(reader.result as string);
    reader.readAsDataURL(file);
  }

  function toggleHHWSubject(s: string) {
    setHhwSubjects((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }
  function addCustomSubject() {
    const v = hhwSubjectInput.trim();
    if (!v) return;
    if (!hhwSubjects.includes(v)) setHhwSubjects([...hhwSubjects, v]);
    setHhwSubjectInput("");
  }

  async function generate() {
    if (mode === "timetable") {
      // Timetable is rendered live from the builder state — nothing to fetch.
      toast.success("Timetable is live below — edit cells and export.");
      return;
    }
    if (!sourceText.trim() && !websiteUrl.trim()) {
      toast.error("Please provide source text or a website URL.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "exam") {
        if (engine === "offline") {
          // Client-side offline generation
          const paperData = generateExamOffline({
            schoolName,
            schoolAddress,
            examTitle,
            time,
            className,
            subject,
            maxMarks: Number(maxMarks),
            sourceText,
            websiteUrl,
            instructions,
          });
          setPaper(paperData);
          setExamHdr({
            schoolName,
            schoolAddress,
            examTitle,
            time,
            className,
            subject,
            maxMarks: Number(maxMarks),
          });
          toast.success("Instant exam paper generated offline!");
          setTimeout(
            () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            100,
          );
          return;
        }

        // AI Engine (using API)
        try {
          const token = localStorage.getItem("auth_token");
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const res = await fetch("/api/public/generate-exam", {
            method: "POST",
            headers,
            body: JSON.stringify({
              schoolName,
              schoolAddress,
              examTitle,
              time,
              className,
              subject,
              maxMarks: Number(maxMarks),
              sourceText,
              websiteUrl,
              instructions,
              engine,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "API generation failed");
          }
          setPaper(data.paper);
          setExamHdr(data.header);
          if (data.header?.isOfflineFallback) {
            toast.warning(
              "AI model was unavailable. Switched to Offline/Instant mode to generate your paper!",
            );
          } else {
            toast.success("Exam paper generated using AI!");
          }
        } catch (err) {
          console.warn(
            "[generate-exam] AI generation failed, falling back to local client generator:",
            err,
          );
          const paperData = generateExamOffline({
            schoolName,
            schoolAddress,
            examTitle,
            time,
            className,
            subject,
            maxMarks: Number(maxMarks),
            sourceText,
            websiteUrl,
            instructions,
          });
          setPaper(paperData);
          setExamHdr({
            schoolName,
            schoolAddress,
            examTitle,
            time,
            className,
            subject,
            maxMarks: Number(maxMarks),
          });
          toast.warning(
            "AI model was unavailable. Switched to Offline/Instant mode to generate your paper!",
          );
        }
        setTimeout(
          () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          100,
        );
      } else {
        if (hhwSubjects.length === 0) {
          toast.error("Add at least one subject.");
          return;
        }

        if (engine === "offline") {
          // Client-side offline generation
          const packetData = generateHHWOffline({
            schoolName,
            schoolAddress,
            title: hhwTitle,
            className,
            subjects: hhwSubjects,
            sourceText,
            websiteUrl,
            instructions,
            tone: hhwTemplate === "vvip" ? "premium" : "standard",
          });
          setPacket(packetData);
          setHhwHdr({
            schoolName,
            schoolAddress,
            className,
            title: hhwTitle,
          });
          toast.success("Instant holiday homework generated offline!");
          setTimeout(
            () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
            100,
          );
          return;
        }

        // AI Engine (using API)
        try {
          const token = localStorage.getItem("auth_token");
          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          const res = await fetch("/api/public/generate-hhw", {
            method: "POST",
            headers,
            body: JSON.stringify({
              schoolName,
              schoolAddress,
              title: hhwTitle,
              className,
              subjects: hhwSubjects,
              sourceText,
              websiteUrl,
              instructions,
              tone: hhwTemplate === "vvip" ? "premium" : "standard",
              engine,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "API generation failed");
          }
          setPacket(data.packet);
          setHhwHdr(data.header);
          if (data.header?.isOfflineFallback) {
            toast.warning(
              "AI model was unavailable. Switched to Offline/Instant mode to generate your holiday homework!",
            );
          } else {
            toast.success("Holiday homework generated using AI!");
          }
        } catch (err) {
          console.warn(
            "[generate-hhw] AI generation failed, falling back to local client generator:",
            err,
          );
          const packetData = generateHHWOffline({
            schoolName,
            schoolAddress,
            title: hhwTitle,
            className,
            subjects: hhwSubjects,
            sourceText,
            websiteUrl,
            instructions,
            tone: hhwTemplate === "vvip" ? "premium" : "standard",
          });
          setPacket(packetData);
          setHhwHdr({
            schoolName,
            schoolAddress,
            className,
            title: hhwTitle,
          });
          toast.warning(
            "AI model was unavailable. Switched to Offline/Instant mode to generate your holiday homework!",
          );
        }
        setTimeout(
          () => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          100,
        );
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      toast.error("Generation failed: " + errorMsg);
    } finally {
      setLoading(false);
    }
  }

  // --- Exam Paper Editor Functions ---
  function updateSectionName(sIdx: number, name: string) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      nextSections[sIdx] = { ...nextSections[sIdx], name };
      return { sections: nextSections };
    });
  }

  function updateSectionMarks(sIdx: number, marks: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      nextSections[sIdx] = { ...nextSections[sIdx], marks };
      return { sections: nextSections };
    });
  }

  function updateQuestionNumber(sIdx: number, qIdx: number, number: string) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], number };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateQuestionInstruction(sIdx: number, qIdx: number, instruction: string) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], instruction };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateQuestionMarks(sIdx: number, qIdx: number, marks: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], marks };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateQuestionPassage(sIdx: number, qIdx: number, passage: string | null) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], passage };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateQuestionSubQuestions(sIdx: number, qIdx: number, subQuestions: SubQuestion[]) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateSubQuestionText(sIdx: number, qIdx: number, sqIdx: number, text: string) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      nextSubQ[sqIdx] = { ...nextSubQ[sqIdx], text };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function updateQuestionOption(
    sIdx: number,
    qIdx: number,
    sqIdx: number,
    oIdx: number,
    value: string,
  ) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      const nextOpts = [...(nextSubQ[sqIdx].options || [])];
      nextOpts[oIdx] = value;
      nextSubQ[sqIdx] = { ...nextSubQ[sqIdx], options: nextOpts };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function addQuestion(sIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const newQNum = nextQuestions.length + 1;
      nextQuestions.push({
        number: `${newQNum}`,
        instruction: "New question instruction",
        marks: 1,
        type: "short",
        passage: null,
        subQuestions: [],
      });
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function deleteQuestion(sIdx: number, qIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = nextSections[sIdx].questions.filter((_, i) => i !== qIdx);
      // Renumber questions
      const renumbered = nextQuestions.map((q, idx) => ({ ...q, number: `${idx + 1}` }));
      nextSections[sIdx] = { ...nextSections[sIdx], questions: renumbered };
      return { sections: nextSections };
    });
  }

  function addSection() {
    setPaper((prev) => {
      const nextSections = prev ? [...prev.sections] : [];
      nextSections.push({
        name: `SECTION ${String.fromCharCode(65 + nextSections.length)}: NEW SECTION`,
        marks: 5,
        questions: [],
      });
      return { sections: nextSections };
    });
  }

  function deleteSection(sIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = prev.sections.filter((_, i) => i !== sIdx);
      return { sections: nextSections };
    });
  }

  function addSubQuestion(sIdx: number, qIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      const newLabel = String.fromCharCode(97 + nextSubQ.length); // a, b, c...
      nextSubQ.push({
        label: newLabel,
        text: "New subquestion text",
        options: null,
      });
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function deleteSubQuestion(sIdx: number, qIdx: number, sqIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = nextQuestions[qIdx].subQuestions.filter((_, i) => i !== sqIdx);
      const renumbered = nextSubQ.map((sq, idx) => ({
        ...sq,
        label: String.fromCharCode(97 + idx),
      }));
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: renumbered };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function toggleSubQuestionMCQ(sIdx: number, qIdx: number, sqIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      const currentOpts = nextSubQ[sqIdx].options;
      nextSubQ[sqIdx] = {
        ...nextSubQ[sqIdx],
        options: currentOpts ? null : ["Option A", "Option B", "Option C", "Option D"],
      };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function addOption(sIdx: number, qIdx: number, sqIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      const nextOpts = [
        ...(nextSubQ[sqIdx].options || []),
        `Option ${nextSubQ[sqIdx].options?.length ? nextSubQ[sqIdx].options.length + 1 : 1}`,
      ];
      nextSubQ[sqIdx] = { ...nextSubQ[sqIdx], options: nextOpts };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  function deleteOption(sIdx: number, qIdx: number, sqIdx: number, oIdx: number) {
    setPaper((prev) => {
      if (!prev) return prev;
      const nextSections = [...prev.sections];
      const nextQuestions = [...nextSections[sIdx].questions];
      const nextSubQ = [...nextQuestions[qIdx].subQuestions];
      const nextOpts = (nextSubQ[sqIdx].options || []).filter((_, i) => i !== oIdx);
      nextSubQ[sqIdx] = { ...nextSubQ[sqIdx], options: nextOpts };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], subQuestions: nextSubQ };
      nextSections[sIdx] = { ...nextSections[sIdx], questions: nextQuestions };
      return { sections: nextSections };
    });
  }

  // --- Holiday Homework Editor Functions ---
  function updateHHWTitle(title: string) {
    setPacket((prev) => {
      if (!prev) return prev;
      return { ...prev, title };
    });
  }

  function updateGeneralInstruction(idx: number, text: string) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextIns = [...prev.generalInstructions];
      nextIns[idx] = text;
      return { ...prev, generalInstructions: nextIns };
    });
  }

  function addGeneralInstruction() {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextIns = [...prev.generalInstructions, "New general instruction"];
      return { ...prev, generalInstructions: nextIns };
    });
  }

  function deleteGeneralInstruction(idx: number) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextIns = prev.generalInstructions.filter((_, i) => i !== idx);
      return { ...prev, generalInstructions: nextIns };
    });
  }

  function updateHHWSubjectName(sIdx: number, subject: string) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = [...prev.subjects];
      nextSubjects[sIdx] = { ...nextSubjects[sIdx], subject };
      return { ...prev, subjects: nextSubjects };
    });
  }

  function updateHHWSubjectNote(sIdx: number, note: string) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = [...prev.subjects];
      nextSubjects[sIdx] = { ...nextSubjects[sIdx], note };
      return { ...prev, subjects: nextSubjects };
    });
  }

  function updateHHWAssignmentText(sIdx: number, aIdx: number, text: string) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = [...prev.subjects];
      const nextAssignments = [...nextSubjects[sIdx].assignments];
      nextAssignments[aIdx] = { ...nextAssignments[aIdx], text };
      nextSubjects[sIdx] = { ...nextSubjects[sIdx], assignments: nextAssignments };
      return { ...prev, subjects: nextSubjects };
    });
  }

  function addHHWAssignment(sIdx: number) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = [...prev.subjects];
      const nextAssignments = [...nextSubjects[sIdx].assignments];
      const newNum = nextAssignments.length + 1;
      nextAssignments.push({ number: `${newNum}`, text: "New assignment task" });
      nextSubjects[sIdx] = { ...nextSubjects[sIdx], assignments: nextAssignments };
      return { ...prev, subjects: nextSubjects };
    });
  }

  function deleteHHWAssignment(sIdx: number, aIdx: number) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = [...prev.subjects];
      const nextAssignments = nextSubjects[sIdx].assignments.filter((_, i) => i !== aIdx);
      // Renumber
      const renumbered = nextAssignments.map((a, idx) => ({ ...a, number: `${idx + 1}` }));
      nextSubjects[sIdx] = { ...nextSubjects[sIdx], assignments: renumbered };
      return { ...prev, subjects: nextSubjects };
    });
  }

  function addHHWSubject() {
    setPacket((prev) => {
      const nextSubjects = prev ? [...prev.subjects] : [];
      nextSubjects.push({
        subject: "NEW SUBJECT",
        note: "Subject assignments",
        assignments: [{ number: "1", text: "First assignment" }],
      });
      return {
        title: prev?.title || "VACATION HOMEWORK",
        generalInstructions: prev?.generalInstructions || [],
        subjects: nextSubjects,
      };
    });
  }

  function deleteHHWSubject(sIdx: number) {
    setPacket((prev) => {
      if (!prev) return prev;
      const nextSubjects = prev.subjects.filter((_, i) => i !== sIdx);
      return { ...prev, subjects: nextSubjects };
    });
  }

  const ttHeader: TimetableHeader = {
    schoolName,
    schoolAddress,
    className: `CLASS ${className}`,
    title: ttTitle,
  };
  const ttData: TimetableData = {
    periods: ttPeriods,
    days: ttDays,
    grid: ttGrid,
    notes: ttNotes
      ? ttNotes
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
      : [],
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster />
        <header className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">
                  Exam · Holiday Homework · Time Table Maker
                </h1>
                <p className="text-xs text-muted-foreground">
                  Premium school templates — print, PDF, or DOCX.
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50">
          <AuthCard onAuthSuccess={(usr) => setUser(usr)} />
        </div>
      </div>
    );
  }

  const hasOutput =
    (mode === "exam" && paper && examHdr) ||
    (mode === "hhw" && packet && hhwHdr) ||
    mode === "timetable" ||
    mode === "resume";

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="border-b bg-card no-print">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Exam · Holiday Homework · Time Table Maker</h1>
              <p className="text-xs text-muted-foreground">
                Premium school templates — print, PDF, or DOCX.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium bg-accent px-2.5 py-1.5 rounded-md">
              👤 {user.email}
            </span>
            <Link
              to="/swagger"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-500/20 active:scale-95 dark:text-indigo-400"
            >
              🔌 API Reference Docs
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("auth_token");
                setUser(null);
                toast.success("Signed out successfully!");
              }}
              className="flex items-center gap-1.5 text-xs text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive active:scale-95 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 grid gap-8 lg:grid-cols-[440px_1fr]">
        <Card className="p-5 space-y-5 no-print h-fit lg:sticky lg:top-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList
              className="flex flex-wrap w-full h-auto"
            >
              <TabsTrigger value="exam" className="flex-1 min-w-fit">
                <GraduationCap className="mr-2 h-4 w-4" /> Exam
              </TabsTrigger>
              <TabsTrigger value="hhw" className="flex-1 min-w-fit">
                <Sparkles className="mr-2 h-4 w-4" /> HHW
              </TabsTrigger>
              <TabsTrigger value="timetable" className="flex-1 min-w-fit">
                <CalendarClock className="mr-2 h-4 w-4" /> Timetable
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex-1 min-w-fit">
                <FileText className="mr-2 h-4 w-4" /> Resume
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1 min-w-fit">
                <FolderOpen className="mr-2 h-4 w-4" /> Saved
              </TabsTrigger>
              {(user?.email?.toLowerCase() === "admin@school.com" ||
                user?.email?.toLowerCase() === "admin2026@school.com") && (
                  <TabsTrigger value="admin" className="flex-1 min-w-fit">
                    <KeyRound className="mr-2 h-4 w-4" /> Admin
                  </TabsTrigger>
                )}
            </TabsList>

            {mode !== "timetable" && mode !== "resume" && mode !== "admin" && mode !== "saved" && (
              <div className="mt-4 rounded-lg border bg-accent/30 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Generation Engine</span>
                  {engine === "ai" ? (
                    <span className="text-[10px] text-primary flex items-center gap-0.5 font-bold">
                      <Sparkles className="h-3 w-3 inline text-amber-500 animate-pulse" /> AI Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ⚡ Instant & Offline
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEngine("ai")}
                    className={`rounded px-3 py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1 ${engine === "ai"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent text-muted-foreground bg-background/50"
                      }`}
                  >
                    🤖 AI (Gemini)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngine("offline")}
                    className={`rounded px-3 py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1 ${engine === "offline"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent text-muted-foreground bg-background/50"
                      }`}
                  >
                    ⚡ Instant (Offline)
                  </button>
                </div>
              </div>
            )}

            {/* Common header */}
            {mode !== "timetable" && mode !== "resume" && mode !== "admin" && mode !== "saved" && (
              <div className="space-y-3 mt-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  School
                </h2>
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input value={className} onChange={(e) => setClassName(e.target.value)} />
                </div>
              </div>
            )}

            <TabsContent value="exam" className="space-y-3 mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Exam Details
              </h2>

              {/* Template Gallery for Exam */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Template Style
                </Label>
                <TemplateGallery
                  mode="exam"
                  selected={examTemplate}
                  accent={themeColor}
                  onSelect={(id) => setExamTemplate(id as "standard" | "board" | "custom")}
                />
                {examTemplate === "custom" && (
                  <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-primary" />
                        Custom HTML Editor
                      </h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Build your entire exam layout from scratch using the rich text editor below.
                    </div>
                    <div className="border rounded-md overflow-hidden bg-white min-h-[300px]">
                      <EditorModal
                        value={customHtmlMap["exam"]}
                        onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, exam: val })}
                        title="Open Rich Text Editor"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Exam Title</Label>
                <Input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Max Marks</Label>
                  <Input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hhw" className="space-y-3 mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Homework Details
              </h2>
              <div className="space-y-2">
                <Label>HHW Title</Label>
                <Input
                  value={hhwTitle}
                  onChange={(e) => setHhwTitle(e.target.value)}
                  placeholder="SUMMER VACATION HOMEWORK"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Template Style
                </Label>
                <TemplateGallery
                  mode="hhw"
                  selected={hhwTemplate}
                  accent={themeColor}
                  onSelect={(id) => setHhwTemplate(id as HHWTemplate)}
                />
                {hhwIsCustom && (
                  <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-primary" />
                        Custom HTML Editor
                      </h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Build your holiday homework entirely from scratch.
                    </div>
                    <div className="border rounded-md overflow-hidden bg-white min-h-[300px]">
                      <EditorModal
                        value={customHtmlMap["hhw"]}
                        onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, hhw: val })}
                        title="Open Rich Text Editor"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECT_PRESETS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleHHWSubject(s)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition ${hhwSubjects.includes(s)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={hhwSubjectInput}
                    onChange={(e) => setHhwSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSubject();
                      }
                    }}
                    placeholder="Add custom subject"
                  />
                  <Button type="button" variant="outline" onClick={addCustomSubject}>
                    Add
                  </Button>
                </div>
                {hhwSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hhwSubjects.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => toggleHHWSubject(s)}
                          aria-label={`Remove ${s}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cover Image (optional)</Label>
                <div className="flex items-center gap-3">
                  {coverImageUrl ? (
                    <div className="relative">
                      <img
                        src={coverImageUrl}
                        alt="cover preview"
                        className="h-14 w-20 rounded border object-cover bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl(null)}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-0.5"
                        aria-label="Remove cover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-14 w-20 cursor-pointer items-center justify-center rounded border border-dashed text-muted-foreground hover:bg-accent">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => readImage(e.target.files?.[0], setCoverImageUrl, 4)}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Decorative image for the cover page.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timetable" className="space-y-3 mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Timetable
              </h2>
              <div className="space-y-2">
                <Label>Subtitle / Academic Year</Label>
                <Input
                  value={ttTitle}
                  onChange={(e) => setTtTitle(e.target.value)}
                  placeholder="Academic Schedule 2026 - 27"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Template Style
                </Label>
                <TemplateGallery
                  mode="timetable"
                  selected={ttTemplate}
                  accent={themeColor}
                  onSelect={(id) => setTtTemplate(id as TimetableTemplate)}
                />
                {ttIsCustom && (
                  <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-primary" />
                        Custom HTML Editor
                      </h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Build your timetable entirely from scratch.
                    </div>
                    <div className="border rounded-md overflow-hidden bg-white min-h-[300px]">
                      <EditorModal
                        value={customHtmlMap["timetable"]}
                        onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, timetable: val })}
                        title="Open Rich Text Editor"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Periods</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addPeriod(false)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Period
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addPeriod(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Break
                    </Button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 rounded border p-2">
                  {ttPeriods.map((p, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input
                        className="h-7 text-xs"
                        value={p.label}
                        onChange={(e) => updatePeriod(i, "label", e.target.value)}
                        placeholder="Label"
                      />
                      <Input
                        className="h-7 text-xs w-24"
                        value={p.time}
                        onChange={(e) => updatePeriod(i, "time", e.target.value)}
                        placeholder="Time"
                      />
                      <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={!!p.isBreak}
                          onChange={(e) => updatePeriod(i, "isBreak", e.target.checked)}
                        />
                        brk
                      </label>
                      <button
                        type="button"
                        onClick={() => removePeriod(i)}
                        className="text-destructive hover:bg-destructive/10 rounded p-1"
                        aria-label="remove period"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Days</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addDay}>
                    <Plus className="h-3 w-3 mr-1" /> Day
                  </Button>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 rounded border p-2">
                  {ttDays.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Input
                        className="h-7 text-xs"
                        value={d}
                        onChange={(e) => updateDay(i, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeDay(i)}
                        className="text-destructive hover:bg-destructive/10 rounded p-1"
                        aria-label="remove day"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes (one per line)</Label>
                <Textarea rows={2} value={ttNotes} onChange={(e) => setTtNotes(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={fillFirstRowToAll}>
                  Copy row 1 → all
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearGrid}>
                  Clear grid
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: fill the grid in the editor on the right ↘
              </p>
            </TabsContent>

            <TabsContent value="resume" className="space-y-3 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setResumeMode("job")}
                      className={`rounded border px-2 py-2 text-xs font-semibold capitalize transition ${resumeMode === "job"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent bg-background"
                        }`}
                    >
                      💼 Job Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeMode("wedding")}
                      className={`rounded border px-2 py-2 text-xs font-semibold capitalize transition ${resumeMode === "wedding"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent bg-background"
                        }`}
                    >
                      ❤️ Matrimonial CV
                    </button>
                  </div>
                </div>

                {resumeMode === "job" ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Template Style
                      </Label>
                      <TemplateGallery
                        mode="resume-job"
                        selected={resumeTemplate}
                        accent={themeColor}
                        onSelect={(id) => setResumeTemplate(id as ResumeTemplate)}
                      />
                      {resumeTemplate === "custom" && (
                        <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Paintbrush className="h-4 w-4 text-primary" />
                              Custom HTML Editor
                            </h3>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Build your resume entirely from scratch.
                          </div>
                          <div className="border rounded-md overflow-hidden bg-white min-h-[300px]">
                            <EditorModal
                              value={customHtmlMap["resume"]}
                              onChange={(val) =>
                                setCustomHtmlMap({ ...customHtmlMap, resume: val })
                              }
                              title="Open Rich Text Editor"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={resumeData.name}
                        onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Title</Label>
                      <Input
                        value={resumeData.title}
                        onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={resumeData.email}
                          onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                          placeholder="johndoe@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={resumeData.phone}
                          onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={resumeData.location}
                          onChange={(e) =>
                            setResumeData({ ...resumeData, location: e.target.value })
                          }
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website / Portfolio</Label>
                        <Input
                          value={resumeData.website || ""}
                          onChange={(e) =>
                            setResumeData({ ...resumeData, website: e.target.value })
                          }
                          placeholder="github.com/johndoe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Summary</Label>
                      <Textarea
                        rows={3}
                        value={resumeData.summary}
                        onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                        placeholder="Brief summary of your skills and accomplishments..."
                      />
                    </div>

                    {/* Manage list sections */}
                    <div className="border-t pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                          Skills (comma sep)
                        </span>
                      </div>
                      <Input
                        value={resumeData.skills.join(", ")}
                        onChange={(e) => {
                          const list = e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean);
                          setResumeData({ ...resumeData, skills: list });
                        }}
                        placeholder="React, TypeScript, Node.js"
                      />
                    </div>

                    <div className="border-t pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                          Languages (comma sep)
                        </span>
                      </div>
                      <Input
                        value={resumeData.languages.join(", ")}
                        onChange={(e) => {
                          const list = e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean);
                          setResumeData({ ...resumeData, languages: list });
                        }}
                        placeholder="English, Spanish"
                      />
                    </div>

                    {/* Education Manager */}
                    <div className="border-t pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="font-bold text-xs text-muted-foreground uppercase">
                          Education
                        </Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px]"
                          onClick={() => {
                            setResumeData((prev) => ({
                              ...prev,
                              education: [
                                ...prev.education,
                                {
                                  school: "",
                                  degree: "",
                                  field: "",
                                  startYear: "",
                                  endYear: "",
                                  grade: "",
                                },
                              ],
                            }));
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {resumeData.education.map((edu, idx) => (
                          <div
                            key={idx}
                            className="border p-2 rounded space-y-1 bg-accent/20 text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Education #{idx + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-destructive h-5 w-5 p-0"
                                onClick={() => {
                                  setResumeData((prev) => ({
                                    ...prev,
                                    education: prev.education.filter((_, i) => i !== idx),
                                  }));
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <Input
                              className="h-7 text-xs"
                              placeholder="School / University"
                              value={edu.school}
                              onChange={(e) => {
                                const list = [...resumeData.education];
                                list[idx] = { ...list[idx], school: e.target.value };
                                setResumeData({ ...resumeData, education: list });
                              }}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              <Input
                                className="h-7 text-xs"
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) => {
                                  const list = [...resumeData.education];
                                  list[idx] = { ...list[idx], degree: e.target.value };
                                  setResumeData({ ...resumeData, education: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="Field of Study"
                                value={edu.field}
                                onChange={(e) => {
                                  const list = [...resumeData.education];
                                  list[idx] = { ...list[idx], field: e.target.value };
                                  setResumeData({ ...resumeData, education: list });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                              <Input
                                className="h-7 text-xs"
                                placeholder="Start Year"
                                value={edu.startYear}
                                onChange={(e) => {
                                  const list = [...resumeData.education];
                                  list[idx] = { ...list[idx], startYear: e.target.value };
                                  setResumeData({ ...resumeData, education: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="End Year"
                                value={edu.endYear}
                                onChange={(e) => {
                                  const list = [...resumeData.education];
                                  list[idx] = { ...list[idx], endYear: e.target.value };
                                  setResumeData({ ...resumeData, education: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="Grade / GPA"
                                value={edu.grade || ""}
                                onChange={(e) => {
                                  const list = [...resumeData.education];
                                  list[idx] = { ...list[idx], grade: e.target.value };
                                  setResumeData({ ...resumeData, education: list });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience Manager */}
                    <div className="border-t pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="font-bold text-xs text-muted-foreground uppercase">
                          Work Experience
                        </Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px]"
                          onClick={() => {
                            setResumeData((prev) => ({
                              ...prev,
                              experience: [
                                ...prev.experience,
                                {
                                  company: "",
                                  role: "",
                                  location: "",
                                  startYear: "",
                                  endYear: "",
                                  description: "",
                                },
                              ],
                            }));
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {resumeData.experience.map((exp, idx) => (
                          <div
                            key={idx}
                            className="border p-2 rounded space-y-1 bg-accent/20 text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Experience #{idx + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-destructive h-5 w-5 p-0"
                                onClick={() => {
                                  setResumeData((prev) => ({
                                    ...prev,
                                    experience: prev.experience.filter((_, i) => i !== idx),
                                  }));
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              <Input
                                className="h-7 text-xs"
                                placeholder="Company"
                                value={exp.company}
                                onChange={(e) => {
                                  const list = [...resumeData.experience];
                                  list[idx] = { ...list[idx], company: e.target.value };
                                  setResumeData({ ...resumeData, experience: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="Role"
                                value={exp.role}
                                onChange={(e) => {
                                  const list = [...resumeData.experience];
                                  list[idx] = { ...list[idx], role: e.target.value };
                                  setResumeData({ ...resumeData, experience: list });
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                              <Input
                                className="h-7 text-xs col-span-1"
                                placeholder="Location"
                                value={exp.location}
                                onChange={(e) => {
                                  const list = [...resumeData.experience];
                                  list[idx] = { ...list[idx], location: e.target.value };
                                  setResumeData({ ...resumeData, experience: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="Start Year"
                                value={exp.startYear}
                                onChange={(e) => {
                                  const list = [...resumeData.experience];
                                  list[idx] = { ...list[idx], startYear: e.target.value };
                                  setResumeData({ ...resumeData, experience: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="End Year"
                                value={exp.endYear}
                                onChange={(e) => {
                                  const list = [...resumeData.experience];
                                  list[idx] = { ...list[idx], endYear: e.target.value };
                                  setResumeData({ ...resumeData, experience: list });
                                }}
                              />
                            </div>
                            <Textarea
                              className="text-xs py-1 min-h-[36px]"
                              placeholder="Key accomplishments..."
                              value={exp.description}
                              onChange={(e) => {
                                const list = [...resumeData.experience];
                                list[idx] = { ...list[idx], description: e.target.value };
                                setResumeData({ ...resumeData, experience: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects Manager */}
                    <div className="border-t pt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="font-bold text-xs text-muted-foreground uppercase">
                          Key Projects
                        </Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px]"
                          onClick={() => {
                            setResumeData((prev) => ({
                              ...prev,
                              projects: [
                                ...prev.projects,
                                { title: "", description: "", link: "" },
                              ],
                            }));
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {resumeData.projects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="border p-2 rounded space-y-1 bg-accent/20 text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Project #{idx + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-destructive h-5 w-5 p-0"
                                onClick={() => {
                                  setResumeData((prev) => ({
                                    ...prev,
                                    projects: prev.projects.filter((_, i) => i !== idx),
                                  }));
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              <Input
                                className="h-7 text-xs"
                                placeholder="Project Title"
                                value={proj.title}
                                onChange={(e) => {
                                  const list = [...resumeData.projects];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setResumeData({ ...resumeData, projects: list });
                                }}
                              />
                              <Input
                                className="h-7 text-xs"
                                placeholder="Link (optional)"
                                value={proj.link || ""}
                                onChange={(e) => {
                                  const list = [...resumeData.projects];
                                  list[idx] = { ...list[idx], link: e.target.value };
                                  setResumeData({ ...resumeData, projects: list });
                                }}
                              />
                            </div>
                            <Textarea
                              className="text-xs py-1 min-h-[36px]"
                              placeholder="Project details..."
                              value={proj.description}
                              onChange={(e) => {
                                const list = [...resumeData.projects];
                                list[idx] = { ...list[idx], description: e.target.value };
                                setResumeData({ ...resumeData, projects: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Wedding Biodata Sidebar Fields
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Template Style
                      </Label>
                      <TemplateGallery
                        mode="resume-wedding"
                        selected={biodataTemplate}
                        accent={themeColor}
                        onSelect={(id) => setBiodataTemplate(id as BiodataTemplate)}
                      />
                      {biodataTemplate === "custom" && (
                        <div className="bg-card border rounded-lg p-3 sm:p-4 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Paintbrush className="h-4 w-4 text-primary" />
                              Custom HTML Editor
                            </h3>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Build your bio data entirely from scratch.
                          </div>
                          <div className="border rounded-md overflow-hidden bg-white min-h-[300px]">
                            <EditorModal
                              value={customHtmlMap["biodata"]}
                              onChange={(val) =>
                                setCustomHtmlMap({ ...customHtmlMap, biodata: val })
                              }
                              title="Open Rich Text Editor"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={biodataData.name}
                        onChange={(e) => setBiodataData({ ...biodataData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          value={biodataData.dob}
                          onChange={(e) => setBiodataData({ ...biodataData, dob: e.target.value })}
                          placeholder="e.g. 15 August 1996"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time of Birth</Label>
                        <Input
                          value={biodataData.tob}
                          onChange={(e) => setBiodataData({ ...biodataData, tob: e.target.value })}
                          placeholder="e.g. 08:45 AM"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Place of Birth</Label>
                        <Input
                          value={biodataData.pob}
                          onChange={(e) => setBiodataData({ ...biodataData, pob: e.target.value })}
                          placeholder="e.g. New Delhi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <Input
                          value={biodataData.height}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, height: e.target.value })
                          }
                          placeholder={"e.g. 5'11\""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Complexion</Label>
                        <Input
                          value={biodataData.complexion}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, complexion: e.target.value })
                          }
                          placeholder="Fair"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gotra</Label>
                        <Input
                          value={biodataData.gotra}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, gotra: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Rashi</Label>
                        <Input
                          value={biodataData.rashi || ""}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, rashi: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nakshatra</Label>
                        <Input
                          value={biodataData.nakshatra || ""}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, nakshatra: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Religion</Label>
                        <Input
                          value={biodataData.religion || ""}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, religion: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Caste</Label>
                        <Input
                          value={biodataData.caste || ""}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, caste: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Education & Occupation */}
                    <div className="border-t pt-2 space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase">
                        Education & Career
                      </h3>
                      <div className="space-y-2">
                        <Label>Highest Education</Label>
                        <Input
                          value={biodataData.education}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, education: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Occupation / Role</Label>
                        <Input
                          value={biodataData.occupation}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, occupation: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input
                            value={biodataData.company || ""}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, company: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Annual Income</Label>
                          <Input
                            value={biodataData.income || ""}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, income: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Family Background */}
                    <div className="border-t pt-2 space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase">
                        Family Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Father's Name</Label>
                          <Input
                            value={biodataData.fatherName}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, fatherName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Father's Occupation</Label>
                          <Input
                            value={biodataData.fatherOccupation}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, fatherOccupation: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Mother's Name</Label>
                          <Input
                            value={biodataData.motherName}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, motherName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Mother's Occupation</Label>
                          <Input
                            value={biodataData.motherOccupation}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, motherOccupation: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Siblings Details</Label>
                        <Input
                          value={biodataData.siblings}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, siblings: e.target.value })
                          }
                          placeholder="e.g. 1 younger sister"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Family Status</Label>
                          <Input
                            value={biodataData.familyStatus}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, familyStatus: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Family Values</Label>
                          <Input
                            value={biodataData.familyValues}
                            onChange={(e) =>
                              setBiodataData({ ...biodataData, familyValues: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Residential Address</Label>
                        <Input
                          value={biodataData.address}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, address: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Expectations & Contact */}
                    <div className="border-t pt-2 space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase">
                        Expectations & Contact
                      </h3>
                      <div className="space-y-2">
                        <Label>Partner Expectations</Label>
                        <Textarea
                          rows={2}
                          value={biodataData.expectations}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, expectations: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          value={biodataData.contactPerson}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, contactPerson: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Numbers</Label>
                        <Input
                          value={biodataData.contactPhone}
                          onChange={(e) =>
                            setBiodataData({ ...biodataData, contactPhone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4" /> Add User Account
                </h2>
                <p className="text-xs text-muted-foreground">
                  Create a new user account. Only admin can register accounts.
                </p>
                <form onSubmit={handleAddUser} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="new-user-email">Email Address</Label>
                    <Input
                      id="new-user-email"
                      type="email"
                      placeholder="teacher@school.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-user-password">Password</Label>
                    <Input
                      id="new-user-password"
                      type="password"
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={adminLoading} className="w-full">
                    {adminLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding User…
                      </>
                    ) : (
                      "Add User Account"
                    )}
                  </Button>
                </form>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Registered Users ({addedUsers.length})
                </h2>
                {adminLoading && addedUsers.length === 0 ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : addedUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No users registered yet.</p>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    {addedUsers.map((usr, i) => (
                      <div
                        key={i}
                        className="flex flex-col p-2.5 rounded-lg border bg-accent/20 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground break-all">
                              {usr.email}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1">
                              Added: {new Date(usr.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px]"
                              onClick={() => {
                                setEditUserEmail(editUserEmail === usr.email ? null : usr.email);
                                setEditUserPassword("");
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUser(usr.email)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {editUserEmail === usr.email && (
                          <div className="mt-2 pt-2 border-t flex gap-2">
                            <Input
                              type="password"
                              placeholder="New password"
                              className="h-7 text-xs flex-1"
                              value={editUserPassword}
                              onChange={(e) => setEditUserPassword(e.target.value)}
                            />
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleUpdateUser(usr.email)}
                            >
                              Save
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Source */}
          {mode !== "resume" && mode !== "admin" && (
            <div className="space-y-3 border-t pt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Source Content
              </h2>
              <div className="space-y-2">
                <Label>Source Text (chapter / syllabus / topics)</Label>
                <div className="border rounded-md overflow-hidden bg-white">
                  <EditorModal
                    value={sourceText}
                    onChange={(val) => setSourceText(val)}
                    title="Open Rich Text Editor"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website URL (optional)</Label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com/topic"
                />
              </div>
              <div className="space-y-2">
                <Label>Extra Instructions (optional)</Label>
                <div className="border rounded-md overflow-hidden bg-white">
                  <EditorModal
                    value={instructions}
                    onChange={(val) => setInstructions(val)}
                    title="Open Rich Text Editor"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Design */}
          {mode !== "admin" && (
            <div className="space-y-3 border-t pt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Design
              </h2>
              <div className="space-y-2">
                <Label>{mode === "resume" ? "Your Photo / Logo" : "School Logo"}</Label>
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <div className="relative">
                      <img
                        src={logoUrl}
                        alt="logo preview"
                        className="h-14 w-14 rounded border object-contain bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setLogoUrl(null)}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-0.5"
                        aria-label="Remove logo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-14 w-14 cursor-pointer items-center justify-center rounded border border-dashed text-muted-foreground hover:bg-accent">
                      <Upload className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => readImage(e.target.files?.[0], setLogoUrl)}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground">PNG / JPG, up to 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded border bg-transparent"
                    />
                    <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{mode === "resume" ? "Signature / Footer Note" : "Footer Note"}</Label>
                  <Input
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    placeholder={mode === "resume" ? "e.g. Signature" : "All the best!"}
                  />
                </div>
              </div>
            </div>
          )}

          {mode !== "resume" && mode !== "admin" && (
            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : mode === "exam" ? (
                "Generate Exam Paper"
              ) : mode === "hhw" ? (
                "Generate Holiday Homework"
              ) : (
                "Refresh Timetable Preview"
              )}
            </Button>
          )}

          {hasOutput && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

              <Button variant="outline" className="col-span-2" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          )}
        </Card>

        <div ref={outputRef}>
          {/* ── Prominent export bar shown right after generation ── */}
          {hasOutput && mode !== "timetable" && (
              <div className="no-print sticky top-0 z-10 mb-4 flex flex-col sm:flex-row gap-2 sm:items-center rounded-xl border bg-card/95 backdrop-blur p-3 shadow-lg">
                <span className="flex-1 text-xs sm:text-sm font-semibold text-foreground">
                  {mode === "resume"
                    ? "✅ Live Preview. Export or print your document:"
                    : "✅ Generated! Export your document:"}
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-primary/30 bg-primary/5 text-primary hover:bg-primary/10" onClick={() => setShowSaveDialog(true)}>
                    <Save className="mr-1.5 h-4 w-4" /> Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (mode === "exam") {
                        if (examTemplate === "custom")
                          return exportRawHtmlPdf(
                            customHtmlMap["exam"],
                            `${examHdr!.subject}-${examHdr!.className}-exam.pdf`,
                          );
                        return exportExamPdf(`${examHdr!.subject}-${examHdr!.className}-exam.pdf`);
                      }
                      if (mode === "hhw") {
                        if (hhwTemplate === "custom")
                          return exportRawHtmlPdf(
                            customHtmlMap["hhw"],
                            `${hhwHdr!.className}-holiday-homework.pdf`,
                          );
                        return exportHHWPdf(`${hhwHdr!.className}-holiday-homework.pdf`);
                      }

                      const fname =
                        resumeMode === "job"
                          ? `${resumeData.name || "Resume"}_Resume.pdf`
                          : `${biodataData.name || "Biodata"}_Biodata.pdf`;
                      if (mode === "resume" && resumeMode === "job" && resumeTemplate === "custom") {
                        return exportRawHtmlPdf(customHtmlMap["resume"], fname);
                      }
                      if (
                        mode === "resume" &&
                        resumeMode === "wedding" &&
                        biodataTemplate === "custom"
                      ) {
                        return exportRawHtmlPdf(customHtmlMap["biodata"], fname);
                      }
                      return exportResumePdf(fname, resumeMode);
                    }}
                    className="flex-1 sm:flex-none shadow-md shadow-primary/20 hover:shadow-primary/30 transition-shadow bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                  >
                    <Download className="mr-1.5 h-4 w-4" /> PDF
                  </Button>

                  <Button size="sm" variant="ghost" onClick={() => window.print()}>
                    <Printer className="mr-1.5 h-4 w-4" /> Print
                  </Button>
                </div>
              </div>
            )}

          {mode === "exam" && paper && examHdr ? (
            <div className="space-y-4">
              {examTemplate === "custom" ? (
                <div className="border rounded-xl overflow-hidden bg-white shadow-lg min-h-[800px] flex flex-col">
                  <div className="bg-primary/10 p-3 border-b text-sm font-semibold text-primary flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Custom HTML Exam Editor
                  </div>
                  <div className="flex-1">
                    <EditorModal
                      value={customHtmlMap["exam"]}
                      onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, exam: val })}
                      title="Open Rich Text Editor"
                    />
                  </div>
                </div>
              ) : (
                <ExamPaperView
                  header={examHdr}
                  paper={paper}
                  logoUrl={logoUrl}
                  themeColor={themeColor}
                  footer={footer}
                  template={examTemplate}
                  customConfig={customConfig}
                />
              )}
              <Card className="p-4 no-print space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    ✍️ Edit Exam Paper Questions
                  </h3>
                  <Button variant="outline" size="sm" onClick={addSection}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Section
                  </Button>
                </div>

                {/* Header details editor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-accent/30 p-3 rounded-lg text-xs">
                  <div className="space-y-1">
                    <Label className="text-[10px]">School Name</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.schoolName}
                      onChange={(e) => setExamHdr({ ...examHdr, schoolName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Address</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.schoolAddress}
                      onChange={(e) => setExamHdr({ ...examHdr, schoolAddress: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Exam Title</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.examTitle}
                      onChange={(e) => setExamHdr({ ...examHdr, examTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Class</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.className}
                      onChange={(e) => setExamHdr({ ...examHdr, className: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Subject</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.subject}
                      onChange={(e) => setExamHdr({ ...examHdr, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Time</Label>
                    <Input
                      className="h-7 text-xs"
                      value={examHdr.time}
                      onChange={(e) => setExamHdr({ ...examHdr, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Max Marks</Label>
                    <Input
                      type="number"
                      className="h-7 text-xs"
                      value={examHdr.maxMarks}
                      onChange={(e) => setExamHdr({ ...examHdr, maxMarks: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {paper.sections.map((section, sIdx) => (
                    <div key={sIdx} className="border rounded-lg p-3.5 space-y-3 bg-card shadow-sm">
                      <div className="flex items-center gap-2">
                        <Input
                          className="h-8 font-semibold text-xs flex-1"
                          value={section.name}
                          onChange={(e) => updateSectionName(sIdx, e.target.value)}
                          placeholder="Section Name"
                        />
                        <div className="flex items-center gap-1.5 w-24">
                          <span className="text-[10px] text-muted-foreground shrink-0">Marks:</span>
                          <Input
                            type="number"
                            className="h-8 text-xs font-semibold text-center"
                            value={section.marks}
                            onChange={(e) => updateSectionMarks(sIdx, Number(e.target.value))}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSection(sIdx)}
                          className="text-destructive hover:bg-destructive/10 h-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="pl-3 border-l-2 border-primary/20 space-y-3">
                        {section.questions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className="space-y-2 bg-muted/20 p-2.5 rounded border text-xs"
                          >
                            <div className="flex items-start gap-2">
                              <Input
                                className="h-7 text-xs w-10 shrink-0 text-center font-bold"
                                value={q.number}
                                onChange={(e) => updateQuestionNumber(sIdx, qIdx, e.target.value)}
                              />
                              <Textarea
                                className="text-xs py-1 min-h-[36px] flex-1"
                                value={q.instruction}
                                onChange={(e) =>
                                  updateQuestionInstruction(sIdx, qIdx, e.target.value)
                                }
                                placeholder="Question instruction"
                              />
                              <div className="flex items-center gap-1.5 w-16 shrink-0">
                                <span className="text-[10px] text-muted-foreground">Marks:</span>
                                <Input
                                  type="number"
                                  className="h-7 text-xs text-center"
                                  value={q.marks}
                                  onChange={(e) =>
                                    updateQuestionMarks(sIdx, qIdx, Number(e.target.value))
                                  }
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteQuestion(sIdx, qIdx)}
                                className="text-destructive hover:bg-destructive/10 h-7 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Passage (optional) */}
                            <div className="flex items-center gap-2 pl-12">
                              <span className="text-[10px] text-muted-foreground shrink-0 font-semibold">
                                Passage (opt):
                              </span>
                              <Input
                                className="h-7 text-xs flex-1"
                                value={q.passage || ""}
                                onChange={(e) =>
                                  updateQuestionPassage(sIdx, qIdx, e.target.value || null)
                                }
                                placeholder="Passage text if reading comprehension..."
                              />
                            </div>

                            {/* Sub-questions / Sub-Items */}
                            <div className="pl-12 space-y-2 pt-1">
                              <div className="flex items-center justify-between border-b pb-1">
                                <span className="text-[10px] font-semibold text-muted-foreground">
                                  Sub-Questions / Choices
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addSubQuestion(sIdx, qIdx)}
                                  className="h-6 px-1.5 text-[10px]"
                                >
                                  <Plus className="h-2.5 w-2.5 mr-1" /> Add Sub-Question
                                </Button>
                              </div>

                              {q.subQuestions &&
                                q.subQuestions.map((sq, sqIdx) => (
                                  <div
                                    key={sqIdx}
                                    className="space-y-1.5 bg-muted/30 p-2 rounded border border-dashed"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Input
                                        className="h-6 text-xs w-8 text-center shrink-0 font-bold"
                                        value={sq.label}
                                        onChange={(e) => {
                                          const nextSubQ = [...q.subQuestions];
                                          nextSubQ[sqIdx] = { ...sq, label: e.target.value };
                                          updateQuestionSubQuestions(sIdx, qIdx, nextSubQ);
                                        }}
                                      />
                                      <Input
                                        className="h-6 text-xs flex-1"
                                        value={sq.text}
                                        onChange={(e) =>
                                          updateSubQuestionText(sIdx, qIdx, sqIdx, e.target.value)
                                        }
                                        placeholder="Sub-question / sentence text"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleSubQuestionMCQ(sIdx, qIdx, sqIdx)}
                                        className="h-6 px-1.5 text-[9px]"
                                      >
                                        {sq.options ? "Remove MCQ Options" : "Add MCQ Options"}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSubQuestion(sIdx, qIdx, sqIdx)}
                                        className="text-destructive hover:bg-destructive/10 h-6 px-1.5"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    {/* MCQ Options */}
                                    {sq.options && (
                                      <div className="pl-6 space-y-1.5 border-t pt-1.5 mt-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-semibold text-muted-foreground">
                                            Options List
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addOption(sIdx, qIdx, sqIdx)}
                                            className="h-5 px-1 text-[9px]"
                                          >
                                            <Plus className="h-2 w-2 mr-1" /> Add Option
                                          </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                          {sq.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-1.5">
                                              <span className="text-[9px] text-muted-foreground shrink-0 font-bold">
                                                ({oIdx + 1})
                                              </span>
                                              <Input
                                                className="h-6 text-[10px] flex-1"
                                                value={opt}
                                                onChange={(e) =>
                                                  updateQuestionOption(
                                                    sIdx,
                                                    qIdx,
                                                    sqIdx,
                                                    oIdx,
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder={`Option ${oIdx + 1}`}
                                              />
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  deleteOption(sIdx, qIdx, sqIdx, oIdx)
                                                }
                                                className="text-destructive hover:bg-destructive/10 h-5 px-1"
                                              >
                                                <Trash2 className="h-2.5 w-2.5" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addQuestion(sIdx)}
                          className="w-full text-xs h-8"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Question to{" "}
                          {section.name.split(":")[0]}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : mode === "hhw" && packet && hhwHdr ? (
            <div className="space-y-4">
              {hhwTemplate === "custom" ? (
                <div className="border rounded-xl overflow-hidden bg-white shadow-lg min-h-[800px] flex flex-col">
                  <div className="bg-primary/10 p-3 border-b text-sm font-semibold text-primary flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Custom HTML Holiday Homework Editor
                  </div>
                  <div className="flex-1">
                    <EditorModal
                      value={customHtmlMap["hhw"]}
                      onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, hhw: val })}
                      title="Open Rich Text Editor"
                    />
                  </div>
                </div>
              ) : (
                <HHWView
                  header={hhwHdr}
                  packet={packet}
                  template={hhwTemplate}
                  logoUrl={logoUrl}
                  themeColor={hhwTemplate === "vvip" ? "#8a6d1a" : themeColor}
                  coverImageUrl={coverImageUrl}
                  footer={footer}
                  customConfig={customConfig}
                />
              )}
              <Card className="p-4 no-print space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    ✍️ Edit Holiday Homework
                  </h3>
                  <Button variant="outline" size="sm" onClick={addHHWSubject}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Subject
                  </Button>
                </div>

                {/* Header details editor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-accent/30 p-3 rounded-lg text-xs">
                  <div className="space-y-1">
                    <Label className="text-[10px]">School Name</Label>
                    <Input
                      className="h-7 text-xs"
                      value={hhwHdr.schoolName}
                      onChange={(e) => setHhwHdr({ ...hhwHdr, schoolName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Address</Label>
                    <Input
                      className="h-7 text-xs"
                      value={hhwHdr.schoolAddress}
                      onChange={(e) => setHhwHdr({ ...hhwHdr, schoolAddress: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Class</Label>
                    <Input
                      className="h-7 text-xs"
                      value={hhwHdr.className}
                      onChange={(e) => setHhwHdr({ ...hhwHdr, className: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px]">Packet Title</Label>
                    <Input
                      className="h-7 text-xs"
                      value={packet.title || hhwHdr.title}
                      onChange={(e) => {
                        updateHHWTitle(e.target.value);
                        setHhwHdr({ ...hhwHdr, title: e.target.value });
                      }}
                    />
                  </div>
                </div>

                {/* General Instructions editor */}
                <div className="border rounded-lg p-3 bg-card space-y-2">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      General Instructions
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addGeneralInstruction}
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Instruction
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {packet.generalInstructions.map((ins, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground shrink-0">
                          {i + 1}.
                        </span>
                        <Input
                          className="h-7 text-xs flex-1"
                          value={ins}
                          onChange={(e) => updateGeneralInstruction(i, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGeneralInstruction(i)}
                          className="text-destructive hover:bg-destructive/10 h-7 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjects assignments editor */}
                <div className="space-y-4">
                  {packet.subjects.map((sub, sIdx) => (
                    <div key={sIdx} className="border rounded-lg p-3 bg-card space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 border-b pb-2">
                        <Input
                          className="h-8 font-bold text-xs uppercase flex-1"
                          value={sub.subject}
                          onChange={(e) => updateHHWSubjectName(sIdx, e.target.value)}
                          placeholder="SUBJECT"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHHWSubject(sIdx)}
                          className="text-destructive hover:bg-destructive/10 h-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-[10px] text-muted-foreground shrink-0 font-semibold">
                            Note:
                          </span>
                          <Input
                            className="h-7 text-xs flex-1 italic"
                            value={sub.note || ""}
                            onChange={(e) => updateHHWSubjectNote(sIdx, e.target.value)}
                            placeholder="Subject note (e.g. Practice calculation, language skills...)"
                          />
                        </div>

                        <div className="pl-4 border-l border-primary/20 space-y-2 pt-2">
                          {sub.assignments.map((a, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs">
                              <span className="font-semibold text-muted-foreground w-4 shrink-0 text-right pt-1">
                                {a.number}.
                              </span>
                              <Textarea
                                className="text-xs py-1 min-h-[36px] flex-1"
                                value={a.text}
                                onChange={(e) =>
                                  updateHHWAssignmentText(sIdx, aIdx, e.target.value)
                                }
                                placeholder="Assignment task description"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteHHWAssignment(sIdx, aIdx)}
                                className="text-destructive hover:bg-destructive/10 h-7 px-2 shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addHHWAssignment(sIdx)}
                            className="w-full text-xs h-7 mt-1"
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Assignment to {sub.subject}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : mode === "timetable" ? (
            <div className="space-y-4">
              {ttTemplate === "custom" ? (
                <div className="border rounded-xl overflow-hidden bg-white shadow-lg min-h-[800px] flex flex-col">
                  <div className="bg-primary/10 p-3 border-b text-sm font-semibold text-primary flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Custom HTML Timetable Editor
                  </div>
                  <div className="flex-1">
                    <EditorModal
                      value={customHtmlMap["timetable"]}
                      onChange={(val) => setCustomHtmlMap({ ...customHtmlMap, timetable: val })}
                      title="Open Rich Text Editor"
                    />
                  </div>
                </div>
              ) : (
                <TimetableView
                  header={ttHeader}
                  data={ttData}
                  template={ttTemplate}
                  themeColor={ttTemplate === "vvip" ? "#8a6d1a" : themeColor}
                  logoUrl={logoUrl}
                  footer={footer}
                  customConfig={customConfig}
                />
              )}
              <Card className="p-4 no-print">
                <h3 className="text-sm font-semibold mb-2">Edit Cells (Subject / Teacher)</h3>
                <div className="overflow-x-auto">
                  <table className="text-xs border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-1 bg-muted">Day \ Period</th>
                        {ttPeriods.map((p, i) => (
                          <th key={i} className="border p-1 bg-muted">
                            {p.label}
                            <div className="text-[10px] text-muted-foreground">{p.time}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ttDays.map((d, di) => (
                        <tr key={di}>
                          <th className="border p-1 bg-muted text-left whitespace-nowrap">{d}</th>
                          {ttPeriods.map((_, pi) => {
                            const cell = ttGrid[di]?.[pi] || {
                              subject: "",
                              teacher: "",
                            };
                            return (
                              <td key={pi} className="border p-1 align-top">
                                <Input
                                  className="h-7 text-xs w-28 mb-1"
                                  placeholder="Subject"
                                  value={cell.subject}
                                  onChange={(e) => updateCell(di, pi, "subject", e.target.value)}
                                />
                                <Input
                                  className="h-6 text-[10px] w-28"
                                  placeholder="Teacher"
                                  value={cell.teacher || ""}
                                  onChange={(e) => updateCell(di, pi, "teacher", e.target.value)}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : mode === "resume" ? (
            <div className="space-y-4">
              {(resumeMode === "job" && resumeTemplate === "custom") ||
                (resumeMode === "wedding" && biodataTemplate === "custom") ? (
                <div className="border rounded-xl overflow-hidden bg-white shadow-lg min-h-[800px] flex flex-col">
                  <div className="bg-primary/10 p-3 border-b text-sm font-semibold text-primary flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Custom HTML {resumeMode === "job" ? "Resume" : "Biodata"} Editor
                  </div>
                  <div className="flex-1">
                    <EditorModal
                      value={
                        resumeMode === "job" ? customHtmlMap["resume"] : customHtmlMap["biodata"]
                      }
                      onChange={(val) =>
                        setCustomHtmlMap({
                          ...customHtmlMap,
                          [resumeMode === "job" ? "resume" : "biodata"]: val,
                        })
                      }
                      title="Open Rich Text Editor"
                    />
                  </div>
                </div>
              ) : (
                <ResumeView
                  mode={resumeMode}
                  resumeData={resumeData}
                  biodataData={biodataData}
                  template={resumeMode === "job" ? resumeTemplate : biodataTemplate}
                  themeColor={themeColor}
                  logoUrl={logoUrl}
                  footer={footer}
                  customConfig={customConfig}
                />
              )}
            </div>
          ) : mode === "saved" ? (
            <div className="space-y-4 no-print">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      My Saved Templates
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Load or delete your previously saved CKEditor templates.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSavedTemplates}
                    disabled={savedTemplatesLoading}
                  >
                    Refresh
                  </Button>
                </div>

                <div className="mt-4 space-y-4">
                  {savedTemplatesLoading && savedTemplates.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : savedTemplates.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No saved templates found. Use the "Save to Database" button after generating a document.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedTemplates.map((tpl: any) => (
                        <Card key={tpl.id} className="p-4 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                                {tpl.mode}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(tpl.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-semibold text-sm line-clamp-2">{tpl.title}</h4>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="flex-1" onClick={() => handleLoadTemplate(tpl)}>
                              Load & Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTemplate(tpl.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : mode === "admin" ? (
            <div className="space-y-4 no-print">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                      📋 Activity & Audit Logs
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Real-time generation audit logs for exam papers and holiday homework.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAdminData}
                    disabled={adminLoading}
                  >
                    Refresh Logs
                  </Button>
                </div>

                <div className="mt-4 space-y-4">
                  {adminLoading && logs.length === 0 ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No logs found. Generating exams or homework will populate this audit trail.
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-muted/50 border-b">
                              <th className="p-3 font-semibold text-muted-foreground w-[180px]">
                                Timestamp
                              </th>
                              <th className="p-3 font-semibold text-muted-foreground w-[200px]">
                                User
                              </th>
                              <th className="p-3 font-semibold text-muted-foreground w-[120px]">
                                Action
                              </th>
                              <th className="p-3 font-semibold text-muted-foreground">
                                Details / Parameters
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {logs.map((log) => (
                              <tr key={log.id} className="hover:bg-accent/20 transition-colors">
                                <td className="p-3 font-medium whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-3 font-medium text-foreground break-all">
                                  {log.userEmail}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${log.action?.includes("exam")
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                                      }`}
                                  >
                                    {log.action}
                                  </span>
                                </td>
                                <td className="p-3 text-muted-foreground font-mono text-[11px] whitespace-pre-wrap break-all max-w-[400px]">
                                  {log.details}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center text-muted-foreground no-print">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                Fill the form and click <strong>Generate</strong>. Your{" "}
                {mode === "exam" ? "exam paper" : "holiday homework"} will appear here, ready to
                print or download.
              </p>
            </Card>
          )}
        </div>
      </main>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Template to Database</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                placeholder="e.g. Midterm English Exam"
                value={saveTemplateTitle}
                onChange={(e) => setSaveTemplateTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTemplate();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveTemplate} disabled={isSavingTemplate}>
              {isSavingTemplate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
