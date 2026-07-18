

import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import {
  Settings,
  User,
  LogOut,
  Users,
  Calendar,
  Building2,
  DollarSign,
  UserCheck,
  Briefcase,
  Sun,
  Moon,
  Monitor,
  Laptop,
  ChevronLeft,
  List,
  Target,
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deptName, setDeptName] = useState("");

  const isAdmin = user?.role === "Admin";
  const isTelecaller = user?.role === "Telecaller";
  const isCounsellor = user?.role === "Counsellor";

  const API_BASE = "http://localhost:8000";
  const token = localStorage.getItem("authToken");

  // Fetch department name...
  useEffect(() => {
    let mounted = true;
    const department = user?.department;

    if (!department) {
      setDeptName("");
      return;
    }

    if (typeof department === "object" && department?.name) {
      setDeptName(department.name);
      return;
    }

    if (
      typeof department === "string" &&
      !/^[0-9a-fA-F]{24}$/.test(department)
    ) {
      setDeptName(department);
      return;
    }

    if (typeof department === "string") {
      const fetchDepartment = async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/api/departments/${department}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (mounted) {
            setDeptName(res.data?.data?.name || res.data?.name || "");
          }
        } catch (err) {
          console.error("Failed to fetch department name:", err);
          setDeptName("");
        }
      };
      fetchDepartment();
    }

    return () => {
      mounted = false;
    };
  }, [user?.department, API_BASE, token]);

  const toggleTheme = () => {
    setTheme("light");
  };

  const getThemeIcon = () => Sun;

  const ThemeIcon = getThemeIcon();

  const handleLogout = () => logout();

  const navigationItems = isAdmin
    ? [
        { label: "Dashboard", href: "/dashboard", icon: Building2 },
        { label: "Employees", href: "/employees", icon: Users },
        { label: "My Profile", href: "/profile", icon: User },
        { label: "Add Student", href: "/addstudent", icon: UserCheck },
        { label: "Departments", href: "/department", icon: Building2 },
        {
          label: "Assign Students",
          href: "/leadbulkassignment",
          icon: Calendar,
        },
        { label: "Lead Management", href: "/lead-management", icon: List },
        { label: "Lead Dashboard", href: "/admindashboard", icon: UserCheck },
        { label: "Employee Devices", href: "/device-management", icon: Laptop },
        { label: "Goals", href: "/goals", icon: Target },
      ]
    : isTelecaller
      ? [
          { label: "Dashboard", href: "/telecaller-analytics", icon: Target },
          { label: "My Profile", href: "/profile", icon: User },
          {
            label: "Telecaller Lead",
            href: "/tellcullerlead",
            icon: UserCheck,
          },
          { label: "Employee Devices", href: "/my-devices", icon: Laptop },
          { label: "Goals", href: "/goals", icon: Target },
        ]
      : isCounsellor
        ? [
            { label: "Dashboard", href: "/dashboard", icon: UserCheck },
            { label: "My Profile", href: "/profile", icon: User },
            { label: "Add Student", href: "/addstudent", icon: UserCheck },
            {
              label: "Assign Students",
              href: "/leadbulkassignment",
              icon: Calendar,
            },
            {
              label: "Counselor Lead",
              href: "/counsellorlead",
              icon: UserCheck,
            },
            { label: "Employee Devices", href: "/my-devices", icon: Laptop },
            { label: "Goals", href: "/goals", icon: Target },
          ]
        : [{ label: "Goals", href: "/goals", icon: Target }];

  const isActiveLink = (href: string) => location.pathname === href;

  return (
    <aside
      className={`hidden lg:flex lg:sticky top-0 lg:h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex-shrink-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <Link
          to="/dashboard"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center overflow-hidden" />
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-xl text-foreground">Edu-Hawk</h1>
              <p className="text-xs text-muted-foreground -mt-1">CRM System</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.href);

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? "bg-zinc-800 dark:bg-zinc-800 text-white font-medium shadow-sm" // ← Dark active style
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : ""}`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-auto p-2 ${
                isCollapsed ? "px-2" : ""
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src={user?.profileImage || user?.avatar || "/placeholder.svg"}
                  alt={user?.name}
                />
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 text-left ml-3 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-56 bg-white "
            side="right"
          >
            <div className="px-4 py-3">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {deptName || "No Department"}
              </Badge>
              <Badge
                variant={isAdmin ? "default" : "outline"}
                className="ml-2 text-xs"
              >
                {user?.role || "Employee"}
              </Badge>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-auto p-2"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
          {!isCollapsed && (
            <span className="ml-3 text-sm">Collapse Sidebar</span>
          )}
        </Button>
      </div>
    </aside>
  );
};
