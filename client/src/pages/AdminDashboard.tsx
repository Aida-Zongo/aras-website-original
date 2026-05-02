import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Menu, X } from "lucide-react";
import { COLORS } from "@/const";
import AdminActivities from "@/components/admin/AdminActivities";
import AdminArticles from "@/components/admin/AdminArticles";
import AdminMedia from "@/components/admin/AdminMedia";
import AdminMembership from "@/components/admin/AdminMembership";
import AdminContact from "@/components/admin/AdminContact";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  // ... (auth checks remain same)

  if (!isAuthenticated) {
    window.location.href = "/admin-login";
    return null;
  }

  if (user?.role !== "admin") {
    // ... (access denied remains same)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Vous devez être administrateur pour accéder à cette page.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"
          } transition-all duration-300 bg-white shadow-lg flex flex-col`}
        style={{ backgroundColor: COLORS.aras.green }}
      >
        <div className="p-4 flex items-center justify-between text-white">
          {sidebarOpen && <h2 className="font-bold text-lg">Admin ARAS</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-green-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: "Activités", icon: "📋", id: "activities" },
            { label: "Articles", icon: "📝", id: "articles" },
            { label: "Médias", icon: "🖼️", id: "media" },
            { label: "Adhésions", icon: "👥", id: "membership" },
            { label: "Messages", icon: "💬", id: "contact" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveTab(item.id)}
              className={`text-white p-3 rounded cursor-pointer transition flex items-center ${activeTab === item.id ? "bg-green-700" : "hover:bg-green-700"
                }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-2">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-green-700">
          <Button
            variant="outline"
            className="w-full text-white border-white hover:bg-green-700"
            onClick={logout}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Déconnexion</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
            Tableau de Bord Administrateur
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Bienvenue, <strong>{user?.name || "Admin"}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden md:flex"
            >
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 h-auto">
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
              <TabsTrigger value="membership">Adhésions</TabsTrigger>
              <TabsTrigger value="contact">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <AdminActivities />
            </TabsContent>

            <TabsContent value="articles">
              <AdminArticles />
            </TabsContent>

            <TabsContent value="media">
              <AdminMedia />
            </TabsContent>

            <TabsContent value="membership">
              <AdminMembership />
            </TabsContent>

            <TabsContent value="contact">
              <AdminContact />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
