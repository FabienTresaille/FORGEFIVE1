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
| Réseau Docker | `audit-app_web` (externe) |
| Domaine | `perfs.alsek.fr` |

## Déploiement

### Prérequis

- VPS avec Docker et Docker Compose installés
- Traefik v3 en place sur le réseau externe `audit-app_web`
- DNS `perfs.alsek.fr` pointant vers le VPS
- Clé API Google Gemini

### Installation

1. **Cloner / Mettre à jour** :
   ```bash
   git pull
   ```

2. **Configurer l'environnement** :
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Lancer les conteneurs** :
   ```bash
   docker compose build
   docker compose up -d
   ```

4. **Vérifier** :
   - Frontend : `https://perfs.alsek.fr`
   - API Docs : `https://perfs.alsek.fr/api/docs`
