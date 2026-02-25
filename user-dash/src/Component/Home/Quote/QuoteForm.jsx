import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Globe, Layers, Activity, ChevronRight } from "lucide-react";

// Import Heavy Transport Assets
import PlaneImg from "../../../assets/plane.png";
import CarImg from "../../../assets/car.png";

export default function QuoteForm() {
    return (
        <div className="relative group perspective-2000">
            {/* Animated Glow Backdrops */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />

            <div className="relative bg-slate-950 p-6 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] lg:rounded-[4rem] border border-white/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] overflow-hidden">

                {/* Visual Header with Fleet Sync */}
                <div className="flex items-start justify-between mb-10 lg:mb-16 relative">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-ping" />
                            <h4 className="text-white font-[1000] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px]">Fleet Intelligence v4.0</h4>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-[1000] text-white uppercase tracking-tighter italic">
                            The <span className="text-red-600">BGL</span> Advantage
                        </h2>
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 flex items-center justify-center p-3 md:p-4 shrink-0">
                        <img src={PlaneImg} className="w-full h-full object-contain rotate-[15deg] brightness-125" alt="Air Cargo" />
                    </div>
                </div>

                {/* Efficiency Visualization Dashboard */}
                <div className="space-y-6 md:space-y-10 lg:space-y-12">
                    {/* Air Freight Efficiency */}
                    <div className="space-y-4 md:space-y-6 relative p-5 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden group/card hover:bg-white/10 transition-all">
                        <div className="flex justify-between items-center relative z-10 gap-2">
                            <span className="text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Global Air Speed</span>
                            <span className="text-yellow-400 font-black text-base md:text-xl tracking-tighter shrink-0">0.03s Response</span>
                        </div>

                        <div className="relative h-16 md:h-20 flex items-end">
                            {/* Realistic Plane Asset Moving through the bar */}
                            <motion.img
                                src={PlaneImg}
                                initial={{ x: -50, opacity: 0 }}
                                whileInView={{ x: "200%", opacity: 1 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-4 md:bottom-6 left-0 w-16 md:w-24 h-auto z-20 drop-shadow-2xl brightness-110 pointer-events-none"
                            />
                            <div className="w-full h-2 md:h-3 bg-white/5 rounded-full relative overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "85%" }}
                                    transition={{ duration: 2 }}
                                    className="h-full bg-gradient-to-r from-red-600 to-yellow-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Road Network Pricing */}
                    <div className="space-y-4 md:space-y-6 relative p-5 md:p-8 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 group/card hover:bg-white/10 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3 md:gap-4">
                                <img src={CarImg} className="w-12 md:w-16 h-auto drop-shadow-lg" alt="Road Fleet" />
                                <span className="text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest">Ground Logistics</span>
                            </div>
                            <div className="text-left sm:text-right">
                                <span className="text-green-400 font-[1000] text-2xl md:text-3xl tracking-tighter">Save 42%</span>
                                <p className="text-[7px] md:text-[8px] text-slate-500 font-black uppercase">Vs Market Industry Average</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Transparency Ticker */}
                <div className="mt-8 md:mt-12 flex flex-wrap gap-2 md:gap-3">
                    {["No Surcharge", "Fuel Lock", "Bulk Discount", "Instant API"].map((tag, i) => (
                        <span key={i} className="px-2.5 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Final Interactive Portal */}
                <div className="mt-10 md:mt-14 pt-6 md:pt-10 border-t border-white/10">
                    <Link to="/login">
                        <button className="group relative w-full flex items-center justify-between py-4 md:py-6 lg:py-8 px-5 md:px-10 bg-white text-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] font-[1000] text-sm md:text-lg lg:text-2xl uppercase overflow-hidden shadow-[0_45px_90px_-20px_rgba(0,0,0,0.4)] hover:bg-yellow-400 transition-all active:scale-95">
                            <span className="relative z-10">Get Your Custom Rate</span>
                            <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                            </div>
                        </button>
                    </Link>
                    <p className="mt-6 md:mt-8 text-center text-[7px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                        Syncing 500+ global data points per second
                    </p>
                </div>

                {/* Scanline Effect */}
                <div className="absolute top-0 left-0 w-full h-[5%] bg-white/[0.03] blur-xl animate-scan" />
            </div>

            <style jsx="true">{`
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
                .animate-scan { animation: scan 4s linear infinite; }
            `}</style>
        </div>
    );
}
