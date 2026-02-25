import React, { useState } from "react";
import { motion } from "framer-motion";
import b1 from '../../../assets/Uploads/About/b11.png';
// import b2 from '../../../assets/Uploads/About/b21.webp';
// import b3 from '../../../assets/Uploads/About/b31.webp';
// import b4 from '../../../assets/Uploads/About/b41.webp';

function ExporterReads() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const insights = [
    {
      id: 1,
      category: "Compliance Masterclass",
      readTime: "8 min read",
      title: "Navigating HS Codes: The Definitive Guide to Global Customs",
      description: "Avoid penalties and delays. Learn how to correctly classify your goods for over 150+ countries.",
      image: b1,
      isFeatured: true
    },
    {
      id: 2,
      category: "Market Expansion",
      readTime: "5 min read",
      title: "Cracking the US Market: A Roadmap for Indian D2C Brands",
      description: "From warehousing to last-mile delivery, discover the strategies that top brands use to scale in the USA.",
      // image: b2,
      isFeatured: false
    },
    {
      id: 3,
      category: "Logistics Tech",
      readTime: "4 min read",
      title: "AI in Shipping: Predicting Delays Before They Happen",
      description: "How predictive analytics is reshaping the supply chain and saving exporters millions in lost time.",
      // image: b3,
      isFeatured: false
    },
    {
      id: 4,
      category: "Sustainable Trade",
      readTime: "6 min read",
      title: "Eco-Friendly Packaging: Reducing Carbon Footprint & Costs",
      description: "Why global buyers are shifting towards green packaging and how you can adapt cost-effectively.",
      // image: b4,
      isFeatured: false
    }
  ];

  return (
    <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl -z-0 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block py-1.5 px-4 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-widest mb-4"
            >
              Intelligence Hub
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter"
            >
              Export <span className="text-red-600">Insights</span> & <br /> Strategic Growth
            </motion.h2>
          </div>

          <div className="w-full md:w-auto">
            <div className="relative group min-w-[300px]">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-6 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-bold text-slate-700"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-100 rounded-xl text-slate-500 hover:bg-red-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

          {/* FEATURED CARD (Spans 8 cols on desktop) */}
          <motion.div
            className="lg:col-span-8 group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-slate-900/10 transition-colors"></div>
            <img
              src={insights[0].image}
              alt={insights[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-wider">{insights[0].category}</span>
                <span className="text-slate-300 text-xs font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {insights[0].readTime}
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 group-hover:text-red-400 transition-colors">
                {insights[0].title}
              </h3>
              <p className="text-slate-300 text-lg font-medium max-w-xl line-clamp-2">
                {insights[0].description}
              </p>
            </div>
          </motion.div>

          {/* SECONDARY CARD (Spans 4 cols - Top Right) */}
          <motion.div
            className="lg:col-span-4 flex flex-col h-[500px] gap-6"
          >
            {/* Card 2 */}
            <div className="flex-1 bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-red-100 transition-all group overflow-hidden relative">
              <div className="w-full h-40 rounded-2xl overflow-hidden mb-6">
                <img src={insights[1].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              </div>
              <div>
                <span className="text-red-600 text-[10px] font-black uppercase tracking-wider mb-2 block">{insights[1].category}</span>
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">{insights[1].title}</h3>
                <span className="text-slate-400 text-xs font-bold">{insights[1].readTime}</span>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM ROW (Two cards sharing width) */}
          {insights.slice(2).map((item) => (
            <motion.div
              key={item.id}
              className="lg:col-span-6 bg-white rounded-[2.5rem] p-4 flex items-center gap-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="w-2/3 pr-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                  <span className="text-slate-400 text-[10px] font-bold">{item.readTime}</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

        {/* VIEW ALL BUTTON */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

      </div>
    </section>
  );
}

export default ExporterReads;
