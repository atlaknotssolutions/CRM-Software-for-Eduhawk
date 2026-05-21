// import React, { useState } from "react";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
// import { Badge } from "../../components/ui/badge";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";
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
// import { Users, UserCheck, Clock, Edit2, Phone } from "lucide-react";
// import { toast } from "react-toastify";

// const CounselorDashboard = () => {
//   const [activeTab, setActiveTab] = useState("interested");
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [moveToStatus, setMoveToStatus] = useState("");

//   const [students, setStudents] = useState({
//     interested: [
//       { id: 1, name: "Rahul Sharma", phone: "9876543210", city: "Indore", budget: "15L", lastFollowUp: "2 days ago", leadType: "hot" },
//       { id: 2, name: "Priya Patel", phone: "8765432109", city: "Bhopal", budget: "12L", lastFollowUp: "Yesterday", leadType: "warm" },
//     ],
//     closed: [
//       { id: 3, name: "Aarav Singh", phone: "7654321098", city: "Indore", budget: "18L", status: "Admitted", lastFollowUp: "1 week ago", leadType: "hot" },
//     ],
//     followUp: [
//       { id: 4, name: "Neha Verma", phone: "6543210987", city: "Indore", budget: "10L", lastFollowUp: "5 days ago", leadType: "warm" },
//       { id: 5, name: "Rohan Gupta", phone: "5432109876", city: "Ujjain", budget: "14L", lastFollowUp: "1 week ago", leadType: "cold" },
//       { id: 6, name: "Ananya Joshi", phone: "4321098765", city: "Indore", budget: "16L", lastFollowUp: "3 days ago", leadType: "hot" },
//     ],
//   });

//   const LEAD_TYPES = {
//     hot: { label: "🔥 Hot Lead", variant: "destructive" },
//     warm: { label: "☀️ Warm Lead", variant: "default" },
//     cold: { label: "❄️ Cold Lead", variant: "secondary" },
//   };

//   const openRemarkModal = (student) => {
//     setSelectedStudent(student);
//     setRemark("");
//     setMoveToStatus("");
//   };

//   const updateLeadType = (studentId, columnKey, newType) => {
//     setStudents((prev) => ({
//       ...prev,
//       [columnKey]: prev[columnKey].map((s) =>
//         s.id === studentId ? { ...s, leadType: newType } : s
//       ),
//     }));
//   };

//   const saveFollowUp = () => {
//     if (!remark.trim()) {
//       toast.error("Please write a remark");
//       return;
//     }

//     const updatedStudent = { ...selectedStudent, remark, lastFollowUp: "Just now" };
//     const filteredFollowUp = students.followUp.filter((s) => s.id !== selectedStudent.id);

//     setStudents((prev) => {
//       const next = { ...prev, followUp: filteredFollowUp };

//       if (moveToStatus === "interested") {
//         next.interested = [...prev.interested, updatedStudent];
//       } else if (moveToStatus === "closed") {
//         next.closed = [...prev.closed, { ...updatedStudent, status: "Admitted" }];
//       } else {
//         next.followUp = [...filteredFollowUp, updatedStudent];
//       }
//       return next;
//     });

//     toast.success("Follow-up saved successfully!");
//     setSelectedStudent(null);
//     setRemark("");
//     setMoveToStatus("");
//   };

//   const renderTable = (key, data) => {
//     const isFollowUp = key === "followUp";

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
//             {isFollowUp && <TableHead className="text-right">Action</TableHead>}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={isFollowUp ? 8 : 7} className="text-center py-12 text-muted-foreground">
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
//                       <AvatarFallback className="text-xs font-medium">
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
//                     {student.status || student.lastFollowUp}
//                   </TableCell>

//                   {isFollowUp && (
//                     <TableCell className="text-right">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => openRemarkModal(student)}
//                       >
//                         <Edit2 className="h-4 w-4 mr-1" />
//                         Remark
//                       </Button>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })
//           )}
//         </TableBody>
//       </Table>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background p-6 space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold tracking-tight">Counselor Dashboard</h1>
//         <p className="text-muted-foreground mt-2">Professional Student Pipeline Management</p>
//       </div>

//       {/* Stats Row */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[
//           { label: "Total Students", value: Object.values(students).flat().length },
//           { label: "Interested", value: students.interested.length },
//           { label: "Follow-up", value: students.followUp.length },
//           { label: "Closed", value: students.closed.length },
//         ].map((stat, i) => (
//           <Card key={i}>
//             <CardContent className="p-6">
//               <p className="text-3xl font-bold">{stat.value}</p>
//               <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Tabs with Tables */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full max-w-md grid-cols-3">
//           <TabsTrigger value="interested" className="flex items-center gap-2">
//             <Users className="h-4 w-4" /> Interested
//           </TabsTrigger>
//           <TabsTrigger value="followUp" className="flex items-center gap-2">
//             <Clock className="h-4 w-4" /> Follow-up
//           </TabsTrigger>
//           <TabsTrigger value="closed" className="flex items-center gap-2">
//             <UserCheck className="h-4 w-4" /> Closed
//           </TabsTrigger>
//         </TabsList>

//         <div className="mt-8">
//           <TabsContent value="interested" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Interested Students</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {renderTable("interested", students.interested)}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="followUp" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Follow-up Queue</CardTitle>
//                 <p className="text-sm text-muted-foreground">Click on Remark to add notes and update status</p>
//               </CardHeader>
//               <CardContent>
//                 {renderTable("followUp", students.followUp)}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="closed" className="m-0">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Closed Deals</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {renderTable("closed", students.closed)}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </div>
//       </Tabs>

//       {/* Remark Modal */}
//       <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Follow-up for {selectedStudent?.name}</DialogTitle>
//             <DialogDescription>
//               Add your remark and choose where to move the student
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div>
//               <Label>Remark / Follow-up Note</Label>
//               <Textarea
//                 value={remark}
//                 onChange={(e) => setRemark(e.target.value)}
//                 placeholder="What was discussed? Next steps, objections, etc..."
//                 className="min-h-[130px] mt-2"
//               />
//             </div>

//             <div>
//               <Label>Move Student To</Label>
//               <Select value={moveToStatus} onValueChange={setMoveToStatus}>
//                 <SelectTrigger className="mt-2">
//                   <SelectValue placeholder="Keep in Follow-up Queue" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="interested">Interested</SelectItem>
//                   <SelectItem value="closed">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setSelectedStudent(null)}>
//               Cancel
//             </Button>
//             <Button onClick={saveFollowUp} disabled={!remark.trim()}>
//               Save Follow-up
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default CounselorDashboard;

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
import { Textarea } from "../../components/ui/textarea";
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

// Lucide React Icons
import { Users, UserCheck, Clock, Edit2, Phone, Save } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000/api";

const CounselorDashboard = () => {
  const [activeTab, setActiveTab] = useState("interested");
  const [students, setStudents] = useState({
    interested: [],
    followUp: [],
    closed: [],
  });
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [remark, setRemark] = useState("");
  const [moveToStatus, setMoveToStatus] = useState("");

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  // Fetch Leads from Backend
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
          ["New", "Interested"].includes(lead.status),
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
      toast.error(
        "Failed to load students. Please check if you are logged in.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const LEAD_TYPES = {
    Hot: { label: "🔥 Hot Lead", variant: "destructive" },
    Warm: { label: "☀️ Warm Lead", variant: "default" },
    Cold: { label: "❄️ Cold Lead", variant: "secondary" },
  };

  const openRemarkModal = (student) => {
    setSelectedStudent(student);
    setRemark("");
    setMoveToStatus("");
  };

  // Save Follow-up with Backend Update
  const saveFollowUp = async () => {
    if (!selectedStudent || !remark.trim()) {
      toast.error("Please write a remark");
      return;
    }

    try {
      const newStatus = moveToStatus || selectedStudent.status || "Call Back";

      const res = await fetch(`${BASE_URL}/leads/${selectedStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({
          status: newStatus,
          // You can add a "lastFollowUp" or "remarks" field in your backend if needed
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
      fetchLeads(); // Refresh all data
    } catch (err) {
      toast.error(err.message || "Failed to save follow-up");
    }
  };

  const renderTable = (key, data) => {
    const isFollowUp = key === "followUp";

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
            {isFollowUp && <TableHead className="text-right">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={isFollowUp ? 8 : 7}
                className="text-center py-12"
              >
                Loading students...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isFollowUp ? 8 : 7}
                className="text-center py-12 text-muted-foreground"
              >
                No students in this section
              </TableCell>
            </TableRow>
          ) : (
            data.map((student) => {
              const lead = LEAD_TYPES[student.leadTag] || LEAD_TYPES.Cold;
              return (
                <TableRow key={student._id} className="hover:bg-muted/50">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                        {student.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "???"}
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
                    <Badge variant={lead.variant} className="text-xs">
                      {lead.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {student.lastFollowUp || student.status || "—"}
                  </TableCell>

                  {isFollowUp && (
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRemarkModal(student)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Remark
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Counselor Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Professional Student Pipeline Management
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: Object.values(students).flat().length,
          },
          { label: "Interested", value: students.interested.length },
          { label: "Follow-up", value: students.followUp.length },
          { label: "Closed", value: students.closed.length },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs with Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="interested" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Interested
          </TabsTrigger>
          <TabsTrigger value="followUp" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Follow-up
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> Closed
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="interested" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Interested Students</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable("interested", students.interested)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followUp" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Queue</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Click on Remark to add notes and update status
                </p>
              </CardHeader>
              <CardContent>
                {renderTable("followUp", students.followUp)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Closed Deals</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTable("closed", students.closed)}
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Follow-up for {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Add your remark and choose where to move the student
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label>Remark / Follow-up Note</Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="What was discussed? Next steps, objections, etc..."
                className="min-h-[130px] mt-2"
              />
            </div>

            <div>
              <Label>Move Student To</Label>
              <Select value={moveToStatus} onValueChange={setMoveToStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Keep in Follow-up Queue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interested">Interested</SelectItem>
                  <SelectItem value="Call Back">Call Back</SelectItem>
                  <SelectItem value="Converted">Converted / Closed</SelectItem>
                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
              Cancel
            </Button>
            <Button onClick={saveFollowUp} disabled={!remark.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Save Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CounselorDashboard;
