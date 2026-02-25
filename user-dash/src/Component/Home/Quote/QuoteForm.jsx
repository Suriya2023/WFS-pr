export default function QuoteForm() {
    return (
        <form className="bg-white p-8 sm:p-10 rounded-xl shadow-xl space-y-6">
            <h3 className="text-3xl font-black mb-8 text-gray-900 uppercase tracking-tighter">
                Explore <span className="text-red-600">Pricing</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                <input type="text" placeholder="Last Name" className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                <input type="email" placeholder="Email" className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                <input type="text" placeholder="Phone" className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                <input type="text" placeholder="Origin City" className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold" />
                <select className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold text-gray-500">
                    <option>Destination Country</option>
                </select>
            </div>

            <div className="space-y-4">
                <select className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold text-gray-500">
                    <option>Select Your Business Category</option>
                </select>
                <select className="border border-yellow-200 bg-yellow-50/30 rounded-xl p-4 w-full focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-bold text-gray-500">
                    <option>Average Monthly Volume?</option>
                </select>
            </div>

            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Your registration is subject to our <span className="text-red-600 underline cursor-pointer">Terms & Conditions</span> and <span className="text-red-600 underline cursor-pointer">Privacy Policy</span>.
            </p>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                Already have an account? <span className="text-red-600 underline cursor-pointer ml-1">Login</span>
            </p>

            <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all duration-300 shadow-xl shadow-red-500/30 transform active:scale-95">
                Start Shipping Now
            </button>
        </form>
    );
}
