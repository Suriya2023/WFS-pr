const PromoContent = () => {
  return (
    <div className="text-white">
      <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-tight">
        Real Sellers. <br /><span className="text-red-600">Real Wins.</span>
      </h2>

      <p className="text-lg mt-4 ">
        Global growth isn’t luck—it’s logistics that work.
      </p>

      <p className="text-lg mt-3 ">
        Make every order a step toward bigger markets and better margins.
      </p>

      <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 mt-8 text-xl font-black rounded-2xl shadow-xl shadow-red-500/20 transition-all duration-300 uppercase tracking-widest transform active:scale-95">
        Sign-Up For Free
      </button>
    </div>
  );
};

export default PromoContent;
