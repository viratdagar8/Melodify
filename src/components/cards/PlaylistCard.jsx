import { Play, Music } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const PlaylistCard = ({ playlist, onSelect }) => {
  const { playTrack } = usePlayer();

  if (!playlist) return null;

  const handlePlayPlaylist = (e) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks);
    } else if (onSelect) {
      onSelect(playlist);
    }
  };

  return (
    <div
      className="playlist-card group"
      onClick={() => onSelect && onSelect(playlist)}
    >
      <div className="card-artwork-wrapper">
        <img
          src={playlist.image || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80"}
          alt={playlist.title}
          className="card-artwork"
          loading="lazy"
        />
        <div className="card-overlay">
          <button
            className="card-play-btn"
            onClick={handlePlayPlaylist}
            aria-label={`Play ${playlist.title}`}
          >
            <Play size={20} className="fill-current text-white translate-x-0.5" />
          </button>
        </div>
        <div className="track-count-badge">
          <Music size={12} />
          <span>{playlist.songCount || playlist.tracks?.length || 15} songs</span>
        </div>
      </div>

      <div className="card-info">
        <h4 className="playlist-title" title={playlist.title}>
          {playlist.title}
        </h4>
        <p className="playlist-desc" title={playlist.description}>
          {playlist.description || `Curated by ${playlist.creator || "Melodify AI"}`}
        </p>
      </div>
    </div>
  );
};
