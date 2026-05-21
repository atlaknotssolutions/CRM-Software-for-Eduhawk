// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
// import { Mail, Lock, User, Shield, ArrowLeft } from "lucide-react";
// import logo from "../../assets/download.jpg";
// import { toast } from "react-toastify";

// const API_URL = import.meta.env.VITE_API_URL;

// export const AuthForm = () => {
//   const { login, signup } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [mode, setMode] = useState("login");
//   const [otpCode, setOtpCode] = useState("");

//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//     role: "Telecaller",
//   });

//   const [signupForm, setSignupForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "Telecaller",
//     avatar: "",
//   });

//   const [forgotForm, setForgotForm] = useState({
//     email: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [departments, setDepartments] = useState([]);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [resetToken, setResetToken] = useState("");

//   const API_BASE = API_URL;

//   const fetchDepartments = async () => {
//     setLoadingDepartments(true);
//     try {
//       const res = await axios.get(`${API_BASE}/api/departments/public-list`);
//       const list = (res.data?.data || []).filter(
//         (d) => !!d?.name && (d?._id || d?.id),
//       );
//       const normalized = list.map((d) => ({
//         id: d.id || d._id,
//         name: d.name,
//       }));
//       setDepartments(normalized);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingDepartments(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(loginForm.email, loginForm.password, loginForm.role);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupForm.password !== signupForm.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         name: signupForm.name,
//         email: signupForm.email,
//         role: signupForm.role,
//         departmentId: signupForm.department,
//         avatar: signupForm.avatar || "",
//         password: signupForm.password,
//         confirmPassword: signupForm.confirmPassword,
//       };
//       await signup(payload);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Signup error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotEmail = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/forget-password`, {
//         email: forgotForm.email,
//       });
//       toast.success(res.data.message);
//       setMode("forgot-code");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCodeVerification = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
//         email: forgotForm.email.trim(),
//         otp: otpCode.trim(),
//       });
//       setResetToken(res.data.resetToken);
//       toast.success(res.data.message);
//       setMode("forgot-password");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid or expired code");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordReset = async (e) => {
//     e.preventDefault();
//     if (forgotForm.newPassword !== forgotForm.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/api/auth/reset-password`, {
//         resetToken,
//         newPassword: forgotForm.newPassword,
//         confirmNewPassword: forgotForm.confirmPassword,
//       });
//       toast.success(res.data.message);
//       setMode("login");
//       setForgotForm({ email: "", newPassword: "", confirmPassword: "" });
//       setOtpCode("");
//       setResetToken("");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo & Title */}
//         <div className="text-center mb-10">
//           <div className="mx-auto w-50 h-20  rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
//             <img
//               src={logo}
//               alt="AtlaKnots Logo"
//               className="w-40 h-16 object-cover rounded-2xl"
//             />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
//             Edu-Hawk
//           </h1>
//           <p className="text-gray-600 mt-1 text-lg">
//             Customer Relationship Management System
//           </p>
//         </div>

//         {/* Main Card */}
//         <Card className="shadow-xl border border-gray-200 rounded-3xl overflow-hidden bg-white">
//           <CardHeader className="text-center pt-8 pb-6">
//             {mode === "login" && (
//               <>
//                 <CardTitle className="text-2xl text-gray-900">
//                   Welcome Back
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 mt-2 text-base">
//                   Sign in to access your dashboard
//                 </CardDescription>
//               </>
//             )}
//             {mode === "signup" && (
//               <>
//                 <CardTitle className="text-2xl text-gray-900">
//                   Create Account
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 mt-2 text-base">
//                   Join our team today
//                 </CardDescription>
//               </>
//             )}
//             {mode === "forgot-email" && (
//               <>
//                 <CardTitle className="text-2xl text-gray-900">
//                   Reset Password
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 mt-2 text-base">
//                   Enter your email to receive a reset code
//                 </CardDescription>
//               </>
//             )}
//             {mode === "forgot-code" && (
//               <>
//                 <CardTitle className="text-2xl text-gray-900">
//                   Verify Code
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 mt-2 text-base">
//                   Enter the 6-digit code sent to your email
//                 </CardDescription>
//               </>
//             )}
//             {mode === "forgot-password" && (
//               <>
//                 <CardTitle className="text-2xl text-gray-900">
//                   New Password
//                 </CardTitle>
//                 <CardDescription className="text-gray-600 mt-2 text-base">
//                   Create your new password
//                 </CardDescription>
//               </>
//             )}
//           </CardHeader>

//           <CardContent className="px-8 pb-10 space-y-6">
//             {/* ====================== LOGIN FORM ====================== */}
//             {mode === "login" && (
//               <form onSubmit={handleLogin} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Role</Label>
//                   <Select
//                     value={loginForm.role}
//                     onValueChange={(value) =>
//                       setLoginForm((prev) => ({ ...prev, role: value }))
//                     }
//                   >
//                     <SelectTrigger className="h-12 border-gray-300 focus:ring-indigo-600">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Telecaller">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4" /> Telecaller
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="Counsellor">
//                         <div className="flex items-center gap-2">
//                           <Shield className="w-4 h-4" /> Counsellor
//                         </div>
//                       </SelectItem>

//                         <SelectItem value="Counsellor">
//                         <div className="flex items-center gap-2">
//                           <Shield className="w-4 h-4" /> Admin
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="email"
//                       placeholder="you@company.com"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={loginForm.email}
//                       onChange={(e) =>
//                         setLoginForm((prev) => ({
//                           ...prev,
//                           email: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="password"
//                       placeholder="••••••••"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={loginForm.password}
//                       onChange={(e) =>
//                         setLoginForm((prev) => ({
//                           ...prev,
//                           password: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <button
//                     type="button"
//                     onClick={() => setMode("forgot-email")}
//                     className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
//                   disabled={loading}
//                 >
//                   {loading ? "Signing In..." : "Sign In"}
//                 </Button>

//                 <p className="text-center text-gray-600 text-sm">
//                   Don't have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => setMode("signup")}
//                     className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//                   >
//                     Sign up
//                   </button>
//                 </p>
//               </form>
//             )}

//             {/* ====================== SIGNUP FORM ====================== */}
//             {mode === "signup" && (
//               <form onSubmit={handleSignup} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="text"
//                       placeholder="John Doe"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={signupForm.name}
//                       onChange={(e) =>
//                         setSignupForm((prev) => ({
//                           ...prev,
//                           name: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="email"
//                       placeholder="you@company.com"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={signupForm.email}
//                       onChange={(e) =>
//                         setSignupForm((prev) => ({
//                           ...prev,
//                           email: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="text-gray-700">Role</Label>
//                     <Select
//                       value={signupForm.role}
//                       onValueChange={(value) =>
//                         setSignupForm((prev) => ({ ...prev, role: value }))
//                       }
//                     >
//                       <SelectTrigger className="h-12 border-gray-300 focus:ring-indigo-600">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Telecaller">Telecaller</SelectItem>
//                         <SelectItem value="Counsellor">Counsellor</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-gray-700">Department</Label>
//                     <Select
//                       value={signupForm.department}
//                       onValueChange={(value) =>
//                         setSignupForm((prev) => ({
//                           ...prev,
//                           department: value,
//                         }))
//                       }
//                     >
//                       <SelectTrigger className="h-12 border-gray-300 focus:ring-indigo-600">
//                         <SelectValue
//                           placeholder={
//                             loadingDepartments
//                               ? "Loading..."
//                               : "Select department"
//                           }
//                         />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {departments.map((dept) => (
//                           <SelectItem key={dept.id} value={dept.id}>
//                             {dept.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="password"
//                       placeholder="Create password"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={signupForm.password}
//                       onChange={(e) =>
//                         setSignupForm((prev) => ({
//                           ...prev,
//                           password: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Confirm Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="password"
//                       placeholder="Confirm password"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={signupForm.confirmPassword}
//                       onChange={(e) =>
//                         setSignupForm((prev) => ({
//                           ...prev,
//                           confirmPassword: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating Account..." : "Create Account"}
//                 </Button>

//                 <p className="text-center text-gray-600 text-sm">
//                   Already have an account?{" "}
//                   <button
//                     type="button"
//                     onClick={() => setMode("login")}
//                     className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//                   >
//                     Sign in
//                   </button>
//                 </p>
//               </form>
//             )}

//             {/* ====================== FORGOT EMAIL ====================== */}
//             {mode === "forgot-email" && (
//               <form onSubmit={handleForgotEmail} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="email"
//                       placeholder="you@company.com"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={forgotForm.email}
//                       onChange={(e) =>
//                         setForgotForm((prev) => ({
//                           ...prev,
//                           email: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
//                   disabled={loading}
//                 >
//                   {loading ? "Sending Code..." : "Send Reset Code"}
//                 </Button>

//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={() => setMode("login")}
//                     className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     Back to Sign In
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* ====================== OTP VERIFICATION ====================== */}
//             {mode === "forgot-code" && (
//               <form onSubmit={handleCodeVerification} className="space-y-6">
//                 <div className="space-y-3">
//                   <Label className="text-gray-700 block text-center">
//                     Verification Code
//                   </Label>
//                   <div className="flex justify-center">
//                     <InputOTP
//                       value={otpCode}
//                       onChange={setOtpCode}
//                       maxLength={6}
//                     >
//                       <InputOTPGroup>
//                         <InputOTPSlot index={0} />
//                         <InputOTPSlot index={1} />
//                         <InputOTPSlot index={2} />
//                         <InputOTPSlot index={3} />
//                         <InputOTPSlot index={4} />
//                         <InputOTPSlot index={5} />
//                       </InputOTPGroup>
//                     </InputOTP>
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
//                   disabled={otpCode.length !== 6 || loading}
//                 >
//                   {loading ? "Verifying..." : "Verify Code"}
//                 </Button>

//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={() => setMode("forgot-email")}
//                     className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     Back to Email
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* ====================== RESET PASSWORD ====================== */}
//             {mode === "forgot-password" && (
//               <form onSubmit={handlePasswordReset} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label className="text-gray-700">New Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="password"
//                       placeholder="Enter new password"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={forgotForm.newPassword}
//                       onChange={(e) =>
//                         setForgotForm((prev) => ({
//                           ...prev,
//                           newPassword: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-gray-700">Confirm New Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
//                     <Input
//                       type="password"
//                       placeholder="Confirm new password"
//                       className="pl-12 h-12 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
//                       value={forgotForm.confirmPassword}
//                       onChange={(e) =>
//                         setForgotForm((prev) => ({
//                           ...prev,
//                           confirmPassword: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
//                   disabled={loading}
//                 >
//                   {loading ? "Resetting Password..." : "Reset Password"}
//                 </Button>
//               </form>
//             )}
//           </CardContent>
//         </Card>

//         <p className="text-center text-gray-500 text-xs mt-8">
//           © {new Date().getFullYear()} AtlaKnots IT Solutions
//         </p>
//       </div>
//     </div>
//   );
// };


import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Mail, Lock, User, Shield, ArrowLeft, Layers } from "lucide-react";
import logo from "../../assets/download.jpg";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthForm = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [otpCode, setOtpCode] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "Telecaller",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Telecaller",
    avatar: "",
    department: "",
  });

  const [forgotForm, setForgotForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const res = await axios.get(`${API_URL}/api/departments/public-list`);
      const list = (res.data?.data || []).filter(
        (d) => !!d?.name && (d?._id || d?.id)
      );
      const normalized = list.map((d) => ({
        id: d.id || d._id,
        name: d.name,
      }));
      setDepartments(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password, loginForm.role);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: signupForm.name,
        email: signupForm.email,
        role: signupForm.role,
        departmentId: signupForm.department,
        avatar: signupForm.avatar || "",
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
      };
      await signup(payload);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/forget-password`, {
        email: forgotForm.email,
      });
      toast.success(res.data.message);
      setMode("forgot-code");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: forgotForm.email.trim(),
        otp: otpCode.trim(),
      });
      setResetToken(res.data.resetToken);
      toast.success(res.data.message);
      setMode("forgot-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        resetToken,
        newPassword: forgotForm.newPassword,
        confirmNewPassword: forgotForm.confirmPassword,
      });
      toast.success(res.data.message);
      setMode("login");
      setForgotForm({ email: "", newPassword: "", confirmPassword: "" });
      setOtpCode("");
      setResetToken("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isForgotMode = ["forgot-email", "forgot-code", "forgot-password"].includes(mode);

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #eef2ff 0%, #f8faff 60%, #e0e7ff 100%)" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md overflow-hidden"
            style={{ background: "linear-gradient(135deg, #4f46e5, #818cf8)" }}>
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-950 leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Edu-Hawk
            </h1>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
              CRM System
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border border-indigo-100 rounded-3xl bg-white overflow-hidden">

          {/* Tab bar — only for login/signup */}
          {!isForgotMode && (
            <div className="mx-6 mt-6 flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "signup"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          <CardHeader className="pt-5 pb-2 px-6">
            {mode === "login" && (
              <>
                <CardTitle className="text-xl text-indigo-950">Welcome back</CardTitle>
                <CardDescription className="text-gray-500">Sign in to access your dashboard</CardDescription>
              </>
            )}
            {mode === "signup" && (
              <>
                <CardTitle className="text-xl text-indigo-950">Create account</CardTitle>
                <CardDescription className="text-gray-500">Join our team today</CardDescription>
              </>
            )}
            {mode === "forgot-email" && (
              <>
                <CardTitle className="text-xl text-indigo-950">Reset password</CardTitle>
                <CardDescription className="text-gray-500">Enter your email to receive a reset code</CardDescription>
              </>
            )}
            {mode === "forgot-code" && (
              <>
                <CardTitle className="text-xl text-indigo-950">Verify code</CardTitle>
                <CardDescription className="text-gray-500">Enter the 6-digit code sent to your email</CardDescription>
              </>
            )}
            {mode === "forgot-password" && (
              <>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-2">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Identity verified
                </div>
                <CardTitle className="text-xl text-indigo-950">New password</CardTitle>
                <CardDescription className="text-gray-500">Create your new secure password</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-8 space-y-4">

            {/* ====================== LOGIN ====================== */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role selector — pill buttons */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</Label>
                  <div className="flex gap-2">
                    {["Telecaller", "Counsellor", "Admin"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setLoginForm((p) => ({ ...p, role: r }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                          loginForm.role === r
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</Label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot-email")}
                      className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl text-white border-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* ====================== SIGNUP ====================== */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</Label>
                    <Select
                      value={signupForm.role}
                      onValueChange={(v) => setSignupForm((p) => ({ ...p, role: v }))}
                    >
                      <SelectTrigger className="h-11 border-gray-200 bg-gray-50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Telecaller">Telecaller</SelectItem>
                        <SelectItem value="Counsellor">Counsellor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</Label>
                    <Select
                      value={signupForm.department}
                      onValueChange={(v) => setSignupForm((p) => ({ ...p, department: v }))}
                    >
                      <SelectTrigger className="h-11 border-gray-200 bg-gray-50 rounded-xl">
                        <SelectValue placeholder={loadingDepartments ? "Loading..." : "Select"} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Create"
                        className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Confirm"
                        className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl text-white border-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}

            {/* ====================== FORGOT EMAIL ====================== */}
            {mode === "forgot-email" && (
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={forgotForm.email}
                      onChange={(e) => setForgotForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl text-white border-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {loading ? "Sending Code..." : "Send Reset Code"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* ====================== OTP ====================== */}
            {mode === "forgot-code" && (
              <form onSubmit={handleCodeVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block text-center">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP value={otpCode} onChange={setOtpCode} maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={otpCode.length !== 6 || loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl text-white border-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode("forgot-email")}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Email
                  </button>
                </div>
              </form>
            )}

            {/* ====================== RESET PASSWORD ====================== */}
            {mode === "forgot-password" && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={forgotForm.newPassword}
                      onChange={(e) => setForgotForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-9 h-11 border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      value={forgotForm.confirmPassword}
                      onChange={(e) => setForgotForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold rounded-xl text-white border-0"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}

          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} AtlaKnots IT Solutions
        </p>
      </div>
    </div>
  );
};