
import { useState, useRef, useEffect, useCallback } from "react";
import { PlayerContext } from "./playerContextDef";
import { FALLBACK_AUDIO_TRACKS, DEFAULT_USER_PLAYLISTS } from "../data/mockData";

// Safely read saved data from localStorage
const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage:`, error);
    return fallback;
  }
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const playRequestRef = useRef(0);
  const errorTimerRef = useRef(null);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(FALLBACK_AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(
    FALLBACK_AUDIO_TRACKS[0]?.duration || 180
  );

  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);

  // Queue and playback modes
  const [queue, setQueue] = useState(FALLBACK_AUDIO_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  // User library: restore saved data on app startup
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    const saved = readStorage("melodify_liked_songs", null);
    return new Set(saved ?? ["sample-1", "sample-3"]);
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() =>
    readStorage("melodify_recently_played", [
      FALLBACK_AUDIO_TRACKS[0],
      FALLBACK_AUDIO_TRACKS[1]
    ])
  );

  const [userPlaylists, setUserPlaylists] = useState(() =>
    readStorage("melodify_playlists", DEFAULT_USER_PLAYLISTS)
  );

  // UI state
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // Save library data whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "melodify_liked_songs",
      JSON.stringify([...likedTrackIds])
    );
  }, [likedTrackIds]);

  useEffect(() => {
    localStorage.setItem(
      "melodify_playlists",
      JSON.stringify(userPlaylists)
    );
  }, [userPlaylists]);

  useEffect(() => {
    localStorage.setItem(
      "melodify_recently_played",
      JSON.stringify(recentlyPlayed)
    );
  }, [recentlyPlayed]);

  // Keep volume synchronized with the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Clean up timers and invalidate pending play requests
  useEffect(() => {
    return () => {
      playRequestRef.current += 1;
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const showPlaybackError = useCallback((message) => {
    setPlaybackError(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setPlaybackError(null);
    }, 5000);
  }, []);

  // Update recently played tracks
  const updateRecentlyPlayed = useCallback((track) => {
    setRecentlyPlayed((previous) => {
      const filtered = previous.filter((item) => item.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });
  }, []);

  // Load and play a track
  const playTrack = useCallback(
    async (track, newQueue = null) => {
      if (!track) return;

      if (!track.audio) {
        showPlaybackError(
          `Audio stream unavailable for "${track.title}".`
        );
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      const requestId = ++playRequestRef.current;

      setPlaybackError(null);
      setIsLoading(true);
      setIsPlaying(false);
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.duration || 180);

      // Keep the selected track and queue index synchronized
      const nextQueue =
        Array.isArray(newQueue) && newQueue.length > 0
          ? [...newQueue]
          : [...queue];

      let nextIndex = nextQueue.findIndex(
        (item) => item.id === track.id
      );

      if (nextIndex === -1) {
        nextQueue.push(track);
        nextIndex = nextQueue.length - 1;
      }

      setQueue(nextQueue);
      setQueueIndex(nextIndex);

      updateRecentlyPlayed(track);

      try {
        audio.pause();
        audio.src = track.audio;
        audio.load();

        await audio.play();

        // Ignore an older play request if another track was selected
        if (requestId === playRequestRef.current) {
          setIsPlaying(true);
          setIsLoading(false);
        }
      } catch (error) {
        if (requestId !== playRequestRef.current) return;

        console.warn("Audio playback failed:", error);

        setIsPlaying(false);
        setIsLoading(false);

        if (error.name === "NotAllowedError") {
          showPlaybackError("Playback was blocked. Press Play to try again.");
        } else {
          showPlaybackError(
            `Unable to play "${track.title}". The audio stream may be unavailable.`
          );
        }
      }
    },
    [queue, showPlaybackError, updateRecentlyPlayed]
  );

  // Play or pause the current track
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    if (!audio.src && currentTrack.audio) {
      audio.src = currentTrack.audio;
      audio.load();
    }

    try {
      setPlaybackError(null);
      setIsLoading(true);
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.warn("Playback error:", error);
      setIsPlaying(false);
      setIsLoading(false);
      showPlaybackError("Unable to start playback. Please try again.");
    }
  }, [currentTrack, isPlaying, showPlaybackError]);

  // Play next track
  const playNext = useCallback(() => {
    if (!queue.length) return;

    const audio = audioRef.current;

    if (repeatMode === "one" && audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn("Replay failed:", error);
        showPlaybackError("Unable to replay this track.");
      });
      return;
    }

    let nextIndex;

    if (isShuffle && queue.length > 1) {
      // Avoid selecting the currently playing track
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === queueIndex);
    } else {
      nextIndex = queueIndex + 1;

      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }

    const nextTrack = queue[nextIndex];

    if (nextTrack) {
      playTrack(nextTrack, queue);
    }
  }, [
    queue,
    queueIndex,
    isShuffle,
    repeatMode,
    playTrack,
    showPlaybackError
  ]);

  // Play previous track
  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (!queue.length) return;

    // Restart current track if more than 3 seconds have passed
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let previousIndex = queueIndex - 1;

    if (previousIndex < 0) {
      previousIndex =
        repeatMode === "all" ? queue.length - 1 : 0;
    }

    const previousTrack = queue[previousIndex];

    if (previousTrack) {
      playTrack(previousTrack, queue);
    }
  }, [queue, queueIndex, repeatMode, playTrack]);

  // Seek safely within the track duration
  const seek = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(timeInSeconds)) return;

    const maxTime = Number.isFinite(audio.duration)
      ? audio.duration
      : duration;

    const safeTime = Math.max(
      0,
      Math.min(timeInSeconds, maxTime || 0)
    );

    audio.currentTime = safeTime;
    setCurrentTime(safeTime);
  }, [duration]);

  // Volume controls
  const changeVolume = useCallback(
    (value) => {
      const nextVolume = Math.max(
        0,
        Math.min(1, Number(value) || 0)
      );

      setVolumeState(nextVolume);

      if (nextVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume > 0 ? previousVolume : 0.8);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume]);

  // Shuffle and repeat
  const toggleShuffle = useCallback(() => {
    setIsShuffle((previous) => !previous);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((previous) => {
      if (previous === "off") return "all";
      if (previous === "all") return "one";
      return "off";
    });
  }, []);

  // Liked songs
  const toggleLike = useCallback((trackId) => {
    setLikedTrackIds((previous) => {
      const updated = new Set(previous);

      if (updated.has(trackId)) {
        updated.delete(trackId);
      } else {
        updated.add(trackId);
      }

      return updated;
    });
  }, []);

  const isLiked = useCallback(
    (trackId) => likedTrackIds.has(trackId),
    [likedTrackIds]
  );

  // Create playlist
  const createPlaylist = useCallback((title, description = "") => {
    const newPlaylist = {
      id: `user-pl-${Date.now()}`,
      title: title.trim() || "My New Playlist",
      description: description.trim() || "Created with Melodify",
      songCount: 0,
      color: "#6D001A",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
      tracks: []
    };

    setUserPlaylists((previous) => [
      newPlaylist,
      ...previous
    ]);

    return newPlaylist;
  }, []);

  // Queue controls
  const addToQueue = useCallback((track) => {
    if (!track) return;
    setQueue((previous) => [...previous, track]);
  }, []);

  const removeFromQueue = useCallback(
    (indexToRemove) => {
      setQueue((previous) => {
        if (
          indexToRemove < 0 ||
          indexToRemove >= previous.length
        ) {
          return previous;
        }

        const updated = previous.filter(
          (_, index) => index !== indexToRemove
        );

        setQueueIndex((currentIndex) => {
          if (indexToRemove === currentIndex) return -1;
          if (indexToRemove < currentIndex) return currentIndex - 1;
          return currentIndex;
        });

        return updated;
      });
    },
    []
  );

  // Audio event handlers
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleDurationChange = () => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    showPlaybackError(
      "This audio stream could not be loaded. Try another track."
    );
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
        isLoading,
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
      {/* One shared audio element: stays mounted during page navigation */}
      <audio
        ref={audioRef}
        onLoadStart={handleLoadStart}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onTimeUpdate={handleTimeUpdate}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleAudioError}
        preload="metadata"
      />

      {children}
    </PlayerContext.Provider>
  );
};

export { usePlayer } from "./usePlayer";
