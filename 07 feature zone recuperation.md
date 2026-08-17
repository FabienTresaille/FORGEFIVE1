# 07 — Feature : Zone de récupération

## Objectif
Fonctionnalité demandée explicitement, absente de Liftoff : suivre l'état de récupération de chaque utilisateur pour éviter le surentraînement et adapter les séances.

## Saisie quotidienne (RecoveryEntry)
- Heures de sommeil + qualité du sommeil (1-5).
- Niveau de courbatures perçu, idéalement par groupe musculaire (1-5 par groupe, ou une note globale si plus simple pour le MVP).
- Niveau d'énergie / fatigue perçue (1-5).
- Note libre optionnelle (douleur spécifique, blessure en cours, etc.).
- Un seul enregistrement possible par jour, modifiable dans la journée.

## Recommandation automatique
- À chaque saisie (ou une fois par jour), le backend envoie le contexte récent (dernière entrée de récup + volume des séances des 3-7 derniers jours) à Gemini pour générer une recommandation courte :
  - Exemples de sortie attendue : "Récupération correcte, tu peux maintenir l'intensité prévue" / "Fatigue élevée détectée, envisage une séance légère ou un jour de repos" / "Courbatures marquées sur les jambes, privilégie le haut du corps aujourd'hui".
- La recommandation est stockée (cache) pour éviter de rappeler l'IA à chaque affichage du même jour.

## Historique
- Vue calendrier/graphique de l'évolution sommeil / courbatures / énergie dans le temps, pour repérer les tendances (ex. fatigue qui s'accumule sur plusieurs semaines).

## Lien avec le coaching IA
- La zone de récupération alimente le contexte injecté dans le chat coach (feature 08) : le coach doit "savoir" si l'utilisateur est fatigué avant de proposer une séance.

## Écrans front attendus
- Formulaire de saisie quotidienne rapide (sliders/échelles, pas de saisie texte obligatoire).
- Carte "état du jour" avec la recommandation IA affichée en résumé.
- Graphique d'historique (7/30 derniers jours).

## Explicitement hors périmètre
- Pas d'intégration avec des objets connectés (montres, oura ring, etc.) dans le MVP — saisie manuelle uniquement.