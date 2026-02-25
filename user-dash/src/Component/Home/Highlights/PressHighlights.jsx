import React, { useEffect, useRef } from "react";

const pressData = [
    {
        logo: "https://th.bing.com/th?q=News+Logo+Clip+Art&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&ucfimg=1&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
        text: "ShipGlobal achieves 100x growth as Ashneer Grover joins as early investor.",
    },
    {
        logo: "https://th.bing.com/th?q=News+Logo+for+HTML&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&ucfimg=1&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247",
        text: "Bootstrapped logistic startup ShipGlobal records exceptional 100% year-on-year growth.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-1.webp",
        text: "Cross-border shipping startup raises $2.5 million from InfoEdge Ventures.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-2.webp",
        text: "ShipGlobal strengthens global presence with new funding injection.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-3.webp",
        text: "ShipGlobal expands its logistics network across 50+ international destinations.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-4.webp",
        text: "Indian logistics startup ShipGlobal disrupts cross-border shipping market.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-6.webp",
        text: "ShipGlobal ranks among India's fastest-growing logistics innovators.",
    },
    {
        logo: "https://shipglobal.in/wp-content/uploads/2025/05/5-7.webp",
        text: "ShipGlobal sets new benchmarks in affordable international shipping.",
    }
];

const PressHighlights = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        let scrollAmount = 0;

        const slide = () => {
            scrollAmount += container.offsetWidth / 4; // width of one card
            if (scrollAmount >= container.scrollWidth / 2) {
                // reset for infinite loop
                scrollAmount = 0;
            }
            container.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        };

        const interval = setInterval(slide, 2000); // slide every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // Duplicate the data for seamless marquee
    const marqueeData = [...pressData, ...pressData];

    return (
        <section className="py-16 px-6 lg:px-24 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-blue-600 text-2xl font-semibold mb-2 relative inline-block">
                    Press Highlights
                    <span className="absolute bottom-0 mt-2.5 left-0 w-full h-1 bg-yellow-300 rounded-full"></span>

                </h2>

                <h3 className="text-gray-900 text-3xl font-bold mb-4">
                    Spotlighting Our Journey and Impact Across Media
                </h3>
                <p>
                    Discover our presence across various media platforms, where we share insights, <br /> celebrate achievements, and shape conversations. Stay updated on how we’re <br /> making an impact and leading innovation across industries.
                </p>
                <br />
                <div
                    ref={containerRef}
                    className="overflow-hidden flex gap-4"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {marqueeData.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 w-1/4 bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center"
                        >
                            <img
                                loading="lazy"
                                decoding="async"
                                src={item.logo}
                                alt="Press Logo"
                                className="h-16 mb-4 object-contain"
                            />
                            <p className="text-gray-800">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PressHighlights;
