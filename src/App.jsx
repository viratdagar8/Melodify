import { useState, useEffect, useRef } from "react";
import {
  Home, Search, Library, Plus, Heart, Play,
  Pause, SkipBack, SkipForward, Volume2,
  Mic2
} from "lucide-react";
import "./App.css";

const CLIENT_ID = "8c96364f";

function App() {
  const [activePage, setActivePage] = useState("Home");
  const [songs, setSongs] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [unifiedResults, setUnifiedResults] = useState([]);

  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [error, setError] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");

  const audioRef = useRef(null);
  const youtubeFrameRef = useRef(null);

  // Calculate how closely a result matches the search query
  const getRelevanceScore = (query, title = "", artist = "") => {
    const normalize = (value) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const search = normalize(query);
    const normalizedTitle = normalize(title);
    const normalizedArtist = normalize(artist);

    if (!search) return 0;

    if (normalizedTitle === search) return 100;

    if (normalizedTitle.includes(search)) return 85;

    if (normalizedArtist === search) return 75;

    if (normalizedArtist.includes(search)) return 65;

    const words = search.split(" ").filter(Boolean);

    const titleMatches = words.filter((word) =>
      normalizedTitle.includes(word)
    ).length;

    const artistMatches = words.filter((word) =>
      normalizedArtist.includes(word)
    ).length;

    return (
      (titleMatches / words.length) * 50 +
      (artistMatches / words.length) * 25
    );
  };

  // Fetch songs from Jamendo API
  const searchTracks = async (query) => {
    if (!query.trim()) return [];

    setLoading(true);
    setError("");

    try {
      const url =
        `https://api.jamendo.com/v3.0/tracks/` +
        `?client_id=${CLIENT_ID}` +
        `&format=json` +
        `&limit=20` +
        `&search=${encodeURIComponent(query)}` +
        `&audioformat=mp32`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to connect to music API");
      }

      const data = await response.json();

      if (data.headers.status !== "success") {
        throw new Error(data.headers.error_message || "API request failed");
      }

      const formattedSongs = data.results
        .filter((track) => track.audio)
        .map((track) => ({
          id: track.id,
          title: track.name,
          artist: track.artist_name,
          image: track.album_image,
          audio: track.audio,
          duration: track.duration,
          source: "Jamendo",
        }));

      setSongs(formattedSongs);
      return formattedSongs;

    } catch (err) {
      console.error("Jamendo API Error:", err);
      setError("Unable to load Jamendo songs.");
      setSongs([]);
      return [];

    } finally {
      setLoading(false);
    }
  };

  // Search songs using YouTube Data API
  const searchYouTube = async (query) => {
    if (!query.trim()) return [];

    setYoutubeLoading(true);
    setYoutubeError("");

    try {
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

      if (!API_KEY) {
        throw new Error("YouTube API key is missing. Check your .env file.");
      }

      const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet` +
        `&type=video` +
        `&videoEmbeddable=true` +
        `&maxResults=12` +
        `&q=${encodeURIComponent(query)}` +
        `&key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || "YouTube search failed"
        );
      }

      const videos = data.items || [];

      setYoutubeResults(videos);
      return videos;

    } catch (err) {
      console.error("YouTube API Error:", err);
      setYoutubeError(err.message || "Unable to search YouTube.");
      setYoutubeResults([]);
      return [];

    } finally {
      setYoutubeLoading(false);
    }
  };

  // Search both platforms and create one common queue
  const searchAll = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setYoutubeLoading(true);
    setError("");
    setYoutubeError("");
    setUnifiedResults([]);

    // Stop the previous song when a new search starts
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentSong(null);
    setCurrentIndex(-1);
    setSelectedVideoId("");
    setIsPlaying(false);

    const [jamendoData, youtubeData] = await Promise.all([
      searchTracks(query),
      searchYouTube(query),
    ]);

    const jamendoFormatted = (jamendoData || []).map((song) => ({
      ...song,
      source: "Jamendo",
      queueId: `Jamendo-${song.id}`,
      score: getRelevanceScore(query, song.title, song.artist),
    }));

    const youtubeFormatted = (youtubeData || []).map((video) => ({
      id: video.id.videoId,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      image:
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.default?.url ||
        "",
      videoId: video.id.videoId,
      source: "YouTube",
      duration: 0,
      queueId: `YouTube-${video.id.videoId}`,
      score: getRelevanceScore(
        query,
        video.snippet.title,
        video.snippet.channelTitle
      ),
    }));

    // Combine and sort results by relevance
    const combinedResults = [
      ...jamendoFormatted,
      ...youtubeFormatted,
    ].sort((a, b) => b.score - a.score);

    setUnifiedResults(combinedResults);

    setLoading(false);
    setYoutubeLoading(false);

    if (combinedResults.length === 0) {
      setError("No matching songs found. Try another search.");
    } else {
      setError("");
    }
  };

  // Load initial results from both platforms
  useEffect(() => {
    searchAll("rock");
  }, []);

  // Search form
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setActivePage("Search");
    searchAll(searchQuery);
  };

  // Play a song from the common queue
  const playQueueItem = async (item, index) => {
    setCurrentSong(item);
    setCurrentIndex(index);

    if (item.source === "YouTube") {
      // Stop Jamendo audio before playing YouTube
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setSelectedVideoId(item.videoId);
      setIsPlaying(true);
      return;
    }

    // Play Jamendo song
    setSelectedVideoId("");

    if (!audioRef.current) return;

    audioRef.current.src = item.audio;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
      setError("Could not play this track. Try another song.");
    }
  };

  // Play or pause current song
  const togglePlay = async () => {
    if (!currentSong) return;

    if (currentSong.source === "YouTube") {
      const command = isPlaying ? "pauseVideo" : "playVideo";

      youtubeFrameRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
          args: [],
        }),
        "*"
      );

      setIsPlaying(!isPlaying);
      return;
    }

    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Play next song in the common queue
  const playNext = () => {
    if (!unifiedResults.length) return;

    const nextIndex =
      currentIndex < 0
        ? 0
        : (currentIndex + 1) % unifiedResults.length;

    playQueueItem(unifiedResults[nextIndex], nextIndex);
  };

  // Play previous song in the common queue
  const playPrevious = () => {
    if (!unifiedResults.length) return;

    const previousIndex =
      currentIndex < 0
        ? 0
        : (currentIndex - 1 + unifiedResults.length) %
          unifiedResults.length;

    playQueueItem(unifiedResults[previousIndex], previousIndex);
  };

  // Format seconds into minutes
  const formatTime = (seconds) => {
    if (!seconds || !Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="app">

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onPlay={() => {
          if (currentSong?.source === "Jamendo") {
            setIsPlaying(true);
          }
        }}
        onPause={() => {
          if (currentSong?.source === "Jamendo") {
            setIsPlaying(false);
          }
        }}
        onEnded={playNext}
      />

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACt0lEQVR4nO1ZzW7TQBC2ys+BY4DZpAk8AFdE1Z4ieYaqhyq3qAgegnIq6qW3lis0VYu4QyVUOEC58BSg8gBARRGJOSdcBo2dtKEx6a53bQfhkUZy7Hjn+3ZnZmfHnldIIYVYC3vNcww4x0CrrHCPgT4x4E9W9CtUuQY66D9bZaBZ9tam8gc+PX+NAR+xokNWxEYK9JWBNrhar2UPvLxwlRU9ZcCeMfARIthjhdtcqV/JBjzQXQYMrIGPrkiHlX8nPeDezQus8Jlz4GpEd8SWW/CVxUsM9C4D8Nx3q32x6W7mswSvjvU932hetCeQjdtwvOK2HXjAe/mBpwGJpWTgp/EyA7VzJwAYJEqxYZ7PG7wakKAtM/DVes3JJuVuFXpcoev6BKLyQN9AbYG5tcv8PWA+6jBv7kb33K7Chh54b20qrFNMBhfAp+XJC9crcShFo87szxkPLrMusnifubEcXcs95+7kz2gQkJLYcOCB/O23O314NgGFr5wTcBUjQC91VuDAOQF3MfJRJwYC5wRcxQhQW4dAzzkBVzEC2P0vCARGgzYeRGC+tc1dqrGchguNCeJx8vi5PgEJ4HGibIJ4XBqNE5l5AT+cFs8iIP8VEkcdMwKaadR8IzONieS6okNg1trQsI/HxUhSLeMtzWIOv1gZivPx4RhJokCftbt5YcfMxtiwj8fFSDIC61rgJ/RA0+WSX9UmEJKQdt/kENg0Ah8SqM2XJuNQT53EfVPpVeZOoHy7mQj8CQnaydF1Wlbgjz9eKHqdg+u8Za9+3prASXMX9zME/8ZZc/dUez39zATYcjbzsUQULqWSnQB/WAesYd90K9xg7IF3Jc9L2s4E/B9ESn41LDuS1E7yDtC68Q6bChEpAJU/I30bqdnl4BGe7KQciVROeR/6z1akqpyIz6yFFOL9+/IbnR+fXrEoz4wAAAAASUVORK5CYII="
            alt="musically"
          />
          <span>Melodify</span>
        </h2>

        <p className="menu-title">MENU</p>

        <button
          className={activePage === "Home" ? "nav-link active" : "nav-link"}
          onClick={() => setActivePage("Home")}
        >
          <Home size={20} /> Home
        </button>

        <button
          className={activePage === "Search" ? "nav-link active" : "nav-link"}
          onClick={() => setActivePage("Search")}
        >
          <Search size={20} /> Search
        </button>

        <button
          className={activePage === "Library" ? "nav-link active" : "nav-link"}
          onClick={() => setActivePage("Library")}
        >
          <Library size={20} /> Your Library
        </button>

        <p className="menu-title playlist-heading">
          YOUR PLAYLISTS
        </p>

        <button className="nav-link">
          <Plus size={20} /> Create Playlist
        </button>

        <button className="nav-link">
          <Heart size={20} /> Liked Songs
        </button>

        <div className="sidebar-bottom">
          <p>Made for your vibe.</p>
          <span>Discover. Listen. Feel.</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <form className="search-box" onSubmit={handleSearch}>
            <Search size={19} />

            <input
              type="text"
              placeholder="Search songs, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="profile">
            <span>VD</span>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div>
            <p className="greeting">YOUR MUSIC. YOUR MOOD.</p>

            <h1>Feel every beat.</h1>

            <p className="hero-description">
              Your world of music starts here.
            </p>

            <button className="voice-button">
              <Mic2 size={19} />
              Voice Assistant
            </button>
          </div>
        </section>

        {/* Music section */}
        <section className="music-section">

          <div className="section-heading">
            <div>
              <h2>
                {activePage === "Search"
                  ? "Your Search Queue"
                  : "Made for you"}
              </h2>

              <p>Best matching results from all music platforms</p>
            </div>

            <button
              className="see-all"
              onClick={() => searchAll("popular")}
            >
              Refresh
            </button>
          </div>

          {(loading || youtubeLoading) && (
            <p>Searching all music platforms...</p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {youtubeError && (
            <p className="error-message">{youtubeError}</p>
          )}

          {!loading &&
            !youtubeLoading &&
            unifiedResults.length === 0 &&
            !error && (
              <p>No songs available.</p>
            )}

          {/* Common Jamendo + YouTube queue */}
          <div className="song-grid">
            {unifiedResults.map((item, index) => (
              <div
                className="song-card"
                key={item.queueId}
                onClick={() => playQueueItem(item, index)}
              >
                <div className="cover-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <button className="card-play">
                    <Play
                      size={20}
                      fill="white"
                      color="white"
                    />
                  </button>
                </div>

                <h3>{item.title}</h3>
                <p>{item.artist}</p>

                <small>
                  {index + 1}. {item.source}
                </small>
              </div>
            ))}
          </div>

          {/* YouTube player */}
          {selectedVideoId && (
            <div className="youtube-player">
              <h3>Now Playing on YouTube</h3>

              <iframe
                ref={youtubeFrameRef}
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
                title="Melodify YouTube Player"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

        </section>

        {/* Voice assistant */}
        <section className="voice-card">
          <div className="voice-icon">
            <Mic2 size={28} />
          </div>

          <div>
            <h3>Meet your personal DJ</h3>
            <p>Just say "Hey Vibe" and let the music flow.</p>
          </div>

          <span className="coming-soon">COMING SOON</span>
        </section>

      </main>

      {/* Bottom music player */}
      <footer className="player">

        <div className="now-playing">
          {currentSong ? (
            <>
              <img
                src={currentSong.image}
                alt={currentSong.title}
              />

              <div>
                <h4>{currentSong.title}</h4>
                <p>
                  {currentSong.artist} · {currentSong.source}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h4>Select a song</h4>
              <p>Your music will appear here</p>
            </div>
          )}

          <Heart size={19} className="player-heart" />
        </div>

        <div className="player-controls">

          <div className="control-buttons">
            <button
              onClick={playPrevious}
              disabled={!currentSong || !unifiedResults.length}
            >
              <SkipBack size={21} />
            </button>

            <button
              className="play-button"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying
                ? <Pause size={20} fill="black" />
                : <Play size={20} fill="black" />
              }
            </button>

            <button
              onClick={playNext}
              disabled={!currentSong || !unifiedResults.length}
            >
              <SkipForward size={21} />
            </button>
          </div>

          <div className="progress-area">
            <span>
              {currentSong?.source === "Jamendo" && audioRef.current
                ? formatTime(audioRef.current.currentTime)
                : "0:00"}
            </span>

            <div className="progress-bar">
              <div></div>
            </div>

            <span>
              {currentSong?.source === "Jamendo"
                ? formatTime(currentSong.duration)
                : "0:00"}
            </span>
          </div>

        </div>

        <div className="volume-control">
          <Volume2 size={20} />

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.7"
            onChange={(e) => {
              const volume = Number(e.target.value);

              if (audioRef.current) {
                audioRef.current.volume = volume;
              }

              youtubeFrameRef.current?.contentWindow?.postMessage(
                JSON.stringify({
                  event: "command",
                  func: "setVolume",
                  args: [volume * 100],
                }),
                "*"
              );
            }}
          />
        </div>

      </footer>
    </div>
  );
}

export default App;