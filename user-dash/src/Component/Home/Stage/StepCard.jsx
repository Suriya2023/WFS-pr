import React from "react";

export default function StepCard({ icon, title, desc }) {
  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8 flex flex-col items-start gap-6 shadow-xl hover:shadow-2xl 
                    transition-all duration-300 hover:scale-[1.02] hover:bg-white group">
      {/* GIF icon */}
      <div className="w-16 h-16">
        <img loading="lazy" decoding="async" src={icon} alt={title} className="w-full h-full object-contain" />
      </div>

      {/* Title */}
      <h3 className="font-black text-2xl text-red-700 uppercase tracking-tighter border-b-2 border-red-100 pb-1 group-hover:border-red-600 transition-colors">{title}</h3>

      {/* Description */}
      <p className="text-gray-800 text-base">{desc}</p>
    </div>
  );
}
