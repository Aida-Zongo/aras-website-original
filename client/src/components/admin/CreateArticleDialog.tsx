
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
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { COLORS } from "@/const";
import { ImageUploader } from "@/components/ImageUploader";

interface CreateArticleDialogProps {
    onSuccess?: () => void;
}

export function CreateArticleDialog({ onSuccess }: CreateArticleDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [published, setPublished] = useState(true);

    const createMutation = trpc.articles.create.useMutation({
        onSuccess: () => {
            toast.success("Article créé avec succès !");
            setOpen(false);
            resetForm();
            onSuccess?.();
        },
        onError: (err) => {
            toast.error("Erreur lors de la création", {
                description: err.message,
            });
        },
    });

    const resetForm = () => {
        setTitle("");
        setContent("");
        setSummary("");
        setImageUrl("");
        setPublished(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        createMutation.mutate({
            title,
            content,
            summary,
            imageUrl,
            published,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button style={{ backgroundColor: COLORS.aras.red }} className="text-white">
                    + Nouvel Article
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col bg-white text-black">
                <DialogHeader>
                    <DialogTitle>Créer un Article</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto p-1">
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
                        <Label>Image de couverture</Label>
                        <ImageUploader
                            onImageSelect={(_: File, url: string) => setImageUrl(url)}
                            label="Choisir une image"
                        />
                        {imageUrl && (
                            <Input
                                value={imageUrl}
                                readOnly
                                className="mt-2 bg-gray-50 text-xs text-gray-500"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Résumé (court)</Label>
                        <Textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Contenu</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px]"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="published"
                            checked={published}
                            onCheckedChange={(c) => setPublished(!!c)}
                        />
                        <Label htmlFor="published">Publier immédiatement</Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Création..." : "Enregistrer"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
