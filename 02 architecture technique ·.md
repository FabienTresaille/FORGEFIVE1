# 02 — Architecture technique & déploiement

## Stack retenue
- **Backend** : Python / FastAPI (cohérent avec les autres services déjà en prod sur le VPS)
- **Base de données** : PostgreSQL (conteneur Docker dédié, volume nommé persistant)
- **Frontend** : Web app responsive (PWA) — Next.js (React) ou SvelteKit, au choix d'Antigravity selon ce qui est le plus rapide à livrer proprement. Doit fonctionner correctement sur mobile (utilisation en salle de sport).
- **Auth** : JWT (access + refresh token), pas d'inscription publique — comptes créés uniquement par l'admin.
- **IA coaching** : appels serveur → API Google Gemini (clé API liée à l'abonnement Google AI Pro). Jamais d'appel IA direct depuis le frontend (clé API doit rester côté backend).
- **Conteneurisation** : Docker + docker-compose, un service par brique (backend, frontend si séparé, db).
- **Reverse proxy** : Traefik v3 déjà en place sur le VPS (auto-détection de labels).

## Convention réseau/Traefik (à respecter, cohérent avec Optisafe)
- Réseau Docker externe pour le routage Traefik : réutiliser le réseau externe déjà utilisé par les autres apps (ex. `audit-app_web`), ou en créer un dédié si Antigravity préfère isoler le projet — dans ce cas le nommer clairement (ex. `forgefive_web`) et le documenter dans le README.
- Certificat SSL : resolver `letsencrypt` déjà configuré sur Traefik.
- Entrypoint : `websecure` (port 443).
- Sous-domaine de départ : `perf.alsek.fr` (à adapter — l'utilisateur choisit le sous-domaine final et pointe le DNS lui-même).

## Ce que doit livrer Antigravity (fichiers uniquement, pas d'exécution)
```
forgefive/
├── backend/
│   ├── app/                     # code FastAPI
│   ├── alembic/                 # migrations DB
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml           # services backend + frontend + db, réseau externe Traefik
├── .env.example                 # toutes les variables nécessaires, sans valeurs réelles
├── traefik-labels.md            # labels Traefik exacts à vérifier/adapter avant déploiement
└── README.md                    # instructions de déploiement manuel (build, migrations, premier admin)
```

## Variables d'environnement attendues (.env.example)
- `DATABASE_URL`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` (pour bootstrap du premier compte admin)
- `CORS_ORIGINS`
- `DOMAIN` (pour les labels Traefik)

## Sécurité minimale attendue
- Pas de route d'inscription publique (`/register` ne doit pas exister ou doit être désactivée par défaut).
- Seul un admin authentifié peut créer un user.
- Isolation des données par utilisateur : un user ne doit jamais pouvoir lire les séances/données de récup d'un autre user via l'API (vérifier systématiquement l'ownership sur chaque endpoint).
- Le classement de groupe est une vue agrégée en lecture seule (rangs/scores), jamais un accès aux séances détaillées des autres.

## Ce qu'Antigravity NE doit PAS faire
- Ne pas exécuter de `docker compose up`, ne pas pousser sur un dépôt distant, ne pas toucher au VPS.
- Ne pas générer de compte de démo public ni de données de seed avec des vraies infos.
- Ne pas inclure de dépendance à un store (Apple/Google) ni de config de publication mobile native.