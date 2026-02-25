import React, { useState, useEffect } from "react";
import logo from "../../assets/bglLogo.png";
import { useNavigate, Link } from "react-router-dom";
import { X, Menu } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Franchise", path: "/franchise" },
    { name: "Blogs", path: "/blogs" },
    { name: "Tracking", path: "/tracking" },
    { name: "Login", path: "/login" },
    // { name: "Signup", path: "/register" }
  ];

  return (
    <header
      className={`w-full bg-yellow-300 border-b border-yellow-200 z-50 transition-all ${isSticky ? "fixed top-0 shadow-lg" : "relative"}`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* LOGO */}
        <img
          src={logo}
          alt="BGL Express"
          onClick={() => navigate("/")}
          className="w-28 sm:w-36 cursor-pointer"
        />

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-10 font-bold uppercase text-red-700">
          {navItems.map((item) => (
            <li key={item.name} className="relative group">
              <Link to={item.path} className="hover:text-red-600">
                {item.name}
              </Link>
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-red-600 scale-x-0 group-hover:scale-x-100 transition" />
            </li>
          ))}
        </ul>

        {/* DESKTOP CTA */}
        <button className="hidden lg:block bg-red-600 text-white px-6 py-3 rounded-xl font-black shadow hover:bg-red-700 transition">
          Ship Now
        </button>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Menu className="w-8 h-8 text-red-700" />
        </button>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 flex flex-col transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="self-end text-red-600"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="mt-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="text-xl font-black uppercase text-red-700"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button onClick={() => window.location.href = "/login"} className="mt-auto bg-red-600 text-white py-4 rounded-xl font-black shadow">
          Ship Now
        </button>
      </div>
    </header>
  );
}

export default Navbar;