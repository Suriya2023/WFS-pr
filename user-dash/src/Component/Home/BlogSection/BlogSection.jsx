import React, { useState } from "react";
import BlogCard from "./BlogCard";
import CategoryTabs from "./CategoryTabs";
import Blog1 from "../../../assets/Uploads/blog1.webp";
import Blog2 from '../../../assets/Uploads/blog2.webp';
import Blog3 from '../../../assets/Uploads/blog3.webp';
import Blog4 from '../../../assets/Uploads/blog4.webp';
import Blog5 from '../../../assets/Uploads/blog5.webp';
import Blog6 from '../../../assets/Uploads/blog6.webp';



const BlogSection = () => {
  const [selectedTab, setSelectedTab] = useState("All Blogs");

  const blogs = [
    {
      title: "Best International Courier Service from Faridabad to Germany",
      image: Blog1,
      category: "Shopify"
    },
    {
      title: "Top International Courier Service from Faridabad to Europe",
      category: "Service",
      image: Blog2,

    },
    {
      title: "Best International Courier Service from Chennai to Germany",
      category: "Service",
      image: Blog3,

    },
    {
      title: "Best International Courier Service from Faridabad to USA",
      category: "Shopify",
      image: Blog4,
    },
    {
      title: "Top International Courier Service from Gurugram to Europe",
      category: "Service",
      image: Blog5,
    },
    {
      title: "Best International Courier Service from Gurugram to UK",
      category: "Service",
      image: Blog6,
    },
  ];

  const filteredBlogs =
    selectedTab === "All Blogs"
      ? blogs
      : blogs.filter((item) => item.category === selectedTab);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
          From FAQs to Hacks—<span className="text-red-700">Dive in</span>
        </h2>
        <div className="w-24 h-2 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Tabs */}
      <CategoryTabs
        selected={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
      />

      {/* Blog Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, idx) => (
          <BlogCard key={idx} {...blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
