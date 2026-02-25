import React from "react";

const TestimonialCard = ({ item, variant = "card" }) => {
  return (
    <div
      className={
        "bg-white rounded-xl shadow-md p-6 w-full max-w-[520px] ring-1 ring-slate-100"
      }
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-amber-400 flex-shrink-0">
          <img  loading="lazy" decoding="async" src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{item.name}</h4>
          <p className="text-sm text-sky-600 mt-1">{item.role}</p>
        </div>
      </div>

      <p className="mt-4 text-slate-700 leading-relaxed" style={{ fontSize: "15px" }}>
        “{item.quote}”
      </p>

      
    </div>
  );
};

export default TestimonialCard;
