import instance from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";
import type {
  IConfirmUpload,
  IRequestUploadUrl,
  IRequestUploadUrlResponse,
  UploadFolder,
} from "@/types/Upload";
import { IApiResponse } from "@/types/Pagination";

const putToBlob = async (uploadUrl: string, file: File): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "x-ms-blob-type": "BlockBlob",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload file to storage (${response.status} ${response.statusText})`,
    );
  }
};

const uploadServices = {
  requestUploadUrl: (payload: IRequestUploadUrl) => {
    return instance.post<IApiResponse<IRequestUploadUrlResponse>>(
      `${endpoint.UPLOADS}/request-url`,
      payload,
    );
  },

  confirmUpload: (payload: IConfirmUpload) => {
    return instance.post(`${endpoint.UPLOADS}/confirm`, payload);
  },

  deleteBlob: (blobName: string) => {
    return instance.delete(`${endpoint.UPLOADS}/${blobName}`);
  },

  putToBlob,

  uploadFile: async (file: File, folder: UploadFolder): Promise<string> => {
    const { data } = await uploadServices.requestUploadUrl({
      fileName: file.name,
      contentType: file.type as IRequestUploadUrl["contentType"],
      folder,
    });

    const { uploadUrl, blobName } = data.data;

    if (!uploadUrl || !blobName) {
      throw new Error("Failed to obtain an upload URL from the server");
    }

    await putToBlob(uploadUrl, file);
    await uploadServices.confirmUpload({ blobName });

    return blobName;
  },
};

export default uploadServices;