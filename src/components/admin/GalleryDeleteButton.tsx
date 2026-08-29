"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type GalleryDeleteButtonProps = {
  id: string;
  title: string;
};

export default function GalleryDeleteButton({
  id,
  title,
}: GalleryDeleteButtonProps) {
  const [deleting, setDeleting] =
    useState(false);

  async function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${title}"?\n\nThis will permanently remove the media file from Supabase Storage and delete its gallery record.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response =
        await fetch(
          `/api/admin/gallery?id=${encodeURIComponent(
            id,
          )}`,
          {
            method: "DELETE",
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete media.",
        );
      }

      /**
       * Reload the page so the deleted
       * item disappears immediately.
       */
      window.location.reload();
    } catch (error) {
      console.error(
        "Gallery delete failed:",
        error,
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete media. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      aria-label={`Delete ${title}`}
      title={`Delete ${title}`}
      className="absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? (
        <span className="text-[10px]">
          ...
        </span>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}