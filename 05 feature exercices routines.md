# 05 — Feature : Bibliothèque d'exercices & routines

## Objectif
Permettre de logger n'importe quel entraînement (force ou cardio) avec un minimum de friction, via une bibliothèque d'exercices de base + des exercices personnalisés, organisés en routines réutilisables.

## Bibliothèque d'exercices
- Une liste de base d'exercices courants (musculation + cardio) doit être fournie en seed data (~100-150 exercices suffisent pour un usage entre amis — pas besoin des 400+ de Liftoff), classée par groupe musculaire.
- Chaque user peut ajouter ses propres exercices personnalisés (nom, groupe musculaire, description, image optionnelle uploadée ou URL).
- Les exercices personnalisés d'un user ne sont visibles que par lui (pas de partage automatique au groupe, pour rester simple — sauf si l'utilisateur souhaite un mode "bibliothèque partagée au groupe", à valider avec lui avant dev).

## Routines
- Un user peut créer une routine : nom, liste d'exercices ordonnés, séries/reps/poids cibles par exercice.
- Une routine peut être dupliquée/modifiée à la volée avant de lancer une séance (ajustement selon la forme du jour).
- Une routine démarrée devient une `WorkoutSession` avec des `WorkoutSet` à remplir au fur et à mesure.

## Log de séance
- Interface rapide pour saisir, pour chaque série : poids, reps, RPE optionnel (échelle 1-10).
- Pour le cardio : durée, distance, allure (selon le type d'exercice).
- Possibilité de logger une séance libre (sans routine pré-définie).
- Historique consultable par exercice (progression des charges/volumes dans le temps).

## Écrans front attendus
- Liste/recherche d'exercices (filtre par groupe musculaire).
- Formulaire d'ajout d'exercice personnalisé.
- Constructeur de routine (drag & drop ou liste ordonnée simple).
- Écran "séance en cours" optimisé mobile (gros boutons, saisie rapide, utilisable une main en salle).
- Historique par exercice (graphique simple : charge max, volume total dans le temps).

## Explicitement hors périmètre
- Pas de vidéos de démonstration d'exercice (juste description texte + image optionnelle).
- Pas de minuteur de repos avancé avec notifications push (peut être ajouté plus tard si besoin).