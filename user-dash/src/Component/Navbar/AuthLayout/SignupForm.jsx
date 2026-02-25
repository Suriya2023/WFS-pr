import React, { useState } from "react";
import axios from "axios";
import logo from "../../../assets/bglLogo.png";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || countdown > 0) return;

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const url = import.meta.env.VITE_API_BASE_URL + "/api/auth.php?action=register";
            const response = await axios.post(url, data);

            setMsg(response.data.message || "Registration successful!");

            setCountdown(10);
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            setTimeout(() => {
                navigate("/verify-otp", { state: { email: data.email } });
            }, 1500);

        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">

            {/* LEFT SECTION */}
            <div className="hidden lg:flex w-1/2 bg-yellow-400 items-center justify-center p-12 xl:p-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-72 xl:w-96 h-72 xl:h-96 bg-red-600/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 xl:w-80 h-64 xl:h-80 bg-red-600/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 text-center px-6">
                    <div className="bg-white/90 p-6 xl:p-8 rounded-[2rem] shadow-2xl mb-10 inline-block">
                        <img src={logo} alt="BGL Logo" className="h-16 xl:h-20 mx-auto" />
                    </div>

                    <h1 className="text-4xl xl:text-6xl font-black text-red-700 leading-tight tracking-tighter mb-6 uppercase">
                        Delivering <br />
                        <span className="text-gray-900">Beyond</span> <br />
                        Borders
                    </h1>

                    <p className="text-sm xl:text-xl font-bold text-red-800/80 max-w-md mx-auto uppercase tracking-widest">
                        Your Trusted Partner for International Shipping
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2 grid place-items-center bg-[#FFFDF5] px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl px-6 sm:px-8 py-8 sm:py-10 my-6">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <img src={logo} alt="BGL Express" className="h-12" />
                    </div>

                    <h2 className="text-center text-2xl sm:text-3xl font-black text-red-600 uppercase mb-8">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                        {/* Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstname"
                                value={data.firstname}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                                className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                            />
                            <input
                                type="text"
                                name="lastname"
                                value={data.lastname}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                                className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                            />
                        </div>

                        <input
                            type="tel"
                            name="mobile"
                            value={data.mobile}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            required
                            className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                        />

                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                        />

                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            required
                            className="input-ui bg-blue-50 border-yellow-200 text-base sm:text-sm"
                        />

                        {/* Error / Success */}
                        {error && (
                            <div className="text-sm bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        {msg && (
                            <div className="text-sm text-green-600">
                                {msg}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading || countdown > 0}
                            className={`w-full py-3 sm:py-4 rounded-xl text-white font-black tracking-widest uppercase transition-all
                            ${loading || countdown > 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 active:scale-95"
                                }`}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p
                            onClick={() => navigate("/login")}
                            className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 cursor-pointer"
                        >
                            Already have an account?
                            <span className="ml-2 text-red-600 hover:underline">
                                Login
                            </span>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
}
