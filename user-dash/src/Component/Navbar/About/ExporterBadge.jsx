import React from "react";

const ExporterBadge = () => {
  return (
    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-xl px-5 py-4 shadow-lg flex flex-col items-center">
      {/* Avatar Icons */}
      <div className="flex -space-x-2 mb-1">
        <img
          src="https://i.pravatar.cc/40?img=1"
          className="w-8 h-8 rounded-full border-2 border-white"
          alt=""
        />
        <img
          src="https://i.pravatar.cc/40?img=2"
          className="w-8 h-8 rounded-full border-2 border-white"
          alt=""
        />
        <img
          src="https://i.pravatar.cc/40?img=3"
          className="w-8 h-8 rounded-full border-2 border-white"
          alt=""
        />
      </div>

      {/* Count */}
      <h3 className="text-2xl font-bold">25k+</h3>
      <p className="text-xs text-white/80 text-center mt-1 leading-tight">
        More than 25000 <br /> exporters has joined us
      </p>
    </div>
  );
};

export default ExporterBadge;
