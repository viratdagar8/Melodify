import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Compass, Headphones, Disc3 } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { MusicCard } from "../cards/MusicCard";
import { PlaylistCard } from "../cards/PlaylistCard";
import { ArtistCard } from "../cards/ArtistCard";
import { GenreCard } from "../cards/GenreCard";
import {
  FALLBACK_AUDIO_TRACKS,
  CURATED_PLAYLISTS,
  POPULAR_ARTISTS,
  GENRE_CATEGORIES
} from "../../data/mockData";
import { searchTracks, getTrendingTracks } from "../../api/jamendoApi";
import { usePlayer } from "../../context/PlayerContext";

// Top-level SectionRow component with scroll buttons
const SectionRow = ({ title, subtitle, icon: Icon, children }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="home-section">
      <div className="section-header">
        <div className="section-header-titles">
          <div className="section-title-with-icon">
            {Icon && <Icon size={20} className="section-title-icon text-violet-400" />}
            <h2 className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="section-scroll-controls">
          <button
            className="scroll-btn left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="scroll-btn right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="horizontal-scroll-container" ref={scrollContainerRef}>
        {children}
      </div>
    </section>
  );
};

export const HomePage = ({
  onNavigateAIDJ,
  onNavigateExplore,
  onSelectGenre,
  onSelectArtist,
  onSelectPlaylist
}) => {
  const { recentlyPlayed } = usePlayer();

  const [trendingTracks, setTrendingTracks] = useState(FALLBACK_AUDIO_TRACKS);
  const [madeForYouTracks, setMadeForYouTracks] = useState(FALLBACK_AUDIO_TRACKS);
  const [aiRecommendedTracks, setAiRecommendedTracks] = useState(FALLBACK_AUDIO_TRACKS);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [trending, madeForYou, aiRecs] = await Promise.all([
          getTrendingTracks(10),
          searchTracks("electronic", 8),
          searchTracks("chill", 8)
        ]);

        if (isMounted) {
          if (trending && trending.length > 0) setTrendingTracks(trending);
          if (madeForYou && madeForYou.length > 0) setMadeForYouTracks(madeForYou);
          if (aiRecs && aiRecs.length > 0) setAiRecommendedTracks(aiRecs);
        }
      } catch (err) {
        console.warn("Home data fetch fallback:", err.message);
      }
    };

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="melodify-home-page">
      {/* 1. Hero Section */}
      <HeroSection
        onNavigateAIDJ={onNavigateAIDJ}
        onNavigateExplore={onNavigateExplore}
      />

      {/* 2. Made For You */}
      <SectionRow
        title="Made For You"
        subtitle="Curated by Melodify algorithm based on your listening vibe"
        icon={Sparkles}
      >
        {madeForYouTracks.map((track) => (
          <MusicCard key={track.id} track={track} queue={madeForYouTracks} />
        ))}
      </SectionRow>

      {/* 3. Trending Now */}
      <SectionRow
        title="Trending Now"
        subtitle="Global top streams and viral underground sensations"
        icon={TrendingUp}
      >
        {trendingTracks.map((track) => (
          <MusicCard key={track.id} track={track} queue={trendingTracks} />
        ))}
      </SectionRow>

      {/* 4. Recently Played */}
      {recentlyPlayed && recentlyPlayed.length > 0 && (
        <SectionRow
          title="Recently Played"
          subtitle="Jump back into your recent audio streams"
          icon={Headphones}
        >
          {recentlyPlayed.map((track) => (
            <MusicCard key={`rec-${track.id}`} track={track} queue={recentlyPlayed} />
          ))}
        </SectionRow>
      )}

      {/* 5. Popular Artists */}
      <SectionRow
        title="Popular Artists"
        subtitle="Featured creators shaping the electronic and indie landscape"
        icon={Disc3}
      >
        {POPULAR_ARTISTS.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onSelect={onSelectArtist}
          />
        ))}
      </SectionRow>

      {/* 6. Explore Genres */}
      <SectionRow
        title="Explore Genres"
        subtitle="Dive into sonic frequencies across the spectrum"
        icon={Compass}
      >
        {GENRE_CATEGORIES.map((genre) => (
          <GenreCard
            key={genre.id}
            genre={genre}
            onSelect={onSelectGenre}
          />
        ))}
      </SectionRow>

      {/* 7. Your Playlists & Curated Playlists */}
      <SectionRow
        title="Featured & Community Playlists"
        subtitle="Handcrafted mixtapes and algorithmic mood sets"
        icon={Sparkles}
      >
        {CURATED_PLAYLISTS.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onSelect={onSelectPlaylist}
          />
        ))}
      </SectionRow>

      {/* 8. AI Recommended For You */}
      <SectionRow
        title="AI Recommended For You"
        subtitle="Synthesized recommendations tuned to deep focus and flow"
        icon={Sparkles}
      >
        {aiRecommendedTracks.map((track) => (
          <MusicCard key={`ai-${track.id}`} track={track} queue={aiRecommendedTracks} />
        ))}
      </SectionRow>
    </div>
  );
};
