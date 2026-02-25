import React from "react";

const CategoryTabs = ({ selected, onSelect }) => {
  const tabs = ["All Blogs", 'Shopify', "Service"];

  return (
    <div className="flex gap-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 uppercase tracking-widest
          ${selected === tab
              ? "bg-red-600 text-white shadow-lg shadow-red-500/30 transform scale-105"
              : "bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-red-700"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
