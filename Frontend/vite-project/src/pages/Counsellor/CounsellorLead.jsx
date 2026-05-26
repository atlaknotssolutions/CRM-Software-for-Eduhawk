// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
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
// import { Textarea } from "../../components/ui/textarea";
// import { Checkbox } from "../../components/ui/checkbox";
// import { Input } from "../../components/ui/input";
// import { Progress } from "../../components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
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
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";

// import {
//   Users,
//   UserCheck,
//   Eye,
//   MessageSquare,
//   Loader2,
//   TrendingUp,
//   CheckCircle,
// } from "lucide-react";
// import { toast } from "react-toastify";

// const BASE_URL = "http://localhost:8000/api";

// const LEAD_TYPES = {
//   Hot: { label: "🔥 Hot", variant: "destructive" },
//   Warm: { label: "☀️ Warm", variant: "default" },
//   Cold: { label: "❄️ Cold", variant: "secondary" },
// };

// const PROGRESS_FIELDS = [
//   "registrationFeePaid",
//   "documentsSubmitted",
//   "documentFileReady",
//   "collegeApplicationDone",
//   "admissionLetterIssued",
//   "visaApplied",
//   "visaIssued",
//   "ticketBooked",
// ];

// // ─── Helpers ────────────────────────────────────────────────────────────────
// const formatDate = (iso) => {
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

// const getTelecallerDisplay = (student) => {
//   if (!student) return "—";
//   if (student.assignedToTelecaller) {
//     const tele = student.assignedToTelecaller;
//     if (typeof tele === "object" && tele.name) return tele.name;
//     return student.telecallerName || "—";
//   }
//   return student.telecallerName || "—";
// };

// const calculateProgress = (student) => {
//   if (!student) return 0;
//   const completed = PROGRESS_FIELDS.filter(
//     (field) => student[field] === true,
//   ).length;
//   return Math.round((completed / PROGRESS_FIELDS.length) * 100);
// };

// // ─── Student Full Details ────────────────────────────────────────────────────
// const StudentFullDetails = ({ student }) => {
//   if (!student) return null;
//   const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-2xl border">
//         <Avatar className="h-20 w-20 border-4 border-white shadow-md">
//           <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold">
//             {initials(student.name)}
//           </AvatarFallback>
//         </Avatar>
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">
//             {student.name || "—"}
//           </h2>
//           <p className="text-slate-500 mt-0.5">{student.email || "—"}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         {[
//           { label: "Phone", value: student.phone },
//           { label: "Parent Name", value: student.parentName },
//           { label: "City", value: student.city },
//           {
//             label: "Budget",
//             value: student.budget
//               ? `₹${Number(student.budget).toLocaleString("en-IN")}`
//               : null,
//           },
//           { label: "Lead Type", value: lead.label },
//           { label: "NEET Status", value: student.neetStatus },
//           { label: "Preferred Country", value: student.preferredCountry },
//         ].map(({ label, value }) => (
//           <div key={label} className="flex justify-between">
//             <span className="text-slate-500">{label}:</span>
//             <span className="font-medium">{value || "—"}</span>
//           </div>
//         ))}
//       </div>

//       <div className="pt-4 border-t grid grid-cols-1 gap-4 text-sm">
//         <div>
//           <span className="text-slate-500 block mb-1">Telecaller Remark:</span>
//           <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg">
//             {student.lastRemark || "—"}
//           </p>
//         </div>
//         <div>
//           <span className="text-slate-500 block mb-1">Counsellor Remark:</span>
//           <p className="font-medium text-emerald-700 bg-emerald-50 p-3 rounded-lg">
//             {student.counsellorRemark || "—"}
//           </p>
//         </div>
//         <div>
//           <span className="text-slate-500">Next Follow-up Date:</span>
//           <p className="font-medium mt-1">{formatDate(student.followUpDate)}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Component ──────────────────────────────────────────────────────────
// const CounsellorLead = () => {
//   const { user } = useAuth();
//   const isCounsellor = user?.role === "Counsellor";

//   const [allLeads, setAllLeads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [progressModal, setProgressModal] = useState(null);
//   const [remarkModal, setRemarkModal] = useState(false);
//   const [selectedLeadForRemark, setSelectedLeadForRemark] = useState(null);
//   const [showAllProgress, setShowAllProgress] = useState(false);

//   // Progress Form State
//   const [progressData, setProgressData] = useState({
//     registrationFeePaid: false,
//     documentsSubmitted: false,
//     documentFileReady: false,
//     collegeApplicationDone: false,
//     admissionLetterIssued: false,
//     visaApplied: false,
//     visaIssued: false,
//     ticketBooked: false,
//     collegeName: "",
//     emergencyContact: "",
//     serviceManager: "",
//     telecallerName: "",
//     followUpDate: "",
//     counsellorRemark: "",
//     progress: "",
//   });

//   const [savingProgress, setSavingProgress] = useState(false);
//   const [savingRemark, setSavingRemark] = useState(false);

//   // Telecaller Remark Form
//   const [remark, setRemark] = useState("");
//   const [nextFollowUpDate, setNextFollowUpDate] = useState("");

//   const authHeader = () => ({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//   });

//   const fetchLeads = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/leads/counsellor`, {
//         headers: authHeader(),
//       });
//       if (!res.ok) throw new Error("Failed to fetch leads");
//       const data = await res.json();
//       setAllLeads(data.data || []);
//     } catch (err) {
//       toast.error("Failed to load leads");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   // Filter Leads
//   const convertedLeads = allLeads.filter((l) => l.status === "Converted");
//   const completedLeads = convertedLeads.filter(
//     (student) => calculateProgress(student) === 100,
//   );

//   const openProgressModal = (student) => {
//     setProgressData({
//       registrationFeePaid: student.registrationFeePaid || false,
//       documentsSubmitted: student.documentsSubmitted || false,
//       documentFileReady: student.documentFileReady || false,
//       collegeApplicationDone: student.collegeApplicationDone || false,
//       admissionLetterIssued: student.admissionLetterIssued || false,
//       visaApplied: student.visaApplied || false,
//       visaIssued: student.visaIssued || false,
//       ticketBooked: student.ticketBooked || false,

//       collegeName: student.collegeName || "",
//       emergencyContact: student.emergencyContact || "",
//       serviceManager: student.serviceManager || "",
//       telecallerName: student.telecallerName || "",
//       followUpDate: student.followUpDate
//         ? student.followUpDate.split("T")[0]
//         : "",
//       counsellorRemark: student.counsellorRemark || "",
//       progress: student.progress || "Initial Contact",
//     });
//     setProgressModal(student);
//   };

//   const openRemarkModal = (student) => {
//     setRemark(student.lastRemark || "");
//     setNextFollowUpDate(
//       student.followUpDate ? student.followUpDate.split("T")[0] : "",
//     );
//     setSelectedLeadForRemark(student);
//     setRemarkModal(true);
//   };

//   const saveProgress = async () => {
//     if (!progressModal) return;
//     try {
//       setSavingProgress(true);
//       const payload = {
//         ...progressData,
//         followUpDate: progressData.followUpDate || undefined,
//         progress: progressData.progress || undefined,
//       };

//       const res = await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
//         method: "PUT",
//         headers: authHeader(),
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Save failed");

//       toast.success("Counsellor progress saved successfully");
//       setProgressModal(null);
//       fetchLeads();
//     } catch (err) {
//       toast.error("Failed to save progress");
//     } finally {
//       setSavingProgress(false);
//     }
//   };

//   const saveFollowUp = async () => {
//     if (!selectedLeadForRemark) return;
//     try {
//       setSavingRemark(true);
//       const payload = {
//         lastRemark: remark.trim() || undefined,
//         followUpDate: nextFollowUpDate || undefined,
//       };

//       const res = await fetch(
//         `${BASE_URL}/leads/${selectedLeadForRemark._id}`,
//         {
//           method: "PUT",
//           headers: authHeader(),
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!res.ok) throw new Error("Failed");

//       toast.success("Telecaller follow-up saved!");
//       setRemarkModal(false);
//       fetchLeads();
//     } catch (err) {
//       toast.error("Failed to save remark");
//     } finally {
//       setSavingRemark(false);
//     }
//   };

//   // Render Table Function
//   const renderTable = (data, showProgressColumn = true) => (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-12">S.No</TableHead>
//           <TableHead className="w-12"></TableHead>
//           <TableHead>Name</TableHead>
//           <TableHead>Phone</TableHead>
//           <TableHead>City</TableHead>
//           <TableHead>Budget</TableHead>
//           <TableHead>Lead Type</TableHead>
//           <TableHead>Telecaller</TableHead>
//           <TableHead>Next Follow-up</TableHead>
//           {showProgressColumn && <TableHead>Progress</TableHead>}
//           <TableHead>Telecaller Remark</TableHead>
//           <TableHead>Counsellor Remark</TableHead>
//           <TableHead className="text-center">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {loading ? (
//           <TableRow>
//             <TableCell colSpan={13} className="text-center py-12">
//               <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
//             </TableCell>
//           </TableRow>
//         ) : data.length === 0 ? (
//           <TableRow>
//             <TableCell
//               colSpan={13}
//               className="text-center py-12 text-muted-foreground"
//             >
//               No leads found
//             </TableCell>
//           </TableRow>
//         ) : (
//           data.map((student, index) => {
//             const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
//             const progress = calculateProgress(student);

//             return (
//               <TableRow key={student._id} className="hover:bg-muted/50">
//                 <TableCell className="font-medium text-center">
//                   {index + 1}
//                 </TableCell>
//                 <TableCell>
//                   <Avatar className="h-9 w-9">
//                     <AvatarFallback>{initials(student.name)}</AvatarFallback>
//                   </Avatar>
//                 </TableCell>
//                 <TableCell className="font-medium">{student.name}</TableCell>
//                 <TableCell className="font-mono">{student.phone}</TableCell>
//                 <TableCell>{student.city || "—"}</TableCell>
//                 <TableCell>
//                   {student.budget
//                     ? `₹${Number(student.budget).toLocaleString("en-IN")}`
//                     : "—"}
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant={lead.variant}>{lead.label}</Badge>
//                 </TableCell>
//                 <TableCell>{getTelecallerDisplay(student)}</TableCell>
//                 <TableCell>{formatDate(student.followUpDate)}</TableCell>

//                 {showProgressColumn && (
//                   <TableCell>
//                     <div className="flex items-center gap-3 w-40">
//                       <Progress value={progress} className="h-2 flex-1" />
//                       <span className="text-sm font-medium w-12 text-right">
//                         {progress}%
//                       </span>
//                     </div>
//                   </TableCell>
//                 )}

//                 <TableCell className="max-w-xs text-sm text-slate-600 line-clamp-2">
//                   {student.lastRemark || "—"}
//                 </TableCell>
//                 <TableCell className="max-w-xs text-sm text-emerald-700 line-clamp-2">
//                   {student.counsellorRemark || "—"}
//                 </TableCell>
//                 <TableCell>
//                   {isCounsellor ? (
//                     <div className="flex gap-2 justify-center flex-wrap">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openRemarkModal(student)}
//                       >
//                         <MessageSquare className="h-4 w-4 mr-1" />
//                         Remark
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openProgressModal(student)}
//                       >
//                         <Eye className="h-4 w-4 mr-1" />
//                         Progress
//                       </Button>
//                     </div>
//                   ) : (
//                     <span className="text-sm text-slate-500">
//                       Update restricted
//                     </span>
//                   )}
//                 </TableCell>
//               </TableRow>
//             );
//           })
//         )}
//       </TableBody>
//     </Table>
//   );

//   return (
//     <div className="min-h-screen bg-white text-black p-8 space-y-8">
//       {/* Header */}
//       <div>
//         <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//           Counselor Final Dashboard
//         </h1>
//         <p className="text-slate-500 mt-2">
//           Converted Leads & Admission Progress Management
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {allLeads.length}
//               </p>
//               <p className="text-sm text-slate-500">Total Leads</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-amber-100 rounded-xl">
//               <MessageSquare className="h-8 w-8 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {convertedLeads.length}
//               </p>
//               <p className="text-sm text-slate-500">Converted Leads</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-emerald-100 rounded-xl">
//               <CheckCircle className="h-8 w-8 text-emerald-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">
//                 {completedLeads.length}
//               </p>
//               <p className="text-sm text-slate-500">Progress Completed</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs Section */}
//       <Tabs defaultValue="converted" className="w-full">
//         <div className="flex justify-between items-center mb-6">
//           <TabsList className="grid w-fit grid-cols-2 bg-slate-100">
//             <TabsTrigger
//               value="converted"
//               className="flex items-center gap-2 px-6"
//             >
//               <Users className="h-4 w-4" />
//               Converted Leads ({convertedLeads.length})
//             </TabsTrigger>
//             <TabsTrigger
//               value="completed"
//               className="flex items-center gap-2 px-6"
//             >
//               <CheckCircle className="h-4 w-4" />
//               Progress Completed ({completedLeads.length})
//             </TabsTrigger>
//           </TabsList>

//           <Button
//             onClick={() => setShowAllProgress(true)}
//             variant="outline"
//             className="flex items-center gap-2"
//           >
//             <TrendingUp className="h-4 w-4" />
//             View All Students Progress
//           </Button>
//         </div>

//         {/* Converted Leads Tab */}
//         <TabsContent value="converted">
//           <Card>
//             <CardContent className="p-0">
//               {renderTable(convertedLeads, true)}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Progress Completed Tab */}
//         <TabsContent value="completed">
//           {completedLeads.length > 0 ? (
//             <Card>
//               <CardContent className="p-0">
//                 {renderTable(completedLeads, false)}
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardContent className="p-16 text-center">
//                 <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-xl text-slate-500">
//                   No students have completed 100% progress yet.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>
//       </Tabs>

//       {/* ==================== COUNSELLOR PROGRESS MODAL ==================== */}
//       <Dialog
//         open={!!progressModal}
//         onOpenChange={() => setProgressModal(null)}
//       >
//         <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white text-black border border-slate-200">
//           <DialogHeader>
//             <DialogTitle>Counsellor Progress & Remark</DialogTitle>
//             <DialogDescription>
//               Update progress, next follow-up date and your remark
//             </DialogDescription>
//           </DialogHeader>

//           <StudentFullDetails student={progressModal} />

//           <div className="space-y-8 py-6 bg-white">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label>College Name</Label>
//                 <Input
//                   value={progressData.collegeName}
//                   onChange={(e) =>
//                     setProgressData((p) => ({
//                       ...p,
//                       collegeName: e.target.value,
//                     }))
//                   }
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label>Next Follow-up Date</Label>
//                 <Input
//                   type="date"
//                   value={progressData.followUpDate}
//                   onChange={(e) =>
//                     setProgressData((p) => ({
//                       ...p,
//                       followUpDate: e.target.value,
//                     }))
//                   }
//                   className="mt-1"
//                 />
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-lg mb-4">Admission Progress</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
//                 {[
//                   {
//                     id: "registrationFeePaid",
//                     label: "Registration Fee Submitted",
//                   },
//                   { id: "documentsSubmitted", label: "Documents Submitted" },
//                   { id: "documentFileReady", label: "Document File Ready" },
//                   {
//                     id: "collegeApplicationDone",
//                     label: "College Application Done",
//                   },
//                   {
//                     id: "admissionLetterIssued",
//                     label: "Admission Letter Issued",
//                   },
//                   { id: "visaApplied", label: "Visa Applied" },
//                   { id: "visaIssued", label: "Visa Issued" },
//                   { id: "ticketBooked", label: "Ticket Booked" },
//                 ].map((item) => (
//                   <div key={item.id} className="flex items-center space-x-3">
//                     <Checkbox
//                       checked={progressData[item.id]}
//                       onCheckedChange={(v) =>
//                         setProgressData((p) => ({ ...p, [item.id]: v }))
//                       }
//                     />
//                     <Label>{item.label}</Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label>Counsellor Remark (Your Observation)</Label>
//               <Textarea
//                 value={progressData.counsellorRemark}
//                 onChange={(e) =>
//                   setProgressData((p) => ({
//                     ...p,
//                     counsellorRemark: e.target.value,
//                   }))
//                 }
//                 placeholder="Your comments, suggestions or next steps..."
//                 className="mt-2 min-h-32"
//               />
//             </div>

//             <div>
//               <Label>Progress Stage</Label>
//               <Select
//                 value={progressData.progress}
//                 onValueChange={(value) =>
//                   setProgressData((p) => ({ ...p, progress: value }))
//                 }
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue placeholder="Select progress stage" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Initial Contact">
//                     Initial Contact
//                   </SelectItem>
//                   <SelectItem value="Documents Collected">
//                     Documents Collected
//                   </SelectItem>
//                   <SelectItem value="Application Submitted">
//                     Application Submitted
//                   </SelectItem>
//                   <SelectItem value="Admission Received">
//                     Admission Received
//                   </SelectItem>
//                   <SelectItem value="Visa Processing">
//                     Visa Processing
//                   </SelectItem>
//                   <SelectItem value="Visa Approved">Visa Approved</SelectItem>
//                   <SelectItem value="Ticket Booked">Ticket Booked</SelectItem>
//                   <SelectItem value="Completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter className="bg-white">
//             <Button variant="outline" onClick={() => setProgressModal(null)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={saveProgress}
//               disabled={savingProgress}
//               className="bg-emerald-600 hover:bg-emerald-700"
//             >
//               {savingProgress ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                   Save Counsellor Progress
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ==================== TELECALLER REMARK MODAL ==================== */}
//       <Dialog open={remarkModal} onOpenChange={() => setRemarkModal(false)}>
//         <DialogContent className="max-w-lg bg-white text-black border border-slate-200">
//           <DialogHeader>
//             <DialogTitle>Telecaller Follow-up</DialogTitle>
//             <DialogDescription>Update telecaller remark only</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-5 py-4 bg-white">
//             <div>
//               <Label>Telecaller Remark</Label>
//               <Textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 className="min-h-32 mt-2"
//                 placeholder="What was discussed..."
//               />
//             </div>
//             <div>
//               <Label>Next Follow-up Date</Label>
//               <Input
//                 type="date"
//                 value={nextFollowUpDate}
//                 onChange={(e) => setNextFollowUpDate(e.target.value)}
//                 className="mt-2"
//               />
//             </div>
//           </div>

//           <DialogFooter className="bg-white">
//             <Button variant="outline" onClick={() => setRemarkModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={saveFollowUp} disabled={savingRemark}>
//               {savingRemark ? "Saving..." : "Save Telecaller Follow-up"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ==================== ALL STUDENTS PROGRESS MODAL ==================== */}
//       <Dialog open={showAllProgress} onOpenChange={setShowAllProgress}>
//         <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white text-black">
//           <DialogHeader>
//             <DialogTitle>All Students Progress Overview</DialogTitle>
//           </DialogHeader>
//           <div className="mt-6">{renderTable(allLeads, true)}</div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CounsellorLead;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import {
  Users,
  UserCheck,
  Eye,
  MessageSquare,
  Loader2,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/api";

const LEAD_TYPES = {
  Hot: { label: "🔥 Hot", variant: "destructive" },
  Warm: { label: "☀️ Warm", variant: "default" },
  Cold: { label: "❄️ Cold", variant: "secondary" },
};

const PROGRESS_FIELDS = [
  "registrationFeePaid",
  "documentsSubmitted",
  "documentFileReady",
  "collegeApplicationDone",
  "admissionLetterIssued",
  "visaApplied",
  "visaIssued",
  "ticketBooked",
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
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

const getTelecallerDisplay = (student) => {
  if (!student) return "—";
  if (student.assignedToTelecaller) {
    const tele = student.assignedToTelecaller;
    if (typeof tele === "object" && tele.name) return tele.name;
    return student.telecallerName || "—";
  }
  return student.telecallerName || "—";
};

const calculateProgress = (student) => {
  if (!student) return 0;
  const completed = PROGRESS_FIELDS.filter(
    (field) => student[field] === true,
  ).length;
  return Math.round((completed / PROGRESS_FIELDS.length) * 100);
};

// Automatic Progress Stage
const getAutomaticProgressStage = (progressData) => {
  const completed = PROGRESS_FIELDS.filter(
    (field) => progressData[field] === true,
  ).length;

  if (completed === 0) return "Initial Contact";
  if (completed <= 2) return "Documents Collected";
  if (completed <= 4) return "Application Submitted";
  if (completed <= 5) return "Admission Received";
  if (completed <= 6) return "Visa Processing";
  if (completed <= 7) return "Visa Approved";
  if (completed === 8) return "Completed";
  return "Initial Contact";
};

// ─── Student Full Details ────────────────────────────────────────────────────
const StudentFullDetails = ({ student }) => {
  if (!student) return null;
  const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-2xl border">
        <Avatar className="h-20 w-20 border-4 border-white shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold">
            {initials(student.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {student.name || "—"}
          </h2>
          <p className="text-slate-500 mt-0.5">{student.email || "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {[
          { label: "Phone", value: student.phone },
          { label: "Parent Name", value: student.parentName },
          { label: "City", value: student.city },
          {
            label: "Budget",
            value: student.budget
              ? `₹${Number(student.budget).toLocaleString("en-IN")}`
              : null,
          },
          { label: "Lead Type", value: lead.label },
          { label: "NEET Status", value: student.neetStatus },
          { label: "Preferred Country", value: student.preferredCountry },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="text-slate-500">{label}:</span>
            <span className="font-medium">{value || "—"}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t grid grid-cols-1 gap-4 text-sm">
        <div>
          <span className="text-slate-500 block mb-1">Telecaller Remark:</span>
          <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-lg">
            {student.lastRemark || "—"}
          </p>
        </div>
        <div>
          <span className="text-slate-500 block mb-1">Counsellor Remark:</span>
          <p className="font-medium text-emerald-700 bg-emerald-50 p-3 rounded-lg">
            {student.counsellorRemark || "—"}
          </p>
        </div>
        <div>
          <span className="text-slate-500">Next Follow-up Date:</span>
          <p className="font-medium mt-1">{formatDate(student.followUpDate)}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const CounsellorLead = () => {
  const { user } = useAuth();
  const isCounsellor = user?.role === "Counsellor";

  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [progressModal, setProgressModal] = useState(null);
  const [remarkModal, setRemarkModal] = useState(false);
  const [selectedLeadForRemark, setSelectedLeadForRemark] = useState(null);
  const [showAllProgress, setShowAllProgress] = useState(false);

  // Progress Form State
  const [progressData, setProgressData] = useState({
    registrationFeePaid: false,
    documentsSubmitted: false,
    documentFileReady: false,
    collegeApplicationDone: false,
    admissionLetterIssued: false,
    visaApplied: false,
    visaIssued: false,
    ticketBooked: false,
    collegeName: "",
    emergencyContact: "",
    serviceManager: "",
    telecallerName: "",
    followUpDate: "",
    counsellorRemark: "",
    progress: "Initial Contact",
  });

  const [savingProgress, setSavingProgress] = useState(false);
  const [savingRemark, setSavingRemark] = useState(false);

  // Telecaller Remark Form
  const [remark, setRemark] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads/counsellor`, {
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setAllLeads(data.data || []);
    } catch (err) {
      toast.error("Failed to load leads");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter Leads
  const convertedLeads = allLeads.filter((l) => l.status === "Converted");
  const completedLeads = convertedLeads.filter(
    (student) => calculateProgress(student) === 100,
  );

  const openProgressModal = (student) => {
    const initialData = {
      registrationFeePaid: student.registrationFeePaid || false,
      documentsSubmitted: student.documentsSubmitted || false,
      documentFileReady: student.documentFileReady || false,
      collegeApplicationDone: student.collegeApplicationDone || false,
      admissionLetterIssued: student.admissionLetterIssued || false,
      visaApplied: student.visaApplied || false,
      visaIssued: student.visaIssued || false,
      ticketBooked: student.ticketBooked || false,

      collegeName: student.collegeName || "",
      emergencyContact: student.emergencyContact || "",
      serviceManager: student.serviceManager || "",
      telecallerName: student.telecallerName || "",
      followUpDate: student.followUpDate
        ? student.followUpDate.split("T")[0]
        : "",
      counsellorRemark: student.counsellorRemark || "",
      progress: student.progress || "Initial Contact",
    };

    // Auto calculate progress stage
    initialData.progress = getAutomaticProgressStage(initialData);

    setProgressData(initialData);
    setProgressModal(student);
  };

  const openRemarkModal = (student) => {
    setRemark(student.lastRemark || "");
    setNextFollowUpDate(
      student.followUpDate ? student.followUpDate.split("T")[0] : "",
    );
    setSelectedLeadForRemark(student);
    setRemarkModal(true);
  };

  const saveProgress = async () => {
    if (!progressModal) return;
    try {
      setSavingProgress(true);
      const payload = {
        ...progressData,
        followUpDate: progressData.followUpDate || undefined,
        progress: progressData.progress || undefined,
      };

      const res = await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Counsellor progress saved successfully");
      setProgressModal(null);
      fetchLeads();
    } catch (err) {
      toast.error("Failed to save progress");
    } finally {
      setSavingProgress(false);
    }
  };

  const saveFollowUp = async () => {
    if (!selectedLeadForRemark) return;
    try {
      setSavingRemark(true);
      const payload = {
        lastRemark: remark.trim() || undefined,
        followUpDate: nextFollowUpDate || undefined,
      };

      const res = await fetch(
        `${BASE_URL}/leads/${selectedLeadForRemark._id}`,
        {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed");

      toast.success("Telecaller follow-up saved!");
      setRemarkModal(false);
      fetchLeads();
    } catch (err) {
      toast.error("Failed to save remark");
    } finally {
      setSavingRemark(false);
    }
  };

  // Render Table Function
  const renderTable = (data, showProgressColumn = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">S.No</TableHead>
          <TableHead className="w-12"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Lead Type</TableHead>
          <TableHead>Telecaller</TableHead>
          <TableHead>Next Follow-up</TableHead>
          {showProgressColumn && <TableHead>Progress</TableHead>}
          <TableHead>Telecaller Remark</TableHead>
          <TableHead>Counsellor Remark</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={13} className="text-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={13}
              className="text-center py-12 text-muted-foreground"
            >
              No leads found
            </TableCell>
          </TableRow>
        ) : (
          data.map((student, index) => {
            const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
            const progress = calculateProgress(student);

            return (
              <TableRow key={student._id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials(student.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="font-mono">{student.phone}</TableCell>
                <TableCell>{student.city || "—"}</TableCell>
                <TableCell>
                  {student.budget
                    ? `₹${Number(student.budget).toLocaleString("en-IN")}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={lead.variant}>{lead.label}</Badge>
                </TableCell>
                <TableCell>{getTelecallerDisplay(student)}</TableCell>
                <TableCell>{formatDate(student.followUpDate)}</TableCell>

                {showProgressColumn && (
                  <TableCell>
                    <div className="flex items-center gap-3 w-40">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium w-12 text-right">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                )}

                <TableCell className="max-w-xs text-sm text-slate-600 line-clamp-2">
                  {student.lastRemark || "—"}
                </TableCell>
                <TableCell className="max-w-xs text-sm text-emerald-700 line-clamp-2">
                  {student.counsellorRemark || "—"}
                </TableCell>
                <TableCell>
                  {isCounsellor ? (
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRemarkModal(student)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Remark
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProgressModal(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Progress
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">
                      Update restricted
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-white text-black p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Counselor Final Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Converted Leads & Admission Progress Management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {allLeads.length}
              </p>
              <p className="text-sm text-slate-500">Total Leads</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <MessageSquare className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {convertedLeads.length}
              </p>
              <p className="text-sm text-slate-500">Converted Leads</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {completedLeads.length}
              </p>
              <p className="text-sm text-slate-500">Progress Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="converted" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-fit grid-cols-2 bg-slate-100">
            <TabsTrigger
              value="converted"
              className="flex items-center gap-2 px-6"
            >
              <Users className="h-4 w-4" />
              Converted Leads ({convertedLeads.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 px-6"
            >
              <CheckCircle className="h-4 w-4" />
              Progress Completed ({completedLeads.length})
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => setShowAllProgress(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            View All Students Progress
          </Button>
        </div>

        {/* Converted Leads Tab */}
        <TabsContent value="converted">
          <Card>
            <CardContent className="p-0">
              {renderTable(convertedLeads, true)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Completed Tab */}
        <TabsContent value="completed">
          {completedLeads.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                {renderTable(completedLeads, false)}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-16 text-center">
                <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-500">
                  No students have completed 100% progress yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ==================== COUNSELLOR PROGRESS MODAL ==================== */}
      <Dialog
        open={!!progressModal}
        onOpenChange={() => setProgressModal(null)}
      >
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white text-black border border-slate-200">
          <DialogHeader>
            <DialogTitle>Counsellor Progress & Remark</DialogTitle>
            <DialogDescription>
              Update progress, next follow-up date and your remark
            </DialogDescription>
          </DialogHeader>

          <StudentFullDetails student={progressModal} />

          <div className="space-y-8 py-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>College Name</Label>
                <Input
                  value={progressData.collegeName}
                  onChange={(e) =>
                    setProgressData((p) => ({
                      ...p,
                      collegeName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Next Follow-up Date</Label>
                <Input
                  type="date"
                  value={progressData.followUpDate}
                  onChange={(e) =>
                    setProgressData((p) => ({
                      ...p,
                      followUpDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Admission Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                {[
                  {
                    id: "registrationFeePaid",
                    label: "Registration Fee Submitted",
                  },
                  { id: "documentsSubmitted", label: "Documents Submitted" },
                  { id: "documentFileReady", label: "Document File Ready" },
                  {
                    id: "collegeApplicationDone",
                    label: "College Application Done",
                  },
                  {
                    id: "admissionLetterIssued",
                    label: "Admission Letter Issued",
                  },
                  { id: "visaApplied", label: "Visa Applied" },
                  { id: "visaIssued", label: "Visa Issued" },
                  { id: "ticketBooked", label: "Ticket Booked" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={progressData[item.id]}
                      onCheckedChange={(v) => {
                        setProgressData((prev) => {
                          const updated = { ...prev, [item.id]: v };
                          updated.progress = getAutomaticProgressStage(updated);
                          return updated;
                        });
                      }}
                    />
                    <Label>{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Counsellor Remark (Your Observation)</Label>
              <Textarea
                value={progressData.counsellorRemark}
                onChange={(e) =>
                  setProgressData((p) => ({
                    ...p,
                    counsellorRemark: e.target.value,
                  }))
                }
                placeholder="Your comments, suggestions or next steps..."
                className="mt-2 min-h-32"
              />
            </div>
          </div>

          <DialogFooter className="bg-white">
            <Button variant="outline" onClick={() => setProgressModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveProgress}
              disabled={savingProgress}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {savingProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Counsellor Progress
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== TELECALLER REMARK MODAL ==================== */}
      <Dialog open={remarkModal} onOpenChange={() => setRemarkModal(false)}>
        <DialogContent className="max-w-lg bg-white text-black border border-slate-200">
          <DialogHeader>
            <DialogTitle>Telecaller Follow-up</DialogTitle>
            <DialogDescription>Update telecaller remark only</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4 bg-white">
            <div>
              <Label>Telecaller Remark</Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="min-h-32 mt-2"
                placeholder="What was discussed..."
              />
            </div>
            <div>
              <Label>Next Follow-up Date</Label>
              <Input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter className="bg-white">
            <Button variant="outline" onClick={() => setRemarkModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveFollowUp} disabled={savingRemark}>
              {savingRemark ? "Saving..." : "Save Telecaller Follow-up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== ALL STUDENTS PROGRESS MODAL ==================== */}
      <Dialog open={showAllProgress} onOpenChange={setShowAllProgress}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle>All Students Progress Overview</DialogTitle>
          </DialogHeader>
          <div className="mt-6">{renderTable(allLeads, true)}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CounsellorLead;
