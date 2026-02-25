import React from "react";
import left from '../../../assets/Uploads/left.png'

export default function SliderArrow({ direction, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`
                absolute
                top-1/2
                -translate-y-1/2
                ${direction === "left" ? "left-4" : "right-4"}
                bg-white
                shadow-lg
                rounded-full
                p-3
                cursor-pointer
                hover:scale-110
                transition
                z-20
            `}
        >
            <img

                loading="lazy"
                decoding="async"
                src={left}
                alt="arrow"
                className={`w-6 h-6 ${direction === "right" ? "scale-x-[-1]" : ""}`}
            />
        </div>
    );
}
