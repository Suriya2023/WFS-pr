import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import VideoCard from "./VideoCard";
import PromoContent from "./PromoContent";
import { Star, ShieldCheck, Zap, Globe, ArrowUpRight, Play, Users } from "lucide-react";

const ExportSuccess = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 lg:px-20 overflow-hidden bg-[#facc15]"
    >
      {/* Background: Digital Technical Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Abstract Aura Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/30 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] translate-y-1/2" />

      <motion.div
        style={{ opacity, scale }}
        className="max-w-[1400px] mx-auto relative z-10"
      >
        {/* Top Header Section */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            Empowering 25,000+ Global Sellers
          </motion.div>

          <PromoContent centered={true} />
        </div>

        {/* Main Content: Bento Layout */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">

          {/* Central Featured Video Stage */}
          <div className="lg:col-span-8 relative">
            <div className="relative group">
              {/* Dynamic Frame Decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-slate-950 rounded-[2rem] md:rounded-[3rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700" />

              <div className="relative z-10 bg-slate-950 rounded-[2rem] md:rounded-[3.5rem] p-2 md:p-5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.4)] border border-white/10">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/10 rounded-full hidden md:block" />
                <div className="overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] aspect-video">
                  <VideoCard videoId="Zdwv34nZucE" />
                </div>

                {/* Internal Video Overlay UI */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none transition-opacity duration-300">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">1.2k Watching</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />)}
                  </div>
                </div>
              </div>

              {/* Tucked Floating Stats Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 z-20 bg-white p-5 md:p-8 rounded-[2rem] shadow-2xl border border-slate-100 hidden md:block"
              >
                <div className="flex flex-col items-center">
                  <h4 className="text-4xl md:text-5xl font-[1000] text-slate-950 tracking-tighter leading-none">99.8%</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Delivery Precision</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Data & Trust Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 justify-center">

            {/* Impact Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/50 shadow-xl group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-red-600 transition-colors" />
              </div>
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Multiplier</h5>
              <p className="text-4xl md:text-6xl font-[1000] text-slate-950 tracking-tighter leading-none italic">4.8X</p>
              <p className="text-[11px] font-bold text-slate-600 mt-4 leading-relaxed">Average growth acceleration for cross-border merchants.</p>
            </motion.div>

            {/* Trust Certification */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-950 p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-white/5 text-white"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-slate-950">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Verified Ecosystem</p>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">BGL Enterprise Node</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-2xl font-[1000] tracking-tighter text-yellow-400">220+</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Regions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-[1000] tracking-tighter text-yellow-400">60ms</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Tracking Latency</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Quick Action */}
            <div className="flex items-center gap-4 px-6 py-4 bg-red-600 rounded-3xl shadow-lg shadow-red-200 cursor-pointer hover:bg-red-700 transition-all group">
              <Zap className="w-5 h-5 text-white animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Instant API Integration</span>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ExportSuccess;
