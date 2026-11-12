import { useState } from "react";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Radio
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const NowPlayingModal = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    playTrack,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded
  } = usePlayer();

  const [activeTab, setActiveTab] = useState("queue"); // 'queue' | 'related'

  if (!isNowPlayingExpanded || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="now-playing-fullscreen-overlay">
      {/* Dynamic blurred ambient background from track artwork */}
      <div
        className="now-playing-ambient-bg"
        style={{ backgroundImage: `url(${currentTrack.image})` }}
      />
      <div className="now-playing-dark-scrim" />

      {/* Top Bar inside modal */}
      <div className="now-playing-topbar">
        <button
          className="modal-close-btn"
          onClick={() => setIsNowPlayingExpanded(false)}
          aria-label="Collapse view"
        >
          <ChevronDown size={28} />
        </button>

        <div className="now-playing-header-badge">
          <Radio size={14} className="text-violet-400" />
          <span>PLAYING FROM YOUR STREAM</span>
        </div>

        <button
          className="modal-share-btn"
          title="Share song link"
          onClick={() => alert(`Shared "${currentTrack.title}" by ${currentTrack.artist}`)}
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Main Container */}
      <div className="now-playing-grid">
        {/* Left / Center: Large Artwork & Controls */}
        <div className="now-playing-art-column">
          <div className="large-artwork-wrapper">
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className={`large-artwork ${isPlaying ? "playing" : ""}`}
            />
            {isPlaying && (
              <div className="large-equalizer-overlay">
                {[...Array(12)].map((_, i) => (
                  <span
                    key={i}
                    className="modal-eq-bar"
                    style={{ animationDelay: `${(i % 5) * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Track Details Row */}
          <div className="modal-track-details">
            <div className="details-text">
              <h1 className="modal-track-title">{currentTrack.title}</h1>
              <p className="modal-track-artist">{currentTrack.artist}</p>
              {currentTrack.album && (
                <span className="modal-album-badge">{currentTrack.album}</span>
              )}
            </div>

            <button
              className={`modal-like-btn ${liked ? "is-liked" : ""}`}
              onClick={() => toggleLike(currentTrack.id)}
            >
              <Heart size={26} fill={liked ? "#b81840" : "none"} color={liked ? "#b81840" : "white"} />
            </button>
          </div>

          {/* Progress Seekbar */}
          <div className="modal-progress-section">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="modal-seek-slider"
            />
            <div className="modal-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Large Playback Controls */}
          <div className="modal-controls-row">
            <button
              className={`modal-btn ${isShuffle ? "active" : ""}`}
              onClick={toggleShuffle}
            >
              <Shuffle size={20} />
            </button>

            <button className="modal-btn" onClick={playPrevious}>
              <SkipBack size={26} />
            </button>

            <button
              className="modal-primary-play-btn"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause size={28} className="fill-current text-white" />
              ) : (
                <Play size={28} className="fill-current text-white translate-x-0.5" />
              )}
            </button>

            <button className="modal-btn" onClick={playNext}>
              <SkipForward size={26} />
            </button>

            <button
              className={`modal-btn ${repeatMode !== "off" ? "active" : ""}`}
              onClick={toggleRepeat}
            >
              {repeatMode === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          {/* Volume Row */}
          <div className="modal-volume-row">
            <button onClick={toggleMute}>
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(e.target.value)}
              className="modal-vol-slider"
            />
          </div>
        </div>

        {/* Right Column: Queue & Related Tracks */}
        <div className="now-playing-side-column">
          <div className="side-column-tabs">
            <button
              className={`side-tab ${activeTab === "queue" ? "active" : ""}`}
              onClick={() => setActiveTab("queue")}
            >
              Queue ({queue.length})
            </button>
            <button
              className={`side-tab ${activeTab === "related" ? "active" : ""}`}
              onClick={() => setActiveTab("related")}
            >
              Related Vibes
            </button>
          </div>

          <div className="side-track-list">
            {activeTab === "queue" ? (
              queue.map((track, idx) => {
                const isCurrent = currentTrack.id === track.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className={`side-track-row ${isCurrent ? "current" : ""}`}
                    onClick={() => playTrack(track, queue)}
                  >
                    <span className="side-track-idx">{idx + 1}</span>
                    <img src={track.image} alt={track.title} className="side-track-art" />
                    <div className="side-track-info">
                      <p className="side-track-title">{track.title}</p>
                      <span className="side-track-artist">{track.artist}</span>
                    </div>
                    {isCurrent && isPlaying && (
                      <div className="side-playing-pill">Playing</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="related-vibes-box">
                <p className="related-desc">
                  Neural AI audio similarity is tuned to <strong>{currentTrack.genre || "Electronic"}</strong> and <strong>{currentTrack.mood || "Chill"}</strong>.
                </p>
                <div className="related-track-chips">
                  {queue.slice(0, 5).map((track, i) => (
                    <div
                      key={`rel-${track.id}-${i}`}
                      className="related-track-item"
                      onClick={() => playTrack(track, queue)}
                    >
                      <img src={track.image} alt="" className="related-art" />
                      <div>
                        <p className="rel-title">{track.title}</p>
                        <span className="rel-artist">{track.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
