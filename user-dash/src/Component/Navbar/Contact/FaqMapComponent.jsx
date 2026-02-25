import React from "react";

export default function FaqMapComponent() {
  return (
    <div className="w-full  bg-white flex flex-col md:flex-row items-center justify-center gap-10 p-6 md:p-12">

      {/* MAP SECTION */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full h-[380px] md:h-[480px] rounded-xl overflow-hidden shadow-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.267641801443!2d77.12124687495393!3d28.590766275695395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bcbd603a49f%3A0x743b606e8f1e68cd!2sShipGlobal%20Corporate%20HQ!5e0!3m2!1sen!2sin!4v1733730000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="w-full md:w-1/2 flex flex-col gap-4 items-start justify-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center md:text-left w-full">
          Frequently Asked Questions
        </h1>

        {faqData.map((item, index) => (
          <div
            key={index}
            className="w-full p-4 bg-blue-50 border rounded-xl flex justify-between items-center hover:bg-blue-100 cursor-pointer transition"
          >
            <span className="font-medium text-gray-900 text-sm md:text-base">{item}</span>
            <span className="text-xl font-bold text-blue-600">+</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ LIST DATA (same component me)
const faqData = [
  "Which countries can I ship to using ShipGlobal?",
  "What kind of products can I ship internationally?",
  "Does ShipGlobal offer same-day pick up?",
  "How can I track my shipment?",
  "What should I do if I have shipping related concerns?",
  "How can I calculate shipping rates?",
  "Does ShipGlobal charge any platform fees?",
  "Which courier shipping mode should I choose – CSB 4 or CSB 5?",
];
