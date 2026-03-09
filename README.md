# 🚀 IndustriesWeb Backend API

API NestJS centralisée pour gérer les formulaires de soumission des événements **Plant Manager Meeting**, **FMEC**, et **IndustriCom**.

---

## 📦 Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| NestJS | ^11 | Framework backend |
| Prisma | ^6 | ORM + migrations |
| PostgreSQL | 15+ | Base de données |
| JWT | passport-jwt | Authentification |
| Cloudinary | latest | Upload fichiers |
| Multer | latest | Gestion multipart |
| Swagger | ^11 | Documentation API |
| bcryptjs | ^3 | Hashage mots de passe |

---

## 🗂️ Structure du Projet

```
src/
├── config/
│   ├── cors.config.ts                  # CORS multi-origines depuis .env
│   ├── swagger.config.ts               # Swagger UI /api/docs
│   ├── validation.config.ts            # ValidationPipe global
│   ├── cloudinary.config.ts            # Init Cloudinary
│   ├── cloudinary-image.upload.ts      # Upload image → WebP
│   └── cloudinary-pdf.upload.ts        # Upload PDF → raw
├── prisma/
│   ├── prisma.service.ts               # PrismaClient global
│   └── prisma.module.ts                # @Global() module
├── modules/
│   ├── submission/                     # Formulaires contact/vip/sponsoring/stand
│   ├── auth/                           # Login JWT
│   ├── admin/                          # Backoffice privé (JWT requis)
│   └── press/                          # Accréditations presse + upload Cloudinary
├── common/guards/
│   └── jwt-auth.guard.ts
├── app.module.ts
└── main.ts
prisma/
├── schema.prisma                       # Modèles BDD
├── migrations/                         # Historique migrations
└── seed.ts                             # Compte admin initial
```

---

## ⚙️ Variables d'Environnement

### `.env` (développement local)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/contact_db"
PORT=8080
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
JWT_SECRET="secret_dev"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="Password@123"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

### `.env.prod` (Railway)
```env
DATABASE_URL="postgresql://postgres:XXX@caboose.proxy.rlwy.net:PORT/railway"
PORT=8080
ALLOWED_ORIGINS="https://plant-manager.com,https://fmec.ma"
JWT_SECRET="secret_prod_fort_minimum_32_chars"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@contact-api.com"
ADMIN_PASSWORD="MotDePasseAdmin123!"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

---

## 🗃️ Base de Données

### Schéma Prisma

#### Table `submissions`
Gère tous les formulaires : contact, vip, sponsoring, stand.

| Colonne | Type | Description |
|---------|------|-------------|
| id | String (UUID) | Identifiant unique |
| source | String | "PLANT MANAGER MEETING" \| "FMEC" |
| plan | String | "contact" \| "vip" \| "sponsoring" \| "stand" |
| type | String? | "gold" \| "platinum" \| "silver" \| "stand-standard" \| ... |
| firstName | String | Prénom |
| lastName | String | Nom |
| email | String | Email |
| phone | String? | Téléphone |
| fonction | String? | Fonction |
| entreprise | String? | Entreprise |
| ville | String? | Ville |
| localisation | String? | Localisation |
| interlocuteur | String? | Interlocuteur |
| message | String? | Message (contact uniquement) |
| read | Boolean | Lu dans le backoffice |
| createdAt | DateTime | Date de création |

#### Table `press_accreditations`
Gère les demandes d'accréditation presse.

| Colonne | Type | Description |
|---------|------|-------------|
| id | String (UUID) | Identifiant unique |
| source | String | Événement source |
| firstName | String | Prénom |
| lastName | String | Nom |
| email | String | Email professionnel |
| phone | String | Téléphone |
| media | String | Nom du média |
| fonction | String | Journaliste \| Photographe \| ... |
| website | String? | Site web / réseaux sociaux |
| coverage | String[] | Types de couverture |
| interview | Boolean | Demande d'interview |
| pressCardUrl | String? | URL Cloudinary carte de presse |
| status | String | "pending" \| "approved" \| "rejected" |
| read | Boolean | Lu dans le backoffice |
| createdAt | DateTime | Date de création |

#### Table `admins`
| Colonne | Type | Description |
|---------|------|-------------|
| id | String (UUID) | Identifiant unique |
| email | String | Email unique |
| password | String | Mot de passe hashé bcrypt |
| createdAt | DateTime | Date de création |

---

## 🌐 Endpoints API

### Base URL
```
Local      : http://localhost:8080/api/v1
Production : https://industriesweb-backend-production.up.railway.app/api/v1
Swagger    : https://industriesweb-backend-production.up.railway.app/api/docs
```

---

## 📋 Module Submission — Routes Publiques

### `POST /api/v1/submission`
Soumettre un formulaire (contact, vip, sponsoring, stand).

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "source": "PLANT MANAGER MEETING",
  "plan": "sponsoring",
  "type": "gold",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@test.com",
  "phone": "+212600000000",
  "fonction": "Directeur",
  "entreprise": "Acme",
  "ville": "Casablanca",
  "localisation": "Maroc",
  "interlocuteur": "Mohamed"
}
```

**Valeurs `plan` :**
| plan | Description |
|------|-------------|
| `contact` | Formulaire de contact |
| `vip` | Inscription VIP |
| `sponsoring` | Demande de sponsoring |
| `stand` | Réservation stand |

**Valeurs `type` selon le plan :**
| plan | types possibles |
|------|----------------|
| `sponsoring` | `gold`, `platinum`, `silver`, `prestige`, `officiel` |
| `stand` | `stand-standard`, `stand-premium` |
| `vip` | `vip` |
| `contact` | `null` |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Soumission reçue avec succès",
  "data": { "id": "uuid" }
}
```

---

## 🔐 Module Auth

### `POST /api/v1/auth/login`
Connexion admin — retourne un token JWT.

**Body :**
```json
{
  "email": "admin@gmail.com",
  "password": "Password@123"
}
```

**Réponse 200 :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

**Utilisation du token :**
```
Authorization: Bearer <access_token>
```

---

## 🛡️ Module Admin — Routes Privées (JWT requis)

Toutes les routes admin nécessitent le header :
```
Authorization: Bearer <token>
```

### `GET /api/v1/admin/submissions`
Lister les soumissions avec filtres et pagination.

**Query params :**
| Param | Type | Exemple | Description |
|-------|------|---------|-------------|
| page | number | `1` | Page (défaut: 1) |
| limit | number | `20` | Par page (défaut: 20) |
| source | string | `FMEC` | Filtrer par source |
| plan | string | `sponsoring` | Filtrer par plan |
| type | string | `gold` | Filtrer par type |

**Exemple :**
```
GET /api/v1/admin/submissions?source=FMEC&plan=sponsoring&type=gold&page=1&limit=20
```

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "uuid",
      "source": "FMEC",
      "plan": "sponsoring",
      "type": "gold",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean@test.com",
      "read": false,
      "createdAt": "2026-03-05T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### `GET /api/v1/admin/submissions/:id`
Détail d'une soumission.

**Réponse 200 :**
```json
{
  "id": "uuid",
  "source": "PLANT MANAGER MEETING",
  "plan": "sponsoring",
  "type": "gold",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@test.com",
  "phone": "+212600000000",
  "fonction": "Directeur",
  "entreprise": "Acme",
  "ville": "Casablanca",
  "localisation": "Maroc",
  "interlocuteur": "Mohamed",
  "read": false,
  "createdAt": "2026-03-05T10:00:00Z"
}
```

### `PATCH /api/v1/admin/submissions/:id/read`
Marquer une soumission comme lue.

**Réponse 200 :**
```json
{
  "success": true,
  "data": { "id": "uuid", "read": true }
}
```

### `GET /api/v1/admin/stats`
Statistiques globales du backoffice.

**Réponse 200 :**
```json
{
  "total": 150,
  "byPlan": {
    "contact": 50,
    "vip": 30,
    "sponsoring": 40,
    "stand": 30
  },
  "bySource": {
    "PLANT MANAGER MEETING": 100,
    "FMEC": 50
  },
  "unread": 25
}
```

### `GET /api/v1/admin/press-accreditations`
Lister les demandes d'accréditation presse.

**Query params :**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page (défaut: 1) |
| limit | number | Par page (défaut: 20) |
| status | string | `pending` \| `approved` \| `rejected` |
| source | string | Filtrer par source |

**Exemple :**
```
GET /api/v1/admin/press-accreditations?status=pending&page=1
```

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": "uuid",
      "source": "PLANT MANAGER MEETING",
      "firstName": "Marie",
      "lastName": "Martin",
      "email": "marie@lemonde.fr",
      "media": "Le Monde",
      "fonction": "Journaliste",
      "coverage": ["Article de presse", "Interview"],
      "interview": true,
      "pressCardUrl": "https://res.cloudinary.com/xxx/raw/upload/press-accreditations/carte-presse.pdf",
      "status": "pending",
      "read": false,
      "createdAt": "2026-03-05T10:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### `GET /api/v1/admin/press-accreditations/:id`
Détail d'une accréditation presse.

### `PATCH /api/v1/admin/press-accreditations/:id/status`
Changer le statut d'une accréditation.

**Body :**
```json
{
  "status": "approved"
}
```

**Valeurs possibles :** `pending`, `approved`, `rejected`

**Réponse 200 :**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "approved" }
}
```

### `PATCH /api/v1/admin/press-accreditations/:id/read`
Marquer une accréditation comme lue.

---

## 📰 Module Press — Routes Publiques

### `POST /api/v1/press-accreditation`
Soumettre une demande d'accréditation presse avec upload fichier.

**Headers :**
```
Content-Type: multipart/form-data
```

**FormData fields :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| source | string | ✅ | Événement source |
| firstName | string | ✅ | Prénom |
| lastName | string | ✅ | Nom |
| email | string | ✅ | Email professionnel |
| phone | string | ✅ | Téléphone |
| media | string | ✅ | Nom du média |
| fonction | string | ✅ | Journaliste \| Photographe \| ... |
| website | string | ❌ | Site web / réseaux |
| coverage | string (JSON) | ✅ | `["Article de presse","Interview"]` |
| interview | string | ✅ | `"true"` \| `"false"` |
| pressCard | File | ❌ | PDF ou image (10MB max) |

**Valeurs `fonction` :**
```
Journaliste | Photographe | Reporter video | Rédacteur.rice | Ingénieur son | Autre
```

**Valeurs `coverage` :**
```
Article de presse | Reportage TV | Interview | Diffusion sur site web | Réseaux sociaux | Couverture globale
```

**Exemple Postman (form-data) :**
```
source      : PLANT MANAGER MEETING
firstName   : Marie
lastName    : Martin
email       : marie@lemonde.fr
phone       : +212600000000
media       : Le Monde
fonction    : Journaliste
coverage    : ["Article de presse","Interview"]
interview   : true
pressCard   : [fichier.pdf]
```

**Upload fichier — comportement :**
| Type fichier | Stockage Cloudinary |
|-------------|---------------------|
| `.pdf` | `resource_type: raw` → URL `.pdf` conservée |
| `.jpg`, `.png` | Converti en `.webp` optimisé |

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Votre demande d'accréditation a été envoyée avec succès",
  "data": {
    "id": "uuid",
    "createdAt": "2026-03-06T10:00:00Z"
  }
}
```

---

## 🚀 Installation & Démarrage

### Développement local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec tes valeurs

# 3. Lancer les migrations
npx prisma migrate dev

# 4. Créer le compte admin
npx prisma db seed

# 5. Démarrer le serveur
npm run start:dev
```

### Scripts disponibles

```bash
npm run start:dev       # Développement avec hot-reload
npm run build           # Compiler TypeScript
npm run start:prod      # Lancer en production

npm run db:migrate      # Nouvelle migration (local)
npm run db:deploy       # Appliquer migrations (local)
npm run db:seed         # Créer admin (local)
npm run db:studio       # Ouvrir Prisma Studio (local)
npm run db:reset        # ⚠️ Réinitialiser BDD locale

npm run prod:migrate    # Appliquer migrations (Railway)
npm run prod:seed       # Créer admin (Railway)
npm run prod:start      # Lancer avec .env.prod
```

---

## 🚂 Déploiement Railway

### Base de données PostgreSQL

```bash
# 1. Créer service PostgreSQL sur Railway
# 2. Copier DATABASE_URL publique dans .env.prod
# 3. Appliquer migrations
npm run prod:migrate

# 4. Créer le compte admin
npm run prod:seed
```

### Backend NestJS

```bash
# 1. Push sur GitHub
git push origin main

# 2. Railway détecte et déploie automatiquement
# 3. Ajouter les variables d'environnement dans Railway Dashboard
```

**Variables Railway à configurer :**
```env
DATABASE_URL        ← URL interne Railway
PORT=8080
JWT_SECRET
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS
ADMIN_EMAIL
ADMIN_PASSWORD
CLOUDINARY_URL
```

---

## ☁️ Cloudinary — Upload Fichiers

### Configuration
```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

### Activer la livraison PDF (Free plan)
1. `cloudinary.com/console`
2. **Settings** → **Security**
3. Activer **"Allow delivery of PDF and ZIP files"**

### Dossiers Cloudinary
```
press-accreditations/   ← Cartes de presse
  ├── nom-fichier.pdf   ← PDF conservé tel quel
  └── nom-fichier.webp  ← Image convertie en WebP
```

---

## 🔒 Sécurité

| Mesure | Implémentation |
|--------|---------------|
| Mots de passe | bcryptjs 12 rounds |
| Tokens JWT | Expiration 7 jours |
| CORS | Origines whitelistées uniquement |
| Validation | class-validator + whitelist: true |
| Upload | fileFilter + limite 10MB |

---

## 📖 Documentation Swagger

```
http://localhost:8080/api/docs
https://industriesweb-backend-production.up.railway.app/api/docs
```

Swagger permet de tester tous les endpoints directement depuis le navigateur avec authentification JWT intégrée.

---

## 🗺️ Roadmap

- [ ] Routes admin pour accréditations presse (list, detail, status, read)
- [ ] Email de confirmation automatique (accréditation presse)
- [ ] Rate limiting anti-spam
- [ ] Export CSV des soumissions
- [ ] Logs structurés Winston
- [ ] Tests E2E