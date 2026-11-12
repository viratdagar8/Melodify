import { useState, useRef, useEffect, useCallback } from "react";
import { PlayerContext } from "./playerContextDef";
import { FALLBACK_AUDIO_TRACKS, DEFAULT_USER_PLAYLISTS } from "../data/mockData";

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(FALLBACK_AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_AUDIO_TRACKS[0].duration || 180);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);

  // Queue & Playback Modes
  const [queue, setQueue] = useState(FALLBACK_AUDIO_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off' | 'all' | 'one'

  // User Library State
  const [likedTrackIds, setLikedTrackIds] = useState(() => new Set(["sample-1", "sample-3"]));
  const [recentlyPlayed, setRecentlyPlayed] = useState([FALLBACK_AUDIO_TRACKS[0], FALLBACK_AUDIO_TRACKS[1]]);
  const [userPlaylists, setUserPlaylists] = useState(DEFAULT_USER_PLAYLISTS);

  // UI Modals
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // Synchronize volume with HTML5 Audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Set track and play
  const playTrack = useCallback((track, newQueue = null) => {
    if (!track) return;

    if (!track.audio) {
      setPlaybackError(`Audio stream unavailable for "${track.title}".`);
      setTimeout(() => setPlaybackError(null), 4000);
      return;
    }

    setPlaybackError(null);
    setCurrentTrack(track);

    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      // If track is not in current queue, add it
      setQueue(prevQueue => {
        const existingIdx = prevQueue.findIndex(t => t.id === track.id);
        if (existingIdx !== -1) {
          setQueueIndex(existingIdx);
          return prevQueue;
        }
        const updated = [track, ...prevQueue];
        setQueueIndex(0);
        return updated;
      });
    }

    // Update recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });

    if (audioRef.current) {
      audioRef.current.src = track.audio;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Autoplay was prevented or audio failed:", err.message);
        setIsPlaying(false);
      });
    }
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentTrack.audio) {
        audioRef.current.src = currentTrack.audio;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Playback error:", err);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, currentTrack]);

  // Next Track
  const playNext = useCallback(() => {
    if (!queue.length) return;

    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === "all") {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      setQueueIndex(nextIdx);
      playTrack(nextTrack);
    }
  }, [queue, queueIndex, isShuffle, repeatMode, playTrack]);

  // Previous Track
  const playPrevious = useCallback(() => {
    if (!queue.length) return;

    // If played more than 3 seconds, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = repeatMode === "all" ? queue.length - 1 : 0;
    }

    const prevTrack = queue[prevIdx];
    if (prevTrack) {
      setQueueIndex(prevIdx);
      playTrack(prevTrack);
    }
  }, [queue, queueIndex, repeatMode, playTrack]);

  // Seek
  const seek = useCallback((timeInSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  }, []);

  // Volume
  const changeVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, Number(val)));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume || 0.8);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  // Liked Songs
  const toggleLike = useCallback((trackId) => {
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const isLiked = useCallback((trackId) => {
    return likedTrackIds.has(trackId);
  }, [likedTrackIds]);

  // User Playlists
  const createPlaylist = useCallback((title, description = "") => {
    const newPlaylist = {
      id: `user-pl-${Date.now()}`,
      title: title.trim() || "My New Playlist",
      description: description.trim() || "Created with Melodify",
      songCount: 0,
      color: "#6D001A",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
      tracks: []
    };
    setUserPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, []);

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((indexToRemove) => {
    setQueue(prev => prev.filter((_, idx) => idx !== indexToRemove));
  }, []);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentTrack?.duration || 180);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume: isMuted ? 0 : volume,
        rawVolume: volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        likedTrackIds,
        recentlyPlayed,
        userPlaylists,
        isNowPlayingExpanded,
        isQueueOpen,
        playbackError,
        playTrack,
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
        createPlaylist,
        addToQueue,
        removeFromQueue,
        setIsNowPlayingExpanded,
        setIsQueueOpen,
        setPlaybackError
      }}
    >
      {/* Persistent HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      {children}
    </PlayerContext.Provider>
  );
};

export { usePlayer } from "./usePlayer";
