# Recherche internet et décisions de conception

Consultation : **13 octobre 2026**. Les références ci-dessous sont des sources primaires : site officiel de l'anime, éditeur du light novel et documentation officielle du moteur envisagé.

Cette recherche sert à identifier des mécanismes de l'œuvre et des capacités techniques. Elle ne transforme pas les valeurs proposées dans la bible en règles canoniques. Les recherches générales ont aussi retourné des wikis et discussions de fans ; ces résultats n'ont pas été utilisés comme preuves.

## 1. Un lycée qui récompense le mérite et distribue des points

L'introduction officielle décrit un lycée prestigieux, l'arrivée d'Ayanokōji dans la classe D et une allocation initialement présentée comme l'équivalent de 100 000 yens par mois. La liberté apparente laisse ensuite place à la découverte des contraintes du système.

Source : [site officiel — introduction de la saison 1](https://you-zitsu.com/1st/story/intro.html).

**Interprétation pour le jeu :** le prologue doit laisser expérimenter cette liberté avant d'en faire ressentir le coût. Un premier solde important et un bilan mensuel donnent une forme jouable à ce contraste.

**Création originale :** effectif de 80 élèves, PC initiaux de 1 200 / 1 000 / 800 / 600, allocation PC × 100, prix des objets et contrats à dépôt. Ces valeurs restent à équilibrer. Cette page officielle ne suffit pas à vérifier chaque détail économique du roman.

## 2. La compétition et l'ascension collective

Le résumé de l'éditeur met en avant l'usage des points, la compétition, la classe D et l'ambition de Horikita d'atteindre la classe A.

Source : [Seven Seas — Classroom of the Elite, light novel volume 1](https://sevenseasentertainment.com/books/classroom-of-the-elite-light-novel-vol-1/).

**Interprétation pour le jeu :** distinguer succès individuel et progression collective. Un bon élève ne suffit pas toujours à faire gagner une équipe désorganisée.

**Création originale :** promotion et personnages nouveaux, compétences chiffrées, confiance multidimensionnelle, groupes à identifiants permanents et variations de fins.

## 3. Examens, équipes et dilemmes

Les synopsis officiels de la saison 2 décrivent un examen réunissant plusieurs classes, un festival sportif et le Paper Shuffle avec ses binômes et sa préparation. Ces exemples associent performance, choix d'équipes et relations.

Source : [site officiel — histoires de la saison 2](https://you-zitsu.com/2nd/story.html), notamment épisodes 1, 4 et 7–9.

Les synopsis de la saison 3 montrent un vote interne, les tensions qu'il laisse et des changements de classement après une épreuve finale.

Source : [site officiel — histoires de la saison 3](https://you-zitsu.com/3rd/story.html), notamment épisodes 9–12.

**Interprétation pour le jeu :** l'épreuve doit avoir une préparation et un après. Les choix de représentants, de partenaires et de partage d'information méritent des systèmes propres.

**Création originale :** dix familles d'examens, leurs titres et le barème complet du contrat de confiance. Le vote de mandat proposé n'est pas la reproduction d'un vote canonique d'exclusion.

## 4. Évolution de l'école

Le site officiel de la saison 4 décrit l'OAA, application d'évaluation des capacités, les partenariats entre promotions et une épreuve d'île impliquant groupes et déplacements.

Source : [site officiel — histoires de la saison 4](https://you-zitsu.com/story.html), notamment épisodes 1, 6 et 11.

**Interprétation pour le jeu :** les années ultérieures peuvent élargir les interactions entre promotions et introduire une image publique de la compétence.

**Création originale :** calendrier de trois années, île de cinq jours, routes alternatives et scores de camp. L'année 2 et l'année 3 sont des pistes d'extension, pas des fonctionnalités développées.

## 5. Fondations techniques

Godot documente un moteur 2D dédié, des cartes de tuiles, sprites, animations et éclairages 2D.

Source : [Godot — introduction à la 2D](https://docs.godotengine.org/en/stable/tutorials/2d/introduction_to_2d.html).

Godot documente aussi des mécanismes de multijoueur de haut niveau et d'appels distants. Leur existence ne résout pas automatiquement l'authentification, la persistance ni l'arbitrage économique.

Source : [Godot — multijoueur de haut niveau](https://docs.godotengine.org/en/stable/tutorials/networking/high_level_multiplayer.html).

**Décision proposée :** prototype solo sous Godot, domaine de règles indépendant de l'interface, puis sessions RP à autorité serveur. Ce choix n'est pas validé par une comparaison de performances ni par un prototype réseau dans le présent dossier.

## 6. Méthode visuelle

Les concepts sont générés par **ImageGen intégré**, avec des prompts conservés dans [PROMPTS.md](../art/PROMPTS.md). La planche de personnages utilise deux références de style locales du skill `whiteroom-light-novel`, observées avant génération : `07-duo-couloir.jpg` et `10-portrait-table.png`.

Leur rôle est stylistique : construction des visages, trait, chevelures, colorisation et uniformes. Les personnes dessinées dans la planche finale sont les nouveaux personnages définis dans la bible. La provenance éditoriale de ces références locales n'a pas été certifiée par la recherche internet.

Les autres concepts sont générés à partir de descriptions textuelles. Aucun visuel ne constitue une capture d'un jeu déjà réalisé ni un atlas prêt à importer.
