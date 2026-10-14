# IA des personnages · version 0.4

Le comportement des huit personnages est dans `dist/npc-ai.mjs`. Il suit la bible (§21) : emplois du temps simples, motivations écrites et comportement local selon le stress, la relation et les promesses.

## Ce qui a changé

- **Emploi du temps** : chaque élève choisit son activité pour chacun des quatre créneaux (15:30, 16:45, 18:00, 19:30) : réviser, aider un binôme, s’entraîner, discuter, faire une pause, observer, se promener ou rentrer au dortoir. Les personnages ne restent plus au même endroit toute la semaine.
- **Choix motivés** : préférences propres à chacun, poids de l’examen qui approche, stress, lassitude après deux créneaux identiques, envie de voir du monde, fatigue du soir. Un binôme révise davantage. Le choix est déterministe : le même état donne le même emploi du temps, après un rechargement comme sur l’hôte d’une future session.
- **Rendez-vous garantis** : Reina attend à la bibliothèque le premier jour. Daichi est au gymnase jeudi à 16:45 et 18:00 (son entraîneur). Yui reste dans la cour pendant la demande de Mika. Vendredi, toute la classe attend la restitution en salle D, avec Mme Hayase. Mme Hayase tient sa permanence jusqu’à 18:00 en semaine.
- **Mémoire et humeur** : les personnages se souviennent des pactes tenus ou rompus, de la promesse de révision, des demandes accomplies, des cadeaux et des virements. Humeurs possibles : méfiance, gratitude, tension, fatigue, chaleur, ouverture, réserve. La rancune s’estompe après deux jours.
- **Comportement dans le monde** : un élève qui a une demande ou de la gratitude vient vers le joueur (bulle « ! »). Les élèves qui discutent se regroupent et se font face (bulle « … »). Un élève méfiant se tourne et garde ses distances (bulle « – »). On révise assis, on court au gymnase et on flâne dans la cour.
- **Paroles** : à la première rencontre, le personnage se présente. Ensuite, sa réplique dépend de son activité, de son humeur et de ses changements d’avis (« J’avais prévu une pause, mais l’examen est demain. »).
- **Téléphone** : la fiche contact indique où se trouve l’élève, ce qu’il fait et son humeur ; « rejoindre » mène à sa position actuelle. Les messages privés tiennent compte du contexte : élève déjà rentré, élève en pleine révision, rancune.

## Tests

`tests/npc-ai.test.mjs` : lieux valides et places praticables sans chevauchement, déterminisme, rendez-vous garantis, variété de la semaine, humeur après un pacte rompu puis apaisement, élève qui vient vers le joueur, première rencontre puis répliques contextuelles, messages selon la disponibilité.

## Déplacements (version 0.4.1)

`dist/npc-agents.mjs` remplace les petits glissements par de vrais agents :

- Trajets calculés sur la grille des collisions (`pathTo`), marche à 68 px/s, flânerie à 54, approche à 82, footing à 116. L’animation de marche suit la distance parcourue, sans glissement.
- Sur place : on révise sans bouger, en levant parfois les yeux, et on fait de temps en temps un petit trajet vers une étagère ou un camarade. Ceux qui discutent se font face et parlent à tour de rôle. Les flâneurs choisissent une destination, s’y arrêtent et regardent autour d’eux. Daichi fait des tours du gymnase avec des pauses.
- Plus de téléportation : quand l’emploi du temps change, le personnage marche jusqu’à la porte et sort en fondu ; les nouveaux arrivants entrent par la porte. La confiance ne modifie plus l’emploi du temps, pour que personne ne disparaisse au milieu d’une conversation.
- On cède le passage à celui qui est juste devant soi. Les élèves de fond sont aussi de vrais passants.
