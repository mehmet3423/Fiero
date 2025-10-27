import { useState } from "react";
import toast from "react-hot-toast";

interface UseCloudinaryImageUploadResult {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    imageUrl: string;
    setImageUrl: (url: string) => void;
    uploadImage: () => Promise<string | null>;
    isUploading: boolean;
}

export function useCloudinaryImageUpload(): UseCloudinaryImageUploadResult {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (): Promise<string | null> => {
        if (!selectedFile) {
            toast.error("Lütfen bir görsel seçin");
            return null;
        }
        if (selectedFile.size > 10000000) {
            toast.error("Dosya boyutu çok büyük (max 10MB)");
            return null;
        }
        if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(selectedFile.type)) {
            toast.error("Sadece JPG, JPEG ve PNG formatları desteklenir");
            return null;
        }
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
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
                throw new Error("Görsel yüklenemedi");
            }
            const data = await response.json();
            setImageUrl(data.secure_url);
            toast.success("Görsel başarıyla yüklendi");
            return data.secure_url;
        } catch (error) {
            toast.error("Görsel yüklenirken bir hata oluştu");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        selectedFile,
        setSelectedFile,
        imageUrl,
        setImageUrl,
        uploadImage,
        isUploading,
    };
} 