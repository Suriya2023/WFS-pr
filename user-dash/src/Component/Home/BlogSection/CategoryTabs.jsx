import React from "react";
import { motion } from "framer-motion";

const CategoryTabs = ({ selected, onSelect }) => {
  const tabs = ["All Insights", "Strategy", "Compliance", "Case Study", "Technology"];

  return (
    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 mb-12 sm:mb-16">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-[10px] sm:text-xs font-black transition-all duration-500 uppercase tracking-[0.2em] overflow-hidden
          ${selected === tab || (selected === "All Blogs" && tab === "All Insights")
              ? "bg-slate-950 text-white shadow-2xl shadow-slate-900/20 scale-105"
              : "bg-white text-slate-400 border border-slate-100 hover:border-red-600 hover:text-red-700"
            }`}
        >
          {selected === tab || (selected === "All Blogs" && tab === "All Insights") && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-red-600 -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
