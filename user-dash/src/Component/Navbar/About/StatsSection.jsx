import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Counter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Extract number and suffix (e.g., "220" and "+")
  const number = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Use a simple animation for the number */}
          <motion.span
            animate={{
              transition: { duration: duration, ease: "easeOut" }
            }}
          >
            {value}
          </motion.span>
        </motion.span>
      )}
    </motion.span>
  );
};

const StatCard = ({ number, label, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="relative group p-8 md:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
  >
    {/* Decorative Background Icon */}
    <div className="absolute -right-4 -bottom-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity grayscale">
      {icon}
    </div>

    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-transparent to-red-600/0 group-hover:from-red-600/5 group-hover:to-yellow-500/5 transition-all duration-700" />

    <div className="relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 mx-auto transform group-hover:rotate-6 transition-transform">
        {icon}
      </div>

      <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-500">
        {number}
      </h3>

      <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-[0.2em]">
        {label}
      </p>
    </div>
  </motion.div>
);

const StatsSection = () => {
  return (
    <section id="stats" className="relative w-full py-24 md:py-32 px-6 md:px-20 bg-[#0A0A0B] overflow-hidden">

      {/* Background Orbs to match Hero */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-red-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-yellow-500 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-red-600" />
            <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Precision & Scale</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none"
          >
            OUR GLOBAL FOOTPRINT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 italic">BY THE NUMBERS</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatCard
            number="220+"
            label="Countries Covered"
            icon="🌍"
            delay={0.1}
          />
          <StatCard
            number="15"
            label="Regional Offices"
            icon="🏢"
            delay={0.2}
          />
          <StatCard
            number="25K+"
            label="Happy Customers"
            icon="🤝"
            delay={0.3}
          />
          <StatCard
            number="1 Cr+"
            label="Parcels Shipped"
            icon="📦"
            delay={0.4}
          />
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-20 md:mt-24 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
};

export default StatsSection;
