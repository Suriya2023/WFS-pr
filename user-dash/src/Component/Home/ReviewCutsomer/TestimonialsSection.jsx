import React from "react";
import { motion } from "framer-motion";
import VerticalTestimonials from "./VerticalTestimonials";
import { Quote, Globe, MessageSquare, Star } from "lucide-react";

const TestimonialsSection = () => {
    return (
        <section className="relative py-8 md:py-12 lg:py-16 px-6 lg:px-24 bg-white overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 -z-10 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 -z-10 opacity-40" />

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

                {/* Left Column: Narrative & Trust */}
                <div className="lg:col-span-6 space-y-10 md:space-y-14">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-red-600 text-white rounded-xl shadow-xl shadow-red-100"
                        >
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Client Validation</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-slate-950 uppercase tracking-tighter leading-[0.85]"
                        >
                            Voice of <br />
                            <span className="text-red-700 italic">The Network.</span>
                        </motion.h2>
                    </div>

                    <div className="space-y-8 border-l-2 border-slate-950/10 pl-8">
                        <p className="text-xl md:text-3xl text-slate-800 font-bold leading-snug max-w-xl">
                            "More than just logistics, we provide the infrastructure for <span className="underline decoration-red-600/30 decoration-8 underline-offset-4">global success stories</span> to be written daily."
                        </p>

                        <div className="flex flex-wrap gap-10 pt-4">
                            <div className="space-y-1">
                                <h4 className="text-4xl font-[1000] text-slate-950 tracking-tighter">12M+</h4>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Deliveries</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-4xl font-[1000] text-slate-950 tracking-tighter">98.4%</h4>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Satisfaction Index</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <div className="p-4 bg-slate-950 text-white rounded-2xl shadow-2xl">
                            <Globe className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                            Trusted by entrepreneurs across 220+ territories for priority cross-border execution.
                        </p>
                    </div>
                </div>

                {/* Right Column: Interaction & Social Proof */}
                <div className="lg:col-span-6 relative">
                    <div className="absolute -inset-4 bg-slate-950/5 rounded-[3rem] -z-10 rotate-2" />

                    <div className="relative bg-white rounded-[2.5rem] p-4 md:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">Live Testimonials</span>
                            </div>
                            <Quote className="w-8 h-8 text-red-600/20" />
                        </div>

                        <div className="relative h-[480px]">
                            <VerticalTestimonials auto={true} interval={5000} pauseOnHover={true} />
                        </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-30 pointer-events-none" />
                </div>

            </div>

            <style jsx="true">{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default TestimonialsSection;
