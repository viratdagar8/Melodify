import { X, Trash2, Music } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const QueueDrawer = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    currentTrack,
    playTrack,
    removeFromQueue
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="queue-drawer-panel">
      <div className="queue-drawer-header">
        <div className="queue-title-row">
          <Music size={18} className="text-violet-400" />
          <h3>Current Playback Queue</h3>
          <span className="queue-badge">{queue.length} tracks</span>
        </div>
        <button
          className="queue-close-btn"
          onClick={() => setIsQueueOpen(false)}
          aria-label="Close Queue"
        >
          <X size={18} />
        </button>
      </div>

      <div className="queue-drawer-list">
        {queue.length === 0 ? (
          <p className="empty-queue-text">Your queue is empty.</p>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`queue-item-row ${isCurrent ? "current-playing" : ""}`}
                onClick={() => playTrack(track, queue)}
              >
                <span className="queue-idx">{idx + 1}</span>
                <img
                  src={track.image}
                  alt={track.title}
                  className="queue-art"
                />
                <div className="queue-info">
                  <p className="queue-title">{track.title}</p>
                  <span className="queue-artist">{track.artist}</span>
                </div>
                {isCurrent ? (
                  <span className="queue-now-pill">NOW</span>
                ) : (
                  <button
                    className="queue-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(idx);
                    }}
                    title="Remove from queue"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
