import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import b9 from '../../../assets/Uploads/About/b9.webp'
// import b10 from '../../../assets/Uploads/About/b10.webp'
// import b11 from '../../../assets/Uploads/About/b11.png'
// import b12 from '../../../assets/Uploads/About/b12.webp'
// import b13 from '../../../assets/Uploads/About/b13.webp'
// import b14 from '../../../assets/Uploads/About/b14.webp'

// Brand New Strategic Content
const libraryData = [
    {
        id: 11,
        title: "The 2026 E-Export Roadmap: Beyond Traditional Borders",
        category: "Strategy",
        summary: "A comprehensive look at emerging markets in Latin America and Southeast Asia. Why your next big customer might be in Vietnam.",
        date: "Jan 12, 2026",
        // image: b9,
        readTime: "8 min read"
    },
    {
        id: 12,
        title: "Automated Compliance: Using AI to Clear Customs",
        category: "Technology",
        summary: "How predictive AI models are reducing clearance times by 40% for Indian exporters in the EU and US corridors.",
        date: "Jan 10, 2026",
        // image: b10,
        readTime: "6 min read"
    },
    {
        id: 13,
        title: "Eco-Packaging Mandates in Europe: A Compliance Guide",
        category: "Regulatory",
        summary: "Germany and France have new packaging laws. Here is a checklist to ensure your shipments don't get rejected at the port.",
        date: "Jan 08, 2026",
        // image: b11,
        readTime: "10 min read"
    },
    {
        id: 14,
        title: "Cold Chain Logistics: Shipping Perishables Globally",
        category: "Technology",
        summary: "IoT sensors and real-time temperature monitoring are changing the game for food and pharma exporters.",
        date: "Jan 05, 2026",
        // image: b12,
        readTime: "5 min read"
    },
    {
        id: 15,
        title: "Currency Fluctuation & Hedging for Exporters",
        category: "Strategy",
        summary: "Protect your margins when the Dollar fluctuates. Simple financial tools every SME exporter should know about.",
        date: "Jan 02, 2026",
        // image: b13,
        readTime: "7 min read"
    },
    {
        id: 16,
        title: "D2C Brands vs Marketplaces: Focus in 2026?",
        category: "Strategy",
        summary: "Should you build your own Shopify store or double down on Amazon Global Selling? We analyze the data.",
        date: "Dec 28, 2025",
        // image: b14,
        readTime: "12 min read"
    }
];

export default function ExportCatalogue() {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Strategy", "Technology", "Regulatory"];

    const filteredData = activeTab === "All"
        ? libraryData
        : libraryData.filter(item => item.category === activeTab);

    return (
        <section className="bg-white py-24 border-t border-slate-100">
            <div className="max-w-6xl mx-auto px-6">

                {/* Header & Filter Row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-200 pb-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <span className="w-8 h-[2px] bg-[#f4a700]"></span>
                            <span className="text-[#f4a700] font-black uppercase tracking-widest text-xs">The Archives</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-black text-slate-900 tracking-tight"
                        >
                            Knowledge <span className="text-[#1a4ca3]">Repository</span>
                        </motion.h2>
                        <p className="text-slate-500 font-medium mt-2">Deep dives into the mechanics of global trade and logistics.</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap 
                        ${activeTab === tab ? "text-[#1a4ca3]" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#f4a700]"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Vertical List Layout */}
                <div className="flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredData.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="group flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-slate-50 p-6 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 border border-transparent hover:border-slate-100 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden shrink-0 relative">
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale-[20%] group-hover:grayscale-0" />
                                    <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                                        {item.readTime}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 py-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className={`${item.category === 'Technology' ? 'text-blue-600' : item.category === 'Strategy' ? 'text-purple-600' : 'text-green-600'} text-xs font-black uppercase tracking-widest`}>
                                            {item.category}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-slate-400 text-xs font-bold uppercase">{item.date}</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-[#1a4ca3] transition-colors leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-6 max-w-2xl">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-[#f4a700] transition-colors">
                                        Read Full Analysis
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Load More/Footer */}
                <div className="mt-16 text-center">
                    <button className="px-10 py-4 bg-white border-2 border-slate-100 rounded-full font-bold text-slate-400 hover:border-[#1a4ca3] hover:text-[#1a4ca3] hover:bg-blue-50/50 transition-all uppercase text-xs tracking-widest">
                        Browse Full Archive
                    </button>
                </div>

            </div>
        </section>
    )
}
