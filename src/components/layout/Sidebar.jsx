import {
  Home,
  Search,
  Compass,
  Library,
  Heart,
  PlusSquare,
  Radio,
  Bot,
  ChevronLeft,
  ChevronRight,
  Music2,
  Sparkles
} from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const Sidebar = ({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  onOpenCreatePlaylist
}) => {
  const { userPlaylists, likedTrackIds } = usePlayer();

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "library", label: "Your Library", icon: Library },
  ];

  const aiItems = [
    { id: "aidj", label: "AI DJ Studio", icon: Radio, badge: "LIVE" },
    { id: "assistant", label: "AI Assistant", icon: Bot, badge: "AI" },
    { id: "aigenerator", label: "Playlist Gen", icon: Sparkles, badge: "NEW" },
  ];

  const libraryItems = [
    { id: "liked", label: "Liked Songs", icon: Heart, count: likedTrackIds.size },
  ];

  return (
    <aside className={`melodify-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper">
        <div
          className="sidebar-brand"
          onClick={() => setActivePage("home")}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-box">
            <img src="/logo.jpg" alt="Melodify Logo" className="brand-logo-img" />
          </div>

          {!isCollapsed && (
            <div className="brand-text">
              <span className="brand-title">
                MELOD<span className="brand-gradient-text">IFY</span>
              </span>
              <span className="brand-sub">Feel The Music</span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-scrollable-content">
        <nav className="sidebar-nav-group">
          {!isCollapsed && <span className="sidebar-section-title">DISCOVER</span>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="nav-icon" />
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                {isActive && <div className="active-pill-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* AI Features Group */}
        <div className="sidebar-nav-group ai-group">
          {!isCollapsed && (
            <div className="sidebar-section-header">
              <span className="sidebar-section-title ai-glow-title">AI SOUND LAB</span>
            </div>
          )}
          {aiItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ai-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="ai-icon-wrapper">
                  <Icon size={19} className="nav-icon" />
                </div>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    <span className={`ai-badge ${item.badge.toLowerCase()}`}>
                      {item.badge}
                    </span>
                  </>
                )}
                {isActive && <div className="active-pill-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Library & Playlists Group */}
        <div className="sidebar-nav-group">
          {!isCollapsed && <span className="sidebar-section-title">COLLECTIONS</span>}

          {libraryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActivePage(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="liked-songs-icon-box">
                  <Icon size={16} fill="white" color="white" />
                </div>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    <span className="badge-count">{item.count}</span>
                  </>
                )}
              </button>
            );
          })}

          <button
            className="sidebar-nav-item create-playlist-btn"
            onClick={onOpenCreatePlaylist}
            title={isCollapsed ? "Create Playlist" : undefined}
          >
            <div className="create-icon-box">
              <PlusSquare size={18} />
            </div>
            {!isCollapsed && <span className="nav-label">Create Playlist</span>}
          </button>
        </div>

        {/* User Playlists List */}
        {!isCollapsed && (
          <div className="sidebar-playlists-section">
            <span className="sidebar-section-title">YOUR PLAYLISTS</span>
            <div className="sidebar-playlists-list">
              {userPlaylists.map((pl) => (
                <button
                  key={pl.id}
                  className="sidebar-playlist-item"
                  onClick={() => setActivePage("library")}
                >
                  <div className="playlist-mini-art">
                    <Music2 size={13} style={{ color: pl.color || "var(--accent-primary)" }} />
                  </div>
                  <div className="playlist-mini-info">
                    <span className="playlist-mini-title">{pl.title}</span>
                    <span className="playlist-mini-meta">{pl.songCount} songs</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Futuristic Bottom Vibe Badge */}
      {!isCollapsed && (
        <div className="sidebar-footer-card">
          <div className="footer-vibe-glow" />
          <div className="footer-content">
            <div className="footer-pulse-dot" />
            <div>
              <p className="footer-title">Lossless Studio Flow</p>
              <p className="footer-sub">Audio Engine 2.4 Active</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
