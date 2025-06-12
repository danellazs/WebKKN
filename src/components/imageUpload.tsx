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
    <div className="image-upload">
      <label className="image-upload-label">
        Upload Gambar:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button type="button" onClick={clearImage} className="image-clear-button">
            Hapus Gambar
          </button>
        </div>
      )}
    </div>
  );
};



export default ImageUpload;
