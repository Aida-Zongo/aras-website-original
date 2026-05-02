import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { APP_LOGO, COLORS, WHATSAPP_LINK, ACTIVITY_CATEGORIES, ORGANIZATION_INFO } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: activities } = trpc.activities.list.useQuery();

  const slides = [
    { image: "/imageARAS.jpg", title: "ARAS" },
    { image: "/Fidatsimage.jpeg", title: "FIDATS" },
    { image: "/WhatsAppImage2025-08-15at12.31.54_4bd907d9.jpg", title: "Festival" },
    { image: "/WhatsAppImage2025-08-15at12.49.14_c2d503a2.jpg", title: "Danses Traditionnelles" },
    { image: "/WhatsAppImage2025-08-14at20.18.30_a4ef0dae.jpg", title: "Culture" },
    { image: "/WhatsAppImage2025-08-14at20.29.49_9faf2b45.jpg", title: "Communauté" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Slider */}
      <section className="relative w-full h-96 md:h-screen overflow-hidden bg-gray-900">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Slider Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition ${index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
              />
            ))}
          </div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ARAS</h1>
            <p className="text-xl md:text-2xl font-semibold mb-2">
              Association Retour Aux Sources
            </p>
            <p className="text-lg md:text-xl font-light">
              Culture • Paix • Développement
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: COLORS.aras.green }}>
              À Propos de ARAS
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {ORGANIZATION_INFO.mission}
            </p>
            <p className="text-gray-600 mb-6 italic">
              <strong>Devise :</strong> {ORGANIZATION_INFO.motto}
            </p>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold" style={{ color: COLORS.aras.red }}>Nos Valeurs</h3>
              <div className="grid grid-cols-2 gap-3">
                {ORGANIZATION_INFO.values.map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-2 p-2 rounded"
                    style={{ backgroundColor: COLORS.aras.yellow + "20" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS.aras.green }}
                    ></div>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={APP_LOGO}
              alt="ARAS Logo"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section
        className="py-16 px-4 md:px-8"
        style={{ backgroundColor: COLORS.aras.yellow + "15" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: COLORS.aras.green }}>
            Nos Activités
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVITY_CATEGORIES.map((category) => (
              <Card
                key={category.value}
                className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setLocation("/activities")}
              >
                <div
                  className="h-32 flex items-center justify-center text-white text-xl font-semibold"
                  style={{ backgroundColor: COLORS.aras.green }}
                >
                  {category.label}
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">
                    {activities?.filter((a) => a.category === category.value).length || 0} projets
                  </p>
                  <p className="text-green-600 text-xs mt-2 font-medium">Voir les détails →</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FIDATS Section */}
      <section className="py-16 px-4 md:px-8" style={{ backgroundColor: COLORS.fidats.purple }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">FIDATS</h2>
              <p className="text-lg mb-4 font-semibold">
                Festival International des Danses Traditionnelles du Sahel
              </p>
              <p className="mb-6 leading-relaxed">
                Célébration de la richesse culturelle de Sabou à travers les danses, musiques, arts
                et gastronomie traditionnels. Un événement majeur pour la promotion de notre patrimoine culturel.
              </p>
              <Button
                className="bg-white text-purple-700 hover:bg-gray-100"
                onClick={() => window.location.hash = "#fidats"}
              >
                En Savoir Plus
              </Button>
            </div>
            <div className="flex justify-center">
              <img
                src="/Fidatsimage.jpeg"
                alt="FIDATS"
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: COLORS.aras.green }}>
            Rejoignez Notre Communauté
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Devenez membre de ARAS et participez à nos initiatives pour la culture, la paix et le développement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="text-white"
              style={{ backgroundColor: COLORS.aras.green }}
              onClick={() => setLocation("/membership")}
            >
              Adhérer Maintenant
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.open(WHATSAPP_LINK, "_blank")}
            >
              <MessageCircle className="w-4 h-4" />
              Nous Contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
