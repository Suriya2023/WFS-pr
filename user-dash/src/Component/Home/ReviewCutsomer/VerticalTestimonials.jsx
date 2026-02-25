import React, { useEffect, useRef, useState } from "react";
import testimonials from "./Data";
import TestimonialCard from "./TestimonialCard";

const VISIBLE = 3;
const SLIDE_HEIGHT = 100;

const VerticalTestimonials = ({
    auto = true,
    interval = 2000,
    pauseOnHover = true,
}) => {
    const n = testimonials.length;
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (auto) startTimer();
        return () => stopTimer();
    }, []); // ⬅ removed index dependency (main fix)

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            goNext();
        }, interval);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const goPrev = () => {
        stopTimer();
        setIndex((prev) => (prev - 1 + n) % n);
        if (auto) startTimer();
    };

    const goNext = () => {
        stopTimer();
        setIndex((prev) => (prev + 1) % n);
        if (auto) startTimer();
    };

    return (
        <div className="w-full">
            <div
                className="relative w-full h-[420px] md:h-[360px] lg:h-[420px] overflow-hidden"
                onMouseEnter={() => pauseOnHover && stopTimer()}
                onMouseLeave={() => pauseOnHover && auto && startTimer()}
            >
                {testimonials.map((item, i) => {
                    const offset = (i - index + n) % n;
                    const visible = offset < VISIBLE;

                    return (
                        <div
                            key={item.id}
                            style={{
                                transform: `translateY(${offset * SLIDE_HEIGHT}%)`,
                                opacity: visible ? 1 : 0,
                                zIndex: visible ? 10 - offset : -1,
                                transition: "transform 900ms cubic-bezier(.25,.85,.25,1)",
                            }}
                            className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center"
                        >
                            <div className="w-[92%] md:w-[82%] lg:w-[74%]">
                                <TestimonialCard item={item} />
                            </div>
                        </div>
                    );
                })}

                {/* Up/Down Buttons */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                    <button
                        onClick={goPrev}
                        className="bg-white/95 text-slate-800 p-2 rounded-full shadow hover:scale-110 transition"
                    >
                        ▲
                    </button>
                    <button
                        onClick={goNext}
                        className="bg-white/95 text-slate-800 p-2 rounded-full shadow hover:scale-110 transition"
                    >
                        ▼
                    </button>
                </div>

                {/* Removed dots: No UI, no click handler, no interference */}
            </div>
        </div>
    );
};

export default VerticalTestimonials;
