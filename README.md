# ForgeFive 🏋️

Application privée de suivi de musculation/cardio pour un groupe fermé de 5-6 amis. Classement interne, coaching IA (Gemini), zone de récupération, fil d'activité Strava-like et gamification.

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Python 3.12 / FastAPI |
| Base de données | PostgreSQL 16 |
| Frontend | Next.js (React, App Router) |
| Auth | JWT (access + refresh token) |
| IA | Google Gemini API |
| Conteneurisation | Docker + Docker Compose |
| Reverse Proxy | Traefik v3 |
| Domaine | `perfs.alsek.fr` |

## Déploiement

### Prérequis

- VPS avec Docker et Docker Compose installés
- Traefik v3 en place avec resolver `letsencrypt` et entrypoint `websecure`
- DNS `perfs.alsek.fr` pointant vers le VPS (enregistrement A)
- Clé API Google Gemini (abonnement Google AI Pro)

### Installation

1. **Cloner le projet** sur le VPS :
   ```bash
   git clone <repo-url> forgefive
   cd forgefive
   ```

2. **Configurer l'environnement** :
   ```bash
   cp .env.example .env
   nano .env  # Remplir TOUTES les valeurs
   ```

   Variables à remplir impérativement :
   - `POSTGRES_PASSWORD` et `DATABASE_URL` (même mot de passe)
   - `JWT_SECRET` (générer avec `openssl rand -hex 32`)
   - `GEMINI_API_KEY` (depuis Google AI Studio)
   - `ADMIN_INITIAL_EMAIL` et `ADMIN_INITIAL_PASSWORD`

3. **Créer le réseau Docker externe** (si non existant) :
   ```bash
   docker network create forgefive_web
   ```

4. **Builder et lancer** :
   ```bash
   docker compose build
   docker compose up -d
   ```

5. **Exécuter les migrations** :
   ```bash
   docker compose exec backend alembic upgrade head
   ```

6. **Vérifier** :
   ```bash
   # Logs backend
   docker compose logs -f backend

   # Test API
   curl https://perfs.alsek.fr/api/docs

   # Test frontend
   curl -I https://perfs.alsek.fr
   ```

### Premier compte admin

Au premier démarrage du backend, un compte admin est automatiquement créé avec les identifiants définis dans `.env` (`ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD`). Le mot de passe devra être changé à la première connexion.

### Gestion des utilisateurs

1. Se connecter en tant qu'admin sur `https://perfs.alsek.fr`
2. Accéder au back-office admin (icône ⚙️)
3. Créer les comptes des amis (email + pseudo) → un mot de passe temporaire est généré
4. Transmettre le mot de passe temporaire à chaque ami
5. Chaque ami change son mot de passe à la première connexion

## Mise à jour

```bash
cd forgefive
git pull
docker compose build
docker compose up -d
docker compose exec backend alembic upgrade head
```

## Structure du projet

```
forgefive/
├── backend/
│   ├── app/              # Code FastAPI
│   │   ├── api/          # Routes API
│   │   ├── models/       # Modèles SQLAlchemy
│   │   ├── schemas/      # Schémas Pydantic
│   │   ├── services/     # Logique métier
│   │   └── seed/         # Données initiales
│   ├── alembic/          # Migrations DB
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Pages Next.js
│   │   ├── components/   # Composants React
│   │   ├── lib/          # Utilitaires
│   │   └── hooks/        # Hooks React
│   ├── public/           # Assets statiques + PWA
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
├── traefik-labels.md
└── README.md
```

## Fonctionnalités

- ✅ Suivi de séances (musculation + cardio)
- ✅ Bibliothèque d'exercices (~120 exercices) + exercices personnalisés
- ✅ Routines réutilisables
- ✅ Système de rangs par exercice (Bronze → Diamant)
- ✅ Classement du groupe fermé
- ✅ Bodygraph (visualisation muscles)
- ✅ Zone de récupération (sommeil, courbatures, énergie) + recommandation IA
- ✅ Coach IA conversationnel (Gemini)
- ✅ Fil d'activité Strava-like (publier, liker, commenter)
- ✅ Classement d'assiduité
- ✅ Streaks & badges
- ✅ PWA mobile-first (installable sur smartphone)

## Sécurité

- Pas d'inscription publique — comptes créés uniquement par l'admin
- Isolation stricte des données par utilisateur
- Clé API Gemini côté serveur uniquement
- JWT avec refresh token
- Passwords hashés (bcrypt)

## Licence

Projet privé — usage interne uniquement.
