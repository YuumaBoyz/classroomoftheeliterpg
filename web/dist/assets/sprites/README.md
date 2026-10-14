# Un personnage, une pose, un fichier

Chaque PNG est transparent, mesure 64 × 64 pixels et contient **un seul personnage**. Il n’existe plus de planche regroupant plusieurs poses dans les images utilisées par le moteur.

Neuf dossiers : `player`, `reina`, `nao`, `mika`, `daichi`, `sora`, `yui`, `ren`, `hayase`.

Chaque dossier contient vingt images :

- `down/left/right/up-walk-0/1/2/3.png` : quatre phases de marche par direction, seize fichiers.
- `down/left/right/up-idle.png` : une pose debout par direction, quatre fichiers.

Le manifeste donne les chemins exacts. Le moteur charge les images séparément, les alterne selon la distance parcourue et conserve leur point d’ancrage aux pieds. La course utilise les mêmes images à une cadence plus rapide, avec une inclinaison et des pas plus marqués. Les poses debout servent à l’attente, aux conversations et aux réactions.

Les dessins ont été générés avec ImageGen intégré. Le découpage et la normalisation des images en fichiers individuels sont des opérations de préparation d’assets : pas de nouveau dessin ajouté. Les sources de génération restent archivées dans `art/sprite-sources` à la racine du projet. Les prompts se trouvent dans `assets/animations/PROMPTS.md` et `IDLE-PROMPT.md`.
