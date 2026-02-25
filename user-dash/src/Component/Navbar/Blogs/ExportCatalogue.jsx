import React, { useState } from "react";
import b9 from '../../../assets/Uploads/About/b9.webp'
import b10 from '../../../assets/Uploads/About/b10.webp'
import b11 from '../../../assets/Uploads/About/b11.webp'
import b12 from '../../../assets/Uploads/About/b12.webp'
import b13 from '../../../assets/Uploads/About/b13.webp'
import b14 from '../../../assets/Uploads/About/b14.webp'


const blogData = [
    {
        id: 1,
        title: " How to Export Ayurvedic Products to Portugal",
        category: ["Ecommerce", "International Shipping"],
        image: b9,
    },
 
    {
        id: 2,
        title: "   Black Friday Export Bundle Strategies",
        category: ["Ecommerce", "International Shipping"],
        image: b10,
    },
    {
        id: 3,
        title: "5 Common Export Mistakes During Peak Season (How to Avoid Them)",
        category: ["International Shipping"],
        image: b11,
    },
    {
        id: 4,
        title: "Black Friday Checklist for Exporters",
        category: ["Ecommerce"],
        image: b12,
    },
       {
        id: 5,
        title: "Export Apparel, Footwear and Leather Goods from India to Portugal Ecommerce,International Shipping",
        category: ["International Shipping"],
        image: b14,
    },
    {
        id: 6,
        title: "Ship Indian Spices, Tea and Coffee to Portugal",
        category: ["Ecommerce"],
        image: b13,
    },

];

export default function ExportCatalogue() {
    const [activeFilter, setActiveFilter] = useState("All Blogs");

    const filteredBlogs =
        activeFilter === "All Blogs"
            ? blogData
            : blogData.filter((item) => item.category.includes(activeFilter));

    const filterButtons = ["All Blogs", "International Shipping", "Ecommerce"];

    return (
        <div className="w-full bg-white py-16 px-6 md:px-20">
            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a4ca3] relative inline-block">
                Your Export Catalogue
                <span className="absolute left-0 -bottom-1 w-24 h-1 bg-[#f4a700]"></span>
            </h1>

            <p className="text-xl font-semibold mt-5 text-black leading-snug">
                Find what you need, sorted and stacked just like your shipments
            </p>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-10">
                {filterButtons.map((btn) => (
                    <button
                        key={btn}
                        onClick={() => setActiveFilter(btn)}
                        className={`px-5 py-2 rounded-lg font-semibold border transition-all duration-300
              ${activeFilter === btn ? "bg-blue-600 text-white border-blue-600" : "bg-white text-blue-600 border-blue-600"}`}
                    >
                        {btn}
                    </button>
                ))}
            </div>

            {/* GRID CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                {filteredBlogs.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl shadow-md hover:shadow-xl transition p-4 cursor-pointer"
                    >
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="rounded-lg w-full hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <h3 className="text-lg font-bold mt-4">{item.title}</h3>

                        <p className="text-sm text-gray-600 mt-2">
                            {item.category.join(", ")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
