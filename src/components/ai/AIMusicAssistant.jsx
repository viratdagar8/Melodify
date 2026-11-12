import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Play,
  RotateCcw,
  User
} from "lucide-react";
import { FALLBACK_AUDIO_TRACKS, INITIAL_ASSISTANT_MESSAGES } from "../../data/mockData";
import { usePlayer } from "../../context/PlayerContext";

export const AIMusicAssistant = () => {
  const { playTrack } = usePlayer();

  const [messages, setMessages] = useState(INITIAL_ASSISTANT_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    "Play something energetic",
    "Suggest relaxing songs",
    "Find songs similar to my favourites",
    "Create a playlist for studying",
    "Suggest songs for a long drive"
  ];

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Generate responsive contextual AI answer
    setTimeout(() => {
      let responseText = "";
      let recommendedTracks = [];

      const lower = text.toLowerCase();
      if (lower.includes("energetic") || lower.includes("workout") || lower.includes("party")) {
        responseText = "I've synthesized high-energy tracks with pulsing synth bass and driving BPMs. Here are the top matches:";
        recommendedTracks = [FALLBACK_AUDIO_TRACKS[1], FALLBACK_AUDIO_TRACKS[5], FALLBACK_AUDIO_TRACKS[3]];
      } else if (lower.includes("relax") || lower.includes("chill") || lower.includes("sleep")) {
        responseText = "Here is a calming acoustic and lo-fi selection engineered with gentle chord progressions to slow your heart rate:";
        recommendedTracks = [FALLBACK_AUDIO_TRACKS[4], FALLBACK_AUDIO_TRACKS[7], FALLBACK_AUDIO_TRACKS[2]];
      } else if (lower.includes("stud") || lower.includes("focus") || lower.includes("work")) {
        responseText = "Loaded alpha-wave study rhythms with minimal lyrical distraction to help you lock into flow state:";
        recommendedTracks = [FALLBACK_AUDIO_TRACKS[2], FALLBACK_AUDIO_TRACKS[0], FALLBACK_AUDIO_TRACKS[4]];
      } else if (lower.includes("drive") || lower.includes("road")) {
        responseText = "Nothing beats neon retro synthwave for an open highway at dusk. Check out these highway anthems:";
        recommendedTracks = [FALLBACK_AUDIO_TRACKS[1], FALLBACK_AUDIO_TRACKS[0], FALLBACK_AUDIO_TRACKS[3]];
      } else {
        responseText = `Understood! Curated a custom acoustic-electronic blend tailored to "${text}":`;
        recommendedTracks = [FALLBACK_AUDIO_TRACKS[0], FALLBACK_AUDIO_TRACKS[3], FALLBACK_AUDIO_TRACKS[6]];
      }

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        tracks: recommendedTracks,
        timestamp: "Just now"
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1100);
  };

  const handleReset = () => {
    setMessages(INITIAL_ASSISTANT_MESSAGES);
  };

  return (
    <div className="ai-assistant-page">
      {/* Assistant Header */}
      <div className="assistant-header">
        <div className="assistant-header-info">
          <div className="assistant-avatar-glow">
            <Bot size={24} className="text-violet-300" />
            <span className="assistant-online-ring" />
          </div>
          <div>
            <div className="assistant-name-row">
              <h2>Melodify AI Music Copilot</h2>
              <span className="copilot-badge">Neural v2.4</span>
            </div>
            <p className="assistant-sub">Ask for vibes, activities, moods, or custom acoustic curation</p>
          </div>
        </div>

        <button className="reset-chat-btn" onClick={handleReset} title="Reset chat conversation">
          <RotateCcw size={16} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="prompt-chips-bar">
        <span className="chips-label">Try asking:</span>
        <div className="chips-scroll">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              className="prompt-chip"
              onClick={() => handleSendMessage(prompt)}
            >
              <Sparkles size={12} className="text-violet-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
          >
            {msg.sender === "assistant" && (
              <div className="chat-avatar-box ai">
                <Bot size={18} />
              </div>
            )}

            <div className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}>
              <p className="bubble-text">{msg.text}</p>

              {/* Playable songs inside message */}
              {msg.tracks && msg.tracks.length > 0 && (
                <div className="bubble-track-list">
                  {msg.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="bubble-track-item"
                      onClick={() => playTrack(track, msg.tracks)}
                    >
                      <img src={track.image} alt={track.title} className="bubble-track-art" />
                      <div className="bubble-track-info">
                        <span className="bubble-track-title">{track.title}</span>
                        <span className="bubble-track-artist">{track.artist}</span>
                      </div>
                      <button className="bubble-track-play">
                        <Play size={14} className="fill-current text-white translate-x-0.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <span className="bubble-timestamp">{msg.timestamp}</span>
            </div>

            {msg.sender === "user" && (
              <div className="chat-avatar-box user">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble-row ai-row">
            <div className="chat-avatar-box ai">
              <Bot size={18} />
            </div>
            <div className="chat-bubble ai-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Describe what you want to hear (e.g. 'Chill beats for late night coding in the rain')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="chat-text-input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!inputText.trim()}
          aria-label="Send prompt"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
