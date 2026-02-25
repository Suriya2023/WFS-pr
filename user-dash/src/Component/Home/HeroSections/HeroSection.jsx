import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Globe2, Package, Truck, ShieldCheck, Zap, Search } from "lucide-react";
import Plane from "../../../assets/plane.png";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const featureCards = [
    { icon: <Zap className="w-6 h-6 text-yellow-500" />, title: "Lightning Fast", desc: "Express delivery across 220+ countries" },
    { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, title: "Safe & Secure", desc: "Premium insurance and handling for every box" },
    { icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />, title: "Zero Paperwork", desc: "Simplified customs & automated documentation" },
  ];

  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] bg-yellow-300 overflow-hidden flex items-center pt-8 lg:pt-24 pb-8 lg:pb-0">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-red-700/5 skew-x-12 translate-x-32 hidden lg:block" />
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full border border-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              India's Most Trusted Export Partner
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl font-black leading-[0.9] text-gray-950 uppercase tracking-tighter"
            >
              Ship Worldwide <br />
              <span className="text-red-700 drop-shadow-sm">With Confidence</span>


            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-lg sm:text-2xl text-gray-800 max-w-xl mx-auto lg:mx-0 font-bold leading-tight"
            >
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-2">BGL Express – Fast & Secure Courier Services</h2>
              Smart, affordable international shipping built to help <span className="text-red-700">eCommerce brands</span> scale faster and reach global markets.
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {[
                { name: 'Domestic', path: '/services/domestic-courier' },
                { name: 'International', path: '/services/international-courier' },
                { name: 'Intercity', path: '/services/domestic-courier' }
              ].map((item) => (
                <Link key={item.name} to={item.path}>
                  <span className="px-8 py-2.5 bg-black/90 text-yellow-400 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-110 hover:bg-red-700 hover:text-white transition-all cursor-pointer inline-block">
                    {item.name}
                  </span>
                </Link>
              ))}
            </motion.div>

            {/* LIVE TRACKING BAR */}
            <motion.div
              variants={itemVariants}
              className="mt-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="relative group p-1 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-2xl focus-within:bg-white/40 transition-all">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = e.target.trackingId.value;
                    if (val) window.location.href = `/tracking?id=${val.toUpperCase()}`;
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      name="trackingId"
                      type="text"
                      placeholder="ENTER TRACKING ID / AWB..."
                      className="w-full pl-14 pr-4 py-5 bg-white rounded-[1.8rem] font-black uppercase text-sm tracking-widest text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-red-700 text-white px-8 py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-red-800 transition-all active:scale-95 whitespace-nowrap"
                  >
                    Track Now
                  </button>
                </form>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mt-4 ml-6 flex items-center gap-2">
                <Package className="w-3 h-3" />
                Track both Domestic & International shipments
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 font-black uppercase tracking-tight text-gray-900">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl text-red-700">🌍</span>
                <span className="text-lg">25,000+</span>
                <span className="text-[10px] text-gray-600 tracking-widest">Exporters</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-y sm:border-y-0 sm:border-x border-black/10 py-4 sm:py-0">
                <span className="text-3xl text-red-700">📦</span>
                <span className="text-lg">1 Crore+</span>
                <span className="text-[10px] text-gray-600 tracking-widest">Orders Shipped</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-3xl text-red-700">✈️</span>
                <span className="text-lg">220+</span>
                <span className="text-[10px] text-gray-600 tracking-widest">Countries</span>
              </div>
              <br />
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT (VISUAL BOARD) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/50 shadow-2xl">
              <div className="absolute top-[-40px] right-[-20px] w-48 md:w-64 animate-float hidden md:block">
                <img src={Plane} alt="BGL Plane" className="w-full drop-shadow-2xl" />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter">Why Choose <span className="text-red-700">BGL?</span></h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    <div className="w-3 h-3 rounded-full bg-black" />
                  </div>
                </div>

                <div className="space-y-4">
                  {featureCards.map((card, i) => (
                    <Link
                      key={i}
                      to={i === 0 ? "/features/fast-transit" : i === 1 ? "/features/secure-packaging" : "/services/customs-clearance"}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.8)" }}
                        className="flex items-start gap-4 p-5 bg-white/60 rounded-[2rem] border border-white transition-all cursor-pointer shadow-sm group"
                      >
                        <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100 group-hover:bg-red-50 transition-colors">
                          {card.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-950 uppercase text-sm tracking-tight">{card.title}</h4>
                          <p className="text-xs text-gray-600 font-bold leading-relaxed">{card.desc}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="pt-6">
                  <Link to="/login" className="block w-full">
                    <button className="w-full bg-red-600 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-red-600/30 hover:bg-red-700 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Globe2 className="w-5 h-5" />
                      Start Global Shipping
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl -z-10" />
            <div className="absolute top-1/2 -right-10 w-48 h-48 bg-black/5 rounded-full blur-3xl -z-10" />
          </motion.div>

        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
