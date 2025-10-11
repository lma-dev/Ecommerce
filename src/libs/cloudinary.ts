import { env } from "@/utils/env";

type CloudinaryErrorResponse = {
  error?: {
    message?: string;
  };
};

export type CloudinaryImageResource = {
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
};

export async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryImageResource> {
  if (!env.CLOUDINARY.CLOUD_NAME || !env.CLOUDINARY.UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", env.CLOUDINARY.UPLOAD_PRESET);

  if (env.CLOUDINARY.UPLOAD_FOLDER) {
    formData.append("folder", env.CLOUDINARY.UPLOAD_FOLDER);
  }

  console.log("formData", formData);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY.CLOUD_NAME}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  console.log("response", response);
  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as CloudinaryErrorResponse | null;
    const message =
      errorBody?.error?.message ?? "Failed to upload image to Cloudinary";
    throw new Error(message);
  }

  const result = (await response.json()) as Record<string, any>;
  const secureUrl = result.secure_url ?? result.url;

  if (!result.public_id || !secureUrl) {
    const message = "Invalid Cloudinary response";
    throw new Error(message);
  }

  return {
    public_id: result.public_id,
    url: secureUrl,
    format: result.format ?? "jpg",
    width: typeof result.width === "number" ? result.width : 0,
    height: typeof result.height === "number" ? result.height : 0,
    bytes: typeof result.bytes === "number" ? result.bytes : 0,
  };
}
