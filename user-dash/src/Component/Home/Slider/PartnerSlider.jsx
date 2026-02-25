import React, { useRef } from "react";
import SliderArrow from "./SliderArrow";
import "./mystyle.css";

import Group1 from "../../../assets/Uploads/Group-1.webp";
import Group2 from "../../../assets/Uploads/Group-2.webp";
import Group3 from "../../../assets/Uploads/Group-3.webp";
import Group4 from "../../../assets/Uploads/Group-4.webp";
import Group5 from "../../../assets/Uploads/Group-5.webp";
import Group6 from "../../../assets/Uploads/Group-6.webp";
import Group7 from "../../../assets/Uploads/Group-7.webp";
import Group8 from "../../../assets/Uploads/Group-8.webp";
import Group9 from "../../../assets/Uploads/Group-9.webp";

export default function PartnerSlider() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const logos = [
    Group1,
    Group2,
    Group3,
    Group4,
    Group5,
    Group6,
    Group7,
    Group8,
    Group9,
  ];

  return (
    <section
      id="partner-slider"
      className="relative bg-white py-16 overflow-hidden"
    >
      {/* subtle brand background */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-yellow-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl sm:text-5xl font-black text-gray-900 mb-12 uppercase tracking-tighter">
          We help our partners grow{" "}
          <span className="text-red-600 block sm:inline">globally</span>
        </h2>

        {/* Left Arrow */}
        <SliderArrow direction="left" onClick={scrollLeft} />

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-14 overflow-x-auto scroll-smooth px-14 partner-scroll"
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className="min-w-[160px] flex justify-center items-center"
            >
              <img
                src={logo}
                alt="partner logo"
                loading="lazy"
                decoding="async"
                className="h-16 lg:h-20 object-contain opacity-80 hover:opacity-100 transition duration-300"
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <SliderArrow direction="right" onClick={scrollRight} />
      </div>
    </section>
  );
}
