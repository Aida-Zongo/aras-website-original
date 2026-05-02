import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";
import { COLORS, APP_LOGO, APP_TITLE, ACTIVITY_CATEGORIES } from "@/const";
import { trpc } from "@/lib/trpc";
import { LogOut, Plus, Trash2 } from "lucide-react";

type TabType = "activities" | "articles" | "media";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("activities");
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin-login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
            <h1 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
              Panneau d'Administration
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {[
            { id: "activities" as TabType, label: "Activités" },
            { id: "articles" as TabType, label: "Articles" },
            { id: "media" as TabType, label: "Médias" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === tab.id
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "activities" && <ActivitiesTab />}
        {activeTab === "articles" && <ArticlesTab />}
        {activeTab === "media" && <MediaTab />}
      </div>
    </div>
  );
}

function ActivitiesTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: activities, refetch } = trpc.activities.list.useQuery();
  const createMutation = trpc.activities.create.useMutation({
    onSuccess: () => {
      toast.success("Activité créée avec succès !");
      setTitle("");
      setDescription("");
      setCategory("");
      setImageFile(null);
      setImagePreview(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const deleteMutation = trpc.activities.delete.useMutation({
    onSuccess: () => {
      toast.success("Activité supprimée !");
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // For now, use a placeholder URL since we don't have image upload endpoint
    const imageUrl = imagePreview || "/placeholder.jpg";

    createMutation.mutate({
      title,
      description,
      category,
      imageUrl,
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Form */}
      <Card className="md:col-span-1 p-6">
        <h2 className="text-xl font-bold mb-4">Nouvelle Activité</h2>
        <form onSubmit={handleCreateActivity} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'activité"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée"
              disabled={createMutation.isPending}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={createMutation.isPending}
            >
              <option value="">Sélectionner une catégorie</option>
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
              onImageSelect={(file, preview) => {
                setImageFile(file);
                setImagePreview(preview);
              }}
              label="Ajouter une image"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: COLORS.aras.red }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Création..." : "Créer l'Activité"}
          </Button>
        </form>
      </Card>

      {/* List */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Activités Existantes</h2>
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <Card key={activity.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold">{activity.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Catégorie: <span className="font-medium">{activity.category}</span>
                </p>
              </div>
              <Button
                onClick={() => deleteMutation.mutate({ id: activity.id })}
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Aucune activité créée pour le moment
          </Card>
        )}
      </div>
    </div>
  );
}

function ArticlesTab() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: articles, refetch } = trpc.articles.list.useQuery();
  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("Article créé avec succès !");
      setTitle("");
      setContent("");
      setSummary("");
      setImageFile(null);
      setImagePreview(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article supprimé !");
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const imageUrl = imagePreview || "/placeholder.jpg";

    createMutation.mutate({
      title,
      content,
      summary: summary || undefined,
      imageUrl,
      published: true,
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Form */}
      <Card className="md:col-span-1 p-6">
        <h2 className="text-xl font-bold mb-4">Nouvel Article</h2>
        <form onSubmit={handleCreateArticle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Résumé</label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Résumé court"
              disabled={createMutation.isPending}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contenu</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu complet de l'article"
              disabled={createMutation.isPending}
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <ImageUploader
              onImageSelect={(file, preview) => {
                setImageFile(file);
                setImagePreview(preview);
              }}
              label="Ajouter une image"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: COLORS.aras.red }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Création..." : "Créer l'Article"}
          </Button>
        </form>
      </Card>

      {/* List */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Articles Existants</h2>
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.summary || article.content}</p>
              </div>
              <Button
                onClick={() => deleteMutation.mutate({ id: article.id })}
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Aucun article créé pour le moment
          </Card>
        )}
      </div>
    </div>
  );
}

function MediaTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: media, refetch } = trpc.media.list.useQuery();
  const createMutation = trpc.media.create.useMutation({
    onSuccess: () => {
      toast.success("Média créé avec succès !");
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      toast.success("Média supprimé !");
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur", { description: error.message });
    },
  });

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imagePreview) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    createMutation.mutate({
      title,
      description: description || undefined,
      url: imagePreview,
      fileKey: `media/${Date.now()}-${title}`,
      mediaType,
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Form */}
      <Card className="md:col-span-1 p-6">
        <h2 className="text-xl font-bold mb-4">Nouveau Média</h2>
        <form onSubmit={handleCreateMedia} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du média"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as "photo" | "video")}
              className="w-full px-3 py-2 border rounded-md"
              disabled={createMutation.isPending}
            >
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du média"
              disabled={createMutation.isPending}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fichier</label>
            <ImageUploader
              onImageSelect={(file, preview) => {
                setImageFile(file);
                setImagePreview(preview);
              }}
              label="Ajouter un fichier"
              accept={mediaType === "video" ? "video/*" : "image/*"}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: COLORS.aras.red }}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Création..." : "Créer le Média"}
          </Button>
        </form>
      </Card>

      {/* List */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold">Médias Existants</h2>
        {media && media.length > 0 ? (
          media.map((item) => (
            <Card key={item.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Type: <span className="font-medium">{item.mediaType}</span>
                </p>
              </div>
              <Button
                onClick={() => deleteMutation.mutate({ id: item.id })}
                variant="destructive"
                size="sm"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center text-gray-500">
            Aucun média créé pour le moment
          </Card>
        )}
      </div>
    </div>
  );
}
