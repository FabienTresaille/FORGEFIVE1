# 08 — Feature : Coaching IA (Gemini / Google AI Pro)

## Objectif
Un coach conversationnel personnalisé par utilisateur, alimenté par l'historique de séances et l'état de récupération, via l'API Gemini (clé liée à l'abonnement Google AI Pro existant de l'utilisateur).

## Fonctionnement
- Le backend appelle l'API Gemini côté serveur uniquement (jamais de clé API exposée au frontend).
- Modèle recommandé : le modèle Gemini le plus adapté à un usage conversationnel + raisonnement léger disponible sur l'abonnement Google AI Pro au moment du dev (Antigravity doit vérifier le nom de modèle exact disponible via l'API au moment de l'implémentation plutôt que de le coder en dur sur une hypothèse).
- Le prompt système envoyé à Gemini doit inclure, à chaque requête :
  - Profil sommaire de l'utilisateur (niveau, objectifs s'ils sont renseignés).
  - Résumé des dernières séances (exercices, charges, volume) sur une fenêtre glissante (ex. 2 semaines).
  - Dernière entrée de la zone de récupération.
  - Le rang/progression sur ses exercices principaux.
- Le coach doit rester dans son rôle : conseils d'entraînement, ajustement de charge/volume, conseils de récupération. Pas de conseils médicaux poussés — en cas de douleur/blessure évoquée, orienter vers un professionnel de santé plutôt que de diagnostiquer.

## Cas d'usage
1. **Chat libre** : l'utilisateur pose une question ("je stagne au développé couché, qu'est-ce que je change ?").
2. **Analyse automatique post-séance** : après la fin d'une séance loggée, génération d'un court retour (2-3 phrases) sur la séance.
3. **Suggestion de séance du jour** : à partir de la routine habituelle + état de récup, proposer d'alléger ou d'intensifier.

## Isolation des données
- Chaque conversation est strictement liée à un user. Le contexte injecté ne doit jamais contenir de données d'un autre membre du groupe.

## Écrans front attendus
- Écran de chat simple (façon messagerie) avec le coach.
- Bouton "analyser ma séance" affiché en fin de séance loggée.
- Encart "conseil du jour" sur l'écran d'accueil, basé sur la dernière analyse.

## Explicitement hors périmètre
- Pas de génération d'images/vidéos par l'IA.
- Pas de fine-tuning d'un modèle personnalisé — uniquement du prompt engineering avec contexte injecté à chaque appel.