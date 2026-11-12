import { useState } from "react";
import {
  Heart,
  PlusSquare,
  Clock,
  Music2,
  Play,
  Users,
  ArrowUpDown,
  Search
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";
import { FALLBACK_AUDIO_TRACKS, POPULAR_ARTISTS, CURATED_PLAYLISTS } from "../../data/mockData";
import { MusicCard } from "../cards/MusicCard";
import { PlaylistCard } from "../cards/PlaylistCard";
import { ArtistCard } from "../cards/ArtistCard";

export const LibraryPage = ({ onOpenCreatePlaylist }) => {
  const {
    likedTrackIds,
    recentlyPlayed,
    userPlaylists,
    playTrack,
    toggleLike
  } = usePlayer();

  const [activeTab, setActiveTab] = useState("liked"); // 'liked' | 'playlists' | 'recent' | 'artists'
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("recent"); // 'recent' | 'title' | 'artist'

  // Get liked songs track list
  const likedSongs = FALLBACK_AUDIO_TRACKS.filter(t => likedTrackIds.has(t.id));

  const handlePlayLikedAll = () => {
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "3:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Sort helper
  const sortTracks = (list) => {
    let filtered = list.filter(t =>
      t.title.toLowerCase().includes(filterText.toLowerCase()) ||
      t.artist.toLowerCase().includes(filterText.toLowerCase())
    );

    if (sortOrder === "title") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOrder === "artist") {
      return [...filtered].sort((a, b) => a.artist.localeCompare(b.artist));
    }
    return filtered;
  };

  const displayedLiked = sortTracks(likedSongs);

  return (
    <div className="melodify-library-page">
      {/* Library Navigation Tabs */}
      <div className="library-header-row">
        <div className="library-tabs">
          {[
            { id: "liked", label: "Liked Songs", icon: Heart, count: likedTrackIds.size },
            { id: "playlists", label: "Playlists", icon: Music2, count: userPlaylists.length },
            { id: "recent", label: "Recently Played", icon: Clock, count: recentlyPlayed.length },
            { id: "artists", label: "Followed Artists", icon: Users, count: POPULAR_ARTISTS.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`library-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="library-tab-badge">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          className="library-create-btn"
          onClick={onOpenCreatePlaylist}
        >
          <PlusSquare size={16} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="library-toolbar">
        <div className="library-search-box">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Filter library items..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="library-sort-selector">
          <ArrowUpDown size={15} className="text-slate-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-dropdown"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Alphabetical (Title)</option>
            <option value="artist">Artist Name</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Liked Songs */}
      {activeTab === "liked" && (
        <div className="library-liked-section">
          {/* Liked Songs Hero Banner */}
          <div className="liked-hero-card">
            <div className="liked-heart-art">
              <Heart size={48} fill="white" color="white" />
            </div>

            <div className="liked-hero-meta">
              <span className="liked-pill">PLAYLIST</span>
              <h1 className="liked-title">Liked Songs</h1>
              <p className="liked-subtitle">
                {likedSongs.length} favorites saved to your personal cloud vault
              </p>

              <button
                className="liked-play-all-btn"
                onClick={handlePlayLikedAll}
                disabled={likedSongs.length === 0}
              >
                <Play size={20} className="fill-current text-white translate-x-0.5" />
                <span>Play Favorites</span>
              </button>
            </div>
          </div>

          {/* Liked Tracks Table */}
          {displayedLiked.length === 0 ? (
            <div className="library-empty-view">
              <Heart size={36} className="text-slate-600 mb-2" />
              <h4>No liked songs yet</h4>
              <p>Explore tracks and tap the heart icon to add them to your collection.</p>
            </div>
          ) : (
            <div className="library-track-table">
              <div className="table-header-row">
                <span className="col-idx">#</span>
                <span className="col-title">Title</span>
                <span className="col-artist">Artist</span>
                <span className="col-genre">Genre</span>
                <span className="col-actions">Save</span>
                <span className="col-time">Duration</span>
              </div>

              {displayedLiked.map((track, i) => (
                <div
                  key={track.id}
                  className="table-track-row group"
                  onClick={() => playTrack(track, likedSongs)}
                >
                    <span className="col-idx">{i + 1}</span>

                    <div className="col-title track-title-cell">
                      <img src={track.image} alt={track.title} className="track-thumb" />
                      <div>
                        <p className="track-name">{track.title}</p>
                        <span className="track-album-sub">{track.album || "Single"}</span>
                      </div>
                    </div>

                    <span className="col-artist">{track.artist}</span>
                    <span className="col-genre">{track.genre || "Electronic"}</span>

                    <div className="col-actions">
                      <button
                        className="table-heart-btn active"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                      >
                        <Heart size={16} fill="#b81840" color="#b81840" />
                      </button>
                    </div>

                    <span className="col-time">{formatDuration(track.duration)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Playlists */}
      {activeTab === "playlists" && (
        <div className="library-playlists-section">
          <div className="playlists-grid">
            {/* Create Playlist Action Tile */}
            <div className="create-playlist-tile group" onClick={onOpenCreatePlaylist}>
              <div className="create-icon-circle">
                <PlusSquare size={32} className="text-violet-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4>Create New Playlist</h4>
              <p>Start a new vibe mix</p>
            </div>

            {userPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}

            {CURATED_PLAYLISTS.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Recently Played */}
      {activeTab === "recent" && (
        <div className="library-recent-section">
          <div className="songs-cards-grid">
            {recentlyPlayed.map((track) => (
              <MusicCard key={`rec-${track.id}`} track={track} queue={recentlyPlayed} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Followed Artists */}
      {activeTab === "artists" && (
        <div className="library-artists-section">
          <div className="artists-cards-grid">
            {POPULAR_ARTISTS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
