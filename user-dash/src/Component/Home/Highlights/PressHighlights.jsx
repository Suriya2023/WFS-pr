import React from "react";
import { motion } from "framer-motion";
import { MoveRight, TrendingUp, Award, Globe, Zap, ShieldCheck, Newspaper } from "lucide-react";

import b1 from "../../../assets/Uploads/About/b1.webp";
import b2 from "../../../assets/Uploads/About/b2.webp";
import b3 from "../../../assets/Uploads/About/b3.webp";
import b4 from "../../../assets/Uploads/About/b4.webp";
import b5 from "../../../assets/Uploads/About/b5.webp";
import b6 from "../../../assets/Uploads/About/b6.webp";

const highlights = [
    {
        logo: b1,
        source: "Global Logistics Daily",
        category: "Growth",
        icon: <TrendingUp className="w-4 h-4" />,
        text: "BGL Express achieves milestone growth as leading global investors join the logistics revolution.",
    },
    {
        logo: b2,
        source: "FinTech Observer",
        category: "Award",
        icon: <Award className="w-4 h-4" />,
        text: "BGL Express records exceptional 100% year-on-year growth, dominating cross-border e-commerce.",
    },
    {
        logo: b3,
        source: "Tech Insights",
        category: "Innovation",
        icon: <Zap className="w-4 h-4" />,
        text: "Logistics powerhouse BGL Express disrupts the market with AI-driven routing and customs automation.",
    },
    {
        logo: b4,
        source: "Market Leader",
        category: "Expansion",
        icon: <Globe className="w-4 h-4" />,
        text: "BGL Express expands its global network across 220+ international destinations with prime speed.",
    },
    {
        logo: b5,
        source: "Supply Chain News",
        category: "Velocity",
        icon: <MoveRight className="w-4 h-4" />,
        text: "Industry experts name BGL Express as the fastest-growing cross-border logistics platform.",
    },
    {
        logo: b6,
        source: "Enterprise Weekly",
        category: "Trust",
        icon: <ShieldCheck className="w-4 h-4" />,
        text: "BGL Express sets new benchmarks in high-reliability international shipping for enterprise brands.",
    },
];

const PressHighlights = () => {
    // Duplicate for seamless marquee
    const marqueeData = [...highlights, ...highlights, ...highlights];

    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] text-slate-950 font-black text-[15vw] leading-none select-none -translate-x-10 translate-y-20 -z-10">
                HEADLINES
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 text-white w-fit rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <Newspaper className="w-3 h-3 text-red-600" />
                            Press & Media
                        </div>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-slate-950 uppercase tracking-tighter leading-[0.85]">
                            Spotlighting <br />
                            <span className="text-red-700 italic">Our Journey.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 font-bold max-w-2xl leading-snug">
                            Discover our presence across global platforms, where we share insights, celebrate milestones, and shape the future of cross-border logistics innovation.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 border-l-2 border-slate-100 pl-8 pb-2">
                        <div>
                            <div className="text-4xl font-black text-slate-950">250+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Media Features</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-950">12M+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Impression</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Row */}
            <div className="relative mt-10">
                {/* Gradient Fades for Marquee */}
                <div className="absolute inset-y-0 left-0 w-24 lg:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 lg:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden group">
                    <motion.div
                        animate={{ x: [0, -1920] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                        className="flex gap-6 py-6"
                    >
                        {marqueeData.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-[300px] md:w-[400px] bg-white group/card hover:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 flex flex-col justify-between h-[320px] relative overflow-hidden"
                            >
                                {/* Active Accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-[4rem] group-hover/card:bg-red-600 transition-colors duration-700 -z-0" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="h-8 lg:h-10 grayscale group-hover/card:grayscale-0 group-hover/card:brightness-200 transition-all duration-700">
                                            <img
                                                src={item.logo}
                                                alt={item.source}
                                                className="h-full w-auto object-contain"
                                            />
                                        </div>
                                        <div className="p-2 border border-slate-100 rounded-xl group-hover/card:bg-white group-hover/card:text-slate-950 transition-colors">
                                            {item.icon}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-600 group-hover/card:text-white transition-colors">
                                                {item.category}
                                            </span>
                                            <div className="w-8 h-[1px] bg-slate-100 group-hover/card:bg-white/20" />
                                        </div>
                                        <p className="text-slate-800 group-hover/card:text-white font-[800] text-base lg:text-lg leading-snug transition-colors">
                                            "{item.text}"
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 flex items-center justify-between border-t border-slate-50 group-hover/card:border-white/10 pt-4 mt-auto">
                                    <span className="text-[10px] font-black text-slate-400 group-hover/card:text-white/40 uppercase tracking-widest">
                                        {item.source}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover/card:bg-red-600 flex items-center justify-center transition-all">
                                        <MoveRight className="w-4 h-4 text-slate-400 group-hover/card:text-white -rotate-45" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* View More Call to Action */}
            <div className="mt-20 flex justify-center px-4">
                <button className="flex items-center gap-4 px-10 py-5 bg-white border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white rounded-2xl font-black uppercase tracking-tighter text-sm transition-all duration-500 group shadow-xl hover:shadow-2xl">
                    Explore Full Press Room
                    <Newspaper className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </section>
    );
};

export default PressHighlights;
