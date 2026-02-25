const PlayButton = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white/80 rounded-full p-6 shadow-lg">
        <svg width="35" height="35" viewBox="0 0 24 24" fill="#FF8A00">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      </div>
    </div>
  );
};

export default PlayButton;
