// import React, { useState, useEffect, useCallback } from "react";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
// import { Badge } from "../../components/ui/badge";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { Textarea } from "../../components/ui/textarea";
// import { Checkbox } from "../../components/ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { Avatar, AvatarFallback } from "../../components/ui/avatar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Users,
//   UserCheck,
//   Clock,
//   Edit2,
//   Eye,
//   DollarSign,
//   Save,
//   User,
//   Phone,
//   MapPin,
//   IndianRupee,
//   Tag,
//   Calendar,
//   BookOpen,
//   Trash2,
//   Plus,
//   Upload,
//   Download,
//   Search,
//   Filter,
//   Loader2,
//   RefreshCw,
//   AlertTriangle,
//   X,
// } from "lucide-react";
// import { toast } from "react-toastify";

// const BASE_URL = "https://crm-software-for-eduhawk-2.onrender.com/api";

// // ─── Constants ───────────────────────────────────────────────────────────────

// const LEAD_TAGS = {
//   Hot: { label: "Hot", variant: "destructive" },
//   Warm: { label: "Warm", variant: "default" },
//   Cold: { label: "Cold", variant: "secondary" },
// };

// const STATUS_OPTIONS = [
//   "New",
//   "Interested",
//   "Call Back",
//   "Not Interested",
//   "Converted",
//   "Dropped",
// ];

// const LEAD_TAG_OPTIONS = ["Hot", "Warm", "Cold"];

// const PROGRESS_FIELDS = [
//   {
//     id: "registrationFeePaid",
//     label: "Registration Fee Paid",
//     group: "regdocs",
//   },
//   { id: "documentsSubmitted", label: "Documents Submitted", group: "regdocs" },
//   {
//     id: "admissionLetterIssued",
//     label: "Admission Letter Issued",
//     group: "admission",
//   },
//   { id: "visaApplied", label: "Visa Applied", group: "visa" },
//   { id: "visaIssued", label: "Visa Issued", group: "visa" },
//   { id: "ticketBooked", label: "Ticket Booked", group: "visa" },
//   { id: "departureStatus", label: "Departed", group: "visa" },
// ];

// const EMPTY_LEAD = {
//   name: "",
//   phone: "",
//   parentName: "",
//   city: "",
//   email: "",
//   neetStatus: "",
//   budget: "",
//   preferredCountry: "",
//   collegeName: "",
//   emergencyContact: "",
//   serviceManager: "",
//   status: "New",
//   leadTag: "Warm",
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const fmtDate = (iso) => {
//   if (!iso) return "—";
//   try {
//     return new Date(iso).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   } catch {
//     return iso;
//   }
// };

// const initials = (name = "") =>
//   name
//     .split(" ")
//     .filter(Boolean)
//     .map((n) => n[0].toUpperCase())
//     .join("")
//     .slice(0, 2) || "??";

// const authHeader = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("authToken")}`,
// });

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const StatCard = ({ label, count, color, icon }) => (
//   <Card>
//     <CardContent className="p-6 flex items-center gap-4">
//       <div className={`p-3 ${color} rounded-xl`}>{icon}</div>
//       <div>
//         <p className="text-3xl font-semibold text-slate-900">{count}</p>
//         <p className="text-sm text-slate-500">{label}</p>
//       </div>
//     </CardContent>
//   </Card>
// );

// const StatusBadge = ({ status }) => {
//   const map = {
//     New: "bg-blue-100 text-blue-800",
//     Interested: "bg-amber-100 text-amber-800",
//     "Call Back": "bg-orange-100 text-orange-800",
//     Converted: "bg-emerald-100 text-emerald-800",
//     Dropped: "bg-red-100 text-red-800",
//     "Not Interested": "bg-slate-100 text-slate-600",
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] || "bg-slate-100 text-slate-600"}`}
//     >
//       {status}
//     </span>
//   );
// };

// const TagBadge = ({ tag }) => {
//   const map = {
//     Hot: "bg-red-100 text-red-800",
//     Warm: "bg-amber-100 text-amber-800",
//     Cold: "bg-blue-100 text-blue-800",
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[tag] || "bg-slate-100 text-slate-600"}`}
//     >
//       {tag}
//     </span>
//   );
// };

// // ─── Lead Form (Add / Edit) ───────────────────────────────────────────────────

// const LeadForm = ({
//   initial = EMPTY_LEAD,
//   onSave,
//   onCancel,
//   loading,
//   employees = [],
// }) => {
//   const [form, setForm] = useState({ ...EMPTY_LEAD, ...initial });

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   const field = (label, key, type = "text", required = false) => (
//     <div>
//       <Label className="text-xs text-muted-foreground mb-1 block">
//         {label}
//         {required && <span className="text-red-500 ml-0.5">*</span>}
//       </Label>
//       <Input
//         type={type}
//         value={form[key] || ""}
//         onChange={(e) => set(key, e.target.value)}
//         className="h-9 text-sm"
//       />
//     </div>
//   );

//   return (
//     <div className="space-y-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {field("Student name", "name", "text", true)}
//         {field("Phone", "phone", "tel", true)}
//         {field("Parent name", "parentName")}
//         {field("City", "city")}
//         {field("Email", "email", "email")}
//         {field("Budget (₹)", "budget", "number")}
//         {field("College name", "collegeName")}
//         {field("Preferred country", "preferredCountry")}
//         {field("NEET status", "neetStatus")}
//         {field("Emergency contact", "emergencyContact")}
//         {field("Service manager", "serviceManager")}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Label className="text-xs text-muted-foreground mb-1 block">
//             Status
//           </Label>
//           <Select value={form.status} onValueChange={(v) => set("status", v)}>
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {STATUS_OPTIONS.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-xs text-muted-foreground mb-1 block">
//             Lead tag
//           </Label>
//           <Select value={form.leadTag} onValueChange={(v) => set("leadTag", v)}>
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {LEAD_TAG_OPTIONS.map((t) => (
//                 <SelectItem key={t} value={t}>
//                   {t}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-xs text-muted-foreground mb-1 block">
//             Assign telecaller
//           </Label>
//           <Select
//             value={form.assignedToTelecaller || "none"}
//             onValueChange={(v) =>
//               set("assignedToTelecaller", v === "none" ? "" : v)
//             }
//           >
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue placeholder="Select telecaller" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">None</SelectItem>
//               {employees
//                 .filter(
//                   (e) => e.role === "Telecaller" || e.role === "telecaller",
//                 )
//                 .map((e) => (
//                   <SelectItem key={e._id} value={e._id}>
//                     {e.name}
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-xs text-muted-foreground mb-1 block">
//             Assign counsellor
//           </Label>
//           <Select
//             value={form.assignedToCounsellor || "none"}
//             onValueChange={(v) =>
//               set("assignedToCounsellor", v === "none" ? "" : v)
//             }
//           >
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue placeholder="Select counsellor" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">None</SelectItem>
//               {employees
//                 .filter(
//                   (e) => e.role === "Counsellor" || e.role === "counsellor",
//                 )
//                 .map((e) => (
//                   <SelectItem key={e._id} value={e._id}>
//                     {e.name}
//                   </SelectItem>
//                 ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label className="text-xs text-muted-foreground mb-1 block">
//             Follow-up date
//           </Label>
//           <Input
//             type="date"
//             value={form.followUpDate ? form.followUpDate.split("T")[0] : ""}
//             onChange={(e) => set("followUpDate", e.target.value)}
//             className="h-9 text-sm"
//           />
//         </div>
//       </div>

//       <div className="flex justify-end gap-3 pt-2">
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button
//           onClick={() => onSave(form)}
//           disabled={loading}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white"
//         >
//           {loading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save lead
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// };

// // ─── Progress Panel ───────────────────────────────────────────────────────────

// const ProgressPanel = ({ lead, onSave, onCancel, saving }) => {
//   const [data, setData] = useState(() => {
//     const d = {};
//     PROGRESS_FIELDS.forEach((f) => {
//       d[f.id] = lead[f.id] || false;
//     });
//     d.departureDate = lead.departureDate
//       ? lead.departureDate.split("T")[0]
//       : "";
//     d.remarks = lead.progressRemarks || "";
//     return d;
//   });

//   const toggle = (id, v) => setData((p) => ({ ...p, [id]: v }));

//   const groups = [
//     {
//       key: "regdocs",
//       title: "Registration & documents",
//       icon: <DollarSign className="h-4 w-4 text-emerald-600" />,
//     },
//     {
//       key: "admission",
//       title: "Admission process",
//       icon: <BookOpen className="h-4 w-4 text-blue-600" />,
//     },
//     {
//       key: "visa",
//       title: "Visa & departure",
//       icon: <Calendar className="h-4 w-4 text-purple-600" />,
//     },
//   ];

//   const done = PROGRESS_FIELDS.filter((f) => data[f.id]).length;
//   const pct = Math.round((done / PROGRESS_FIELDS.length) * 100);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3 mb-2">
//         <div className="flex-1 bg-slate-100 rounded-full h-2">
//           <div
//             className="bg-indigo-500 h-2 rounded-full transition-all"
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//         <span className="text-sm font-medium text-slate-700">
//           {pct}% complete
//         </span>
//       </div>

//       {groups.map(({ key, title, icon }) => (
//         <div key={key}>
//           <h3 className="font-medium text-sm flex items-center gap-2 mb-3 text-slate-700">
//             {icon}
//             {title}
//           </h3>
//           <div className="space-y-2.5 pl-6">
//             {PROGRESS_FIELDS.filter((f) => f.group === key).map((item) => (
//               <div key={item.id} className="flex items-center gap-3">
//                 <Checkbox
//                   id={item.id}
//                   checked={data[item.id]}
//                   onCheckedChange={(v) => toggle(item.id, v)}
//                 />
//                 <Label htmlFor={item.id} className="cursor-pointer text-sm">
//                   {item.label}
//                 </Label>
//               </div>
//             ))}
//             {key === "visa" && (
//               <div className="mt-2">
//                 <Label className="text-xs text-muted-foreground mb-1 block">
//                   Departure date
//                 </Label>
//                 <Input
//                   type="date"
//                   value={data.departureDate || ""}
//                   onChange={(e) =>
//                     setData((p) => ({ ...p, departureDate: e.target.value }))
//                   }
//                   className="h-8 text-sm max-w-xs"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       ))}

//       <div>
//         <Label className="text-sm">Remarks / notes</Label>
//         <Textarea
//           value={data.remarks}
//           onChange={(e) => setData((p) => ({ ...p, remarks: e.target.value }))}
//           placeholder="Any observations, issues, next steps..."
//           className="mt-1.5 min-h-24 text-sm"
//         />
//       </div>

//       <div className="flex justify-end gap-3">
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button
//           onClick={() => onSave(data)}
//           disabled={saving}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white"
//         >
//           {saving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save progress
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// };

// // ─── Student Details View ─────────────────────────────────────────────────────

// const StudentDetails = ({ student }) => {
//   if (!student) return null;
//   const rows = [
//     ["Phone", student.phone],
//     ["Parent name", student.parentName],
//     ["City", student.city],
//     ["Email", student.email],
//     [
//       "Budget",
//       student.budget
//         ? `₹${Number(student.budget).toLocaleString("en-IN")}`
//         : null,
//     ],
//     ["NEET status", student.neetStatus],
//     ["Preferred country", student.preferredCountry],
//     ["College", student.collegeName],
//     ["Emergency contact", student.emergencyContact],
//     ["Service manager", student.serviceManager],
//     ["Follow-up date", fmtDate(student.followUpDate)],
//     ["Telecaller", student.assignedToTelecaller?.name],
//     ["Counsellor", student.assignedToCounsellor?.name],
//     ["Created", fmtDate(student.createdAt)],
//   ];

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border">
//         <Avatar className="h-16 w-16 border-4 border-white shadow">
//           <AvatarFallback className="bg-indigo-500 text-white text-xl font-bold">
//             {initials(student.name)}
//           </AvatarFallback>
//         </Avatar>
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">
//             {student.name || "—"}
//           </h2>
//           <p className="text-slate-500 text-sm mt-0.5">
//             {student.email || "—"}
//           </p>
//           <div className="flex items-center gap-2 mt-1.5">
//             <StatusBadge status={student.status} />
//             <TagBadge tag={student.leadTag} />
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//         {rows.map(([label, value]) => (
//           <div key={label} className="flex flex-col">
//             <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
//               {label}
//             </span>
//             <span className="font-medium mt-0.5 text-slate-800">
//               {value || "—"}
//             </span>
//           </div>
//         ))}
//       </div>
//       {student.remarks?.length > 0 && (
//         <div>
//           <h3 className="text-sm font-medium text-slate-700 mb-2">
//             Remarks history
//           </h3>
//           <div className="space-y-2 max-h-48 overflow-y-auto">
//             {[...student.remarks].reverse().map((r, i) => (
//               <div
//                 key={i}
//                 className="bg-slate-50 border rounded-lg p-3 text-sm"
//               >
//                 <p className="text-slate-700">{r.text}</p>
//                 <p className="text-xs text-slate-400 mt-1">
//                   {r.by?.name || "—"} · {fmtDate(r.date)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Bulk Upload Section ──────────────────────────────────────────────────────

// const BulkUpload = ({ onDone }) => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleUpload = async () => {
//     if (!file) {
//       toast.error("Please select a file");
//       return;
//     }
//     const fd = new FormData();
//     fd.append("file", file);
//     try {
//       setUploading(true);
//       setResult(null);
//       const res = await fetch(`${BASE_URL}/leads/bulk-upload`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: fd,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Upload failed");
//       setResult(data);
//       toast.success(`Imported ${data.imported} leads!`);
//       onDone?.();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div
//         className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
//         onClick={() => document.getElementById("bulk-file-input").click()}
//       >
//         <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
//         <p className="text-sm font-medium text-slate-700">
//           {file ? file.name : "Click to select file"}
//         </p>
//         <p className="text-xs text-slate-400 mt-1">
//           Supports .xlsx, .xls, .csv
//         </p>
//         <input
//           id="bulk-file-input"
//           type="file"
//           accept=".xlsx,.xls,.csv"
//           className="hidden"
//           onChange={(e) => {
//             setFile(e.target.files[0]);
//             setResult(null);
//           }}
//         />
//       </div>

//       {file && (
//         <div className="flex items-center justify-between bg-slate-50 border rounded-lg px-4 py-2.5 text-sm">
//           <span className="text-slate-700 font-medium">{file.name}</span>
//           <button
//             onClick={() => setFile(null)}
//             className="text-slate-400 hover:text-red-500"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {result && (
//         <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm space-y-1">
//           <p className="font-medium text-emerald-800">Upload complete</p>
//           <p className="text-emerald-700">Total rows: {result.totalRows}</p>
//           <p className="text-emerald-700">Imported: {result.imported}</p>
//           <p className="text-slate-500">
//             Skipped (duplicates/invalid): {result.skipped}
//           </p>
//         </div>
//       )}

//       <div className="flex gap-3">
//         <Button
//           onClick={handleUpload}
//           disabled={!file || uploading}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white"
//         >
//           {uploading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Uploading...
//             </>
//           ) : (
//             <>
//               <Upload className="mr-2 h-4 w-4" />
//               Upload leads
//             </>
//           )}
//         </Button>
//         <a
//           href="/sample_leads_template.xlsx"
//           download
//           className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 text-slate-600"
//         >
//           <Download className="h-4 w-4" />
//           Download template
//         </a>
//       </div>
//     </div>
//   );
// };

// // ─── Delete Confirm Dialog ────────────────────────────────────────────────────

// const DeleteConfirm = ({ lead, onConfirm, onCancel, deleting }) => (
//   <div className="space-y-5">
//     <div className="flex items-start gap-4 bg-red-50 p-4 rounded-xl border border-red-100">
//       <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
//       <div>
//         <p className="font-medium text-red-800">Delete this lead?</p>
//         <p className="text-sm text-red-600 mt-1">
//           <strong>{lead?.name}</strong> ({lead?.phone}) will be permanently
//           removed. This cannot be undone.
//         </p>
//       </div>
//     </div>
//     <div className="flex justify-end gap-3">
//       <Button variant="outline" onClick={onCancel}>
//         Cancel
//       </Button>
//       <Button
//         onClick={onConfirm}
//         disabled={deleting}
//         className="bg-red-600 hover:bg-red-700 text-white"
//       >
//         {deleting ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Deleting...
//           </>
//         ) : (
//           <>
//             <Trash2 className="mr-2 h-4 w-4" />
//             Delete lead
//           </>
//         )}
//       </Button>
//     </div>
//   </div>
// );

// // ─── Main Admin Component ─────────────────────────────────────────────────────

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("all");

//   // Data
//   const [leads, setLeads] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [callLogs, setCallLogs] = useState([]);
//   const [dashboardSummary, setDashboardSummary] = useState(null);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Filters & pagination
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterTag, setFilterTag] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 1000;

//   // Modals
//   const [detailModal, setDetailModal] = useState(null);
//   const [editModal, setEditModal] = useState(null);
//   const [addModal, setAddModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(null);
//   const [progressModal, setProgressModal] = useState(null);
//   const [remarkModal, setRemarkModal] = useState(null);
//   const [bulkModal, setBulkModal] = useState(false);
//   const [assignModal, setAssignModal] = useState(null);

//   // Saving states
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [assigning, setAssigning] = useState(false);

//   // Remark form
//   const [remark, setRemark] = useState("");
//   const [moveToStatus, setMoveToStatus] = useState("");
//   const [savingRemark, setSavingRemark] = useState(false);

//   // Assign form
//   const [assignTelecaller, setAssignTelecaller] = useState("");
//   const [assignCounsellor, setAssignCounsellor] = useState("");

//   // ── Fetch ───────────────────────────────────────────────────────────────

//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page,
//         limit,
//         ...(search && { search }),
//         ...(filterStatus && { status: filterStatus }),
//         ...(filterTag && { leadTag: filterTag }),
//       });
//       const res = await fetch(`${BASE_URL}/leads?${params}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setLeads(data.data || []);
//       setTotal(data.total || 0);
//     } catch (err) {
//       toast.error("Failed to load leads");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, filterStatus, filterTag]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/employees`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       setEmployees(data.data || data || []);
//     } catch {
//       /* silent */
//     }
//     console.log(setEmployees);
//   };

//   const fetchDashboardSummary = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/dashboard`, {
//         headers: authHeader(),
//       });
//       const data = await res.json();
//       if (!res.ok)
//         throw new Error(data.message || "Failed to fetch dashboard summary");
//       setDashboardSummary(data.data || data || null);
//     } catch (err) {
//       console.error("Dashboard summary fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const refreshAll = useCallback(async () => {
//     await Promise.all([fetchLeads(), fetchDashboardSummary()]);
//   }, [fetchLeads, fetchDashboardSummary]);

//   const fetchCallLogs = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams({
//         page,
//         limit,
//         ...(search && { search }),
//         ...(filterStatus && { status: filterStatus }),
//       });
//       const res = await fetch(`${BASE_URL}/ivr/calls?${params}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch");
//       const data = await res.json();
//       setCallLogs(data.data || []);
//       setTotal(data.total || 0);
//     } catch (err) {
//       toast.error("Failed to load call logs");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, filterStatus]);

//   useEffect(() => {
//     fetchLeads();
//     fetchDashboardSummary();
//   }, [fetchLeads, fetchDashboardSummary]);
//   useEffect(() => {
//     fetchEmployees();
//   }, []);
//   useEffect(() => {
//     if (activeTab === "calls") {
//       fetchCallLogs();
//     }
//   }, [activeTab, fetchCallLogs]);

//   // Reset page on filter change
//   useEffect(() => {
//     setPage(1);
//   }, [search, filterStatus, filterTag]);

//   // ── CRUD Handlers ────────────────────────────────────────────────────────

//   const handleAddLead = async (form) => {
//     if (!form.name || !form.phone) {
//       toast.error("Name and phone are required");
//       return;
//     }
//     try {
//       setSaving(true);
//       const res = await fetch(`${BASE_URL}/leads`, {
//         method: "POST",
//         headers: authHeader(),
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to add");
//       toast.success("Lead added successfully!");
//       setAddModal(false);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handletelecaller = async (form) => {
//     if (!form.name || !form.phone) {
//       toast.error("Name and phone are required");
//       return;
//     }
//     try {
//       setSaving(true);
//       const res = await fetch(`${BASE_URL}/leads/telecaller`, {
//         method: "POST",
//         headers: authHeader(),
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to add");
//       toast.success("Lead added successfully!");
//       setAddModal(false);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCounsellor = async (form) => {
//     if (!form.name || !form.phone) {
//       toast.error("Name and phone are required");
//       return;
//     }
//     try {
//       setSaving(true);
//       const res = await fetch(`${BASE_URL}/leads/counsellor`, {
//         method: "POST",
//         headers: authHeader(),
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to add");
//       toast.success("Lead added successfully!");
//       setAddModal(false);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditLead = async (form) => {
//     if (!form.name || !form.phone) {
//       toast.error("Name and phone are required");
//       return;
//     }
//     try {
//       setSaving(true);
//       const res = await fetch(`${BASE_URL}/leads/${editModal._id}`, {
//         method: "PUT",
//         headers: authHeader(),
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update");
//       toast.success("Lead updated!");
//       setEditModal(null);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setDeleting(true);
//       const res = await fetch(`${BASE_URL}/leads/${deleteModal._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Delete failed");
//       }
//       toast.success("Lead deleted");
//       setDeleteModal(null);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleSaveProgress = async (data) => {
//     try {
//       setSaving(true);
//       const { remarks, departureDate, ...checkboxes } = data;
//       const res = await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
//         method: "PUT",
//         headers: authHeader(),
//         body: JSON.stringify({
//           ...checkboxes,
//           ...(departureDate && { departureDate }),
//           progressRemarks: remarks,
//         }),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Save failed");
//       }
//       toast.success("Progress saved!");
//       setProgressModal(null);
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveRemark = async () => {
//     if (!remark.trim()) {
//       toast.error("Please write a remark");
//       return;
//     }
//     try {
//       setSavingRemark(true);
//       const body = {
//         lastRemark: remark.trim(),
//         lastFollowUp: new Date().toISOString(),
//         ...(moveToStatus && { status: moveToStatus }),
//       };
//       const res = await fetch(`${BASE_URL}/leads/${remarkModal._id}`, {
//         method: "PUT",
//         headers: authHeader(),
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Save failed");
//       }
//       toast.success("Remark saved!");
//       setRemarkModal(null);
//       setRemark("");
//       setMoveToStatus("");
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSavingRemark(false);
//     }
//   };

//   const handleAssign = async () => {
//     if (!assignModal) {
//       toast.error("No lead selected for assignment.");
//       return;
//     }

//     if (!assignTelecaller && !assignCounsellor) {
//       toast.error("Select a telecaller or counsellor before assigning.");
//       return;
//     }

//     try {
//       setAssigning(true);
//       const body = {};
//       if (assignTelecaller) body.assignedToTelecaller = assignTelecaller;
//       if (assignCounsellor) body.assignedToCounsellor = assignCounsellor;
//       const res = await fetch(`${BASE_URL}/leads/${assignModal._id}`, {
//         method: "PUT",
//         headers: authHeader(),
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Assign failed");
//       }
//       toast.success("Lead assigned!");
//       setAssignModal(null);
//       setAssignTelecaller("");
//       setAssignCounsellor("");
//       fetchLeads();
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const openAssignModal = (lead) => {
//     setAssignTelecaller(lead.assignedToTelecaller?._id || "");
//     setAssignCounsellor(lead.assignedToCounsellor?._id || "");
//     setAssignModal(lead);
//   };

//   // ── Stats ────────────────────────────────────────────────────────────────

//   const stats = {
//     total: dashboardSummary?.totalLeads ?? leads.length,
//     hot:
//       dashboardSummary?.hotLeads ??
//       leads.filter((l) => l.leadTag === "Hot").length,
//     warm:
//       dashboardSummary?.warmLeads ??
//       leads.filter((l) => l.leadTag === "Warm").length,
//     cold:
//       dashboardSummary?.coldLeads ??
//       leads.filter((l) => l.leadTag === "Cold").length,
//     converted:
//       dashboardSummary?.converted ??
//       leads.filter((l) => l.status === "Converted").length,
//     followUp:
//       dashboardSummary?.pendingFollowUps ??
//       leads.filter((l) => l.status === "Call Back").length,
//     admissionsInProgress:
//       dashboardSummary?.admissionsInProgress ??
//       leads.filter((l) => l.status === "Converted" && !l.registrationFeePaid)
//         .length,
//     visaPending:
//       dashboardSummary?.visaPending ??
//       leads.filter((l) => l.visaApplied && !l.visaIssued).length,
//   };

//   // ── Tab filter ───────────────────────────────────────────────────────────

//   const tabLeads =
//     activeTab === "all"
//       ? leads
//       : activeTab === "new"
//         ? leads.filter((l) => l.status === "New")
//         : activeTab === "interested"
//           ? leads.filter((l) => l.status === "Interested")
//           : activeTab === "followup"
//             ? leads.filter((l) => l.status === "Call Back")
//             : activeTab === "converted"
//               ? leads.filter((l) => l.status === "Converted")
//               : activeTab === "dropped"
//                 ? leads.filter((l) =>
//                     ["Dropped", "Not Interested"].includes(l.status),
//                   )
//                 : leads;

//   const activeTabLabel =
//     {
//       all: "All leads",
//       new: "New leads",
//       interested: "Interested leads",
//       followup: "Follow-up leads",
//       converted: "Converted leads",
//       dropped: "Dropped / Not interested",
//     }[activeTab] || "All leads";

//   const quickAssignLead = tabLeads.find(
//     (l) => !l.assignedToTelecaller && !l.assignedToCounsellor,
//   );

//   const openQuickAssign = () => {
//     if (!quickAssignLead) {
//       toast.info("No unassigned leads available in this view.");
//       return;
//     }
//     openAssignModal(quickAssignLead);
//   };

//   const handleQuickFollowUp = () => {
//     if (activeTab !== "followup") {
//       setActiveTab("followup");
//       return;
//     }
//     const nextFollowUp = tabLeads[0];
//     if (!nextFollowUp) {
//       toast.info("No follow-up leads available.");
//       return;
//     }
//     setDetailModal(nextFollowUp);
//   };

//   // ── Table ────────────────────────────────────────────────────────────────

//   const renderTable = (data) => (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-10"></TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Phone</TableHead>
//             <TableHead>City</TableHead>
//             <TableHead>Budget</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Tag</TableHead>
//             <TableHead>Telecaller</TableHead>
//             <TableHead>Counsellor</TableHead>
//             <TableHead>Follow-up</TableHead>
//             <TableHead className="text-center min-w-[280px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             <TableRow>
//               <TableCell colSpan={11} className="text-center py-16">
//                 <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
//               </TableCell>
//             </TableRow>
//           ) : data.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={11}
//                 className="text-center py-16 text-slate-400 text-sm"
//               >
//                 No leads found
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((lead) => (
//               <TableRow key={lead._id} className="hover:bg-muted/50">
//                 <TableCell>
//                   <Avatar className="h-8 w-8">
//                     <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-medium">
//                       {initials(lead.name)}
//                     </AvatarFallback>
//                   </Avatar>
//                 </TableCell>
//                 <TableCell className="font-medium text-sm">
//                   {lead.name}
//                 </TableCell>
//                 <TableCell className="font-mono text-xs text-slate-500">
//                   {lead.phone}
//                 </TableCell>
//                 <TableCell className="text-sm">{lead.city || "—"}</TableCell>
//                 <TableCell className="text-sm font-medium">
//                   {lead.budget
//                     ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
//                     : "—"}
//                 </TableCell>
//                 <TableCell>
//                   <StatusBadge status={lead.status} />
//                 </TableCell>
//                 <TableCell>
//                   <TagBadge tag={lead.leadTag} />
//                 </TableCell>
//                 <TableCell className="text-xs text-slate-500">
//                   {lead.assignedToTelecaller?.name || (
//                     <span className="text-slate-300">Unassigned</span>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-xs text-slate-500">
//                   {lead.assignedToCounsellor?.name || (
//                     <span className="text-slate-300">Unassigned</span>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-xs text-slate-500">
//                   {fmtDate(lead.followUpDate)}
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex flex-wrap gap-1.5 justify-center">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2"
//                       onClick={() => setDetailModal(lead)}
//                     >
//                       <Eye className="h-3 w-3 mr-1" />
//                       Details
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2"
//                       onClick={() => setEditModal(lead)}
//                     >
//                       <Edit2 className="h-3 w-3 mr-1" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2"
//                       onClick={() => setProgressModal(lead)}
//                     >
//                       <BookOpen className="h-3 w-3 mr-1" />
//                       Progress
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2"
//                       onClick={() => {
//                         setRemark("");
//                         setMoveToStatus("");
//                         setRemarkModal(lead);
//                       }}
//                     >
//                       <Edit2 className="h-3 w-3 mr-1" />
//                       Remark
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2"
//                       onClick={() => openAssignModal(lead)}
//                     >
//                       <User className="h-3 w-3 mr-1" />
//                       Assign
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="h-7 text-xs px-2 text-red-600 hover:bg-red-50 hover:border-red-200"
//                       onClick={() => setDeleteModal(lead)}
//                     >
//                       <Trash2 className="h-3 w-3 mr-1" />
//                       Delete
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );

//   const renderCallLogsTable = () => (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Phone</TableHead>
//             <TableHead>Department</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Duration</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Recording</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             <TableRow>
//               <TableCell colSpan={6} className="text-center py-16">
//                 <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
//               </TableCell>
//             </TableRow>
//           ) : callLogs.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={6}
//                 className="text-center py-16 text-slate-400 text-sm"
//               >
//                 No call logs found
//               </TableCell>
//             </TableRow>
//           ) : (
//             callLogs.map((log) => (
//               <TableRow key={log._id} className="hover:bg-muted/50">
//                 <TableCell className="font-mono text-xs text-slate-500">
//                   {log.phone}
//                 </TableCell>
//                 <TableCell className="text-sm">{log.department}</TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       log.callStatus === "completed" ? "default" : "secondary"
//                     }
//                   >
//                     {log.callStatus}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-sm">
//                   {log.duration
//                     ? `${Math.floor(log.duration / 60)}:${(log.duration % 60).toString().padStart(2, "0")}`
//                     : "—"}
//                 </TableCell>
//                 <TableCell className="text-xs text-slate-500">
//                   {fmtDate(log.createdAt)}
//                 </TableCell>
//                 <TableCell>
//                   {log.recordingUrl ? (
//                     <audio controls className="h-8">
//                       <source src={log.recordingUrl} type="audio/mpeg" />
//                       Your browser does not support the audio element.
//                     </audio>
//                   ) : (
//                     <span className="text-slate-300 text-xs">No recording</span>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );

//   // ── Render ───────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-8 space-y-8">
//       {/* Page header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Admin Dashboard
//           </h1>
//           <p className="text-slate-500 mt-1">
//             Full lead management &amp; team assignment
//           </p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Button
//             variant="outline"
//             onClick={fetchLeads}
//             className="h-9 text-sm"
//           >
//             <RefreshCw className="h-4 w-4 mr-1.5" />
//             Refresh
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => setBulkModal(true)}
//             className="h-9 text-sm"
//           >
//             <Upload className="h-4 w-4 mr-1.5" />
//             Bulk upload
//           </Button>
//           <Button
//             onClick={() => setAddModal(true)}
//             className="h-9 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
//           >
//             <Plus className="h-4 w-4 mr-1.5" />
//             Add lead
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
//                 Quick actions
//               </p>
//               <h2 className="text-xl font-semibold text-slate-900">
//                 {activeTabLabel} — {tabLeads.length} lead
//                 {tabLeads.length !== 1 ? "s" : ""}
//               </h2>
//               <p className="text-sm text-slate-500 max-w-2xl">
//                 Use these quick actions to keep your admin workflow fast and
//                 dynamic.
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 className="h-9 text-sm"
//                 onClick={refreshAll}
//               >
//                 <RefreshCw className="h-4 w-4 mr-1.5" />
//                 Refresh leads
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-9 text-sm"
//                 onClick={handleQuickFollowUp}
//               >
//                 <Clock className="h-4 w-4 mr-1.5" />
//                 {activeTab === "followup"
//                   ? "Open follow-up"
//                   : "Go to follow-ups"}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="h-9 text-sm"
//                 onClick={openQuickAssign}
//               >
//                 <UserCheck className="h-4 w-4 mr-1.5" />
//                 Quick assign
//               </Button>
//               <Button
//                 onClick={() => setAddModal(true)}
//                 className="h-9 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
//               >
//                 <Plus className="h-4 w-4 mr-1.5" />
//                 Create lead
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats */}
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Total leads",
//               count: stats.total,
//               color: "bg-slate-100",
//               icon: <Users className="h-6 w-6 text-slate-600" />,
//             },
//             {
//               label: "Hot leads",
//               count: stats.hot,
//               color: "bg-red-100",
//               icon: <Tag className="h-6 w-6 text-red-600" />,
//             },
//             {
//               label: "Converted",
//               count: stats.converted,
//               color: "bg-emerald-100",
//               icon: <UserCheck className="h-6 w-6 text-emerald-600" />,
//             },
//             {
//               label: "Pending follow-up",
//               count: stats.followUp,
//               color: "bg-orange-100",
//               icon: <Clock className="h-6 w-6 text-orange-600" />,
//             },
//           ].map((s) => (
//             <StatCard key={s.label} {...s} />
//           ))}
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             {
//               label: "Admission in progress",
//               count: stats.admissionsInProgress,
//               color: "bg-blue-100",
//               icon: <BookOpen className="h-6 w-6 text-blue-600" />,
//             },
//             {
//               label: "Visa pending",
//               count: stats.visaPending,
//               color: "bg-indigo-100",
//               icon: <MapPin className="h-6 w-6 text-indigo-600" />,
//             },
//             {
//               label: "Warm leads",
//               count: stats.warm,
//               color: "bg-amber-100",
//               icon: <Tag className="h-6 w-6 text-amber-600" />,
//             },
//             {
//               label: "Cold leads",
//               count: stats.cold,
//               color: "bg-sky-100",
//               icon: <Users className="h-6 w-6 text-sky-600" />,
//             },
//           ].map((s) => (
//             <StatCard key={s.label} {...s} />
//           ))}
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Team login & session details</CardTitle>
//           <CardDescription>
//             Telecaller and counsellor login, logout and session time.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm">
//             <thead>
//               <tr className="bg-slate-100 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
//                 <th className="px-4 py-3">Role</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Department</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Login</th>
//                 <th className="px-4 py-3">Logout</th>
//                 <th className="px-4 py-3">Total time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(dashboardSummary?.telecallerLoginInfo || []).map((user) => (
//                 <tr
//                   key={`telecaller-${user.id}`}
//                   className="border-b border-slate-200 hover:bg-slate-50"
//                 >
//                   <td className="px-4 py-3">Telecaller</td>
//                   <td className="px-4 py-3 font-medium">{user.name}</td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.department || "—"}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-slate-500">{user.lastLogin}</td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.lastLogout}
//                   </td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.sessionDuration}
//                   </td>
//                 </tr>
//               ))}
//               {(dashboardSummary?.counsellorLoginInfo || []).map((user) => (
//                 <tr
//                   key={`counsellor-${user.id}`}
//                   className="border-b border-slate-200 hover:bg-slate-50"
//                 >
//                   <td className="px-4 py-3">Counsellor</td>
//                   <td className="px-4 py-3 font-medium">{user.name}</td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.department || "—"}
//                   </td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-slate-500">{user.lastLogin}</td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.lastLogout}
//                   </td>
//                   <td className="px-4 py-3 text-slate-500">
//                     {user.sessionDuration}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="relative flex-1 min-w-[220px] max-w-xs">
//               <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <Input
//                 placeholder="Search name, phone, email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-9 h-9 text-sm"
//               />
//             </div>
//             <Select
//               value={filterStatus || "all"}
//               onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}
//             >
//               <SelectTrigger className="w-40 h-9 text-sm">
//                 <SelectValue placeholder="All statuses" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All statuses</SelectItem>
//                 {STATUS_OPTIONS.map((s) => (
//                   <SelectItem key={s} value={s}>
//                     {s}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select
//               value={filterTag || "all"}
//               onValueChange={(v) => setFilterTag(v === "all" ? "" : v)}
//             >
//               <SelectTrigger className="w-36 h-9 text-sm">
//                 <SelectValue placeholder="All tags" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All tags</SelectItem>
//                 {LEAD_TAG_OPTIONS.map((t) => (
//                   <SelectItem key={t} value={t}>
//                     {t}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {(search || filterStatus || filterTag) && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-9 text-xs text-slate-500"
//                 onClick={() => {
//                   setSearch("");
//                   setFilterStatus("");
//                   setFilterTag("");
//                 }}
//               >
//                 <X className="h-3.5 w-3.5 mr-1" />
//                 Clear
//               </Button>
//             )}
//             <span className="text-xs text-slate-400 ml-auto">
//               {total} lead{total !== 1 ? "s" : ""}
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="bg-white border flex-wrap h-auto gap-1 p-1">
//           {[
//             { value: "all", label: "All leads" },
//             { value: "new", label: "New" },
//             { value: "interested", label: "Interested" },
//             { value: "followup", label: "Follow-up" },
//             { value: "converted", label: "Converted" },
//             { value: "dropped", label: "Dropped / Not interested" },
//             { value: "calls", label: "Call Logs" },
//           ].map(({ value, label }) => (
//             <TabsTrigger key={value} value={value} className="text-xs h-8">
//               {label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <div className="mt-4">
//           {["all", "new", "interested", "followup", "converted", "dropped"].map(
//             (tab) => (
//               <TabsContent key={tab} value={tab} className="m-0">
//                 <Card>
//                   <CardContent className="p-0">
//                     {renderTable(tabLeads)}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             ),
//           )}
//           <TabsContent value="calls" className="m-0">
//             <Card>
//               <CardContent className="p-0">{renderCallLogsTable()}</CardContent>
//             </Card>
//           </TabsContent>
//         </div>
//       </Tabs>

//       {/* Pagination */}
//       {total > limit && (
//         <div className="flex items-center justify-between text-sm text-slate-500">
//           <span>
//             Page {page} of {Math.ceil(total / limit)}
//           </span>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={page <= 1}
//               onClick={() => setPage((p) => p - 1)}
//             >
//               ← Prev
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={page >= Math.ceil(total / limit)}
//               onClick={() => setPage((p) => p + 1)}
//             >
//               Next →
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* ── Add Lead Modal ──────────────────────────────────────────────────── */}
//       <Dialog open={addModal} onOpenChange={setAddModal}>
//         <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Add new lead</DialogTitle>
//             <DialogDescription>
//               Fill in the student's details to create a new lead.
//             </DialogDescription>
//           </DialogHeader>
//           <LeadForm
//             onSave={handleAddLead}
//             onCancel={() => setAddModal(false)}
//             loading={saving}
//             employees={employees}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* ── Edit Lead Modal ─────────────────────────────────────────────────── */}
//       <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
//         <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit lead — {editModal?.name}</DialogTitle>
//             <DialogDescription>
//               Update the lead details below.
//             </DialogDescription>
//           </DialogHeader>
//           {editModal && (
//             <LeadForm
//               initial={editModal}
//               onSave={handleEditLead}
//               onCancel={() => setEditModal(null)}
//               loading={saving}
//               employees={employees}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ── Full Details Modal ──────────────────────────────────────────────── */}
//       <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
//         <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Student details</DialogTitle>
//             <DialogDescription>
//               Full profile and remarks history
//             </DialogDescription>
//           </DialogHeader>
//           <StudentDetails student={detailModal} />
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDetailModal(null)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Progress Modal ──────────────────────────────────────────────────── */}
//       <Dialog
//         open={!!progressModal}
//         onOpenChange={() => setProgressModal(null)}
//       >
//         <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               Admission progress — {progressModal?.name}
//             </DialogTitle>
//             <DialogDescription>
//               Track each stage of the student's admission journey.
//             </DialogDescription>
//           </DialogHeader>
//           {progressModal && (
//             <ProgressPanel
//               lead={progressModal}
//               onSave={handleSaveProgress}
//               onCancel={() => setProgressModal(null)}
//               saving={saving}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* ── Remark Modal ────────────────────────────────────────────────────── */}
//       <Dialog open={!!remarkModal} onOpenChange={() => setRemarkModal(null)}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add remark — {remarkModal?.name}</DialogTitle>
//             <DialogDescription>
//               Log a follow-up note and optionally change the lead status.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-2">
//             <div>
//               <Label className="text-sm">
//                 Remark <span className="text-red-500">*</span>
//               </Label>
//               <Textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 placeholder="What was discussed? Next steps, objections..."
//                 className="min-h-24 mt-1.5 text-sm"
//               />
//             </div>
//             <div>
//               <Label className="text-sm">Move to status</Label>
//               <Select
//                 value={moveToStatus || "keep"}
//                 onValueChange={(v) => setMoveToStatus(v === "keep" ? "" : v)}
//               >
//                 <SelectTrigger className="mt-1.5">
//                   <SelectValue placeholder="Keep current status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="keep">Keep current</SelectItem>
//                   {STATUS_OPTIONS.map((s) => (
//                     <SelectItem key={s} value={s}>
//                       {s}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setRemarkModal(null)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSaveRemark}
//               disabled={!remark.trim() || savingRemark}
//             >
//               {savingRemark ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="mr-2 h-4 w-4" />
//                   Save remark
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Assign Modal ────────────────────────────────────────────────────── */}
//       <Dialog open={!!assignModal} onOpenChange={() => setAssignModal(null)}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Assign lead — {assignModal?.name}</DialogTitle>
//             <DialogDescription>
//               Assign a telecaller and/or counsellor for this lead.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-2">
//             <div>
//               <Label className="text-sm">Telecaller</Label>
//               <Select
//                 value={assignTelecaller || "none"}
//                 onValueChange={(v) =>
//                   setAssignTelecaller(v === "none" ? "" : v)
//                 }
//               >
//                 <SelectTrigger className="mt-1.5">
//                   <SelectValue placeholder="Select telecaller" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None</SelectItem>
//                   {employees
//                     .filter((e) =>
//                       ["Telecaller", "telecaller"].includes(
//                         e.role || e.position,
//                       ),
//                     )
//                     .map((e) => {
//                       const employeeId = e._id || e.id;
//                       return (
//                         <SelectItem key={employeeId} value={employeeId}>
//                           {e.name}
//                         </SelectItem>
//                       );
//                     })}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label className="text-sm">Counsellor</Label>
//               <Select
//                 value={assignCounsellor || "none"}
//                 onValueChange={(v) =>
//                   setAssignCounsellor(v === "none" ? "" : v)
//                 }
//               >
//                 <SelectTrigger className="mt-1.5">
//                   <SelectValue placeholder="Select counsellor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None</SelectItem>
//                   {employees
//                     .filter((e) =>
//                       ["Counsellor", "counsellor"].includes(
//                         e.role || e.position,
//                       ),
//                     )
//                     .map((e) => {
//                       const employeeId = e._id || e.id;
//                       return (
//                         <SelectItem key={employeeId} value={employeeId}>
//                           {e.name}
//                         </SelectItem>
//                       );
//                     })}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setAssignModal(null)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAssign}
//               disabled={assigning}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white"
//             >
//               {assigning ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Assigning...
//                 </>
//               ) : (
//                 <>
//                   <UserCheck className="mr-2 h-4 w-4" />
//                   Assign
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
//       <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm delete</DialogTitle>
//           </DialogHeader>
//           <DeleteConfirm
//             lead={deleteModal}
//             onConfirm={handleDelete}
//             onCancel={() => setDeleteModal(null)}
//             deleting={deleting}
//           />
//         </DialogContent>
//       </Dialog>

//       {/* ── Bulk Upload Modal ────────────────────────────────────────────────── */}
//       <Dialog open={bulkModal} onOpenChange={setBulkModal}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Bulk upload leads</DialogTitle>
//             <DialogDescription>
//               Upload a .xlsx / .xls / .csv file. Each row must have Name and
//               Phone.
//             </DialogDescription>
//           </DialogHeader>
//           <BulkUpload
//             onDone={() => {
//               setBulkModal(false);
//               fetchLeads();
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Users,
  UserCheck,
  Clock,
  Edit2,
  Eye,
  DollarSign,
  Save,
  User,
  Phone,
  MapPin,
  IndianRupee,
  Tag,
  Calendar,
  BookOpen,
  Trash2,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "https://crm-software-for-eduhawk-2.onrender.com/api";

// ─── Constants ───────────────────────────────────────────────────────────────

const LEAD_TAGS = {
  Hot: { label: "Hot", variant: "destructive" },
  Warm: { label: "Warm", variant: "default" },
  Cold: { label: "Cold", variant: "secondary" },
};

const STATUS_OPTIONS = [
  "New",
  "Interested",
  "Call Back",
  "Not Interested",
  "Converted",
  "Dropped",
];

const LEAD_TAG_OPTIONS = ["Hot", "Warm", "Cold"];

const PROGRESS_FIELDS = [
  {
    id: "registrationFeePaid",
    label: "Registration Fee Paid",
    group: "regdocs",
  },
  { id: "documentsSubmitted", label: "Documents Submitted", group: "regdocs" },
  {
    id: "admissionLetterIssued",
    label: "Admission Letter Issued",
    group: "admission",
  },
  {
    id: "visaApplied",
    label: "Visa Applied",
    group: "visa",
  },
  {
    id: "visaIssued",
    label: "Visa Issued",
    group: "visa",
  },
  { id: "ticketBooked", label: "Ticket Booked", group: "visa" },
  { id: "departureStatus", label: "Departed", group: "visa" },
];

const EMPTY_LEAD = {
  name: "",
  phone: "",
  parentName: "",
  city: "",
  email: "",
  neetStatus: "",
  budget: "",
  preferredCountry: "",
  collegeName: "",
  emergencyContact: "",
  serviceManager: "",
  status: "New",
  leadTag: "Warm",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2) || "??";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, count, color, icon }) => (
  <Card>
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-3 ${color} rounded-xl`}>{icon}</div>
      <div>
        <p className="text-3xl font-semibold text-slate-900">{count}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }) => {
  const map = {
    New: "bg-blue-100 text-blue-800",
    Interested: "bg-amber-100 text-amber-800",
    "Call Back": "bg-orange-100 text-orange-800",
    Converted: "bg-emerald-100 text-emerald-800",
    Dropped: "bg-red-100 text-red-800",
    "Not Interested": "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
};

const TagBadge = ({ tag }) => {
  const map = {
    Hot: "bg-red-100 text-red-800",
    Warm: "bg-amber-100 text-amber-800",
    Cold: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[tag] || "bg-slate-100 text-slate-600"}`}
    >
      {tag}
    </span>
  );
};

// ─── Lead Form (Add / Edit) ───────────────────────────────────────────────────

const LeadForm = ({
  initial = EMPTY_LEAD,
  onSave,
  onCancel,
  loading,
  employees = [],
}) => {
  const [form, setForm] = useState({ ...EMPTY_LEAD, ...initial });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const field = (label, key, type = "text", required = false) => (
    <div>
      <Label className="text-xs text-muted-foreground mb-1 block">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <Input
        type={type}
        value={form[key] || ""}
        onChange={(e) => set(key, e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field("Student name", "name", "text", true)}
        {field("Phone", "phone", "tel", true)}
        {field("Parent name", "parentName")}
        {field("City", "city")}
        {field("Email", "email", "email")}
        {field("Budget (₹)", "budget", "number")}
        {field("College name", "collegeName")}
        {field("Preferred country", "preferredCountry")}
        {field("NEET status", "neetStatus")}
        {field("Emergency contact", "emergencyContact")}
        {field("Service manager", "serviceManager")}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Status
          </Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Lead tag
          </Label>
          <Select value={form.leadTag} onValueChange={(v) => set("leadTag", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_TAG_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Assign telecaller
          </Label>
          <Select
            value={form.assignedToTelecaller || "none"}
            onValueChange={(v) =>
              set("assignedToTelecaller", v === "none" ? "" : v)
            }
          >
            <SelectTrigger className="h-9 text-sm bg-white">
              <SelectValue placeholder="Select telecaller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {employees
                .filter(
                  (e) => e.role === "Telecaller" || e.role === "telecaller",
                )
                .map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Assign counsellor
          </Label>
          <Select
            value={form.assignedToCounsellor || "none"}
            onValueChange={(v) =>
              set("assignedToCounsellor", v === "none" ? "" : v)
            }
          >
            <SelectTrigger className="h-9 text-sm bg-white">
              <SelectValue placeholder="Select counsellor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {employees
                .filter(
                  (e) => e.role === "Counsellor" || e.role === "counsellor",
                )
                .map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Follow-up date
          </Label>
          <Input
            type="date"
            value={form.followUpDate ? form.followUpDate.split("T")[0] : ""}
            onChange={(e) => set("followUpDate", e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>
      
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Status
          </Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lead Tag */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Lead tag
          </Label>
          <Select value={form.leadTag} onValueChange={(v) => set("leadTag", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_TAG_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assign Telecaller - Ab Counsellor jaisa */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Assign telecaller
          </Label>
          <Select
            value={form.assignedToTelecaller || "none"}
            onValueChange={(v) =>
              set("assignedToTelecaller", v === "none" ? "" : v)
            }
          >
            <SelectTrigger className="h-9 text-sm">
              {" "}
              {/* bg-white hataya */}
              <SelectValue placeholder="Select telecaller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {employees
                .filter((e) => e.role?.toLowerCase() === "telecaller")
                .map((e) => (
                  <SelectItem key={e._id} value={String(e._id)}>
                    {e.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assign Counsellor */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Assign counsellor
          </Label>
          <Select
            value={form.assignedToCounsellor || "none"}
            onValueChange={(v) =>
              set("assignedToCounsellor", v === "none" ? "" : v)
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select counsellor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {employees
                .filter((e) => e.role?.toLowerCase() === "counsellor")
                .map((e) => (
                  <SelectItem key={e._id} value={String(e._id)}>
                    {e.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Follow-up Date */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">
            Follow-up date
          </Label>
          <Input
            type="date"
            value={form.followUpDate ? form.followUpDate.split("T")[0] : ""}
            onChange={(e) => set("followUpDate", e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save lead
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// ─── Progress Panel ───────────────────────────────────────────────────────────

const ProgressPanel = ({ lead, onSave, onCancel, saving }) => {
  const [data, setData] = useState(() => {
    const d = {};
    PROGRESS_FIELDS.forEach((f) => {
      d[f.id] = lead[f.id] || false;
    });
    d.departureDate = lead.departureDate
      ? lead.departureDate.split("T")[0]
      : "";
    d.remarks = lead.progressRemarks || "";
    return d;
  });

  const toggle = (id, v) => setData((p) => ({ ...p, [id]: v }));

  const groups = [
    {
      key: "regdocs",
      title: "Registration & documents",
      icon: <DollarSign className="h-4 w-4 text-emerald-600" />,
    },
    {
      key: "admission",
      title: "Admission process",
      icon: <BookOpen className="h-4 w-4 text-blue-600" />,
    },
    {
      key: "visa",
      title: "Visa & departure",
      icon: <Calendar className="h-4 w-4 text-purple-600" />,
    },
  ];

  const done = PROGRESS_FIELDS.filter((f) => data[f.id]).length;
  const pct = Math.round((done / PROGRESS_FIELDS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-medium text-slate-700">
          {pct}% complete
        </span>
      </div>

      {groups.map(({ key, title, icon }) => (
        <div key={key}>
          <h3 className="font-medium text-sm flex items-center gap-2 mb-3 text-slate-700">
            {icon}
            {title}
          </h3>
          <div className="space-y-2.5 pl-6">
            {PROGRESS_FIELDS.filter((f) => f.group === key).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox
                  id={item.id}
                  checked={data[item.id]}
                  onCheckedChange={(v) => toggle(item.id, v)}
                />
                <Label htmlFor={item.id} className="cursor-pointer text-sm">
                  {item.label}
                </Label>
              </div>
            ))}
            {key === "visa" && (
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Departure date
                </Label>
                <Input
                  type="date"
                  value={data.departureDate || ""}
                  onChange={(e) =>
                    setData((p) => ({ ...p, departureDate: e.target.value }))
                  }
                  className="h-8 text-sm max-w-xs"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <div>
        <Label className="text-sm">Remarks / notes</Label>
        <Textarea
          value={data.remarks}
          onChange={(e) => setData((p) => ({ ...p, remarks: e.target.value }))}
          placeholder="Any observations, issues, next steps..."
          className="mt-1.5 min-h-24 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(data)}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save progress
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// ─── Student Details View ─────────────────────────────────────────────────────

const StudentDetails = ({ student }) => {
  if (!student) return null;

  const personalRows = [
    ["Phone", student.phone],
    ["Alternate Phone", student.phonenumber2 || "—"],
    [
      "Gender",
      student.gender === "M" ? "Male" : student.gender === "F" ? "Female" : "—",
    ],
    ["Parent Name", student.parentName],
    ["City", student.city],
  ];

  const academicRows = [
    ["NEET Status", student.neetStatus],
    ["Gap Year", student.gapYear || "0"],
    ["College Name", student.collegeName || "—"],
    ["Preferred Country 1", student.preferredCountry1 || "—"],
    ["Preferred Country 2", student.preferredCountry2 || "—"],
    [
      "Budget",
      student.budget
        ? `₹${Number(student.budget).toLocaleString("en-IN")}`
        : "—",
    ],
  ];

  const assignmentRows = [
    ["Source", student.source || "—"],
    ["Telecaller", student.assignedToTelecaller?.name || "Unassigned"],
    ["Counsellor", student.assignedToCounsellor?.name || "Unassigned"],
    ["Progress Stage", student.progress || "—"],
    ["Follow-up Date", fmtDate(student.followUpDate)],
    ["Created", fmtDate(student.createdAt)],
  ];

  const progressFields = [
    { label: "Registration Fee Paid", value: student.registrationFeePaid },
    { label: "Documents Submitted", value: student.documentsSubmitted },
    { label: "Document File Ready", value: student.documentFileReady },
    {
      label: "College Application Done",
      value: student.collegeApplicationDone,
    },
    { label: "Admission Letter Issued", value: student.admissionLetterIssued },
    { label: "Visa Applied", value: student.visaApplied },
    { label: "Visa Issued", value: student.visaIssued },
    { label: "Ticket Booked", value: student.ticketBooked },
    { label: "Departure Status", value: student.departureStatus },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border">
        <Avatar className="h-16 w-16 border-4 border-white shadow">
          <AvatarFallback className="bg-indigo-500 text-white text-xl font-bold">
            {initials(student.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {student.name || "—"}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {student.email || "—"}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge status={student.status} />
            <TagBadge tag={student.leadTag} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {personalRows.map(([label, value]) => (
            <div key={label} className="flex flex-col bg-slate-50 p-2 rounded">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {label}
              </span>
              <span className="font-medium mt-1 text-slate-800">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {academicRows.map(([label, value]) => (
            <div key={label} className="flex flex-col bg-slate-50 p-2 rounded">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {label}
              </span>
              <span className="font-medium mt-1 text-slate-800">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Assignment & Tracking
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {assignmentRows.map(([label, value]) => (
            <div key={label} className="flex flex-col bg-slate-50 p-2 rounded">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {label}
              </span>
              <span className="font-medium mt-1 text-slate-800">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Admission Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {progressFields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-slate-50 p-2 rounded"
            >
              <div
                className="w-4 h-4 rounded border flex items-center justify-center"
                style={{
                  backgroundColor: value ? "#10b981" : "#e5e7eb",
                  borderColor: value ? "#059669" : "#d1d5db",
                }}
              >
                {value && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {student.remarks?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Remarks History
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...student.remarks].reverse().map((r, i) => (
              <div
                key={i}
                className="bg-slate-50 border rounded-lg p-3 text-sm"
              >
                <p className="text-slate-700 font-medium">{r.text}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {r.by?.name || "—"} · {fmtDate(r.date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Bulk Upload Section ──────────────────────────────────────────────────────

const BulkUpload = ({ onDone }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    try {
      setUploading(true);
      setResult(null);
      const res = await fetch(`${BASE_URL}/leads/bulk-upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setResult(data);
      toast.success(`Imported ${data.imported} leads!`);
      onDone?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
        onClick={() => document.getElementById("bulk-file-input").click()}
      >
        <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">
          {file ? file.name : "Click to select file"}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Supports .xlsx, .xls, .csv
        </p>
        <input
          id="bulk-file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setResult(null);
          }}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between bg-slate-50 border rounded-lg px-4 py-2.5 text-sm">
          <span className="text-slate-700 font-medium">{file.name}</span>
          <button
            onClick={() => setFile(null)}
            className="text-slate-400 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm space-y-1">
          <p className="font-medium text-emerald-800">Upload complete</p>
          <p className="text-emerald-700">Total rows: {result.totalRows}</p>
          <p className="text-emerald-700">Imported: {result.imported}</p>
          <p className="text-slate-500">
            Skipped (duplicates/invalid): {result.skipped}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload leads
            </>
          )}
        </Button>
        <a
          href="/sample_leads_template.xlsx"
          download
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border rounded-lg hover:bg-slate-50 text-slate-600"
        >
          <Download className="h-4 w-4" />
          Download template
        </a>
      </div>
    </div>
  );
};

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

const DeleteConfirm = ({ lead, onConfirm, onCancel, deleting }) => (
  <div className="space-y-5">
    <div className="flex items-start gap-4 bg-red-50 p-4 rounded-xl border border-red-100">
      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
      <div>
        <p className="font-medium text-red-800">Delete this lead?</p>
        <p className="text-sm text-red-600 mt-1">
          <strong>{lead?.name}</strong> ({lead?.phone}) will be permanently
          removed. This cannot be undone.
        </p>
      </div>
    </div>
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={deleting}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        {deleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete lead
          </>
        )}
      </Button>
    </div>
  </div>
);

// ─── Main Admin Component ─────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Data
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Modals
  const [detailModal, setDetailModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [progressModal, setProgressModal] = useState(null);
  const [remarkModal, setRemarkModal] = useState(null);
  const [bulkModal, setBulkModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);

  // Saving states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Remark form
  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);

  // Assign form
  const [assignTelecaller, setAssignTelecaller] = useState("");
  const [assignCounsellor, setAssignCounsellor] = useState("");

  // ── Fetch ───────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus }),
        ...(filterTag && { leadTag: filterTag }),
      });
      const res = await fetch(`${BASE_URL}/leads?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error("Failed to load leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus, filterTag]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setEmployees(data.data || data || []);
    } catch {
      /* silent */
    }
    console.log(setEmployees);
  };

  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/dashboard`, {
        headers: authHeader(),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch dashboard summary");
      setDashboardSummary(data.data || data || null);
    } catch (err) {
      console.error("Dashboard summary fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchLeads(), fetchDashboardSummary()]);
  }, [fetchLeads, fetchDashboardSummary]);

  const fetchCallLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus }),
      });
      const res = await fetch(`${BASE_URL}/ivr/calls?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCallLogs(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error("Failed to load call logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  useEffect(() => {
    fetchLeads();
    fetchDashboardSummary();
  }, [fetchLeads, fetchDashboardSummary]);
  useEffect(() => {
    fetchEmployees();
  }, []);
  useEffect(() => {
    if (activeTab === "calls") {
      fetchCallLogs();
    }
  }, [activeTab, fetchCallLogs]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterTag]);

  // ── CRUD Handlers ────────────────────────────────────────────────────────

  const handleAddLead = async (form) => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");
      toast.success("Lead added successfully!");
      setAddModal(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handletelecaller = async (form) => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/leads/telecaller`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");
      toast.success("Lead added successfully!");
      setAddModal(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCounsellor = async (form) => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/leads/counsellor`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add");
      toast.success("Lead added successfully!");
      setAddModal(false);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditLead = async (form) => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${BASE_URL}/leads/${editModal._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      toast.success("Lead updated!");
      setEditModal(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`${BASE_URL}/leads/${deleteModal._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Delete failed");
      }
      toast.success("Lead deleted");
      setDeleteModal(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveProgress = async (data) => {
    try {
      setSaving(true);
      const { remarks, departureDate, ...checkboxes } = data;
      const res = await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          ...checkboxes,
          ...(departureDate && { departureDate }),
          progressRemarks: remarks,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Save failed");
      }
      toast.success("Progress saved!");
      setProgressModal(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRemark = async () => {
    if (!remark.trim()) {
      toast.error("Please write a remark");
      return;
    }
    try {
      setSavingRemark(true);
      const body = {
        lastRemark: remark.trim(),
        lastFollowUp: new Date().toISOString(),
        ...(moveToStatus && { status: moveToStatus }),
      };
      const res = await fetch(`${BASE_URL}/leads/${remarkModal._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Save failed");
      }
      toast.success("Remark saved!");
      setRemarkModal(null);
      setRemark("");
      setMoveToStatus("");
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingRemark(false);
    }
  };

  const handleAssign = async () => {
    if (!assignModal) {
      toast.error("No lead selected for assignment.");
      return;
    }

    if (!assignTelecaller && !assignCounsellor) {
      toast.error("Select a telecaller or counsellor before assigning.");
      return;
    }

    try {
      setAssigning(true);
      const body = {};
      if (assignTelecaller) body.assignedToTelecaller = assignTelecaller;
      if (assignCounsellor) body.assignedToCounsellor = assignCounsellor;
      const res = await fetch(`${BASE_URL}/leads/${assignModal._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Assign failed");
      }
      toast.success("Lead assigned!");
      setAssignModal(null);
      setAssignTelecaller("");
      setAssignCounsellor("");
      fetchLeads();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const openAssignModal = (lead) => {
    setAssignTelecaller(lead.assignedToTelecaller?._id || "");
    setAssignCounsellor(lead.assignedToCounsellor?._id || "");
    setAssignModal(lead);
  };

  // ── Stats ────────────────────────────────────────────────────────────

  const stats = {
    total: dashboardSummary?.totalLeads ?? leads.length,
    hot:
      dashboardSummary?.hotLeads ??
      leads.filter((l) => l.leadTag === "Hot").length,
    warm:
      dashboardSummary?.warmLeads ??
      leads.filter((l) => l.leadTag === "Warm").length,
    cold:
      dashboardSummary?.coldLeads ??
      leads.filter((l) => l.leadTag === "Cold").length,
    converted:
      dashboardSummary?.converted ??
      leads.filter((l) => l.status === "Converted").length,
    followUp:
      dashboardSummary?.pendingFollowUps ??
      leads.filter((l) => l.status === "Call Back").length,
    admissionsInProgress:
      dashboardSummary?.admissionsInProgress ??
      leads.filter((l) => l.status === "Converted" && !l.registrationFeePaid)
        .length,
    visaPending:
      dashboardSummary?.visaPending ??
      leads.filter((l) => l.visaApplied && !l.visaIssued).length,
  };

  // ── Tab filter ────────────────────────────────────────────────────────────

  const tabLeads =
    activeTab === "all"
      ? leads
      : activeTab === "new"
        ? leads.filter((l) => l.status === "New")
        : activeTab === "interested"
          ? leads.filter((l) => l.status === "Interested")
          : activeTab === "followup"
            ? leads.filter((l) => l.status === "Call Back")
            : activeTab === "converted"
              ? leads.filter((l) => l.status === "Converted")
              : activeTab === "dropped"
                ? leads.filter((l) =>
                    ["Dropped", "Not Interested"].includes(l.status),
                  )
                : leads;

  const activeTabLabel =
    {
      all: "All leads",
      new: "New leads",
      interested: "Interested leads",
      followup: "Follow-up leads",
      converted: "Converted leads",
      dropped: "Dropped / Not interested",
    }[activeTab] || "All leads";

  const quickAssignLead = tabLeads.find(
    (l) => !l.assignedToTelecaller && !l.assignedToCounsellor,
  );

  const openQuickAssign = () => {
    if (!quickAssignLead) {
      toast.info("No unassigned leads available in this view.");
      return;
    }
    openAssignModal(quickAssignLead);
  };

  const handleQuickFollowUp = () => {
    if (activeTab !== "followup") {
      setActiveTab("followup");
      return;
    }
    const nextFollowUp = tabLeads[0];
    if (!nextFollowUp) {
      toast.info("No follow-up leads available.");
      return;
    }
    setDetailModal(nextFollowUp);
  };

  // ── Table ────────────────────────────────────────────────────────────

  const renderTable = (data) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">S.No</TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Telecaller</TableHead>
            <TableHead>Counsellor</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead className="text-center min-w-[220px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-16">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={11}
                className="text-center py-16 text-slate-400 text-sm"
              >
                No leads found
              </TableCell>
            </TableRow>
          ) : (
            data.map((lead, index) => (
              <TableRow key={lead._id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-center">
                  {(page - 1) * limit + index + 1}
                </TableCell>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-medium">
                      {initials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {lead.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {lead.phone}
                </TableCell>
                <TableCell className="text-sm">{lead.city || "—"}</TableCell>
                <TableCell className="text-sm font-medium">
                  {lead.budget
                    ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell>
                  <TagBadge tag={lead.leadTag} />
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {lead.assignedToTelecaller?.name || (
                    <span className="text-slate-300">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {lead.assignedToCounsellor?.name || (
                    <span className="text-slate-300">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {fmtDate(lead.followUpDate)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => setDetailModal(lead)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => setProgressModal(lead)}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => openAssignModal(lead)}
                    >
                      <User className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderCallLogsTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Recording</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-16">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
              </TableCell>
            </TableRow>
          ) : callLogs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-16 text-slate-400 text-sm"
              >
                No call logs found
              </TableCell>
            </TableRow>
          ) : (
            callLogs.map((log) => (
              <TableRow key={log._id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs text-slate-500">
                  {log.phone}
                </TableCell>
                <TableCell className="text-sm">{log.department}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.callStatus === "completed" ? "default" : "secondary"
                    }
                  >
                    {log.callStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {log.duration
                    ? `${Math.floor(log.duration / 60)}:${(log.duration % 60).toString().padStart(2, "0")}`
                    : "—"}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {fmtDate(log.createdAt)}
                </TableCell>
                <TableCell>
                  {log.recordingUrl ? (
                    <audio controls className="h-8">
                      <source src={log.recordingUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <span className="text-slate-300 text-xs">No recording</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-black p-6 lg:p-8 space-y-8">
      {/* Page header */}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
                Quick actions
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                {activeTabLabel} — {tabLeads.length} lead
                {tabLeads.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl">
                Use these quick actions to keep your admin workflow fast and
                dynamic.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total leads",
              count: stats.total,
              color: "bg-slate-100",
              icon: <Users className="h-6 w-6 text-slate-600" />,
            },
            {
              label: "Hot leads",
              count: stats.hot,
              color: "bg-red-100",
              icon: <Tag className="h-6 w-6 text-red-600" />,
            },
            {
              label: "Converted",
              count: stats.converted,
              color: "bg-emerald-100",
              icon: <UserCheck className="h-6 w-6 text-emerald-600" />,
            },
            {
              label: "Pending follow-up",
              count: stats.followUp,
              color: "bg-orange-100",
              icon: <Clock className="h-6 w-6 text-orange-600" />,
            },
          ].map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Admission in progress",
              count: stats.admissionsInProgress,
              color: "bg-blue-100",
              icon: <BookOpen className="h-6 w-6 text-blue-600" />,
            },
            {
              label: "Visa pending",
              count: stats.visaPending,
              color: "bg-indigo-100",
              icon: <MapPin className="h-6 w-6 text-indigo-600" />,
            },
            {
              label: "Warm leads",
              count: stats.warm,
              color: "bg-amber-100",
              icon: <Tag className="h-6 w-6 text-amber-600" />,
            },
            {
              label: "Cold leads",
              count: stats.cold,
              color: "bg-sky-100",
              icon: <Users className="h-6 w-6 text-sky-600" />,
            },
          ].map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Team login & session details</CardTitle>
          <CardDescription>
            Telecaller and counsellor login, logout and session time.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Login</th>
                <th className="px-4 py-3">Logout</th>
                <th className="px-4 py-3">Total time</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardSummary?.telecallerLoginInfo || []).map((user) => (
                <tr
                  key={`telecaller-${user.id}`}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">Telecaller</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.department || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.lastLogout}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.sessionDuration}
                  </td>
                </tr>
              ))}
              {(dashboardSummary?.counsellorLoginInfo || []).map((user) => (
                <tr
                  key={`counsellor-${user.id}`}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">Counsellor</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.department || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.lastLogout}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {user.sessionDuration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card> */}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px] max-w-xs">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select
              value={filterStatus || "all"}
              onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterTag || "all"}
              onValueChange={(v) => setFilterTag(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {LEAD_TAG_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search || filterStatus || filterTag) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-slate-500"
                onClick={() => {
                  setSearch("");
                  setFilterStatus("");
                  setFilterTag("");
                }}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
            <span className="text-xs text-slate-400 ml-auto">
              {total} lead{total !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border flex-wrap h-auto gap-1 p-1">
          {[
            { value: "all", label: "All leads" },
            { value: "new", label: "New" },
            { value: "interested", label: "Interested" },
            { value: "followup", label: "Follow-up" },
            { value: "converted", label: "Converted" },
            { value: "dropped", label: "Dropped / Not interested" },
            { value: "calls", label: "Call Logs" },
          ].map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="text-xs h-8">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          {["all", "new", "interested", "followup", "converted", "dropped"].map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="m-0">
                <Card>
                  <CardContent className="p-0">
                    {renderTable(tabLeads)}
                  </CardContent>
                </Card>
              </TabsContent>
            ),
          )}
          <TabsContent value="calls" className="m-0">
            <Card>
              <CardContent className="p-0">{renderCallLogsTable()}</CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* ── Add Lead Modal ──────────────────────────────────────────────────── */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Add new lead</DialogTitle>
            <DialogDescription>
              Fill in the student's details to create a new lead.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            onSave={handleAddLead}
            onCancel={() => setAddModal(false)}
            loading={saving}
            employees={employees}
          />
        </DialogContent>
      </Dialog>

      {/* ── Edit Lead Modal ─────────────────────────────────────────────────── */}
      <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit lead — {editModal?.name}</DialogTitle>
            <DialogDescription>
              Update the lead details below.
            </DialogDescription>
          </DialogHeader>
          {editModal && (
            <LeadForm
              initial={editModal}
              onSave={handleEditLead}
              onCancel={() => setEditModal(null)}
              loading={saving}
              employees={employees}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Full Details Modal ──────────────────────────────────────────────── */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Student details</DialogTitle>
            <DialogDescription>
              Full profile and remarks history
            </DialogDescription>
          </DialogHeader>
          <StudentDetails student={detailModal} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Progress Modal ──────────────────────────────────────────────────────── */}
      <Dialog
        open={!!progressModal}
        onOpenChange={() => setProgressModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              Admission progress — {progressModal?.name}
            </DialogTitle>
            <DialogDescription>
              Track each stage of the student's admission journey.
            </DialogDescription>
          </DialogHeader>
          {progressModal && (
            <ProgressPanel
              lead={progressModal}
              onSave={handleSaveProgress}
              onCancel={() => setProgressModal(null)}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Remark Modal ────────────────────────────────────────────────────── */}
      <Dialog open={!!remarkModal} onOpenChange={() => setRemarkModal(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Add remark — {remarkModal?.name}</DialogTitle>
            <DialogDescription>
              Log a follow-up note and optionally change the lead status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm">
                Remark <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="What was discussed? Next steps, objections..."
                className="min-h-24 mt-1.5 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm">Move to status</Label>
              <Select
                value={moveToStatus || "keep"}
                onValueChange={(v) => setMoveToStatus(v === "keep" ? "" : v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep">Keep current</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemarkModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveRemark}
              disabled={!remark.trim() || savingRemark}
            >
              {savingRemark ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save remark
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Assign Modal ────────────────────────────────────────────────────── */}
      <Dialog open={!!assignModal} onOpenChange={() => setAssignModal(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Assign lead — {assignModal?.name}</DialogTitle>
            <DialogDescription>
              Assign a telecaller and/or counsellor for this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm">Telecaller</Label>
              <Select
                value={assignTelecaller || "none"}
                onValueChange={(v) =>
                  setAssignTelecaller(v === "none" ? "" : v)
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select telecaller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {employees
                    .filter((e) =>
                      ["Telecaller", "telecaller"].includes(
                        e.role || e.position,
                      ),
                    )
                    .map((e) => {
                      const employeeId = e._id || e.id;
                      return (
                        <SelectItem key={employeeId} value={employeeId}>
                          {e.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Counsellor</Label>
              <Select
                value={assignCounsellor || "none"}
                onValueChange={(v) =>
                  setAssignCounsellor(v === "none" ? "" : v)
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select counsellor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {employees
                    .filter((e) =>
                      ["Counsellor", "counsellor"].includes(
                        e.role || e.position,
                      ),
                    )
                    .map((e) => {
                      const employeeId = e._id || e.id;
                      return (
                        <SelectItem key={employeeId} value={employeeId}>
                          {e.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assigning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────────────── */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
          </DialogHeader>
          <DeleteConfirm
            lead={deleteModal}
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(null)}
            deleting={deleting}
          />
        </DialogContent>
      </Dialog>

      {/* ── Bulk Upload Modal ────────────────────────────────────────────────── */}
      <Dialog open={bulkModal} onOpenChange={setBulkModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk upload leads</DialogTitle>
            <DialogDescription>
              Upload a .xlsx / .xls / .csv file. Each row must have Name and
              Phone.
            </DialogDescription>
          </DialogHeader>
          <BulkUpload
            onDone={() => {
              setBulkModal(false);
              fetchLeads();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
