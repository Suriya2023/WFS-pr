import React from "react";

const StatsSection = () => {
  return (
    <section className="w-full px-6 md:px-20 py-20 bg-yellow-50/20">
      <div className="bg-gradient-to-br from-red-700 to-red-900 text-white rounded-[2.5rem] py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between text-center gap-10 shadow-2xl shadow-red-900/20">

        <div className="group">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter group-hover:scale-110 transition-transform">220+</h2>
          <p className="mt-3 text-yellow-300 font-black uppercase tracking-widest text-xs">Countries Covered</p>
        </div>

        <div className="group">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter group-hover:scale-110 transition-transform">15</h2>
          <p className="mt-3 text-yellow-300 font-black uppercase tracking-widest text-xs">Regional Offices</p>
        </div>

        <div className="group">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter group-hover:scale-110 transition-transform">25,000+</h2>
          <p className="mt-3 text-yellow-300 font-black uppercase tracking-widest text-xs">Happy Customers</p>
        </div>

        <div className="group">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter group-hover:scale-110 transition-transform">1 Cr+</h2>
          <p className="mt-3 text-yellow-300 font-black uppercase tracking-widest text-xs">Parcels Shipped</p>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
