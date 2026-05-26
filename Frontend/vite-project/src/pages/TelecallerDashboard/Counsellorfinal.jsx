// import React, { useState } from "react";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
// import { Badge } from "../../components/ui/badge";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
// import { Checkbox } from "../../components/ui/checkbox";
// import { Input } from "../../components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { Avatar, AvatarFallback } from "../../components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// // Lucide React Icons
// import {
//   Users,
//   UserCheck,
//   Clock,
//   Edit2,
//   Eye,
//   DollarSign,
//   User
// } from "lucide-react";
// import { toast } from "react-toastify";

// const Counsellorfinal = () => {
//   const [activeTab, setActiveTab] = useState("interested");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [moveToStatus, setMoveToStatus] = useState("");

//   // Progress Modal
//   const [progressModal, setProgressModal] = useState(null);

//   // New: Admitted Details Modal
//   const [admittedModal, setAdmittedModal] = useState(null);
//   const [admittedData, setAdmittedData] = useState({
//     collegeName: "",
//     emergencyContact: "",
//     serviceManager: ""
//   });

//   const [students, setStudents] = useState({
//     interested: [
//       { id: 1, name: "Rahul Sharma", phone: "9876543210", city: "Indore", budget: "15L", lastFollowUp: "2 days ago", leadType: "hot" },
//       { id: 2, name: "Priya Patel", phone: "8765432109", city: "Bhopal", budget: "12L", lastFollowUp: "Yesterday", leadType: "warm" },
//     ],
//     closed: [
//       {
//         id: 3,
//         name: "Aarav Singh",
//         phone: "7654321098",
//         city: "Indore",
//         budget: "18L",
//         lastFollowUp: "1 week ago",
//         leadType: "hot",
//         status: "Admitted"
//       },
//     ],
//     followUp: [
//       { id: 4, name: "Neha Verma", phone: "6543210987", city: "Indore", budget: "10L", lastFollowUp: "5 days ago", leadType: "warm" },
//       { id: 5, name: "Rohan Gupta", phone: "5432109876", city: "Ujjain", budget: "14L", lastFollowUp: "1 week ago", leadType: "cold" },
//     ],
//   });

//   // Progress Data (for non-admitted)
//   const [progressData, setProgressData] = useState({
//     registrationFeeSubmitted: false,
//     documentsSubmitted: false,
//     documentFileReady: false,
//     collegeApplicationDone: false,
//     admissionLetterIssued: false,
//     visaApplied: false,
//     visaIssued: false,
//     ticketBooked: false,
//     remarks: ""
//   });

//   const LEAD_TYPES = {
//     hot: { label: "🔥 Hot", variant: "destructive" },
//     warm: { label: "☀️ Warm", variant: "default" },
//     cold: { label: "❄️ Cold", variant: "secondary" },
//   };

//   const openRemarkModal = (student) => {
//     setSelectedStudent(student);
//     setRemark("");
//     setMoveToStatus("");
//   };

//   const openProgressModal = (student) => {
//     setProgressModal(student);
//     setProgressData({
//       registrationFeeSubmitted: false,
//       documentsSubmitted: false,
//       documentFileReady: false,
//       collegeApplicationDone: false,
//       admissionLetterIssued: false,
//       visaApplied: false,
//       visaIssued: false,
//       ticketBooked: false,
//       remarks: ""
//     });
//   };

//   // New: Open Admitted Details Modal
//   const openAdmittedModal = (student) => {
//     setAdmittedModal(student);
//     setAdmittedData({
//       collegeName: "",
//       emergencyContact: "",
//       serviceManager: ""
//     });
//   };

//   const saveFollowUp = () => {
//     if (!remark.trim()) {
//       toast.error("Please write a remark");
//       return;
//     }
//     toast.success("Follow-up saved successfully!");
//     setSelectedStudent(null);
//     setRemark("");
//     setMoveToStatus("");
//   };

//   const saveProgress = () => {
//     if (!progressModal) return;
//     toast.success(`Progress updated for ${progressModal.name}`);
//     setProgressModal(null);
//   };

//   const saveAdmittedDetails = () => {
//     if (!admittedModal) return;
//     toast.success(`Admitted details saved for ${admittedModal.name}`);
//     console.log("Admitted Details:", { student: admittedModal.name, ...admittedData });
//     setAdmittedModal(null);
//   };

//   const handleProgressChange = (field, value) => {
//     setProgressData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleAdmittedChange = (field, value) => {
//     setAdmittedData(prev => ({ ...prev, [field]: value }));
//   };

//   const renderTable = (key, data) => {
//     const isFollowUp = key === "followUp";
//     const isClosed = key === "closed";

//     return (
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-12"></TableHead>
//             <TableHead>Name</TableHead>
//             <TableHead>Phone</TableHead>
//             <TableHead>City</TableHead>
//             <TableHead>Budget</TableHead>
//             <TableHead>Lead Type</TableHead>
//             <TableHead>Last Follow-up</TableHead>
//             <TableHead className="text-center">Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
//                 No students in this section
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((student) => {
//               const lead = LEAD_TYPES[student.leadType] || LEAD_TYPES.cold;
//               return (
//                 <TableRow key={student.id} className="hover:bg-muted/50">
//                   <TableCell>
//                     <Avatar className="h-9 w-9">
//                       <AvatarFallback className="bg-primary/10 text-primary font-medium">
//                         {student.name.split(" ").map((n) => n[0]).join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                   </TableCell>
//                   <TableCell className="font-medium">{student.name}</TableCell>
//                   <TableCell className="font-mono text-sm">{student.phone}</TableCell>
//                   <TableCell>{student.city}</TableCell>
//                   <TableCell className="font-medium">₹{student.budget}</TableCell>
//                   <TableCell>
//                     <Badge variant={lead.variant} className="text-xs">
//                       {lead.label}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-sm text-muted-foreground">
//                     {student.lastFollowUp}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     {isClosed ? (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openAdmittedModal(student)}
//                         className="flex items-center gap-1"
//                       >
//                         <User className="h-4 w-4" />
//                         Admitted Details
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openProgressModal(student)}
//                         className="flex items-center gap-1"
//                       >
//                         <Eye className="h-4 w-4" />
//                         View Progress
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               );
//             })
//           )}
//         </TableBody>
//       </Table>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold tracking-tight text-slate-900">Counselor & Telecaller Dashboard</h1>
//         <p className="text-slate-500 mt-2">Complete Student Management System</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <Users className="h-8 w-8 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">{Object.values(students).flat().length}</p>
//               <p className="text-sm text-slate-500">Total Students</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-amber-100 rounded-xl">
//               <Users className="h-8 w-8 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">{students.interested.length}</p>
//               <p className="text-sm text-slate-500">Interested</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-orange-100 rounded-xl">
//               <Clock className="h-8 w-8 text-orange-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">{students.followUp.length}</p>
//               <p className="text-sm text-slate-500">Follow-up</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-emerald-100 rounded-xl">
//               <UserCheck className="h-8 w-8 text-emerald-600" />
//             </div>
//             <div>
//               <p className="text-3xl font-semibold text-slate-900">{students.closed.length}</p>
//               <p className="text-sm text-slate-500">Admitted</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border">
//           <TabsTrigger value="interested">Interested</TabsTrigger>
//           <TabsTrigger value="followUp">Follow-up</TabsTrigger>
//           <TabsTrigger value="closed">Admitted</TabsTrigger>
//         </TabsList>

//         <div className="mt-8 space-y-8">
//           <TabsContent value="interested" className="m-0">
//             <Card>
//               <CardHeader><CardTitle>Interested Students</CardTitle></CardHeader>
//               <CardContent>{renderTable("interested", students.interested)}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="followUp" className="m-0">
//             <Card>
//               <CardHeader><CardTitle>Follow-up Queue</CardTitle></CardHeader>
//               <CardContent>{renderTable("followUp", students.followUp)}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="closed" className="m-0">
//             <Card>
//               <CardHeader><CardTitle>Admitted Students</CardTitle></CardHeader>
//               <CardContent>{renderTable("closed", students.closed)}</CardContent>
//             </Card>
//           </TabsContent>
//         </div>
//       </Tabs>

//       {/* ====================== ADMISSION PROGRESS MODAL ====================== */}
//       <Dialog open={!!progressModal} onOpenChange={() => setProgressModal(null)}>
//         {/* ... (Your previous progress modal code remains same) ... */}
//         {/* I kept it short here for brevity - use the previous full progress modal code */}
//       </Dialog>

//       {/* ====================== ADMITTED DETAILS MODAL (NEW) ====================== */}
//       <Dialog open={!!admittedModal} onOpenChange={() => setAdmittedModal(null)}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">Admitted Student Details</DialogTitle>
//             <DialogDescription>
//               {admittedModal?.name} - Update College & Support Information
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div>
//               <Label>College / University Name</Label>
//               <Input
//                 value={admittedData.collegeName}
//                 onChange={(e) => handleAdmittedChange('collegeName', e.target.value)}
//                 placeholder="Enter college name"
//                 className="mt-2"
//               />
//             </div>

//             <div>
//               <Label>Emergency Contact Details</Label>
//               <Input
//                 value={admittedData.emergencyContact}
//                 onChange={(e) => handleAdmittedChange('emergencyContact', e.target.value)}
//                 placeholder="Name + Phone Number"
//                 className="mt-2"
//               />
//             </div>

//             <div>
//               <Label>Service Manager Assigned</Label>
//               <Select
//                 value={admittedData.serviceManager}
//                 onValueChange={(value) => handleAdmittedChange('serviceManager', value)}
//               >
//                 <SelectTrigger className="mt-2">
//                   <SelectValue placeholder="Select Service Manager" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="manager1">Rajesh Kumar (Senior)</SelectItem>
//                   <SelectItem value="manager2">Priya Sharma</SelectItem>
//                   <SelectItem value="manager3">Amit Verma</SelectItem>
//                   <SelectItem value="manager4">Sneha Gupta</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setAdmittedModal(null)}>
//               Cancel
//             </Button>
//             <Button onClick={saveAdmittedDetails} className="bg-emerald-600 hover:bg-emerald-700">
//               Save Details
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Remark Modal */}
//       <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
//         {/* Your existing remark modal code */}
//       </Dialog>
//     </div>
//   );
// };

// export default Counsellorfinal;

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { toast } from "react-toastify";

// Lucide React Icons
import {
  Users,
  UserCheck,
  Clock,
  Eye,
  User,
  Phone,
  Edit2,
  Save,
  X,
} from "lucide-react";

const BASE_URL = "http://localhost:8000/api";

const Counsellorfinal = () => {
  const [activeTab, setActiveTab] = useState("interested");
  const [students, setStudents] = useState({
    interested: [],
    followUp: [],
    closed: [],
  });

  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progressModal, setProgressModal] = useState(null);
  const [admittedModal, setAdmittedModal] = useState(null);

  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");

  const [admittedData, setAdmittedData] = useState({
    collegeName: "",
    emergencyContact: "",
    serviceManager: "",
  });

  const [progressData, setProgressData] = useState({
    registrationFeeSubmitted: false,
    documentsSubmitted: false,
    documentFileReady: false,
    collegeApplicationDone: false,
    admissionLetterIssued: false,
    visaApplied: false,
    visaIssued: false,
    ticketBooked: false,
    remarks: "",
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  // Fetch all leads and categorize them
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "GET",
        ...authHeader,
      });

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      const allLeads = data.data || [];

      // Categorize leads
      const categorized = {
        interested: allLeads.filter((lead) =>
          ["Interested", "New"].includes(lead.status),
        ),
        followUp: allLeads.filter((lead) =>
          ["Call Back"].includes(lead.status),
        ),
        closed: allLeads.filter((lead) =>
          ["Converted", "Admitted", "Dropped"].includes(lead.status),
        ),
      };

      setStudents(categorized);
    } catch (err) {
      toast.error("Failed to load students. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const LEAD_TYPES = {
    Hot: { label: "🔥 Hot", variant: "destructive" },
    Warm: { label: "☀️ Warm", variant: "default" },
    Cold: { label: "❄️ Cold", variant: "secondary" },
  };

  // Open Modals
  const openRemarkModal = (student) => {
    setSelectedStudent(student);
    setRemark("");
    setMoveToStatus("");
  };

  const openProgressModal = (student) => {
    setProgressModal(student);
    setProgressData({
      registrationFeeSubmitted: false,
      documentsSubmitted: false,
      documentFileReady: false,
      collegeApplicationDone: false,
      admissionLetterIssued: false,
      visaApplied: false,
      visaIssued: false,
      ticketBooked: false,
      remarks: "",
    });
  };

  const openAdmittedModal = (student) => {
    setAdmittedModal(student);
    setAdmittedData({
      collegeName: student.collegeName || "",
      emergencyContact: student.emergencyContact || "",
      serviceManager: "",
    });
  };

  // Save Functions with API calls
  const saveFollowUp = async () => {
    if (!selectedStudent || !remark.trim()) {
      toast.error("Please write a remark");
      return;
    }

    try {
      const newStatus = moveToStatus || selectedStudent.status;

      const res = await fetch(`${BASE_URL}/leads/${selectedStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({
          status: newStatus,
          // You can add remark field if your backend supports it
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save follow-up");
      }

      toast.success("Follow-up saved successfully!");
      setSelectedStudent(null);
      setRemark("");
      setMoveToStatus("");
      fetchLeads(); // Refresh data
    } catch (err) {
      toast.error(err.message || "Failed to save follow-up");
    }
  };

  const saveProgress = async () => {
    if (!progressModal) return;

    try {
      // Here you can save progress data if you have a separate progress collection
      // For now, just updating status to "In Progress" or keep as is
      const res = await fetch(`${BASE_URL}/leads/${progressModal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader.headers },
        body: JSON.stringify({ status: "Interested" }), // or any logic you want
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update progress");
      }

      toast.success(`Progress updated for ${progressModal.name}`);
      setProgressModal(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message || "Failed to update progress");
    }
  };

  const saveAdmittedDetails = async () => {
    if (!admittedModal) return;

    try {
      const res = await fetch(`${BASE_URL}/leads/${admittedModal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({
          status: "Converted",
          collegeName: admittedData.collegeName,
          emergencyContact: admittedData.emergencyContact,
          // serviceManager can be saved if you add this field in your model
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save admitted details");
      }

      toast.success(`Admitted details saved for ${admittedModal.name}`);
      setAdmittedModal(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.message || "Failed to save admitted details");
    }
  };

  const handleProgressChange = (field, value) => {
    setProgressData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdmittedChange = (field, value) => {
    setAdmittedData((prev) => ({ ...prev, [field]: value }));
  };

  const renderTable = (key, data) => {
    const isClosed = key === "closed";

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Lead Type</TableHead>
            <TableHead>Last Follow-up</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-muted-foreground"
              >
                No students in this section
              </TableCell>
            </TableRow>
          ) : (
            data.map((student) => {
              const leadType = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
              return (
                <TableRow key={student._id} className="hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {student.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "??"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {student.phone}
                  </TableCell>
                  <TableCell>{student.city || "—"}</TableCell>
                  <TableCell className="font-medium">
                    {student.budget
                      ? `₹${Number(student.budget).toLocaleString("en-IN")}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={leadType.variant} className="text-xs">
                      {leadType.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastFollowUp || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {isClosed ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAdmittedModal(student)}
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Admitted Details
                      </Button>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProgressModal(student)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Progress
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRemarkModal(student)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          Remark
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Counselor Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Student Follow-up & Admission Management
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
                {Object.values(students).flat().length}
              </p>
              <p className="text-sm text-slate-500">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.interested.length}
              </p>
              <p className="text-sm text-slate-500">Interested</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.followUp.length}
              </p>
              <p className="text-sm text-slate-500">Follow-up</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <UserCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-semibold text-slate-900">
                {students.closed.length}
              </p>
              <p className="text-sm text-slate-500">Admitted / Converted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border">
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="followUp">Follow-up</TabsTrigger>
          <TabsTrigger value="closed">Admitted</TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-8">
          <TabsContent value="interested" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Interested Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  renderTable("interested", students.interested)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followUp" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Follow-up Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  renderTable("followUp", students.followUp)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" /> Admitted Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading...</p>
                ) : (
                  renderTable("closed", students.closed)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Remark Modal */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Follow-up Remark</DialogTitle>
            <DialogDescription>
              Student: <strong>{selectedStudent?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Remark / Notes</Label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg min-h-[120px] resize-y"
                placeholder="Write detailed follow-up notes..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>

            <div>
              <Label>Move to Status</Label>
              <Select value={moveToStatus} onValueChange={setMoveToStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Call Back">Call Back</SelectItem>
                  <SelectItem value="Converted">
                    Converted / Admitted
                  </SelectItem>
                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveFollowUp}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Modal */}
      <Dialog
        open={!!progressModal}
        onOpenChange={() => setProgressModal(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Admission Progress - {progressModal?.name}
            </DialogTitle>
          </DialogHeader>
          {/* Add your full progress checklist here if needed */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressModal(null)}>
              Close
            </Button>
            <Button onClick={saveProgress}>Save Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admitted Details Modal */}
      <Dialog
        open={!!admittedModal}
        onOpenChange={() => setAdmittedModal(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Admitted Student Details</DialogTitle>
            <DialogDescription>{admittedModal?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>College / University Name *</Label>
              <Input
                value={admittedData.collegeName}
                onChange={(e) =>
                  handleAdmittedChange("collegeName", e.target.value)
                }
                placeholder="Enter full college name"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Emergency Contact</Label>
              <Input
                value={admittedData.emergencyContact}
                onChange={(e) =>
                  handleAdmittedChange("emergencyContact", e.target.value)
                }
                placeholder="Name + Phone Number"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Service Manager Assigned</Label>
              <Select
                value={admittedData.serviceManager}
                onValueChange={(value) =>
                  handleAdmittedChange("serviceManager", value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select Service Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rajesh Kumar">
                    Rajesh Kumar (Senior)
                  </SelectItem>
                  <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                  <SelectItem value="Amit Verma">Amit Verma</SelectItem>
                  <SelectItem value="Sneha Gupta">Sneha Gupta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdmittedModal(null)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button
              onClick={saveAdmittedDetails}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="mr-2 h-4 w-4" /> Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Counsellorfinal;
