import React from "react";
import StepCard from "./StepCard";

// Icons / GIF images
import step1Gif from "../../../assets/Uploads/step1.gif";
import step2Gif from "../../../assets/Uploads/step2.gif";
import step3Gif from "../../../assets/Uploads/step3.gif";

export default function StepSection() {
    const steps = [
        {
            icon: step1Gif,
            title: "STEP ONE",
            desc: "Create your order by entering your details.",
        },
        {
            icon: step2Gif,
            title: "STEP TWO",
            desc: "Compare rates and choose the service that fits your needs.",
        },
        {
            icon: step3Gif,
            title: "STEP THREE",
            desc: "Book your pickup and ship confidently—leave the rest to us!",
        },
    ];

    return (
        <section className="py-16 px-8 lg:px-20 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col items-start gap-6">
                <h2 className="text-4xl lg:text-5xl font-black text-red-700 uppercase tracking-tighter">
                    Your product deserves a <span className="text-black">'Global Stage'</span>
                </h2>
                <p className="text-gray-700 text-base lg:text-lg">
                    All it takes is a few minutes and 3 easy steps to kick-off your export journey.
                    Our user-friendly dashboard will guide you through everything from signup to shipment in no time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
                    {steps.map((step, index) => (
                        <StepCard key={index} icon={step.icon} title={step.title} desc={step.desc} />
                    ))}
                </div>

                {/* Button with horizontal line */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center w-full mt-8 gap-4">
                    {/* Button */}
                    <button className="bg-red-600 text-white font-black text-xl px-10 py-5 rounded-2xl hover:bg-red-700 transition-all duration-300 flex items-center gap-4 shadow-xl shadow-red-500/30 uppercase tracking-widest transform active:scale-95">
                        Start Now <span className="text-2xl">✈️</span>
                    </button>

                    {/* Horizontal line */}
                    <div className="flex-1 h-1 bg-gray-300 rounded w-full sm:w-auto"></div>
                </div>

            </div>
        </section>
    );
}
