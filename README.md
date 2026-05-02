# ARAS Website - Association Retour Aux Sources

Website of the **Association Retour Aux Sources (A.R.A.S)**, an organization based in Koudougou, Burkina Faso, dedicated to community development through culture, peace, and education.

## 🚀 Mission
"Promouvoir le développement à travers une approche intégrée en promotion des valeurs culturelles et traditionnelles, en éducation, en santé et en protection de l'environnement."

**Motto:** Culture - Paix - Développement

## ✨ Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS 4, Shadcn/UI
- **Backend:** Node.js, Express, tRPC
- **Database:** SQLite (dev) / MySQL (prod) via Drizzle ORM
- **Language:** TypeScript

---

## 🛠️ Instructions pour le Mentor (Test & Hébergement)

Voici les instructions complètes pour exécuter ce projet localement et le préparer pour le déploiement.

### 1. Prérequis

- **Node.js** (v20 ou supérieur recommandé)
- **npm** ou **pnpm**

### 2. Installation Locale

Clonez le projet ou décompressez l'archive, puis installez les dépendances :

```bash
# Se placer dans le dossier du projet
cd ARAS-Website

# Installer les dépendances
npm install
# ou pnpm install
```

### 3. Configuration des Variables d'Environnement (.env)

Créez un fichier `.env` à la racine du projet (au même niveau que `package.json`) avec le contenu suivant :

```env
# Base de données locale (SQLite pour les tests)
DATABASE_URL="file:sqlite.db"
```

> **Note :** Cette configuration minimale est suffisante pour que l'application fonctionne en local et vous permette de tester l'interface.

### 4. Initialisation de la Base de Données

Générez les tables et insérez les données par défaut (admin account).

```bash
# 1. Pousser le schéma dans la base de données
npm run db:push

# 2. Insérer les données par défaut (si nécessaire)
npm run db:seed
```

### 5. Lancement en Mode Développement (Test)

Démarrez le serveur de développement :

```bash
npm run dev
```

Le site sera accessible à l'adresse : **http://localhost:3000**

### 6. Accès à l'Espace d'Administration

Pour tester le dashboard d'administration :
1. Accédez à `http://localhost:3000/admin`
2. Connectez-vous. Le compte `admin-aras-2025` est défini comme administrateur si l'authentification est activée.

---

## 🌍 Déploiement (Production)

Pour héberger ce site sur un VPS ou une plateforme cloud (Render, Railway, Vercel/Heroku) :

1. **Build du projet :**
   ```bash
   npm run build
   ```
   *Ceci génère un dossier `dist` contenant le frontend optimisé et le code backend compilé.*

2. **Démarrage en production :**
   ```bash
   npm run start
   ```

3. **Recommandations pour l'hébergement :**
   - **Base de données :** Remplacez SQLite par MySQL en modifiant la variable `DATABASE_URL` dans l'environnement de production.
   - **Stockage de médias :** Les uploads (images, vidéos) peuvent nécessiter une configuration S3 si l'hébergement est serverless.
   - **Port :** L'application écoutera sur le port spécifié par la variable d'environnement `PORT` (par défaut 3000 ou 5000).

## 📞 Support & Contacts
Pour des questions concernant le code ou l'architecture :
- **Développeur:** ZONGO Wend-mi Aida Isidora 
- **Email:** aida04zng@gmail.com
 