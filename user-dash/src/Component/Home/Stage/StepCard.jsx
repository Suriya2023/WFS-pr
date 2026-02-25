import React from "react";
import { motion } from "framer-motion";

export default function StepCard({ icon, title, desc, number, tag }) {
  return (
    <motion.div
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      className="group relative bg-white rounded-[2rem] p-10 flex flex-col items-start gap-8 shadow-sm hover:shadow-2xl 
                     transition-all duration-500 border border-slate-100 hover:border-red-100 hover:-translate-y-4"
    >
      {/* Step Counter Overlay */}
      <div className="absolute top-8 right-8 text-7xl font-black text-slate-50 group-hover:text-red-500/5 transition-colors duration-500 select-none">
        {number}
      </div>

      {/* Visual Header */}
      <div className="relative w-24 h-24 p-4 bg-slate-50 rounded-3xl group-hover:bg-red-50 transition-colors duration-500">
        <img
          loading="lazy"
          src={icon}
          alt={title}
          className="w-full h-full object-contain filter drop-shadow-lg"
        />
      </div>

      {/* Content Body */}
      <div className="space-y-4 relative z-10">
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 italic">
          {tag}
        </span>
        <h3 className="font-black text-3xl text-slate-950 uppercase tracking-tighter leading-none group-hover:text-red-700 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 font-medium text-lg leading-relaxed group-hover:text-slate-700 transition-colors">
          {desc}
        </p>
      </div>

      {/* Animated Bottom Bar */}
      <div className="absolute bottom-0 left-10 right-10 h-1.5 bg-slate-100 rounded-t-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-red-600 to-blue-600"
        />
      </div>
    </motion.div>
  );
}
