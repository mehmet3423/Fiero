import {
  NO_IMAGE_PATH,
  PLACEHOLDER_IMAGE_DATA_URI,
  resolveImageUrl,
} from "@/utils/resolveImageUrl";
import React from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Görsel URL - boş, null veya "no_url" ise placeholder kullanılır */
  src?: string | null;
}

/**
 * Kırık veya eksik görseller için varsayılan placeholder kullanan img bileşeni.
 * - src boş/no_url ise NO_IMAGE_PATH kullanılır
 * - Yükleme hatası (onError) durumunda PLACEHOLDER_IMAGE_DATA_URI kullanılır (sonsuz döngü önlenir)
 */
export default function SafeImage({
  src,
  alt = "",
  onError,
  ...rest
}: SafeImageProps) {
  const resolvedSrc = resolveImageUrl(src ?? undefined);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src !== PLACEHOLDER_IMAGE_DATA_URI) {
      target.src = PLACEHOLDER_IMAGE_DATA_URI;
    }
    onError?.(e);
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  );
}

export { NO_IMAGE_PATH, PLACEHOLDER_IMAGE_DATA_URI, resolveImageUrl };
