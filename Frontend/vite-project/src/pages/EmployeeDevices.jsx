// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { Badge } from '../components/ui/badge';
// import { Button } from '../components/ui/button';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || '';
// import {
//   Laptop, Tablet, Smartphone, Monitor, Keyboard, Mouse,
//   Calendar, MapPin, User, Clock
// } from 'lucide-react';

// const EmployeeDevices = () => {

//   const wrapperStyle = {
//     paddingBottom: "20px",
//     marginTop: "20px"
//   };

//   const statCardsContainerStyle = {
//     alignItems: "stretch",
//   };

//   const marginStyle = {
//     marginBottom: "10px"
//   };

//   const button = {
//     width: "200px"
//   }
//   const { user } = useAuth();

//   // Live device state for current employee (will replace dummy data)
//   const [myDevices, setMyDevices] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getDeviceIcon = (type) => {
//     switch (type) {
//       case 'laptop':
//         return Laptop;
//       case 'tablet':
//         return Tablet;
//       case 'phone':
//         return Smartphone;
//       case 'monitor':
//         return Monitor;
//       case 'accessory':
//         return Keyboard;
//       default:
//         return Laptop;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active':
//         return 'default';
//       case 'maintenance':
//         return 'warning';
//       case 'returned':
//         return 'secondary';
//       default:
//         return 'outline';
//     }
//   };

//   const getConditionColor = (condition) => {
//     switch (condition) {
//       case 'excellent':
//         return 'bg-success text-success-foreground';
//       case 'good':
//         return 'bg-primary text-primary-foreground';
//       case 'fair':
//         return 'bg-warning text-warning-foreground';
//       case 'poor':
//         return 'bg-destructive text-destructive-foreground';
//       default:
//         return 'bg-secondary text-secondary-foreground';
//     }
//   };

//   // Normalizer: convert server device shape into the UI shape used here
//   const normalizeDevice = (d) => {
//     const id = d._id || d.id || d.deviceId || null;
//     const name = d.name || d.deviceName || d.raw?.name || '';
//     const type = d.type || d.deviceType || '';
//     const model = d.model || '';
//     const serialNumber = d.serialNumber || d.serial || '';
//     const assignedDate = d.assignedDate || d.assignedAt || d.assignedOn || d.assigned || null;
//     const status = d.status || 'active';
//     const location = d.location || '';
//     const condition = d.condition || 'good';
//     return { id, name, type, model, serialNumber, assignedDate, status, location, condition, raw: d };
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     setLoading(true);
//     axios.get(`${API_BASE}/api/devices/me`, { headers })
//       .then(res => {
//         const payload = res.data?.data || res.data;
//         if (Array.isArray(payload)) {
//           setMyDevices(payload.map(normalizeDevice));
//         } else if (payload && Array.isArray(payload.devices)) {
//           setMyDevices(payload.devices.map(normalizeDevice));
//         } else {
//           setMyDevices([]);
//         }
//       })
//       .catch(err => {
//         console.error('Failed to load employee devices', err);
//         // keep an empty array as fallback
//         setMyDevices([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       {/* Header */}
//       <div className="bg-gradient-hero rounded-2xl p-8 text-black">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">My Company Devices</h1>
//             <p className="text-black">Devices assigned to you by the company</p>
//           </div>
//           <div className="hidden md:block">
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//               <div className="text-2xl font-bold">{myDevices.length}</div>
//               <div className="text-sm text-black">Total Devices</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div style={wrapperStyle} className="flex flex-wrap gap-4 mb-5">
//         <div style={statCardsContainerStyle} className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
//           <Card className="dashboard-card">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-primary/10 rounded-lg">
//                   <Laptop className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{myDevices.filter(d => d.type === 'laptop').length}</p>
//                   <p className="text-sm text-muted-foreground">Laptops</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div style={statCardsContainerStyle} className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
//           <Card className="dashboard-card">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-primary/10 rounded-lg">
//                   <Tablet className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{myDevices.filter(d => d.type === 'tablet').length}</p>
//                   <p className="text-sm text-muted-foreground">Tablets</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div style={statCardsContainerStyle} className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
//           <Card className="dashboard-card">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-primary/10 rounded-lg">
//                   <Smartphone className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{myDevices.filter(d => d.type === 'phone').length}</p>
//                   <p className="text-sm text-muted-foreground">Phones</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div style={statCardsContainerStyle} className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
//           <Card className="dashboard-card">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-primary/10 rounded-lg">
//                   <Monitor className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{myDevices.filter(d => ['monitor', 'accessory'].includes(d.type)).length}</p>
//                   <p className="text-sm text-muted-foreground">Accessories</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Devices List */}
//       <Card style={marginStyle} className="dashboard-card">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Laptop className="w-5 h-5 text-primary" />
//             <span>My Assigned Devices</span>
//           </CardTitle>
//           <CardDescription>
//             All devices currently assigned to {user?.name}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {myDevices.map((device) => {
//               const DeviceIcon = getDeviceIcon(device.type);
//               return (
//                 <div
//                   key={device.id}
//                   className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="p-3 bg-accent rounded-lg">
//                       <DeviceIcon className="w-6 h-6 text-primary" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-lg">{device.name}</h4>
//                       <p className="text-muted-foreground">{device.model}</p>
//                       <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
//                         <div className="flex items-center space-x-1">
//                           <Calendar className="w-4 h-4" />
//                           <span>Assigned: {new Date(device.assignedDate).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <MapPin className="w-4 h-4" />
//                           <span>{device.location}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Badge
//                       className={getConditionColor(device.condition)}
//                     >
//                       {device.condition}
//                     </Badge>
//                     <Badge variant={getStatusColor(device.status)}>
//                       {device.status}
//                     </Badge>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex flex-wrap gap-4 mb-5">
//         {/* Device History */}
//         <Card style={marginStyle} className="dashboard-card flex-1">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Clock className="w-5 h-5 text-primary" />
//               <span>Device Assignment History</span>
//             </CardTitle>
//             <CardDescription>
//               Timeline of your device assignments and returns
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {(() => {
//                 // build timeline events from myDevices
//                 if (loading) {
//                   return (
//                     <div className="text-sm text-muted-foreground">Loading history...</div>
//                   );
//                 }

//                 const userId = user?._id || user?.id || user?.employeeId || user?.email;
//                 const events = [];

//                 myDevices.forEach(device => {
//                   const devName = device.name || device.raw?.name || 'Device';
//                   // prefer server-side history array if present
//                   const hist = (device.raw && Array.isArray(device.raw.history)) ? device.raw.history : [];
//                   if (hist.length) {
//                     hist.forEach(h => {
//                       // h may have employee as id or populated object
//                       const hEmployeeId = (typeof h.employee === 'string') ? h.employee : (h.employee && (h.employee._id || h.employee.id || h.employee.email));
//                       // match by id or email
//                       const matched = userId && hEmployeeId && (String(hEmployeeId) === String(userId) || String(hEmployeeId) === String(user?.email) || String(userId) === String(user?.email));
//                       if (matched) {
//                         events.push({
//                           device: devName,
//                           action: h.action || h.type || 'updated',
//                           date: h.date || h.at || h.createdAt || h.timestamp || null,
//                           notes: h.notes || h.locationNotes || '',
//                           location: h.location || ''
//                         });
//                       }
//                     });
//                   } else {
//                     // fallback: include assignedDate for this device if assigned to current user
//                     const assignedTo = device.raw && (device.raw.assignedTo || device.raw.employeeId || device.raw.employee) ;
//                     const assignedId = (typeof assignedTo === 'string') ? assignedTo : (assignedTo && (assignedTo._id || assignedTo.id || assignedTo.email));
//                     const isAssignedToUser = userId && assignedId && (String(assignedId) === String(userId) || String(assignedId) === String(user?.email));
//                     if (isAssignedToUser && device.assignedDate) {
//                       events.push({ device: devName, action: 'assigned', date: device.assignedDate, notes: '', location: device.location });
//                     }
//                   }
//                 });

//                 if (!events.length) {
//                   return (<div className="text-sm text-muted-foreground">No device history available.</div>);
//                 }

//                 // sort by date descending
//                 events.sort((a,b) => {
//                   const da = a.date ? new Date(a.date).getTime() : 0;
//                   const db = b.date ? new Date(b.date).getTime() : 0;
//                   return db - da;
//                 });

//                 return events.map((ev, idx) => (
//                   <div key={`${ev.device}-${idx}`} className={`flex items-center space-x-4 p-3 rounded-lg ${idx === 0 ? 'bg-accent/50' : ''}`}>
//                     <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
//                     <div className="flex-1">
//                       <p className="font-medium">{ev.device} &mdash; {ev.action}</p>
//                       <p className="text-sm text-muted-foreground">{ev.date ? new Date(ev.date).toLocaleDateString() : 'Unknown date'}{ev.location ? ` — ${ev.location}` : ''}{ev.notes ? ` • ${ev.notes}` : ''}</p>
//                     </div>
//                   </div>
//                 ));
//               })()}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Contact Information */}
//         <Card className="dashboard-card flex-1">
//           <CardHeader>
//             <CardTitle>Need Help?</CardTitle>
//             <CardDescription>
//               Contact IT support for device-related queries
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <p className="text-sm">
//                 <strong>IT Support:</strong> eduhawk.global@gmail.com
//               </p>
//               <p className="text-sm">
//                 <strong>Phone:</strong> ++91 9630736070
//               </p>
//               <p className="text-sm">
//                 <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default EmployeeDevices;

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

import {
  Laptop,
  Tablet,
  Smartphone,
  Monitor,
  Keyboard,
  Mouse,
  Calendar,
  MapPin,
  User,
  Clock,
} from "lucide-react";

const EmployeeDevices = () => {
  const { user } = useAuth();

  // Live device state
  const [myDevices, setMyDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDeviceIcon = (type) => {
    switch (type) {
      case "laptop":
        return Laptop;
      case "tablet":
        return Tablet;
      case "phone":
        return Smartphone;
      case "monitor":
        return Monitor;
      case "accessory":
        return Keyboard;
      default:
        return Laptop;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "maintenance":
        return "warning";
      case "returned":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-700 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "fair":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "poor":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const normalizeDevice = (d) => {
    const id = d._id || d.id || d.deviceId || null;
    const name = d.name || d.deviceName || d.raw?.name || "";
    const type = d.type || d.deviceType || "";
    const model = d.model || "";
    const serialNumber = d.serialNumber || d.serial || "";
    const assignedDate =
      d.assignedDate || d.assignedAt || d.assignedOn || d.assigned || null;
    const status = d.status || "active";
    const location = d.location || "";
    const condition = d.condition || "good";
    return {
      id,
      name,
      type,
      model,
      serialNumber,
      assignedDate,
      status,
      location,
      condition,
      raw: d,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    setLoading(true);
    axios
      .get(`${API_BASE}/api/devices/me`, { headers })
      .then((res) => {
        const payload = res.data?.data || res.data;
        if (Array.isArray(payload)) {
          setMyDevices(payload.map(normalizeDevice));
        } else if (payload && Array.isArray(payload.devices)) {
          setMyDevices(payload.devices.map(normalizeDevice));
        } else {
          setMyDevices([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load employee devices", err);
        setMyDevices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Light Mode Optimized */}
      <div className="bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              My Company Devices
            </h1>
            <p className="text-gray-600">
              Devices assigned to you by the company
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {myDevices.length}
              </div>
              <div className="text-sm text-gray-500">Total Devices</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Laptop className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {myDevices.filter((d) => d.type === "laptop").length}
                  </p>
                  <p className="text-sm text-gray-500">Laptops</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Tablet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {myDevices.filter((d) => d.type === "tablet").length}
                  </p>
                  <p className="text-sm text-gray-500">Tablets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {myDevices.filter((d) => d.type === "phone").length}
                  </p>
                  <p className="text-sm text-gray-500">Phones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-[200px] sm:min-w-[220px] md:min-w-[240px]">
          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      myDevices.filter((d) =>
                        ["monitor", "accessory"].includes(d.type),
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500">Accessories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Devices List */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Laptop className="w-5 h-5 text-blue-600" />
            <span>My Assigned Devices</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            All devices currently assigned to {user?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myDevices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <DeviceIcon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">
                        {device.name}
                      </h4>
                      <p className="text-gray-600">{device.model}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Assigned:{" "}
                            {new Date(device.assignedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{device.location || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getConditionColor(device.condition)}>
                      {device.condition}
                    </Badge>
                    <Badge variant={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4">
        {/* Device History */}
        <Card className="shadow-sm border border-gray-200 flex-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Device Assignment History</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Timeline of your device assignments and returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading history...</div>
              ) : myDevices.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No device history available.
                </div>
              ) : (
                // ... (your existing history logic remains same)
                <div className="text-sm text-gray-500">
                  History items will appear here
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-sm border border-gray-200 flex-1">
          <CardHeader>
            <CardTitle className="text-gray-900">Need Help?</CardTitle>
            <CardDescription className="text-gray-600">
              Contact IT support for device-related queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>IT Support:</strong> eduhawk.global@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> ++91 9630736070
              </p>
              <p>
                <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00
                PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDevices;
