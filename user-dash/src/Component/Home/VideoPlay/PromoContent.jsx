import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const PromoContent = ({ centered = false }) => {
  return (
    <div className={`text-slate-950 space-y-3 md:space-y-4 ${centered ? "flex flex-col items-center text-center" : ""}`}>
      <div className={`space-y-1 md:space-y-2 ${centered ? "flex flex-col items-center" : ""}`}>
        <motion.div
          initial={{ opacity: 0, x: centered ? 0 : -20, y: centered ? 20 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          className="flex items-center gap-2 text-red-600 font-[1000] text-[8px] md:text-[11px] uppercase tracking-[0.4em]"
        >
          <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
          The Success Theatre
        </motion.div>

        <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-9xl font-[1000] uppercase tracking-tighter leading-[0.75] md:leading-[0.75] italic">
          Real Sellers. <br />
          <span className="text-red-700 drop-shadow-[0_10px_30px_rgba(220,38,38,0.2)]">Real Wins.</span>
        </h2>
      </div>

      <div className={`space-y-2 md:space-y-3 max-w-3xl ${centered ? "flex flex-col items-center" : ""}`}>
        <p className="text-sm sm:text-base md:text-xl xl:text-4xl text-slate-800 font-[1000] leading-tight tracking-tighter uppercase">
          Global growth isn’t luck—it’s <span className="text-slate-950 italic underline decoration-red-600/30 decoration-8 underline-offset-4 md:underline-offset-8">logistics that work.</span>
        </p>
        <p className="text-slate-600 text-[9px] md:text-sm font-black uppercase tracking-[0.2em] max-w-lg leading-relaxed opacity-70">
          Scale your reach across 220+ territories with zero operational friction.
        </p>
      </div>

      <Link to="/register" className="inline-block pt-1 md:pt-4">
        <button className="group relative bg-slate-950 text-white px-8 py-5 md:px-16 md:py-8 text-xs md:text-3xl font-[1000] rounded-2xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 uppercase tracking-tighter hover:bg-red-700 hover:-translate-y-2 active:scale-95 flex items-center gap-4 md:gap-10 overflow-hidden">
          <span className="relative z-10">Sign-Up For Free</span>
          <div className="relative z-10 w-8 h-8 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </Link>
    </div>
  );
};

export default PromoContent;
