import React from "react";

const FeatureCard = ({ gif, title, description }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-[2rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer text-center hover:bg-white transform hover:-translate-y-2">

      {/* GIF ICON */}
      <img
        src={gif}
        alt={title}
        className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
      />

      {/* TITLE */}
      <h3 className="text-2xl font-black text-red-700 mb-4 uppercase tracking-tighter group-hover:text-red-600 transition-colors">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-gray-700 font-bold leading-snug uppercase tracking-tight text-sm">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
