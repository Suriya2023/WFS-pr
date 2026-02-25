import { div } from "framer-motion/client";
import React from "react";

export default function ContactPricing() {
    return (
        <>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 lg:p-16">
                    {/* Left Section */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-8">
                        <h1 className="text-4xl lg:text-7xl font-black text-red-700 leading-tight tracking-tighter">
                            We’re here to <span className="text-gray-900">help!</span>
                        </h1>

                        <p className="text-gray-600 text-xl font-bold leading-relaxed">
                            Got a question, need support, or want to explore how we can grow together?
                            Just drop us a message using the form below, and our team will get back
                            to you shortly.
                        </p>

                        {/* Contact Details */}
                        <div className="flex flex-col gap-6 mt-4">
                            <h2 className="text-2xl font-black text-red-700 uppercase tracking-widest">Get In Touch</h2>

                            <div className="flex flex-col gap-2">
                                <p className="text-gray-900 text-3xl font-black tracking-tighter">+91 99065 99065</p>
                                <p className="text-gray-500 text-xs font-black uppercase tracking-wider">10 am – 6:30 pm (Monday – Saturday)</p>
                            </div>

                            <div className="mt-4">
                                <h2 className="text-lg font-black text-red-700 uppercase tracking-widest mb-3">Head Office</h2>
                                <p className="text-gray-600 font-bold leading-relaxed">A-60, opp. Aerocity, Block B, Mahipalpur,<br />New Delhi 110037, India</p>
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                <p className="text-red-600 font-black text-lg underline cursor-pointer hover:text-red-800 transition-colors">cs@shipglobal.in</p>
                                <p className="text-red-600 font-black text-lg underline cursor-pointer hover:text-red-800 transition-colors">marketing@shipglobal.in</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <form className="w-full lg:w-1/2 bg-white shadow-2xl rounded-[2rem] p-10 flex flex-col gap-6 border border-yellow-100">
                        <h2 className="text-3xl lg:text-4xl font-black text-red-700 mb-2 tracking-tighter">
                            Explore <span className="text-gray-900 font-black">Pricing</span>
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

                        <div className="space-y-3">
                            <p className="text-gray-500 text-xs font-bold leading-relaxed">
                                Your registration is subject to our <span className="text-red-600 font-bold cursor-pointer hover:underline">Terms & Conditions</span> and
                                <span className="text-red-600 font-bold cursor-pointer hover:underline"> Privacy Policy</span>.
                            </p>

                            <p className="text-red-700 text-sm font-bold">
                                Already have an account? <span className="underline cursor-pointer hover:text-red-900 transition-colors" onClick={() => navigate('/login')}>Login Here</span>
                            </p>
                        </div>

                        <button className="w-full bg-red-600 text-white p-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/30 transform active:scale-95">
                            Start Shipping Now
                        </button>
                    </form>
                </div>
            </div>
        </>

    );
}
