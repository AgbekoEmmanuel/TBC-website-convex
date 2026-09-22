/**
 * Optimizes and compresses an image in the browser before uploading to Convex storage.
 * Resizes large smartphone/camera photos (e.g. 5MB-20MB) to a maximum dimension of 1400px
 * and compresses them to JPEG at 85% quality, reducing file size by 90-95% (to ~150KB-300KB)
 * in milliseconds. This makes uploads virtually instantaneous.
 */
export async function optimizeImageForUpload(
  file: File,
  maxDimension = 1400,
  quality = 0.85
): Promise<{ blob: Blob; contentType: string }> {
  // If not a standard compressable image format, return raw file
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return { blob: file, contentType: file.type };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ blob: file, contentType: file.type });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve({ blob, contentType: "image/jpeg" });
            } else {
              resolve({ blob: file, contentType: file.type });
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        resolve({ blob: file, contentType: file.type });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({ blob: file, contentType: file.type });
    };

    reader.readAsDataURL(file);
  });
}
