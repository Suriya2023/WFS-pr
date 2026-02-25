import React, { useState } from "react";

export default function FaqMapComponent() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gray-50 flex flex-col xl:flex-row gap-10 p-6 md:p-12 lg:p-20 items-stretch justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-100/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* MAP SECTION */}
      <div className="w-full xl:w-1/2 flex justify-center items-center">
        <div className="w-full h-[400px] md:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white relative group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.267641801443!2d77.12124687495393!3d28.590766275695395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bcbd603a49f%3A0x743b606e8f1e68cd!2sShipGlobal%20Corporate%20HQ!5e0!3m2!1sen!2sin!4v1733730000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-gray-100 z-10 hidden sm:block">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Our Location</p>
            <p className="font-bold text-gray-900 text-lg">Global HQ, New Delhi</p>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="w-full xl:w-1/2 flex flex-col items-start justify-center">
        <div className="mb-8 md:mb-10 text-center md:text-left w-full">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Support & Help</span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 leading-tight">
            Frequently Asked <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Questions</span>
          </h1>
        </div>

        <div className="w-full flex flex-col gap-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`w-full bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index
                ? 'border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-100 scale-[1.02]'
                : 'border-white md:hover:border-blue-200 shadow-sm md:hover:shadow-md'
                }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 flex justify-between items-center text-left gap-4"
              >
                <span className={`font-bold text-sm md:text-lg leading-tight transition-colors ${openIndex === index ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.q}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${openIndex === index ? 'bg-blue-100 text-blue-600 rotate-45' : 'bg-gray-100 text-gray-500 rotate-0'
                  }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-dashed border-gray-100 mx-5 mb-2 mt-1">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FAQ LIST DATA
const faqData = [
  {
    q: "Which countries can I ship to using BGL Express?",
    a: "We ship to over 220+ countries and territories worldwide, including major markets like the USA, UK, Canada, Australia, UAE, and Europe, ensuring comprehensive global coverage."
  },
  {
    q: "What kind of products can I ship internationally?",
    a: "You can ship documents, parcels, gifts, commercial samples, luggage, and household items. However, restricted items like hazardous materials, perishable goods, and liquids are subject to airline and customs regulations."
  },
  {
    q: "Does BGL Express offer same-day pick up?",
    a: "Yes! We offer same-day pickup services in Delhi NCR and major metro cities if the booking is made before 2:00 PM. For other locations, pickup is usually scheduled for the next business day."
  },
  {
    q: "How can I track my shipment?",
    a: "Once your shipment is picked up, you will receive a unique tracking AWB number. You can use this number on our website's 'Track Shipment' page to get real-time updates."
  },
  {
    q: "How can I calculate shipping rates?",
    a: "You can easily calculate estimated shipping costs using our online 'Rate Calculator'. Just enter the weight, dimensions, pickup pincode, and destination country to get an instant quote."
  },
  {
    q: "Does BGL Express charge any platform fees?",
    a: "No, we do not charge any hidden platform fees. The price you see includes freight and fuel surcharges. Customs duties (if any) are paid by the receiver unless specified otherwise."
  },
];
