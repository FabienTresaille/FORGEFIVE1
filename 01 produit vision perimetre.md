# 01 — Vision produit & périmètre

## Nom de travail
**ForgeFive** (nom provisoire — 5/6 utilisateurs, "forger" ses perfs). À remplacer si un autre nom est choisi ; ne pas utiliser "Liftoff" ni reprendre son logo/UI.

## Pitch
Application privée de suivi de musculation/cardio pour un groupe fermé de 5 à 6 personnes (amis), avec classement interne au groupe, coaching IA personnalisé, et suivi de récupération. Auto-hébergée, sans app store, sans compte public, sans achat intégré.

## Utilisateurs cibles
- 1 **admin** (l'utilisateur lui-même) : crée/désactive les comptes, gère le groupe.
- 5-6 **users** : amis invités par l'admin, comptes créés manuellement (pas d'inscription libre).

## Ce qui est repris de Liftoff (mécaniques, pas le code/design)
- Suivi d'entraînement (musculation + cardio), tous niveaux.
- Bibliothèque d'exercices + exercices personnalisés (nom, description, image).
- Création de routines réutilisables, ajustables à la volée.
- Système de rang/progression par exercice (visualisation façon "bodygraph").
- Classement — mais **limité au groupe fermé des 5-6 utilisateurs**, pas de leaderboard mondial.
- Streaks, quêtes/objectifs simples, badges de progression.
- Visualisations de progression (courbes de charge, volume, PR).
- **Zone de récupération** (nouveau, demandé explicitement — Liftoff ne l'a pas) : suivi du repos, sensations (courbatures, fatigue), et recommandations.
- Coaching IA conversationnel + analyse automatique des séances.

## Explicitement HORS périmètre (à ne PAS développer)
- ❌ Boutique / objets cosmétiques / monnaie virtuelle
- ❌ Réseau social : fil d'actualité, abonnements/follow, partage public, invitations virales, commentaires publics
- ❌ Achats intégrés / paywall / abonnement payant
- ❌ Inscription publique (pas de "sign up" ouvert)
- ❌ Publication sur App Store / Play Store
- ❌ Suivi nutritionnel (peut être ajouté plus tard, hors MVP)

## Contraintes de déploiement
- Développement local via **Antigravity** — il ne produit QUE les fichiers du projet (code, Dockerfile, docker-compose, .env.example, migrations). Aucune action de déploiement, ni d'exécution de commandes réseau, n'est attendue d'Antigravity.
- Le déploiement (build, push, mise en ligne sur le VPS) est fait manuellement par l'utilisateur.
- Hébergement : VPS OVH, Docker + Traefik déjà en place (voir 02-ARCHITECTURE-TECHNIQUE.md).
- IA : appels à l'API Gemini via la clé associée à l'abonnement Google AI Pro existant (pas de nouvel abonnement IA à créer).

## Definition of Done du MVP
1. Admin peut créer/désactiver des comptes users depuis un back-office simple.
2. Chaque user peut logger une séance (exercices, séries, charges, reps, RPE optionnel).
3. Chaque exercice affiche un rang/progression individuel + position dans le classement du groupe.
4. Zone de récupération accessible : saisie quotidienne (sommeil, courbatures, niveau d'énergie) + recommandation générée.
5. Chat coach IA disponible, avec accès au contexte des séances de l'utilisateur (pas celles des autres).
6. Aucune fonctionnalité boutique, social ou paiement présente dans le code livré.