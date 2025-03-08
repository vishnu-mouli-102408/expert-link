import type { UploadApiResponse } from "cloudinary";

import cloudinary from "@/lib/cloudinary";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "@/lib/http-status-codes";

import { j, privateProcedure } from "../jstack";

export const accountRouter = j.router({
  uploadFileToCloudinary: privateProcedure.mutation(
    async ({ c, ctx, input }) => {
      try {
        const formData = await c.req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
          return c.json({
            message: "File Not Found",
            success: false,
            code: NOT_FOUND,
          });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await new Promise<UploadApiResponse>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "expert-link" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  if (result) {
                    resolve(result);
                  } else {
                    reject("Error uploading file");
                  }
                }
              }
            );
            uploadStream.end(buffer);
          }
        );
        return c.json({
          message: "File uploaded",
          success: true,
          data: result,
          code: OK,
        });
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return c.json({
          message: "Upload failed",
          success: false,
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }
  ),
});
