import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, Clock } from "lucide-react";

const BlogCard = ({ image, title, category, date, readTime }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.15)] transition-all duration-700"
    >
      {/* Image Stage */}
      <div className="relative h-64 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-red-600 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl border border-white/20">
            {category}
          </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="p-8 lg:p-10 space-y-6">
        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-red-600" />
            {date || "Jan 15, 2026"}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-red-600" />
            {readTime || "5 Min Read"}
          </div>
        </div>

        <h3 className="text-xl lg:text-2xl font-[1000] text-slate-950 leading-tight uppercase tracking-tighter group-hover:text-red-700 transition-colors duration-500">
          {title}
        </h3>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <Link
            to="/blogs"
            className="text-[11px] font-black text-slate-950 uppercase tracking-widest flex items-center gap-2 group/btn"
          >
            Read Article
            <div className="w-8 h-8 rounded-full bg-slate-50 group-hover/btn:bg-slate-950 group-hover/btn:text-white flex items-center justify-center transition-all duration-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
