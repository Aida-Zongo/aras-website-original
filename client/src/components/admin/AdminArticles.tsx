import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CreateArticleDialog } from "./CreateArticleDialog";

export default function AdminArticles() {
  const { data: articles, refetch } = trpc.articles.list.useQuery({ includeUnpublished: true });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article supprimé");
      refetch();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
          Gestion des Articles
        </h2>
        <CreateArticleDialog onSuccess={refetch} />
      </div>

      <div className="space-y-4">
        {articles?.map((article) => (
          <Card key={article.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.content}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${article.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {article.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Éditer
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate({ id: article.id })}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
