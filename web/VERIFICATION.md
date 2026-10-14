# Vérification de la version web 0.1

13 octobre 2026.

## Automatique

`npm test` : 12 tests réussis.

- Créneaux consommés une seule fois et activité adaptée au lieu.
- Dépôt réservé puis libéré une seule fois, y compris après sérialisation.
- Contrat expiré le vendredi et fonds restitués.
- Rejet des montants invalides et des soldes insuffisants.
- Aucun débit quand l’activité est refusée pour fatigue.
- Semaine complète, examen à résolution unique et épilogue.
- Binôme de rattrapage pour éviter un blocage.
- Effet de l’aide collective sur le classement.
- Partage des points et même rang en cas d’ex æquo.
- Rejet des sauvegardes corrompues et champs de journaux/résultats invalides.
- Recherche de chemins vers toutes les portes et activités.

Syntaxe JavaScript vérifiée avec `node --check`.

## Navigateur

Vérification dans le navigateur intégré, avec une partie de test sur une origine locale séparée :

1. Créer Mina et commencer lundi.
2. Rejoindre la bibliothèque depuis la carte, marcher vers Reina au clic et choisir le binôme.
3. Réserver 4 000 PP dans un contrat.
4. Réviser : 3 → 2 créneaux, énergie 90 → 78, dépôt restitué, solde 60 000 PP.
5. Rejoindre la chambre, dormir jusqu’au vendredi ; l’énergie et le calendrier sont mis à jour.
6. Rejoindre la classe, répondre aux trois questions et choisir le travail collectif.
7. Résultat observé : dossier 67/100, classe 66/100, −10 PC (égalité avec C), total 590 PC.
8. Dormir jusqu’au dimanche puis obtenir l’épilogue, avec la promesse tenue et la relation avec Reina.
9. Continuer à explorer après l’épilogue.

Le rechargement présente « Continuer » et retrouve le personnage et ses points. Les écrans de jeu, dialogue et petit viewport 390 × 844 ont été inspectés. L’activation audio a été vérifiée via le bouton. Aucune erreur JavaScript n’a été relevée dans les journaux du navigateur pendant ce parcours.

Les contrôles tactiles sont fournis. Leur comportement sur un téléphone physique n’a pas été vérifié. Le multijoueur n’est pas implémenté.

## Hébergement

Le projet Sites enregistré dans `.openai/hosting.json` n’a pas pu être retrouvé par le connecteur lors de la publication (`Sites project not found`). Aucun déploiement distant n’est confirmé. La version locale fonctionne via `npm start` et `http://127.0.0.1:4173`.

# Vérification de la version web 0.3 (HUD v3 et systèmes)

14 octobre 2026.

- `npm test` : 38 tests réussis, dont 12 nouveaux dans `tests/systems.test.mjs`. Le test d’ex æquo fixe désormais stress et réputation, car l’état Serein et la réputation entrent dans le calcul.
- `node --check` sur `app.mjs` et `engine.mjs`.
- Parcours Chromium automatisé (Playwright), sans erreur JavaScript : création, supérette (achats, sac, touche 3), demande acceptée puis tenue au gymnase, conversation, sommeil, transition avec rapport de conduite, fenêtres Conduite, Demandes et Profil, téléphone ouvert avec P, quatre nuits jusqu’au vendredi et question à Mme Hayase.
- Captures inspectées : 1920 × 1080, 1280 × 720, 1024 × 768 tactile, 768 × 1024 tactile, 844 × 390 tactile, 390 × 844 tactile, 320 × 568 tactile.
- Téléphone : les dix apps (Messages, Agenda, Contacts, Portefeuille, Dossier, Classement, Examen, Plan, Carnet, Bilan) restent dans l’écran du téléphone ; vérifié automatiquement à 1280 × 720 et 390 × 844 (lancement depuis l’accueil, onglets du Carnet, trajet depuis le Plan, point de classe du HUD vers Classement).

Non vérifié : téléphone physique, lecteur d’écran.


## Finition du mapping et vérification finale — 14 octobre 2026

- 46 tests réussis : règles, animations, chemins continus, accès aux activités / personnages, migration de positions, conduite, demandes et couche RP.
- Syntaxe vérifiée sur `maps.mjs` et `world.mjs` après les derniers détails de décor et marqueurs de porte.
- Atelier : 9 / 9 personnages et 180 images individuelles chargées, sans avertissement sur ce chargement.
- Voyage de contrôle vers les sept cartes sur `127.0.0.1:4175`, origine distincte de la partie principale ; affichage de chaque destination confirmé.
- HUD inspecté à 390 × 844 et 320 × 568 ; séparation du portefeuille et de la conduite corrigée.
- Repères ajoutés : signalétique, seuils, objets de bibliothèque, équipements sportifs et supérette visible. Petits marqueurs de porte au sol.
- Captures actuelles : `art/refonte-v3/validation-2026-10-14/`.

Les contrôles tactiles restent à essayer sur un appareil physique.

## Rendu HD — 14 octobre 2026

- 180 sprites PNG RGBA reconstruits en 256 × 256 depuis les sources conservées, avec la même taille logique et le même ancrage aux pieds.
- 52 tests automatisés passent, dont la définition des PNG, la taille affichée et le retour au canvas 2D si WebGL est perdu.
- Passe GPU active vérifiée dans le navigateur : bloom, colorimétrie et vignette ; campus, cour et bibliothèque inspectés.
- Décors ImageGen dessinés directement sur la surface haute densité ; caches procéduraux à résolution double, deux sols maximum conservés pour limiter la mémoire.
- Captures dans `art/rendu-hd/` à la racine. L'atelier permet de comparer les neuf personnages et leurs directions.

## Lumière et ombres — amélioration du 14 octobre 2026

- Ombres des personnages projetées depuis l'alpha de la pose actuelle et ancrées aux pieds ; ombres des arbres, bâtiments et mobilier orientées vers le sud-est avec pénombre et ombres de contact.
- La hauteur des objets et les créneaux restants modifient la longueur des ombres extérieures. Les personnages dans les zones d'ombre des arbres et bâtiments reçoivent moins de lumière directe.
- Fenêtres : deux plages de lumière séparées par les montants, dessinées sur le sol avant les meubles ; lampes de lecture : diffusion locale chaude. L'interface reste indépendante du traitement lumineux.
- Shader : calcul des couleurs en espace linéaire, remplissage froid des ombres, lumière chaude, bloom à deux rayons et compression douce des hautes lumières.
- Ombres statiques mises en cache, masques de silhouettes réutilisés et retour 2D conservé sans WebGL. Ces ombres sont des projections 2D ; le moteur ne simule pas une géométrie 3D ni l'éclairage indirect complet.
- 57 tests automatisés passent. Campus et bibliothèque vérifiés dans le navigateur ; captures dans `art/lumiere-realiste/`.
