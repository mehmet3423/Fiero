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
    <form
      className="review-form"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "2rem",
        borderRadius: "8px",
        marginTop: "2rem",
        border: "1px solid #dee2e6",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      onSubmit={handleSubmit}
    >
      <h3
        style={{
          color: "#333",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "600",
        }}
      >
        Yorum Yap
      </h3>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="title"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#333",
            fontWeight: "500",
          }}
        >
          Başlık
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yorum başlığı girin"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="content"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#333",
            fontWeight: "500",
          }}
        >
          Yorum
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Yorumunuzu yazın"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "1rem",
            minHeight: "120px",
            resize: "vertical",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="rating"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#333",
            fontWeight: "500",
          }}
        >
          Puan
        </label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "active" : ""}`}
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
      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="imageFile"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#333",
            fontWeight: "500",
          }}
        >
          Fotoğraf Yükle (Opsiyonel)
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ced4da",
            borderRadius: "4px",
          }}
        />
        {imagePreview && (
          <div
            style={{
              position: "relative",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
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
                border: "1px solid #dee2e6",
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
        }}
      >
        {userRole === UserRole.CUSTOMER ? (
          <button
            type="submit"
            style={{
              backgroundColor: "#000",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#000")
            }
          >
            Gönder
          </button>
        ) : (
          <p
            style={{
              color: "red",
              margin: 0,
              fontSize: "0.9rem",
            }}
          >
            Yorum yapabilmek için kaydolmanız gerekmektedir.
          </p>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
