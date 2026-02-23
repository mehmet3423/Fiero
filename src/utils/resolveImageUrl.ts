/** Placeholder görsel yolu - public klasöründe mevcut olmalı */
export const NO_IMAGE_PATH = "/assets/site/images/no-image.svg";

/**
 * onError handler'da kullanılacak data URI - HTTP isteği yapmaz,
 * sonsuz 404 döngüsünü önler.
 */
export const PLACEHOLDER_IMAGE_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='10' font-family='sans-serif'%3E?%3C/text%3E%3C/svg%3E";

export const resolveImageUrl = (url?: string) => {
  // Returns placeholder if url is empty or equals the special "no_url" value
  return !url || url === "no_url" ? NO_IMAGE_PATH : url;
};
