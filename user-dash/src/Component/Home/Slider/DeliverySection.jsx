import React from "react";

export default function DeliverySection({ data, reverse }) {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-20 bg-white">
      <div
        className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* IMAGE */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          {/* brand background block */}
          <div
            className={`absolute w-3/4 h-[260px] bg-yellow-300 rounded-2xl -bottom-6 ${
              reverse ? "right-6" : "left-6"
            } -z-10`}
          />

          <img
            loading="lazy"
            decoding="async"
            src={data[0].img}
            alt="delivery"
            className="w-full max-w-[460px] rounded-2xl shadow-xl"
          />
        </div>

        {/* TEXT */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-snug">
            {data[0].title}
          </h2>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {data[0].desc}
          </p>

          <p className="text-gray-900 font-semibold mb-4">
            {data[0].boldDesc}
          </p>

          <p className="text-gray-700 mb-6">
            {data[0].moreDesc}
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-red-600 font-bold text-lg hover:underline"
          >
            {data[0].btn}
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
