# Personnages et effets · Version 0.2

Le moteur utilise des **fichiers PNG individuels** : un seul personnage et une seule pose dans chaque fichier. Les 180 images transparentes se trouvent dans `dist/assets/sprites/`, réparties en neuf dossiers. Un manifeste associe chaque personnage à ses images.

## Contenu

- Neuf personnages distincts : joueur, Reina, Nao, Mika, Daichi, Sora, Yui, Ren et Mme Hayase.
- Seize images de marche par personnage : quatre phases dans chacune des quatre directions.
- Quatre poses debout par personnage, pour l’attente, les dialogues et les réactions.
- Respiration, inclinaison en course, réaction brève aux actions et ancrage commun aux pieds.
- PNJ effectuant de courts déplacements sur le sol praticable et se tournant vers le joueur proche.
- Poussière des pas, cercles d’interaction, étincelles, textes de gains et effets distincts pour confiance, découverte, entraînement et réussite.
- Sons de pas synthétiques lorsque l’ambiance sonore est activée.
- Option « Effets visuels : Doux » dans le menu Pause, avec prise en compte de la préférence système pour réduire les animations.

La course utilise le cycle de marche à une cadence plus élevée, avec inclinaison et pas accentués. Les conversations utilisent les poses debout avec respiration et orientation : pas de synchronisation labiale. Les déplacements des PNJ restent locaux, sans emploi du temps complet.

## Fichiers

- `dist/sprites.mjs` : chargement des images et gestion des poses.
- `dist/motion.mjs` : intégration au monde, mouvement des PNJ et retours d’action.
- `dist/effects.mjs` : particules et textes à durée limitée, population bornée.
- `dist/atelier.html` : vérification visuelle, un seul personnage par carte avec direction et état sélectionnables.
- `dist/assets/sprites/manifest.json` : chemins des images individuelles.

Les dessins ont été produits par **ImageGen intégré**. Les planches sources restent conservées dans `art/sprite-sources/` à la racine du projet. Leur découpage, normalisation à 256 × 256 avec rééchantillonnage Lanczos et séparation en fichiers de jeu respectent le canal alpha. Le rendu conserve une taille logique de 64 × 64 et un ancrage aux pieds de (32, 59), pour préserver les déplacements et collisions. Les prompts complets sont conservés dans `dist/assets/animations/`.

## Vérification

26 tests automatisés passent, couvrant les règles du jeu ainsi que le cycle directionnel, l’indépendance de la fréquence de rendu, l’arrêt de l’animation, les états de course et conversation, le mode doux, l’expiration et le plafond des particules, et les déplacements des PNJ hors des collisions.

Les 180 PNG ont été vérifiés pour leurs dimensions, leur canal alpha et leur silhouette. Dans le navigateur, l’atelier charge neuf personnages et 180 images sans erreur ; la marche, la course, les poses debout, les directions et les effets de découverte ont été inspectés. Le jeu a été rechargé et la course testée au clavier sur les cartes actuelles.

## Rendu HD et shaders

Les 180 sprites sont reconstruits depuis les planches sources avec `python3 web/.qa/split-sprites.py` depuis la racine. Le moteur utilise un lissage de haute qualité, des caches de décor à résolution double et les détourages ImageGen directement sur le canvas haute densité, sans les réduire dans un cache intermédiaire. La végétation procédurale utilise des courbes, ellipses et pétales arrondis.

`dist/shaders.mjs` ajoute une passe WebGL : bloom sélectif, colorimétrie chaude dans les hautes lumières, ombres légèrement froides et vignette discrète. L'éclairage attaché aux fenêtres et aux arbres est dessiné en coordonnées du monde. L'interface reste en HTML au-dessus de la scène. Le mode doux réduit le bloom et fige le mouvement des ombres ; sans WebGL ou lors d'une perte de contexte, le canvas 2D reste visible.

Les sources artistiques restent inchangées. La définition réellement visible dépend de la taille des personnages à l'écran ; les éléments dessinés procéduralement gardent leur style illustré simplifié.
