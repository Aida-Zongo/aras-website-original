import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CreateMediaDialog } from "./CreateMediaDialog";

export default function AdminMedia() {
  const { data: media, refetch } = trpc.media.list.useQuery();

  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      toast.success("Média supprimé");
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
          Gestion des Médias
        </h2>
        <CreateMediaDialog onSuccess={refetch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media?.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="mb-3">
              {item.mediaType === "photo" ? (
                <img src={item.url} alt={item.title} className="w-full h-32 object-cover rounded" />
              ) : (
                <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">Vidéo</span>
                </div>
              )}
            </div>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              {item.mediaType === "photo" ? "Photo" : "Vidéo"}
            </span>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline">
                Éditer
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate({ id: item.id })}
              >
                Supprimer
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
