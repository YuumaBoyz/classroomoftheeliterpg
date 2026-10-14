# Téléphone roleplay · version 0.3

Le téléphone de l’élève sert désormais d’outil de roleplay. Les règles sont dans `dist/roleplay.mjs`, l’interface dans `dist/phone.mjs` et `dist/phone.css`.

## Les cinq nouveautés

1. **Fiche RP** : humeur et présentation publiques, trois traits au plus, secret ou objectif privé, note hors-RP pour les autres joueurs. L’humeur s’affiche dans un widget de l’écran d’accueil.
2. **Salons et messages libres** : salon de classe 1-D, canal privé du binôme, canal Hors-RP et messages privés à chaque élève. On écrit librement, `/me` décrit une action et `((…))` signale une remarque hors-RP. Les élèves simulés répondent selon leur caractère et leur confiance, avec un indicateur « en train d’écrire ».
3. **Le Mur** : forum des élèves. On publie anonymement ou sous son nom, dans quatre catégories (rumeur, témoignage, fait observé, hypothèse) ; on soutient un message, et une publication peut être notée au carnet. La catégorie et la source y sont conservées. De nouvelles publications des PNJ arrivent chaque jour.
4. **Virements de PP** : envoi de points à un élève depuis le Portefeuille ou une fiche contact, avec motif. Entre 100 et 20 000 PP par envoi, 30 000 PP par jour. La confiance ne monte qu’une fois par jour et par élève, pour qu’on ne puisse pas acheter l’amitié.
5. **Pactes** : engagements écrits entre élèves (objet, termes, échéance, visibilité). Un élève signe si sa confiance est suffisante, et un pacte public demande davantage de confiance. Tenir un pacte fait monter la confiance et la fiabilité, le rompre les fait baisser. Un pacte public, sa signature et son issue apparaissent sur le Mur. Les échéances figurent dans l’Agenda.

## Prêt pour le multijoueur

Chaque action est une **commande** `{ id, author, type, target, params }`, conformément aux fondations de production (§7). `applyCommand(state, cmd)` valide et applique la commande. Une commande déjà traitée (même `id`) n’est jamais appliquée deux fois : un virement renvoyé après une coupure n’est débité qu’une fois.

En solo, `createLocalSession` joue le rôle d’hôte local. En session, un transport réseau remplacera `send()` : le serveur exécutera `applyCommand` sur l’état autoritaire, puis diffusera les messages de salon, les publications du Mur et les signatures. Le secret de la fiche ne quitte jamais le joueur.

Types de commandes : `profile.update`, `room.post`, `wall.post`, `wall.react`, `wall.note`, `pp.transfer`, `pact.propose`, `pact.resolve`.

Les anciennes sauvegardes reçoivent automatiquement la couche `rp` au chargement. Le serveur de session, la présence en ligne et la signature d’un pacte par un autre joueur humain restent à développer.

## Tests

`tests/roleplay.test.mjs` : migration de sauvegarde, limites de la fiche, `/me` et `((…))`, virement rejoué une seule fois, plafonds, confiance requise pour un pacte, rupture et conséquences, Mur anonyme et carnet, contenu des PNJ sans doublon.
