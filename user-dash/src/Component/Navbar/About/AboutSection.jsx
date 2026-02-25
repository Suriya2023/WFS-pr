import React from "react";
import globe from "../../../assets/Uploads/About/g2.gif";
const AboutSection = () => {
  return (
    <section className="w-full bg-white py-24 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT TEXT SIDE */}
        <div>
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black text-red-700 mb-2 tracking-tighter">
            What We Do?
          </h2>

          {/* Red line */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            <span className="w-32 h-[4px] bg-red-600 rounded-full"></span>
          </div>

          {/* Main Heading */}
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-10 tracking-tight">
            Making international shipping <span className="text-red-600">simple and affordable</span> for businesses of all sizes
          </h3>

          {/* Sub-heading */}
          <h4 className="text-2xl md:text-4xl font-black text-red-700 mb-6 tracking-tighter">
            Our Mission
          </h4>

          {/* Description */}
          <p className="text-gray-600 text-xl font-bold leading-relaxed max-w-xl">
            Founded in 2021, we are India’s first technology-based logistics service
            provider that enables SMEs to ship parcels internationally. We are here
            to make your global shipping experience <span className="text-red-600">hassle-free</span>, taking your business
            to the next level.
          </p>
        </div>

        {/* RIGHT IMAGE SIDE */}
        <div className="flex justify-center">
          <img
            src={globe}
            alt="World Map"
            className="w-[350px] md:w-[450px] object-contain drop-shadow-xl"
          />
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
