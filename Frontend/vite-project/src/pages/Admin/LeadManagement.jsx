import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Users,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const BASE_URL = "https://crm-software-for-eduhawk-1.onrender.com/api";

const LeadManagement = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [activeTab, setActiveTab] = useState("telecaller");
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [activityCalendar, setActivityCalendar] = useState([]);
  const [activityCalendarLoading, setActivityCalendarLoading] = useState(false);

  // Top level date filter for Performance & Leads
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Simple date for Activity History
  const [historyDate, setHistoryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  const fetchPerformance = async (date = filterDate) => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ date });

      const res = await fetch(
        `${BASE_URL}/dashboard/performance?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader.Authorization,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to load lead performance");
      }

      const data = await res.json();
      setSummary(data.data || null);
    } catch (err) {
      toast.error(err.message || "Unable to load lead performance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityCalendar = async () => {
    try {
      setActivityCalendarLoading(true);
      const res = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to load activity calendar",
        );
      }

      const data = await res.json();
      setActivityCalendar(data.data?.activityCalendar || []);
    } catch (err) {
      toast.error(err.message || "Unable to load activity calendar history");
      console.error(err);
    } finally {
      setActivityCalendarLoading(false);
    }
  };

  const fetchLeads = async (searchTerm = leadSearch, date = filterDate) => {
    try {
      setLeadsLoading(true);
      const query = new URLSearchParams({
        limit: "50",
        page: "1",
        date,
      });
      if (searchTerm) query.set("search", searchTerm);

      const res = await fetch(`${BASE_URL}/leads?${query.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to load leads");
      }

      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      toast.error(err.message || "Unable to load lead tracking data");
      console.error(err);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
    fetchActivityCalendar();
    fetchLeads();
  }, [filterDate]);

  const telecallerRows = useMemo(() => {
    if (!summary?.telecallerPerformance) return [];
    return summary.telecallerPerformance.filter((item) => {
      const lower = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(lower) ||
        item.department.toLowerCase().includes(lower)
      );
    });
  }, [summary, search]);

  const counsellorRows = useMemo(() => {
    if (!summary?.counsellorPerformance) return [];
    return summary.counsellorPerformance.filter((item) => {
      const lower = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(lower) ||
        item.department.toLowerCase().includes(lower)
      );
    });
  }, [summary, search]);

  const totalAssigned = summary?.telecallerPerformance?.reduce(
    (sum, item) => sum + Number(item.totalAssigned || 0),
    0,
  );

  const totalConvertedAssigned = summary?.counsellorPerformance?.reduce(
    (sum, item) => sum + Number(item.totalAssigned || 0),
    0,
  );

  const selectedDay = useMemo(() => {
    return activityCalendar.find((day) => day.date === historyDate) || null;
  }, [activityCalendar, historyDate]);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header with Date Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Lead Management
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl">
              Track telecaller and counsellor daily work with assignments,
              conversions and student tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Date:</span>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border-0 bg-transparent p-0 text-sm font-semibold focus-visible:ring-0 w-40"
              />
            </div>

            <Button
              onClick={() => fetchPerformance()}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="h-4 w-4" /> Active telecallers
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {summary?.activeTelecallers ?? 0}
              </p>
              <p className="text-sm text-slate-500">
                of {summary?.totalTelecallers ?? 0} telecallers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="h-4 w-4" /> Total telecaller assigned
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {totalAssigned ?? 0}
              </p>
              <p className="text-sm text-slate-500">assigned leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="h-4 w-4" /> Active counsellors
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {summary?.activeCounsellors ?? 0}
              </p>
              <p className="text-sm text-slate-500">
                of {summary?.totalCounsellors ?? 0} counsellors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="h-4 w-4" /> Total counsellor assigned
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {totalConvertedAssigned ?? 0}
              </p>
              <p className="text-sm text-slate-500">
                converted / handled leads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Team Performance */}
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Daily Team Performance</CardTitle>
                <p className="text-sm text-slate-500">
                  Telecaller & Counsellor activity for {filterDate}
                </p>
              </div>

              <div className="grid w-full max-w-md gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or department"
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("telecaller")}
                    variant={
                      activeTab === "telecaller" ? "secondary" : "outline"
                    }
                    size="sm"
                  >
                    Telecallers
                  </Button>
                  <Button
                    onClick={() => setActiveTab("counsellor")}
                    variant={
                      activeTab === "counsellor" ? "secondary" : "outline"
                    }
                    size="sm"
                  >
                    Counsellors
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Assigned</TableHead>
                      <TableHead>Updated Today</TableHead>
                      <TableHead>Converted Today</TableHead>
                      <TableHead>
                        {activeTab === "telecaller"
                          ? "Follow-ups Today"
                          : "Session"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(activeTab === "telecaller"
                      ? telecallerRows
                      : counsellorRows
                    ).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.department || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: row.color,
                              color: "white",
                            }}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.totalAssigned ?? 0}</TableCell>
                        <TableCell>{row.updatedToday ?? 0}</TableCell>
                        <TableCell>{row.convertedToday ?? 0}</TableCell>
                        <TableCell>
                          {activeTab === "telecaller"
                            ? (row.followUpToday ?? 0)
                            : row.sessionDuration}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(activeTab === "telecaller"
                      ? telecallerRows
                      : counsellorRows
                    ).length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-12 text-center text-sm text-slate-500"
                        >
                          No data available for selected date.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ==================== SIMPLE ACTIVITY HISTORY ==================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Activity History
            </CardTitle>
            <p className="text-sm text-slate-500">Select date to see history</p>
          </CardHeader>
          <CardContent>
            {activityCalendarLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Simple Date Picker */}
                <div className="flex items-center gap-3 max-w-xs">
                  <CalendarIcon className="h-5 w-5 text-slate-400" />
                  <Input
                    type="date"
                    value={historyDate}
                    onChange={(e) => setHistoryDate(e.target.value)}
                    className="font-medium"
                  />
                </div>

                {/* History Table */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {new Date(historyDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <Badge variant="outline">
                      {selectedDay?.events?.length || 0} Updates
                    </Badge>
                  </div>

                  {selectedDay &&
                  selectedDay.events &&
                  selectedDay.events.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border bg-white">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left">Lead Name</th>
                            <th className="px-4 py-3 text-left">Telecaller</th>
                            <th className="px-4 py-3 text-left">Counsellor</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Progress</th>
                            <th className="px-4 py-3 text-left">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedDay.events.map((event) => (
                            <tr key={event.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-medium">
                                {event.leadName}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {event.telecallerName}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {event.counsellorName}
                              </td>
                              <td className="px-4 py-3">
                                <Badge>{event.status}</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                                  {event.progress}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                {event.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
                      <CalendarIcon className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                      <p className="text-slate-500 text-lg">
                        No activity on this date
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Telecaller Student Tracking */}
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Telecaller Student Tracking</CardTitle>
                <p className="text-sm text-slate-500">
                  All students with their assigned telecaller • Date:{" "}
                  <span className="font-semibold">{filterDate}</span>
                </p>
              </div>

              <div className="grid w-full max-w-md gap-3 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by name / phone / email"
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => fetchLeads(leadSearch)}
                  variant="outline"
                  size="sm"
                >
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Telecaller</TableHead>
                      <TableHead>Counsellor</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lead Tag</TableHead>
                      <TableHead>Follow-up</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell className="font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {lead.assignedToTelecaller?.name || "Not assigned"}
                        </TableCell>
                        <TableCell>
                          {lead.assignedToCounsellor?.name || "Not assigned"}
                        </TableCell>
                        <TableCell>
                          {lead.budget
                            ? `₹${lead.budget.toLocaleString()}`
                            : "-"}
                        </TableCell>
                        {/* Progress Stage Cell - Better Design */}
                        <TableCell className="text-center">
                          <div
                            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold w-max mx-auto
                  bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm"
                          >
                            {lead.progress || "Initial Contact"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className="rounded-full px-2 py-1 text-xs font-medium">
                            {lead.status || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.leadTag || "-"}</TableCell>
                        <TableCell>
                          {lead.followUpDate
                            ? new Date(lead.followUpDate).toLocaleDateString(
                                "en-IN",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {lead.updatedAt
                            ? new Date(lead.updatedAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {leads.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="py-12 text-center text-sm text-slate-500"
                        >
                          No leads found for {filterDate}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadManagement;
