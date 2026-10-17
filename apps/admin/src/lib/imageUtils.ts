import { convex } from "./convexClient";
import { api } from "@convex/_generated/api";

/**
 * Bulletproof mobile-first image optimization and upload utilities.
 * Handles smartphone photos (iOS Safari, Android Chrome, desktop) by:
 * 1. Safely resolving MIME types (handles empty types, HEIC/HEIF camera captures).
 * 2. Compressing and resizing huge 10MB-25MB phone photos to ~80KB-150KB in HD quality.
 * 3. Multi-tier decoding (createImageBitmap with native downscale, fallback to Image element).
 * 4. Safe canvas export (toBlob with iOS Safari toDataURL fallback).
 * 5. Triple-redundant upload:
 *    - Pipeline 1: Direct Convex Client Action via WebSocket (immune to mobile HTTP fetch drops, CORS, carrier proxy resets).
 *    - Pipeline 2: Universal CORS HTTP action to /api/upload.
 *    - Pipeline 3: Standard generateUploadUrl fallback.
 */

export function getSafeContentType(file: File): string {
  if (file.type && file.type.startsWith("image/")) {
    if (file.type.includes("heic") || file.type.includes("heif")) {
      return "image/jpeg";
    }
    return file.type;
  }
  // Infer from file extension if file.type is empty (common on mobile)
  const ext = file.name?.split(".").pop()?.toLowerCase();
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

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx !== -1) {
        resolve(dataUrl.slice(commaIdx + 1));
      } else {
        resolve(dataUrl);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image data"));
    reader.readAsDataURL(blob);
  });
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
  maxDimension = 1000,
  quality = 0.75
): Promise<{ blob: Blob; contentType: string }> {
  const safeType = getSafeContentType(file);

  // If SVG or animated GIF, don't re-encode on canvas
  if (safeType.includes("svg") || safeType.includes("gif")) {
    return { blob: file, contentType: safeType };
  }

  // If already small (< 100KB) and standard web format, skip canvas re-encoding
  if (
    file.size < 100 * 1024 &&
    (safeType === "image/jpeg" || safeType === "image/png" || safeType === "image/webp")
  ) {
    return { blob: file, contentType: safeType };
  }

  // Strategy 1: Try createImageBitmap (modern, high performance on mobile)
  if (typeof createImageBitmap !== "undefined") {
    try {
      let bitmap: ImageBitmap;
      try {
        const probe = await createImageBitmap(file);
        const { width, height } = calculateDimensions(probe.width, probe.height, maxDimension);
        probe.close();
        bitmap = await createImageBitmap(file, {
          resizeWidth: width,
          resizeHeight: height,
          resizeQuality: "medium",
        });
      } catch {
        bitmap = await createImageBitmap(file);
      }

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

function getConvexSiteUrl(): string {
  const envSite = import.meta.env.VITE_CONVEX_SITE_URL;
  if (envSite && envSite.includes(".convex.site")) {
    return envSite;
  }
  const cloudUrl = import.meta.env.VITE_CONVEX_URL || "";
  if (cloudUrl.includes(".convex.cloud")) {
    return cloudUrl.replace(".convex.cloud", ".convex.site");
  }
  return "https://adjoining-lynx-464.convex.site";
}

/**
 * Uploads an image to Convex storage safely with triple redundancy:
 * 1. Direct WebSocket Convex Action upload (Primary): Bypasses cross-origin fetch, mobile carrier proxies, and CORS completely.
 * 2. Universal CORS HTTP action to /api/upload (Secondary).
 * 3. Standard generateUploadUrl fallback (Tertiary).
 */
export async function uploadImageToConvex(
  file: File,
  generateUploadUrl: () => Promise<string>,
  onStatusChange?: (status: string) => void
): Promise<{ storageId: string; contentType: string }> {
  onStatusChange?.("Optimizing image for mobile...");
  const { blob, contentType } = await optimizeImageForUpload(file);

  // METHOD 1: Direct Convex Client Action via WebSocket (Immune to browser fetch errors and CORS)
  if (blob.size < 750 * 1024) {
    try {
      onStatusChange?.("Uploading image directly...");
      const base64Data = await blobToBase64(blob);
      const res = await convex.action(api.storage.uploadFromClient, {
        base64Data,
        contentType: contentType || "image/jpeg",
      });

      if (res?.storageId) {
        onStatusChange?.("Upload complete!");
        return { storageId: res.storageId, contentType };
      }
    } catch (actionErr: any) {
      console.warn("Direct WebSocket upload failed, trying HTTP upload:", actionErr?.message);
    }
  }

  // METHOD 2: Direct HTTP POST to /api/upload on the matching .convex.site domain
  try {
    onStatusChange?.("Uploading image to server...");
    const siteUrl = getConvexSiteUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const response = await fetch(`${siteUrl}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": contentType || "image/jpeg",
      },
      body: blob,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.storageId) {
        onStatusChange?.("Upload complete!");
        return { storageId: data.storageId, contentType };
      }
    }
  } catch (httpErr: any) {
    console.warn("Direct HTTP upload to /api/upload failed, trying fallback:", httpErr?.message);
  }

  // METHOD 3: Traditional generateUploadUrl fallback
  try {
    onStatusChange?.("Finishing upload...");
    const postUrl = await generateUploadUrl();
    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType || "image/jpeg",
      },
      body: blob,
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.storageId) {
        onStatusChange?.("Upload complete!");
        return { storageId: data.storageId, contentType };
      }
    }
  } catch (genUrlErr: any) {
    console.warn("generateUploadUrl fallback failed:", genUrlErr?.message);
  }

  throw new Error("Failed to upload image. Please check your connection and try again.");
}
