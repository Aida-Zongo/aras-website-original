import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { COLORS, APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success("Connexion réussie !");
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/admin";
      }
    },
    onError: (error: any) => {
      toast.error("Erreur de connexion", {
        description: error.message || "Email ou mot de passe incorrect",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsLoading(true);
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: COLORS.aras.green }}
    >
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold" style={{ color: COLORS.aras.green }}>
            Panneau d'Administration
          </h1>
          <p className="text-gray-600 mt-2">{APP_TITLE}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aras.local"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white text-lg py-6"
            style={{ backgroundColor: COLORS.aras.red }}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Connexion en cours..." : "Se Connecter"}
          </Button>
        </form>



        <p className="text-center text-xs text-gray-500 mt-4">
          <a href="/" className="text-blue-600 hover:underline">
            Retour à l'accueil
          </a>
        </p>
      </Card>
    </div>
  );
}
