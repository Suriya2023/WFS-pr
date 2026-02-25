import React from "react";
import { motion } from "framer-motion";

const ExporterBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/95 backdrop-blur-2xl text-black rounded-[2rem] md:rounded-[2.5rem] px-5 py-5 md:px-7 md:py-7 border border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col items-center min-w-[170px] md:min-w-[210px]"
    >
      {/* Label */}
      <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-full whitespace-nowrap shadow-lg">
        GLOBAL REACH
      </div>

      {/* Profile Stack */}
      <div className="flex -space-x-2 md:-space-x-3 mb-4 md:mb-5 mt-2 md:mt-3">
        {[1, 10, 25].map((id, i) => (
          <div key={i} className="relative group ring-2 md:ring-4 ring-white rounded-full overflow-hidden">
            <img
              src={`https://i.pravatar.cc/100?img=${id}`}
              className="w-8 h-8 md:w-11 md:h-11 object-cover transition-transform duration-500 group-hover:scale-125"
              alt="Exporter"
            />
          </div>
        ))}
        <div className="w-8 h-8 md:w-11 md:h-11 rounded-full ring-2 md:ring-4 ring-white bg-[#D32F2F] flex items-center justify-center text-[8px] md:text-[10px] font-black text-white shadow-xl">
          +25K
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-0.5 md:space-y-1">
        <div className="flex items-center justify-center">
          <span className="text-2xl md:text-4xl font-black text-black tracking-tighter">25,000+</span>
        </div>
        <p className="text-[8px] md:text-[10px] text-black/50 font-black uppercase tracking-[0.1em] md:tracking-[0.15em] leading-tight">
          Active Exporters <br />
          <span className="text-red-600">Trading Globally</span>
        </p>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="flex gap-1 mt-4 md:mt-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-6 md:w-8 bg-red-600' : 'w-1.5 md:w-2 bg-black/10'}`} />
        ))}
      </div>
    </motion.div>
  );
};

export default ExporterBadge;
