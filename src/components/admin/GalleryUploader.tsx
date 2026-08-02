"use client";

import { useRef, useState } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui/form";

const categories = [
  "WEDDINGS",
  "PRE_WEDDING",
  "CHILD",
  "MATERNITY",
  "CORPORATE",
  "PRODUCT",
  "EVENT",
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

  async function upload() {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const form = new FormData();

      form.append("file", file);
      form.append("title", title);
      form.append("description", description);
      form.append("category", category);
      form.append("featured", String(featured));

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      setOpen(false);

      setFile(null);
      setTitle("");
      setDescription("");
      setCategory("WEDDINGS");
      setFeatured(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + Upload Media
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="w-full max-w-lg rounded-lg border border-border bg-background p-8">

            <h2 className="mb-6 font-serif text-3xl">
              Upload Media
            </h2>

            <div className="space-y-5">

              <Field label="Image / Video">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (!e.target.files?.length) return;

                    const selected = e.target.files[0];

                    setFile(selected);

                    if (!title) {
                      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                />
              </Field>

              <Field label="Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field label="Description">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field label="Category">
                <select
                  className="w-full rounded-sm border border-border bg-transparent p-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured
              </label>

              <div className="flex justify-end gap-3">

                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={upload}
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
