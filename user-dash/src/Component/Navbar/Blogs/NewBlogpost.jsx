import React, { useState } from "react";
import { motion } from "framer-motion";
// import b5 from '../../../assets/Uploads/About/b5.webp';
// import b6 from '../../../assets/Uploads/About/b6.webp';
// import b7 from '../../../assets/Uploads/About/b7.webp';
// import b8 from '../../../assets/Uploads/About/b8.webp';

function NewBlogpost() {
  const [activeCard, setActiveCard] = useState(null);

  const posts = [
    {
      id: 1,
      tag: "E-Commerce",
      read: "6 min",
      title: "WooCommerce vs. Shopify: The Ultimate Dropshipping Showdown",
      desc: "Detailed comparison of fees, ease of use, and scalability for Indian exporters targeting global markets.",
      // image: b5,
    },
    {
      id: 2,
      tag: "Niche Export",
      read: "4 min",
      title: "Exporting Ayurveda to Portugal: Compliance & Opportunities",
      desc: "A step-by-step guide to regulatory hurdles and tapping into the growing European wellness market.",
      // image: b6,
    },
    {
      id: 3,
      tag: "Sales Strategy",
      read: "5 min",
      title: "Crushing Black Friday: Bundle Strategies for Higher AOV",
      desc: "How to package your products to increase Average Order Value during the busiest shopping season.",
      // image: b7,
    },
    {
      id: 4,
      tag: "Operations",
      read: "7 min",
      title: "5 Peak Season Export Mistakes (And How to Dodge Them)",
      desc: "From inventory mishaps to shipping delays—learn from the common pitfalls of last year's rush.",
      // image: b8,
    }
  ];

  return (
    <section className="relative w-full bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-3xl">
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#f4a700] font-black uppercase tracking-[0.2em] mb-4 text-sm"
            >
              Fresh from the Press
            </motion.h4>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-red-700 leading-[1.1] tracking-tighter"
            >
              New Arrivals in <br className="hidden md:block" /> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a4ca3] to-[#f4a700]">Export Feed</span>
            </motion.h1>
          </div>
          <div className="hidden md:block pb-2">
            <button className="text-sm font-bold text-slate-400 hover:text-[#1a4ca3] transition-colors flex items-center gap-2 group">
              View Archive
              <span className="w-8 h-[1px] bg-slate-200 group-hover:bg-[#1a4ca3] transition-colors"></span>
            </button>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveCard(post.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Image Container */}
              <div className="relative h-[320px] rounded-[2rem] overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-slate-100 bg-slate-50">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a4ca3]/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>

                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-[#1a4ca3]">
                    {post.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-2">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-[#f4a700] uppercase tracking-wider">New</span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {post.read}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-[#1a4ca3] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 group-hover:text-slate-600">
                  {post.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#1a4ca3] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read Article <span className="text-lg">→</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default NewBlogpost
