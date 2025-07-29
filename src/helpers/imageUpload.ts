interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
}

interface UploadImageOptions {
    maxSize?: number; // bytes
    allowedTypes?: string[];
}

const defaultOptions: UploadImageOptions = {
    maxSize: 10000000, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
};

export const validateImage = (file: File, options: UploadImageOptions = defaultOptions) => {
    const { maxSize = defaultOptions.maxSize, allowedTypes = defaultOptions.allowedTypes } = options;

    if (file.size > maxSize!) {
        throw new Error(`Dosya boyutu çok büyük (max ${maxSize! / 1000000}MB)`);
    }

    if (!allowedTypes!.includes(file.type)) {
        throw new Error(`Desteklenmeyen dosya formatı. Desteklenen formatlar: ${allowedTypes!.map(type => type.split('/')[1]).join(', ')}`);
    }

    return true;
};

export const uploadImageToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
    try {
        validateImage(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || '');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Resim yüklenemedi');
        }

        const data = await response.json();
        return {
            secure_url: data.secure_url,
            public_id: data.public_id
        };

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Resim yüklenirken bir hata oluştu');
    }
}; 