import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import planeImg from "../../../assets/plane.png";
import { Country, State, City } from 'country-state-city';

export default function ContactPricing() {
    const navigate = useNavigate();

    // For Location Logic
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        country: '',
        state: '',
        city: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const countryData = countries.find(c => c.isoCode === countryCode);

        setSelectedCountry(countryData);
        setStates(State.getStatesOfCountry(countryCode));
        setCities([]); // reset cities
        setSelectedState(null);

        setFormData({
            ...formData,
            country: countryData ? countryData.name : '',
            state: '',
            city: ''
        });
    };

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        const stateData = states.find(s => s.isoCode === stateCode);

        setSelectedState(stateData);
        setCities(City.getCitiesOfState(selectedCountry?.isoCode, stateCode));

        setFormData({
            ...formData,
            state: stateData ? stateData.name : '',
            city: ''
        });
    };

    const handleCityChange = (e) => {
        setFormData({ ...formData, city: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.fullName || !formData.email || !formData.mobile || !formData.country || !formData.state || !formData.city || !formData.message) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await axios.post(`${API_BASE_URL}/api/leads`, formData);

            if (res.data.success) {
                toast.success('Message sent! Our team will contact you shortly.');
                setFormData({
                    fullName: '',
                    email: '',
                    mobile: '',
                    country: '',
                    state: '',
                    city: '',
                    message: ''
                });
                setSelectedCountry(null);
                setSelectedState(null);
            } else {
                toast.error(res.data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative w-full bg-[#f8fafc] overflow-hidden">
            <Toaster position="top-right" />

            {/* Background Plane Decoration - Repositioned to not overlap text on mobile */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 right-0 w-[400px] md:w-[700px] pointer-events-none opacity-20 md:opacity-100 z-0 transform translate-x-1/2 md:translate-x-0 -translate-y-1/4 md:top-10 md:right-0"
            >
                <img src={planeImg} alt="BGL Plane" className="w-full object-contain drop-shadow-2xl grayscale md:grayscale-0" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* LEFT: Contact Info & Branding */}
                    <div className="space-y-8 md:space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4 text-center md:text-left"
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-400 text-red-900 font-bold text-xs uppercase tracking-widest shadow-sm">
                                Global Logistics Experts
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                                Reach Out to <br />
                                <span className="text-red-700">Team BGL.</span>
                            </h1>
                            <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                Get in touch with Bridge Globle Logistics for shipment bookings, service inquiries, documentation assistance, or customer support. Our team is available to assist you with domestic, intercity, and international logistics requirements.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Contact Card 1 */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <span className="text-2xl">📞</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold text-base">Call Us Directly</h3>
                                    <div className="flex flex-col gap-0.5 mt-1">
                                        <a href="tel:+919906599065" className="text-lg font-black text-red-700 tracking-tight hover:underline">+91 9725649555</a>
                                        <a href="tel:+919990614555" className="text-lg font-black text-red-700 tracking-tight hover:underline">+91 9724874555</a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card 2 */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold text-base">Head Office</h3>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed mt-1">
                                        BRIDGE GLOBLE LOGISTICS<br />
                                        H.NO.7/3955A, Room No.3-4, First Floor,<br />
                                        Satimata Sheri, Rughnathpura,<br />
                                        Surat, Gujarat - 395003
                                    </p>
                                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-gray-50 rounded text-[10px] font-bold text-gray-500">
                                        <span>GSTIN:</span> <span className="text-gray-900">24AUVPJ1421D1ZX</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card 3 */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <span className="text-2xl">✉️</span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-gray-900 font-bold text-base">Email Support</h3>
                                    <a href="mailto:2025bgl@gmail.com" className="text-red-700 font-bold text-base underline mt-1 hover:text-red-900 break-all">
                                        bgliexpress@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Business Hours Card */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <span className="text-2xl">🕘</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold text-base">Business Hours</h3>
                                    <p className="text-gray-700 font-bold text-sm mt-1">Monday to Saturday</p>
                                    <p className="text-red-700 font-black text-lg">10:00 AM – 7:00 PM</p>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
                                        Our customer support team is committed to providing timely assistance and reliable guidance for all your logistics and shipping needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Premium Form */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-500/20 transform rotate-1 rounded-[2rem] blur-xl -z-10 md:block hidden"></div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onSubmit={handleSubmit}
                            className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col gap-5 relative overflow-hidden"
                        >
                            {/* Decorative Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-yellow-400"></div>

                            <div className="mb-2">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Send Message</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">We usually respond within 24 hours.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Name & Mobile Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 text-sm"
                                            placeholder="Suraj Rajput"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 text-sm"
                                            placeholder="+91 99906 14555"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 text-sm"
                                        placeholder="rajput_suraj@gmail.com"
                                    />
                                </div>

                                {/* Location Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1 space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country</label>
                                        <select
                                            value={selectedCountry?.isoCode || ''}
                                            onChange={handleCountryChange}
                                            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all appearance-none cursor-pointer text-sm"
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((c) => (
                                                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">State</label>
                                        <select
                                            value={selectedState?.isoCode || ''}
                                            onChange={handleStateChange}
                                            disabled={!selectedCountry}
                                            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all appearance-none cursor-pointer disabled:opacity-50 text-sm"
                                        >
                                            <option value="">State</option>
                                            {states.map((s) => (
                                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">City</label>
                                        <select
                                            value={formData.city}
                                            onChange={handleCityChange}
                                            disabled={!selectedState}
                                            className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all appearance-none cursor-pointer disabled:opacity-50 text-sm"
                                        >
                                            <option value="">City</option>
                                            {cities.map((c) => (
                                                <option key={c.name} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 resize-none text-sm"
                                        placeholder="Type your inquiry..."
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full mt-2 bg-gray-900 text-white p-4 rounded-xl text-sm md:text-base font-black uppercase tracking-widest hover:bg-black hover:scale-[1.02] transform transition-all shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <span className="text-lg">➤</span>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </section>
    );
}
