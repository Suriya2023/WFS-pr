import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StepCard from "./StepCard";

// Using existing brand assets
import step1Gif from "../../../assets/Uploads/step1.gif";
import step2Gif from "../../../assets/Uploads/step2.gif";
import step3Gif from "../../../assets/Uploads/step3.gif";

export default function StepSection() {
    const steps = [
        {
            icon: step1Gif,
            number: "01",
            title: "Smart Onboarding",
            desc: "Sync your store or enter details manually. Our AI engine instantly validates addresses and classifies commodities for hassle-free customs.",
            tag: "Instant Validation"
        },
        {
            icon: step2Gif,
            number: "02",
            title: "Dynamic Rate Discovery",
            desc: "Compare 50+ global carriers in real-time. Choose between ultra-express air freight or cost-optimized economy lanes tailored to your budget.",
            tag: "Best-Price Match"
        },
        {
            icon: step3Gif,
            number: "03",
            title: "Automated Fulfilment",
            desc: "Generate labels, schedule door-step pickups, and monitor every heartbeat of your shipment with 24/7 global GPS tracking.",
            tag: "Live GPS Sync"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <section className="relative py-20 lg:py-32 px-4 lg:px-20 bg-slate-50 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-[0.2em] text-red-600 bg-red-50 rounded-full border border-red-100 uppercase">
                            Simplified Logistics Architecture
                        </span>
                        <h2 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9]">
                            3 Clicks to <span className="text-blue-600 italic">Global</span> <br /> Dominance.
                        </h2>
                    </div>
                    <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-sm leading-relaxed border-l-4 border-red-600 pl-6">
                        We've engineered the complexity out of exports. Your brand belongs in 220+ countries—we just provide the bridge.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Visual Connector Line (Hidden on mobile) */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10 hidden lg:block" />

                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} />
                    ))}
                </div>

                {/* Unified CTA Area */}
                <div className="mt-20 p-8 lg:p-12 bg-slate-900 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 text-center lg:text-left">
                        <h3 className="text-3xl lg:text-4xl font-black text-white mb-2 uppercase tracking-tighter">Ready to Scale?</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Join 50,000+ businesses shipping globally with BGL Express.</p>
                    </div>

                    <Link to="/register">
                        <button className="relative z-10 bg-white text-slate-950 font-black text-2xl px-12 py-6 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center gap-6 shadow-xl active:scale-95 group">
                            IGNITE SHIPMENT
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:text-red-600 transition-colors">
                                <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
