# 10 — UI/UX & design system

## Principes
- Application pensée **mobile-first** : utilisation principale en salle de sport, une main, écran allumé pendant la séance.
- Interface simple, peu de clics pour logger une série pendant l'effort.
- Pas de branding "Liftoff" — identité visuelle propre à définir (nom, palette, typographie), distincte de l'app source.

## Palette & typographie
- À définir par l'utilisateur avant le lancement du dev (comme pour Optisafe : `#0D47A1` bleu / `#26A69A` turquoise / `#F57C00` orange, Montserrat/Poppins pour les titres, Inter/Roboto pour le corps). Si l'utilisateur ne précise pas de palette différente pour cette app, Antigravity peut réutiliser cette charte pour rester cohérent avec l'écosystème Alsek, ou proposer une variante sport (à valider).

## Écrans principaux (MVP)
1. **Connexion** (email + mot de passe, pas d'inscription visible)
2. **Accueil** : streak du jour, conseil IA du jour, accès rapide "démarrer une séance"
3. **Séance en cours** : saisie rapide séries/reps/poids
4. **Bibliothèque d'exercices** + **Mes routines**
5. **Progression** : historique par exercice, bodygraph, rang
6. **Classement du groupe**
7. **Zone de récupération** : saisie du jour + historique + recommandation IA
8. **Coach IA** : chat
9. **Profil** : infos perso, badges obtenus, changement de mot de passe
10. **Back-office admin** (accès réservé au rôle admin) : gestion des users

## Accessibilité
- Contrastes suffisants, tailles de police lisibles en mouvement/en salle (pas de texte trop petit), boutons de taille suffisante pour un usage avec des mains moites/gantées.