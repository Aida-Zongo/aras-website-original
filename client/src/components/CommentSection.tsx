
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { COLORS } from "@/const";

interface CommentSectionProps {
    targetType: "media" | "article" | "activity";
    targetId: number;
}

export function CommentSection({ targetType, targetId }: CommentSectionProps) {
    const [content, setContent] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");

    const { data: comments, isLoading, refetch } = trpc.comments.list.useQuery(
        { targetType, targetId },
        { refetchInterval: 10000 } // Poll every 10s for new comments
    );

    const createMutation = trpc.comments.create.useMutation({
        onSuccess: () => {
            toast.success("Commentaire publié !");
            setContent("");
            refetch();
        },
        onError: (err) => {
            toast.error("Erreur lors de la publication", {
                description: err.message
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !authorName.trim()) return;

        createMutation.mutate({
            targetType,
            targetId,
            content,
            authorName,
            authorEmail: authorEmail || undefined,
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg">
            <div className="p-4 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    Commentaires <span className="text-gray-400 text-sm font-normal">({comments?.length || 0})</span>
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                ) : comments?.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        Soyez le premier à commenter !
                    </div>
                ) : (
                    comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-green-100 text-green-700 font-bold text-xs">
                                    {comment.authorName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm">{comment.authorName}</span>
                                    <span className="text-xs text-gray-400">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Votre nom *"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="bg-white text-sm"
                            required
                        />
                        <Input
                            placeholder="Email (optionnel)"
                            value={authorEmail}
                            onChange={(e) => setAuthorEmail(e.target.value)}
                            className="bg-white text-sm"
                            type="email"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Écrivez un commentaire..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[40px] max-h-[100px] bg-white text-sm resize-none"
                            required
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            style={{ backgroundColor: COLORS.aras.green }}
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
