# 03 — Modèle de données (entités principales)

## User
- id, email, password_hash, display_name, role (`admin` | `user`), is_active, created_at
- Pas de champ public "bio"/"avatar partagé" (pas de social)

## Exercise
- id, name, muscle_group (enum : pectoraux, dos, jambes, épaules, bras, core, cardio, full_body...), description, image_url (optionnel), is_custom (bool), created_by_user_id (nullable — null si exercice de la bibliothèque de base), type (`force` | `cardio`)

## Routine
- id, user_id, name, description, created_at
- RoutineExercise (table de liaison) : routine_id, exercise_id, ordre, séries cibles, reps cibles, poids cible (optionnel)

## WorkoutSession
- id, user_id, date, durée, notes, RPE global (optionnel)
- WorkoutSet (table liée) : session_id, exercise_id, numéro de série, poids, reps, RPE (optionnel), pour cardio : durée/distance/allure

## ExerciseRank
- user_id, exercise_id, score calculé, rang (valeur + libellé, ex. "Bronze/Argent/Or" ou système numérique — à définir avec l'utilisateur), date de dernière mise à jour
- Calculé à partir de l'historique des WorkoutSet (formule à définir : ex. 1RM estimé, volume total, progression sur X semaines)

## GroupRanking (vue, pas une vraie table social)
- Agrégat en lecture seule : pour chaque exercice, classement des membres du groupe fermé par score
- Ne montre que : pseudo, rang, score — jamais l'historique détaillé des autres

## RecoveryEntry (Zone de récupération)
- id, user_id, date
- sommeil_heures, qualité_sommeil (échelle 1-5)
- niveau_courbatures (échelle 1-5, éventuellement par groupe musculaire)
- niveau_énergie / fatigue perçue (échelle 1-5)
- note_libre (optionnel)
- recommandation_ia générée (texte, cache du dernier appel Gemini pour ce jour)

## CoachConversation / CoachMessage
- Conversation liée à un user (jamais partagée)
- Messages (role user/assistant, contenu, timestamp)
- Le backend injecte le contexte pertinent (dernières séances, dernière entrée de récupération) dans le prompt système envoyé à Gemini — pas besoin de tout stocker dans l'historique de conversation.

## Streak / Achievement (gamification minimale)
- StreakCounter : user_id, séquence actuelle, meilleure séquence
- Achievement : catalogue simple (badges de constance, de progression), UserAchievement (obtenu le...)
- Pas de "monnaie" ni d'objet à dépenser — juste des badges affichés.

## Notes de conception
- Toutes les tables avec `user_id` doivent avoir une contrainte d'appartenance stricte côté API (voir 02-ARCHITECTURE-TECHNIQUE.md, section sécurité).
- Le "bodygraph" (visualisation des groupes musculaires) se calcule à partir de `WorkoutSet` agrégé par `muscle_group` sur une fenêtre glissante (ex. 14 jours) — pas besoin d'une table dédiée, une requête agrégée suffit.