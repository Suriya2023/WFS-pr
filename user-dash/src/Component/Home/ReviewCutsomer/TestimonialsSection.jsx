import React from "react";
import VerticalTestimonials from "./VerticalTestimonials";

const TestimonialsSection = () => {
    return (
        <section className="py-20 px-6 lg:px-24 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left content */}
                <div className="">
                    <h5 className="text-red-600 font-black text-xl uppercase tracking-widest">Customer Testimonials</h5>
                    <div className="mt-4">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight mt-4">
                            1 Crore+ <br /><span className="text-gray-400">Successful Shipments</span>
                        </h2>
                        <br /><br />
                        <p className="mt-6 text-black text-[2vmin] max-w-xl">
                            From mothers sending love abroad to new sellers starting their <br /> journey,
                            ShipGlobal is for everyone.
                        </p>
                    </div>
                </div>

                {/* Right slider */}
                <div className="mt-6 lg:mt-0">
                    <VerticalTestimonials auto={true} interval={4500} pauseOnHover={true} />
                </div>

            </div>
        </section>
    );
};

export default TestimonialsSection;
