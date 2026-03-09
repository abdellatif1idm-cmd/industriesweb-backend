# 👋 Onboarding — IndustriesWeb Backend

Bienvenue sur le projet ! Ce guide te permet d'être opérationnel en moins de 15 minutes.

---

## ✅ Prérequis

Installe ces outils avant de commencer :

| Outil | Version | Lien |
|-------|---------|------|
| Node.js | 20+ | https://nodejs.org |
| npm | 9+ | Inclus avec Node.js |
| PostgreSQL | 15+ | https://postgresql.org |
| Git | latest | https://git-scm.com |

Vérifie tes versions :
```bash
node -v    # → v20.x.x
npm -v     # → 9.x.x
psql -V    # → 15.x
git -v     # → 2.x.x
```

---

## 🚀 Setup en 5 étapes

### Étape 1 — Cloner le projet
```bash
git clone https://github.com/industriesweb/industriesweb-backend.git
cd industriesweb-backend
```

### Étape 2 — Installer les dépendances
```bash
npm install
```

### Étape 3 — Créer la base de données PostgreSQL
```bash
# Ouvrir psql
psql -U postgres

# Dans psql :
CREATE DATABASE contact_db;
\q
```

### Étape 4 — Configurer l'environnement
```bash
# Copier le fichier exemple
cp .env.example .env
```

Édite `.env` avec tes valeurs :
```env
DATABASE_URL="postgresql://postgres:TON_MOT_DE_PASSE@localhost:5432/contact_db"
PORT=8080
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
JWT_SECRET="dev_secret_change_en_prod"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="Password@123"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
```

### Étape 5 — Initialiser la base de données
```bash
# Appliquer les migrations
npx prisma migrate dev

# Créer le compte admin
npx prisma db seed

# Vérifier dans Prisma Studio
npx prisma studio
# → Ouvre http://localhost:5555
# → Tu dois voir 3 tables : admins, submissions, press_accreditations
```

---

## 🟢 Lancer le serveur

```bash
npm run start:dev
```

Tu dois voir :
```
🚀 API     : http://localhost:8080/api/v1
📚 Swagger : http://localhost:8080/api/docs
```

---

## 🧪 Tester que tout fonctionne

### Test 1 — Login admin
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Password@123"}'
```
✅ Réponse attendue : `{ "access_token": "eyJ..." }`

### Test 2 — Soumettre un formulaire
```bash
curl -X POST http://localhost:8080/api/v1/submission \
  -H "Content-Type: application/json" \
  -d '{
    "source": "PLANT MANAGER MEETING",
    "plan": "contact",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@test.com"
  }'
```
✅ Réponse attendue : `{ "success": true }`

### Test 3 — Swagger UI
Ouvre `http://localhost:8080/api/docs` dans ton navigateur.

---

## 📁 Fichiers importants à connaître

```
.env                          ← Variables locales (NE PAS commiter)
.env.prod                     ← Variables production (NE PAS commiter)
.env.example                  ← Template à copier
prisma/schema.prisma          ← Structure de la BDD
prisma/seed.ts                ← Données initiales (admin)
src/main.ts                   ← Point d'entrée
src/app.module.ts             ← Modules enregistrés
railway.json                  ← Config déploiement Railway
```

---

## 🛠️ Commandes du quotidien

```bash
# Développement
npm run start:dev             # Lancer avec hot-reload

# Base de données locale
npm run db:migrate            # Nouvelle migration
npm run db:seed               # Recréer l'admin
npm run db:studio             # Interface visuelle BDD
npm run db:reset              # ⚠️ Reset complet (perd les données)

# Base de données Railway (production)
npm run prod:migrate          # Appliquer migrations en prod
npm run prod:seed             # Créer admin en prod

# Build
npm run build                 # Compiler TypeScript
```

---

## 🌿 Workflow Git

```bash
# 1. Toujours créer une branche
git checkout -b feat/nom-de-la-feature

# 2. Commiter fichier par fichier
git add src/modules/xxx/xxx.service.ts
git commit -m "feat(xxx): description courte"

# 3. Push
git push origin feat/nom-de-la-feature

# 4. Créer une Pull Request sur GitHub
```

### Convention des commits
```
feat(module)  : nouvelle fonctionnalité
fix(module)   : correction de bug
chore         : config, dépendances
refactor      : refactoring sans nouvelle feature
docs          : documentation
```

---

## 🗂️ Ajouter un nouveau module

### 1. Créer la structure
```bash
mkdir src/modules/nouveau-module
mkdir src/modules/nouveau-module/dto
touch src/modules/nouveau-module/nouveau-module.module.ts
touch src/modules/nouveau-module/nouveau-module.service.ts
touch src/modules/nouveau-module/nouveau-module.controller.ts
touch src/modules/nouveau-module/dto/create-nouveau-module.dto.ts
```

### 2. Structure type
```typescript
// nouveau-module.module.ts
@Module({
  controllers: [NouveauModuleController],
  providers:   [NouveauModuleService],
})
export class NouveauModuleModule {}

// app.module.ts — Enregistrer le module
imports: [
  // ... autres modules
  NouveauModuleModule,
]
```

### 3. Ajouter le modèle Prisma
```prisma
// prisma/schema.prisma
model NouveauModele {
  id        String   @id @default(uuid())
  // ... champs
  createdAt DateTime @default(now()) @map("created_at")
  @@map("nouveau_modele")
}
```

### 4. Migrer
```bash
npx prisma migrate dev --name add-nouveau-module
npx prisma generate
```

---

## 🔑 Accès Cloudinary

1. Créer un compte sur `cloudinary.com`
2. Dashboard → **API Keys**
3. Copier `CLOUDINARY_URL` directement
4. Activer **"Allow delivery of PDF and ZIP files"** dans Settings → Security

---

## 🚂 Accès Railway

Demande les accès à l'équipe pour :
- Dashboard Railway : `railway.app`
- Projet : `industriesweb-backend`
- Variables d'environnement de production

---

## ❓ FAQ

**Q : `prisma generate` échoue avec EPERM ?**
```bash
# Arrêter le serveur NestJS (Ctrl+C) puis :
taskkill /F /IM node.exe  # Windows
npx prisma generate
```

**Q : Erreur `Cannot GET /api/v1` ?**
C'est normal — `/api/v1` n'existe pas seul. Utilise `/api/v1/submission` ou `/api/docs`.

**Q : Login retourne 401 ?**
```bash
# Vérifier que le seed a été exécuté
npx prisma db seed
# Vérifier dans Prisma Studio que l'admin existe
npx prisma studio
```

**Q : CORS bloqué depuis le frontend ?**
Ajouter l'origine dans `.env` :
```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001,http://ton-origine"
```
Puis redémarrer le serveur.

**Q : Comment tester avec Postman ?**
1. `POST /api/v1/auth/login` → copier `access_token`
2. Dans les requêtes privées : Header `Authorization: Bearer <token>`

---

## 📞 Contacts

| Rôle | Contact |
|------|---------|
| Lead Dev | abdellatif.houraoui@gmail.com |
| Infra Railway | Dashboard Railway → industriesweb |
| Cloudinary | cloudinary.com/console |