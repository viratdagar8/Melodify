import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  Play,
  Heart,
  Compass,
  X
} from "lucide-react";
import { searchTracks } from "../../api/jamendoApi";
import { usePlayer } from "../../context/PlayerContext";
import {
  POPULAR_ARTISTS,
  CURATED_PLAYLISTS,
  FALLBACK_AUDIO_TRACKS
} from "../../data/mockData";
import { MusicCard } from "../cards/MusicCard";
import { ArtistCard } from "../cards/ArtistCard";
import { PlaylistCard } from "../cards/PlaylistCard";

export const SearchPage = ({ initialQuery = "" }) => {
  const { playTrack, toggleLike, isLiked } = usePlayer();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'songs' | 'artists' | 'playlists'
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["Synthwave", "Cyberpunk", "Aura Nova", "Deep Focus"]);

  const trendingSearches = [
    "Synthwave", "Lo-Fi Beats", "Midnight Drive", "Kavinsky Waves",
    "Electronic Chill", "Focus Alpha Waves", "Summer Euphoria"
  ];

  // Perform search
  useEffect(() => {
    let isCancelled = false;

    const performSearch = async () => {
      if (!query.trim()) {
        setResults(FALLBACK_AUDIO_TRACKS);
        return;
      }

      setIsLoading(true);
      try {
        const tracks = await searchTracks(query, 24);
        if (!isCancelled) {
          setResults(tracks);
        }
      } catch (err) {
        console.warn("Search error fallback:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const handleSelectSearch = (term) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 5)]);
    }
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "3:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Filter items according to search query
  const matchingArtists = POPULAR_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.genre.toLowerCase().includes(query.toLowerCase())
  );

  const matchingPlaylists = CURATED_PLAYLISTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="melodify-search-page">
      {/* Search Input Banner */}
      <div className="search-hero-bar">
        <div className="search-input-wrapper">
          <Search size={22} className="search-input-icon text-violet-400" />
          <input
            type="text"
            className="search-large-input"
            placeholder="Search audio tracks, artists, moods, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="search-clear-btn"
              onClick={() => setQuery("")}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Tag Pills */}
        <div className="search-pill-tags">
          <span className="tags-label">Quick filter:</span>
          {["Synthwave", "Chill", "Lo-Fi", "Electronic", "Rock", "Pop", "Ambient"].map((tag) => (
            <button
              key={tag}
              className={`search-tag-chip ${query.toLowerCase() === tag.toLowerCase() ? "active" : ""}`}
              onClick={() => handleSelectSearch(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="search-tabs-row">
        {[
          { id: "all", label: "All Results" },
          { id: "songs", label: `Songs (${results.length})` },
          { id: "artists", label: `Artists (${matchingArtists.length})` },
          { id: "playlists", label: `Playlists (${matchingPlaylists.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`search-tab-pill ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recents & Trending when query is empty */}
      {!query.trim() && (
        <div className="search-discover-panel">
          {recentSearches.length > 0 && (
            <div className="search-sub-section">
              <div className="sub-section-header">
                <div className="sub-section-title">
                  <Clock size={16} className="text-violet-400" />
                  <h3>Recent Searches</h3>
                </div>
                <button className="clear-history-link" onClick={handleClearHistory}>
                  Clear History
                </button>
              </div>
              <div className="recent-chips-wrap">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    className="history-chip"
                    onClick={() => handleSelectSearch(term)}
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="search-sub-section">
            <div className="sub-section-title">
              <TrendingUp size={16} className="text-pink-400" />
              <h3>Trending Searches</h3>
            </div>
            <div className="trending-chips-wrap">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  className="trending-chip"
                  onClick={() => handleSelectSearch(term)}
                >
                  <TrendingUp size={12} className="text-pink-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {isLoading ? (
        <div className="search-loading-container">
          <div className="search-spinner" />
          <p>Querying Melodify audio stream database...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="search-empty-state">
          <Compass size={40} className="text-slate-600 mb-3" />
          <h3>No matching tracks found</h3>
          <p>Try searching for genres like "chill", "rock", "pop", or "electronic"</p>
        </div>
      ) : (
        <div className="search-results-content">
          {/* Top Result Card + Tracks Table */}
          {(activeTab === "all" || activeTab === "songs") && (
            <div className="search-top-results-grid">
              {/* Feature Top Match */}
              {results[0] && (
                <div
                  className="top-match-card"
                  onClick={() => playTrack(results[0], results)}
                >
                  <span className="top-match-badge">TOP MATCH</span>
                  <img
                    src={results[0].image}
                    alt={results[0].title}
                    className="top-match-art"
                  />
                  <h3 className="top-match-title">{results[0].title}</h3>
                  <p className="top-match-artist">
                    <span>{results[0].artist}</span>
                    <span className="top-match-source">{results[0].source}</span>
                  </p>
                  <button className="top-match-play-btn">
                    <Play size={20} className="fill-current text-white translate-x-0.5" />
                  </button>
                </div>
              )}

              {/* Songs List */}
              <div className="search-songs-list">
                <h3 className="list-heading">Tracks</h3>
                {results.slice(0, 6).map((track, i) => {
                  const liked = isLiked(track.id);
                  return (
                    <div
                      key={track.id}
                      className="search-track-row group"
                      onClick={() => playTrack(track, results)}
                    >
                      <span className="track-number">{i + 1}</span>
                      <div className="track-row-art-box">
                        <img src={track.image} alt={track.title} />
                        <button className="track-row-play">
                          <Play size={13} className="fill-current text-white translate-x-0.5" />
                        </button>
                      </div>

                      <div className="track-row-info">
                        <p className="row-title">{track.title}</p>
                        <span className="row-artist">{track.artist}</span>
                      </div>

                      <span className="track-row-source">{track.source}</span>

                      <button
                        className={`track-row-like ${liked ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                      >
                        <Heart size={16} fill={liked ? "#b81840" : "none"} color={liked ? "#b81840" : "currentColor"} />
                      </button>

                      <span className="track-row-duration">
                        {formatDuration(track.duration)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Grid of Songs */}
          {(activeTab === "all" || activeTab === "songs") && (
            <div className="search-grid-section">
              <h3 className="section-title">All Track Results</h3>
              <div className="songs-cards-grid">
                {results.map((track) => (
                  <MusicCard key={track.id} track={track} queue={results} />
                ))}
              </div>
            </div>
          )}

          {/* Artists Matches */}
          {(activeTab === "all" || activeTab === "artists") && matchingArtists.length > 0 && (
            <div className="search-grid-section">
              <h3 className="section-title">Artists</h3>
              <div className="artists-cards-grid">
                {matchingArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Playlists Matches */}
          {(activeTab === "all" || activeTab === "playlists") && matchingPlaylists.length > 0 && (
            <div className="search-grid-section">
              <h3 className="section-title">Playlists</h3>
              <div className="playlists-cards-grid">
                {matchingPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
