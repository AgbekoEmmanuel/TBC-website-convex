/**
 * Bulletproof mobile-first image optimization and upload utilities.
 * Handles smartphone photos (iOS Safari, Android Chrome, desktop) by:
 * 1. Safely resolving MIME types (handles empty types, HEIC/HEIF camera captures).
 * 2. Compressing and resizing huge 10MB-25MB phone photos to ~100KB-250KB in HD quality.
 * 3. Multi-tier decoding (createImageBitmap with fallback to Image element).
 * 4. Safe canvas export (toBlob with iOS Safari toDataURL fallback).
 * 5. Resilient Convex upload with automatic retry, timeout protection, and friendly error messages.
 */

export function getSafeContentType(file: File): string {
  if (file.type && file.type.startsWith("image/")) {
    if (file.type.includes("heic") || file.type.includes("heif")) {
      return "image/jpeg";
    }
    return file.type;
  }
  // Infer from file extension if file.type is empty (common on mobile)
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "svg") return "image/svg+xml";
  return "image/jpeg";
}

function dataURItoBlob(dataURI: string): Blob {
  const parts = dataURI.split(",");
  if (!parts[1]) {
    throw new Error("Invalid data URI");
  }
  const byteString = atob(parts[1]);
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeString = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function calculateDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }
  if (width > height) {
    return {
      width: maxDimension,
      height: Math.round((height * maxDimension) / width),
    };
  } else {
    return {
      width: Math.round((width * maxDimension) / height),
      height: maxDimension,
    };
  }
}

function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
  fallbackFile: File,
  safeType: string
): Promise<{ blob: Blob; contentType: string }> {
  return new Promise((resolve) => {
    let resolved = false;

    // iOS Safari toBlob callback timer guard (if toBlob doesn't trigger within 1.2s)
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const blob = dataURItoBlob(dataUrl);
          resolve({ blob, contentType: "image/jpeg" });
        } catch {
          resolve({ blob: fallbackFile, contentType: safeType });
        }
      }
    }, 1200);

    try {
      canvas.toBlob(
        (blob) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timer);
          if (blob && (blob.size < fallbackFile.size || fallbackFile.size > 500 * 1024)) {
            resolve({ blob, contentType: "image/jpeg" });
          } else {
            resolve({ blob: blob || fallbackFile, contentType: "image/jpeg" });
          }
        },
        "image/jpeg",
        quality
      );
    } catch {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const blob = dataURItoBlob(dataUrl);
          resolve({ blob, contentType: "image/jpeg" });
        } catch {
          resolve({ blob: fallbackFile, contentType: safeType });
        }
      }
    }
  });
}

export async function optimizeImageForUpload(
  file: File,
  maxDimension = 1200,
  quality = 0.78
): Promise<{ blob: Blob; contentType: string }> {
  const safeType = getSafeContentType(file);

  // If SVG or animated GIF, don't re-encode on canvas
  if (safeType.includes("svg") || safeType.includes("gif")) {
    return { blob: file, contentType: safeType };
  }

  // If already small (< 120KB) and standard web format, skip canvas re-encoding
  if (
    file.size < 120 * 1024 &&
    (safeType === "image/jpeg" || safeType === "image/png" || safeType === "image/webp")
  ) {
    return { blob: file, contentType: safeType };
  }

  // Strategy 1: Try createImageBitmap (modern, high performance on mobile)
  if (typeof createImageBitmap !== "undefined") {
    try {
      const bitmap = await createImageBitmap(file);
      const { width, height } = calculateDimensions(bitmap.width, bitmap.height, maxDimension);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
        return await exportCanvasToBlob(canvas, quality, file, safeType);
      }
      bitmap.close();
    } catch (bitmapError) {
      console.warn("createImageBitmap failed, falling back to Image element:", bitmapError);
    }
  }

  // Strategy 2: Fallback to HTMLImageElement + ObjectURL
  return new Promise((resolve) => {
    let resolved = false;

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn("Image decode timed out, using raw file");
        resolve({ blob: file, contentType: safeType });
      }
    }, 6000);

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    const cleanup = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(objectUrl);
    };

    img.onload = async () => {
      try {
        const origWidth = img.naturalWidth || img.width;
        const origHeight = img.naturalHeight || img.height;

        if (!origWidth || !origHeight) {
          cleanup();
          if (!resolved) {
            resolved = true;
            resolve({ blob: file, contentType: safeType });
          }
          return;
        }

        const { width, height } = calculateDimensions(origWidth, origHeight, maxDimension);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          cleanup();
          if (!resolved) {
            resolved = true;
            resolve({ blob: file, contentType: safeType });
          }
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
        cleanup();

        const result = await exportCanvasToBlob(canvas, quality, file, safeType);
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      } catch (err) {
        cleanup();
        if (!resolved) {
          resolved = true;
          console.warn("Canvas compression error:", err);
          resolve({ blob: file, contentType: safeType });
        }
      }
    };

    img.onerror = () => {
      cleanup();
      if (!resolved) {
        resolved = true;
        resolve({ blob: file, contentType: safeType });
      }
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads an image to Convex storage safely with mobile resilience:
 * - Compresses large phone photos to small HD files (~100KB-200KB)
 * - Automatic retry (up to 3 attempts) for flaky mobile data connections
 * - Timeout guard using AbortController (40s)
 * - User-friendly error messaging on network failure
 */
export async function uploadImageToConvex(
  file: File,
  generateUploadUrl: () => Promise<string>,
  onStatusChange?: (status: string) => void
): Promise<{ storageId: string; contentType: string }> {
  onStatusChange?.("Optimizing image for mobile...");
  const { blob, contentType } = await optimizeImageForUpload(file);

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        onStatusChange?.(`Reconnecting upload (${attempt} of ${maxRetries})...`);
        await new Promise((r) => setTimeout(r, 1200));
      } else {
        onStatusChange?.("Uploading image...");
      }

      // Always generate a fresh upload URL for each attempt
      const postUrl = await generateUploadUrl();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      try {
        const response = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": contentType || "image/jpeg",
          },
          body: blob,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(`Upload server returned error (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        if (!data?.storageId) {
          throw new Error("No storage identifier returned by server.");
        }

        onStatusChange?.("Upload complete!");
        return { storageId: data.storageId, contentType };
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === "AbortError") {
          throw new Error("Upload timed out over mobile connection.");
        }
        throw fetchErr;
      }
    } catch (err: any) {
      console.warn(`Upload attempt ${attempt} failed:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
      // Loop will retry if attempt < maxRetries
    }
  }

  const rawMsg = lastError?.message || "";
  if (rawMsg.includes("Failed to fetch") || rawMsg.includes("Load failed") || rawMsg.includes("NetworkError")) {
    throw new Error(
      "Network connection interrupted while uploading flyer. Please check your mobile internet/Wi-Fi and try again."
    );
  }

  throw lastError || new Error("Failed to upload image. Please try again.");
}
