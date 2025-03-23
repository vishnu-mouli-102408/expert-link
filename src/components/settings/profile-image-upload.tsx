"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import type { UploadApiResponse } from "cloudinary";
import { Camera, Check, X } from "lucide-react";
import { motion } from "motion/react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";

import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Set canvas size to match the desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error("Canvas is empty");
        resolve(blob);
      },
      "image/jpeg",
      0.85
    ); // Compress with 85% quality
  });
};

const ProfileImageUpload = ({ value, onChange }: ProfileImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          setIsCropping(true);
        }
      });
      const file = e.target.files[0];
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
  }

  const handleCancelCrop = () => {
    setImage(null);
    setIsCropping(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCompleteCrop = async (): Promise<{
    message: string;
    success: boolean;
    data?: UploadApiResponse;
  }> => {
    try {
      setIsUploading(true);
      if (!image || !croppedAreaPixels) {
        return { message: "Invalid image or crop area", success: false };
      }

      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      const file = blobToFile(croppedImage, "image.png");

      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/account/uploadFileToCloudinary", {
        method: "POST",
        body: formData,
      });

      const uploadedUrl: {
        message: string;
        success: boolean;
        data: UploadApiResponse;
      } = await response.json();

      await client.auth.updateUserDetails.$post({
        profilePic: uploadedUrl?.data?.secure_url,
      });

      await user?.setProfileImage({ file: file });

      return uploadedUrl;
    } catch (error) {
      console.error("Error processing image:", error);
      return { message: "Error processing image", success: false };
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    toast.info("Profile picture removed", {
      description: "Your profile picture has been removed.",
      duration: 3000,
      position: "bottom-center",
      closeButton: true,
    });
  };

  const { mutate: onSubmit } = useMutation({
    mutationFn: handleCompleteCrop,
    onSuccess: (data) => {
      console.log("DATA", data);
      if (data?.success && data?.data) {
        onChange(data?.data?.secure_url);
        setImage(null);
        setIsCropping(false);

        toast.success("Profile picture updated", {
          description: "Your profile picture has been updated successfully.",
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
      } else {
        toast.error("Upload failed.", {
          description:
            "Seems like there's an issue on our end. Please try again.",
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
      }
    },
    onError: (error) => {
      console.log("ERROR", error);
      toast.error("Upload failed.", {
        description:
          "Seems like there's an issue on our end. Please try again.",
        duration: 3000,
        position: "bottom-center",
        closeButton: true,
      });
    },
  });

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {isCropping && image ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg overflow-hidden bg-zinc-800/50 border border-white/10"
        >
          <div className="relative h-80 w-full">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll
              cropShape="round"
              showGrid={false}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-white"
              />
              <span className="text-xs text-zinc-400">Zoom</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelCrop}
                className="border-white/10 cursor-pointer text-zinc-400 hover:bg-white/5"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSubmit();
                }}
                disabled={isUploading}
                className="glass-effect cursor-pointer hover:bg-white/10 text-white border-white/10"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2 h-4 w-4 border-2 border-zinc-400 border-t-white rounded-full"
                  />
                ) : (
                  <Check size={16} className="mr-1" />
                )}
                Apply
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center">
          {value ? (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-full overflow-hidden border-2 border-white/20 h-32 w-32 group"
              >
                <Image
                  priority
                  src={value}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  width={128}
                  height={128}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleTriggerFileInput}
                    className="h-8 w-8 rounded-full cursor-pointer bg-zinc-800/80 border-white/20"
                  >
                    <Camera size={14} />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleRemoveImage}
                    className="h-8 w-8 rounded-full cursor-pointer bg-zinc-800/80 border-white/20"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={handleTriggerFileInput}
              className="h-32 w-32 rounded-full cursor-pointer border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <Camera size={24} className="mb-2 cursor-pointer" />
              <span className="text-xs">Upload Photo</span>
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
