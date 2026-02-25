import VideoCard from "./VideoCard";
import PromoContent from "./PromoContent";

const ExportSuccess = () => {
  return (
    <section className=" py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#0f172a] via-[#1e1e1e] to-black p-12 lg:flex items-center gap-14 border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />

        {/* Left Video */}
        <div className="w-full lg:w-1/2">
          <VideoCard videoId="Zdwv34nZucE" />
        </div>

        {/* Right Text */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <PromoContent />
        </div>
      </div>
    </section>
  );
};

export default ExportSuccess;
