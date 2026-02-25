import { motion } from "framer-motion";
import { BadgeCheck, Zap, ShieldCheck, TrendingDown } from "lucide-react";

// Import Transport Assets to reinforce brand trust
import VanImg from "../../../assets/van.png";
import BikeImg from "../../../assets/bike.png";

export default function QuoteDescription() {
    const trustPoints = [
        {
            img: BikeImg,
            label: "Local Transparency",
            sub: "Last-mile costs fixed upfront.",
            color: "bg-yellow-400"
        },
        {
            img: VanImg,
            label: "Bulk Honesty",
            sub: "No volume-based surprises.",
            color: "bg-red-600"
        }
    ];

    return (
        <div className="flex flex-col space-y-8 md:space-y-12 py-6 md:py-10 relative">
            {/* Header Content */}
            <div className="space-y-4 md:space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-1.5 md:py-2 bg-slate-950 text-white rounded-xl md:rounded-2xl shadow-2xl">
                    <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">BGL INTEGRITY PROTOCOL</span>
                </div>

                <h3 className="text-4xl md:text-6xl lg:text-8xl font-[1000] text-slate-950 uppercase tracking-tighter leading-[0.85] md:leading-[0.8] drop-shadow-sm">
                    Price <br />
                    <span className="text-red-700 italic">Purity.</span>
                </h3>

                <p className="text-base md:text-xl lg:text-3xl text-slate-700 font-bold leading-tight max-w-xl">
                    We've eliminated "Fine Print" from logistics. What you see is exactly what you pay—down to the last rupee.
                </p>
            </div>

            {/* Visual Trust Cards using Real Assets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                {trustPoints.map((item, idx) => (
                    <div key={idx} className="relative group">
                        {/* The background card */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl group-hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
                            {/* Floating Asset */}
                            <div className="w-full h-24 md:h-32 mb-4 md:mb-6 relative">
                                <img
                                    src={item.img}
                                    className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 drop-shadow-2xl"
                                    alt={item.label}
                                />
                            </div>

                            <h4 className="text-base md:text-lg font-[1000] uppercase tracking-tighter text-slate-950 mb-1">{item.label}</h4>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed px-2">
                                {item.sub}
                            </p>

                            {/* Decorative stripe */}
                            <div className={`absolute bottom-0 left-0 w-full h-1.5 md:h-2 ${item.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quote Mantra */}
            <div className="pt-4 md:pt-6">
                <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-950 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl max-w-md">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                        <Zap className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <p className="font-black text-white text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] leading-relaxed">
                        "Logistics is complex. <span className="text-yellow-400">Pricing shouldn't be.</span> We protect your growth by securing your wallet first."
                    </p>
                </div>
            </div>
        </div>
    );
}
