import React from "react";

const BlogCard = ({ image, title, category }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300">
      <img  loading="lazy" decoding="async" src={image} alt={title} className="w-full h-52 object-cover" />

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug text-[#0A1A44] hover:text-blue-600 cursor-pointer">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{category}</p>
      </div>
    </div>
  );
};

export default BlogCard;
