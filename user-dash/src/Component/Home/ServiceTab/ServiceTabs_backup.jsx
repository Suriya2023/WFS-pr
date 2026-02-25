import React, { useState } from "react";
import ServiceCard from "./ServiceCard";

// Import images
// assets/Uploads/marketplace.webp
import marketplaceImg from "../../../assets/Uploads/marketplace.webp";
import dropshippingImg from "../../../assets/Uploads/dropshipping.webp";
import b2bImg from "../../../assets/Uploads/b2b.webp";
import overseasImg from "../../../assets/Uploads/overseas.webp";

export default function ServiceTabs() {
    const services = [
        {
            id: "marketplaces",
            title: "Marketplaces",
            img: marketplaceImg,
            content: {
                heading: "Marketplaces",
                desc: "Seamless integration with leading marketplaces like Amazon, eBay, Etsy, Walmart, and more to facilitate your eCommerce growth.",
                points: ["Safe and Secure", "Trusted by 10k+ Marketplace Sellers"],
                btnText: "Start Shipping"
            },
        },
        {
            id: "dropshipping",
            title: "Dropshipping",
            img: dropshippingImg,
            content: {
                heading: "Dropshipping",
                desc: "Whether youΓÇÖre building your own online store on Shopify, launching a personal website, or creating a dropshipping hub, we empower your business to expand globally with ease.",
                points: ["Door-to-Door Delivery", "No Platform Fees"],
                btnText: "Start Shipping"
            },
        },
        {
            id: "b2b",
            title: "B2B",
            img: b2bImg,
            content: {
                heading: "B2B",
                desc: "Penetrate new markets and make the most of our competitive rates and efficient air courier services to scale quickly.",
                points: ["Multiple Shipping Options", "Customs Clearance Support"],
                btnText: "Start Shipping"
            },
        },
        {
            id: "overseas",
            title: "Overseas Friends and Families",
            img: overseasImg,
            content: {
                heading: "Overseas Friends and Families",
                desc: "Effortlessly send joy to your loved ones. Secure and reliable, we ensure your packages reach their destination, making every moment special.",
                points: ["Safe and Secure", "Ship as Low as 50 gm"],
                btnText: "Start Shipping"
            },
        },
    ];

    const [activeService, setActiveService] = useState("marketplaces");

    const selectedService = services.find(s => s.id === activeService);

    return (
        <section className="py-24 bg-black px-6 sm:px-10 lg:px-20 text-white relative overflow-hidden">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-yellow-400 mb-4 uppercase tracking-tighter">
                    Our Services
                </h2>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-100 mb-6 uppercase tracking-tight">
                    We have a tailor-made shipping option for everyone,<br /> especially <span className="text-red-600">You!</span>
                </h1>
                <p className="text-gray-300 max-w-3xl mx-auto">
                    WeΓÇÖre dedicated to delivering reliable, high-quality service that drives your success. Whether it's 50 grams or 5 tons, from your warehouse to your customer's doorstepΓÇöentrust all your shipping needs to us. You bring the visionΓÇöweΓÇÖll help make it happen.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center border border-white rounded-full py-3 px-3 gap-4 mb-10">
                {services.map(service => (
                    <button
                        key={service.id}
                        onMouseEnter={() => setActiveService(service.id)}
                        className={`px-8 py-3 rounded-full border-2 transition-all duration-300 text-sm sm:text-base font-black uppercase tracking-widest
                            ${activeService === service.id
                                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/30 transform scale-105"
                                : "border-gray-800 text-gray-400 hover:border-yellow-400 hover:text-yellow-400"
                            }`}
                    >
                        {service.title}
                    </button>
                ))}
            </div>

            {/* Service Card */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <img
                        loading="lazy"
                        decoding="async"
                        src={selectedService.img}
                        alt={selectedService.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h3 className="text-3xl sm:text-4xl font-black text-yellow-400 mb-6 uppercase tracking-tighter">{selectedService.content.heading}</h3>
                    <p className="text-gray-300 text-base sm:text-lg mb-4">{selectedService.content.desc}</p>
                    <ul className="text-gray-300 mb-4 space-y-2 list-disc list-inside">
                        {selectedService.content.points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                    <button className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-500/30 transform active:scale-95">
                        {selectedService.content.btnText}
                    </button>
                </div>
            </div>
        </section>
    );
}
