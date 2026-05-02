import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CommentSection } from "@/components/CommentSection";

interface CommentButtonProps {
    targetType: "media" | "article" | "activity";
    targetId: number;
    title?: string;
    showLabel?: boolean; // If true, shows "Commenter", else just icon
}

export function CommentButton({ targetType, targetId, title, showLabel = true }: CommentButtonProps) {
    const { data: comments } = trpc.comments.list.useQuery({
        targetType,
        targetId
    });

    const count = comments?.length || 0;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="w-4 h-4" />
                    {showLabel && <span>Commenter</span>}
                    {count > 0 && <span className="ml-1 text-xs font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{count}</span>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden bg-white">
                <DialogHeader className="p-4 pb-2 border-b">
                    <DialogTitle>Commentaires {title ? `: ${title}` : ""}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden p-4 pt-0 bg-gray-50">
                    <CommentSection targetType={targetType} targetId={targetId} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
