# Traefik Labels — ForgeFive

## Configuration Docker (Impératif)

- **Network** : `audit-app_web` (externe)
- **Labels Traefik** :
  - Frontend : `traefik.http.routers.vision.rule=Host('perfs.alsek.fr')`
  - Backend API : `traefik.http.routers.vision-api.rule=Host('perfs.alsek.fr') && PathPrefix('/api')`

---

## Labels appliqués

### 1. Frontend (Next.js) — Router `vision`

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.vision.rule=Host(`perfs.alsek.fr`)"
  - "traefik.http.routers.vision.entrypoints=websecure"
  - "traefik.http.routers.vision.tls.certresolver=letsencrypt"
  - "traefik.http.routers.vision.service=vision"
  - "traefik.http.services.vision.loadbalancer.server.port=3000"
  - "traefik.http.routers.vision.priority=1"
  - "traefik.docker.network=audit-app_web"
```

### 2. Backend (FastAPI) — Router `vision-api`

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.vision-api.rule=Host(`perfs.alsek.fr`) && PathPrefix(`/api`)"
  - "traefik.http.routers.vision-api.entrypoints=websecure"
  - "traefik.http.routers.vision-api.tls.certresolver=letsencrypt"
  - "traefik.http.routers.vision-api.service=vision-api"
  - "traefik.http.services.vision-api.loadbalancer.server.port=8000"
  - "traefik.http.middlewares.vision-api-strip.stripprefix.prefixes=/api"
  - "traefik.http.routers.vision-api.middlewares=vision-api-strip"
  - "traefik.http.routers.vision-api.priority=2"
  - "traefik.docker.network=audit-app_web"
```

---

## Vérifications

```bash
# Vérifier la présence du réseau externe
docker network inspect audit-app_web

# Logs Traefik (si nécessaire)
docker logs -f <votre_conteneur_traefik>
```
