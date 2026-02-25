import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ gif, title, description, index, size = "small", bgImg }) => {
  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden group rounded-[2.5rem] p-8 md:p-12 transition-all duration-700 
        ${isLarge ? "lg:col-span-2 lg:row-span-2 bg-[#1A1A1B]" : "bg-white border border-gray-100 hover:shadow-2xl hover:shadow-red-600/10"}
      `}
    >
      {/* Dynamic Backgrounds */}
      {isLarge ? (
        <>
          {bgImg ? (
            <div className="absolute inset-0 z-0">
              <img src={bgImg} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px]" />
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* GIF Icon with sophisticated container */}
        <div className={`
          flex items-center justify-center rounded-3xl mb-8 transition-all duration-500 
          ${isLarge ? "w-20 h-20 bg-white/10 backdrop-blur-md" : "w-20 h-20 bg-gray-50 group-hover:bg-white shadow-inner group-hover:shadow-xl"}
        `}>
          <img
            src={gif}
            alt={title}
            className={`object-contain transition-transform duration-700 group-hover:scale-110 ${isLarge ? "w-10 h-10" : "w-12 h-12"}`}
          />
        </div>

        {/* Content */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className={`h-[2px] w-8 transition-all duration-500 group-hover:w-16 ${isLarge ? "bg-red-600" : "bg-gray-300 group-hover:bg-red-600"}`} />
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none ${isLarge ? "text-white" : "text-[#1A1A1A]"}`}>
              {title}
            </h3>
          </div>

          <p className={`text-base md:text-lg font-medium leading-relaxed max-w-sm ${isLarge ? "text-gray-200" : "text-gray-500"}`}>
            {description}
          </p>
        </div>

        {/* Action Link (Small indicator) */}
        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className={isLarge ? "text-red-500" : "text-gray-900"}>Explore Detail</span>
          <div className={`h-[1px] w-6 ${isLarge ? "bg-red-500" : "bg-gray-900"}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
