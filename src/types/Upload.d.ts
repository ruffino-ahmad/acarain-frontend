type UploadFolder = "profile-pictures" | "banners" | "categories";

type UploadMimeType = "image/jpeg" | "image/png" | "image/webp";

interface IRequestUploadUrl {
  fileName: string;
  contentType: UploadMimeType;
  folder: UploadFolder;
}

interface IRequestUploadUrlResponse {
  uploadUrl: string;
  blobName: string;
  expiresAt: string;
}

interface IConfirmUpload {
  blobName: string;
}

export type {
  UploadFolder,
  UploadMimeType,
  IRequestUploadUrl,
  IRequestUploadUrlResponse,
  IConfirmUpload,
};