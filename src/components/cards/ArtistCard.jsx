import { Play, CheckCircle } from "lucide-react";

export const ArtistCard = ({ artist, onSelect }) => {
  if (!artist) return null;

  return (
    <div className="artist-card group" onClick={() => onSelect && onSelect(artist)}>
      <div className="artist-avatar-wrapper">
        <img
          src={artist.image}
          alt={artist.name}
          className="artist-avatar"
          loading="lazy"
        />
        <div className="artist-overlay">
          <button className="artist-play-btn" aria-label={`Play ${artist.name}`}>
            <Play size={20} className="fill-current text-white translate-x-0.5" />
          </button>
        </div>
      </div>

      <div className="artist-info">
        <div className="artist-name-row">
          <h4 className="artist-name">{artist.name}</h4>
          {artist.verified && (
            <CheckCircle size={14} className="verified-badge text-cyan-400" />
          )}
        </div>
        <p className="artist-type">{artist.genre || "Artist"}</p>
        <span className="artist-listeners">{artist.monthlyListeners || "1.2M"} listeners</span>
      </div>
    </div>
  );
};
