import { searchTracks } from "./jamendoApi";
import { searchJioSaavnTracks } from "./jiosaavnApi";
import { FALLBACK_AUDIO_TRACKS } from "../data/mockData";

export const searchMelodifyTracks = async (query, limit = 24) => {
  if (!query?.trim()) return FALLBACK_AUDIO_TRACKS;

  const [jioResults, jamendoResults] = await Promise.all([
    searchJioSaavnTracks(query, limit),
    searchTracks(query, limit),
  ]);

  // Jamendo may return mock fallback tracks when it has no matches.
  const realJamendoResults = jamendoResults.filter(
    (track) => track.source === "Jamendo" && track.audio
  );

  // Show JioSaavn first, then Jamendo.
  const combined = [...jioResults, ...realJamendoResults];

  // Avoid duplicate tracks.
  const uniqueTracks = Array.from(
    new Map(combined.map((track) => [track.id, track])).values()
  );

  return uniqueTracks.length > 0
    ? uniqueTracks.slice(0, limit)
    : FALLBACK_AUDIO_TRACKS;
};