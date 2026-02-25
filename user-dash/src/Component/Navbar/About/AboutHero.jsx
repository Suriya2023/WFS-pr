import React from "react";
import { motion } from "framer-motion";
import ExporterBadge from "./ExporterBadge.jsx";
import deliveryBoy from "../../../assets/Uploads/About/a1.png";

const AboutHero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFD700] via-[#FFC107] to-[#FFA000] py-16 md:py-24 px-4 md:px-20  md:mt-0">

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Large Decorative Text for depth - Responsive Size */}
        <div className="absolute top-[15%] left-[-5%] text-[30vw] md:text-[20vw] font-black text-black/5 select-none leading-none -rotate-12">
          LOGISTICS
        </div>

        {/* Animated Glow Orbs with Brand Colors */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-600/10 rounded-full blur-[80px] md:blur-[140px]"
        />

        {/* Technic Grid Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6 md:space-y-10 text-center lg:text-left pt-12 lg:pt-0"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 rounded-full bg-black/5 border border-black/10 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="text-black/80 text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase">Evolving Logistics Ecosystem</span>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter uppercase drop-shadow-sm">
              DRIVING
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] via-[#B71C1C] to-[#EF5350] drop-shadow-md">
                EXCELLENCE
              </span>
            </h1>
          </div>

          <p className="text-[#2D2D2D] text-base md:text-2xl font-medium leading-tight max-w-xl border-l-4 border-red-600 pl-4 md:pl-6 py-2 mx-auto lg:mx-0 text-left">
            Harnessing the power of AI to redefine how
            the world moves. We don't just ship; <span className="text-red-700 font-bold">we deliver peace of mind.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('our-mission').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 md:px-10 py-4 md:py-5 bg-[#D32F2F] text-white rounded-2xl font-black text-lg md:text-xl shadow-2xl shadow-red-900/20 hover:bg-red-700 transition-all flex items-center justify-center gap-3 md:gap-4 group uppercase tracking-widest"
            >
              Explore Mission
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 md:px-10 py-4 md:py-5 bg-white/20 backdrop-blur-sm border-2 border-black/10 text-black font-black text-lg md:text-xl rounded-2xl transition-all uppercase tracking-widest"
            >
              Our Story
            </motion.button>
          </div>

          {/* Stats Bar - Responsive Alignment */}
          <div className="flex justify-center lg:justify-start gap-8 md:gap-12 pt-8 md:pt-10 border-t border-black/10">
            <div>
              <div className="text-3xl md:text-4xl font-black text-black">99.9<span className="text-red-600">%</span></div>
              <div className="text-[10px] md:text-xs font-bold text-black/50 uppercase tracking-widest mt-1">Reliability Rate</div>
            </div>
            <div className="w-[1px] bg-black/10" />
            <div>
              <div className="text-3xl md:text-4xl font-black text-black">24<span className="text-red-600">/</span>7</div>
              <div className="text-[10px] md:text-xs font-bold text-black/50 uppercase tracking-widest mt-1">Expert Support</div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT VISUAL STAGE - Better Mobile Spacing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative flex justify-center items-center mt-10 lg:mt-0"
        >
          <div className="relative group w-full max-w-[320px] md:max-w-lg">
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-6 md:-inset-10 bg-white/20 blur-2xl md:blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />

            <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-white/40 backdrop-blur-md shadow-2xl">
              <img
                src={deliveryBoy}
                alt="BGL Express Team"
                className="w-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 mix-blend-multiply opacity-50" />
            </div>

            {/* Premium Badges - Adjusted for Mobile Visibility */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 md:-top-12 md:-right-12 z-20 scale-[0.7] md:scale-100 origin-bottom-right"
            >
              <ExporterBadge />
            </motion.div>

            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-16 bg-white/90 backdrop-blur-2xl border border-white/50 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl z-20 scale-[0.8] md:scale-100 origin-top-left"
            >
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-yellow-500 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-lg ring-3 md:ring-4 ring-yellow-400/20">⚡</div>
                <div>
                  <div className="text-black font-black text-sm md:text-lg">FASTEST ROUTE</div>
                  <div className="text-black/60 text-[8px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase mt-1">AI Path Allocation Active</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* MINIMAL SCROLL INDICATOR */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        onClick={() => document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' })}
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
      >
        <div className="w-0.5 md:w-1 h-8 md:h-12 bg-gradient-to-b from-black/0 via-black/40 to-black/0 rounded-full" />
        <span className="text-black/30 text-[8px] md:text-[10px] uppercase font-bold tracking-[0.3em]">Scroll</span>
      </motion.div>
    </section>
  );
};

export default AboutHero;
