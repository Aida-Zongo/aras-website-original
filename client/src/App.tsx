import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Activities from "./pages/Activities";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { APP_LOGO, APP_TITLE, COLORS } from "@/const";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Activités", path: "/activities" },
    { label: "Articles", path: "/articles" },
    { label: "Galerie", path: "/gallery" },
    { label: "Adhésion", path: "/membership" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: COLORS.aras.green }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 object-contain" />
            <span className="text-white font-bold hidden md:inline">{APP_TITLE}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`text-white font-medium transition ${isActive(item.path)
                  ? "border-b-2 border-white pb-1"
                  : "hover:text-gray-200"
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="block text-white hover:bg-green-700 px-4 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer
      className="text-white py-12 px-4 md:px-8"
      style={{ backgroundColor: COLORS.aras.green }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">À Propos</h3>
            <p className="text-gray-200">
              ARAS - Association Retour Aux Sources, dédiée à la promotion de la culture,
              de la paix et du développement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-200">
              <li><a href="/" className="hover:text-white">Accueil</a></li>
              <li><a href="/activities" className="hover:text-white">Activités</a></li>
              <li><a href="/membership" className="hover:text-white">Adhésion</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-200">
              Koudougou, Burkina Faso<br />
              Email: source_kdg@live.fr<br />
              Tél: +226 06 06 20 46 / +226 70 18 63 61<br />
              <a href="https://wa.me/22606062046" className="text-white hover:text-gray-300 inline-flex items-center gap-1">
                💬 WhatsApp
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-400 pt-8 text-center text-gray-200">
          <p className="mb-2">
            Développé par : ZONGO Wend-mi Aida Isidora
          </p>
          <p className="text-sm">
            Contact : +226 66 86 90 10 | Email : aida04zng@gmail.com<br />
            <a href="https://wa.me/22666869010" className="text-white hover:text-gray-300">
              WhatsApp: +226 66 86 90 10
            </a>
          </p>
          <p className="text-xs mt-4">
            © 2025 ARAS - Association Retour Aux Sources. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/activities"} component={Activities} />
      <Route path={"/articles"} component={Articles} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/membership"} component={Membership} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/admin-login"} component={AdminLogin} />
      <Route path={"/admin"} component={AdminDashboard} />
      {/* Redirect /membership/admin to /admin for user helper */}
      <Route path={"/membership/admin"} component={() => {
        window.location.href = "/admin";
        return null;
      }} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
