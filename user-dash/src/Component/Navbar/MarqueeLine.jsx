import React from "react";

export default function MarqueeLine() {
  return (
    <div className="w-full border-b border-red-50 overflow-hidden  py-3">
      <div className="marquee text-black font-semibold text-base md:text-lg lg:text-xl text-center">
        🛍️ Black Friday Countdown Begins! Get ₹250 off on your First Shipment!
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 22s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
