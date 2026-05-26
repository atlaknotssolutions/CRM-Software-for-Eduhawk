

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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import logo from "../../assets/download.jpg";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [otpCode, setOtpCode] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "Telecaller",
  });

  const [forgotForm, setForgotForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetToken, setResetToken] = useState("");

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

          <CardHeader className="pt-5 pb-2 px-6">
            {mode === "login" && (
              <>
                <CardTitle className="text-xl text-indigo-950">Welcome back</CardTitle>
                <CardDescription className="text-gray-500">Sign in to access your dashboard</CardDescription>
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

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
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

            {/* FORGOT EMAIL */}
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

            {/* OTP VERIFICATION */}
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

            {/* RESET PASSWORD */}
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