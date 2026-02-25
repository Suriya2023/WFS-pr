import React, { useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import CategoryTabs from "./CategoryTabs";

// Images
import Blog1 from "../../../assets/Uploads/blog1.webp";
import Blog2 from '../../../assets/Uploads/blog2.webp';
import Blog3 from '../../../assets/Uploads/blog3.webp';
import Blog4 from '../../../assets/Uploads/blog4.webp';
import Blog5 from '../../../assets/Uploads/blog5.webp';
import Blog6 from '../../../assets/Uploads/blog6.webp';

const BlogSection = () => {
  const [selectedTab, setSelectedTab] = useState("All Insights");

  const blogs = [
    {
      title: "The 4-Day Transit Rule: How We Revolutionized EU Logistics",
      image: Blog1,
      category: "Strategy",
      date: "Jan 12, 2026",
      readTime: "6 Min Read"
    },
    {
      title: "Beyond HS Codes: Navigating Post-2025 Custom Compliance",
      category: "Compliance",
      image: Blog2,
      date: "Jan 08, 2026",
      readTime: "8 Min Read"
    },
    {
      title: "D2C Scaling: From Local Workshop to Global Storefront",
      category: "Case Study",
      image: Blog3,
      date: "Jan 05, 2026",
      readTime: "10 Min Read"
    },
    {
      title: "The Invisible Network: Ensuring 100% Tracking Integrity",
      category: "Technology",
      image: Blog4,
      date: "Dec 28, 2025",
      readTime: "5 Min Read"
    },
    {
      title: "Eco-Packaging: The New Standard in Luxury Cross-Border Shipping",
      category: "Strategy",
      image: Blog5,
      date: "Dec 20, 2025",
      readTime: "7 Min Read"
    },
    {
      title: "Smart Warehousing: Pre-positioning Inventory for Rapid fulfillment",
      category: "Technology",
      image: Blog6,
      date: "Dec 15, 2025",
      readTime: "9 Min Read"
    },
  ];

  const filteredBlogs =
    selectedTab === "All Insights"
      ? blogs
      : blogs.filter((item) => item.category === selectedTab);

  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-0 right-0 font-[1000] text-[18vw] leading-none text-slate-950/[0.02] uppercase tracking-tighter select-none pointer-events-none translate-x-20">
        INSIGHTS
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 relative z-10">
        {/* Header Composition */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 sm:mb-24">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white w-fit rounded-lg text-[10px] font-black uppercase tracking-widest skew-x-[-10deg]">
              <Newspaper className="w-3 h-3" />
              Knowledge Center
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-slate-950 uppercase tracking-tighter leading-[0.85]">
              From FAQs <br />
              To <span className="text-red-700 italic">Hacks.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 font-bold leading-snug">
              Expert perspectives on global trade, logistics technology, and cross-border <br className="hidden lg:block" />
              scaling strategies designed for the modern entrepreneur.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right">
            <div className="text-sm font-black text-slate-950 uppercase tracking-widest mb-2">Weekly Updates</div>
            <div className="flex items-center gap-2 text-red-600 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Feed Integration</span>
            </div>
          </div>
        </div>

        {/* Categories Interaction */}
        <CategoryTabs
          selected={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
        />

        {/* Dynamic Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {filteredBlogs.map((blog, idx) => (
            <BlogCard key={idx} {...blog} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
          <button className="group relative flex items-center gap-10 py-6 px-12 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-tighter overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-red-700 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
            <span className="relative z-10 text-xl lg:text-2xl">Browse Full Archives</span>
            <div className="relative z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white text-slate-950 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-500 shadow-xl">
              <ArrowRight className="w-6 h-6" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
