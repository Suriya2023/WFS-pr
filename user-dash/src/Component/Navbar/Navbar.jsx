import React, { useState, useEffect } from "react";
import logo from "../../assets/bglLogo.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { X, Menu, Info, Phone, Users, BookOpen, MapPin, Globe, LogIn } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About Us", path: "/about", icon: <Info className="w-5 h-5" /> },
    { name: "Contact Us", path: "/contact", icon: <Phone className="w-5 h-5" /> },
    { name: "Become a Partner", path: "/franchise", icon: <Users className="w-5 h-5" /> },
    { name: "Blog & Updates", path: "/blogs", icon: <BookOpen className="w-5 h-5" /> },
    { name: "Shipment Tracking", path: "/tracking", icon: <MapPin className="w-5 h-5" /> },
    { name: "Ship Worldwide", path: "/ship-worldwide", icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <header
      className={`w-full bg-yellow-300 z-50 transition-all duration-300 ${isSticky ? "fixed top-0 shadow-xl py-2" : "relative py-4"}`}
    >
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="BGL Express"
            onClick={() => navigate("/")}
            className="w-35 sm:w-56 lg:w-64 cursor-pointer object-contain transition-transform hover:scale-105 active:scale-95"
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden xl:flex items-center gap-6 2xl:gap-8 font-black uppercase text-red-700">
          {navItems.map((item) => (
            <li key={item.name} className="relative group">
              <Link
                to={item.path}
                className={`hover:text-gray-900 transition-colors text-[12px] 2xl:text-sm tracking-tighter ${location.pathname === item.path ? "text-gray-900" : ""}`}
              >
                {item.name}
              </Link>
              <span className={`absolute left-0 -bottom-1 h-[3px] bg-red-600 transition-all duration-300 ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}`} />
            </li>
          ))}
        </ul>

        {/* DESKTOP CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Customer Login
          </button>
        </div>

        {/* MOBILE MENU BUTTON & LOGIN */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={() => navigate("/login")}
            className="p-2.5 bg-red-600 text-white rounded-xl shadow-lg"
          >
            <LogIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="p-2.5 bg-white/50 rounded-xl hover:bg-white transition-colors"
          >
            <Menu className="w-6 h-6 text-red-700" />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Logo" className="w-32" />
          <button
            onClick={() => setOpen(false)}
            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase text-sm transition-all ${location.pathname === item.path ? "bg-red-600 text-white shadow-lg shadow-red-200" : "text-red-700 hover:bg-yellow-50"}`}
            >
              <span className={location.pathname === item.path ? "text-white" : "text-red-500"}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => { navigate("/login"); setOpen(false); }}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-red-500/30 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Customer Login
          </button>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
            BGL Express © 2026 • Fast. Secure. Global.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;