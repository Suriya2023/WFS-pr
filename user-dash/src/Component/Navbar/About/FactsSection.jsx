import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FactsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const xLeft = useTransform(scrollYProgress, [0, 0.5], [-50, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <section
      id="our-story"
      ref={containerRef}
      className="relative w-full py-16 md:py-24 bg-[#FDFDFD] overflow-hidden"
    >
      {/* Decorative Background Text - "LOYALTY" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-black/[0.02] select-none pointer-events-none leading-none uppercase">
        Loyalty
      </div>

      <div className="container mx-auto px-4 md:px-10 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT: THE STORY */}
          <motion.div style={{ x: xLeft, opacity: opacity }} className="">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 md:w-12 bg-[#D32F2F]" />
                <span className="text-[#D32F2F] font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">The BGL Legacy</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-[0.9]">
                BUILT ON <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#B71C1C]">UNWAVERING</span> <br />
                TRUST
              </h2>
            </div>

            <div className="relative mt-6 md:mt-8">
              <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-red-600 to-transparent" />
              <p className="text-lg md:text-2xl text-[#2D2D2D] font-bold leading-snug uppercase tracking-tight pl-4 md:pl-6 max-w-lg">
                "Our very first sellers are <span className="text-red-600">still exporting</span> with us today. This isn't just business; it's a decadelong promise of excellence."
              </p>
            </div>

            <div className="pt-6 md:pt-8">
              <motion.div
                whileHover={{ x: 5 }}
                onClick={() => document.getElementById('our-mission').scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-black">Read Our Full Story</span>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: THE BADGE */}
          <motion.div
            style={{ scale, opacity, x: xRight }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Rotating Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[1px] border-dashed border-black/10 rounded-full scale-110 md:scale-125"
            />

            <div className="relative">
              {/* Main Badge Container */}
              <div className="w-56 h-56 md:w-80 md:h-80 rounded-full bg-white shadow-2xl border-4 md:border-8 border-white flex flex-col items-center justify-center relative overflow-hidden group">

                {/* Internal Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative z-10 text-center"
                >
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-red-600 block mb-1 md:mb-2">Authenticated</span>
                  <div className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">
                    100<span className="text-red-600">%</span>
                  </div>
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1 md:mt-2">
                    Client <br /> Retention Rate
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-[10px] md:text-xs">★</span>
                  ))}
                </div>
              </div>

              {/* Floating Supporting Tags */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-black text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg transform rotate-6"
              >
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Since Day One</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-[#D32F2F] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-lg transform -rotate-3"
              >
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Zero Churn Goal</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FactsSection;
