/**
 * Formats byte size to human readable Bengali / English string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Reads a File and converts it to a base64 data URL.
 * Automatically resizes extremely large phone camera photos (> 2400px)
 * to maintain high visual detail while keeping mobile upload fast.
 */
export async function processImageFile(file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  sizeBytes: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ফাইল পড়তে সমস্যা হয়েছে।'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('ছবি লোড করা যায়নি। অনুগ্রহ করে সঠিক ইমেজ ফাইল নির্বাচন করুন।'));
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Max dimension for mobile detective vision
        const maxDim = 2400;
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (originalWidth > maxDim || originalHeight > maxDim) {
          if (originalWidth > originalHeight) {
            targetWidth = maxDim;
            targetHeight = Math.round((originalHeight * maxDim) / originalWidth);
          } else {
            targetHeight = maxDim;
            targetWidth = Math.round((originalWidth * maxDim) / originalHeight);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: reader.result as string,
              width: originalWidth,
              height: originalHeight,
              mimeType: file.type || 'image/jpeg',
              sizeBytes: file.size,
            });
            return;
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const compressedDataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.92);
          resolve({
            dataUrl: compressedDataUrl,
            width: targetWidth,
            height: targetHeight,
            mimeType: file.type || 'image/jpeg',
            sizeBytes: Math.round((compressedDataUrl.length * 3) / 4),
          });
        } else {
          resolve({
            dataUrl: reader.result as string,
            width: originalWidth,
            height: originalHeight,
            mimeType: file.type || 'image/jpeg',
            sizeBytes: file.size,
          });
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Loads a remote image URL, converts to canvas and exports as base64 data URL
 */
export async function urlToDataUrl(url: string): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  sizeBytes: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => reject(new Error('নমুনা ছবিটি লোড করা যায়নি।'));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('ক্যানভাস ইনিশিয়ালাইজ করা যায়নি।'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve({
        dataUrl,
        width: img.width,
        height: img.height,
        mimeType: 'image/jpeg',
        sizeBytes: Math.round((dataUrl.length * 3) / 4),
      });
    };
    img.src = url;
  });
}
