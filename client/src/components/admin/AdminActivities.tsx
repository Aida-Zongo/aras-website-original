import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";
import { COLORS, ACTIVITY_CATEGORIES } from "@/const";
import { trpc } from "@/lib/trpc";

export default function AdminActivities() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "culture_traditions",
    imageUrl: "",
  });

  const { data: activities, refetch } = trpc.activities.list.useQuery();
  const createMutation = trpc.activities.create.useMutation({
    onSuccess: () => {
      toast.success("Activité créée avec succès");
      setFormData({ title: "", description: "", category: "culture_traditions", imageUrl: "" });
      setIsFormOpen(false);
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const deleteMutation = trpc.activities.delete.useMutation({
    onSuccess: () => {
      toast.success("Activité supprimée");
      refetch();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
          Gestion des Activités
        </h2>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          style={{ backgroundColor: COLORS.aras.red }}
          className="text-white"
        >
          {isFormOpen ? "Annuler" : "+ Nouvelle Activité"}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Titre de l'activité"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Description détaillée"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <ImageUploader
                  onImageSelect={(_: File, url: string) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                  label="Choisir une image"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: COLORS.aras.green }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Création..." : "Créer l'activité"}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities?.map((activity) => (
          <Card key={activity.id} className="p-4">
            {activity.imageUrl && (
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h3 className="font-bold mb-2">{activity.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Edit functionality would go here
                }}
              >
                Éditer
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteMutation.mutate({ id: activity.id })}
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
