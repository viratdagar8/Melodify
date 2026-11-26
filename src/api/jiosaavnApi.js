// MELODIFY — JioSaavn API Service

const BASE_URL = "http://127.0.0.1:5100";

const formatJioSaavnTrack = (track) => ({
  id: `jiosaavn-${track.id}`,
  originalId: track.id,
  title: track.song || "Unknown Song",
  artist:
    track.primary_artists ||
    track.singers ||
    track.music ||
    "Unknown Artist",
  album: track.album || "Single",
  image: track.image || "",
  audio: track.media_url || track.vlink || "",
  duration: Number(track.duration) || 180,
  source: "JioSaavn",
  hasPlayableAudio: Boolean(track.media_url || track.vlink),
  language: track.language || "Unknown",
  songUrl: track.perma_url || "",
});

export const searchJioSaavnTracks = async (query, limit = 20) => {
  if (!query?.trim()) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `${BASE_URL}/result/?query=${encodeURIComponent(query.trim())}`;

    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`JioSaavn API error: ${response.status}`);
    }

    const data = await response.json();

    // Your API response is an array of song objects.
    const songs = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.data)
          ? data.data
          : [];

    return songs
      .filter((song) => song.media_url || song.vlink)
      .slice(0, limit)
      .map(formatJioSaavnTrack);
  } catch (error) {
    console.error("JioSaavn search failed:", error);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};