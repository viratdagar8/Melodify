import { useState } from "react";
import { PlayerProvider } from "./context/PlayerContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { HomePage } from "./components/home/HomePage";
import { SearchPage } from "./components/search/SearchPage";
import { ExplorePage } from "./components/explore/ExplorePage";
import { LibraryPage } from "./components/library/LibraryPage";
import { AIDJStudio } from "./components/ai/AIDJStudio";
import { AIMusicAssistant } from "./components/ai/AIMusicAssistant";
import { AIPlaylistGenerator } from "./components/ai/AIPlaylistGenerator";
import { MusicPlayer } from "./components/player/MusicPlayer";
import { NowPlayingModal } from "./components/player/NowPlayingModal";
import { QueueDrawer } from "./components/player/QueueDrawer";
import { CreatePlaylistModal } from "./components/library/CreatePlaylistModal";
import "./App.css";

function MelodifyApp() {
  const [activePage, setActivePage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  // Search submission from Topbar
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setActivePage("search");
  };

  // Genre selection from Home or Explore
  const handleSelectGenre = (genre) => {
    setSearchQuery(genre.name);
    setActivePage("search");
  };

  // Artist selection
  const handleSelectArtist = (artist) => {
    setSearchQuery(artist.name);
    setActivePage("search");
  };

  // Mobile menu close on navigation
  const handleNavigate = (page) => {
    setActivePage(page);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className={`melodify-app-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`sidebar-container ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
        <Sidebar
          activePage={activePage}
          setActivePage={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Topbar */}
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          activePage={activePage}
          setActivePage={handleNavigate}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="melodify-main-viewport">
          {activePage === "home" && (
            <HomePage
              onNavigateAIDJ={() => handleNavigate("aidj")}
              onNavigateExplore={() => handleNavigate("explore")}
              onSelectGenre={handleSelectGenre}
              onSelectArtist={handleSelectArtist}
            />
          )}

          {activePage === "search" && (
            <SearchPage initialQuery={searchQuery} />
          )}

          {activePage === "explore" && (
            <ExplorePage onSelectGenre={handleSelectGenre} />
          )}

          {(activePage === "library" || activePage === "liked") && (
            <LibraryPage
              onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
            />
          )}

          {activePage === "aidj" && (
            <AIDJStudio />
          )}

          {activePage === "assistant" && (
            <AIMusicAssistant />
          )}

          {activePage === "aigenerator" && (
            <AIPlaylistGenerator />
          )}
        </main>
      </div>

      {/* Persistent Bottom Audio Player */}
      <MusicPlayer />

      {/* Slide-out Queue Panel */}
      <QueueDrawer />

      {/* Fullscreen Expanded Now Playing View */}
      <NowPlayingModal />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MelodifyApp />
    </PlayerProvider>
  );
}
