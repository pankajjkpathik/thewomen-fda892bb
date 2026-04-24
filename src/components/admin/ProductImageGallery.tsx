import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Star, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  images: string[];
  defaultIndex: number;
  onChange: (images: string[], defaultIndex: number) => void;
}

const ProductImageGallery = ({ images, defaultIndex, onChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setUploading(false);
    if (uploaded.length) {
      onChange([...images, ...uploaded], defaultIndex);
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    let newDefault = defaultIndex;
    if (defaultIndex === i) newDefault = j;
    else if (defaultIndex === j) newDefault = i;
    onChange(next, newDefault);
  };

  const remove = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    let newDefault = defaultIndex;
    if (i === defaultIndex) newDefault = 0;
    else if (i < defaultIndex) newDefault = defaultIndex - 1;
    onChange(next, Math.min(newDefault, Math.max(0, next.length - 1)));
  };

  const setDefault = (i: number) => onChange(images, i);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Gallery ({images.length}) — first = default. Click ★ to set default.</span>
        <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground text-xs">
          No images yet. Upload to begin.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, i) => (
            <div key={src + i} className={`relative group border-2 rounded overflow-hidden ${defaultIndex === i ? "border-accent" : "border-border"}`}>
              <img src={src} alt="" className="w-full aspect-square object-cover" />
              {defaultIndex === i && (
                <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[9px] px-1.5 py-0.5 rounded font-semibold">DEFAULT</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button type="button" onClick={() => setDefault(i)} className="bg-background text-foreground p-1.5 rounded hover:bg-accent hover:text-accent-foreground" title="Set as default">
                  <Star size={12} />
                </button>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="bg-background text-foreground p-1.5 rounded disabled:opacity-30" title="Move up">
                  <ChevronUp size={12} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="bg-background text-foreground p-1.5 rounded disabled:opacity-30" title="Move down">
                  <ChevronDown size={12} />
                </button>
                <button type="button" onClick={() => remove(i)} className="bg-destructive text-destructive-foreground p-1.5 rounded" title="Remove">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
