import React from "react";
import b5 from '../../../assets/Uploads/About/b5.webp'
import b6 from '../../../assets/Uploads/About/b6.webp'
import b7 from '../../../assets/Uploads/About/b7.webp'
import b8 from '../../../assets/Uploads/About/b8.webp'

import b9 from '../../../assets/Uploads/About/b9.webp'
import b10 from '../../../assets/Uploads/About/b10.webp'
import b11 from '../../../assets/Uploads/About/b11.webp'
import b12 from '../../../assets/Uploads/About/b12.webp'
const data = {
    international: [
        {
            img: b6,
            title: "How to Export Ayurvedic Products to Portugal",
        },
        {
            img: b7,
            title: "Black Friday Export Bundle Strategies",
        },
        {
            img: b8,
            title:
                "5 Common Export Mistakes During Peak Season (How to Avoid Them)",
        },
        {
            img: b5,
            title: "Black Friday Checklist for Exporters",
        },
    ],

    ecommerce: [
        {
            img: b9,
            title:
                "Export Apparel, Footwear and Leather Goods from India to Portugal",
        },
        {
            img: b10,
            title: "Ship Indian Spices, Tea and Coffee to Portugal",
        },
        {
            img: b11,
            title:
                "Exporting Indian Ready to Eat and Frozen Foods to Germany",
        },
        {
            img: b12,
            title:
                "Exporting Toys and Baby Products: India to France",
        },
    ],
};

export default function BlogTwoColumn() {
    return (
        <div className="w-full px-6 md:px-20 py-16">

            {/* Outer Grid → Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* LEFT = International Shipping */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-red-700 relative inline-block tracking-tighter uppercase">
                        International Shipping
                        <span className="absolute left-0 -bottom-3 w-40 h-[5px] bg-red-600 rounded-full"></span>
                    </h2>

                    <div className="mt-10 space-y-10">
                        {data.international.map((item, index) => (
                            <div key={index}>
                                <div className="flex gap-6 items-start">
                                    <img
                                        src={item.img}
                                        className="w-36 h-24 rounded-lg object-cover"
                                        alt=""
                                    />
                                    <p className="text-lg font-semibold text-black leading-snug">
                                        {item.title}
                                    </p>
                                </div>

                                {/* Divider line */}
                                <div className="border-b mt-4"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT = Ecommerce */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-red-700 relative inline-block tracking-tighter uppercase">
                        eCommerce
                        <span className="absolute left-0 -bottom-3 w-40 h-[5px] bg-red-600 rounded-full"></span>
                    </h2>

                    <div className="mt-10 space-y-10">
                        {data.ecommerce.map((item, index) => (
                            <div key={index}>
                                <div className="flex gap-6 items-start">
                                    <img
                                        src={item.img}
                                        className="w-36 h-24 rounded-lg object-cover"
                                        alt=""
                                    />
                                    <p className="text-lg font-semibold text-black leading-snug">
                                        {item.title}
                                    </p>
                                </div>

                                {/* Divider line */}
                                <div className="border-b mt-4"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
