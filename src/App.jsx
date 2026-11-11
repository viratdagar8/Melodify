
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
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef(null);

  // Fetch songs from Jamendo API
  const searchTracks = async (query) => {
    if (!query.trim()) return;

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
        }));

      setSongs(formattedSongs);

      if (formattedSongs.length === 0) {
        setError("No playable songs found. Try another search.");
      }
    } catch (err) {
      console.error("Jamendo API Error:", err);
      setError("Unable to load songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load initial songs
  useEffect(() => {
    searchTracks("rock");
  }, []);

  // Search form
  const handleSearch = (e) => {
    e.preventDefault();
    setActivePage("Search");
    searchTracks(searchQuery);
  };

  // Play selected song
  const playSong = async (song) => {
    if (!audioRef.current) return;

    setCurrentSong(song);
    audioRef.current.src = song.audio;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
      setError("Could not play this track. Try another song.");
    }
  };

  // Play or pause
  const togglePlay = async () => {
    if (!audioRef.current || !currentSong) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Play next song
  const playNext = () => {
    if (!songs.length || !currentSong) return;

    const index = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex = (index + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  // Play previous song
  const playPrevious = () => {
    if (!songs.length || !currentSong) return;

    const index = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      (index - 1 + songs.length) % songs.length;

    playSong(songs[previousIndex]);
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNext}
      />

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACt0lEQVR4nO1ZzW7TQBC2ys+BY4DZpAk8AFdE1Z4ieYaqhyq3qAgegnIq6qW3lis0VYu4QyVUOEC58BSg8gBARRGJOSdcBo2dtKEx6a53bQfhkUZy7Hjn+3ZnZmfHnldIIYVYC3vNcww4x0CrrHCPgT4x4E9W9CtUuQY66D9bZaBZ9tam8gc+PX+NAR+xokNWxEYK9JWBNrhar2UPvLxwlRU9ZcCeMfARIthjhdtcqV/JBjzQXQYMrIGPrkiHlX8nPeDezQus8Jlz4GpEd8SWW/CVxUsM9C4D8Nx3q32x6W7mswSvjvU932hetCeQjdtwvOK2HXjAe/mBpwGJpWTgp/EyA7VzJwAYJEqxYZ7PG7wakKAtM/DVes3JJuVuFXpcoev6BKLyQN9AbYG5tcv8PWA+6jBv7kb33K7Chh54b20qrFNMBhfAp+XJC9crcShFo87szxkPLrMusnifubEcXcs95+7kz2gQkJLYcOCB/O23O314NgGFr5wTcBUjQC91VuDAOQF3MfJRJwYC5wRcxQhQW4dAzzkBVzEC2P0vCARGgzYeRGC+tc1dqrGchguNCeJx8vi5PgEJ4HGibIJ4XBqNE5l5AT+cFs8iIP8VEkcdMwKaadR8IzONieS6okNg1trQsI/HxUhSLeMtzWIOv1gZivPx4RhJokCftbt5YcfMxtiwj8fFSDIC61rgJ/RA0+WSX9UmEJKQdt/kENg0Ah8SqM2XJuNQT53EfVPpVeZOoHy7mQj8CQnaydF1Wlbgjz9eKHqdg+u8Za9+3prASXMX9zME/8ZZc/dUez39zATYcjbzsUQULqWSnQB/WAesYd90K9xg7IF3Jc9L2s4E/B9ESn41LDuS1E7yDtC68Q6bChEpAJU/I30bqdnl4BGe7KQciVROeR/6z1akqpyIz6yFFOL9+/IbnR+fXrEoz4wAAAAASUVORK5CYII=" alt="musically"></img>
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
                  ? "Search Results"
                  : "Made for you"}
              </h2>

              <p>Music that matches your vibe</p>
            </div>

            <button
              className="see-all"
              onClick={() => searchTracks("popular")}
            >
              Refresh
            </button>
          </div>

          {loading && <p>Loading songs...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && songs.length === 0 && !error && (
            <p>No songs available.</p>
          )}

          <div className="song-grid">
            {songs.map((song) => (
              <div
                className="song-card"
                key={song.id}
                onClick={() => playSong(song)}
              >
                <div className="cover-wrapper">
                  <img
                    src={song.image}
                    alt={song.title}
                  />

                  <button className="card-play">
                    <Play
                      size={20}
                      fill="white"
                      color="white"
                    />
                  </button>
                </div>

                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            ))}
          </div>
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
                <p>{currentSong.artist}</p>
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
            <button onClick={playPrevious} disabled={!currentSong}>
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

            <button onClick={playNext} disabled={!currentSong}>
              <SkipForward size={21} />
            </button>
          </div>

          <div className="progress-area">
            <span>
              {audioRef.current
                ? formatTime(audioRef.current.currentTime)
                : "0:00"}
            </span>

            <div className="progress-bar">
              <div></div>
            </div>

            <span>
              {currentSong
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
              if (audioRef.current) {
                audioRef.current.volume = Number(e.target.value);
              }
            }}
          />
        </div>

      </footer>
    </div>
  );
}

export default App;
