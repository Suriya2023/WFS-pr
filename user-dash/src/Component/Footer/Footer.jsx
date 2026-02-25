import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Facebook,
    Youtube,
    Instagram,
    Linkedin,
    X,
    Phone,
    Mail,
    Globe,
    Truck,
} from "lucide-react";

import logo from "../../assets/bglLogo.png";
import plane from "../../assets/plane.png";

export default function Footer() {
    const navigate = useNavigate();

    const socialLinks = [
        { icon: Facebook, href: "#" },
        { icon: Youtube, href: "#" },
        { icon: Instagram, href: "#" },
        { icon: X, href: "#" },
        { icon: Linkedin, href: "#" },
    ];

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-6 md:px-20 pt-28 pb-12">

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 blur-3xl rounded-full" />
                <div className="absolute top-1/3 -right-32 w-96 h-96 bg-yellow-500/10 blur-3xl rounded-full" />
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 mb-24 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-8 shadow-2xl"
            >
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Powering Global Trade with Smart Courier Solutions
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Express pickup • Worldwide delivery • Export-focused logistics
                    </p>
                </div>

                <button className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-10 py-4 font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition">
                    Join Exporter Network
                </button>
            </motion.div>

            <motion.img
  src={plane}
  alt="plane"
  style={{
//   rotate: 180,
  transformOrigin: "center",
  opacity: 0.7,
}}

  className="
    hidden md:block
    w-48
    absolute
    bottom-10
    left-[-300px]
    opacity-80
    pointer-events-none
    z-20
  "
  animate={{
    x: [0, window.innerWidth + 600],
  }}
  transition={{
    repeat: Infinity,
    duration: 18,
    ease: "linear",
  }}
/>


    



            {/* Footer Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-16 text-gray-300">

                {/* Brand */}
                <div>
                    <img
                        src={logo}
                        alt="SR Logistics"
                        onClick={() => navigate("/")}
                        className="w-44 mb-6 cursor-pointer"
                    />

                    <p className="text-sm leading-7">
                        Trusted courier & logistics partner for exporters. We specialize in
                        international shipping, customs clearance, and time-critical
                        deliveries across 220+ countries.
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                            <Globe size={14} /> Worldwide Express Network
                        </p>
                        <p className="flex items-center gap-2">
                            <Truck size={14} /> PAN India Pickup & Last-Mile
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6">
                        {socialLinks.map(({ icon: Icon }, i) => (
                            <motion.a
                                whileHover={{ y: -455 }}
                                key={i}
                                href="#"
                                className="p-2 rounded-xl bg-white/10 hover:bg-red-600 transition"
                            >
                                <Icon size={18} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-lg font-black mb-6 border-b border-red-600 pb-2 inline-block">
                        Services
                    </h3>
                    <ul className="space-y-3 text-sm">
                        {[
                            "International Courier",
                            "Export Documentation",
                            "E-commerce Shipping",
                            "Customs Clearance",
                        ].map((item) => (
                            <li
                                key={item}
                                className="hover:text-white transition cursor-pointer"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-lg font-black mb-6 border-b border-red-600 pb-2 inline-block">
                        Company
                    </h3>
                    <ul className="space-y-3 text-sm">
                        {["About Us", "Why Choose Us", "Tracking", "Careers"].map((item) => (
                            <li
                                key={item}
                                className="hover:text-white transition cursor-pointer"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-black mb-6 border-b border-red-600 pb-2 inline-block">
                        Contact
                    </h3>
                    <p className="flex items-center gap-3 text-sm mb-4 hover:text-red-500 transition cursor-pointer">
                        <Phone size={16} /> +91 9510190352
                    </p>
                    <p className="flex items-center gap-3 text-sm hover:text-red-500 transition cursor-pointer">
                        <Mail size={16} /> srrajput@srlogistick.in
                    </p>
                </div>
            </div>

            {/* Bottom */}
            <p className="relative z-10 mt-24 text-center text-xs text-gray-400 tracking-wide">
                © 2025 SR Logistics Express Pvt. Ltd. | Global Courier & Export Logistics
            </p>
        </footer>
    );
}
