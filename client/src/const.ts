export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "ARAS - Association Retour Aux Sources";

export const APP_LOGO = "/imageARAS.jpg";

// ARAS Contact Information
export const ORGANIZATION_EMAIL = "source_kdg@live.fr";
export const WHATSAPP_LINK = "https://wa.me/22606062046"; // Promoter: Octare Alphonse ZONGO
export const CONTACT_EMAIL_1 = "source_kdg@live.fr";
export const CONTACT_EMAIL_2 = "octavezongo1@gmail.com";
export const CONTACT_PHONE_1 = "+226 06 06 20 46";
export const CONTACT_PHONE_2 = "+226 70 18 63 61";
export const DEVELOPER_NAME = "ZONGO Wend-mi Aida Isidora";
export const DEVELOPER_EMAIL = "aida04zng@gmail.com";
export const DEVELOPER_WHATSAPP = "+226 66 86 90 10";

// Color palette for ARAS
export const COLORS = {
  aras: {
    red: "#E63946",
    green: "#2D6A4F",
    yellow: "#FFD60A",
    white: "#FFFFFF",
  },
  fidats: {
    purple: "#7209B7",
    white: "#FFFFFF",
  },
};

// Activity categories
export const ACTIVITY_CATEGORIES = [
  { value: "culture_traditions", label: "Culture & Traditions" },
  { value: "droits_humains", label: "Droits Humains" },
  { value: "civisme_citoyennete", label: "Civisme & Citoyennete" },
  { value: "education", label: "Education" },
  { value: "environnement", label: "Environnement" },
  { value: "genre_sante", label: "Genre & Sante" },
];

// ARAS Organization Information
export const ORGANIZATION_INFO = {
  name: "Association Retour Aux Sources (A.R.A.S)",
  vision: "Ameliorer les conditions de vie des populations a travers l'amour pour la Nation.",
  mission: "Promouvoir le developpement a travers une approche integree en promotion des valeurs culturelles et traditionnelles, en education, en sante et en protection de l'environnement.",
  motto: "Culture - Paix - Developpement",
  values: [
    "L'egalite",
    "La solidarite",
    "L'esprit d'equipe",
    "L'excellence",
    "L'integrite",
    "L'engagement",
  ],
  location: "Koudougou, Province du Bouldkiemde, Region du Centre-Ouest, Burkina Faso",
  founded: "2015",
};

// Membership types
export const MEMBERSHIP_TYPES = [
  { value: "membre_actif", label: "Membre Actif" },
  { value: "membre_associe", label: "Membre Associé" },
  { value: "membre_honneur", label: "Membre d'Honneur" },
];

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  if (!oauthPortalUrl) return "/admin-login";

  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
