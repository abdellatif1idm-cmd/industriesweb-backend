// ─────────────────────────────────────────
// Upload IMAGE → converti en WebP
// Supporte : JPG, PNG, WEBP

import { cloudinary } from 'src/config/cloudinary.config';

// ─────────────────────────────────────────
export async function uploadImageAsWebp(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',
          transformation: [{ quality: 'auto:good' }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      )
      .end(file.buffer);
  });
}
