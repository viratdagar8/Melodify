// MELODIFY — Mock Data & Curated Presets

// High-quality reliable audio samples for guaranteed audio playback
export const FALLBACK_AUDIO_TRACKS = [
  {
    id: "sample-1",
    title: "Neon Horizon",
    artist: "Aura Nova",
    album: "Synthetic Dreams",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    duration: 147,
    genre: "Synthwave",
    mood: "Chill",
    source: "Melodify Originals"
  },
  {
    id: "sample-2",
    title: "Midnight Cyberdrive",
    artist: "Hyperion Drive",
    album: "Neon Odyssey",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3",
    duration: 182,
    genre: "Electronic",
    mood: "Energetic",
    source: "Melodify Originals"
  },
  {
    id: "sample-3",
    title: "Deep Neural Focus",
    artist: "MindPulse",
    album: "Alpha Waves",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3",
    duration: 165,
    genre: "Ambient",
    mood: "Focus",
    source: "Melodify Originals"
  },
  {
    id: "sample-4",
    title: "Solar Euphoria",
    artist: "Kavinsky Waves",
    album: "Daybreak 3000",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_822b392a8e.mp3?filename=summer-chill-hop-9257.mp3",
    duration: 198,
    genre: "Pop",
    mood: "Happy",
    source: "Melodify Originals"
  },
  {
    id: "sample-5",
    title: "Rainy Cafe Lo-Fi",
    artist: "Coffee & Raindrops",
    album: "Midnight Tales",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=chill-lofi-song-8444.mp3",
    duration: 134,
    genre: "Lo-Fi",
    mood: "Relaxed",
    source: "Melodify Originals"
  },
  {
    id: "sample-6",
    title: "Electric Pulse",
    artist: "Starlight Collective",
    album: "Overdrive",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3",
    duration: 172,
    genre: "Party",
    mood: "Party",
    source: "Melodify Originals"
  },
  {
    id: "sample-7",
    title: "Moonlight Memories",
    artist: "Luna Vance",
    album: "After Midnight",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=sad-piano-ambient-140664.mp3",
    duration: 210,
    genre: "Acoustic",
    mood: "Sad",
    source: "Melodify Originals"
  },
  {
    id: "sample-8",
    title: "Velvet Sunset",
    artist: "Echo Mirage",
    album: "Twilight Romance",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=sensual-jazz-hop-7576.mp3",
    duration: 155,
    genre: "R&B",
    mood: "Romantic",
    source: "Melodify Originals"
  }
];

export const CURATED_PLAYLISTS = [
  {
    id: "pl-1",
    title: "Cyberpunk Chillout 2077",
    description: "Atmospheric synths, nocturnal basslines and futuristic downtempo beats.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    songCount: 24,
    creator: "Melodify AI",
    color: "#6D001A",
    tracks: FALLBACK_AUDIO_TRACKS.slice(0, 5)
  },
  {
    id: "pl-2",
    title: "Deep Neural Coding Flow",
    description: "High-focus instrumental rhythms engineered to induce a state of flow.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    songCount: 32,
    creator: "AI DJ Studio",
    color: "#9B1131",
    tracks: [FALLBACK_AUDIO_TRACKS[2], FALLBACK_AUDIO_TRACKS[0], FALLBACK_AUDIO_TRACKS[4], FALLBACK_AUDIO_TRACKS[1]]
  },
  {
    id: "pl-3",
    title: "Midnight Neon Drift",
    description: "Cruising empty city freeways under purple fluorescent skylines.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    songCount: 18,
    creator: "Curated Vibe",
    color: "#b81840",
    tracks: [FALLBACK_AUDIO_TRACKS[1], FALLBACK_AUDIO_TRACKS[5], FALLBACK_AUDIO_TRACKS[3]]
  },
  {
    id: "pl-4",
    title: "Lo-Fi Coffee Sanctuary",
    description: "Warm tape-saturated acoustic chords and mellow rainy vibes.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    songCount: 40,
    creator: "Melodify Editorial",
    color: "#470011",
    tracks: [FALLBACK_AUDIO_TRACKS[4], FALLBACK_AUDIO_TRACKS[7], FALLBACK_AUDIO_TRACKS[2]]
  },
  {
    id: "pl-5",
    title: "Hyper Euphoria Party",
    description: "Festival energy, uplifting bass, and infectious dance rhythms.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    songCount: 28,
    creator: "Melodify AI",
    color: "#6D001A",
    tracks: [FALLBACK_AUDIO_TRACKS[5], FALLBACK_AUDIO_TRACKS[3], FALLBACK_AUDIO_TRACKS[1]]
  }
];

export const POPULAR_ARTISTS = [
  {
    id: "art-1",
    name: "Luna Vance",
    monthlyListeners: "2.4M",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    genre: "Neo-Soul / Ambient",
    verified: true
  },
  {
    id: "art-2",
    name: "Kavinsky Waves",
    monthlyListeners: "4.1M",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    genre: "Synthwave / Retro",
    verified: true
  },
  {
    id: "art-3",
    name: "Aura Nova",
    monthlyListeners: "1.8M",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    genre: "Futuristic Electronic",
    verified: true
  },
  {
    id: "art-4",
    name: "Echo Mirage",
    monthlyListeners: "3.2M",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    genre: "Indie Chillout",
    verified: true
  },
  {
    id: "art-5",
    name: "MindPulse",
    monthlyListeners: "950K",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
    genre: "Cinematic Soundscapes",
    verified: true
  }
];

export const MOOD_CATEGORIES = [
  {
    id: "happy",
    name: "Happy",
    tagline: "Feel-good energy & infectious joy",
    color: "from-red-600 to-rose-400",
    bgGradient: "linear-gradient(135deg, #6D001A 0%, #b81840 100%)",
    icon: "Smile",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    trackFilter: "happy"
  },
  {
    id: "sad",
    name: "Sad",
    tagline: "Emotional melodies & gentle healing",
    color: "from-zinc-900 to-red-950",
    bgGradient: "linear-gradient(135deg, #18181b 0%, #470011 100%)",
    icon: "CloudRain",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
    trackFilter: "sad"
  },
  {
    id: "energetic",
    name: "Energetic",
    tagline: "High-tempo beats & adrenaline rush",
    color: "from-red-700 to-rose-600",
    bgGradient: "linear-gradient(135deg, #6D001A 0%, #dc2626 100%)",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    trackFilter: "energetic"
  },
  {
    id: "relaxed",
    name: "Relaxed",
    tagline: "Serene ambient textures & calm minds",
    color: "from-stone-900 to-red-950",
    bgGradient: "linear-gradient(135deg, #27272a 0%, #6D001A 100%)",
    icon: "Coffee",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    trackFilter: "relaxed"
  },
  {
    id: "focus",
    name: "Focus",
    tagline: "Binaural flow states & study rhythms",
    color: "from-red-950 to-neutral-900",
    bgGradient: "linear-gradient(135deg, #470011 0%, #09090b 100%)",
    icon: "Target",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    trackFilter: "focus"
  },
  {
    id: "romantic",
    name: "Romantic",
    tagline: "Warm soulful chords & intimate vibes",
    color: "from-rose-800 to-red-900",
    bgGradient: "linear-gradient(135deg, #6D001A 0%, #9B1131 100%)",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
    trackFilter: "romantic"
  },
  {
    id: "party",
    name: "Party",
    tagline: "Dancefloor anthems & club bangers",
    color: "from-red-600 to-rose-700",
    bgGradient: "linear-gradient(135deg, #9B1131 0%, #e11d48 100%)",
    icon: "Disc",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80",
    trackFilter: "party"
  },
  {
    id: "chill",
    name: "Chill",
    tagline: "Sun-drenched downtempo & mellow tones",
    color: "from-neutral-900 to-red-950",
    bgGradient: "linear-gradient(135deg, #6D001A 0%, #1c1917 100%)",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    trackFilter: "chill"
  }
];

export const GENRE_CATEGORIES = [
  { id: "synthwave", name: "Synthwave", color: "#6D001A", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80" },
  { id: "electronic", name: "Electronic", color: "#9B1131", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80" },
  { id: "lofi", name: "Lo-Fi Beats", color: "#470011", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80" },
  { id: "pop", name: "Modern Pop", color: "#b81840", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80" },
  { id: "rock", name: "Alternative Rock", color: "#6D001A", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80" },
  { id: "ambient", name: "Deep Ambient", color: "#18181b", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80" },
  { id: "rnb", name: "R&B & Soul", color: "#830021", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" },
  { id: "hiphop", name: "Hip-Hop", color: "#36000c", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80" }
];

export const INITIAL_ASSISTANT_MESSAGES = [
  {
    id: "msg-1",
    sender: "assistant",
    text: "Welcome to Melodify. I am your AI Music Assistant. Tell me what vibe you desire, your current mood, or describe an activity, and I'll curate the perfect soundscape for you.",
    timestamp: "Just now",
    suggestedPrompts: [
      "Play something energetic",
      "Suggest relaxing songs",
      "Find songs similar to my favourites",
      "Create a playlist for studying",
      "Suggest songs for a long drive"
    ]
  }
];

export const DEFAULT_USER_PLAYLISTS = [
  {
    id: "user-pl-1",
    title: "Late Night Coding Sessions",
    songCount: 14,
    color: "#6D001A",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "user-pl-2",
    title: "Weekend Roadtrip Vibes",
    songCount: 22,
    color: "#9B1131",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "user-pl-3",
    title: "Morning Coffee & Velvet",
    songCount: 9,
    color: "#b81840",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80"
  }
];
