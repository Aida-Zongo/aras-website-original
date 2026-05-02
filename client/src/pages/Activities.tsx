import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COLORS, ACTIVITY_CATEGORIES } from "@/const";
import { trpc } from "@/lib/trpc";
import { ThumbsUp, Heart, HandHeart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CommentSection } from "@/components/CommentSection";
import { ReactionButton } from "@/components/ReactionButton";
import { CommentButton } from "@/components/CommentButton";

export default function Activities() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: allActivities } = trpc.activities.list.useQuery();

  const activities = selectedCategory
    ? allActivities?.filter((a) => a.category === selectedCategory)
    : allActivities;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: COLORS.aras.green }}>
          Nos Activités
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Découvrez nos projets et initiatives dans différents domaines
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`${selectedCategory === null
              ? "text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            style={{
              backgroundColor: selectedCategory === null ? COLORS.aras.green : undefined,
            }}
          >
            Toutes les catégories
          </Button>
          {ACTIVITY_CATEGORIES.map((category) => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`${selectedCategory === category.value
                ? "text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              style={{
                backgroundColor:
                  selectedCategory === category.value ? COLORS.aras.red : undefined,
              }}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition">
                {activity.imageUrl && (
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={activity.imageUrl}
                      alt={activity.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                    style={{ backgroundColor: COLORS.aras.yellow }}
                  >
                    {ACTIVITY_CATEGORIES.find((c) => c.value === activity.category)?.label}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.aras.green }}>
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{activity.description}</p>

                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex gap-1">
                      <ReactionButton icon={ThumbsUp} type="like" targetType="activity" targetId={activity.id} />
                      <ReactionButton icon={Heart} type="love" targetType="activity" targetId={activity.id} />
                      <ReactionButton icon={HandHeart} type="support" targetType="activity" targetId={activity.id} />
                    </div>

                    <CommentButton
                      targetType="activity"
                      targetId={activity.id}
                      title={activity.title}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Aucune activité trouvée dans cette catégorie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
