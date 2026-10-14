# Refonte des cartes et des interfaces

Le campus et les six autres lieux ont été reconstruits pour l’exploration. Chaque lieu possède une disposition, des matériaux, des meubles et des itinéraires propres. Les décors sont dessinés en pixel art dans `web/dist/maps.mjs` ; les mêmes objets définissent les collisions et le plan de voyage. Les bâtiments ne reposent plus sur le concept ImageGen utilisé comme fond.

L’interface utilise des rubans bordeaux et ivoire, un HUD compact, une pause plein écran et des écrans spécialisés : carnet papier, téléphone d’élève, dossier de profil, carte annotée et dialogues avec portrait. Les anciens cadres dorés de HUD v2 restent conservés mais ne sont plus chargés par le jeu.

## Captures de vérification

- [Campus](campus.png)
- [Classe D](classe.png)
- [Bibliothèque](bibliotheque.png)
- [Gymnase](gymnase.png)
- [Chambre](chambre.png)
- [Café Sakura](cafe.png)
- [Cour intérieure](cour.png)
- [Carte de voyage](carte.png)
- [Pause](pause.png)
- [Téléphone](telephone.png)
- [Carnet](carnet.png)
- [Mobile](mobile.png)

## Validation

26 tests réussis, dont quatre nouveaux contrôles du mapping : chemins continus vers les activités, portes et personnages ; correspondance des seuils de voyage ; reprise des anciennes positions sauvegardées ; cohérence entre mobilier visible et obstacles.

Vérification navigateur sur une partie séparée : voyage vers les sept lieux, déplacement jusqu’à Reina, conversation, ouverture des menus, inspection sur bureau 1280 × 800 et écrans 390 × 844 / 320 × 568. Les contrôles tactiles restent à essayer sur un téléphone physique.


## Finition du 14 octobre 2026

Ajout de repères dessinés dans le monde : panneaux directionnels, fanions, seuils et plaques de porte, catalogue, retours de livres, numéros de rayonnages, tableau de score, fontaine à eau, distributeur et ardoise du café. Les objets solides participent aux collisions ; les éléments de mur et de sol restent décoratifs. Le parquet reste visible sous les lignes du terrain de basket.

Les marqueurs flottants de porte ont été remplacés par de petits chevrons au sol. Le nom de l’interaction reste dans le HUD, ce qui évite de superposer un encart au personnage. Un espacement supplémentaire protège le panneau Conduite du portefeuille sur petit écran.

La suite actuelle contient **46 tests réussis**. Les neuf personnages et leurs **180 images individuelles** ont été chargés dans l’atelier sans avertissement sur cette vérification. Les sept destinations ont été revisitées dans une partie distincte. Les captures actuelles sont dans [validation-2026-10-14](validation-2026-10-14/).
