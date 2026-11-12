import { useState } from "react";
import { Sparkles, Radio, Flame } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const HeroSection = ({ onNavigateAIDJ, onNavigateExplore }) => {
  const { currentTrack, isPlaying } = usePlayer();

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 5) return "Good night, night owl";
    if (hour < 12) return "Good morning, music lover";
    if (hour < 18) return "Good afternoon, music lover";
    return "Good evening, music lover";
  });

  return (
    <section className="hero-banner">
      <div className="hero-backdrop-glow" />
      <div className="hero-grid-pattern" />

      <div className="hero-content">
        <div className="hero-tag-badge">
          <Sparkles size={14} className="hero-sparkle-icon" />
          <span>MELODIFY AI AUDIO ENGINE · v2.4</span>
        </div>

        <p className="hero-greeting">{greeting}</p>
        <h1 className="hero-heading">
          Your Sound. <span className="hero-heading-gradient">Your World.</span>
        </h1>
        <p className="hero-subtitle">
          Discover music that matches your mood, curated by intelligent neural audio modeling.
        </p>

        <div className="hero-actions">
          <button
            className="hero-primary-btn"
            onClick={onNavigateAIDJ}
          >
            <Radio size={19} className="pulse-icon" />
            <span>Launch AI DJ Studio</span>
          </button>

          <button
            className="hero-secondary-btn"
            onClick={onNavigateExplore}
          >
            <Flame size={18} className="text-pink-400" />
            <span>Explore Mood Stations</span>
          </button>
        </div>

        {/* Quick Vibe Tags */}
        <div className="hero-vibe-chips">
          <span className="vibe-label">Trending vibes:</span>
          {["Cyberpunk 2077", "Deep Neural Flow", "Midnight Lo-Fi", "Acoustic Sunset"].map((vibe) => (
            <span key={vibe} className="vibe-chip">
              #{vibe}
            </span>
          ))}
        </div>
      </div>

      {/* Futuristic Floating Visual Card */}
      <div className="hero-visual-container">
        <div className="hero-spinning-disc-card">
          <div className="disc-glow-ring" />
          <div className={`disc-vinyl ${isPlaying ? "spinning" : ""}`}>
            <div className="disc-center-label">
              <img src="/logo.jpg" alt="Logo" className="disc-logo-img" />
            </div>
          </div>
          <div className="disc-floating-info">
            <span className="disc-now-playing-tag">
              {isPlaying ? "NOW STREAMING" : "FEATURED TRACK"}
            </span>
            <p className="disc-title">{currentTrack?.title || "Neon Horizon"}</p>
            <p className="disc-artist">{currentTrack?.artist || "Aura Nova"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
