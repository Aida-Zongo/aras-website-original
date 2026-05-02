import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, ThumbsUp, HandHeart, Download, PlayCircle, MessageCircle } from "lucide-react";
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
import { COLORS } from "@/const";
import { toast } from "sonner";

export default function Gallery() {
    const [activeTab, setActiveTab] = useState("all");
    const { data: mediaList, refetch } = trpc.media.list.useQuery();

    const filteredMedia = activeTab === "all"
        ? mediaList
        : mediaList?.filter(m => m.mediaType === activeTab);

    const handleDownload = (url: string, filename: string) => {
        // Create an invisible A element
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // The download attribute only works for same-origin URLs
        // For cross-origin, we can try to fetch and blob it,
        // but for now we assume simple anchor download
        a.download = filename;

        // If it's a new tab open (cross origin without CORS), users can right click save.
        // We'll try to force download if possible.
        a.target = "_blank";

        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };



    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: COLORS.aras.green }}>
                        Galerie Multimédia
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Découvrez nos photos et vidéos des événements passés.
                        Vous pouvez réagir et télécharger les souvenirs que vous aimez.
                    </p>
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <div className="flex justify-center">
                        <TabsList>
                            <TabsTrigger value="all">Tout</TabsTrigger>
                            <TabsTrigger value="photo">Photos</TabsTrigger>
                            <TabsTrigger value="video">Vidéos</TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>

                {filteredMedia && filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedia.map((item) => (
                            <Card key={item.id} className="overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
                                <div className="relative aspect-video bg-gray-100 group">
                                    {item.mediaType === "video" ? (
                                        <div className="w-full h-full flex items-center justify-center bg-black relative">
                                            <video
                                                src={item.url}
                                                className="w-full h-full object-contain"
                                                controls
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3" /> Vidéo
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}

                                    {/* Download overlay on hover (desktop) or always visible if needed */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="rounded-full shadow-lg"
                                            onClick={() => handleDownload(item.url, `${item.title}.${item.mediaType === 'video' ? 'mp4' : 'jpg'}`)}
                                            title="Télécharger"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1 truncate">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                                    )}

                                    <div className="flex items-center justify-between border-t pt-3 mt-2">
                                        <div className="flex gap-1">
                                            <ReactionButton icon={ThumbsUp} type="like" targetType="media" targetId={item.id} />
                                            <ReactionButton icon={Heart} type="love" targetType="media" targetId={item.id} />
                                            <ReactionButton icon={HandHeart} type="support" targetType="media" targetId={item.id} />

                                            <CommentButton
                                                targetType="media"
                                                targetId={item.id}
                                                showLabel={false}
                                            />
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownload(item.url, item.title)}
                                            className="text-gray-500 hover:text-gray-900 md:hidden"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow-sm border border-dashed">
                        <p className="text-lg">Aucun média disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
