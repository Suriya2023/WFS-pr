import React, { useState } from "react";
import Plane from "../../../assets/plane.png";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    originCity: "",
    destinationCountry: "",
    businessCategory: "",
    monthlyVolume: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none";

  return (
    <section className="relative bg-yellow-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 text-center lg:text-left">
            {/* PLANE IMAGE (TOP ON MOBILE/TABLET) */}
            <img
              src={Plane}
              alt="Plane"
              className="mx-auto lg:mx-0 w-full max-w-xs sm:max-w-sm md:max-w-md drop-shadow-2xl"
            />

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              International Shipping <br />
              for{' '}
              <span className="text-red-600 underline decoration-yellow-400 decoration-8 underline-offset-4">
                your business
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
              Affordable, reliable international logistics built for
              <span className="text-red-600 font-semibold"> eCommerce brands</span>
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <div><b>25,000+</b> Exporters</div>
              <div><b>1 Crore+</b> Orders</div>
              <div><b>220+</b> Countries</div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-6 uppercase tracking-tight text-center lg:text-left">
              Explore <span className="text-red-600">Pricing</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" className={inputClass} onChange={handleChange} />
                <input name="lastName" placeholder="Last Name" className={inputClass} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="email" name="email" placeholder="Email" className={inputClass} onChange={handleChange} />
                <input type="tel" name="phone" placeholder="Phone" className={inputClass} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="originCity" placeholder="Origin City" className={inputClass} onChange={handleChange} />
                <select name="destinationCountry" className={inputClass} onChange={handleChange}>
                  <option value="">Destination Country</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>

              <select name="businessCategory" className={inputClass} onChange={handleChange}>
                <option value="">Business Category</option>
                <option>Fashion</option>
                <option>Electronics</option>
                <option>Food</option>
              </select>

              <select name="monthlyVolume" className={inputClass} onChange={handleChange}>
                <option value="">Monthly Volume</option>
                <option>0–100 Orders</option>
                <option>100–500 Orders</option>
                <option>500–1000 Orders</option>
                <option>1000+ Orders</option>
              </select>

              <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-xl transition active:scale-95">
                Start Shipping
              </button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our <span className="text-red-600">Terms</span> &{' '}
                <span className="text-red-600">Privacy Policy</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
