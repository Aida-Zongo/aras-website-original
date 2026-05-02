import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { COLORS, MEMBERSHIP_TYPES } from "@/const";
import { trpc } from "@/lib/trpc";

type MembershipType = "membre_actif" | "membre_associe" | "membre_honneur";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  motivation: string;
}

export default function Membership() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    membershipType: "membre_actif",
    motivation: "",
  });

  const submitMutation = trpc.membership.submit.useMutation({
    onSuccess: () => {
      toast.success("Succès !", {
        description: "Votre demande d'adhésion a été envoyée avec succès. Nous vous contacterons sous peu.",
        duration: 5000,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        membershipType: "membre_actif",
        motivation: "",
      });
    },
    onError: () => {
      toast.error("Erreur", {
        description: "Échec de l'envoi de la demande. Veuillez vérifier votre connexion et réessayer, ou nous contacter directement via WhatsApp.",
        duration: 5000,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "membershipType") {
      setFormData((prev) => ({
        ...prev,
        membershipType: value as MembershipType,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const benefits = [
    "Accès à une communauté engagée",
    "Droit de vote aux assemblées",
    "Formations gratuites",
    "Participation aux projets",
    "Réseau professionnel",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: COLORS.aras.green }}>
          Adhésion à ARAS
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Rejoignez notre association et participez à nos initiatives
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Benefits */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.aras.red }}>
              Pourquoi adhérer ?
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: COLORS.aras.yellow }}
                  ></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Types */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.aras.red }}>
              Types d'adhésion
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  type: "Membre Actif",
                  desc: "Participation active aux activités",
                  color: COLORS.aras.green,
                },
                {
                  type: "Membre Associé",
                  desc: "Soutien et participation ponctuelle",
                  color: COLORS.aras.red,
                },
                {
                  type: "Membre d'Honneur",
                  desc: "Reconnaissance et soutien",
                  color: COLORS.fidats.purple,
                },
              ].map((membership) => (
                <Card key={membership.type} className="p-4 border-2" style={{ borderColor: membership.color }}>
                  <h3 className="font-bold mb-2" style={{ color: membership.color }}>
                    {membership.type}
                  </h3>
                  <p className="text-sm text-gray-600">{membership.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Membership Form */}
        <Card className="max-w-2xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.aras.green }}>
            Formulaire d'adhésion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+226 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type d'adhésion *</label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ "--tw-ring-color": COLORS.aras.green } as any}
              >
                {MEMBERSHIP_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Motivation / Message</label>
              <Textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Pourquoi souhaitez-vous rejoindre ARAS ?"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white text-lg py-6"
              style={{ backgroundColor: COLORS.aras.red }}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Envoi en cours..." : "Soumettre ma demande"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
