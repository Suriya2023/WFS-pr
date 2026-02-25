import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../../../assets/bglLogo.png";
import loginsvg from "../../../assets/Uploads/loginsvg.svg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showResetForm, setShowResetForm] = useState(false);
  const [modalToken, setModalToken] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalConfirmPassword, setModalConfirmPassword] = useState("");
  const [modalShowPassword, setModalShowPassword] = useState(false);
  const [modalShowConfirm, setModalShowConfirm] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState("");

  const [otpTimer, setOtpTimer] = useState(300);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitTimer, setSubmitTimer] = useState(0);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  /* ------------------ LOGIN ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLoading) return;

    setSubmitLoading(true);
    setSubmitTimer(5);

    try {
      // Pointing to PHP Backend
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/auth.php?action=login`;
      const { data: res } = await axios.post(url, data);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.user.role); // Store role for RBAC
        localStorage.setItem("user", JSON.stringify(res.user));

        // Redirect to home (FinalDashConntrole will handle views)
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.status >= 400 && error.response?.status <= 500) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Something went wrong. Please try again later.");
      }
      setSubmitLoading(false);
      setSubmitTimer(0);
    }
  };

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let interval;
    if (submitLoading && submitTimer > 0) {
      interval = setInterval(() => setSubmitTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [submitLoading, submitTimer]);

  /* ======================= UI ======================= */

  return (
    <div className="w-full min-h-[100dvh] flex flex-col lg:flex-row">

      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex w-1/2 bg-yellow-400 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="text-center z-10">
          <div className="bg-white/90 p-8 rounded-[2.5rem] shadow-2xl mb-12">
            <img src={logo} alt="BGL Logo" className="h-20 mx-auto" />
          </div>

          <h1 className="text-5xl font-black text-red-700 uppercase leading-tight">
            Delivering <br />
            <span className="text-gray-900">Beyond</span> <br />
            Borders
          </h1>

          <p className="mt-6 text-lg font-bold uppercase tracking-widest text-red-800/80 max-w-md mx-auto">
            Your Trusted Partner for International Shipping
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-yellow-50/50 px-4 sm:px-6 md:px-8 min-h-[100dvh] lg:min-h-0">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl px-6 sm:px-8 py-8 sm:py-10 my-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img src={logo} className="h-12" alt="logo" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-center text-red-700 uppercase mb-8">
            Login
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full mb-5 px-4 py-3 rounded-xl border bg-yellow-50/50 focus:ring-4 focus:ring-red-100 font-bold"
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border bg-yellow-50/50 focus:ring-4 focus:ring-red-100 font-bold"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <p
            onClick={() => setShowForgotModal(true)}
            className="text-right text-xs font-bold text-red-700 uppercase cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={submitLoading}
            className={`w-full mt-8 py-4 rounded-xl font-black uppercase tracking-widest transition
              ${submitLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 active:scale-95"
              }`}
          >
            {submitLoading ? "Please wait..." : "Login Now"}
          </button>

          <p
            onClick={() => navigate("/register")}
            className="text-center mt-6 text-sm font-bold text-gray-500 cursor-pointer"
          >
            New User?{" "}
            <span className="text-red-700 hover:underline uppercase">
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
