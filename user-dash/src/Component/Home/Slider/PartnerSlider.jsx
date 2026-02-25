import React from "react";
import "./mystyle.css";

// Carrier Logos (Assuming these are the courier partners)
import Delhivery from "../../../assets/Uploads/Group-1.webp";
import Bluedart from "../../../assets/Uploads/Group-2.webp";
import EcomExpress from "../../../assets/Uploads/Group-3.webp";
import XpressBees from "../../../assets/Uploads/Group-4.webp";
import Shadowfax from "../../../assets/Uploads/Group-5.webp";
import Amazon from "../../../assets/Uploads/Group-6.webp";
import DHL from "../../../assets/Uploads/Group-7.webp";
import FedEx from "../../../assets/Uploads/Group-8.webp";
import Aramex from "../../../assets/Uploads/Group-9.webp";

export default function PartnerSlider() {
  const carriers = [
    { logo: Delhivery, name: "Delhivery" },
    { logo: Bluedart, name: "Blue Dart" },
    { logo: EcomExpress, name: "Ecom Express" },
    { logo: XpressBees, name: "XpressBees" },
    { logo: Shadowfax, name: "Shadowfax" },
    { logo: Amazon, name: "Amazon Shipping" },
    { logo: DHL, name: "DHL" },
    { logo: FedEx, name: "FedEx" },
    { logo: Aramex, name: "Aramex" },
  ];

  // Double the array for infinite scroll effect
  const extendedCarriers = [...carriers, ...carriers];

  return (
    <section
      id="partner-slider"
      className="relative bg-slate-50 py-12 lg:py-24 overflow-hidden border-y border-slate-100"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50 rounded-full blur-[100px] opacity-40 translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="inline-block py-1 px-4 mb-4 text-xs font-bold tracking-widest text-red-600 uppercase bg-red-50 rounded-full border border-red-100">
          Global Logistics Network
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          BGL Express <span className="text-blue-600">Powering</span> Your <br className="hidden md:block" />
          Shipments Globally
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium">
          Whether it&apos;s domestic speed or international reach, our deep integration with leading
          carriers ensures your parcels reach every corner of the world.
        </p>
      </div>

      <div className="partner-slider-container">
        <div className="partner-track">
          {extendedCarriers.map((carrier, index) => (
            <div
              key={index}
              className="partner-slide"
              title={carrier.name}
            >
              <div className="group relative w-full h-24 flex items-center justify-center p-6 bg-white/50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                <img
                  src={carrier.logo}
                  alt={`${carrier.name} logo`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-12 text-slate-400 font-bold text-sm uppercase tracking-[0.2em] opacity-80">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          50+ Global Carriers
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          220+ Countries
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Instant Tracking
        </div>
      </div>
    </section>
  );
}
