import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Phone,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:8000/api";

const TelecallerAnalyticsDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    convertedToday: 0,
    totalConverted: 0,
    pendingFollowUps: 0,
    averageConversionRate: 0,
  });

  const [chartsData, setChartsData] = useState({
    leadsByTag: [],
    leadsByStatus: [],
    leadsByCountry: [],
    conversionTrend: [],
  });

  const [filters, setFilters] = useState({
    search: "",
    leadTag: "all",
    status: "all",
    country: "all",
  });

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

  // Fetch Telecaller Lead Analysis
  const fetchTelecallerAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/leads/telecallers`, {
        headers: authHeaders,
      });

      const data = res.data?.data || [];
      setLeads(data);

      // Calculate stats
      const stats = {
        totalLeads: data.length,
        hotLeads: data.filter((l) => l.leadTag === "Hot").length,
        warmLeads: data.filter((l) => l.leadTag === "Warm").length,
        coldLeads: data.filter((l) => l.leadTag === "Cold").length,
        convertedToday: res.data?.todayConverted || 0,
        totalConverted: data.filter((l) => l.status === "Converted").length,
        pendingFollowUps: data.filter(
          (l) => l.followUpDate && new Date(l.followUpDate) >= new Date(),
        ).length,
        averageConversionRate:
          data.length > 0
            ? (
                (data.filter((l) => l.status === "Converted").length /
                  data.length) *
                100
              ).toFixed(1)
            : 0,
      };
      setStats(stats);

      // Prepare chart data
      const leadsByTagData = [
        { name: "Hot", value: stats.hotLeads, color: "#ef4444" },
        { name: "Warm", value: stats.warmLeads, color: "#f59e0b" },
        { name: "Cold", value: stats.coldLeads, color: "#3b82f6" },
      ];

      const statusCounts = {};
      data.forEach((lead) => {
        const status = lead.status || "New";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const leadsByStatusData = Object.entries(statusCounts).map(
        ([status, count], idx) => ({
          name: status,
          value: count,
          color: getStatusColor(status),
        }),
      );

      const countryCounts = {};
      data.forEach((lead) => {
        const country = lead.preferredCountry || "Not Set";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });

      const topCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([country, count]) => ({
          name: country,
          value: count,
        }));

      // Conversion trend (last 7 days - mock for now)
      const conversionTrend = generateConversionTrend(data);

      setChartsData({
        leadsByTag: leadsByTagData,
        leadsByStatus: leadsByStatusData,
        leadsByCountry: topCountries,
        conversionTrend,
      });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      toast.error("Failed to load telecaller analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelecallerAnalytics();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.name?.toLowerCase() || "").includes(
          filters.search.toLowerCase(),
        ) ||
        (lead.phone || "").includes(filters.search) ||
        (lead.city?.toLowerCase() || "").includes(filters.search.toLowerCase());

      const matchesTag =
        filters.leadTag === "all" || lead.leadTag === filters.leadTag;
      const matchesStatus =
        filters.status === "all" || lead.status === filters.status;
      const matchesCountry =
        filters.country === "all" || lead.preferredCountry === filters.country;

      return matchesSearch && matchesTag && matchesStatus && matchesCountry;
    });
  }, [leads, filters]);

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.info("No leads to export");
      return;
    }

    const headers =
      "Name,Phone,City,Email,Lead Tag,Status,Follow-up Date,Budget,Country\n";
    const rows = filteredLeads
      .map(
        (lead) =>
          `"${lead.name || ""}","${lead.phone || ""}","${lead.city || ""}","${lead.email || ""}","${lead.leadTag || ""}","${lead.status || ""}","${lead.followUpDate || ""}","₹${lead.budget || 0}","${lead.preferredCountry || ""}"`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `telecaller_leads_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    toast.success("Leads exported successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Telecaller Dashboard</h1>
            <p className="text-sky-100 text-lg">
              {user?.name || "Team Member"} • Lead Management & Analytics
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-3xl font-bold">{stats.totalLeads}</p>
            <p className="text-sky-100">Total Leads</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hotLeads}
          icon={Target}
          color="bg-red-500"
          trend={stats.hotLeads > 0 ? "↑ Priority" : "No hot leads"}
        />
        <StatCard
          title="Converted"
          value={stats.totalConverted}
          icon={CheckCircle}
          color="bg-emerald-500"
          trend={`${stats.averageConversionRate}% rate`}
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={Clock}
          color="bg-amber-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Tag */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Lead Tags Distribution
            </CardTitle>
            <CardDescription>
              Hot, Warm, and Cold leads breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartsData.leadsByTag}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                >
                  {chartsData.leadsByTag.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {chartsData.leadsByTag.map((tag) => (
                <div key={tag.name} className="text-center">
                  <p className="text-2xl font-bold">{tag.value}</p>
                  <p className="text-sm text-slate-500">{tag.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Lead Status Distribution
            </CardTitle>
            <CardDescription>Current status of all your leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartsData.leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={8}>
                  {chartsData.leadsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Top Preferred Countries
            </CardTitle>
            <CardDescription>Lead distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartsData.leadsByCountry.slice(0, 6).map((country, idx) => (
                <div key={country.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{country.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(country.value / Math.max(...chartsData.leadsByCountry.map((c) => c.value))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {country.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Conversion Trend
            </CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartsData.conversionTrend}>
                <defs>
                  <linearGradient
                    id="colorConversions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorConversions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Leads ({filteredLeads.length})
              </CardTitle>
              <CardDescription>
                Manage and track your assigned leads
              </CardDescription>
            </div>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search by name, phone, city..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="col-span-2"
            />
            <Select
              value={filters.leadTag}
              onValueChange={(val) => setFilters({ ...filters, leadTag: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Call Back">Call Back</SelectItem>
                <SelectItem value="Not Interested">Not Interested</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">City</th>
                  <th className="px-4 py-3 text-left font-semibold">Tag</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Follow-up
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Budget</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead._id || lead.id}
                      className="border-b hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">{lead.phone}</td>
                      <td className="px-4 py-3">{lead.city || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`${getTagColor(lead.leadTag)} text-white`}
                        >
                          {lead.leadTag || "None"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{lead.status || "New"}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {lead.followUpDate
                          ? new Date(lead.followUpDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {lead.budget
                          ? `₹${Number(lead.budget).toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/telecaller/leads")}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Leads
            </Button>
            <Button
              onClick={() => navigate("/telecaller/follow-ups")}
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Follow-ups
            </Button>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components & Functions
function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && <p className="text-xs text-slate-500 mt-2">{trend}</p>}
          </div>
          <div className={`${color} p-3 rounded-lg text-white`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTagColor(tag) {
  const colors = {
    Hot: "bg-red-500",
    Warm: "bg-amber-500",
    Cold: "bg-sky-500",
  };
  return colors[tag] || "bg-slate-500";
}

function getStatusColor(status) {
  const colors = {
    New: "#3b82f6",
    Interested: "#10b981",
    "Call Back": "#f59e0b",
    Converted: "#22c55e",
    "Not Interested": "#ef4444",
  };
  return colors[status] || "#6b7280";
}

function generateConversionTrend(leads) {
  const today = new Date();
  const trend = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });

    const conversions = leads.filter(
      (lead) =>
        lead.status === "Converted" &&
        lead.updatedAt &&
        lead.updatedAt.split("T")[0] === dateStr,
    ).length;

    trend.push({
      day: dayName,
      conversions: conversions || 0,
    });
  }

  return trend;
}

export default TelecallerAnalyticsDashboard;
