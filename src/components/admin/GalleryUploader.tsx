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

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + Upload Media
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">

          <div className="bg-background border border-border rounded-lg w-full max-w-lg p-8">

            <h2 className="font-serif text-3xl mb-6">
              Upload Media
            </h2>

            <div className="space-y-5">

              <Field label="Image / Video">

                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setFile(e.target.files[0]);

                      if (!title) {
                        setTitle(
                          e.target.files[0].name.split(".")[0]
                        );
                      }
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
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </Field>

              <Field label="Category">

                <select
                  className="w-full border border-border bg-transparent p-3 rounded-sm"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("_", " ")}
                    </option>
                  ))}
                </select>

              </Field>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(e.target.checked)
                  }
                />

                Featured

              </label>

              <div className="flex justify-end gap-3">

                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button>
                  Upload
                </Button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
