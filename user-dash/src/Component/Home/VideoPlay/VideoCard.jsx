import { useState } from "react";
import PlayButton from "./PlayButton";
import Img1 from "../../../assets/Uploads/tham.jpg";

const VideoCard = ({ videoId = "3LRZRSIh_KE" }) => {
  const [play, setPlay] = useState(false);

  return (
    <div className="bg-black rounded-3xl p-4 md:p-6 w-full">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
        {!play ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setPlay(true)}
          >
            <img
              loading="lazy"
              decoding="async"
              src={Img1}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <PlayButton />
            </div>
          </div>
        ) : (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
