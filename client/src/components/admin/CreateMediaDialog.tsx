
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { COLORS } from "@/const";

interface CreateMediaDialogProps {
    onSuccess?: () => void;
}

export function CreateMediaDialog({ onSuccess }: CreateMediaDialogProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Gallery");
    const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
    const [isUploading, setIsUploading] = useState(false);

    const createMutation = trpc.media.create.useMutation({
        onSuccess: () => {
            toast.success("Média publié avec succès !");
            setOpen(false);
            resetForm();
            onSuccess?.();
        },
        onError: (err) => {
            toast.error("Erreur lors de la publication", {
                description: err.message,
            });
        },
    });

    const resetForm = () => {
        setFile(null);
        setTitle("");
        setDescription("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);

        try {
            // 1. Upload file
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'upload du fichier");
            }

            const data = await response.json();
            const fileKey = data.filename;
            const url = data.url;

            // 2. Create media entry
            createMutation.mutate({
                title,
                description,
                url,
                fileKey,
                mediaType,
                category,
            });
        } catch (error: any) {
            console.error(error);
            toast.error("Erreur", { description: error.message || "Upload échoué" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button style={{ backgroundColor: COLORS.aras.red }} className="text-white">
                    + Ajouter un Média
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-black">
                <DialogHeader>
                    <DialogTitle>Ajouter un Média</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={mediaType}
                            onValueChange={(v: "photo" | "video") => setMediaType(v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="photo">Photo</SelectItem>
                                <SelectItem value="video">Vidéo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Fichier</Label>
                        <Input
                            id="file"
                            type="file"
                            accept={mediaType === "photo" ? "image/*" : "video/*"}
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Gallery">Galerie Générale</SelectItem>
                                <SelectItem value="FIDATS">FIDATS</SelectItem>
                                <SelectItem value="Activites">Activités</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={isUploading || createMutation.isPending}
                    >
                        {isUploading ? "Upload en cours..." : "Publier"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
