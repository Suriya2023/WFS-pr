import React from "react";
import QuoteHeading from "./QuoteHeading";
import QuoteDescription from "./QuoteDescription";
import QuoteForm from "./QuoteForm";

export default function GetQuoteSection() {
    return (
        <section className="bg-yellow-50/50 py-24 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Left Side - Heading & Description */}
                <div>
                    <QuoteHeading />
                    <QuoteDescription />
                </div>

                {/* Right Side - Form */}
                <div>
                    <QuoteForm />
                </div>
            </div>
        </section>
    );
}
