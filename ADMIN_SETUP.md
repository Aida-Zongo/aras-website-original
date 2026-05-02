# ARAS Website - Admin Setup Guide

## 📋 Admin Account Information

**Account Created:** ✓ Successfully initialized

### Credentials

| Field | Value |
|-------|-------|
| **OpenID** | `admin-aras-2025` |
| **Email** | `admin@aras.local` |
| **Name** | Administrateur ARAS |
| **Role** | Admin |
| **Status** | Active |

## 🔐 How to Access the Admin Panel

The ARAS website uses **Manus OAuth** for authentication. To access the admin panel:

1. **Navigate to the Admin Panel:**
   - Go to: `https://your-site-url/admin`

2. **Login with Manus OAuth:**
   - Click the login button
   - You will be redirected to the Manus OAuth portal
   - Use your Manus account credentials to authenticate
   - After successful authentication, you will be redirected to the admin dashboard

3. **Admin Dashboard Features:**
   - **Activités** : Manage activities by category (Culture & Traditions, Droits Humains, etc.)
   - **Articles** : Create, edit, and publish articles
   - **Médias** : Upload and organize photos and videos
   - **Adhésions** : Review and manage membership applications
   - **Messages** : View and respond to contact form submissions

## 📝 Admin Panel Capabilities

### Activities Management
- Create new activities with title, description, and category
- Assign activities to one of 6 categories
- Upload images for each activity
- Edit and delete activities

### Articles Management
- Write and publish articles
- Save drafts for later publication
- Add featured images
- Manage article visibility

### Media Management
- Upload photos and videos
- Organize media by category
- Add titles and descriptions
- Delete media files

### Membership Applications
- View all membership requests
- Review applicant information
- Approve or reject applications
- Track application status

### Contact Messages
- View all contact form submissions
- Mark messages as read/responded
- Reply directly via email
- Track message status

## 🔄 Database Schema

The following tables are available in the database:

| Table | Purpose |
|-------|---------|
| `users` | User accounts and admin roles |
| `activities` | Organization activities and projects |
| `articles` | Blog posts and news articles |
| `media` | Photos and videos |
| `membershipSubmissions` | Membership application forms |
| `contactSubmissions` | Contact form submissions |

## 🛠️ Technical Details

### Technology Stack
- **Frontend:** React 19 + Tailwind CSS 4
- **Backend:** Express 4 + tRPC 11
- **Database:** MySQL/TiDB
- **Authentication:** Manus OAuth
- **File Storage:** S3 (for media uploads)

### API Endpoints
All admin operations use tRPC procedures:
- `trpc.activities.*` - Activity management
- `trpc.articles.*` - Article management
- `trpc.media.*` - Media management
- `trpc.membership.*` - Membership management
- `trpc.contact.*` - Contact management

## 🚀 First Steps

1. **Access the Admin Panel:**
   - Navigate to `/admin` on your website

2. **Create Your First Activity:**
   - Go to "Activités" tab
   - Click "+ Nouvelle Activité"
   - Fill in the form with activity details
   - Select a category
   - Submit

3. **Upload Media:**
   - Go to "Médias" tab
   - Click "+ Ajouter un Média"
   - Upload photos or videos
   - Add descriptions

4. **Review Membership Requests:**
   - Go to "Adhésions" tab
   - Review pending applications
   - Approve or reject as needed

## ⚠️ Important Notes

- All content must be in **French**
- Images should be optimized for web (recommended: 1920x1080 or larger)
- The admin panel requires authentication via Manus OAuth
- All changes are saved to the database immediately
- Media files are stored in S3 cloud storage

## 📞 Support

For technical support or questions about the admin panel, please contact:

**Developer:** ZONGO Wend-mi Aida Isidora  
**Email:** aida04zng@gmail.com  
**Phone:** +226 66 86 90 10

---

**Website:** ARAS - Association Retour Aux Sources  
**Last Updated:** November 2025
