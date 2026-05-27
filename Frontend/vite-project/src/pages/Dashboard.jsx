import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Bell,
  Award,
  Phone,
  Globe,
  FileCheck,
  Building2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, isHR } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    converted: 0,
    pendingFollowUps: 0,
    admissionsInProgress: 0,
    visaPending: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [followUpsToday, setFollowUpsToday] = useState([]);
  const [leadSourceData, setLeadSourceData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [monthlyConversionData, setMonthlyConversionData] = useState([]);
  const [telecallerLoginInfo, setTelecallerLoginInfo] = useState([]);
  const [counsellorLoginInfo, setCounsellorLoginInfo] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const API_BASE = API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || res.data;

        setStats({
          totalLeads: data.totalLeads || 0,
          hotLeads: data.hotLeads || 0,
          warmLeads: data.warmLeads || 0,
          coldLeads: data.coldLeads || 0,
          converted: data.converted || 0,
          pendingFollowUps: data.pendingFollowUps || 0,
          admissionsInProgress: data.admissionsInProgress || 0,
          visaPending: data.visaPending || 0,
        });

        setRecentActivities(data.recentActivities || []);
        setUpcomingFollowUps(data.upcomingFollowUps || []);
        setFollowUpsToday(data.followUpsToday || []);
        setLeadSourceData(data.leadSourceData || []);
        setStatusData(data.statusData || []);
        setMonthlyConversionData(data.monthlyConversionData || []);
        setTelecallerLoginInfo(data.telecallerLoginInfo || []);
        setCounsellorLoginInfo(data.counsellorLoginInfo || []);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
        toast.error("Failed to load dashboard data");

        // ==================== FALLBACK MOCK DATA ====================
        setStats({
          totalLeads: 1248,
          hotLeads: 87,
          warmLeads: 234,
          coldLeads: 612,
          converted: 315,
          pendingFollowUps: 68,
          admissionsInProgress: 42,
          visaPending: 19,
        });

        setRecentActivities([
          {
            id: 1,
            action: "Lead updated: Priya Sharma",
            user: "Rahul Sharma",
            time: "10 min ago",
            type: "lead",
          },
          {
            id: 2,
            action: "Lead converted",
            user: "Priya Patel",
            time: "2 hours ago",
            type: "conversion",
          },
          {
            id: 3,
            action: "Follow-up completed",
            user: "Amit Kumar",
            time: "Yesterday",
            type: "followup",
          },
        ]);

        setUpcomingFollowUps([
          { id: 1, student: "Vikas Singh", country: "Canada", date: "Today" },
          { id: 2, student: "Neha Gupta", country: "UK", date: "Tomorrow" },
          { id: 3, student: "Rohan Mehta", country: "Germany", date: "Apr 30" },
        ]);

        setLeadSourceData([
          { name: "IVR", value: 45, percentage: 45, color: "#3b82f6" },
          { name: "Website", value: 30, percentage: 30, color: "#10b981" },
          { name: "WhatsApp", value: 15, percentage: 15, color: "#f59e0b" },
        ]);

        setStatusData([
          { name: "New", value: 456, percentage: 37, color: "#3b82f6" },
          { name: "Interested", value: 289, percentage: 23, color: "#10b981" },
          { name: "Call Back", value: 198, percentage: 16, color: "#f59e0b" },
          { name: "Converted", value: 215, percentage: 17, color: "#22c55e" },
          {
            name: "Not Interested",
            value: 67,
            percentage: 5,
            color: "#ef4444",
          },
          { name: "Dropped", value: 23, percentage: 2, color: "#6b7280" },
        ]);

        setMonthlyConversionData([
          { month: "Oct", conversions: 28 },
          { month: "Nov", conversions: 35 },
          { month: "Dec", conversions: 42 },
          { month: "Jan", conversions: 51 },
          { month: "Feb", conversions: 47 },
          { month: "Mar", conversions: 63 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || "Team Member"}
            </h1>

            <p className="text-blue-100">
              Here's your EDU-HAWK CRM overview for today.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <h5 className="text-3xl font-bold mb-2">
              {user?.role || "Team Member"}
            </h5>
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString("en-IN")}
            </div>
            <div className="text-sm opacity-75">Today</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          change="+12%"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hotLeads}
          change="+5"
          icon={Target}
          trend="up"
          color="text-orange-600"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          change="+18"
          icon={FileCheck}
          trend="up"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          change="-3"
          icon={Clock}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Admissions In Progress"
          value={stats.admissionsInProgress}
          icon={Building2}
        />
        <StatCard title="Visa Pending" value={stats.visaPending} icon={Globe} />
        <StatCard
          title="Warm Leads"
          value={stats.warmLeads}
          icon={TrendingUp}
        />
        <StatCard title="Cold Leads" value={stats.coldLeads} icon={Users} />
      </div>

      {/* Charts Section */}
      {isHR && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Team login & session details
            </CardTitle>
            <CardDescription>
              Telecaller and counsellor login/logout status for admin users.
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
                {telecallerLoginInfo.map((user) => (
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
                    <td className="px-4 py-3 text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {user.lastLogout}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {user.sessionDuration}
                    </td>
                  </tr>
                ))}
                {counsellorLoginInfo.map((user) => (
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
                    <td className="px-4 py-3 text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {user.lastLogout}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {user.sessionDuration}
                    </td>
                  </tr>
                ))}
                {telecallerLoginInfo.length === 0 &&
                  counsellorLoginInfo.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-slate-500"
                      >
                        No login session data available.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Conversions
            </CardTitle>
            <CardDescription>
              Lead to Conversion Trend (Last 6 Months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ fill: "#3b82f6", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Lead Sources
            </CardTitle>
            <CardDescription>Distribution by Source</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-3 mt-6">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm">
                    {source.name} ({source.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Lead Status Distribution
            </CardTitle>
            <CardDescription>Current Status of All Leads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip />
                <Bar dataKey="value" radius={8}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {statusData.map((status) => (
                <div key={status.name} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ backgroundColor: status.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{status.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{status.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {status.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Upcoming Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>
                        {activity.user?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Follow-ups
            </CardTitle>
            <CardDescription>Leads needing attention soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingFollowUps.length > 0 ? (
                upcomingFollowUps.map((followup) => (
                  <div
                    key={followup.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{followup.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {followup.country}
                      </p>
                    </div>
                    <Badge variant="secondary">{followup.date}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No upcoming follow-ups</p>
              )}
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => navigate("/follow-ups")}
            >
              View All Follow-ups
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Follow-up Reminders (visible to telecallers/counsellors) */}
      {followUpsToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Follow-up Reminders
            </CardTitle>
            <CardDescription>
              Leads scheduled for follow-up today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {followUpsToday.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{f.student}</p>
                    <p className="text-sm text-muted-foreground">{f.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{f.time}</p>
                    <p className="text-sm text-muted-foreground">{f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigate("/addstudent")}
            >
              <Users className="w-6 h-6" />
              Add New Lead
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigate("/admindashboard")}
            >
              <Target className="w-6 h-6" />
              All Leads
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigate("/lead-management")}
            >
              <FileCheck className="w-6 h-6" />
              LeadManagement
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigate("/leadbulkassignment")}
            >
              <Globe className="w-6 h-6" />
              Lead Bulk Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
