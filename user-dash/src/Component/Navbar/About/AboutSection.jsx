import React from "react";
import { motion } from "framer-motion";
import globe from "../../../assets/Uploads/About/g2.png";

const AboutSection = () => {
  return (
    <section id="our-mission" className="relative w-full py-24 md:py-40 px-6 md:px-20 overflow-hidden bg-[#fafafa]">

      {/* PREMIUM BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px]" />

        {/* Geometric Tech Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
        </div>

        {/* Large Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-black/[0.01] select-none leading-none uppercase">
          Mission
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">

          {/* LEFT CONTENT (TEXT) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-12"
          >
            {/* Header Group */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="h-[3px] w-16 bg-gradient-to-r from-red-600 to-transparent" />
                <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Global Impact Strategy</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-[0.85] drop-shadow-sm">
                TRANSFORMING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 italic">THE BOUNDARIES</span>
              </h2>
            </div>

            {/* Main Value Proposition with Hover Effect */}
            <div className="relative pl-8 border-l-[6px] border-red-600/10 group">
              <div className="absolute left-[-6px] top-0 bottom-0 w-[6px] bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
              <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Empowering businesses to <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-red-600">Scale Globally</span>
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute bottom-1 left-0 h-4 bg-red-600/5 -z-0"
                  />
                </span>
                <br /> with high-tech logistics.
              </h3>
            </div>

            {/* Content Cards */}
            <div className="grid md:grid-cols-2 gap-8 pt-4">
              {/* Mission Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-6 font-black">M</div>
                <h4 className="text-xl font-black text-[#1A1A1A] uppercase mb-3 tracking-widest">Our Mission</h4>
                <p className="text-gray-500 font-medium text-base leading-relaxed">
                  Founded in 2021, India’s first technology-driven logistics ecosystem
                  enabling SMEs to conquer international markets with ease.
                </p>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] bg-[#1A1A1A] text-white shadow-2xl transition-all"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-500 mb-6 font-black">V</div>
                <h4 className="text-xl font-black text-white uppercase mb-3 tracking-widest">The Vision</h4>
                <p className="text-gray-400 font-medium text-base leading-relaxed">
                  To eliminate the complexity of global trade, making international
                  shipping as simple as domestic delivery for every entrepreneur.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT CONTENT (IMAGE/VISUAL) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative flex justify-center"
          >
            {/* Visual Frame */}
            <div className="relative">
              {/* Pulsing Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-red-600/10 to-yellow-400/10 rounded-full blur-[80px] animate-pulse" />

              {/* Geometric Decorative Elements */}
              <div className="absolute inset-[-40px] border border-gray-100 rounded-[5rem] -rotate-6" />
              <div className="absolute inset-[-20px] border-2 border-dashed border-red-600/20 rounded-[4rem] rotate-3 animate-[spin_20s_linear_infinite]" />

              {/* Main Image Stage */}
              <div className="relative bg-white/40 backdrop-blur-3xl rounded-[4rem] p-10 md:p-14 border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] group">
                {/* Floating Connection Nodes */}
                <div className="absolute top-10 right-10 flex flex-col gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping [animation-delay:1s]" />
                </div>

                <img
                  src={globe}
                  alt="Global Network"
                  className="relative z-10 w-full max-w-[380px] object-contain drop-shadow-2xl brightness-110 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Foundational Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-100 min-w-[160px]"
              >
                <div className="text-3xl font-black text-black">2021</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">BGL Established</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
