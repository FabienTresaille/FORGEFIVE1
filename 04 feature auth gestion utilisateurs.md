# 04 — Feature : Authentification & gestion des utilisateurs (moteur admin/users)

## Objectif
Un moteur de gestion de comptes fermé : pas d'inscription publique, uniquement l'admin peut créer/désactiver des comptes pour les 5-6 amis.

## Rôles
- **admin** : accès à un back-office simple (liste des users, création, désactivation/réactivation, reset mot de passe). Peut aussi utiliser l'app normalement (perfs, coaching) comme un user.
- **user** : accès uniquement à ses propres données (séances, récup, coaching) + vue classement du groupe.

## Parcours
1. **Bootstrap** : au premier démarrage, un compte admin est créé automatiquement à partir de `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` (variables d'env), avec obligation de changer le mot de passe à la première connexion.
2. **Création d'un user** : l'admin renseigne email + nom affiché → le système génère un mot de passe temporaire (affiché une fois à l'admin, à transmettre à l'ami) → l'utilisateur doit le changer à sa première connexion.
3. **Connexion** : email + mot de passe → JWT access token (courte durée) + refresh token.
4. **Désactivation** : l'admin peut désactiver un compte (is_active = false) sans le supprimer, pour garder l'historique.
5. Pas de "mot de passe oublié" par email automatique dans le MVP (pas de service mail configuré) — le reset se fait manuellement par l'admin qui regénère un mot de passe temporaire.

## Endpoints attendus (indicatif)
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/change-password`
- `GET /admin/users` (admin only)
- `POST /admin/users` (admin only — création)
- `PATCH /admin/users/{id}` (admin only — activer/désactiver, reset mdp)

## Écrans front attendus
- Écran de connexion simple (pas d'écran d'inscription).
- Écran "changer mon mot de passe" (forcé au premier login).
- Back-office admin minimal : tableau des users avec statut, bouton créer / désactiver / reset mdp.

## Explicitement hors périmètre
- Pas d'OAuth / connexion Google/Apple (inutile pour 5-6 personnes).
- Pas de vérification d'email.
- Pas de gestion de rôles multiples au-delà de admin/user.