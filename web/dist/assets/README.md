# Visuels du jeu

`cafe-v7/` contient le décor de salle et les sprites du café Sakura, tous dérivés d’une vue d’ensemble ImageGen : comptoir, banquette, deux tables, deux orientations de chaise, distributeur, cabinet de supérette, plantes et ardoise. [Concept, prompts et captures](../../../art/cafe-sakura-imagen-v7/README.md).

`exterior-v6/` contient huit PNG ImageGen pour les arbres verts, lampadaires, bannières, panneaux, mobilier de jardin, bassins, clôtures, façades du gymnase / de la résidence / du café et textures de terrain. [Liste, prompts exacts et captures en jeu](../../../art/exterieurs-imagen-v6/README.md).

`library-v5/` remplace le sol, les murs, le tapis et les meubles de la bibliothèque par six PNG ImageGen (avec un atlas de quatre petits meubles). Les tables utilisent toujours `environment-v4/reading-table.png`. [Assets, prompts exacts et captures en jeu](../../../art/bibliotheque-imagen-v5/README.md). `library-building.png` remplace aussi le bâtiment extérieur dans le campus : [prompt et capture en jeu](../../../art/bibliotheque-exterieur/README.md).

`environment-v4/` contient quatre assets créés avec ImageGen intégré : cerisier, bâtiment académique, table de lecture et papier du carnet. Ils sont chargés dans le jeu. [Intégration, prompts et captures](../../../art/refonte-imagen-v4/README.md).

Les sprites réellement utilisés se trouvent dans `sprites/` : **180 PNG individuels**, vingt poses pour chacun des neuf personnages. Chaque fichier contient une seule silhouette, avec fond transparent.

`animations/` conserve les prompts ImageGen. Les anciennes planches et les sources de génération sont archivées dans `art/sprite-sources` à la racine du projet ; elles ne sont plus chargées pour animer le jeu.

Les concepts `01-campus-topdown.png`, `03-examen-ile.png` et `04-personnages-originaux.png` restent des références de préproduction. La dernière image sert aux portraits de dialogue et à l’identité des quatre partenaires.
