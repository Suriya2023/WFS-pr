import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, CheckCircle } from "lucide-react";

const TestimonialCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] p-8 md:p-10 w-full max-w-[600px] border border-slate-100 relative group overflow-hidden"
    >
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-[4rem] group-hover:bg-red-600 transition-colors duration-700 -z-10" />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Avatar Stage */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border-[6px] border-slate-50 shadow-inner rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <img
              loading="lazy"
              decoding="async"
              src={item.avatar}
              alt={item.name}
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-lg shadow-lg">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
            ))}
          </div>

          <h4 className="text-xl md:text-2xl font-[1000] text-slate-950 tracking-tighter uppercase leading-none">
            {item.name}
          </h4>
          <p className="text-[10px] md:text-xs font-black text-red-600 uppercase tracking-[0.2em] mt-2 opacity-80">
            {item.role}
          </p>
        </div>
      </div>

      <div className="mt-8 relative">
        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-950/[0.03] -z-10" />
        <p className="text-slate-800 text-base md:text-lg font-bold leading-relaxed italic">
          “{item.quote}”
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Global Partnership</span>
        </div>
        <div className="px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase tracking-tighter rounded-md">
          Priority Channel
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
