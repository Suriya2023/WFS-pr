import React from "react";
import b1 from '../../../assets/Uploads/About/b1.webp'
import b2 from '../../../assets/Uploads/About/b2.webp'
import b3 from '../../../assets/Uploads/About/b3.webp'
import b4 from '../../../assets/Uploads/About/b4.webp'

function ExporterReads() {
  return (
    <div className="w-full bg-yellow-50/30 py-24 px-6 md:px-20">

      {/* HEADING */}
      <h1 className="text-4xl md:text-6xl font-black text-red-700 tracking-tighter uppercase">
        Flagship Reads for Exporters
      </h1>
      <p className="text-xl md:text-2xl font-bold mt-4 text-gray-900 tracking-tight">
        Your go-to reads, handpicked for their popularity <br className="hidden md:block" /> among exporters
      </p>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">

        {/* CARD 1 */}
        <div className="bg-white rounded-[2rem] shadow-xl p-0 cursor-pointer hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-yellow-100">
          <div className="overflow-hidden">
            <img
              src={b1}
              className="rounded-t-[2rem] w-full group-hover:scale-110 transition-transform duration-500"
              alt=""
            />
          </div>
          <div className="p-8">
            <h3 className="text-xl font-black text-red-700 leading-tight tracking-tight group-hover:text-red-600 transition-colors">
              e-BRC for Exporters: Everything You Need to Know
            </h3>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white rounded-xl shadow-lg p-0 cursor-pointer hover:shadow-xl transition">
          <img
            src={b2}
            className="rounded-t-xl w-full"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-lg font-bold">
              India Export Trends 2025: Growth Insights and Market Forecasts
            </h3>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white rounded-xl shadow-lg p-0 cursor-pointer hover:shadow-xl transition">
          <img
            src={b3}
            className="rounded-t-xl w-full"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-lg font-bold">
              How to Sell on Etsy from India in 2025
            </h3>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="bg-white rounded-xl shadow-lg p-0 cursor-pointer hover:shadow-xl transition">
          <img
            src={b4}
            className="rounded-t-xl w-full"
            alt=""
          />
          <div className="p-6">
            <h3 className="text-lg font-bold">
              Top 10 Reliable International Courier Services from India in 2025
            </h3>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mt-20 w-full flex justify-center">
        <div className="w-full md:w-[70%] relative group">
          <input
            type="text"
            placeholder="Looking to export smarter? Search topics, trends, documents, or expert tips here..."
            className="w-full border-2 border-yellow-200 rounded-[2rem] px-8 py-5 shadow-2xl bg-white outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold text-gray-900 placeholder:text-gray-300"
          />
          <button className="absolute top-1/2 -translate-y-1/2 right-6 text-red-600 text-2xl hover:scale-125 transition-transform">
            🔍
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExporterReads;
