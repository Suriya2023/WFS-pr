import React, { useEffect, useRef, useState } from "react";
import testimonials from "./Data";
import TestimonialCard from "./TestimonialCard";

const VISIBLE = 3;
const SLIDE_HEIGHT = 140; // Tighter vertical spacing for less gap

const VerticalTestimonials = ({
    auto = true,
    interval = 5000,
    pauseOnHover = true,
}) => {
    const n = testimonials.length;
    const [index, setIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const timerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {
        if (auto) startTimer();
        return () => stopTimer();
    }, [auto, index]);

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
        setIndex((prev) => (prev - 1 + n) % n);
    };

    const goNext = () => {
        setIndex((prev) => (prev + 1) % n);
    };

    const handleWheel = (e) => {
        if (isScrolling) return;

        if (Math.abs(e.deltaY) > 10) {
            setIsScrolling(true);
            if (e.deltaY > 0) {
                goNext();
            } else {
                goPrev();
            }

            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 800);
        }
    };

    return (
        <div className="w-full">
            <div
                className="relative w-full h-[450px] md:h-[500px] lg:h-[520px] overflow-hidden px-4 cursor-ns-resize"
                onMouseEnter={() => pauseOnHover && stopTimer()}
                onMouseLeave={() => pauseOnHover && auto && startTimer()}
                onWheel={handleWheel}
            >
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

                <div className="relative pt-4 md:pt-6">
                    {testimonials.map((item, i) => {
                        const offset = (i - index + n) % n;
                        const visible = offset < VISIBLE;

                        return (
                            <div
                                key={`${item.id}-${i}`}
                                style={{
                                    transform: `translateY(${offset * SLIDE_HEIGHT}px) scale(${visible ? 1 - (offset * 0.08) : 0.7})`,
                                    opacity: visible ? 1 - (offset * 0.45) : 0,
                                    zIndex: visible ? 10 - offset : -1,
                                    transition: "all 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
                                    filter: offset > 0 ? `blur(${offset * 1}px)` : 'none',
                                }}
                                className="absolute left-0 right-0 w-full flex justify-center py-2"
                            >
                                <div className="w-full max-w-2xl px-2">
                                    <TestimonialCard item={item} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Vertical Progress Indicator */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30 mr-2 md:mr-6">
                    {testimonials.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 shadow-sm transition-all duration-700 rounded-full ${index === i ? "h-12 bg-red-600" : "h-4 bg-slate-200"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VerticalTestimonials;
