// MELODIFY — Jamendo Music API Service
import { FALLBACK_AUDIO_TRACKS } from "../data/mockData";

const DEFAULT_CLIENT_ID = "8c96364f";
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || DEFAULT_CLIENT_ID;
const BASE_URL = "https://api.jamendo.com/v3.0";

/**
 * Normalizes Jamendo track object into standardized Melodify Track
 */
const formatJamendoTrack = (track) => {
  return {
    id: `jamendo-${track.id}`,
    originalId: track.id,
    title: track.name || "Untitled Track",
    artist: track.artist_name || "Unknown Artist",
    album: track.album_name || "Single",
    image: track.album_image || track.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80",
    audio: track.audio || track.audiodownload || "",
    duration: Number(track.duration) || 180,
    source: "Jamendo",
    hasPlayableAudio: Boolean(track.audio || track.audiodownload),
    license: track.license_ccurl || "Creative Commons"
  };
};

/**
 * Search tracks by keyword or genre tag
 */
export const searchTracks = async (query = "electronic", limit = 20) => {
  if (!query || !query.trim()) {
    return FALLBACK_AUDIO_TRACKS;
  }

  const cleanQuery = query.trim();

  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(cleanQuery)}&audioformat=mp32&include=musicinfo`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Jamendo API HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.headers?.status === "success" && Array.isArray(data.results) && data.results.length > 0) {
      const validTracks = data.results
        .filter((track) => track.audio)
        .map(formatJamendoTrack);

      if (validTracks.length > 0) {
        return validTracks;
      }
    }

    // If query returns no audio items from API, filter fallback tracks smartly
    return filterFallbackTracks(cleanQuery);
  } catch (err) {
    console.warn("Jamendo API request fallback active:", err.message);
    return filterFallbackTracks(cleanQuery);
  }
};

/**
 * Fetch tracks by specific genre tag or vibe
 */
export const getTracksByTag = async (tag = "chill", limit = 15) => {
  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&tags=${encodeURIComponent(tag)}&audioformat=mp32&boost=popularity_month`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Failed to fetch tracks by tag");
    const data = await response.json();

    if (data.headers?.status === "success" && Array.isArray(data.results) && data.results.length > 0) {
      const valid = data.results.filter(t => t.audio).map(formatJamendoTrack);
      if (valid.length > 0) return valid;
    }
    return filterFallbackTracks(tag);
  } catch {
    return filterFallbackTracks(tag);
  }
};

/**
 * Fetch trending tracks of the week
 */
export const getTrendingTracks = async (limit = 12) => {
  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&order=popularity_week&audioformat=mp32`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Failed to fetch trending");
    const data = await response.json();

    if (data.headers?.status === "success" && Array.isArray(data.results) && data.results.length > 0) {
      const valid = data.results.filter(t => t.audio).map(formatJamendoTrack);
      if (valid.length > 0) return valid;
    }
    return FALLBACK_AUDIO_TRACKS;
  } catch {
    return FALLBACK_AUDIO_TRACKS;
  }
};

/**
 * Helper to match fallback tracks by title, artist, genre or mood
 */
function filterFallbackTracks(query) {
  const q = query.toLowerCase();
  const matched = FALLBACK_AUDIO_TRACKS.filter(
    t => t.title.toLowerCase().includes(q) ||
         t.artist.toLowerCase().includes(q) ||
         t.genre.toLowerCase().includes(q) ||
         t.mood.toLowerCase().includes(q)
  );
  return matched.length > 0 ? matched : FALLBACK_AUDIO_TRACKS;
}
