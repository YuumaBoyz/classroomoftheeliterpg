# Classroom of the Elite — Projet RPG / Roleplay 2D

**Nom de travail : ANHS — Les Règles Invisibles.**

Un RPG social en 2D vue du dessus où un élève créé par le joueur apprend à vivre, négocier et choisir ses alliances dans un lycée qui classe les personnes autant que leurs résultats.

Le projet contient une **démo web jouable de la première semaine**, accompagnée de sa bible et de concepts générés par ImageGen. Les règles chiffrées, personnages originaux et examens proposés sont des créations de game design ; les inspirations documentées sont identifiées séparément.

## Jouer à la version web

Depuis le dossier `web`, lancer `npm start`, puis ouvrir `http://127.0.0.1:4173`.

Déplacement : ZQSD, WASD ou flèches. Interaction : E. Carte : M. Téléphone : P. Carnet : J. Menu : Échap.

La démo comprend exploration, dialogues, quatre partenaires, activités, contrats, sauvegarde, premier examen et épilogue. Voir [les instructions](web/README.md) et [les vérifications](web/VERIFICATION.md). Le RP multijoueur reste à développer.

## Déployer sur Netlify

Dans Netlify, choisir **Add new project → Import an existing project → GitHub**, puis sélectionner `YuumaBoyz/classroomoftheeliterpg` et la branche `main`.

La configuration est fournie dans `netlify.toml` : les tests sont exécutés avec Node.js 22 et le dossier publié est `web/dist`. Laisser le répertoire de base à la racine du dépôt. Aucune clé API, dépendance à installer ou serveur applicatif n’est nécessaire. Chaque nouveau commit sur `main` pourra déclencher un déploiement.

Les sauvegardes restent locales au navigateur et à l’adresse du site. Pour reprendre une partie locale sur Netlify, utiliser **Menu → Exporter**, puis **Menu → Importer** sur le site déployé.

## Documentation du projet

- [Bible complète du jeu](docs/BIBLE-DU-JEU.md) : vision, monde, personnage, économie, relations, examens, campagne et roleplay.
- [Fondations de production](docs/FONDATIONS-PRODUCTION.md) : prototype, architecture, données, périmètre et critères de validation.
- [Recherche et sources](docs/RECHERCHE-SOURCES.md) : sources officielles consultées et distinction entre œuvre et propositions.
- [Prompts des visuels](art/PROMPTS.md) : descriptions exactes utilisées avec ImageGen intégré.
- [Galerie commentée](art/GALERIE.md) : images de conception et usages prévus.

## La promesse

**Faire monter sa classe sans perdre la personne que l'on voulait devenir.**

Chaque journée offre trois ressources à dépenser : du temps, des points privés et de la confiance. Les examens spéciaux transforment les petits choix du quotidien en décisions collectives : qui représente la classe, qui révèle son jeu, qui tient sa promesse ?

La première version cible une campagne solo. Le mode roleplay réutilise ensuite les mêmes règles dans des sessions privées, avec des personnages joués par des humains et des élèves simulés.
