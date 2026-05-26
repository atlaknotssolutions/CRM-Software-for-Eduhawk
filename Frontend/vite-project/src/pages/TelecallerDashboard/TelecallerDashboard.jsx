import { useState, useEffect, useMemo } from "react";
import {
  Phone,
  Download,
  Clock,
  Ban,
  CheckCircle,
  Search,
  Users,
  DollarSign,
  Target,
  TrendingUp,
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
  DropdownMenuSeparator,
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

export default function TelecallerDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [neetFilter, setNeetFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [todayConvertedCount, setTodayConvertedCount] = useState(0);

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  };

  // Fetch leads from backend
  const fetchLeads = async () => {
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
      toast.error(
        err.message ||
          "Failed to load leads. Please check if you're logged in.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (lead.phone || "").includes(searchTerm) ||
        (lead.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesNeet =
        neetFilter === "all" || (lead.neetStatus || lead.neet) === neetFilter;

      const matchesCountry =
        countryFilter === "all" ||
        (lead.preferredCountry || lead.country) === countryFilter;

      return matchesSearch && matchesNeet && matchesCountry;
    });
  }, [leads, searchTerm, neetFilter, countryFilter]);

  // Dashboard Statistics
  const totalLeads = leads.length;
  const totalBudget = leads.reduce(
    (sum, lead) => sum + (Number(lead.budget) || 0),
    0,
  );
  const qualifiedLeads = leads.filter(
    (l) =>
      (l.neetStatus || l.neet) === "Yes" ||
      (l.neetStatus || l.neet) === "Appeared",
  ).length;

  const convertedLeads = leads.filter((l) => l.status === "Converted").length;

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id || lead.id === id
            ? { ...lead, status: newStatus }
            : lead,
        ),
      );

      toast.success(`Lead status updated to "${newStatus}"`);
      setOpenDropdownId(null);

      if (newStatus === "Converted") {
        await fetchLeads();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const updateLeadTag = async (id, newTag) => {
    try {
      const res = await fetch(`${BASE_URL}/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader.headers,
        },
        body: JSON.stringify({ leadTag: newTag }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update lead tag");
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id || lead.id === id
            ? { ...lead, leadTag: newTag }
            : lead,
        ),
      );

      toast.success(`Lead tag updated to "${newTag}"`);
      setOpenDropdownId(null);
    } catch (err) {
      toast.error(err.message || "Failed to update lead tag");
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

  const callLead = (phone) => {
    window.open(`tel:${phone}`, "_self");
    // toast.info(`Calling ${phone}...`);
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      toast.info("No leads to export");
      return;
    }

    const headers =
      "Name,Phone,Parent Name,City,Email,NEET Status,Budget,Preferred Country,Status\n";
    const rows = leads
      .map(
        (lead) =>
          `"${lead.name || ""}","${lead.phone || ""}","${lead.parentName || ""}","${lead.city || ""}","${lead.email || ""}","${lead.neetStatus || ""}","₹${lead.budget || 0}","${lead.preferredCountry || ""}","${lead.status || "New"}"`,
      )
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md">
              T
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Telecaller Dashboard
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
                className="pl-12 h-11"
              />
            </div>

            <Select value={neetFilter} onValueChange={setNeetFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All NEET" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All NEET Status</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Appeared">Appeared</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-52 h-11">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Russia">Russia</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Nepal">Nepal</SelectItem>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>

                <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                <SelectItem value="Iran">Iran</SelectItem>
                <SelectItem value="Egypt">Egypt</SelectItem>
                <SelectItem value="Belarus">Belarus</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>

                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  {totalLeads}
                </p>
                <p className="text-sm text-slate-500">Total Leads</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  ₹{(totalBudget / 100000).toFixed(1)}L
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
                <p className="text-3xl font-semibold text-slate-900">
                  {qualifiedLeads}
                </p>
                <p className="text-sm text-slate-500">Qualified (NEET)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  {convertedLeads}
                </p>
                <p className="text-sm text-slate-500">Converted</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-2xl">
                <Clock className="h-8 w-8 text-sky-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">
                  {todayConvertedCount}
                </p>
                <p className="text-sm text-slate-500">Converted Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">All Leads</h2>
            <p className="text-slate-500 mt-1">
              Showing {filteredLeads.length} of {totalLeads} leads
            </p>
          </div>
          <Button
            onClick={exportCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 text-center text-slate-500">
                Loading leads...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-8">Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>NEET Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lead Tag</TableHead>
                    <TableHead className="text-center pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-20 text-slate-400"
                      >
                        No leads found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow
                        key={lead._id || lead.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="pl-8 font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {lead.phone}
                        </TableCell>
                        <TableCell>{lead.parentName || "—"}</TableCell>
                        <TableCell>{lead.city || "—"}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {lead.email || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={lead.neetStatus ? "default" : "secondary"}
                          >
                            {lead.neetStatus || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {lead.budget
                            ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {lead.preferredCountry || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>{getLeadTagBadge(lead.leadTag)}</TableCell>
                        <TableCell className="pr-8">
                          <DropdownMenu
                            open={openDropdownId === (lead._id || lead.id)}
                            onOpenChange={(open) =>
                              setOpenDropdownId(
                                open ? lead._id || lead.id : null,
                              )
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <Phone size={18} className="mr-2" />
                                Take Action
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-64 bg-white"
                            >
                              <DropdownMenuLabel>
                                Update Status
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadStatus(
                                    lead._id || lead.id,
                                    "Interested",
                                  )
                                }
                              >
                                Interested
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadStatus(
                                    lead._id || lead.id,
                                    "Call Back",
                                  )
                                }
                              >
                                Call Back
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadStatus(
                                    lead._id || lead.id,
                                    "Not Interested",
                                  )
                                }
                                className="text-red-600"
                              >
                                <Ban size={18} className="mr-3" /> Not
                                Interested
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadStatus(
                                    lead._id || lead.id,
                                    "Converted",
                                  )
                                }
                                className="text-emerald-600"
                              >
                                <CheckCircle size={18} className="mr-3" />{" "}
                                Converted
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Update Lead Tag
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadTag(lead._id || lead.id, "Hot")
                                }
                              >
                                Hot Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadTag(lead._id || lead.id, "Warm")
                                }
                              >
                                Warm Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateLeadTag(lead._id || lead.id, "Cold")
                                }
                              >
                                Cold Lead
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => callLead(lead.phone)}
                              >
                                <Phone size={18} className="mr-3" /> Call Now
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
