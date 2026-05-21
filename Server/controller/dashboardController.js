// const Lead = require("../models/lead/LeadModel");
// const User = require("../models/Employee.js");

// const formatDateTime = (date) => {
//   if (!date) return "N/A";
//   const value = new Date(date);
//   if (Number.isNaN(value.getTime())) return String(date);
//   return value.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getStatusColor = (status) => {
//   switch (status) {
//     case "New": return "#3b82f6";
//     case "Interested": return "#10b981";
//     case "Call Back": return "#f59e0b";
//     case "Converted": return "#22c55e";
//     case "Not Interested": return "#ef4444";
//     case "Dropped": return "#6b7280";
//     default: return "#8b5cf6";
//   }
// };

// exports.getDashboardData = async (req, res) => {
//   try {
//     const { role, _id: userId } = req.user;

//     let matchFilter = {};

//     if (role === "Telecaller") {
//       matchFilter.assignedToTelecaller = userId;
//     } else if (role === "Counsellor") {
//       matchFilter.assignedToCounsellor = userId;
//     }
//     // Admin sees everything

//     const today = new Date();

//     // ==================== LEAD DATA ====================
//     const [
//       totalLeads,
//       hotLeads,
//       warmLeads,
//       coldLeads,
//       converted,
//       pendingFollowUps,
//       admissionsInProgress,
//       visaPending,
//     ] = await Promise.all([
//       Lead.countDocuments(matchFilter),
//       Lead.countDocuments({ ...matchFilter, leadTag: "Hot" }),
//       Lead.countDocuments({ ...matchFilter, leadTag: "Warm" }),
//       Lead.countDocuments({ ...matchFilter, leadTag: "Cold" }),
//       Lead.countDocuments({ ...matchFilter, status: "Converted" }),
//       Lead.countDocuments({
//         ...matchFilter,
//         followUpDate: { $gte: today },
//         status: { $ne: "Converted" },
//       }),
//       Lead.countDocuments({ ...matchFilter, status: "Converted", registrationFeePaid: false }),
//       Lead.countDocuments({ ...matchFilter, visaApplied: true, visaIssued: false }),
//     ]);

//     // ==================== USER LOGIN STATUS ====================
//     const userMatch = { role: { $in: ["Telecaller", "Counsellor"] } };

//     const usersLoginData = await User.find(userMatch)
//       .select("name role isLoggedIn lastLogin lastLogout")
//       .lean();

//     const activeTelecallers = usersLoginData.filter(u => u.role === "Telecaller" && u.isLoggedIn);
//     const activeCounsellors = usersLoginData.filter(u => u.role === "Counsellor" && u.isLoggedIn);

//     const telecallerLoginInfo = usersLoginData
//       .filter(u => u.role === "Telecaller")
//       .map(user => ({
//         id: user._id,
//         name: user.name,
//         status: user.isLoggedIn ? "Active" : "Offline",
//         lastLogin: formatDateTime(user.lastLogin),
//         lastLogout: formatDateTime(user.lastLogout),
//         color: user.isLoggedIn ? "#10b981" : "#ef4444"
//       }));

//     const counsellorLoginInfo = usersLoginData
//       .filter(u => u.role === "Counsellor")
//       .map(user => ({
//         id: user._id,
//         name: user.name,
//         status: user.isLoggedIn ? "Active" : "Offline",
//         lastLogin: formatDateTime(user.lastLogin),
//         lastLogout: formatDateTime(user.lastLogout),
//         color: user.isLoggedIn ? "#10b981" : "#ef4444"
//       }));

//     // ==================== RECENT ACTIVITIES & OTHER DATA ====================
//     const recentActivitiesDocs = await Lead.find(matchFilter)
//       .sort({ updatedAt: -1 })
//       .limit(5)
//       .lean();

//     const recentActivities = recentActivitiesDocs.map((lead) => ({
//       id: lead._id,
//       action: `Lead updated: ${lead.name}`,
//       user: lead.assignedToTelecaller?.name || lead.assignedToCounsellor?.name || "System",
//       time: formatDateTime(lead.updatedAt),
//       type: "lead",
//     }));

//     const upcomingFollowUpsDocs = await Lead.find({
//       ...matchFilter,
//       followUpDate: { $gte: today },
//     })
//       .sort({ followUpDate: 1 })
//       .limit(5)
//       .lean();

//     const upcomingFollowUps = upcomingFollowUpsDocs.map((lead) => ({
//       id: lead._id,
//       student: lead.name,
//       country: lead.preferredCountry || "Not set",
//       date: formatDateTime(lead.followUpDate),
//     }));

//     // Lead Source & Status Data (unchanged)
//     const leadSourceDataDocs = await Lead.aggregate([
//       { $match: matchFilter },
//       { $group: { _id: "$source", count: { $sum: 1 } } },
//     ]);

//     const totalSourceCount = leadSourceDataDocs.reduce((sum, item) => sum + item.count, 0);

//     const leadSourceData = leadSourceDataDocs.map((item) => ({
//       name: item._id || "Unknown",
//       value: item.count,
//       percentage: totalSourceCount ? Number(((item.count / totalSourceCount) * 100).toFixed(0)) : 0,
//       color: item._id === "IVR" ? "#3b82f6" : item._id === "Website" ? "#10b981" : "#f59e0b",
//     }));

//     const statusDataDocs = await Lead.aggregate([
//       { $match: matchFilter },
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     const totalLeadsCount = statusDataDocs.reduce((sum, item) => sum + item.count, 0);

//     const statusData = statusDataDocs.map((item) => ({
//       name: item._id,
//       value: item.count,
//       percentage: totalLeadsCount ? Number(((item.count / totalLeadsCount) * 100).toFixed(0)) : 0,
//       color: getStatusColor(item._id),
//     }));

//     const monthlyConversionData = await Lead.aggregate([
//       { $match: { ...matchFilter, status: "Converted" } },
//       {
//         $group: {
//           _id: { month: { $month: "$updatedAt" }, year: { $year: "$updatedAt" } },
//           conversions: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//       { $limit: 6 },
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const monthlyConversion = monthlyConversionData.map((item) => ({
//       month: monthNames[item._id.month - 1],
//       conversions: item.conversions,
//     }));

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalLeads,
//         hotLeads,
//         warmLeads,
//         coldLeads,
//         converted,
//         pendingFollowUps,
//         admissionsInProgress,
//         visaPending,

//         // New Login Data
//         activeTelecallers: activeTelecallers.length,
//         activeCounsellors: activeCounsellors.length,
//         telecallerLoginInfo,
//         counsellorLoginInfo,

//         recentActivities,
//         upcomingFollowUps,
//         leadSourceData,
//         statusData,
//         monthlyConversionData: monthlyConversion,
//         role,
//       },
//     });
//   } catch (error) {
//     console.error("Dashboard data error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching dashboard data.",
//       error: error.message,
//     });
//   }
// };

const Lead = require("../models/lead/LeadModel");
const User = require("../models/Employee.js"); // Your Employee model

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "N/A";
  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (startDate, endDate) => {
  if (!startDate) return "N/A";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "N/A";
  const diffMs = Math.max(0, end - start);
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "#3b82f6";
    case "Interested":
      return "#10b981";
    case "Call Back":
      return "#f59e0b";
    case "Converted":
      return "#22c55e";
    case "Not Interested":
      return "#ef4444";
    case "Dropped":
      return "#6b7280";
    default:
      return "#8b5cf6";
  }
};

exports.getLeadPerformance = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const telecallers = await User.find({ role: "Telecaller" })
      .select("name isLoggedIn lastLogin lastLogout department")
      .populate("department", "name")
      .lean();

    const counsellors = await User.find({ role: "Counsellor" })
      .select("name isLoggedIn lastLogin lastLogout department")
      .populate("department", "name")
      .lean();

    const telecallerIds = telecallers.map((user) => user._id);
    const counsellorIds = counsellors.map((user) => user._id);

    const telecallerStats = await Lead.aggregate([
      { $match: { assignedToTelecaller: { $in: telecallerIds } } },
      {
        $group: {
          _id: "$assignedToTelecaller",
          totalAssigned: { $sum: 1 },
          updatedToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$updatedAt", todayStart] },
                    { $lt: ["$updatedAt", todayEnd] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          convertedToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Converted"] },
                    { $gte: ["$updatedAt", todayStart] },
                    { $lt: ["$updatedAt", todayEnd] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          followUpToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "Converted"] },
                    { $gte: ["$followUpDate", todayStart] },
                    { $lt: ["$followUpDate", todayEnd] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const counsellorStats = await Lead.aggregate([
      { $match: { assignedToCounsellor: { $in: counsellorIds } } },
      {
        $group: {
          _id: "$assignedToCounsellor",
          totalAssigned: { $sum: 1 },
          updatedToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$updatedAt", todayStart] },
                    { $lt: ["$updatedAt", todayEnd] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          convertedToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Converted"] },
                    { $gte: ["$updatedAt", todayStart] },
                    { $lt: ["$updatedAt", todayEnd] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const telecallerMap = new Map(
      telecallerStats.map((item) => [String(item._id), item]),
    );
    const counsellorMap = new Map(
      counsellorStats.map((item) => [String(item._id), item]),
    );

    const telecallerPerformance = telecallers.map((user) => {
      const stats = telecallerMap.get(String(user._id)) || {};
      return {
        id: user._id,
        name: user.name,
        department: user.department?.name || "",
        status: user.isLoggedIn ? "Active" : "Offline",
        color: user.isLoggedIn ? "#10b981" : "#ef4444",
        sessionDuration: user.lastLogin
          ? formatDuration(
              user.lastLogin,
              user.isLoggedIn ? new Date() : user.lastLogout,
            )
          : "0m",
        totalAssigned: stats.totalAssigned || 0,
        updatedToday: stats.updatedToday || 0,
        convertedToday: stats.convertedToday || 0,
        followUpToday: stats.followUpToday || 0,
      };
    });

    const counsellorPerformance = counsellors.map((user) => {
      const stats = counsellorMap.get(String(user._id)) || {};
      return {
        id: user._id,
        name: user.name,
        department: user.department?.name || "",
        status: user.isLoggedIn ? "Active" : "Offline",
        color: user.isLoggedIn ? "#10b981" : "#ef4444",
        sessionDuration: user.lastLogin
          ? formatDuration(
              user.lastLogin,
              user.isLoggedIn ? new Date() : user.lastLogout,
            )
          : "0m",
        totalAssigned: stats.totalAssigned || 0,
        updatedToday: stats.updatedToday || 0,
        convertedToday: stats.convertedToday || 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        activeTelecallers: telecallerPerformance.filter(
          (item) => item.status === "Active",
        ).length,
        totalTelecallers: telecallerPerformance.length,
        activeCounsellors: counsellorPerformance.filter(
          (item) => item.status === "Active",
        ).length,
        totalCounsellors: counsellorPerformance.length,
        telecallerPerformance,
        counsellorPerformance,
      },
    });
  } catch (error) {
    console.error("Lead performance error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching lead performance data.",
      error: error.message,
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    let matchFilter = {};

    // Role-based Lead Filtering
    if (role === "Telecaller") {
      matchFilter.assignedToTelecaller = userId;
    } else if (role === "Counsellor") {
      matchFilter.assignedToCounsellor = userId;
    }
    // Admin / Super Admin → sees all leads

    const today = new Date();

    // ==================== LEAD STATISTICS ====================
    const [
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      converted,
      pendingFollowUps,
      admissionsInProgress,
      visaPending,
    ] = await Promise.all([
      Lead.countDocuments(matchFilter),
      Lead.countDocuments({ ...matchFilter, leadTag: "Hot" }),
      Lead.countDocuments({ ...matchFilter, leadTag: "Warm" }),
      Lead.countDocuments({ ...matchFilter, leadTag: "Cold" }),
      Lead.countDocuments({ ...matchFilter, status: "Converted" }),
      Lead.countDocuments({
        ...matchFilter,
        followUpDate: { $gte: today },
        status: { $ne: "Converted" },
      }),
      Lead.countDocuments({
        ...matchFilter,
        status: "Converted",
        registrationFeePaid: false,
      }),
      Lead.countDocuments({
        ...matchFilter,
        visaApplied: true,
        visaIssued: false,
      }),
    ]);

    // ==================== USER (TELECALLER + COUNSELLOR) LOGIN STATUS ====================
    const users = await User.find({
      role: { $in: ["Telecaller", "Counsellor"] },
    })
      .select("name role isLoggedIn lastLogin lastLogout department")
      .populate("department", "name") // Populate department name
      .lean();

    const activeTelecallers = users.filter(
      (u) => u.role === "Telecaller" && u.isLoggedIn === true,
    ).length;
    const activeCounsellors = users.filter(
      (u) => u.role === "Counsellor" && u.isLoggedIn === true,
    ).length;

    const telecallerLoginInfo = users
      .filter((u) => u.role === "Telecaller")
      .map((user) => ({
        id: user._id,
        name: user.name,
        department: user.department?.name || "",
        status: user.isLoggedIn ? "Active" : "Offline",
        lastLogin: user.lastLogin
          ? formatDateTime(user.lastLogin)
          : "Not logged in",
        lastLogout: user.lastLogout
          ? formatDateTime(user.lastLogout)
          : "Not logged out",
        sessionDuration: user.lastLogin
          ? formatDuration(
              user.lastLogin,
              user.isLoggedIn ? new Date() : user.lastLogout,
            )
          : "0m",
        color: user.isLoggedIn ? "#10b981" : "#ef4444",
      }));

    const counsellorLoginInfo = users
      .filter((u) => u.role === "Counsellor")
      .map((user) => ({
        id: user._id,
        name: user.name,
        department: user.department?.name || "",
        status: user.isLoggedIn ? "Active" : "Offline",
        lastLogin: user.lastLogin
          ? formatDateTime(user.lastLogin)
          : "Not logged in",
        lastLogout: user.lastLogout
          ? formatDateTime(user.lastLogout)
          : "Not logged out",
        sessionDuration: user.lastLogin
          ? formatDuration(
              user.lastLogin,
              user.isLoggedIn ? new Date() : user.lastLogout,
            )
          : "0m",
        color: user.isLoggedIn ? "#10b981" : "#ef4444",
      }));

    // ==================== RECENT ACTIVITIES (with proper names) ====================
    const recentActivitiesDocs = await Lead.find(matchFilter)
      .populate("assignedToTelecaller", "name")
      .populate("assignedToCounsellor", "name")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    const recentActivities = recentActivitiesDocs.map((lead) => ({
      id: lead._id,
      action: `Lead updated: ${lead.name}`,
      user:
        lead.assignedToTelecaller?.name ||
        lead.assignedToCounsellor?.name ||
        "System",
      time: formatDateTime(lead.updatedAt),
      type: "lead",
    }));

    // ==================== UPCOMING FOLLOW-UPS ====================
    const upcomingFollowUpsDocs = await Lead.find({
      ...matchFilter,
      followUpDate: { $gte: today },
    })
      .sort({ followUpDate: 1 })
      .limit(5)
      .lean();

    const upcomingFollowUps = upcomingFollowUpsDocs.map((lead) => ({
      id: lead._id,
      student: lead.name,
      country: lead.preferredCountry || "Not set",
      date: formatDateTime(lead.followUpDate),
    }));

    // ==================== ACTIVITY CALENDAR HISTORY ====================
    const calendarWindowStart = new Date();
    calendarWindowStart.setDate(calendarWindowStart.getDate() - 14);
    calendarWindowStart.setHours(0, 0, 0, 0);

    const calendarLeads = await Lead.find({
      ...matchFilter,
      updatedAt: { $gte: calendarWindowStart },
    })
      .populate("assignedToTelecaller", "name")
      .populate("assignedToCounsellor", "name")
      .populate("lastUpdatedBy", "name role")
      .sort({ updatedAt: -1 })
      .lean();

    const activityCalendarMap = new Map();

    calendarLeads.forEach((lead) => {
      const dateKey = new Date(lead.updatedAt).toISOString().slice(0, 10);
      const existing = activityCalendarMap.get(dateKey) || {
        date: dateKey,
        telecallerUpdates: 0,
        counsellorUpdates: 0,
        converted: 0,
        events: [],
      };

      if (lead.assignedToTelecaller) existing.telecallerUpdates += 1;
      if (lead.assignedToCounsellor) existing.counsellorUpdates += 1;
      if (lead.status === "Converted") existing.converted += 1;

      existing.events.push({
        id: lead._id,
        time: formatDateTime(lead.updatedAt),
        leadName: lead.name,
        telecallerName:
          lead.lastUpdatedBy?.role === "Telecaller"
            ? lead.lastUpdatedBy.name
            : "-",
        counsellorName:
          lead.lastUpdatedBy?.role === "Counsellor"
            ? lead.lastUpdatedBy.name
            : "-",
        status: lead.status,
        progress: lead.progress || "Initial Contact",
      });

      activityCalendarMap.set(dateKey, existing);
    });

    const activityCalendar = Array.from(activityCalendarMap.values())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14);

    // ==================== LEAD SOURCE DATA ====================
    const leadSourceDataDocs = await Lead.aggregate([
      { $match: matchFilter },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    const totalSourceCount = leadSourceDataDocs.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    const leadSourceData = leadSourceDataDocs.map((item) => ({
      name: item._id || "Unknown",
      value: item.count,
      percentage: totalSourceCount
        ? Number(((item.count / totalSourceCount) * 100).toFixed(0))
        : 0,
      color:
        item._id === "IVR"
          ? "#3b82f6"
          : item._id === "Website"
            ? "#10b981"
            : "#f59e0b",
    }));

    // ==================== STATUS DISTRIBUTION ====================
    const statusDataDocs = await Lead.aggregate([
      { $match: matchFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalLeadsCount = statusDataDocs.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    const statusData = statusDataDocs.map((item) => ({
      name: item._id,
      value: item.count,
      percentage: totalLeadsCount
        ? Number(((item.count / totalLeadsCount) * 100).toFixed(0))
        : 0,
      color: getStatusColor(item._id),
    }));

    // ==================== MONTHLY CONVERSION ====================
    const monthlyConversionData = await Lead.aggregate([
      { $match: { ...matchFilter, status: "Converted" } },
      {
        $group: {
          _id: {
            month: { $month: "$updatedAt" },
            year: { $year: "$updatedAt" },
          },
          conversions: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyConversion = monthlyConversionData.map((item) => ({
      month: monthNames[item._id.month - 1] || "Unknown",
      conversions: item.conversions,
    }));

    // ==================== FINAL RESPONSE ====================
    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        converted,
        pendingFollowUps,
        admissionsInProgress,
        visaPending,

        // Telecaller & Counsellor Login Info + Department
        activeTelecallers,
        activeCounsellors,
        telecallerLoginInfo,
        counsellorLoginInfo,

        recentActivities,
        upcomingFollowUps,
        activityCalendar,
        leadSourceData,
        statusData,
        monthlyConversionData: monthlyConversion,
        role,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard data.",
      error: error.message,
    });
  }
};
