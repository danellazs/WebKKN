import type { ChangeEvent } from "react";

export interface ImageUploadProps {
  image: File | null;
  imagePreview: string | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUpload = ({
  imagePreview,
  setImage,
  setImagePreview,
}: ImageUploadProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Upload Gambar:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {imagePreview && (
        <div style={{ marginTop: "0.5rem", position: "relative" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              borderRadius: "0.5rem",
              display: "block",
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "0.3rem 0.6rem",
              borderRadius: "0.3rem",
              cursor: "pointer",
            }}
          >
            Hapus Gambar
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
