import React from "react";
import f1 from '../../../assets/Uploads/About/f1.webp'
import { div } from "framer-motion/client";

export default function FranchiseSection() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'">
            <div className="w-full  bg-white flex flex-col lg:flex-row items-center justify-center gap-12 p-6 md:p-16">

                {/* LEFT SECTION */}
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-8">
                    <h1 className="text-4xl md:text-7xl font-black text-red-700 leading-[0.9] tracking-tighter">
                        Start your <br /> international <br /> courier company
                    </h1>

                    {/* Single Image */}
                    <div className="w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl border-4 border-yellow-100 bg-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img src={f1} alt="Franchise" className="w-full h-full object-cover" />
                    </div>
                </div>

                <form className="w-full lg:w-1/2 bg-white shadow-2xl rounded-[2.5rem] p-10 flex flex-col gap-6 border border-yellow-100">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center text-red-700 leading-tight uppercase">
                        Get ShipGlobal Franchisee <br />
                        <span className="text-gray-900">at Zero Cost</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="text" placeholder="First Name" className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                        <input type="text" placeholder="Last Name" className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="email" placeholder="Email Address" className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                        <input type="text" placeholder="Phone Number" className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input type="text" placeholder="Origin City" className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />

                        <select className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-black text-gray-500 uppercase tracking-tighter text-sm">
                            <option>Destination Country</option>
                            <option>India</option>
                            <option>USA</option>
                            <option>UK</option>
                        </select>
                    </div>

                    <select className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-black text-gray-500 uppercase tracking-tighter text-sm">
                        <option>Select Your Business Category</option>
                        <option>E-commerce</option>
                        <option>Retail</option>
                        <option>Other</option>
                    </select>

                    <select className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl outline-none focus:ring-4 focus:ring-red-100 transition-all font-black text-gray-500 uppercase tracking-tighter text-sm">
                        <option>Average Monthly Volume?</option>
                        <option>0 - 50</option>
                        <option>50 - 500</option>
                        <option>500+</option>
                    </select>

                    <div className="space-y-4">
                        <p className="text-gray-500 text-xs font-bold leading-relaxed">
                            Your registration is subject to our <span className="text-red-600 font-bold cursor-pointer hover:underline">Terms & Conditions</span> and
                            <span className="text-red-600 font-bold cursor-pointer hover:underline"> Privacy Policy</span>.
                        </p>

                        <p className="text-red-700 text-sm font-bold">
                            Already have an account? <span className="underline cursor-pointer hover:text-red-900 transition-colors uppercase tracking-tight">Login</span>
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button className="bg-red-600 text-white py-4 rounded-2xl font-black w-full hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 uppercase tracking-widest text-sm">Apply Now</button>
                        <button className="bg-gray-900 text-white py-4 rounded-2xl font-black w-full hover:bg-black transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-sm">Login</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
