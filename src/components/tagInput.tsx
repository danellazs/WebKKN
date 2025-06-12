import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import { supabase } from "../supabase-client";

type TagInputProps = {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

const TagInput = ({ selectedTags, setSelectedTags }: TagInputProps) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
    setTimeout(() => setIsFocused(false), 100);
  };

  const filteredSuggestions = availableTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(input.toLowerCase()) &&
        !selectedTags.includes(tag)
    )
    .slice(0, 3);

  return (
    <div className="tag-input-container">
      <div className="tag-list">
        {selectedTags.map((tag) => (
          <span key={tag} className="tag-pill" onClick={() => handleRemoveTag(tag)}>
            {tag} ✕
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Tambahkan tag dan tekan Enter"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="tag-input-field"
      />
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="tag-suggestions">
          {filteredSuggestions.map((tag) => (
            <li key={tag} onClick={() => handleAddTag(tag)}>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
