import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayButton from "./PlayButton";
// import Img1 from "../../../assets/Uploads/tham.jpg";
import Img1 from "../../../assets/Uploads/tham.png";

const VideoCard = ({ videoId = "Zdwv34nZucE" }) => {
  const [play, setPlay] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[3rem] bg-black">
      <AnimatePresence mode="wait">
        {!play ? (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-[16/9] w-full cursor-pointer group/vid"
            onClick={() => setPlay(true)}
          >
            {/* Visual Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-80 group-hover/vid:opacity-60 transition-opacity duration-500" />

            <img
              loading="lazy"
              src={Img1}
              alt="Success Story"
              className="w-full h-full object-cover transform scale-105 group-hover/vid:scale-110 transition-transform duration-1000"
            />

            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <PlayButton />
              </motion.div>
            </div>

            {/* Micro Metadata */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex items-center gap-3">
              <div className="px-3 py-1 bg-red-600 rounded-full text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest animate-pulse">
                Live Story
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[16/9] w-full"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&quality=hd1080`}
              title="Success Journey"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCard;
