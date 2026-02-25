import React from "react";

const FactsSection = () => {
  return (
    <section className="w-full px-6 md:px-20 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Fun Facts About Us
      </h2>

      {/* Small underline decoration */}
      <div className="w-20 h-1 bg-yellow-500 mt-2 rounded-full mb-8"></div>

      <p className="text-2xl text-red-900 font-black leading-tight max-w-4xl uppercase tracking-tighter">
        Our first sellers are still exporting with us, which is a testament to
        the long-term relationships we foster and the ongoing value we bring to
        our customers.
      </p>
    </section>
  );
};

export default FactsSection;
