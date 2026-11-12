import { Play, Pause, Heart } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const MusicCard = ({ track, queue = [] }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, toggleLike, isLiked } = usePlayer();

  if (!track) return null;

  const isCurrentTrack = currentTrack?.id === track.id;
  const isThisPlaying = isCurrentTrack && isPlaying;
  const liked = isLiked(track.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, queue.length > 0 ? queue : [track]);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "3:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`music-card group ${isCurrentTrack ? "active-playing" : ""}`}
      onClick={handlePlayClick}
    >
      <div className="card-artwork-wrapper">
        <img
          src={track.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80"}
          alt={track.title}
          className="card-artwork"
          loading="lazy"
        />

        {/* Hover overlay with action buttons */}
        <div className="card-overlay">
          <button
            className={`card-play-btn ${isThisPlaying ? "playing" : ""}`}
            onClick={handlePlayClick}
            aria-label={isThisPlaying ? "Pause" : "Play"}
          >
            {isThisPlaying ? (
              <Pause size={20} className="fill-current text-white" />
            ) : (
              <Play size={20} className="fill-current text-white translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Playing equalizer indicator */}
        {isThisPlaying && (
          <div className="playing-bars">
            <span className="bar bar-1"></span>
            <span className="bar bar-2"></span>
            <span className="bar bar-3"></span>
          </div>
        )}

        {/* Like Button */}
        <button
          className={`card-like-btn ${liked ? "is-liked" : ""}`}
          onClick={handleLikeClick}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart size={16} fill={liked ? "#b81840" : "none"} color={liked ? "#b81840" : "#fff"} />
        </button>
      </div>

      <div className="card-info">
        <h4 className="track-title" title={track.title}>
          {track.title}
        </h4>
        <div className="track-meta">
          <span className="track-artist" title={track.artist}>
            {track.artist}
          </span>
          <span className="track-duration">
            {formatDuration(track.duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
