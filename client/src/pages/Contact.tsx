import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import {
  COLORS,
  WHATSAPP_LINK,
  CONTACT_EMAIL_1,
  CONTACT_EMAIL_2,
  CONTACT_PHONE_1,
  CONTACT_PHONE_2,
  DEVELOPER_NAME,
  DEVELOPER_EMAIL,
  DEVELOPER_WHATSAPP,
} from "@/const";
import { trpc } from "@/lib/trpc";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé !", {
        description: "Merci pour votre message. Nous vous répondrons sous peu.",
        duration: 5000,
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: () => {
      toast.error("Erreur", {
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        duration: 5000,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: COLORS.aras.green }}>
          Nous Contacter
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Nous sommes à votre écoute. N'hésitez pas à nous envoyer vos messages et questions.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-6">
            {/* Email */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 flex-shrink-0" style={{ color: COLORS.aras.red }} />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href={`mailto:${CONTACT_EMAIL_1}`} className="text-blue-600 hover:underline block">
                    {CONTACT_EMAIL_1}
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL_2}`} className="text-blue-600 hover:underline block">
                    {CONTACT_EMAIL_2}
                  </a>
                </div>
              </div>
            </Card>

            {/* Phone */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 flex-shrink-0" style={{ color: COLORS.aras.green }} />
                <div>
                  <h3 className="font-semibold mb-2">Téléphone</h3>
                  <a href={`tel:${CONTACT_PHONE_1.replace(/\s/g, "")}`} className="text-blue-600 hover:underline block">
                    {CONTACT_PHONE_1}
                  </a>
                  <a href={`tel:${CONTACT_PHONE_2.replace(/\s/g, "")}`} className="text-blue-600 hover:underline block">
                    {CONTACT_PHONE_2}
                  </a>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 flex-shrink-0" style={{ color: COLORS.aras.yellow }} />
                <div>
                  <h3 className="font-semibold mb-2">Localisation</h3>
                  <p className="text-gray-600">Koudougou, Burkina Faso</p>
                </div>
              </div>
            </Card>

            {/* WhatsApp */}
            <Button
              className="w-full text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: "#25D366" }}
              onClick={() => window.open(WHATSAPP_LINK, "_blank")}
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.aras.green }}>
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                  />
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
                  <label className="block text-sm font-medium mb-2">Sujet *</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Votre message"
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white text-lg py-6"
                  style={{ backgroundColor: COLORS.aras.red }}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Developer Footer Info */}
        <Card className="p-6 bg-gray-100">
          <p className="text-center text-gray-700">
            <span className="font-semibold">Développé par :</span> {DEVELOPER_NAME}
            <br />
            <span className="text-sm">
              Contact : {DEVELOPER_WHATSAPP} | Email : {DEVELOPER_EMAIL}
              <br />
              <a href="https://wa.me/22666869010" className="text-blue-600 hover:underline">
                Contacter sur WhatsApp
              </a>
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}
