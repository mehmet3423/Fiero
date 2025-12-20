export const resolveImageUrl = (url?: string) => {
  // Returns placeholder if url is empty or equals the special "no_url" value
  return !url || url === "no_url" ? "/assets/images/no-image.jpg" : url;
};
