import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  base64Image: string,
  folder: string = "curalink/doctors"
): Promise<string> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  });
  return result.secure_url;
}

/**
 * Uploads a document (PDF, scanned image, etc.) without the square-crop
 * transform used for avatar/profile photos. Used for doctor license
 * documents and patient medical records — files that need to stay
 * legible/full-page rather than being cropped to a thumbnail.
 */
export async function uploadDocument(
  base64File: string,
  folder: string = "curalink/documents"
): Promise<string> {
  const result = await cloudinary.uploader.upload(base64File, {
    folder,
    resource_type: "auto", // supports PDFs as well as images
  });
  return result.secure_url;
}

export default cloudinary;