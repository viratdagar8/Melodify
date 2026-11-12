import { useState } from "react";
import { X, Plus, Music2 } from "lucide-react";
import { usePlayer } from "../../context/PlayerContext";

export const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const { createPlaylist } = usePlayer();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createPlaylist(title, description);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="create-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Music2 size={20} className="text-violet-400" />
            <h3>Create Playlist</h3>
          </div>
          <button className="modal-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-group">
            <label>Playlist Name</label>
            <input
              type="text"
              placeholder="e.g. Midnight Cyberpunk Session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="modal-form-group">
            <label>Description (Optional)</label>
            <textarea
              rows="3"
              placeholder="Give your playlist a mood or backstory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-create-btn"
              disabled={!title.trim()}
            >
              <Plus size={16} />
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
