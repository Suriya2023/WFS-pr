import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Globe, Box, Truck, Heart, Zap, Shield } from "lucide-react";

// Import premium images
import h1 from "../../../assets/Uploads/h1.png";
import h2 from "../../../assets/Uploads/h2.png";
import h4 from "../../../assets/Uploads/h4.png";
import h5 from "../../../assets/Uploads/h5.png";

// Import new Transport Assets
import PlaneImg from "../../../assets/plane.png";
import VanImg from "../../../assets/van.png";
import CarImg from "../../../assets/car.png";
import BikeImg from "../../../assets/bike.png";

export default function ServiceTabs() {
    const services = [
        {
            id: "marketplaces",
            title: "Global E-Com Hub",
            icon: <Globe className="w-3.5 h-3.5" />,
            img: h5,
            transport: PlaneImg,
            content: {
                badge: "Marketplace Integration",
                heading: "Dominate Global Marketplaces",
                desc: "We bridge the gap between your inventory and the world's largest customer bases. Our automated API ecosystem syncs directly with Amazon, eBay, and Etsy.",
                features: [
                    { title: "Smart Sync", detail: "Real-time inventory mapping", icon: <Zap className="w-3 h-3" /> },
                    { title: "Compliance", detail: "Automated HS Code classification", icon: <Shield className="w-3 h-3" /> }
                ],
                cta: "Integrate Now"
            },
        },
        {
            id: "dropshipping",
            title: "D2C Engine",
            icon: <Box className="w-3.5 h-3.5" />,
            img: h2,
            transport: VanImg,
            content: {
                badge: "D2C Optimization",
                heading: "Direct-to-Consumer at Scale",
                desc: "Turn your local brand into a global titan. From white-label packaging to lightning-fast last-mile delivery, we handle the logistics while you build the brand.",
                features: [
                    { title: "White Label", detail: "Custom branding and packaging", icon: <Shield className="w-3 h-3" /> },
                    { title: "Global Reach", detail: "Ship to 220+ countries instantly", icon: <Globe className="w-3 h-3" /> }
                ],
                cta: "Start Shipping"
            },
        },
        {
            id: "b2b",
            title: "Enterprise B2B",
            icon: <Truck className="w-3.5 h-3.5" />,
            img: h4,
            transport: CarImg,
            content: {
                badge: "Bulk Logistics",
                heading: "Industrial Bulk Transit",
                desc: "Enterprise-grade freight solutions designed for reliability. We provide dedicated sea/air lanes and tier-1 contract rates for major commercial shipments.",
                features: [
                    { title: "Tier-1 Rates", detail: "Maximum cost efficiency at scale", icon: <Zap className="w-3 h-3" /> },
                    { title: "Priority Lane", detail: "Dedicated commercial customs", icon: <Shield className="w-3 h-3" /> }
                ],
                cta: "Book Bulk Cargo"
            },
        },
        {
            id: "overseas",
            title: "Personal Plus",
            icon: <Heart className="w-3.5 h-3.5" />,
            img: h1,
            transport: BikeImg,
            content: {
                badge: "Priority Personal",
                heading: "Priority Personal Courier",
                desc: "Effortlessly send joy to your loved ones across borders. Our secure, door-to-door network ensures your personal parcels arrive with the care they deserve.",
                features: [
                    { title: "Doorstep Pickup", detail: "Convenient local collection", icon: <Truck className="w-3 h-3" /> },
                    { title: "Impact Tracking", detail: "Real-time updates at every stage", icon: <Zap className="w-3 h-3" /> }
                ],
                cta: "Send Parcel"
            },
        },
    ];

    const [activeService, setActiveService] = useState("marketplaces");
    const activeData = services.find(s => s.id === activeService);

    return (
        <section className="relative w-full py-10 md:py-20 bg-gradient-to-b from-[#FFEA00] to-[#FFD500] overflow-hidden">
            {/* BACKGROUND DYNAMICS - Refined Professional Layout */}
            <div className="absolute inset-0 max-w-[1600px] mx-auto pointer-events-none overflow-hidden z-0 px-4">
                {/* Refined Kinetic Typography */}
                <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-[900] text-black/[0.03] uppercase leading-none select-none tracking-widest whitespace-nowrap">
                    GLOBAL LOGISTICS
                </h2>

                {/* Subtile Geometric Accents */}
                <div className="absolute top-0 right-0 w-1/4 h-full bg-white/[0.1] -skew-x-12 translate-x-1/4 hidden md:block" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent" />
            </div>

            {/* DYNAMIC TRANSPORT ASSET (Floats based on active session) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService + "-transport"}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute top-[5%] md:top-[10%] right-[-5%] md:right-[5%] w-32 md:w-64 lg:w-96 opacity-80 md:opacity-100"
                    >
                        <img
                            src={activeData.transport}
                            alt="Transportation"
                            className="w-full drop-shadow-2xl animate-float"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">

                {/* HEADER COMPOSITION - Compact & Professional */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 mb-8 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>Infrastructure Excellence</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] uppercase tracking-tight text-slate-900 leading-none">
                        Velocity <span className="text-red-700 italic">Engineered.</span>
                    </h2>
                    <p className="text-sm md:text-lg text-slate-800 font-medium max-w-xl opacity-80 mt-2">
                        Next-gen logistics solutions designed for speed, reliability, and global scale.
                    </p>
                </div>

                {/* TWO-COLUMN LAYOUT - Compact & Tighter */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

                    {/* LEFT: Service Navigation (Vertical on Desktop, Grid on Mobile) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-3">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            {services.map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => setActiveService(service.id)}
                                    className={`group relative flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-xl transition-all duration-300 border
                                        ${activeService === service.id
                                            ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]"
                                            : "bg-white/50 text-slate-800 border-white/40 hover:bg-white hover:scale-[1.01]"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${activeService === service.id ? "bg-red-600 text-white" : "bg-white text-slate-400 group-hover:text-slate-900"}`}>
                                        {service.icon}
                                    </div>
                                    <div className="flex flex-col items-start min-w-0">
                                        <span className="font-bold uppercase tracking-tight text-xs md:text-sm leading-tight text-left">
                                            {service.title}
                                        </span>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${activeService === service.id ? "text-gray-300" : "text-gray-500"}`}>
                                            Explore Route
                                        </span>
                                    </div>
                                    {activeService === service.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-gray-400 hidden md:block" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Content Display (Card) */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl overflow-hidden relative"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    {/* Image Section - Cleaner & Smaller */}
                                    <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-lg group">
                                        <div className="aspect-[4/3] bg-gray-100">
                                            <img
                                                src={activeData.img}
                                                alt={activeData.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[9px] font-bold text-white uppercase tracking-wider">
                                            BGL Certified
                                        </div>
                                    </div>

                                    {/* Text Content - Focused & Readable */}
                                    <div className="order-1 md:order-2 flex flex-col items-start text-left space-y-4">
                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {activeData.content.badge}
                                        </span>
                                        <h3 className="text-2xl md:text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
                                            {activeData.content.heading}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">
                                            {activeData.content.desc}
                                        </p>

                                        {/* Features List */}
                                        <div className="grid grid-cols-1 gap-3 w-full pt-2">
                                            {activeData.content.features.map((feat, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors">
                                                    <div className="p-2 bg-slate-50 text-slate-900 rounded-lg shrink-0">
                                                        {feat.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold uppercase text-slate-900">{feat.title}</h4>
                                                        <p className="text-[10px] text-gray-500 font-medium">{feat.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 w-full">
                                            <Link to="/login" className="block w-full">
                                                <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg">
                                                    <span>{activeData.content.cta}</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </section>
    );
}
