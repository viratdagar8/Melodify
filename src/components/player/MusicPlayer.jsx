import { useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  ListMusic,
  Maximize2,
  AlertCircle
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    playbackError,
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
    isQueueOpen,
    setIsQueueOpen,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded
  } = usePlayer();

  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const progressBarRef = useRef(null);

  if (!currentTrack) {
    return null;
  }

  const liked = isLiked(currentTrack.id);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle seeking via clicking or dragging on progress bar
  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    seek(percentage * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="melodify-player">
      {/* Playback Error Toast if stream is unavailable */}
      {playbackError && (
        <div className="player-error-banner">
          <AlertCircle size={15} />
          <span>{playbackError}</span>
        </div>
      )}

      {/* 1. Track Info & Artwork */}
      <div className="player-track-info" onClick={() => setIsNowPlayingExpanded(true)}>
        <div className="player-artwork-box">
          <img
            src={currentTrack.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80"}
            alt={currentTrack.title}
            className={`player-artwork ${isPlaying ? "playing" : ""}`}
          />
          {/* Equalizer animation badge */}
          {isPlaying && (
            <div className="player-equalizer">
              <span className="eq-bar eq-1"></span>
              <span className="eq-bar eq-2"></span>
              <span className="eq-bar eq-3"></span>
              <span className="eq-bar eq-4"></span>
            </div>
          )}
        </div>

        <div className="player-meta">
          <h4 className="player-title" title={currentTrack.title}>
            {currentTrack.title}
          </h4>
          <p className="player-artist" title={currentTrack.artist}>
            {currentTrack.artist}
          </p>
        </div>

        <button
          className={`player-like-btn ${liked ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(currentTrack.id);
          }}
          aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
          <Heart size={18} fill={liked ? "#b81840" : "none"} color={liked ? "#b81840" : "currentColor"} />
        </button>
      </div>

      {/* 2. Main Playback Controls & Interactive Seekbar */}
      <div className="player-center-controls">
        <div className="controls-button-row">
          {/* Shuffle */}
          <button
            className={`control-btn ${isShuffle ? "active-accent" : ""}`}
            onClick={toggleShuffle}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
            aria-label="Shuffle"
          >
            <Shuffle size={17} />
          </button>

          {/* Previous */}
          <button
            className="control-btn"
            onClick={playPrevious}
            title="Previous track"
            aria-label="Previous track"
          >
            <SkipBack size={20} />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            className={`primary-play-btn ${isPlaying ? "playing" : ""}`}
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} className="fill-current text-white" />
            ) : (
              <Play size={20} className="fill-current text-white translate-x-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            className="control-btn"
            onClick={playNext}
            title="Next track"
            aria-label="Next track"
          >
            <SkipForward size={20} />
          </button>

          {/* Repeat */}
          <button
            className={`control-btn ${repeatMode !== "off" ? "active-accent" : ""}`}
            onClick={toggleRepeat}
            title={`Repeat mode: ${repeatMode}`}
            aria-label="Repeat"
          >
            {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={17} />}
          </button>
        </div>

        {/* Interactive Progress Bar */}
        <div className="playback-progress-row">
          <span className="time-display current-time">{formatTime(currentTime)}</span>

          <div
            className="progress-bar-container"
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
          >
            <div className="progress-bar-rail">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className={`progress-thumb ${isHoveringProgress ? "visible" : ""}`} />
              </div>
            </div>
          </div>

          <span className="time-display duration-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Utility Controls: Volume, Queue, Expand */}
      <div className="player-utility-controls">
        <button
          className={`control-btn ${isQueueOpen ? "active-accent" : ""}`}
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          title="Playback Queue"
          aria-label="Playback Queue"
        >
          <ListMusic size={19} />
        </button>

        {/* Volume Slider */}
        <div className="volume-slider-group">
          <button
            className="volume-icon-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} className="text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <div className="volume-track-wrapper">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(e.target.value)}
              className="volume-slider"
              aria-label="Volume slider"
            />
          </div>
        </div>

        {/* Fullscreen / Expanded Now Playing View */}
        <button
          className="control-btn expand-btn"
          onClick={() => setIsNowPlayingExpanded(!isNowPlayingExpanded)}
          title="Expanded View"
          aria-label="Expanded Now Playing View"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </footer>
  );
};
