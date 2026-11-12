import { useState } from "react";
import { Sparkles, Compass, Flame } from "lucide-react";
import { MOOD_CATEGORIES, GENRE_CATEGORIES, FALLBACK_AUDIO_TRACKS } from "../../data/mockData";
import { MoodCard } from "../cards/MoodCard";
import { GenreCard } from "../cards/GenreCard";
import { MusicCard } from "../cards/MusicCard";
import { usePlayer } from "../../context/PlayerContext";

export const ExplorePage = ({ onSelectGenre }) => {
  const { playTrack } = usePlayer();
  const [activeMoodFilter, setActiveMoodFilter] = useState(null);

  const filteredTracks = activeMoodFilter
    ? FALLBACK_AUDIO_TRACKS.filter(t => t.mood?.toLowerCase() === activeMoodFilter.id)
    : FALLBACK_AUDIO_TRACKS;

  const handleMoodSelect = (mood) => {
    setActiveMoodFilter(mood);
    const matches = FALLBACK_AUDIO_TRACKS.filter(t => t.mood?.toLowerCase() === mood.id);
    if (matches.length > 0) {
      playTrack(matches[0], matches);
    }
  };

  return (
    <div className="melodify-explore-page">
      {/* Explore Hero Banner */}
      <div className="explore-hero-card">
        <div className="explore-glow-orb" />
        <div className="explore-hero-inner">
          <div className="explore-badge">
            <Compass size={15} className="text-cyan-400" />
            <span>DISCOVERY RADAR</span>
          </div>
          <h1>Explore Sonic Worlds</h1>
          <p>
            Traverse emotive soundscapes, tune into curated vibe stations, and dive into algorithmic frequencies.
          </p>
        </div>
      </div>

      {/* 1. Mood-Based Music Discovery Section */}
      <section className="explore-section">
        <div className="section-title-wrap">
          <div className="title-row">
            <Sparkles size={20} className="text-violet-400" />
            <h2>Mood Discovery Stations</h2>
          </div>
          <p className="subtitle">Choose a mood to align your emotional frequency and stream matching tracks</p>
        </div>

        <div className="mood-cards-masonry">
          {MOOD_CATEGORIES.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onSelect={handleMoodSelect}
            />
          ))}
        </div>
      </section>

      {/* Currently Active Mood Stream Preview */}
      {activeMoodFilter && (
        <section className="explore-section active-mood-section">
          <div className="active-mood-header">
            <div>
              <span className="mood-stream-tag">LIVE VIBE STATION</span>
              <h3>Now Streaming: {activeMoodFilter.name}</h3>
              <p>{activeMoodFilter.tagline}</p>
            </div>
            <button
              className="clear-mood-filter-btn"
              onClick={() => setActiveMoodFilter(null)}
            >
              Reset Filter
            </button>
          </div>

          <div className="active-mood-tracks-grid">
            {filteredTracks.map((track) => (
              <MusicCard key={track.id} track={track} queue={filteredTracks} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Genre Categories */}
      <section className="explore-section">
        <div className="section-title-wrap">
          <div className="title-row">
            <Flame size={20} className="text-pink-400" />
            <h2>Sound Architecture & Genres</h2>
          </div>
          <p className="subtitle">Signature electronic subgenres and classic acoustic landscapes</p>
        </div>

        <div className="genre-cards-grid">
          {GENRE_CATEGORIES.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              onSelect={onSelectGenre}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
