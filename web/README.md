# ANHS — Les Règles Invisibles · Jeu web

Jeu solo en Canvas 2D, sans installation de dépendances. Les sept cartes sont construites en pixel art à partir de tuiles, de mobilier et de collisions partagées : campus, classe D, bibliothèque, gymnase, chambre, café et cour intérieure.

## Lancer

Depuis ce dossier :

```sh
npm start
```

Ouvrir `http://127.0.0.1:4173`. L’ouverture directe d’index.html avec `file://` ne permet pas de charger les modules JavaScript dans tous les navigateurs.

## Jouer

- ZQSD, WASD ou flèches : marcher ; Maj : courir.
- E : parler, entrer dans un bâtiment ou utiliser un objet proche.
- Clic/toucher : trouver un chemin vers le point ou l’interaction.
- M : carte et déplacement rapide ; P : téléphone ; J : carnet ; C : profil.
- H : masquer ou réafficher le HUD pendant l’exploration.
- Échap : pause ou fermeture ; 1 à 5 : choix de dialogue.

Choisir Reina, Nao, Mika ou Daichi comme partenaire avant vendredi. Trois créneaux par jour permettent révision, tutorat, entraînement, observation ou pause au café. Dormir dans la chambre fait passer au jour suivant. Vendredi, présenter le dossier en salle D : trois questions de lecture et une décision de stratégie. Le dimanche donne un épilogue.

La sauvegarde automatique reste dans ce navigateur et cette adresse. Le menu permet l’export et l’import JSON. L’ambiance sonore est facultative et activée par le joueur.

## Implémentation

- `dist/engine.mjs` : calendrier, compétences, relations, économie, contrats, examen et validation des sauvegardes.
- `dist/maps.mjs` : géographie des sept lieux, objets, collisions, cheminement et dessin des tuiles / du mobilier.
- `dist/world.mjs` : Canvas, caméra, profondeur des objets, rendu mis en cache et interactions.
- `dist/environment-art.mjs` : chargement des décors ImageGen, cadrage par transparence et repli sur le dessin Canvas.
- `dist/render-quality.mjs` : résolution native de l’écran et proportions des détourages. [Contrôle qualité et capture réelle](../art/qualite-rendu/README.md).
- `dist/exterior-art.mjs` et `dist/assets/exterior-v6/` : arbres, bannières, lampadaires, mobilier, façades et sols extérieurs ImageGen. Les 67 objets du campus et de la cour utilisent des images. [Assets, prompts et captures](../art/exterieurs-imagen-v6/README.md).
- `dist/cafe-art.mjs` et `dist/assets/cafe-v7/` : café Sakura redessiné à partir d’un concept ImageGen, puis décliné en décor et sprites distincts. Les 33 objets utilisent des images. [Concept, assets, prompts et rendu en jeu](../art/cafe-sakura-imagen-v7/README.md).
- `dist/assets/library-v5/` : bibliothèque ImageGen, fond de salle et mobilier ; atlas partagé et murs alignés avec les limites de déplacement. [Prompts et captures](../art/bibliotheque-imagen-v5/README.md).
- `dist/app.mjs` : dialogues, interfaces, sauvegarde, contrôles et audio.
- `dist/phone.mjs` et `dist/phone.css` : téléphone de l’élève façon smartphone moderne (écran d’accueil, widgets, dock, notifications, apps Messages, Agenda, Contacts, Portefeuille, Dossier, Classement, Examen, Plan, Carnet et Bilan). Toutes les apps s’ouvrent dans l’écran du téléphone ; seul « rejoindre un lieu » le referme pour lancer le trajet. Icônes et fond d’écran originaux.
- `dist/npc-agents.mjs` : déplacements des personnages dans le monde (trajets, marche, entrées et sorties par les portes).
- `dist/npc-ai.mjs` : IA des personnages (emplois du temps, choix motivés, humeur, mémoire, comportement dans le monde). Voir [IA-PNJ.md](IA-PNJ.md).
- `dist/roleplay.mjs` : couche roleplay du téléphone (fiche RP, salons, Mur, virements, pactes) sous forme de commandes rejouables, prête pour un hôte de session. Voir [ROLEPLAY.md](ROLEPLAY.md).
- `dist/game.css` : direction graphique du jeu, dialogues, pause, carnet et carte de voyage.
- `dist/hud-v5.css`, `dist/interfaces-v5.css`, `dist/interface-kit.mjs` et `dist/fonts.css` : HUD périphérique, interfaces fumées, navigation et illustrations SVG de la boutique. [Direction visuelle et vérification](../art/interfaces-v5/README.md).
- `dist/assets/` : visuels ImageGen utilisés par le jeu.
- `tests/engine.test.mjs` : tests des règles et accessibilité des lieux.
- `tests/maps.test.mjs` : continuité des chemins, accès aux PNJ, vrais seuils et reprise des anciennes positions.
- `tests/systems.test.mjs` : conduite, demandes, supérette, états, réputation et migration des sauvegardes 0.2.

```sh
npm test
```

Les tests couvrent notamment les fonds réservés, les paiements uniques, l’expiration, les créneaux, la résolution de l’examen, les sauvegardes et l’accès aux activités malgré les collisions.

Cette version est une démo solo de la première semaine, et non l’intégralité des trois années de la bible. Le RP multijoueur, les horaires dynamiques des PNJ et les examens d’île restent à développer. Les PNJ gardent leur lieu de référence et effectuent de courts déplacements ; la simulation des autres binômes est déterministe.

Les concepts ImageGen sont conservés pour référence. La géographie est définie par le moteur. Une première passe ImageGen ajoute des cerisiers, le bâtiment académique et les tables de bibliothèque aux décors jouables, avec les mêmes collisions et interactions. Le carnet utilise un fond papier généré derrière ses textes dynamiques. Les assets sont dans `dist/assets/environment-v4/` et l’habillage du carnet dans `dist/imagen-v4.css`. [Assets, prompts exacts et captures](../art/refonte-imagen-v4/README.md). Les personnages utilisent des images individuelles de marche et des poses debout, avec respiration, course et effets visuels intégrés.

Les cadres ImageGen de la version précédente sont archivés dans les assets. La refonte utilise des rubans sobres, une palette bordeaux / ivoire / encre, une pause plein écran, un carnet papier et un téléphone distinct. Énergie, stress et points restent dynamiques. Le badge D et le solde ouvrent le profil et le portefeuille. [Cartes et interfaces de la refonte](../art/refonte-v3/README.md).

## Sprites et animations · 0.2

Les neuf personnages utilisent désormais 180 images individuelles, une seule silhouette par fichier. Marche directionnelle, course, poses debout, mouvements locaux des PNJ et VFX sont intégrés. Voir [les détails et vérifications](ANIMATIONS.md) et ouvrir `/atelier.html` pour les observer, un personnage par carte.

## HUD v3 et cinq systèmes · 0.3

**HUD.** Panneaux d’encre bleu nuit à coins chanfreinés et filet champagne. En haut à gauche, un cadran montre les trois créneaux du jour (le prochain en or) autour du numéro du jour, avec la frise de la semaine et un sceau rouge portant le kanji du jour (月火水木金土日) qui se « tamponne » à chaque réveil. Au centre, le lieu s’annonce à chaque entrée. À droite, les points de classe avec le rang, les points privés avec les sommes en dépôt ou prêtées, puis la jauge de conduite. À gauche, l’objectif et les demandes en cours avec leur échéance. En bas, les états actifs, la carte d’élève (énergie, stress, réputation) et le sac en quatre emplacements. Mises en page dédiées pour téléphone, tablette tactile et paysage bas. Le point de classe du HUD ouvre l’app Classement du téléphone ; le portefeuille ouvre l’app Portefeuille.

1. **Conduite de classe, la règle invisible.** Chaque soir de cours, la classe D gagne ou perd des PC selon sa conduite (≥ 70 : +5 ; 55–69 : 0 ; 40–54 : −10 ; < 40 : −20). Sans effort, elle baisse de 7 par jour. Le HUD affiche « ? » tant que la règle est inconnue ; Mme Hayase (dès mardi) ou l’observation de la cour la révèlent. Tutorat +6, demande tenue +3, rappel des règles avec Sora +5 une fois par jour, défense du collectif à l’examen +4.
2. **Demandes des camarades.** Six demandes arrivent dans la semaine (Daichi, Sora, Mika, Reina, Nao, Yui), à accepter ou décliner depuis le HUD ou en conversation. Une demande tenue rapporte confiance, fiabilité, parfois des PP, et l’état Inspiré ; une demande oubliée coûte de la fiabilité. Le prêt à Nao est débité puis remboursé samedi.
3. **Supérette du Sakura et sac.** Nouveau point d’interaction au café, sans créneau : boisson énergisante, tisane, fiches de révision, dorayaki à offrir, kit de présentation (oral +3). Touches 1 à 4 ou clic pour utiliser.
4. **États.** Bien reposé (dormir avec 2 créneaux libres), Surmené (finir sous 20 d’énergie), Épuisé, Serein, Sous pression, Concentré, Inspiré. Chaque état modifie un chiffre précis, affiché dans la fenêtre d’activité.
5. **Réputation.** Fiabilité, influence et visibilité, avec un titre (« Élève discret », « Pilier de la classe »…). Elles modifient le score de classe à l’examen ; une forte visibilité gêne l’observation ; Ren ne partage la méthode de la classe A qu’à partir de 35 d’influence.

Les anciennes sauvegardes sont complétées automatiquement. `?qa` dans l’adresse expose un point d’entrée de vérification (`window.__anhs`).

## Interfaces v4

Le HUD, la pause, la carte, le carnet, le profil, les activités et les dialogues adoptent une direction ivoire / bordeaux / encre. Le suivi de mission est repliable et montre la progression réelle du premier examen ; son bouton rejoint le lieu utile. Le dock donne accès au profil, à la carte, au téléphone, au carnet et à la pause. Le téléphone conserve intégralement ses fichiers et son interface. Voir [la refonte et les captures](../art/hud-v4/README.md).

## Interfaces v5 / surfaces fumées

Refonte inspirée des références visuelles : HUD léger en bordure du jeu, énergie circulaire, surfaces fumées et sélections rouges. Les interfaces utilisent une navigation commune, avec des compositions propres au profil, à la boutique Sakura, au carnet et aux demandes. Les cinq objets de boutique sont dessinés en SVG. Les catégories, lectures et filtres sont fonctionnels. Le téléphone conserve son interface et ses fichiers. [Détails et captures](../art/interfaces-v5/README.md).
