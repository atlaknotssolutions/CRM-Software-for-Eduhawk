// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useForm } from "react-hook-form";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
// import { Badge } from "../../components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/ui/form";

// import {
//   Plus,
//   Upload,
//   Edit2,
//   Trash2,
//   Search,
//   Users,
//   UserCheck,
//   Flame,
//   Loader2,
// } from "lucide-react";

// const BASE_URL = "http://localhost:8000/api";

// const STATUS_OPTIONS = [
//   "New",
//   "Interested",
//   "Call Back",
//   "Not Interested",
//   "Converted",
//   "Dropped",
// ];
// const TAG_OPTIONS = ["Hot", "Warm", "Cold"];

// const defaultForm = {
//   name: "",
//   phone: "",

// };

// const AddStudent = () => {
//   const [activeTab, setActiveTab] = useState("leads");

//   const [leads, setLeads] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [tagFilter, setTagFilter] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [stats, setStats] = useState({
//     total: 0,
//     newCount: 0,
//     converted: 0,
//     hot: 0,
//   });

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [file, setFile] = useState(null);
//   const [dragging, setDragging] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadMsg, setUploadMsg] = useState(null);
//   const [bulkUploadResult, setBulkUploadResult] = useState(null);
//   const [telecallerCount, setTelecallerCount] = useState(0);

//   const navigate = useNavigate();

//   const formHook = useForm({
//     defaultValues: defaultForm,
//   });

//   const authHeader = {
//     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//   };

//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = { page, limit: 10 };
//       if (search) params.search = search;
//       if (statusFilter) params.status = statusFilter;
//       if (tagFilter) params.leadTag = tagFilter;

//       const res = await axios.get(`${BASE_URL}/leads`, {
//         ...authHeader,
//         params,
//       });

//       setLeads(res.data.data || []);
//       setTotal(res.data.total || 0);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to fetch leads");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, statusFilter, tagFilter]);

//   const fetchStats = useCallback(async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/leads`, {
//         ...authHeader,
//         params: { limit: 1000 },
//       });
//       const all = res.data.data || [];
//       setStats({
//         total: res.data.total || 0,
//         newCount: all.filter((l) => l.status === "New").length,
//         converted: all.filter((l) => l.status === "Converted").length,
//         hot: all.filter((l) => l.leadTag === "Hot").length,
//       });
//     } catch (_) {}
//   }, []);

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   useEffect(() => {
//     const fetchTelecallerCount = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/employees`, {
//           ...authHeader,
//           params: { role: "Telecaller", status: "active" },
//         });
//         setTelecallerCount((res.data.data || []).length);
//       } catch (err) {
//         console.error("Failed to fetch telecaller count", err);
//         setTelecallerCount(0);
//       }
//     };

//     fetchTelecallerCount();
//   }, []);

//   const reload = () => {
//     fetchLeads();
//     fetchStats();
//   };

//   const openAdd = () => {
//     setEditingId(null);
//     formHook.reset(defaultForm);
//     setShowModal(true);
//   };

//   const openEdit = (lead) => {
//     setEditingId(lead._id);
//     formHook.reset({
//       name: lead.name || "",
//       phone: lead.phone || "",
//       parentName: lead.parentName || "",
//       city: lead.city || "",
//       email: lead.email || "",
//       neetStatus: lead.neetStatus || "",
//       budget: lead.budget || "",
//       preferredCountry: lead.preferredCountry || "",
//       collegeName: lead.collegeName || "",
//       emergencyContact: lead.emergencyContact || "",
//       status: lead.status || "New",
//       leadTag: lead.leadTag || "Warm",
//     });
//     setShowModal(true);
//   };

//   const saveLead = async (data) => {
//     if (!data.name.trim() || !data.phone.trim()) {
//       return toast.error("Name and Phone are required");
//     }
//     try {
//       setSaving(true);
//       if (editingId) {
//         await axios.put(`${BASE_URL}/leads/${editingId}`, data, authHeader);
//         toast.success("Lead updated successfully!");
//       } else {
//         await axios.post(`${BASE_URL}/leads/add`, data, authHeader);
//         toast.success("Lead added successfully!");
//       }
//       setShowModal(false);
//       reload();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Save failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteLead = async (id) => {
//     if (!window.confirm("Delete this lead?")) return;
//     try {
//       await axios.delete(`${BASE_URL}/leads/${id}`, authHeader);
//       toast.success("Lead deleted");
//       reload();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   const handleFileDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) setFile(droppedFile);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files?.[0]) setFile(e.target.files[0]);
//   };

//   const clearFile = () => {
//     setFile(null);
//   };

//   const handleUpload = async () => {
//     if (!file) return toast.error("Please select a file");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setUploading(true);
//       const res = await axios.post(
//         `${BASE_URL}/leads/bulk-upload-unassigned`,
//         formData,
//         authHeader,
//       );
//       setUploadMsg({
//         type: "success",
//         text: `✅ Imported ${res.data.imported || 0} leads! Ready for manual assignment.`,
//       });

//       const uploadResult = {
//         totalRows: res.data.totalRows,
//         validLeads: res.data.validLeads,
//         imported: res.data.imported,
//         skipped: res.data.skipped,
//         leadIds: res.data.leadIds || [],
//         note: res.data.note || "",
//       };
//       setBulkUploadResult(uploadResult);
//       localStorage.setItem(
//         "leadBulkUploadResult",
//         JSON.stringify(uploadResult),
//       );
//       clearFile();
//       reload();
//     } catch (err) {
//       setUploadMsg({
//         type: "error",
//         text: "❌ " + (err.response?.data?.message || "Upload failed"),
//       });
//       setBulkUploadResult(null);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const variants = {
//       Converted: "default",
//       New: "secondary",
//       Interested: "outline",
//       "Call Back": "secondary",
//       "Not Interested": "destructive",
//       Dropped: "outline",
//     };
//     return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
//   };

//   const getTagBadge = (tag) => {
//     const variants = { Hot: "destructive", Warm: "default", Cold: "secondary" };
//     return <Badge variant={variants[tag] || "secondary"}>{tag}</Badge>;
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-7xl">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">
//               Lead Management
//             </h1>
//             <p className="text-muted-foreground">
//               Add, Manage & Bulk Upload Student Leads
//             </p>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full max-w-md grid-cols-2">
//             <TabsTrigger value="leads">All Leads</TabsTrigger>
//             <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
//           </TabsList>

//           {/* ==================== LEADS TAB ==================== */}
//           <TabsContent value="leads" className="space-y-8">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               {[
//                 {
//                   label: "Total Leads",
//                   value: stats.total,
//                   icon: Users,
//                   color: "blue",
//                 },
//                 {
//                   label: "New Leads",
//                   value: stats.newCount,
//                   icon: Users,
//                   color: "amber",
//                 },
//                 {
//                   label: "Converted",
//                   value: stats.converted,
//                   icon: UserCheck,
//                   color: "emerald",
//                 },
//                 {
//                   label: "Hot Leads",
//                   value: stats.hot,
//                   icon: Flame,
//                   color: "rose",
//                 },
//               ].map((stat) => (
//                 <Card key={stat.label} className="dashboard-card">
//                   <CardContent className="p-6 flex items-center gap-4">
//                     <div
//                       className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-950 rounded-xl`}
//                     >
//                       <stat.icon
//                         className={`h-8 w-8 text-${stat.color}-600 dark:text-${stat.color}-400`}
//                       />
//                     </div>
//                     <div>
//                       <p className="text-3xl font-bold text-foreground">
//                         {stat.value}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {stat.label}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             {/* Filters */}
//             <Card className="dashboard-card">
//               <CardContent className="p-6">
//                 <div className="flex flex-wrap gap-4 items-end">
//                   <div className="flex-1 min-w-70">
//                     <Label>Search</Label>
//                     <div className="relative">
//                       <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         placeholder="Name, Phone or Email..."
//                         value={search}
//                         onChange={(e) => {
//                           setSearch(e.target.value);
//                           setPage(1);
//                         }}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Label>Status</Label>
//                     <Select
//                       value={statusFilter}
//                       onValueChange={(v) => {
//                         setStatusFilter(v);
//                         setPage(1);
//                       }}
//                     >
//                       <SelectTrigger className="w-44">
//                         <SelectValue placeholder="All Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {STATUS_OPTIONS.map((s) => (
//                           <SelectItem key={s} value={s}>
//                             {s}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label>Lead Tag</Label>
//                     <Select
//                       value={tagFilter}
//                       onValueChange={(v) => {
//                         setTagFilter(v);
//                         setPage(1);
//                       }}
//                     >
//                       <SelectTrigger className="w-40">
//                         <SelectValue placeholder="All Tags" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {TAG_OPTIONS.map((t) => (
//                           <SelectItem key={t} value={t}>
//                             {t}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <Button onClick={openAdd} className="ml-auto btn-gradient">
//                     <Plus className="mr-2 h-4 w-4" /> Add Lead
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Leads Table */}
//             <Card className="dashboard-card">
//               <CardHeader>
//                 <CardTitle>Leads ({total})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>#</TableHead>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Phone</TableHead>
//                       <TableHead>Parent</TableHead>
//                       <TableHead>City</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Tag</TableHead>
//                       <TableHead>Country</TableHead>
//                       <TableHead>Budget</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-12">
//                           <Loader2 className="animate-spin mx-auto h-6 w-6" />
//                         </TableCell>
//                       </TableRow>
//                     ) : leads.length === 0 ? (
//                       <TableRow>
//                         <TableCell
//                           colSpan={10}
//                           className="text-center py-12 text-muted-foreground"
//                         >
//                           No leads found
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       leads.map((lead, idx) => (
//                         <TableRow key={lead._id}>
//                           <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
//                           <TableCell className="font-medium">
//                             {lead.name}
//                           </TableCell>
//                           <TableCell>{lead.phone}</TableCell>
//                           <TableCell>{lead.parentName || "—"}</TableCell>
//                           <TableCell>{lead.city || "—"}</TableCell>
//                           <TableCell>{getStatusBadge(lead.status)}</TableCell>
//                           <TableCell>{getTagBadge(lead.leadTag)}</TableCell>
//                           <TableCell>{lead.preferredCountry || "—"}</TableCell>
//                           <TableCell>
//                             {lead.budget
//                               ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
//                               : "—"}
//                           </TableCell>
//                           <TableCell className="text-right space-x-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => openEdit(lead)}
//                             >
//                               <Edit2 className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => deleteLead(lead._id)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>

//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-6">
//                     <p className="text-sm text-muted-foreground">
//                       Page {page} of {totalPages}
//                     </p>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         disabled={page === 1}
//                         onClick={() => setPage((p) => p - 1)}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         disabled={page === totalPages}
//                         onClick={() => setPage((p) => p + 1)}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* ==================== BULK UPLOAD TAB ==================== */}
//           <TabsContent value="upload">
//             <Card className="dashboard-card max-w-2xl mx-auto">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Upload className="h-5 w-5" /> Bulk Upload Leads
//                 </CardTitle>
//                 <p className="text-sm text-muted-foreground">
//                   Upload Excel or CSV file. Required fields:{" "}
//                   <strong>Name</strong>, <strong>Phone</strong>
//                 </p>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div
//                   className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
//                     ${dragging ? "border-primary bg-primary/5" : "border-border"}`}
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                     setDragging(true);
//                   }}
//                   onDragLeave={() => setDragging(false)}
//                   onDrop={handleFileDrop}
//                   onClick={() =>
//                     document.getElementById("bulkFileInput")?.click()
//                   }
//                 >
//                   <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                   <p className="font-medium text-lg text-foreground">
//                     {file ? file.name : "Drag & drop your file here"}
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     or click to browse
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     .xlsx, .xls, .csv supported
//                   </p>
//                 </div>

//                 <input
//                   type="file"
//                   id="bulkFileInput"
//                   accept=".csv,.xlsx,.xls"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />

//                 {file && (
//                   <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
//                     <div className="flex items-center gap-3">
//                       <span>📄</span>
//                       <div>
//                         <p className="font-medium">{file.name}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>
//                     </div>
//                     <Button variant="ghost" size="sm" onClick={clearFile}>
//                       Remove
//                     </Button>
//                   </div>
//                 )}

//                 <Button
//                   onClick={handleUpload}
//                   disabled={!file || uploading}
//                   className="w-full btn-gradient"
//                   size="lg"
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     "Upload Leads"
//                   )}
//                 </Button>

//                 {uploadMsg && (
//                   <p
//                     className={`text-center font-medium ${uploadMsg.type === "success" ? "text-green-600" : "text-red-600"}`}
//                   >
//                     {uploadMsg.text}
//                   </p>
//                 )}

//                 {bulkUploadResult?.leadIds?.length > 0 && (
//                   <Button
//                     onClick={() => navigate("/leadbulkassignment")}
//                     className="w-full mt-4"
//                     size="lg"
//                   >
//                     Open Manual Assignment
//                   </Button>
//                 )}

//                 {/* ==================== IMPROVED TELECALLER DISTRIBUTION ==================== */}
//                 {bulkUploadResult && (
//                   <div className="space-y-4 pt-4 border-t border-border">
//                     {/* Summary Stats */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">
//                           Total Rows
//                         </p>
//                         <p className="text-2xl font-bold">
//                           {bulkUploadResult.totalRows}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">
//                           Valid Leads
//                         </p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {bulkUploadResult.validLeads}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">
//                           Imported
//                         </p>
//                         <p className="text-2xl font-bold text-green-600">
//                           {bulkUploadResult.imported}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">Skipped</p>
//                         <p className="text-2xl font-bold text-orange-600">
//                           {bulkUploadResult.skipped}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">
//                           Active Telecallers
//                         </p>
//                         <p className="text-2xl font-bold text-purple-600">
//                           {telecallerCount}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
//                         <p className="text-sm text-muted-foreground">
//                           Ready for Manual Assignment
//                         </p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {bulkUploadResult.imported}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Telecaller Distribution */}
//                     {bulkUploadResult.telecallerDistribution?.length > 0 && (
//                       <div className="mt-6">
//                         <p className="text-lg font-semibold mb-3 flex items-center gap-2">
//                           <Users className="h-5 w-5" />
//                           Telecaller Wise Distribution
//                         </p>

//                         <div className="border rounded-xl overflow-hidden">
//                           <Table>
//                             <TableHeader>
//                               <TableRow>
//                                 <TableHead>Telecaller Name</TableHead>
//                                 <TableHead className="text-right">
//                                   Leads Assigned
//                                 </TableHead>
//                                 <TableHead className="text-right">
//                                   Percentage
//                                 </TableHead>
//                               </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                               {bulkUploadResult.telecallerDistribution
//                                 .sort(
//                                   (a, b) => b.assignedLeads - a.assignedLeads,
//                                 )
//                                 .map((item, index) => {
//                                   const percentage =
//                                     bulkUploadResult.imported > 0
//                                       ? (
//                                           (item.assignedLeads /
//                                             bulkUploadResult.imported) *
//                                           100
//                                         ).toFixed(1)
//                                       : 0;

//                                   return (
//                                     <TableRow key={item.telecallerId || index}>
//                                       <TableCell className="font-medium">
//                                         {item.name || `Employee ${index + 1}`}
//                                       </TableCell>
//                                       <TableCell className="text-right font-semibold text-lg">
//                                         {item.assignedLeads}
//                                       </TableCell>
//                                       <TableCell className="text-right text-muted-foreground">
//                                         {percentage}%
//                                       </TableCell>
//                                     </TableRow>
//                                   );
//                                 })}
//                             </TableBody>
//                           </Table>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Add / Edit Modal */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto bg-white">
//           <DialogHeader>
//             <DialogTitle>
//               {editingId ? "Edit Lead" : "Add New Lead"}
//             </DialogTitle>
//             <DialogDescription>
//               Fill all the required information
//             </DialogDescription>
//           </DialogHeader>

//           <Form {...formHook}>
//             <form
//               onSubmit={formHook.handleSubmit(saveLead)}
//               className="space-y-6 py-4"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={formHook.control}
//                   name="name"
//                   rules={{ required: "Name is required" }}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Name <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input placeholder="Full Name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="phone"
//                   rules={{ required: "Phone is required" }}
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Phone <span className="text-red-500">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input placeholder="9876543210" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="city"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>City</FormLabel>
//                       <FormControl>
//                         <Input placeholder="City" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="neetStatus"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>NEET Status</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select NEET Status" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {["Qualified", "Not Qualified", "Not Attempted", "Dropper", "Pre Neet"].map(
//                               (status) => (
//                                 <SelectItem key={status} value={status}>
//                                   {status}
//                                 </SelectItem>
//                               ),
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="preferredCountry"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Preferred Country</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select Preferred Country" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {["Russia", "Bangladesh", "Nepal", "Tajikistan","Kazakhstan","Georgia","Vietnam", "Uzbekistan", "Kyrgyzstan","Nepal","Egypt","India"].map(
//                               (country) => (
//                                 <SelectItem key={country} value={country}>
//                                   {country}
//                                 </SelectItem>
//                               ),
//                             )}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="collegeName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>College Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="College Name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={formHook.control}
//                   name="budget"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Budget (₹)</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="1500000" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                    <FormField
//                   control={formHook.control}
//                   name="emergencyContact"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Gap year</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="Gap year" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="btn-gradient"
//                 >
//                   {saving
//                     ? "Saving..."
//                     : editingId
//                       ? "Update Lead"
//                       : "Add Lead"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default AddStudent;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import {
  Plus,
  Upload,
  Edit2,
  Trash2,
  Search,
  Users,
  UserCheck,
  Flame,
  Loader2,
} from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

const STATUS_OPTIONS = [
  "New",
  "Interested",
  "Call Back",
  "Not Interested",
  "Converted",
  "Dropped",
];
const TAG_OPTIONS = ["Hot", "Warm", "Cold"];

// ==================== VALIDATION SCHEMA ====================
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter valid Indian phone number (starts with 6-9)"),
  parentName: z
    .string()
    .min(2, "Parent name is required")
    .max(100)
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  city: z.string().min(2, "City is required").max(50),
  neetStatus: z.enum([
    "Qualified",
    "Not Qualified",
    "Not Attempted",
    "Dropper",
    "Pre Neet",
  ]),
  preferredCountry: z.string().min(1, "Please select preferred country"),
  collegeName: z.string().optional(),
  budget: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Budget must be a number"),
  gapYear: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Gap year must be a number"),
  status: z.enum([
    "New",
    "Interested",
    "Call Back",
    "Not Interested",
    "Converted",
    "Dropped",
  ]),
  leadTag: z.enum(["Hot", "Warm", "Cold"]),
});

const defaultForm = {
  name: "",
  phone: "",
  parentName: "",
  email: "",
  city: "",
  neetStatus: "Not Attempted",
  preferredCountry: "",
  collegeName: "",
  budget: "",
  gapYear: "",
  status: "New",
  leadTag: "Warm",
};

const AddStudent = () => {
  const [activeTab, setActiveTab] = useState("leads");

  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    converted: 0,
    hot: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const [telecallerCount, setTelecallerCount] = useState(0);

  const navigate = useNavigate();

  const formHook = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: defaultForm,
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (tagFilter) params.leadTag = tagFilter;

      const res = await axios.get(`${BASE_URL}/leads`, {
        ...authHeader,
        params,
      });

      setLeads(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, tagFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/leads`, {
        ...authHeader,
        params: { limit: 1000 },
      });
      const all = res.data.data || [];
      setStats({
        total: res.data.total || 0,
        newCount: all.filter((l) => l.status === "New").length,
        converted: all.filter((l) => l.status === "Converted").length,
        hot: all.filter((l) => l.leadTag === "Hot").length,
      });
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const fetchTelecallerCount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/employees`, {
          ...authHeader,
          params: { role: "Telecaller", status: "active" },
        });
        setTelecallerCount((res.data.data || []).length);
      } catch (err) {
        console.error("Failed to fetch telecaller count", err);
        setTelecallerCount(0);
      }
    };

    fetchTelecallerCount();
  }, []);

  const reload = () => {
    fetchLeads();
    fetchStats();
  };

  const openAdd = () => {
    setEditingId(null);
    formHook.reset(defaultForm);
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setEditingId(lead._id);
    formHook.reset({
      name: lead.name || "",
      phone: lead.phone || "",
      parentName: lead.parentName || "",
      email: lead.email || "",
      city: lead.city || "",
      neetStatus: lead.neetStatus || "Not Attempted",
      preferredCountry: lead.preferredCountry || "",
      collegeName: lead.collegeName || "",
      budget: lead.budget?.toString() || "",
      gapYear:
        lead.gapYear?.toString() || lead.emergencyContact?.toString() || "",
      status: lead.status || "New",
      leadTag: lead.leadTag || "Warm",
    });
    setShowModal(true);
  };

  const saveLead = async (data) => {
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${BASE_URL}/leads/${editingId}`, data, authHeader);
        toast.success("Lead updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/leads/add`, data, authHeader);
        toast.success("Lead added successfully!");
      }
      setShowModal(false);
      formHook.reset(defaultForm);
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await axios.delete(`${BASE_URL}/leads/${id}`, authHeader);
      toast.success("Lead deleted");
      reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${BASE_URL}/leads/bulk-upload-unassigned`,
        formData,
        authHeader,
      );
      setUploadMsg({
        type: "success",
        text: `✅ Imported ${res.data.imported || 0} leads! Ready for manual assignment.`,
      });

      const uploadResult = {
        totalRows: res.data.totalRows,
        validLeads: res.data.validLeads,
        imported: res.data.imported,
        skipped: res.data.skipped,
        leadIds: res.data.leadIds || [],
        note: res.data.note || "",
      };
      setBulkUploadResult(uploadResult);
      localStorage.setItem(
        "leadBulkUploadResult",
        JSON.stringify(uploadResult),
      );
      clearFile();
      reload();
    } catch (err) {
      setUploadMsg({
        type: "error",
        text: "❌ " + (err.response?.data?.message || "Upload failed"),
      });
      setBulkUploadResult(null);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Converted: "default",
      New: "secondary",
      Interested: "outline",
      "Call Back": "secondary",
      "Not Interested": "destructive",
      Dropped: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getTagBadge = (tag) => {
    const variants = { Hot: "destructive", Warm: "default", Cold: "secondary" };
    return <Badge variant={variants[tag] || "secondary"}>{tag}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Add, Manage & Bulk Upload Student Leads
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="leads">All Leads</TabsTrigger>
            <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          </TabsList>

          {/* ==================== LEADS TAB ==================== */}
          <TabsContent value="leads" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Leads",
                  value: stats.total,
                  icon: Users,
                  color: "blue",
                },
                {
                  label: "New Leads",
                  value: stats.newCount,
                  icon: Users,
                  color: "amber",
                },
                {
                  label: "Converted",
                  value: stats.converted,
                  icon: UserCheck,
                  color: "emerald",
                },
                {
                  label: "Hot Leads",
                  value: stats.hot,
                  icon: Flame,
                  color: "rose",
                },
              ].map((stat) => (
                <Card key={stat.label} className="dashboard-card">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div
                      className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-950 rounded-xl`}
                    >
                      <stat.icon
                        className={`h-8 w-8 text-${stat.color}-600 dark:text-${stat.color}-400`}
                      />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <Card className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-70">
                    <Label>Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Name, Phone or Email..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={(v) => {
                        setStatusFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="All Status" />
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
                    <Label>Lead Tag</Label>
                    <Select
                      value={tagFilter}
                      onValueChange={(v) => {
                        setTagFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAG_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={openAdd} className="ml-auto btn-gradient">
                    <Plus className="mr-2 h-4 w-4" /> Add Lead
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Leads ({total})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <Loader2 className="animate-spin mx-auto h-6 w-6" />
                        </TableCell>
                      </TableRow>
                    ) : leads.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No leads found
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead, idx) => (
                        <TableRow key={lead._id}>
                          <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                          <TableCell className="font-medium">
                            {lead.name}
                          </TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell>{lead.parentName || "—"}</TableCell>
                          <TableCell>{lead.city || "—"}</TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>{getTagBadge(lead.leadTag)}</TableCell>
                          <TableCell>{lead.preferredCountry || "—"}</TableCell>
                          <TableCell>
                            {lead.budget
                              ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(lead)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteLead(lead._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== BULK UPLOAD TAB ==================== */}
          <TabsContent value="upload">
            <Card className="dashboard-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" /> Bulk Upload Leads
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload Excel or CSV file. Required fields:{" "}
                  <strong>Name</strong>, <strong>Phone</strong>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                    ${dragging ? "border-primary bg-primary/5" : "border-border"}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() =>
                    document.getElementById("bulkFileInput")?.click()
                  }
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium text-lg text-foreground">
                    {file ? file.name : "Drag & drop your file here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    .xlsx, .xls, .csv supported
                  </p>
                </div>

                <input
                  type="file"
                  id="bulkFileInput"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file && (
                  <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span>📄</span>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFile}>
                      Remove
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full btn-gradient"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Leads"
                  )}
                </Button>

                {uploadMsg && (
                  <p
                    className={`text-center font-medium ${uploadMsg.type === "success" ? "text-green-600" : "text-red-600"}`}
                  >
                    {uploadMsg.text}
                  </p>
                )}

                {bulkUploadResult?.leadIds?.length > 0 && (
                  <Button
                    onClick={() => navigate("/leadbulkassignment")}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Open Manual Assignment
                  </Button>
                )}

                {bulkUploadResult && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">
                          Total Rows
                        </p>
                        <p className="text-2xl font-bold">
                          {bulkUploadResult.totalRows}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">
                          Valid Leads
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {bulkUploadResult.validLeads}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">
                          Imported
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {bulkUploadResult.imported}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">Skipped</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {bulkUploadResult.skipped}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">
                          Active Telecallers
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {telecallerCount}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border text-center">
                        <p className="text-sm text-muted-foreground">
                          Ready for Assignment
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {bulkUploadResult.imported}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add / Edit Modal with Validation */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
            <DialogDescription>
              Fill all the required information
            </DialogDescription>
          </DialogHeader>

          <Form {...formHook}>
            <form
              onSubmit={formHook.handleSubmit(saveLead)}
              className="space-y-6 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={formHook.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Parent Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="neetStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        NEET Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NEET Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Qualified",
                            "Not Qualified",
                            "Not Attempted",
                            "Dropper",
                            "Pre Neet",
                          ].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="preferredCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Preferred Country{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Preferred Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Russia",
                            "Bangladesh",
                            "Nepal",
                            "Tajikistan",
                            "Kazakhstan",
                            "Georgia",
                            "Vietnam",
                            "Uzbekistan",
                            "Kyrgyzstan",
                            "Egypt",
                            "India",
                          ].map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="collegeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College/University Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="College/University Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formHook.control}
                  name="gapYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gap Year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="btn-gradient"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Lead"
                      : "Add Lead"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddStudent;
