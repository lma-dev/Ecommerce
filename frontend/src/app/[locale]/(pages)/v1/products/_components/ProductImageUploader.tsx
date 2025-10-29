"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type Ref } from "react";
import { Input } from "@/components/ui/input";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/jpg,image/gif,image/svg+xml";

type ProductImageUploaderProps = {
  name: string;
  value: File | null;
  onChange: (file: File | null) => void;
  inputRef: Ref<HTMLInputElement>;
  existingImageUrl?: string;
};

export default function ProductImageUploader({
  name,
  value,
  onChange,
  inputRef,
  existingImageUrl,
}: ProductImageUploaderProps) {
  const [objectUrl, setObjectUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!value) {
      setObjectUrl(undefined);
      return;
    }

    const nextUrl = URL.createObjectURL(value);
    setObjectUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [value]);

  const previewUrl = useMemo(() => objectUrl || existingImageUrl, [objectUrl, existingImageUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      {previewUrl && (
        <div className="w-40 h-40 overflow-hidden rounded border border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50">
          <img
            src={previewUrl}
            alt="Product preview"
            className="max-h-full max-w-full object-cover"
          />
        </div>
      )}
      <Input
        id={name}
        name={name}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleFileChange}
        ref={inputRef}
      />
    </div>
  );
}
