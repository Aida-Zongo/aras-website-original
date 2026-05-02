
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { COLORS } from "@/const";

interface ReactionButtonProps {
    icon: LucideIcon;
    type: "like" | "love" | "support";
    targetType: "media" | "article" | "activity";
    targetId: number;
}

export function ReactionButton({ icon: Icon, type, targetType, targetId }: ReactionButtonProps) {
    const utils = trpc.useUtils();

    // Fetch stats to get count
    const { data: reactions } = trpc.reactions.stats.useQuery({
        targetType,
        targetId
    });

    const toggleMutation = trpc.reactions.toggle.useMutation({
        onSuccess: (data) => {
            // Invalidate queries to refresh counts
            utils.reactions.stats.invalidate({ targetType, targetId });
            toast.success(data.added ? "Réaction ajoutée !" : "Réaction retirée");
        },
        onError: () => {
            toast.error("Erreur lors de la réaction");
        }
    });

    // Calculate count for this specific type
    const count = reactions?.filter(r => r.type === type).length || 0;

    // Check if current user (based on IP or ID, handled by backend usually) reacted
    // Ideally we'd have a 'me' check or the backend returns 'isReacted'
    // For now, we just show the count.

    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-1 hover:text-red-500 transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                toggleMutation.mutate({ targetType, targetId, type });
            }}
            disabled={toggleMutation.isPending}
        >
            <Icon className="w-4 h-4" />
            {count > 0 && <span className="text-xs font-medium">{count}</span>}
        </Button>
    );
}
