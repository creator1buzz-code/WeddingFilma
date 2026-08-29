"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Button,
  Field,
  Input,
  Textarea,
} from "@/components/ui/form";

const categories = [
  "WEDDINGS",
  "PRE_WEDDING",
  "CHILD",
  "MATERNITY",
  "CORPORATE",
  "PRODUCT",
  "EVENT",
];

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

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
  const fileInput =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("WEDDINGS");

  const [featured, setFeatured] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  /**
   * Reset the form.
   */
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

  /**
   * Close modal.
   */
  function closeModal() {
    if (uploading) {
      return;
    }

    setOpen(false);

    resetForm();
  }

  /**
   * File selection.
   */
  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");

    /**
     * Validate MIME type.
     */
    if (
      !ALLOWED_TYPES.includes(
        selectedFile.type,
      )
    ) {
      setFile(null);

      setError(
        "Unsupported file type. Please use JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM or MOV.",
      );

      return;
    }

    /**
     * Validate maximum size.
     */
    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFile(null);

      setError(
        "This file is larger than the 50 MB gallery limit.",
      );

      return;
    }

    setFile(selectedFile);

    /**
     * Automatically use filename
     * as title if title is empty.
     */
    if (!title) {
      setTitle(
        selectedFile.name.replace(
          /\.[^/.]+$/,
          "",
        ),
      );
    }
  }

  /**
   * Upload file directly to Supabase
   * using a signed upload URL.
   *
   * IMPORTANT:
   *
   * No Vercel file upload happens here.
   *
   * Browser
   *   ↓
   * Supabase Storage
   *
   * The signed URL is temporary and
   * limited to this upload.
   */
  async function uploadFileToSignedUrl(
    file: File,
    signedUrl: string,
  ) {
    return new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        const xhr =
          new XMLHttpRequest();

        /**
         * Open direct PUT request
         * to Supabase Storage.
         */
        xhr.open(
          "PUT",
          signedUrl,
          true,
        );

        /**
         * Content type.
         */
        xhr.setRequestHeader(
          "Content-Type",
          file.type,
        );

        /**
         * Cache control.
         */
        xhr.setRequestHeader(
          "Cache-Control",
          "max-age=3600",
        );

        /**
         * Upload progress.
         */
        xhr.upload.onprogress = (
          event,
        ) => {
          if (
            event.lengthComputable
          ) {
            const percentage =
              Math.round(
                (event.loaded /
                  event.total) *
                  100,
              );

            setProgress(
              percentage,
            );
          }
        };

        /**
         * Successful upload.
         */
        xhr.onload = () => {
          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {
            setProgress(100);

            resolve();

            return;
          }

          /**
           * Try to extract Supabase
           * error response.
           */
          let message =
            `Supabase Storage upload failed (${xhr.status}).`;

          try {
            const response =
              JSON.parse(
                xhr.responseText,
              );

            if (
              response?.message
            ) {
              message =
                response.message;
            } else if (
              response?.error
            ) {
              message =
                response.error;
            }
          } catch {
            /**
             * Response was not JSON.
             */
          }

          reject(
            new Error(
              message,
            ),
          );
        };

        /**
         * Network error.
         */
        xhr.onerror = () => {
          reject(
            new Error(
              "Network error while uploading the file to Supabase Storage.",
            ),
          );
        };

        /**
         * Request aborted.
         */
        xhr.onabort = () => {
          reject(
            new Error(
              "The upload was cancelled.",
            ),
          );
        };

        /**
         * Start upload.
         */
        xhr.send(file);
      },
    );
  }

  /**
   * Main upload process.
   */
  async function upload() {
    if (!file) {
      setError(
        "Please select a file first.",
      );

      return;
    }

    if (!title.trim()) {
      setError(
        "Please enter a title.",
      );

      return;
    }

    try {
      setUploading(true);

      setError("");

      setProgress(0);

      /**
       * =====================================================
       * STEP 1
       * =====================================================
       *
       * Ask our Next.js server to create
       * a temporary signed upload URL.
       *
       * The file itself is NOT sent here.
       */
      const authorizationResponse =
        await fetch(
          "/api/admin/gallery",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fileName: file.name,

              contentType:
                file.type,

              fileSize:
                file.size,
            }),
          },
        );

      /**
       * Parse response.
       */
      const authorizationData =
        await authorizationResponse.json();

      /**
       * Check authorization request.
       */
      if (
        !authorizationResponse.ok
      ) {
        throw new Error(
          authorizationData.error ||
            "Unable to authorize upload.",
        );
      }

      const {
        path,
        signedUrl,
      } =
        authorizationData;

      /**
       * Make sure the server returned
       * everything we need.
       */
      if (
        !path ||
        typeof path !== "string"
      ) {
        throw new Error(
          "Upload authorization did not return a valid storage path.",
        );
      }

      if (
        !signedUrl ||
        typeof signedUrl !==
          "string"
      ) {
        throw new Error(
          "Upload authorization did not return a valid signed upload URL.",
        );
      }

      /**
       * =====================================================
       * STEP 2
       * =====================================================
       *
       * Upload directly from browser
       * to Supabase Storage.
       *
       * IMPORTANT:
       *
       * We intentionally do NOT use:
       *
       * tus-js-client
       *
       * or:
       *
       * /storage/v1/upload/resumable
       *
       * This avoids the Invalid Compact JWS
       * problem occurring on your project.
       */
      await uploadFileToSignedUrl(
        file,
        signedUrl,
      );

      /**
       * =====================================================
       * STEP 3
       * =====================================================
       *
       * Build public URL.
       */
      const supabaseUrl =
        process.env
          .NEXT_PUBLIC_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error(
          "NEXT_PUBLIC_SUPABASE_URL is not configured.",
        );
      }

      const publicUrl =
        `${supabaseUrl}/storage/v1/object/public/gallery/${path}`;

      /**
       * Determine database media type.
       */
      const mediaType =
        file.type.startsWith(
          "video",
        )
          ? "VIDEO"
          : "IMAGE";

      /**
       * =====================================================
       * STEP 4
       * =====================================================
       *
       * Save metadata in Prisma.
       *
       * IMPORTANT:
       *
       * The actual media file is NOT sent
       * to Vercel.
       */
      const databaseResponse =
        await fetch(
          "/api/admin/gallery",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title:
                title.trim(),

              description:
                description.trim(),

              category,

              mediaType,

              url: publicUrl,

              thumbnail:
                publicUrl,

              featured,

              tags: [],

              storagePath:
                path,
            }),
          },
        );

      const databaseData =
        await databaseResponse.json();

      /**
       * If Prisma fails after the
       * Storage upload succeeded,
       * attempt cleanup.
       */
      if (!databaseResponse.ok) {
        console.error(
                      "Gallery database record creation failed after Storage upload.",
                      {
                      storagePath: path,
                      databaseError: databaseData.error,
                      },
                    );

      throw new Error(
        databaseData.error ||
          "Gallery database record could not be created.",
          );
      }

      /**
       * =====================================================
       * STEP 5
       * =====================================================
       *
       * Success.
       */
      setProgress(100);

      alert(
        "Media uploaded successfully.",
      );

      setOpen(false);

      resetForm();

      /**
       * Refresh gallery.
       */
      window.location.reload();
    } catch (
      uploadError
    ) {
      console.error(
        "Gallery upload failed:",
        uploadError,
      );

      setError(
        uploadError instanceof
          Error
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
              {/* FILE */}
              <Field label="Image / Video">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
                  disabled={
                    uploading
                  }
                  onChange={
                    handleFileChange
                  }
                  className="block w-full"
                />

                {file && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      <strong>
                        File:
                      </strong>{" "}
                      {file.name}
                    </p>

                    <p>
                      <strong>
                        Size:
                      </strong>{" "}
                      {(
                        file.size /
                        (1024 *
                          1024)
                      ).toFixed(
                        2,
                      )}{" "}
                      MB
                    </p>
                  </div>
                )}
              </Field>

              {/* TITLE */}
              <Field label="Title">
                <Input
                  value={title}
                  disabled={
                    uploading
                  }
                  onChange={(e) =>
                    setTitle(
                      e.target.value,
                    )
                  }
                  placeholder="Jaipur Wedding"
                />
              </Field>

              {/* DESCRIPTION */}
              <Field label="Description">
                <Textarea
                  value={
                    description
                  }
                  disabled={
                    uploading
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  placeholder="A cinematic wedding celebration in Jaipur..."
                />
              </Field>

              {/* CATEGORY */}
              <Field label="Category">
                <select
                  className="w-full border border-border bg-transparent p-3 rounded-sm"
                  value={category}
                  disabled={
                    uploading
                  }
                  onChange={(e) =>
                    setCategory(
                      e.target.value,
                    )
                  }
                >
                  {categories.map(
                    (c) => (
                      <option
                        key={c}
                        value={c}
                      >
                        {c.replace(
                          "_",
                          " ",
                        )}
                      </option>
                    ),
                  )}
                </select>
              </Field>

              {/* FEATURED */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    featured
                  }
                  disabled={
                    uploading
                  }
                  onChange={(e) =>
                    setFeatured(
                      e.target.checked,
                    )
                  }
                />

                Featured
              </label>

              {/* PROGRESS */}
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

                  <p className="text-xs text-muted-foreground">
                    Uploading directly
                    to Supabase
                    Storage...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                  <strong>
                    Upload failed:
                  </strong>{" "}
                  {error}
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  disabled={
                    uploading
                  }
                  onClick={
                    closeModal
                  }
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