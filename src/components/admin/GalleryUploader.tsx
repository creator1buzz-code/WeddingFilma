"use client";

import { useRef, useState } from "react";
import * as tus from "tus-js-client";

import { Button, Field, Input, Textarea } from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";

const categories = [
  "WEDDINGS",
  "PRE_WEDDING",
  "CHILD",
  "MATERNITY",
  "CORPORATE",
  "PRODUCT",
  "EVENT",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const LARGE_FILE_THRESHOLD = 6 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export default function GalleryUploader() {
  const fileInput = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("WEDDINGS");

  const [featured, setFeatured] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");

  function resetForm() {
    setFile(null);
    setTitle("");
    setDescription("");
    setCategory("WEDDINGS");
    setFeatured(false);
    setProgress(0);
    setError("");

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  function closeModal() {
    if (uploading) return;

    setOpen(false);
    resetForm();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFile(null);

      setError(
        "Unsupported file type. Please use JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM or MOV.",
      );

      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);

      setError(
        "This file is larger than the 50 MB gallery limit.",
      );

      return;
    }

    setFile(selectedFile);

    if (!title) {
      setTitle(
        selectedFile.name.replace(/\.[^/.]+$/, ""),
      );
    }
  }

  async function uploadSmallFile(
    file: File,
    path: string,
  ) {
    const supabase = createClient();

    const { error: uploadError } =
      await supabase.storage
        .from("gallery")
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      throw new Error(uploadError.message);
    }
  }

  async function uploadLargeFile(
    file: File,
    path: string,
    token: string,
    projectId: string,
  ) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      );
    }

    const endpoint =
      `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`;

    return new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint,

        retryDelays: [
          0,
          3000,
          5000,
          10000,
          20000,
        ],

        headers: {
          "x-signature": token,
        },

        uploadDataDuringCreation: true,

        removeFingerprintOnSuccess: true,

        metadata: {
          bucketName: "gallery",
          objectName: path,
          contentType: file.type,
          cacheControl: "3600",
        },

        chunkSize: 6 * 1024 * 1024,

        onError(error) {
          console.error(
            "TUS upload error:",
            error,
          );

          reject(
            new Error(
              error?.message ||
                "Large file upload failed.",
            ),
          );
        },

        onProgress(bytesUploaded, bytesTotal) {
          const percentage =
            Math.round(
              (bytesUploaded / bytesTotal) * 100,
            );

          setProgress(percentage);
        },

        onSuccess() {
          resolve();
        },
      });

      upload.start();
    });
  }

  async function upload() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setProgress(0);

      /*
       * STEP 1
       *
       * Ask our server for a temporary signed upload token.
       *
       * IMPORTANT:
       * We do NOT send the file here.
       */
      const authorizationResponse =
        await fetch(
          "/api/admin/gallery",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
              fileSize: file.size,
            }),
          },
        );

      const authorizationData =
        await authorizationResponse.json();

      if (!authorizationResponse.ok) {
        throw new Error(
          authorizationData.error ||
            "Unable to authorize upload.",
        );
      }

      const {
        path,
        token,
        projectId,
      } = authorizationData;

      /*
       * STEP 2
       *
       * Upload directly to Supabase.
       *
       * Files <= 6 MB use normal upload.
       *
       * Files > 6 MB use TUS resumable upload.
       */
      if (file.size > LARGE_FILE_THRESHOLD) {
        await uploadLargeFile(
          file,
          path,
          token,
          projectId,
        );
      } else {
        await uploadSmallFile(file, path);

        setProgress(100);
      }

      /*
       * STEP 3
       *
       * Build the public URL.
       */
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error(
          "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        );
      }

      const publicUrl =
        `${supabaseUrl}/storage/v1/object/public/gallery/${path}`;

      const mediaType =
        file.type.startsWith("video")
          ? "VIDEO"
          : "IMAGE";

      /*
       * STEP 4
       *
       * Save only metadata in Prisma.
       *
       * The large file is NOT sent to Vercel.
       */
      const databaseResponse =
        await fetch(
          "/api/admin/gallery",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title.trim(),

              description:
                description.trim(),

              category,

              mediaType,

              url: publicUrl,

              thumbnail: publicUrl,

              featured,

              tags: [],

              storagePath: path,
            }),
          },
        );

      const databaseData =
        await databaseResponse.json();

      if (!databaseResponse.ok) {
        /*
         * If Storage succeeded but Prisma failed,
         * try to remove the orphaned file.
         */
        try {
          const supabase = createClient();

          await supabase.storage
            .from("gallery")
            .remove([path]);
        } catch (cleanupError) {
          console.error(
            "Storage cleanup failed:",
            cleanupError,
          );
        }

        throw new Error(
          databaseData.error ||
            "Gallery database record could not be created.",
        );
      }

      /*
       * STEP 5
       *
       * Success.
       */
      setProgress(100);

      alert("Media uploaded successfully.");

      setOpen(false);

      resetForm();

      /*
       * Refresh the current page so the new
       * gallery item appears immediately.
       */
      window.location.reload();
    } catch (uploadError) {
      console.error(
        "Gallery upload failed:",
        uploadError,
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        + Upload Media
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-lg w-full max-w-lg p-8 my-8">

            <h2 className="font-serif text-3xl mb-6">
              Upload Media
            </h2>

            <div className="space-y-5">

              <Field label="Image / Video">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
                  disabled={uploading}
                  onChange={handleFileChange}
                  className="block w-full"
                />

                {file && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      <strong>File:</strong>{" "}
                      {file.name}
                    </p>

                    <p>
                      <strong>Size:</strong>{" "}
                      {(
                        file.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                )}
              </Field>

              <Field label="Title">
                <Input
                  value={title}
                  disabled={uploading}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Jaipur Wedding"
                />
              </Field>

              <Field label="Description">
                <Textarea
                  value={description}
                  disabled={uploading}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  placeholder="A cinematic wedding celebration in Jaipur..."
                />
              </Field>

              <Field label="Category">
                <select
                  className="w-full border border-border bg-transparent p-3 rounded-sm"
                  value={category}
                  disabled={uploading}
                  onChange={(e) =>
                    setCategory(
                      e.target.value,
                    )
                  }
                >
                  {categories.map((c) => (
                    <option
                      key={c}
                      value={c}
                    >
                      {c.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  disabled={uploading}
                  onChange={(e) =>
                    setFeatured(
                      e.target.checked,
                    )
                  }
                />

                Featured
              </label>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>
                      Uploading...
                    </span>

                    <span>
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  {file &&
                    file.size >
                      LARGE_FILE_THRESHOLD && (
                      <p className="text-xs text-muted-foreground">
                        Large file upload —
                        resumable upload is
                        being used.
                      </p>
                    )}
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                  <strong>
                    Upload failed:
                  </strong>{" "}
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">

                <Button
                  variant="ghost"
                  disabled={uploading}
                  onClick={closeModal}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={upload}
                  disabled={
                    !file ||
                    uploading
                  }
                >
                  {uploading
                    ? `Uploading ${progress}%`
                    : "Upload"}
                </Button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}