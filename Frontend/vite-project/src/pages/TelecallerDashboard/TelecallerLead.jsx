// // import { useState, useEffect, useMemo } from "react";
// // import { useAuth } from "@/contexts/AuthContext";
// // import {
// //   Phone,
// //   Download,
// //   Clock,
// //   Search,
// //   Users,
// //   Target,
// //   ArrowUpDown,
// //   IndianRupeeIcon,
// //   MessageSquare,
// //   Calendar,
// // } from "lucide-react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Input } from "@/components/ui/input";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const BASE_URL = "http://localhost:8000/api";
// // const ITEMS_PER_PAGE = 20;

// // // Follow-up Modal
// // const FollowUpModal = ({ isOpen, onClose, onSubmit, lead }) => {
// //   const [remark, setRemark] = useState("");
// //   const [nextFollowUpDate, setNextFollowUpDate] = useState("");

// //   // Pre-fill existing data
// //   useEffect(() => {
// //     if (lead) {
// //       setRemark(lead.lastRemark || "");
// //       setNextFollowUpDate(
// //         lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
// //       );
// //     }
// //   }, [lead]);

// //   const handleSave = () => {
// //     if (!remark.trim() && !nextFollowUpDate) {
// //       toast.error("Please add remark or select date");
// //       return;
// //     }
// //     onSubmit(remark.trim(), nextFollowUpDate);
// //     onClose();
// //   };

// //   if (!isOpen || !lead) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7">
// //         <div className="flex items-center gap-3 mb-6">
// //           <MessageSquare className="text-sky-600" size={28} />
// //           <div>
// //             <h3 className="text-2xl font-semibold">Follow-up</h3>
// //             <p className="text-slate-600">{lead.name}</p>
// //           </div>
// //         </div>

// //         {/* Previous Remark (if exists) */}
// //         {lead.lastRemark && (
// //           <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
// //             <p className="text-xs text-slate-500 mb-1">LAST REMARK</p>
// //             <p className="text-slate-700">{lead.lastRemark}</p>
// //           </div>
// //         )}

// //         <div className="space-y-5">
// //           <div>
// //             <label className="block text-sm font-medium text-slate-700 mb-2">
// //               New Remark / Discussion Summary
// //             </label>
// //             <textarea
// //               value={remark}
// //               onChange={(e) => setRemark(e.target.value)}
// //               placeholder="Enter what was discussed in this call..."
// //               className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-slate-700 mb-2">
// //               Next Follow-up Date
// //             </label>
// //             <Input
// //               type="date"
// //               value={nextFollowUpDate}
// //               onChange={(e) => setNextFollowUpDate(e.target.value)}
// //               min={new Date().toISOString().split("T")[0]}
// //               className="h-12"
// //             />
// //           </div>
// //         </div>

// //         <div className="flex gap-3 mt-8">
// //           <Button variant="outline" onClick={onClose} className="flex-1 h-12">
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSave}
// //             className="flex-1 h-12 bg-sky-600 hover:bg-sky-700"
// //           >
// //             Save Follow-up
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default function TelecallerLead() {
// //   const { user } = useAuth();
// //   const isTelecaller = user?.role === "Telecaller";

// //   const [leads, setLeads] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [neetFilter, setNeetFilter] = useState("all");
// //   const [countryFilter, setCountryFilter] = useState("all");

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [sortConfig, setSortConfig] = useState({
// //     key: "name",
// //     direction: "asc",
// //   });

// //   const [todayConvertedCount, setTodayConvertedCount] = useState(0);

// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedLead, setSelectedLead] = useState(null);

// //   const authHeader = {
// //     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
// //   };

// //   const fetchLeads = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`${BASE_URL}/leads/telecallers`, {
// //         method: "GET",
// //         ...authHeader,
// //       });

// //       if (!res.ok) throw new Error("Failed to fetch leads");

// //       const data = await res.json();
// //       setLeads(data.data || []);
// //       setTodayConvertedCount(data.todayConverted || 0);
// //     } catch (err) {
// //       toast.error(err.message || "Failed to load leads");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLeads();
// //   }, []);

// //   const sortedLeads = useMemo(() => {
// //     let result = [...leads];
// //     if (sortConfig.key) {
// //       result.sort((a, b) => {
// //         let valA = a[sortConfig.key] || "";
// //         let valB = b[sortConfig.key] || "";

// //         if (sortConfig.key === "budget") {
// //           valA = Number(valA) || 0;
// //           valB = Number(valB) || 0;
// //         } else {
// //           valA = String(valA).toLowerCase();
// //           valB = String(valB).toLowerCase();
// //         }

// //         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
// //         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
// //         return 0;
// //       });
// //     }
// //     return result;
// //   }, [leads, sortConfig]);

// //   const filteredLeads = useMemo(() => {
// //     return sortedLeads.filter((lead) => {
// //       const matchesSearch =
// //         (lead.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
// //         (lead.phone || "").includes(searchTerm) ||
// //         (lead.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());

// //       const matchesNeet =
// //         neetFilter === "all" || (lead.neetStatus || lead.neet) === neetFilter;
// //       const matchesCountry =
// //         countryFilter === "all" ||
// //         (lead.preferredCountry || lead.country) === countryFilter;

// //       return matchesSearch && matchesNeet && matchesCountry;
// //     });
// //   }, [sortedLeads, searchTerm, neetFilter, countryFilter]);

// //   const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
// //   const paginatedLeads = filteredLeads.slice(
// //     (currentPage - 1) * ITEMS_PER_PAGE,
// //     currentPage * ITEMS_PER_PAGE,
// //   );

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, neetFilter, countryFilter, sortConfig]);

// //   const handleSort = (key) => {
// //     setSortConfig((prev) => ({
// //       key,
// //       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
// //     }));
// //   };

// //   const openFollowUpModal = (lead) => {
// //     setSelectedLead(lead);
// //     setShowModal(true);
// //   };

// //   const saveFollowUp = async (remark, nextFollowUpDate) => {
// //     if (!isTelecaller) {
// //       toast.error("Only Telecaller can update leads.");
// //       return;
// //     }
// //     if (!selectedLead) return;

// //     try {
// //       const payload = {};
// //       if (remark) payload.lastRemark = remark;
// //       if (nextFollowUpDate) payload.followUpDate = nextFollowUpDate;

// //       const res = await fetch(
// //         `${BASE_URL}/leads/${selectedLead._id || selectedLead.id}`,
// //         {
// //           method: "PUT",
// //           headers: {
// //             "Content-Type": "application/json",
// //             ...authHeader.headers,
// //           },
// //           body: JSON.stringify(payload),
// //         },
// //       );

// //       if (!res.ok) throw new Error("Failed to save");

// //       toast.success("Follow-up saved successfully!");
// //       await fetchLeads();
// //     } catch (err) {
// //       toast.error("Failed to save follow-up");
// //     }
// //   };

// //   // Other functions (updateLeadStatus, updateLeadTag, callLead, exportCSV) remain same
// //   const updateLeadStatus = async (id, newStatus) => {
// //     if (!isTelecaller) {
// //       toast.error("Only Telecaller can update leads.");
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`${BASE_URL}/leads/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json", ...authHeader.headers },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       if (!res.ok) throw new Error("Failed to update status");

// //       setLeads((prev) =>
// //         prev.map((lead) =>
// //           (lead._id || lead.id) === id ? { ...lead, status: newStatus } : lead,
// //         ),
// //       );
// //       toast.success(`Status updated to "${newStatus}"`);
// //       if (newStatus === "Converted") await fetchLeads();
// //     } catch (err) {
// //       toast.error(err.message || "Failed to update status");
// //     }
// //   };

// //   const updateLeadTag = async (id, newTag) => {
// //     if (!isTelecaller) {
// //       toast.error("Only Telecaller can update leads.");
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`${BASE_URL}/leads/${id}`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json", ...authHeader.headers },
// //         body: JSON.stringify({ leadTag: newTag }),
// //       });

// //       if (!res.ok) throw new Error("Failed to update tag");

// //       setLeads((prev) =>
// //         prev.map((lead) =>
// //           (lead._id || lead.id) === id ? { ...lead, leadTag: newTag } : lead,
// //         ),
// //       );
// //       toast.success(`Lead tag updated to "${newTag}"`);
// //     } catch (err) {
// //       toast.error(err.message || "Failed to update lead tag");
// //     }
// //   };

// //   const callLead = (phone) => {
// //     window.open(`tel:${phone}`, "_self");
// //   };

// //   const exportCSV = () => {
// //     if (leads.length === 0) return toast.info("No leads to export");

// //     const headers =
// //       "S.No,Name,Phone,Parent Name,City,Email,NEET Status,Budget,Preferred Country,Status,Lead Tag,Follow-up Date,Remark,Progress\n";
// //     const rows = leads
// //       .map(
// //         (lead, index) =>
// //           `"${index + 1}","${lead.name || ""}","${lead.phone || ""}","${lead.parentName || ""}","${lead.city || ""}","${lead.email || ""}","${lead.neetStatus || ""}","₹${lead.budget || 0}","${lead.preferredCountry || ""}","${lead.status || "New"}","${lead.leadTag || ""}","${lead.followUpDate || ""}","${lead.lastRemark || ""}","${lead.progress || "Initial Contact"}"`,
// //       )
// //       .join("\n");

// //     const blob = new Blob([headers + rows], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.download = `telecaller_leads_${new Date().toISOString().slice(0, 10)}.csv`;
// //     link.click();
// //     toast.success("CSV Exported Successfully!");
// //   };

// //   const getStatusBadge = (status) => {
// //     switch (status) {
// //       case "Converted":
// //         return (
// //           <Badge className="bg-emerald-100 text-emerald-700">Converted</Badge>
// //         );
// //       case "Not Interested":
// //         return (
// //           <Badge className="bg-red-100 text-red-700">Not Interested</Badge>
// //         );
// //       case "Call Back":
// //         return <Badge className="bg-amber-100 text-amber-700">Call Back</Badge>;
// //       case "Interested":
// //         return <Badge className="bg-blue-100 text-blue-700">Interested</Badge>;
// //       default:
// //         return <Badge variant="secondary">{status || "New"}</Badge>;
// //     }
// //   };

// //   const getLeadTagBadge = (tag) => {
// //     switch (tag) {
// //       case "Hot":
// //         return <Badge className="bg-red-100 text-red-700">Hot</Badge>;
// //       case "Warm":
// //         return <Badge className="bg-amber-100 text-amber-700">Warm</Badge>;
// //       case "Cold":
// //         return <Badge className="bg-sky-100 text-sky-700">Cold</Badge>;
// //       default:
// //         return <Badge variant="secondary">{tag || "None"}</Badge>;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header & Filters - Same as before */}
// //       <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
// //         <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
// //               T
// //             </div>
// //             <div>
// //               <h1 className="text-3xl font-semibold text-slate-900">
// //                 Telecaller Leads
// //               </h1>
// //               <p className="text-sm text-slate-500">
// //                 Real-time Lead Management
// //               </p>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-4">
// //             <div className="relative w-96">
// //               <Search
// //                 className="absolute left-4 top-3.5 text-slate-400"
// //                 size={20}
// //               />
// //               <Input
// //                 placeholder="Search by name, phone or city..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="pl-12 h-11 bg-white"
// //               />
// //             </div>

// //             <Select value={neetFilter} onValueChange={setNeetFilter}>
// //               <SelectTrigger className="w-52 h-11">
// //                 <SelectValue placeholder="All NEET" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All NEET</SelectItem>
// //                 <SelectItem value="Yes">Yes</SelectItem>
// //                 <SelectItem value="No">No</SelectItem>
// //                 <SelectItem value="Appeared">Appeared</SelectItem>
// //               </SelectContent>
// //             </Select>

// //             <Select value={countryFilter} onValueChange={setCountryFilter}>
// //               <SelectTrigger className="w-52 h-11">
// //                 <SelectValue placeholder="All Countries" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="all">All Countries</SelectItem>
// //                 {[
// //                   "Russia",
// //                   "Georgia",
// //                   "Nepal",
// //                   "Bangladesh",
// //                   "Kyrgyzstan",
// //                   "Uzbekistan",
// //                   "Kazakhstan",
// //                   "Tajikistan",
// //                   "Iran",
// //                   "Egypt",
// //                   "Belarus",
// //                   "China",
// //                   "Vietnam",
// //                   "Argentina",
// //                 ].map((c) => (
// //                   <SelectItem key={c} value={c}>
// //                     {c}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="max-w-screen-2xl mx-auto px-8 py-8">
// //         {/* Stats Cards - Same */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
// //           <Card>
// //             <CardContent className="p-6 flex items-center gap-4">
// //               <div className="p-3 bg-blue-100 rounded-2xl">
// //                 <Users className="h-8 w-8 text-blue-600" />
// //               </div>
// //               <div>
// //                 <p className="text-3xl font-semibold">{leads.length}</p>
// //                 <p className="text-sm text-slate-500">Total Leads</p>
// //               </div>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 flex items-center gap-4">
// //               <div className="p-3 bg-emerald-100 rounded-2xl">
// //                 <IndianRupeeIcon className="h-8 w-8 text-emerald-600" />
// //               </div>
// //               <div>
// //                 <p className="text-3xl font-semibold">
// //                   ₹
// //                   {(
// //                     leads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0) /
// //                     100000
// //                   ).toFixed(1)}
// //                   L
// //                 </p>
// //                 <p className="text-sm text-slate-500">Total Budget</p>
// //               </div>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 flex items-center gap-4">
// //               <div className="p-3 bg-amber-100 rounded-2xl">
// //                 <Target className="h-8 w-8 text-amber-600" />
// //               </div>
// //               <div>
// //                 <p className="text-3xl font-semibold">
// //                   {
// //                     leads.filter((l) =>
// //                       ["Yes", "Appeared"].includes(l.neetStatus || l.neet),
// //                     ).length
// //                   }
// //                 </p>
// //                 <p className="text-sm text-slate-500">Qualified</p>
// //               </div>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardContent className="p-6 flex items-center gap-4">
// //               <div className="p-3 bg-sky-100 rounded-2xl">
// //                 <Clock className="h-8 w-8 text-sky-600" />
// //               </div>
// //               <div>
// //                 <p className="text-3xl font-semibold">{todayConvertedCount}</p>
// //                 <p className="text-sm text-slate-500">Converted Today</p>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Table */}
// //         <div className="flex justify-between items-end mb-6">
// //           <div>
// //             <h2 className="text-3xl font-semibold">All Leads</h2>
// //             <p className="text-slate-500">
// //               Showing {paginatedLeads.length} of {filteredLeads.length} leads
// //             </p>
// //           </div>
// //           <Button
// //             onClick={exportCSV}
// //             variant="outline"
// //             className="flex items-center gap-2"
// //           >
// //             <Download size={18} /> Export CSV
// //           </Button>
// //         </div>

// //         <Card>
// //           <CardContent className="p-0">
// //             <Table>
// //               <TableHeader>
// //                 <TableRow>
// //                   <TableHead className="pl-8 w-16">S.No</TableHead>
// //                   <TableHead
// //                     className="cursor-pointer"
// //                     onClick={() => handleSort("name")}
// //                   >
// //                     Name <ArrowUpDown size={14} className="inline ml-1" />
// //                   </TableHead>
// //                   <TableHead>Phone</TableHead>
// //                   <TableHead>Parent</TableHead>
// //                   <TableHead
// //                     className="cursor-pointer"
// //                     onClick={() => handleSort("city")}
// //                   >
// //                     City <ArrowUpDown size={14} className="inline ml-1" />
// //                   </TableHead>
// //                   <TableHead>Email</TableHead>
// //                   <TableHead>NEET Status</TableHead>
// //                   <TableHead
// //                     className="cursor-pointer"
// //                     onClick={() => handleSort("budget")}
// //                   >
// //                     Budget <ArrowUpDown size={14} className="inline ml-1" />
// //                   </TableHead>
// //                   <TableHead>Country</TableHead>
// //                   <TableHead>Next Follow-up</TableHead>
// //                   <TableHead className="text-center">Remark</TableHead>
// //                   <TableHead>Progress</TableHead>
// //                   <TableHead>Status</TableHead>
// //                   <TableHead>Lead Tag</TableHead>
// //                   <TableHead className="text-center pr-8">Actions</TableHead>
// //                 </TableRow>
// //               </TableHeader>

// //               <TableBody>
// //                 {loading ? (
// //                   <TableRow>
// //                     <TableCell colSpan={15} className="text-center py-20">
// //                       Loading leads...
// //                     </TableCell>
// //                   </TableRow>
// //                 ) : paginatedLeads.length === 0 ? (
// //                   <TableRow>
// //                     <TableCell
// //                       colSpan={15}
// //                       className="text-center py-20 text-slate-400"
// //                     >
// //                       No leads found
// //                     </TableCell>
// //                   </TableRow>
// //                 ) : (
// //                   paginatedLeads.map((lead, index) => {
// //                     const serialNo =
// //                       (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
// //                     return (
// //                       <TableRow
// //                         key={lead._id || lead.id}
// //                         className="hover:bg-slate-50"
// //                       >
// //                         <TableCell className="pl-8 font-medium text-slate-500">
// //                           {serialNo}
// //                         </TableCell>
// //                         <TableCell className="font-medium">
// //                           {lead.name}
// //                         </TableCell>
// //                         <TableCell className="font-mono">
// //                           {lead.phone}
// //                         </TableCell>
// //                         <TableCell>{lead.parentName || "—"}</TableCell>
// //                         <TableCell>{lead.city || "—"}</TableCell>
// //                         <TableCell className="text-sm text-slate-600">
// //                           {lead.email || "—"}
// //                         </TableCell>
// //                         <TableCell>
// //                           <Badge>{lead.neetStatus || "—"}</Badge>
// //                         </TableCell>
// //                         <TableCell className="font-semibold">
// //                           {lead.budget
// //                             ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
// //                             : "—"}
// //                         </TableCell>
// //                         <TableCell>
// //                           <Badge variant="outline">
// //                             {lead.preferredCountry || "—"}
// //                           </Badge>
// //                         </TableCell>

// //                         {/* Next Follow-up Date */}
// //                         <TableCell>
// //                           {lead.followUpDate ? (
// //                             <Badge
// //                               variant="outline"
// //                               className="text-amber-600 font-medium"
// //                             >
// //                               {new Date(lead.followUpDate).toLocaleDateString(
// //                                 "en-IN",
// //                               )}
// //                             </Badge>
// //                           ) : (
// //                             <span className="text-slate-400 text-sm">—</span>
// //                           )}
// //                         </TableCell>

// //                         {/* Remark Button */}
// //                         <TableCell className="text-center">
// //                           {isTelecaller ? (
// //                             <Button
// //                               variant="ghost"
// //                               size="sm"
// //                               className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
// //                               onClick={() => openFollowUpModal(lead)}
// //                             >
// //                               <MessageSquare size={18} />
// //                             </Button>
// //                           ) : (
// //                             <span className="text-slate-500 text-xs">
// //                               Update restricted
// //                             </span>
// //                           )}
// //                         </TableCell>

// //                         <TableCell>
// //                           <Badge variant="outline" className="text-purple-600">
// //                             {lead.progress || "Initial Contact"}
// //                           </Badge>
// //                         </TableCell>

// //                         <TableCell>{getStatusBadge(lead.status)}</TableCell>
// //                         <TableCell>{getLeadTagBadge(lead.leadTag)}</TableCell>

// //                         <TableCell className="pr-8">
// //                           <div className="flex gap-2 justify-center items-center">
// //                             {isTelecaller ? (
// //                               <>
// //                                 <DropdownMenu>
// //                                   <DropdownMenuTrigger asChild>
// //                                     <Button variant="outline" size="sm">
// //                                       Status
// //                                     </Button>
// //                                   </DropdownMenuTrigger>
// //                                   <DropdownMenuContent>
// //                                     <DropdownMenuLabel>
// //                                       Update Status
// //                                     </DropdownMenuLabel>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadStatus(
// //                                           lead._id || lead.id,
// //                                           "Interested",
// //                                         )
// //                                       }
// //                                     >
// //                                       Interested
// //                                     </DropdownMenuItem>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadStatus(
// //                                           lead._id || lead.id,
// //                                           "Call Back",
// //                                         )
// //                                       }
// //                                     >
// //                                       Call Back
// //                                     </DropdownMenuItem>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadStatus(
// //                                           lead._id || lead.id,
// //                                           "Not Interested",
// //                                         )
// //                                       }
// //                                       className="text-red-600"
// //                                     >
// //                                       Not Interested
// //                                     </DropdownMenuItem>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadStatus(
// //                                           lead._id || lead.id,
// //                                           "Converted",
// //                                         )
// //                                       }
// //                                       className="text-emerald-600"
// //                                     >
// //                                       Converted
// //                                     </DropdownMenuItem>
// //                                   </DropdownMenuContent>
// //                                 </DropdownMenu>

// //                                 <DropdownMenu>
// //                                   <DropdownMenuTrigger asChild>
// //                                     <Button variant="outline" size="sm">
// //                                       Tag
// //                                     </Button>
// //                                   </DropdownMenuTrigger>
// //                                   <DropdownMenuContent>
// //                                     <DropdownMenuLabel>
// //                                       Update Lead Tag
// //                                     </DropdownMenuLabel>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadTag(
// //                                           lead._id || lead.id,
// //                                           "Hot",
// //                                         )
// //                                       }
// //                                     >
// //                                       Hot
// //                                     </DropdownMenuItem>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadTag(
// //                                           lead._id || lead.id,
// //                                           "Warm",
// //                                         )
// //                                       }
// //                                     >
// //                                       Warm
// //                                     </DropdownMenuItem>
// //                                     <DropdownMenuItem
// //                                       onClick={() =>
// //                                         updateLeadTag(
// //                                           lead._id || lead.id,
// //                                           "Cold",
// //                                         )
// //                                       }
// //                                     >
// //                                       Cold
// //                                     </DropdownMenuItem>
// //                                   </DropdownMenuContent>
// //                                 </DropdownMenu>
// //                               </>
// //                             ) : (
// //                               <span className="text-slate-500 text-xs">
// //                                 Update restricted
// //                               </span>
// //                             )}

// //                             <Button
// //                               variant="outline"
// //                               size="sm"
// //                               onClick={() => callLead(lead.phone)}
// //                             >
// //                               <Phone size={16} />
// //                             </Button>
// //                           </div>
// //                         </TableCell>
// //                       </TableRow>
// //                     );
// //                   })
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </CardContent>
// //         </Card>

// //         {/* Pagination */}
// //         {totalPages > 1 && (
// //           <div className="flex justify-center items-center gap-4 mt-8">
// //             <Button
// //               variant="outline"
// //               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
// //               disabled={currentPage === 1}
// //             >
// //               Previous
// //             </Button>
// //             <span className="text-sm text-slate-600">
// //               Page {currentPage} of {totalPages}
// //             </span>
// //             <Button
// //               variant="outline"
// //               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
// //               disabled={currentPage === totalPages}
// //             >
// //               Next
// //             </Button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modal */}
// //       <FollowUpModal
// //         isOpen={showModal}
// //         onClose={() => setShowModal(false)}
// //         onSubmit={saveFollowUp}
// //         lead={selectedLead}
// //       />

// //       <ToastContainer position="top-right" autoClose={3000} />
// //     </div>
// //   );
// // }

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   Phone,
//   Download,
//   Clock,
//   Search,
//   Users,
//   Target,
//   ArrowUpDown,
//   IndianRupeeIcon,
//   MessageSquare,
// } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const BASE_URL = "http://localhost:8000/api";
// const ITEMS_PER_PAGE = 20;

// // ==================== FollowUp Modal ====================
// const FollowUpModal = ({ isOpen, onClose, onSubmit, lead }) => {
//   const [remark, setRemark] = useState("");
//   const [nextFollowUpDate, setNextFollowUpDate] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (lead) {
//       setRemark(lead.lastRemark || "");
//       setNextFollowUpDate(
//         lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
//       );
//     }
//   }, [lead]);

//   const handleSave = async () => {
//     if (!remark.trim() && !nextFollowUpDate) {
//       toast.error("Please add a remark or select a follow-up date");
//       return;
//     }

//     setSaving(true);
//     await onSubmit(remark.trim(), nextFollowUpDate || null);
//     setSaving(false);
//     onClose();
//   };

//   if (!isOpen || !lead) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7">
//         <div className="flex items-center gap-3 mb-6">
//           <MessageSquare className="text-sky-600" size={28} />
//           <div>
//             <h3 className="text-2xl font-semibold">Follow-up</h3>
//             <p className="text-slate-600">{lead.name}</p>
//           </div>
//         </div>

//         {lead.lastRemark && (
//           <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
//             <p className="text-xs text-slate-500 mb-1">LAST REMARK</p>
//             <p className="text-slate-700">{lead.lastRemark}</p>
//           </div>
//         )}

//         <div className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               New Remark / Discussion Summary
//             </label>
//             <textarea
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               placeholder="Enter what was discussed in this call..."
//               className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Next Follow-up Date
//             </label>
//             <Input
//               type="date"
//               value={nextFollowUpDate}
//               onChange={(e) => setNextFollowUpDate(e.target.value)}
//               min={new Date().toISOString().split("T")[0]}
//               className="h-12"
//             />
//           </div>
//         </div>

//         <div className="flex gap-3 mt-8">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="flex-1 h-12"
//             disabled={saving}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-1 h-12 bg-sky-600 hover:bg-sky-700"
//           >
//             {saving ? "Saving..." : "Save Follow-up"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ==================== Main Component ====================
// export default function TelecallerLead() {
//   const { user } = useAuth();
//   const isTelecaller = user?.role === "Telecaller";

//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [neetFilter, setNeetFilter] = useState("all");
//   const [countryFilter, setCountryFilter] = useState("all");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({
//     key: "name",
//     direction: "asc",
//   });

//   const [todayConvertedCount, setTodayConvertedCount] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);

//   const authHeader = {
//     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//   };

//   const fetchLeads = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/leads/telecallers`, {
//         method: "GET",
//         ...authHeader,
//       });

//       if (!res.ok) throw new Error("Failed to fetch leads");

//       const data = await res.json();
//       setLeads(data.data || []);
//       setTodayConvertedCount(data.todayConverted || 0);
//     } catch (err) {
//       toast.error(err.message || "Failed to load leads");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   // Sorting
//   const sortedLeads = useMemo(() => {
//     let result = [...leads];

//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         let valA = a[sortConfig.key] ?? "";
//         let valB = b[sortConfig.key] ?? "";

//         if (sortConfig.key === "budget") {
//           valA = Number(valA) || 0;
//           valB = Number(valB) || 0;
//         } else if (sortConfig.key === "followUpDate") {
//           valA = valA ? new Date(valA) : new Date(0);
//           valB = valB ? new Date(valB) : new Date(0);
//         } else {
//           valA = String(valA).toLowerCase();
//           valB = String(valB).toLowerCase();
//         }

//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return result;
//   }, [leads, sortConfig]);

//   // Filtering
//   const filteredLeads = useMemo(() => {
//     return sortedLeads.filter((lead) => {
//       const matchesSearch =
//         (lead.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//         (lead.phone || "").includes(searchTerm) ||
//         (lead.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());

//       const matchesNeet =
//         neetFilter === "all" || (lead.neetStatus || lead.neet) === neetFilter;

//       const matchesCountry =
//         countryFilter === "all" ||
//         (lead.preferredCountry1 || lead.country) === countryFilter;

//       return matchesSearch && matchesNeet && matchesCountry;
//     });
//   }, [sortedLeads, searchTerm, neetFilter, countryFilter]);

//   const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
//   const paginatedLeads = filteredLeads.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, neetFilter, countryFilter, sortConfig]);

//   const handleSort = (key) => {
//     setSortConfig((prev) => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const updateLocalLead = (id, updates) => {
//     setLeads((prev) =>
//       prev.map((lead) =>
//         (lead._id || lead.id) === id ? { ...lead, ...updates } : lead,
//       ),
//     );
//   };

//   const saveFollowUp = async (remark, nextFollowUpDate) => {
//     if (!selectedLead) return;

//     try {
//       setActionLoading(true);
//       const payload = {};
//       if (remark) payload.lastRemark = remark;
//       if (nextFollowUpDate !== null) payload.followUpDate = nextFollowUpDate;

//       const res = await fetch(
//         `${BASE_URL}/leads/${selectedLead._id || selectedLead.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             ...authHeader.headers,
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!res.ok) throw new Error("Failed to save follow-up");

//       toast.success("Follow-up saved successfully!");
//       updateLocalLead(selectedLead._id || selectedLead.id, payload);
//     } catch (err) {
//       toast.error("Failed to save follow-up");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const updateLeadStatus = async (id, newStatus) => {
//     try {
//       setActionLoading(true);
//       const res = await fetch(`${BASE_URL}/leads/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...authHeader.headers },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) throw new Error("Failed to update status");

//       updateLocalLead(id, { status: newStatus });
//       toast.success(`Status updated to "${newStatus}"`);

//       if (newStatus === "Converted") await fetchLeads();
//     } catch (err) {
//       toast.error(err.message || "Failed to update status");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const updateLeadTag = async (id, newTag) => {
//     try {
//       setActionLoading(true);
//       const res = await fetch(`${BASE_URL}/leads/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", ...authHeader.headers },
//         body: JSON.stringify({ leadTag: newTag }),
//       });

//       if (!res.ok) throw new Error("Failed to update tag");

//       updateLocalLead(id, { leadTag: newTag });
//       toast.success(`Lead tag updated to "${newTag}"`);
//     } catch (err) {
//       toast.error(err.message || "Failed to update tag");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const callLead = (phone) => {
//     window.open(`tel:${phone}`, "_self");
//   };

//   const openFollowUpModal = (lead) => {
//     setSelectedLead(lead);
//     setShowModal(true);
//   };

//   const exportCSV = () => {
//     if (leads.length === 0) return toast.info("No leads to export");

//     const headers =
//       "S.No,Name,Phone,Parent Name,City,Email,NEET Status,Budget,Preferred Country,Status,Lead Tag,Follow-up Date,Remark,Progress\n";

//     const rows = leads
//       .map((lead, index) => {
//         return `"${index + 1}","${lead.name || ""}","${lead.phone || ""}","${lead.phonenumber2 || ""}","${
//           lead.parentName || ""
//         }","${lead.city || ""}","${lead.email || ""}","${
//           lead.neetStatus || ""
//         }","₹${lead.budget || 0}","${lead.preferredCountry1 || ""}","${lead.preferredCountry2 || ""}",
//         "${lead.gapYear || ""}","${
//           lead.status || "New"
//         }","${lead.leadTag || ""}","${lead.followUpDate || ""}","${
//           lead.lastRemark || ""
//         }","${lead.progress || "Initial Contact"}"`;
//       })
//       .join("\n");

//     const blob = new Blob([headers + rows], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `telecaller_leads_${new Date()
//       .toISOString()
//       .slice(0, 10)}.csv`;
//     link.click();
//     toast.success("CSV Exported Successfully!");
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Converted":
//         return (
//           <Badge className="bg-emerald-100 text-emerald-700">Converted</Badge>
//         );
//       case "Not Interested":
//         return (
//           <Badge className="bg-red-100 text-red-700">Not Interested</Badge>
//         );
//       case "Call Back":
//         return <Badge className="bg-amber-100 text-amber-700">Call Back</Badge>;
//       case "Interested":
//         return <Badge className="bg-blue-100 text-blue-700">Interested</Badge>;
//       default:
//         return <Badge variant="secondary">{status || "New"}</Badge>;
//     }
//   };

//   const getLeadTagBadge = (tag) => {
//     switch (tag) {
//       case "Hot":
//         return <Badge className="bg-red-100 text-red-700">Hot</Badge>;
//       case "Warm":
//         return <Badge className="bg-amber-100 text-amber-700">Warm</Badge>;
//       case "Cold":
//         return <Badge className="bg-sky-100 text-sky-700">Cold</Badge>;
//       default:
//         return <Badge variant="secondary">{tag || "None"}</Badge>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
//         <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
//               T
//             </div>
//             <div>
//               <h1 className="text-3xl font-semibold text-slate-900">
//                 Telecaller Leads
//               </h1>
//               <p className="text-sm text-slate-500">
//                 Real-time Lead Management
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative w-96">
//               <Search
//                 className="absolute left-4 top-3.5 text-slate-400"
//                 size={20}
//               />
//               <Input
//                 placeholder="Search by name, phone or city..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-12 h-11 bg-white"
//               />
//             </div>

//             <Select value={neetFilter} onValueChange={setNeetFilter}>
//               <SelectTrigger className="w-52 h-11">
//                 <SelectValue placeholder="All NEET" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All NEET</SelectItem>
//                 <SelectItem value="Yes">Yes</SelectItem>
//                 <SelectItem value="No">No</SelectItem>
//                 <SelectItem value="Appeared">Appeared</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={countryFilter} onValueChange={setCountryFilter}>
//               <SelectTrigger className="w-52 h-11">
//                 <SelectValue placeholder="All Countries" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Countries</SelectItem>
//                 {[
//                   "Russia",
//                   "Georgia",
//                   "Nepal",
//                   "Bangladesh",
//                   "Kyrgyzstan",
//                   "Uzbekistan",
//                   "Kazakhstan",
//                   "Tajikistan",
//                   "Iran",
//                   "Egypt",
//                   "Belarus",
//                   "China",
//                   "Vietnam",
//                   "Argentina",
//                 ].map((c) => (
//                   <SelectItem key={c} value={c}>
//                     {c}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-screen-2xl mx-auto px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <Card>
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="p-3 bg-blue-100 rounded-2xl">
//                 <Users className="h-8 w-8 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold">{leads.length}</p>
//                 <p className="text-sm text-slate-500">Total Leads</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="p-3 bg-emerald-100 rounded-2xl">
//                 <IndianRupeeIcon className="h-8 w-8 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold">
//                   ₹
//                   {(
//                     leads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0) /
//                     100000
//                   ).toFixed(1)}
//                   L
//                 </p>
//                 <p className="text-sm text-slate-500">Total Budget</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="p-3 bg-amber-100 rounded-2xl">
//                 <Target className="h-8 w-8 text-amber-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold">
//                   {
//                     leads.filter((l) =>
//                       ["Yes", "Appeared"].includes(l.neetStatus || l.neet),
//                     ).length
//                   }
//                 </p>
//                 <p className="text-sm text-slate-500">Qualified</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="p-3 bg-sky-100 rounded-2xl">
//                 <Clock className="h-8 w-8 text-sky-600" />
//               </div>
//               <div>
//                 <p className="text-3xl font-semibold">{todayConvertedCount}</p>
//                 <p className="text-sm text-slate-500">Converted Today</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Table Header */}
//         <div className="flex justify-between items-end mb-6">
//           <div>
//             <h2 className="text-3xl font-semibold">All Leads</h2>
//             <p className="text-slate-500">
//               Showing {paginatedLeads.length} of {filteredLeads.length} leads
//             </p>
//           </div>
//           <Button
//             onClick={exportCSV}
//             variant="outline"
//             className="flex items-center gap-2"
//           >
//             <Download size={18} /> Export CSV
//           </Button>
//         </div>

//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="pl-8 w-16">S.No</TableHead>
//                   <TableHead
//                     className="cursor-pointer"
//                     onClick={() => handleSort("name")}
//                   >
//                     Name <ArrowUpDown size={14} className="inline ml-1" />
//                   </TableHead>
//                   <TableHead>Phone</TableHead>
//                   <TableHead>Phone 2</TableHead>
//                   <TableHead>Parent</TableHead>
//                   <TableHead
//                     className="cursor-pointer"
//                     onClick={() => handleSort("city")}
//                   >
//                     City <ArrowUpDown size={14} className="inline ml-1" />
//                   </TableHead>
//                   {/* <TableHead>Email</TableHead> */}
//                   <TableHead>NEET Status</TableHead>
//                   <TableHead
//                     className="cursor-pointer"
//                     onClick={() => handleSort("budget")}
//                   >
//                     Budget <ArrowUpDown size={14} className="inline ml-1" />
//                   </TableHead>
//                   <TableHead>Country</TableHead>
//                   <TableHead>Next Follow-up</TableHead>
//                   <TableHead className="text-center">Remark</TableHead>
//                   <TableHead>Progress</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Lead Tag</TableHead>
//                   <TableHead className="text-center pr-8">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={15} className="text-center py-20">
//                       Loading leads...
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedLeads.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={15}
//                       className="text-center py-20 text-slate-400"
//                     >
//                       No leads found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedLeads.map((lead, index) => {
//                     const serialNo =
//                       (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
//                     return (
//                       <TableRow
//                         key={lead._id || lead.id}
//                         className="hover:bg-slate-50"
//                       >
//                         <TableCell className="pl-8 font-medium text-slate-500">
//                           {serialNo}
//                         </TableCell>
//                         <TableCell className="font-medium">
//                           {lead.name}
//                         </TableCell>
//                         <TableCell className="font-mono">
//                           {lead.phone}
//                         </TableCell>
//                         <TableCell>{lead.phone2 || "—"}</TableCell>
//                         <TableCell>{lead.parentName || "—"}</TableCell>
//                         <TableCell>{lead.city || "—"}</TableCell>
//                         {/* <TableCell className="text-sm text-slate-600">
//                           {lead.email || "—"}
//                         </TableCell> */}
//                         <TableCell>
//                           <Badge>{lead.neetStatus || lead.neet || "—"}</Badge>
//                         </TableCell>
//                         <TableCell className="font-semibold">
//                           {lead.budget
//                             ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
//                             : "—"}
//                         </TableCell>

//                              <TableCell>
//                           <Badge>{lead.preferredCountry1 || lead.preferredCountry1 || "—"}</Badge>
//                         </TableCell>

//                          <TableCell>
//                           <Badge>{lead.gapYear || lead.gapYear || "—"}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">
//                             {lead.preferredCountry1 || "—"}
//                           </Badge>
//                         </TableCell>

//                         <TableCell>
//                           {lead.followUpDate ? (
//                             <Badge
//                               variant="outline"
//                               className="text-amber-600 font-medium"
//                             >
//                               {new Date(lead.followUpDate).toLocaleDateString(
//                                 "en-IN",
//                               )}
//                             </Badge>
//                           ) : (
//                             <span className="text-slate-400 text-sm">—</span>
//                           )}
//                         </TableCell>

//                         <TableCell className="text-center">
//                           {isTelecaller ? (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => openFollowUpModal(lead)}
//                               disabled={actionLoading}
//                             >
//                               <MessageSquare size={18} />
//                             </Button>
//                           ) : (
//                             <span className="text-slate-500 text-xs">
//                               Restricted
//                             </span>
//                           )}
//                         </TableCell>

//                         <TableCell>
//                           <Badge variant="outline" className="text-purple-600">
//                             {lead.progress || "Initial Contact"}
//                           </Badge>
//                         </TableCell>

//                         <TableCell>{getStatusBadge(lead.status)}</TableCell>
//                         <TableCell>{getLeadTagBadge(lead.leadTag)}</TableCell>

//                         <TableCell className="pr-8">
//                           <div className="flex gap-2 justify-center items-center bg-white">
//                             {isTelecaller ? (
//                               <>
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       disabled={actionLoading}
//                                     >
//                                       Status
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent className="bg-white">
//                                     <DropdownMenuLabel>
//                                       Update Status
//                                     </DropdownMenuLabel>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadStatus(
//                                           lead._id || lead.id,
//                                           "Interested",
//                                         )
//                                       }
//                                     >
//                                       Interested
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadStatus(
//                                           lead._id || lead.id,
//                                           "Call Back",
//                                         )
//                                       }
//                                     >
//                                       Call Back
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadStatus(
//                                           lead._id || lead.id,
//                                           "Not Interested",
//                                         )
//                                       }
//                                       className="text-red-600"
//                                     >
//                                       Not Interested
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadStatus(
//                                           lead._id || lead.id,
//                                           "Converted",
//                                         )
//                                       }
//                                       className="text-emerald-600"
//                                     >
//                                       Converted
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>

//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       disabled={actionLoading}
//                                     >
//                                       Tag
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent className="bg-white">
//                                     <DropdownMenuLabel>
//                                       Update Lead Tag
//                                     </DropdownMenuLabel>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadTag(
//                                           lead._id || lead.id,
//                                           "Hot",
//                                         )
//                                       }
//                                     >
//                                       Hot
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadTag(
//                                           lead._id || lead.id,
//                                           "Warm",
//                                         )
//                                       }
//                                     >
//                                       Warm
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem
//                                       onClick={() =>
//                                         updateLeadTag(
//                                           lead._id || lead.id,
//                                           "Cold",
//                                         )
//                                       }
//                                     >
//                                       Cold
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </>
//                             ) : (
//                               <span className="text-slate-500 text-xs">
//                                 Restricted
//                               </span>
//                             )}

//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => callLead(lead.phone)}
//                             >
//                               <Phone size={16} />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-8">
//             <Button
//               variant="outline"
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <span className="text-sm text-slate-600">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>

//       <FollowUpModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onSubmit={saveFollowUp}
//         lead={selectedLead}
//       />

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Phone,
  Download,
  Clock,
  Search,
  Users,
  Target,
  ArrowUpDown,
  IndianRupeeIcon,
  MessageSquare,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8000/api";
const ITEMS_PER_PAGE = 20;

// ==================== FollowUp Modal ====================
const FollowUpModal = ({ isOpen, onClose, onSubmit, lead }) => {
  const [remark, setRemark] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setRemark(lead.lastRemark || "");
      setNextFollowUpDate(
        lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
      );
    }
  }, [lead]);

  const handleSave = async () => {
    if (!remark.trim() && !nextFollowUpDate) {
      toast.error("Please add a remark or select a follow-up date");
      return;
    }

    setSaving(true);
    await onSubmit(remark.trim(), nextFollowUpDate || null);
    setSaving(false);
    onClose();
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-sky-600" size={28} />
          <div>
            <h3 className="text-2xl font-semibold">Follow-up</h3>
            <p className="text-slate-600">{lead.name}</p>
          </div>
        </div>

        {lead.lastRemark && (
          <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">LAST REMARK</p>
            <p className="text-slate-700">{lead.lastRemark}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Remark / Discussion Summary
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter what was discussed in this call..."
              className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Next Follow-up Date
            </label>
            <Input
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-12"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-12 bg-sky-600 hover:bg-sky-700"
          >
            {saving ? "Saving..." : "Save Follow-up"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
export default function TelecallerLead() {
  const { user } = useAuth();
  const isTelecaller = user?.role === "Telecaller";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [neetFilter, setNeetFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [todayConvertedCount, setTodayConvertedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads/telecallers`, {
        method: "GET",
        ...authHeader,
      });

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setLeads(data.data || []);
      setTodayConvertedCount(data.todayConverted || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Sorting
  const sortedLeads = useMemo(() => {
    let result = [...leads];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key] ?? "";
        let valB = b[sortConfig.key] ?? "";

        if (sortConfig.key === "budget") {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        } else if (sortConfig.key === "followUpDate") {
          valA = valA ? new Date(valA) : new Date(0);
          valB = valB ? new Date(valB) : new Date(0);
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [leads, sortConfig]);

  // Filtering
  const filteredLeads = useMemo(() => {
    return sortedLeads.filter((lead) => {
      const matchesSearch =
        (lead.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (lead.phone || "").includes(searchTerm) ||
        (lead.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesNeet =
        neetFilter === "all" || (lead.neetStatus || lead.neet) === neetFilter;

      const matchesCountry =
        countryFilter === "all" ||
        lead.preferredCountry1 === countryFilter ||
        lead.preferredCountry2 === countryFilter;

      return matchesSearch && matchesNeet && matchesCountry;
    });
  }, [sortedLeads, searchTerm, neetFilter, countryFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, neetFilter, countryFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const updateLocalLead = (id, updates) => {
    setLeads((prev) =>
      prev.map((lead) =>
        (lead._id || lead.id) === id ? { ...lead, ...updates } : lead,
      ),
    );
  };

  const saveFollowUp = async (remark, nextFollowUpDate) => {
    if (!selectedLead) return;
    try {
      setActionLoading(true);
      const payload = {};
      if (remark) payload.lastRemark = remark;
      if (nextFollowUpDate !== null) payload.followUpDate = nextFollowUpDate;

      const res = await fetch(
        `${BASE_URL}/leads/${selectedLead._id || selectedLead.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeader.headers,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to save follow-up");

      toast.success("Follow-up saved successfully!");
      updateLocalLead(selectedLead._id || selectedLead.id, payload);
    } catch (err) {
      toast.error("Failed to save follow-up");
    } finally {
      setActionLoading(false);
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader.headers },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      updateLocalLead(id, { status: newStatus });
      toast.success(`Status updated to "${newStatus}"`);
      if (newStatus === "Converted") await fetchLeads();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const updateLeadTag = async (id, newTag) => {
    try {
      setActionLoading(true);
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader.headers },
        body: JSON.stringify({ leadTag: newTag }),
      });

      if (!res.ok) throw new Error("Failed to update tag");

      updateLocalLead(id, { leadTag: newTag });
      toast.success(`Lead tag updated to "${newTag}"`);
    } catch (err) {
      toast.error(err.message || "Failed to update tag");
    } finally {
      setActionLoading(false);
    }
  };

  const callLead = (phone) => {
    window.open(`tel:${phone}`, "_self");
  };

  const openFollowUpModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const exportCSV = () => {
    if (leads.length === 0) return toast.info("No leads to export");

    const headers =
      "S.No,Name,Phone,Phone 2,Parent Name,City,NEET Status,Budget,Preferred Country 1,Preferred Country 2,Gap Year,Status,Lead Tag,Follow-up Date,Remark,Progress\n";

    const rows = leads
      .map((lead, index) => {
        return `"${index + 1}","${lead.name || ""}","${lead.phone || ""}","${lead.phonenumber2 || ""}","${lead.parentName || ""}","${lead.city || ""}","${lead.neetStatus || ""}","₹${lead.budget || 0}","${lead.preferredCountry1 || ""}","${lead.preferredCountry2 || ""}","${lead.gapYear || ""}","${lead.status || "New"}","${lead.leadTag || ""}","${lead.followUpDate || ""}","${lead.lastRemark || ""}","${lead.progress || "Initial Contact"}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `telecaller_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success("CSV Exported Successfully!");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Converted":
        return (
          <Badge className="bg-emerald-100 text-emerald-700">Converted</Badge>
        );
      case "Not Interested":
        return (
          <Badge className="bg-red-100 text-red-700">Not Interested</Badge>
        );
      case "Call Back":
        return <Badge className="bg-amber-100 text-amber-700">Call Back</Badge>;
      case "Interested":
        return <Badge className="bg-blue-100 text-blue-700">Interested</Badge>;
      default:
        return <Badge variant="secondary">{status || "New"}</Badge>;
    }
  };

  const getLeadTagBadge = (tag) => {
    switch (tag) {
      case "Hot":
        return <Badge className="bg-red-100 text-red-700">Hot</Badge>;
      case "Warm":
        return <Badge className="bg-amber-100 text-amber-700">Warm</Badge>;
      case "Cold":
        return <Badge className="bg-sky-100 text-sky-700">Cold</Badge>;
      default:
        return <Badge variant="secondary">{tag || "None"}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              T
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Telecaller Leads
              </h1>
              <p className="text-sm text-slate-500">
                Real-time Lead Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <Input
                placeholder="Search by name, phone or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11 bg-white"
              />
            </div>

            <Select value={neetFilter} onValueChange={setNeetFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All NEET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All NEET</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Not Qualified">Not Qualified</SelectItem>
                <SelectItem value="Appeared">Appeared</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {[
                  "Russia",
                  "Georgia",
                  "Nepal",
                  "Bangladesh",
                  "Kyrgyzstan",
                  "Uzbekistan",
                  "Kazakhstan",
                  "Tajikistan",
                  "Iran",
                  "Egypt",
                  "Belarus",
                  "China",
                  "Vietnam",
                  "Argentina",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold">{leads.length}</p>
                <p className="text-sm text-slate-500">Total Leads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <IndianRupeeIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold">
                  ₹
                  {(
                    leads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0) /
                    100000
                  ).toFixed(1)}{" "}
                  L
                </p>
                <p className="text-sm text-slate-500">Total Budget</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Target className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold">
                  {
                    leads.filter((l) =>
                      ["Qualified", "Appeared"].includes(l.neetStatus),
                    ).length
                  }
                </p>
                <p className="text-sm text-slate-500">Qualified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-2xl">
                <Clock className="h-8 w-8 text-sky-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold">{todayConvertedCount}</p>
                <p className="text-sm text-slate-500">Converted Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-semibold">All Leads</h2>
            <p className="text-slate-500">
              Showing {paginatedLeads.length} of {filteredLeads.length} leads
            </p>
          </div>
          <Button
            onClick={exportCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={18} /> Export CSV
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-8 w-16">S.No</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name <ArrowUpDown size={14} className="inline ml-1" />
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Phone 2</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("city")}
                  >
                    City <ArrowUpDown size={14} className="inline ml-1" />
                  </TableHead>
                  <TableHead>NEET Status</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("budget")}
                  >
                    Budget <ArrowUpDown size={14} className="inline ml-1" />
                  </TableHead>
                  <TableHead>Country 1</TableHead>
                  <TableHead>Country 2</TableHead>
                  <TableHead>Gap Year</TableHead>
                  <TableHead>Next Follow-up</TableHead>
                  <TableHead className="text-center">Remark</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lead Tag</TableHead>
                  <TableHead className="text-center pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={17} className="text-center py-20">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : paginatedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={17}
                      className="text-center py-20 text-slate-400"
                    >
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead, index) => {
                    const serialNo =
                      (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    return (
                      <TableRow
                        key={lead._id || lead.id}
                        className="hover:bg-slate-50"
                      >
                        <TableCell className="pl-8 font-medium text-slate-500">
                          {serialNo}
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {lead.phone}
                        </TableCell>
                        <TableCell>{lead.phonenumber2 || "—"}</TableCell>
                        <TableCell>{lead.parentName || "—"}</TableCell>
                        <TableCell>{lead.city || "—"}</TableCell>
                        <TableCell>
                          <Badge>{lead.neetStatus || "—"}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {lead.budget
                            ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {lead.preferredCountry1 || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {lead.preferredCountry2 || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {lead.gapYear ?? "—"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {lead.followUpDate ? (
                            <Badge
                              variant="outline"
                              className="text-amber-600 font-medium"
                            >
                              {new Date(lead.followUpDate).toLocaleDateString(
                                "en-IN",
                              )}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-sm">—</span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          {isTelecaller ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openFollowUpModal(lead)}
                              disabled={actionLoading}
                            >
                              <MessageSquare size={18} />
                            </Button>
                          ) : (
                            <span className="text-slate-500 text-xs">
                              Restricted
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-purple-600">
                            {lead.progress || "Initial Contact"}
                          </Badge>
                        </TableCell>

                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>{getLeadTagBadge(lead.leadTag)}</TableCell>

                        <TableCell className="pr-8">
                          <div className="flex gap-2 justify-center items-center">
                            {isTelecaller && (
                              <>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={actionLoading}
                                    >
                                      Status
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-white">
                                    <DropdownMenuLabel>
                                      Update Status
                                    </DropdownMenuLabel>
                                    {[
                                      "Interested",
                                      "Call Back",
                                      "Not Interested",
                                      "Converted",
                                    ].map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() =>
                                          updateLeadStatus(
                                            lead._id || lead.id,
                                            status,
                                          )
                                        }
                                        className={
                                          status === "Converted"
                                            ? "text-emerald-600"
                                            : status === "Not Interested"
                                              ? "text-red-600"
                                              : ""
                                        }
                                      >
                                        {status}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={actionLoading}
                                    >
                                      Tag
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-white">
                                    <DropdownMenuLabel>
                                      Update Lead Tag
                                    </DropdownMenuLabel>
                                    {["Hot", "Warm", "Cold"].map((tag) => (
                                      <DropdownMenuItem
                                        key={tag}
                                        onClick={() =>
                                          updateLeadTag(
                                            lead._id || lead.id,
                                            tag,
                                          )
                                        }
                                      >
                                        {tag}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => callLead(lead.phone)}
                            >
                              <Phone size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <FollowUpModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={saveFollowUp}
        lead={selectedLead}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
