# 06 — Feature : Suivi de perfs & classement du groupe fermé

## Objectif
Reprendre la mécanique de "rang par exercice" de Liftoff, mais uniquement comparée aux 5-6 membres du groupe — jamais un classement mondial, jamais de flux social autour.

## Rang individuel par exercice
- Pour chaque exercice pratiqué, calcul d'un score de progression à partir de l'historique (`WorkoutSet`).
- Formule proposée par défaut (modifiable) :
  - Force : 1RM estimé (formule d'Epley : `poids × (1 + reps/30)`) sur la meilleure série récente.
  - Cardio : score basé sur allure/distance selon le type d'exercice.
- Le score est traduit en un rang lisible (ex. paliers Bronze/Argent/Or/Platine, ou système de niveaux numérique 1-20 — à trancher avec l'utilisateur avant dev, sinon Antigravity choisit un système simple à 5 paliers).

## Classement de groupe
- Pour chaque exercice, une vue "classement du groupe" affichant : pseudo, rang, score — pour les 5-6 membres actifs.
- Vue en lecture seule, pas de commentaires, pas de réactions, pas de fil d'actualité autour.
- Option : un classement "toutes catégories" agrégeant plusieurs exercices clés (à valider si souhaité, sinon rester exercice par exercice pour le MVP).

## Bodygraph (visualisation muscles à travailler)
- Vue schématique du corps (silhouette simple, pas besoin d'un asset 3D) colorée selon le volume d'entraînement récent par groupe musculaire (ex. 14 derniers jours), pour repérer les zones sous-travaillées.

## Écrans front attendus
- Fiche "progression" par exercice : graphique de charge/volume dans le temps + rang actuel.
- Écran "classement du groupe" avec sélecteur d'exercice.
- Écran "bodygraph" (silhouette + code couleur par groupe musculaire).

## Explicitement hors périmètre
- Pas de classement public/mondial.
- Pas de partage du classement en dehors de l'app (pas de génération d'image à poster sur les réseaux).