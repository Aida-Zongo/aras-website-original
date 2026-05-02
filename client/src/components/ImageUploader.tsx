import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { COLORS } from "@/const";

interface ImageUploaderProps {
  onImageSelect: (file: File, url: string) => void;
  label?: string;
  accept?: string;
}

export function ImageUploader({ onImageSelect, label = "Choisir un fichier", accept = "image/*" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Erreur", { description: "Le fichier ne doit pas dépasser 500MB" });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      const fileUrl = data.url;

      setFileName(file.name);
      setFileType(file.type);
      setPreview(fileUrl); // Use server URL
      onImageSelect(file, fileUrl);
      toast.success("Fichier téléchargé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur d'upload", { description: "Impossible d'envoyer le fichier au serveur." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isVideo = fileType.startsWith("video/") || (preview && preview.match(/\.(mp4|webm|ogg)$/i));

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <Card className="p-4 space-y-3">
          <div className="relative inline-block w-full">
            {isVideo ? (
              <video
                src={preview}
                controls
                className="max-w-full max-h-64 rounded-lg object-contain bg-black"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs max-h-64 rounded-lg object-cover"
              />
            )}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 truncate">
            <strong>Fichier :</strong> {fileName}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Changer le fichier
          </Button>
        </Card>
      ) : (
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-dashed border-2"
          variant="ghost"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
          ) : (
            <>
              {accept.includes("video") ? <FileVideo className="w-6 h-6 mr-2" /> : <Upload className="w-6 h-6 mr-2" />}
              {isUploading ? "Envoi en cours..." : label}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
