import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bglLogo from "../../../assets/Uploads/bglLogo.png";

export default function DeliverySection({ data, reverse }) {
  const content = data[0];

  return (
    <section className="relative w-full py-12 lg:py-32 px-4 overflow-hidden bg-white">
      {/* Dynamic Background */}
      <div className={`absolute top-0 ${reverse ? "right-0" : "left-0"} w-3/4 h-full bg-slate-50/40 -z-0 rounded-[50px] lg:rounded-[100px] blur-[80px] lg:blur-[150px]`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full lg:w-[1000px] h-full lg:h-[1000px] bg-red-50/10 rounded-full blur-[100px] lg:blur-[180px] -z-0" />

      <div
        className={`relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-32 ${reverse ? "lg:flex-row-reverse" : ""
          }`}
      >
        {/* VISUAL COMPOSITION */}
        <div className="relative w-full lg:w-1/2 min-h-[350px] lg:min-h-[550px] group">
          {/* Layered Frames */}
          <div className="absolute -inset-4 lg:-inset-6 bg-gradient-to-br from-blue-600/5 to-red-600/5 rounded-[2rem] lg:rounded-[3rem] -z-10 animate-pulse" />

          <div className="relative z-10 h-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[8px] lg:border-[16px] border-white transition-all duration-700 group-hover:-translate-y-2">
            <img
              loading="lazy"
              src={content.img}
              alt={content.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

            {/* Professional BGL Watermark */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none transition-all duration-500 group-hover:bottom-8">
              <div className="relative p-2 lg:p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl opacity-70 group-hover:opacity-100">
                <img
                  src={bglLogo}
                  className="h-6 lg:h-10 w-auto object-contain brightness-110 contrast-125"
                  alt="BGL Watermark"
                />
              </div>
            </div>

            {/* Tag Overlay */}
            <div className="absolute top-4 lg:top-8 left-4 lg:left-8">
              <div className="px-4 lg:px-6 py-1.5 lg:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] lg:text-xs font-black uppercase tracking-[0.3em]">
                Live Logistics Sync
              </div>
            </div>
          </div>

          {/* Floating Premium Badge */}
          <div
            className={`absolute z-30 -bottom-6 lg:-bottom-12 ${reverse ? "-right-4 lg:-right-12" : "-left-4 lg:-left-12"} max-w-[240px] lg:max-w-[320px] p-5 lg:p-8 bg-white rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-100 hidden sm:block`}
          >
            <div className="flex flex-col gap-4 lg:gap-6">
              <img src={bglLogo} alt="BGL Express" className="h-8 lg:h-12 w-auto object-contain self-start" />
              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-black text-slate-900 uppercase text-xs lg:text-sm tracking-tighter">BGL Prime+</h4>
                </div>
                <p className="text-[11px] lg:text-sm text-slate-500 font-bold leading-relaxed">
                  Advanced pathfinding algorithms ensure your cargo takes the fastest possible route globally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT BLOCK */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8 lg:space-y-12">
          <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 lg:gap-4 justify-center lg:justify-start">
              <div className="w-8 lg:w-12 h-[1px] bg-red-600" />
              <span className="text-[11px] lg:text-sm font-black text-red-600 uppercase tracking-[0.3em] lg:tracking-[0.4em]">
                BGL Express Solutions
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] lg:leading-[0.95] tracking-tighter">
              {content.title.split(' ').map((word, i) => (
                <span key={i} className={i === content.title.split(' ').length - 1 ? "text-blue-600" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <p className="text-lg lg:text-2xl text-slate-600/90 leading-snug lg:leading-tight font-bold max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              {content.desc}
            </p>

            {/* Premium Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {[
                { label: content.boldDesc, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-600", bg: "bg-green-50" },
                { label: "Predictive Sync", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-600", bg: "bg-blue-50" }
              ].map((feature, idx) => (
                <div key={idx} className="group/feature p-5 lg:p-6 bg-slate-50 hover:bg-white rounded-2xl lg:rounded-3xl border border-transparent hover:border-slate-100 transition-all duration-300">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-3 lg:mb-4 transition-transform group-hover/feature:scale-110`}>
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={feature.icon} />
                    </svg>
                  </div>
                  <p className="text-base lg:text-lg font-black text-slate-950 leading-tight mb-1 lg:mb-2">{feature.label}</p>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{content.moreDesc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 lg:pt-6 flex justify-center lg:justify-start">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-4 lg:gap-6 py-4 lg:py-6 px-8 lg:px-12 bg-slate-950 text-white rounded-full font-black text-lg lg:text-2xl overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">{content.btn}</span>
                  <div className="relative z-10 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                    <svg className="w-4 h-4 lg:w-6 lg:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
