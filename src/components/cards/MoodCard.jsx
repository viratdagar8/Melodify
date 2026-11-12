import { Sparkles, ArrowRight } from "lucide-react";

export const MoodCard = ({ mood, onSelect }) => {
  if (!mood) return null;

  return (
    <div
      className="mood-card group"
      onClick={() => onSelect && onSelect(mood)}
    >
      <div className="mood-background-image" style={{ backgroundImage: `url(${mood.image})` }} />
      <div className="mood-gradient-overlay" style={{ background: mood.bgGradient }} />

      <div className="mood-card-content">
        <div className="mood-header-pill">
          <Sparkles size={13} className="text-white/80" />
          <span>Vibe Station</span>
        </div>

        <div className="mood-bottom-info">
          <h3 className="mood-name">{mood.name}</h3>
          <p className="mood-tagline">{mood.tagline}</p>

          <button
            className="mood-explore-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(mood);
            }}
          >
            <span>Tune in</span>
            <ArrowRight size={14} className="explore-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};
