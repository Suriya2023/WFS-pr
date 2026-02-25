import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

// Import Assets
import growthIcon from "../../../assets/Uploads/About/g1.gif";
import growthBg from "../../../assets/Uploads/About/gb.png";
import networkGif from "../../../assets/Uploads/About/g2.png";
import trustedGif from "../../../assets/Uploads/About/g3.gif";
import launchpadGif from "../../../assets/Uploads/About/g5.gif";
import growthGif from "../../../assets/Uploads/About/gb.png";


const FeaturesSection = () => {
  return (
    <section id="features" className="w-full bg-[#FAFAFA] py-12 md:py-20 px-4 md:px-10 lg:px-20 overflow-hidden relative">
      <div className="container mx-auto">

        {/* DESIGNER HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-12 mb-10 md:mb-16">
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Strategic Growth Engines
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter uppercase"
            >
              WE FUEL YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-800 to-black">GLOBAL ENGINE</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium text-sm md:text-lg max-w-sm leading-snug border-l-2 border-red-600 pl-4"
          >
            Leveraging data-driven logistics and a robust network to transform local businesses into international players.
          </motion.p>
        </div>

        {/* DYNAMIC BENTO GRID LAYOUT - REDUCED GAPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[auto] mb-20">

          {/* Main Hero Bento (Large) */}
          <div className="md:col-span-2 md:row-span-2 min-h-[350px] md:min-h-[auto]">
            <FeatureCard
              index={0}
              size="large"
              gif={growthIcon}
              bgImg={growthBg}
              title="Proven Growth"
              description="Our exporters have seen a business growth of 36% in the first year, and more than 50% in the following year."
            />
          </div>

          {/* Standard Bento (Small) */}
          <div className="min-h-[250px] md:min-h-[auto]">
            <FeatureCard
              index={1}
              size="small"
              gif={networkGif}
              title="Strong Network"
              description="Fastest growing dedicated pick-up network across 30+ regions."
            />
          </div>

          {/* Standard Bento (Small) */}
          <div className="min-h-[250px] md:min-h-[auto]">
            <FeatureCard
              index={2}
              size="small"
              gif={trustedGif}
              title="Trusted Choice"
              description="8/10 eCommerce exporters consider us their most reliable courier."
            />
          </div>

          {/* Row 2 - Standard Bento (Small) - Spanning columns for layout variety */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="min-h-[250px] md:min-h-[auto]">
              <FeatureCard
                index={3}
                size="small"
                gif={launchpadGif}
                title="Exporter Launchpad"
                description="40% of our exporters started their journey and evolved into market leaders."
              />
            </div>
            {/* Minimal Decorative Bento */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-red-600 rounded-[2rem] p-6 flex flex-col justify-center text-white h-[200px] sm:h-auto min-h-[200px]"
            >
              <div className="text-4xl md:text-5xl font-black tracking-tighter opacity-20">36%</div>
              <div className="text-xs md:text-ns font-bold uppercase tracking-widest mt-2">Average First Year Growth</div>
              <div className="mt-4 md:mt-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3l-1.4 1.4 5.6 5.6H3v2h14.2l-5.6 5.6L13 21l8-8-8-8z" /></svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* DETAILED CONTENT SECTION */}
        <div className="max-w-5xl mx-auto space-y-16 mt-20 border-t border-gray-200 pt-16">

          {/* About Section */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase leading-none">About Bridge Globle Logistics</h3>
              <div className="w-12 h-1 bg-red-600 mt-4"></div>
            </div>
            <div className="md:col-span-8 space-y-4 text-gray-600 leading-relaxed font-medium">
              <p>
                Bridge Globle Logistics is a reliable and customer-centric logistics service provider offering cost-effective and high-quality shipping solutions for domestic, intercity, and international deliveries. Our mission is to make global and local shipping simple, affordable, and dependable for businesses and individuals of all sizes.
              </p>
              <p>
                We specialize in providing cheaper shipping solutions without compromising on service quality, helping exporters, importers, e-commerce sellers, and commercial clients reduce logistics costs while maintaining reliable delivery performance.
              </p>
            </div>
          </div>

          {/* Affordable Logistics */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase leading-none">Affordable Logistics with Trusted Service</h3>
              <div className="w-12 h-1 bg-red-600 mt-4"></div>
            </div>
            <div className="md:col-span-8 space-y-4 text-gray-600 leading-relaxed font-medium">
              <p>
                At Bridge Globle Logistics, we believe that quality logistics should be accessible to everyone. Through strong tie-ups with global carriers, optimized routing, and efficient operational processes, we are able to offer competitive pricing while delivering professional, compliant, and secure logistics services.
              </p>
              <p>
                Our pricing structure is transparent, with no hidden charges, allowing customers to plan shipping costs with confidence. Whether it is a small parcel or a bulk commercial shipment, we focus on providing best-value solutions tailored to customer requirements.
              </p>
            </div>
          </div>

          {/* Comprehensive Solutions */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase leading-none">Comprehensive Shipping Solutions</h3>
              <div className="w-12 h-1 bg-red-600 mt-4"></div>
            </div>
            <div className="md:col-span-8 space-y-4 text-gray-600 leading-relaxed font-medium">
              <p>We offer a wide range of logistics services designed to support diverse shipping needs:</p>
              <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  "Domestic & Intercity Courier Services",
                  "International Courier Services",
                  "Export & Import Logistics",
                  "E-commerce Shipping Solutions",
                  "Customs Clearance Services",
                  "Bulk & Commercial Cargo Handling"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4 italic">Each service is backed by professional handling, proper documentation support, and compliance with applicable regulations.</p>
            </div>
          </div>

          {/* Global Network */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase leading-none">Strong Global & Domestic Network</h3>
              <div className="w-12 h-1 bg-red-600 mt-4"></div>
            </div>
            <div className="md:col-span-8 space-y-4 text-gray-600 leading-relaxed font-medium">
              <p>
                With a worldwide delivery network covering 220+ countries and territories, Bridge Globle Logistics connects businesses to global markets efficiently. Our domestic and intercity network ensures fast and reliable deliveries across major cities and commercial hubs, supported by dependable last-mile delivery partners.
              </p>
            </div>
          </div>

          {/* Customer Focus & Compliance */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-lg text-gray-900 mb-3">Customer-Focused Operations</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Customer satisfaction is at the core of our operations. We provide doorstep pickup, real-time shipment tracking, secure and tamper-proof packaging, and responsive customer support to ensure a smooth shipping experience from pickup to delivery.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team works closely with customers to understand their shipping needs and recommend the most suitable and cost-effective solutions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-black text-lg text-gray-900 mb-3">Compliance & Transparency</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Bridge Globle Logistics follows all applicable transportation, customs, and trade regulations. We emphasize accurate documentation, honest declarations, and transparent processes to reduce delays and ensure smooth clearance for international shipments.
              </p>
            </div>
          </div>

          {/* Why Choose & Commitment */}
          <div className="bg-black rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-3xl font-black mb-6">Why Bridge Globle Logistics</h3>
                <ul className="space-y-3">
                  {[
                    "Affordable and competitive pricing",
                    "Reliable domestic and international delivery",
                    "Strong global carrier partnerships",
                    "Secure handling and real-time tracking",
                    "Customer-focused and transparent operations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <span className="text-red-500 text-xl">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-3xl font-black mb-6">Our Commitment</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Bridge Globle Logistics is committed to becoming a trusted logistics partner by delivering cheaper, faster, and better shipping services while maintaining professionalism, reliability, and compliance at every step.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
