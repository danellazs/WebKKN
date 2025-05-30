import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { supabase } from "../supabase-client";

type TagInputProps = {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

const TagInput = ({ selectedTags, setSelectedTags }: TagInputProps) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("name");
      if (!error && data) {
        setAvailableTags(data.map((tag) => tag.name));
      }
    };
    fetchTags();
  }, []);

  const handleAddTag = (tag: string) => {
    const cleanedTag = tag.trim();
    if (cleanedTag && !selectedTags.includes(cleanedTag)) {
      setSelectedTags([...selectedTags, cleanedTag]);
    }
    setInput("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(input);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(input.toLowerCase()) && !selectedTags.includes(tag)
  );

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.5rem" }}>
        {selectedTags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.25rem 0.5rem",
              background: "#ccc",
              borderRadius: "1rem",
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => handleRemoveTag(tag)}
          >
            {tag} ✕
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Tambahkan tag"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      {filteredSuggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "0.25rem" }}>
          {filteredSuggestions.map((tag) => (
            <li
              key={tag}
              onClick={() => handleAddTag(tag)}
              style={{
                padding: "0.25rem",
                cursor: "pointer",
                background: "#eee",
                marginBottom: "0.25rem",
                borderRadius: "0.25rem",
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
