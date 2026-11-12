import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
  Menu,
  Radio,
  SlidersHorizontal,
  X
} from "lucide-react";

export const Topbar = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  activePage,
  setActivePage,
  onToggleMobileSidebar
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <header className="melodify-topbar">
      <div className="topbar-left">
        {/* Mobile menu trigger */}
        <button
          className="topbar-mobile-btn md:hidden"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Browser-like history navigation */}
        <div className="topbar-nav-arrows">
          <button
            className="nav-arrow-btn"
            onClick={() => setActivePage("home")}
            disabled={activePage === "home"}
            title="Go to Home"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="nav-arrow-btn"
            onClick={() => setActivePage("search")}
            disabled={activePage === "search"}
            title="Go to Search"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Global Search Input */}
        <form
          className={`topbar-search-form ${isFocused ? "focused" : ""}`}
          onSubmit={handleSubmit}
        >
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tracks, artists, moods, synthwave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="topbar-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={handleClear}
            >
              <X size={15} />
            </button>
          )}
        </form>
      </div>

      <div className="topbar-right">
        {/* Quick Shortcut Pills */}
        <div className="topbar-shortcuts">
          <button
            className={`topbar-pill ${activePage === "aidj" ? "active" : ""}`}
            onClick={() => setActivePage("aidj")}
          >
            <Radio size={14} className="text-violet-400" />
            <span>AI DJ Studio</span>
          </button>

          <button
            className={`topbar-pill ${activePage === "assistant" ? "active" : ""}`}
            onClick={() => setActivePage("assistant")}
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Notifications & Settings */}
        <button
          className="topbar-icon-btn"
          title="Audio Engine Status"
          onClick={() => setActivePage("aidj")}
        >
          <SlidersHorizontal size={18} />
        </button>

        <button
          className="topbar-icon-btn notification-btn"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* User Profile */}
        <div className="topbar-profile" title="Virat Dagar · Melodify Premium">
          <div className="profile-avatar">
            <span>VD</span>
            <span className="profile-status-dot" />
          </div>
          <div className="profile-info-compact">
            <span className="profile-name">Virat</span>
            <span className="profile-badge">PRO</span>
          </div>
        </div>
      </div>
    </header>
  );
};
