# Traefik Labels — ForgeFive

## Configuration requise

ForgeFive utilise deux routers Traefik pour séparer le frontend et le backend API sur le même domaine `perfs.alsek.fr`.

## Prérequis

1. **Réseau Docker externe** : créer le réseau si non existant :
   ```bash
   docker network create forgefive_web
   ```

2. **DNS** : pointer `perfs.alsek.fr` vers l'IP du VPS (enregistrement A).

3. **Traefik v3** : doit être configuré avec :
   - Entrypoint `websecure` sur le port 443
   - CertResolver `letsencrypt` configuré
   - Provider Docker activé avec `exposedByDefault: false`
   - Réseau `forgefive_web` accessible par Traefik

## Labels appliqués

### Backend (FastAPI) — Route `/api/*`

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.forgefive-api.rule=Host(`perfs.alsek.fr`) && PathPrefix(`/api`)"
  - "traefik.http.routers.forgefive-api.entrypoints=websecure"
  - "traefik.http.routers.forgefive-api.tls.certresolver=letsencrypt"
  - "traefik.http.routers.forgefive-api.service=forgefive-api"
  - "traefik.http.services.forgefive-api.loadbalancer.server.port=8000"
  - "traefik.http.middlewares.forgefive-api-strip.stripprefix.prefixes=/api"
  - "traefik.http.routers.forgefive-api.middlewares=forgefive-api-strip"
  - "traefik.http.routers.forgefive-api.priority=2"
  - "traefik.docker.network=forgefive_web"
```

**Fonctionnement** : les requêtes vers `https://perfs.alsek.fr/api/auth/login` sont routées vers le backend sur le port 8000, avec le préfixe `/api` retiré (le backend reçoit `/auth/login`). La priorité 2 assure que les routes `/api` sont matchées avant le catch-all du frontend.

### Frontend (Next.js) — Route `/*`

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.forgefive-front.rule=Host(`perfs.alsek.fr`)"
  - "traefik.http.routers.forgefive-front.entrypoints=websecure"
  - "traefik.http.routers.forgefive-front.tls.certresolver=letsencrypt"
  - "traefik.http.routers.forgefive-front.service=forgefive-front"
  - "traefik.http.services.forgefive-front.loadbalancer.server.port=3000"
  - "traefik.http.routers.forgefive-front.priority=1"
  - "traefik.docker.network=forgefive_web"
```

**Fonctionnement** : toutes les autres requêtes vers `https://perfs.alsek.fr/*` sont routées vers le frontend Next.js sur le port 3000. La priorité 1 (plus basse) assure que ce router est le catch-all après les routes API.

## Vérification

Après déploiement, vérifier :
```bash
# Frontend
curl -I https://perfs.alsek.fr

# Backend API
curl https://perfs.alsek.fr/api/docs

# Certificat SSL
curl -v https://perfs.alsek.fr 2>&1 | grep "SSL certificate"
```
