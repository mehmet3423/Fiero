import { UserRole } from "@/constants/enums/UserRole";
import { useAuth } from "@/hooks/context/useAuth";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const ReviewForm = ({
  productId,
  onSubmit,
}: {
  productId: string;
  onSubmit: (review: any) => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userRole } = useAuth();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10000000) {
        toast.error("Dosya boyutu çok büyük (max 10MB)");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Sadece JPG, JPEG ve PNG formatları desteklenir");
        return;
      }
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !content || !rating) {
      toast.error("Başlık, içerik ve puan zorunludur.");
      return;
    }

    try {
      let uploadedImageUrl = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || ""
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Resim yüklenemedi");
        }

        const data = await response.json();
        uploadedImageUrl = data.secure_url;
      }

      const review = {
        title,
        content,
        rating,
        imageUrl: uploadedImageUrl,
        productId,
      };

      onSubmit(review);

      setTitle("");
      setContent("");
      setRating(5);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Yorum gönderilirken bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group mb-3">
        <label>Başlık</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            outline: "none",
            boxShadow: "none",
            border: "1px solid #ced4da",
          }}
        />
      </div>
      <div className="form-group mb-3">
        <label>Yorum</label>
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{
            outline: "none",
            boxShadow: "none",
            border: "1px solid #ced4da",
          }}
        ></textarea>
      </div>
      <div className="form-group mb-3">
        <label>Puan</label>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRatingChange(star)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                color: star <= rating ? "#fcb941" : "#ccc",
                marginRight: "5px",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="form-group mb-3">
        <label>Fotoğraf (opsiyonel)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
        />
        {imagePreview && (
          <div style={{ marginTop: "10px" }}>
            <Image
              width={200}
              height={150}
              src={imagePreview}
              alt="Preview"
              style={{
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              title="Resmi kaldır"
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
      {userRole === UserRole.CUSTOMER ? (
        <button type="submit" className="btn btn-dark">
          Gönder
        </button>
      ) : (
        <p style={{ color: "red" }}>
          Yorum yapabilmek için kaydolmanız gerekmektedir.
        </p>
      )}
    </form>
  );
};

export default ReviewForm;
