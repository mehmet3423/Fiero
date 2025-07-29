import React, { useState } from "react";
import { UpdatedReview } from "@/constants/models/UpdatedReview";
import Image from "next/image";

interface UpdateCommentProps {
  review: UpdatedReview;
  onSave: (updatedReview: UpdatedReview) => void;
  onCancel: () => void;
}

const UpdateComment: React.FC<UpdateCommentProps> = ({
  review,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.content);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(review.imageUrl);
  const [rating, setRating] = useState(review.rating);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    onSave({ id: review.id, title, content, imageUrl: preview, rating });
  };

  return (
    <div
      className="update-comment"
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Edit Review</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Content"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={100}
          height={100}
          style={{
            marginBottom: "10px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      )}
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min="1"
        max="5"
        placeholder="Rating"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateComment;
