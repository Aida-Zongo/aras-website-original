
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { COLORS } from "@/const";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CommentSection } from "@/components/CommentSection";
import { ReactionButton } from "@/components/ReactionButton";
import { CommentButton } from "@/components/CommentButton";
import { Calendar, MessageCircle, ThumbsUp, Heart, HandHeart } from "lucide-react";

export default function Articles() {
    const { data: articles, isLoading } = trpc.articles.list.useQuery();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center" style={{ color: COLORS.aras.green }}>
                    Actualités & Articles
                </h1>
                <p className="text-gray-600 text-center mb-12">
                    Suivez toute l'actualité de l'association ARAS.
                </p>

                {isLoading ? (
                    <div className="text-center py-20">Chargement...</div>
                ) : articles?.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm border border-dashed">
                        <p className="text-lg">Aucun article publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {articles?.map((article) => (
                            <Card key={article.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                                <div className="md:flex">
                                    {article.imageUrl && (
                                        <div className="md:w-1/3 h-48 md:h-auto relative">
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 md:w-2/3 flex flex-col">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: fr })}
                                        </div>

                                        <h2 className="text-2xl font-bold mb-3 hover:text-green-700 transition-colors">
                                            {article.title}
                                        </h2>

                                        <div className="text-gray-600 mb-4 line-clamp-3">
                                            {article.summary || article.content.substring(0, 150) + "..."}
                                        </div>

                                        <div className="mt-auto flex justify-between items-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="text-green-700 border-green-700 hover:bg-green-50"
                                                    >
                                                        Lire la suite
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-white">
                                                    <div className="flex-1 overflow-y-auto p-6">
                                                        {article.imageUrl && (
                                                            <img
                                                                src={article.imageUrl}
                                                                alt={article.title}
                                                                className="w-full h-64 object-cover rounded-lg mb-6"
                                                            />
                                                        )}
                                                        <h2 className="text-3xl font-bold mb-2">{article.title}</h2>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(new Date(article.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                                                        </div>
                                                        <div className="prose max-w-none mb-8 whitespace-pre-wrap">
                                                            {article.content}
                                                        </div>

                                                        <div className="border-t pt-8">
                                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                                <MessageCircle className="w-5 h-5" />
                                                                Commentaires
                                                            </h3>
                                                            <div className="bg-gray-50 rounded-lg border h-[400px]">
                                                                <CommentSection targetType="article" targetId={article.id} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* Quick Comment Button */}
                                            <CommentButton
                                                targetType="article"
                                                targetId={article.id}
                                                title={article.title}
                                            />
                                        </div>

                                        {/* Reaction Buttons Row */}
                                        <div className="mt-4 flex gap-2 border-t pt-2">
                                            <ReactionButton icon={ThumbsUp} type="like" targetType="article" targetId={article.id} />
                                            <ReactionButton icon={Heart} type="love" targetType="article" targetId={article.id} />
                                            <ReactionButton icon={HandHeart} type="support" targetType="article" targetId={article.id} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
