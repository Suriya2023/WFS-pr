import React from "react";

export default function ServiceCard({ img, content }) {
    return (
        <div className="flex flex-col lg:flex-row items-center gap-8 w-full bg-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow">

            {/* Image */}
            <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg">
                <img
                    loading="lazy"
                    decoding="async"
                    src={img}
                    alt={content.heading}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold">{content.heading}</h3>
                <p className="text-gray-300">{content.desc}</p>
                <ul className="list-disc flex gap-3 flex-wrap list-inside text-gray-200">
                    {content.points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
                <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105">
                    {content.btnText}
                </button>
            </div>
        </div>
    );
}
