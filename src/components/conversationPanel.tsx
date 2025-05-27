import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

import type { Story } from "../types/story"; // sudah disatukan definisinya


interface Comment {
  id: string;
  message: string;
  created_at: string;
  users: {
    name: string;
    isLocal: boolean;
  };
}

const ConversationPanel = ({
  story,
  onClose,
}: {
  story: Story;
  onClose: () => void;
}) => {
  const session = useContext(SessionContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [story.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("conversation")
      .select("id, message, created_at, users(name, isLocal)")
      .eq("story_id", story.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const normalized = data.map((item: any) => ({
        ...item,
        users: Array.isArray(item.users) ? item.users[0] : item.users,
      }));

      setComments(normalized);
    }
  };

  const handleSubmit = async () => {
    if (!session || !newComment.trim()) return;

    const { error } = await supabase.from("conversation").insert({
      story_id: story.id,
      user_id: session.user.id,
      message: newComment,
    });

    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="conversation-overlay">
      <div className="conversation-modal">
        <button onClick={onClose} className="conversation-closeBtn" aria-label="Close">
          &times;
        </button>
        
        {/* Informasi Story */}
        <div className="conversation-story">
          <strong>{story.location_name ?? "Tanpa Nama Lokasi"}</strong><br />
          <em>oleh: {story.users?.name ?? "Anonim"}</em><br />
          {story.content}<br />
          {story.image_url && (
            <img src={story.image_url} alt="Story" className="conversation-story-image" />
          )}
        </div>

        <h4>Diskusi</h4>
        <div className="conversation-comments">
          {comments.map((c) => (
            <div key={c.id} className="conversation-comment">
              <strong>
                {c.users?.name ?? "Anonim"}
                {c.users?.isLocal && (
                  <span className="conversation-badge">Local</span>
                )}
                :
              </strong>{" "}
              {c.message}
              <div className="conversation-time">
                {new Date(c.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <textarea
          className="conversation-input"
          placeholder="Tulis komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSubmit} className="conversation-sendBtn">
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ConversationPanel;
