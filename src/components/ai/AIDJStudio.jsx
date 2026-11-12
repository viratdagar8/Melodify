import { useState } from "react";
import {
  Radio,
  Sparkles,
  Play,
  RotateCw,
  Zap,
  CheckCircle2
} from "lucide-react";
import { MOOD_CATEGORIES, FALLBACK_AUDIO_TRACKS } from "../../data/mockData";
import { usePlayer } from "../../context/PlayerContext";

export const AIDJStudio = () => {
  const { playTrack } = usePlayer();

  const [selectedMood, setSelectedMood] = useState("energetic");
  const [energyLevel, setEnergyLevel] = useState(75);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedMix, setGeneratedMix] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep("Analyzing acoustic profile for mood...");

    setTimeout(() => {
      setGenerationStep("Harmonizing beats & tempo matching...");
    }, 700);

    setTimeout(() => {
      setGenerationStep("Cross-fading studio transition curves...");
    }, 1400);

    setTimeout(() => {
      // Pick tracks that align with mood or random curated slice
      const matchingMood = MOOD_CATEGORIES.find(m => m.id === selectedMood);
      const filtered = FALLBACK_AUDIO_TRACKS.filter(t => t.mood?.toLowerCase() === selectedMood);
      const finalTracks = filtered.length >= 3 ? filtered : [
        ...filtered,
        ...FALLBACK_AUDIO_TRACKS.slice(0, 5 - filtered.length)
      ];

      setGeneratedMix({
        title: `${matchingMood?.name || "AI"} Energy Studio Mix`,
        mood: matchingMood?.name,
        energy: energyLevel,
        trackCount: finalTracks.length,
        duration: "18 mins",
        tracks: finalTracks
      });
      setIsGenerating(false);
      setGenerationStep("");
    }, 2000);
  };

  const handlePlayAll = () => {
    if (generatedMix && generatedMix.tracks.length > 0) {
      playTrack(generatedMix.tracks[0], generatedMix.tracks);
    }
  };

  return (
    <div className="aidj-studio-page">
      {/* Studio Header */}
      <div className="studio-hero-header">
        <div className="studio-header-pill">
          <Radio size={15} className="pulse-icon text-violet-400" />
          <span>NEURAL AUDIO WORKSTATION</span>
        </div>
        <h1 className="studio-title">Your Personal AI DJ</h1>
        <p className="studio-subtitle">
          Select your target emotional frequency, adjust the energy dial, and let the AI DJ curate seamless harmonic transitions.
        </p>
      </div>

      {/* Futuristic DJ Control Deck */}
      <div className="dj-deck-console">
        <div className="deck-control-row">
          {/* Energy Slider */}
          <div className="deck-knob-container">
            <div className="deck-knob-header">
              <Zap size={16} className="text-yellow-400" />
              <span className="knob-label">Energy Level ({energyLevel}%)</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="studio-slider"
            />
            <div className="knob-ticks">
              <span>Ambient</span>
              <span>Balanced</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="deck-action-wrapper">
            <button
              className={`generate-dj-btn ${isGenerating ? "generating" : ""}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RotateCw size={18} className="animate-spin" />
                  <span>Synthesizing Set...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate My Playlist</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time synthesis status notice */}
        {isGenerating && (
          <div className="synthesis-status-box">
            <div className="synthesis-spinner" />
            <span className="synthesis-text">{generationStep}</span>
          </div>
        )}
      </div>

      {/* Mood Selection Cards */}
      <div className="studio-mood-section">
        <h3 className="studio-section-title">Select Desired Mood</h3>
        <div className="mood-cards-grid">
          {MOOD_CATEGORIES.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <div
                key={m.id}
                className={`studio-mood-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedMood(m.id)}
              >
                <div
                  className="mood-card-bg"
                  style={{ backgroundImage: `url(${m.image})` }}
                />
                <div
                  className="mood-card-gradient"
                  style={{ background: m.bgGradient }}
                />

                <div className="mood-card-inner">
                  <div className="mood-title-row">
                    <span className="mood-label">{m.name}</span>
                    {isSelected && (
                      <CheckCircle2 size={18} className="selected-check" />
                    )}
                  </div>
                  <p className="mood-short-desc">{m.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Setlist Output */}
      {generatedMix && (
        <div className="generated-mix-container">
          <div className="mix-banner">
            <div className="mix-banner-info">
              <span className="mix-pill">CUSTOM DJ MIX · {generatedMix.mood}</span>
              <h2>{generatedMix.title}</h2>
              <p>
                {generatedMix.trackCount} seamless tracks · Dynamic energy level {generatedMix.energy}%
              </p>
            </div>

            <button className="mix-play-all-btn" onClick={handlePlayAll}>
              <Play size={20} className="fill-current text-white translate-x-0.5" />
              <span>Play DJ Mix</span>
            </button>
          </div>

          <div className="mix-track-list">
            {generatedMix.tracks.map((track, idx) => (
              <div
                key={track.id}
                className="mix-track-row"
                onClick={() => playTrack(track, generatedMix.tracks)}
              >
                <span className="mix-track-idx">{idx + 1}</span>
                <img src={track.image} alt={track.title} className="mix-track-art" />
                <div className="mix-track-meta">
                  <h4>{track.title}</h4>
                  <p>{track.artist} · {track.genre || "Electronic"}</p>
                </div>
                <div className="mix-track-actions">
                  <button className="mix-row-play-btn">
                    <Play size={16} className="fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
