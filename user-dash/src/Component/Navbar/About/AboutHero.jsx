import React from "react";
import ExporterBadge from "./ExporterBadge.jsx";

// Replace with your actual image import
import deliveryBoy from "../../../assets/Uploads/About/a1.webp";

const AboutHero = () => {
  return (
    <section className="w-full px-6 md:px-20 py-24 flex flex-col md:flex-row items-center justify-between gap-12 bg-yellow-50/30">

      {/* LEFT CONTENT */}
      <div className="md:w-1/2">
        <h1 className="text-5xl md:text-8xl font-black text-red-700 leading-tight tracking-tighter uppercase">
          United by <br /><span className="text-gray-900">Passion</span>
        </h1>

        <p className="text-gray-600 mt-8 text-xl leading-relaxed font-bold uppercase tracking-tight">
          At the heart of our business lies a deep passion for innovation and a
          relentless drive to transform the logistics industry.
        </p>

        <button className="mt-10 px-10 py-5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black text-lg shadow-xl shadow-red-500/30 flex items-center gap-4 transform active:scale-95 uppercase tracking-widest">
          Start Shipping Now
          <span className="text-2xl animate-bounce-x">✈️</span>
        </button>
      </div>

      {/* RIGHT IMAGE + FLOATING CARD */}
      <div className="relative md:w-1/2 flex justify-center">
        <img
          src={deliveryBoy}
          alt="Delivery Boy"
          className="rounded-xl shadow-xl w-full max-w-md"
        />

        <ExporterBadge />
      </div>
    </section>
  );
};

export default AboutHero;
