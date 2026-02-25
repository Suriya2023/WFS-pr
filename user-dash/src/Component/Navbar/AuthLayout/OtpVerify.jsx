import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/bglLogo.png";

export default function OtpVerify() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const url = "${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp";
            const url = import.meta.env.VITE_API_BASE_URL + "/api/auth/verify-otp.php";

            const { data } = await axios.post(url, { email, otp });
            setMsg(data.message);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Section - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-yellow-400 items-center justify-center p-20 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 text-center">
                    <div className="bg-white/90 p-8 rounded-[2.5rem] shadow-2xl mb-12 inline-block backdrop-blur-sm border-2 border-red-100">
                        <img
                            src={logo}
                            alt="BGL Logo"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <h1 className="text-6xl font-black text-red-700 leading-tight tracking-tighter mb-8 uppercase">
                        Verify <br />
                        <span className="text-gray-900">Your</span> <br />
                        Identity
                    </h1>
                    <p className="text-xl font-bold text-red-800/80 max-w-md mx-auto leading-relaxed uppercase tracking-widest">
                        Secure & Fast Verification for International Shipping
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2 bg-yellow-50/50 flex justify-center items-center p-6 sm:p-12 overflow-y-auto scrollbar-hide">
                <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 sm:p-14 border border-yellow-100">
                    <h2 className="text-center text-3xl font-black text-red-700 mb-4 uppercase tracking-tighter">Enter OTP</h2>
                    <p className="text-center text-gray-400 mb-10 text-sm font-bold uppercase tracking-widest">
                        Code sent to <span className="text-red-600 underline">{email || "your email"}</span>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Confirm Email"
                                className="w-full bg-yellow-50/50 border border-yellow-100 px-5 py-4 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold"
                                required
                            />
                        </div>

                        <div className="mb-10">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">One-Time Password</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="------"
                                className="w-full bg-yellow-50/50 border border-yellow-100 px-5 py-5 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-black text-center tracking-[1em] text-2xl text-red-600"
                                required
                            />
                        </div>

                        {error && <div className="mb-4 text-red-600 text-center text-sm">{error}</div>}
                        {msg && <div className="mb-4 text-green-600 text-center text-sm">{msg}</div>}

                        <button
                            type="submit"
                            className="w-full py-5 rounded-2xl text-xl font-black text-white bg-red-600 shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all duration-300 uppercase tracking-widest transform active:scale-95"
                        >
                            Verify OTP
                        </button>

                        <p onClick={() => navigate("/login")} className="text-center mt-10 text-sm font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-red-600 transition-colors">
                            Back to Login
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
