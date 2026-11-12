# 🎵 MELODIFY — Premium AI-Powered Audio Streaming Platform

> **"Feel the Music. Discover Your Vibe."**

MELODIFY is a modern, premium music streaming web application inspired by Spotify's user experience with its own futuristic neon-dark identity and AI-powered audio curation features.

Designed with **React 19**, **Vite**, modern CSS design systems, and the **HTML5 Audio API** for pure, lossless audio streaming.

---

## ✨ Key Features

### 🎧 Audio-Only Streaming Experience
- **100% Audio Player**: No YouTube video players or embedded iframes. Music streams directly via the HTML5 Audio API.
- **Jamendo API Integration**: Search and stream thousands of Creative Commons audio tracks.
- **Persistent Player**: Bottom player remains active and playing across all page navigations.
- **Player Controls**: Play/pause, previous/next track, shuffle, multi-mode repeat (off / all / one track), interactive seekable progress bar, volume slider, mute, and live audio equalizer animations.
- **Expanded Now Playing View**: Immersive fullscreen experience with dynamic ambient album backdrop, animated visualizer, track details, volume control, queue management, and related vibe suggestions.
- **Queue Drawer**: Quick slide-out panel to view and modify your active queue.

---

### 🤖 AI Sound Lab
- **AI DJ Studio**: Futuristic workstation where you pick your emotional frequency (Happy, Sad, Energetic, Relaxed, Focus, Romantic, Party, Chill), dial in an energy level, and synthesize a cross-faded custom DJ set with instant "Play DJ Mix" streaming.
- **AI Music Assistant**: Interactive conversational copilot with avatar, quick prompt chips, and contextual responses containing interactive playable track cards directly inside chat bubbles.
- **AI Playlist Generator**: Prompt-driven playlist synthesis. Enter a description (e.g., *"Cyberpunk late-night coding in Tokyo"*), select mood, genre, and duration, and generate a cohesive playlist with instant "Play All" and "Save to Library" options.
- **Mood-Based Music Discovery**: Visually rich vibe stations with gradients, atmospheric artwork, and one-click tuning.

---

### 🔍 Discovery & Library
- **Intelligent Search**: Real-time track search with instant query debouncing, recent searches history, trending chips, and categorized tabs (All, Songs, Artists, Playlists).
- **Your Library**: Personal cloud vault with tabs for **Liked Songs** (featuring quick favorites playback), **Created Playlists**, **Recently Played**, and **Followed Artists**, complete with live search filtering and sorting.
- **Playlist Creator**: Modal to create custom user playlists on the fly.

---

## 🎨 Design Vision & Styling

- **Backgrounds**: Deep black & charcoal tones (`#070709`, `#0e0e15`, `#14141e`).
- **Accents**: Vibrant purple/violet primary (`#8b5cf6`, `#7c3aed`) with cyan (`#06b6d4`) and pink (`#ec4899`) highlights.
- **Glassmorphism**: Backdrop blur effects, glowing borders, and subtle radial gradient lighting.
- **Animations**: Equalizer bars, spinning vinyl record, hover zoom elevations, and smooth transitions.
- **Responsiveness**: Fully responsive desktop, tablet, and mobile layouts with collapsible sidebar and mobile slide-out navigation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/viratdagar8/Melodify.git
cd Melodify

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```
src/
├── api/
│   └── jamendoApi.js            # Jamendo REST API service with resilient fallback audio
├── context/
│   ├── playerContextDef.js      # React Context definition
│   ├── PlayerContext.jsx        # Playback provider (HTML5 Audio, Queue, Liked, Volume)
│   └── usePlayer.js             # Custom player hook
├── data/
│   └── mockData.js              # Curated tracks, playlists, artists, genres, and mood presets
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Collapsible sleek navigation sidebar
│   │   └── Topbar.jsx           # Global topbar with search, shortcuts, and user profile
│   ├── cards/
│   │   ├── MusicCard.jsx        # Reusable track card with play/pause and like states
│   │   ├── PlaylistCard.jsx     # Curated playlist card
│   │   ├── ArtistCard.jsx       # Artist portrait with listener stats
│   │   ├── GenreCard.jsx        # Angled vibrant genre card
│   │   └── MoodCard.jsx         # Mood station card
│   ├── home/
│   │   ├── HeroSection.jsx      # Dynamic greeting, headline, and spinning vinyl disc
│   │   └── HomePage.jsx         # Dashboard with horizontal scrolling rows
│   ├── ai/
│   │   ├── AIDJStudio.jsx       # Personal AI DJ workstation
│   │   ├── AIMusicAssistant.jsx # Conversational AI copilot with embedded playable songs
│   │   └── AIPlaylistGenerator.jsx # Prompt & mood-based playlist architect
│   ├── search/
│   │   └── SearchPage.jsx       # Live music search, suggestions, and top match card
│   ├── explore/
│   │   └── ExplorePage.jsx      # Mood discovery radar and genre stations
│   ├── library/
│   │   ├── LibraryPage.jsx      # Liked songs, custom playlists, and recents
│   │   └── CreatePlaylistModal.jsx # Playlist creation modal
│   └── player/
│       ├── MusicPlayer.jsx      # Persistent bottom audio player with seekbar and visualizer
│       ├── NowPlayingModal.jsx  # Fullscreen expanded Now Playing modal
│       └── QueueDrawer.jsx      # Slide-out current playback queue
├── App.jsx                      # App root layout and dynamic page routing
├── App.css                      # Complete styling, animations, and responsive rules
└── index.css                    # Design tokens, variables, and typography
```

---

## 📄 License
This project is open-source under the MIT License.
