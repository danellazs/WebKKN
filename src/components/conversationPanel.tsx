import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

interface Comment {
  id: string;
  message: string;
  created_at: string;
  users: {
    name: string;
  };
}

const ConversationPanel = ({
  storyId,
  onClose,
}: {
  storyId: number;
  onClose: () => void;
}) => {

  const session = useContext(SessionContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("conversation")
      .select("id, message, created_at, users(name)")
      .eq("story_id", storyId)
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
      story_id: storyId,
      user_id: session.user.id,
      message: newComment,
    });

    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
      <h4>Diskusi</h4>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {comments.map((c) => (
          <div key={c.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.users?.name ?? "Anonim"}:</strong> {c.message}
            <div style={{ fontSize: "0.75rem", color: "#666" }}>{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <textarea
        placeholder="Tulis komentar..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
      <button onClick={handleSubmit} style={{ marginTop: "0.5rem" }}>
        Kirim
      </button>
      <button onClick={onClose}>Tutup</button>
    </div>
  );
};

export default ConversationPanel;
