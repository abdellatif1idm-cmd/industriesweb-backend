import { cloudinary } from 'src/config/cloudinary.config';

export async function uploadPdf(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  // Nettoyer le nom du fichier — enlever espaces et caractères spéciaux
  const cleanName = file.originalname
    .replace(/\.pdf$/i, '') // Enlève l'extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Remplace caractères spéciaux par -
    .replace(/-+/g, '-') // Évite les doubles tirets
    .toLowerCase();

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'raw',
          public_id: `${cleanName}.pdf`, // ← Nom propre + extension .pdf
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      )
      .end(file.buffer);
  });
}
