import React, { useState, useEffect } from "react";
import f1 from '../../../assets/Uploads/About/f1.png';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';

export default function FranchiseSection() {
    // Logic from ContactPricing.jsx
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
        setCities([]);
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
                toast.success('Application sent! Our team will contact you shortly.');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 relative">
            <Toaster position="top-right" />
            <div className="w-full bg-white flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

                {/* LEFT SECTION */}
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 md:gap-10">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-red-700 leading-none tracking-tighter uppercase">
                        Launch Your <br /> <span className="text-gray-900">Global Logistics</span> <br /> Business Today
                    </h1>

                    <p className="text-gray-600 font-bold text-lg md:text-xl uppercase tracking-tight max-w-md">
                        Partner with us to access the world's most reliable shipping network. Low investment, high returns, and complete operational support.
                    </p>

                    {/* Image with decorative elements */}
                    <div className="relative w-full max-w-lg mt-4">
                        <div className="absolute -inset-4 bg-yellow-400/20 rounded-[3rem] -z-10 rotate-3"></div>
                        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-yellow-100 bg-white transform -rotate-2 hover:rotate-0 transition-all duration-500">
                            <img src={f1} alt="Franchise" className="w-full h-full object-cover aspect-[4/3]" />
                        </div>
                    </div>
                </div>

                {/* FORM SECTION (From ContactPricing) */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:w-[45%] bg-white shadow-2xl rounded-[2.5rem] p-6 md:p-10 flex flex-col gap-5 border border-yellow-50 relative overflow-hidden"
                >
                    {/* Decorative Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-yellow-400"></div>

                    <div className="mb-2">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Become a Partner</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Fill in your details to get started immediately.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Full Name & Mobile */}
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
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="+91 9724874555"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 text-sm"
                                placeholder="name@company.com"
                            />
                        </div>

                        {/* Location Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1 space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Select Nation</label>
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
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Select Region</label>
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
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Select City</label>
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
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Business Query</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all placeholder:text-gray-400 resize-none text-sm"
                                placeholder="I want to know more about the franchise opportunity..."
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
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Request</span>
                                <span className="text-lg">➤</span>
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs font-black text-gray-400 uppercase tracking-tight">
                        Existing Franchisee? <span className="text-red-600 cursor-pointer hover:underline">Access Portal</span>
                    </p>
                </form>
            </div>
        </div>
    );
}
