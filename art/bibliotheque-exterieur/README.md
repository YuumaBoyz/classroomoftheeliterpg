# Bibliothèque extérieure — ImageGen

Mode : **ImageGen intégré**, avec le bâtiment académique comme référence de style et de caméra.

- [PNG intégré](../../web/dist/assets/library-v5/library-building.png) : original **1636 × 961**, transparence native, copié sans retouche ni recompression.
- [Capture réelle dans le campus](en-jeu.png).
- [Référence de style](../../web/dist/assets/environment-v4/academic-building.png).

Le bâtiment remplace le dessin procédural de la bibliothèque dans le campus. La largeur affichée est de 368 unités et sa hauteur de 182,46 unités, calculée depuis les proportions du détourage original. Les marches restent centrées sur le seuil jouable en (288, 376). Le rectangle de collision a été ajusté au bâtiment visible en conservant le bas de sa façade à y=352. Le dessin précédent reste seulement un repli pendant le chargement ou en cas d’échec du fichier.

Validation : **57 tests réussis**, accès à la porte et aux activités vérifiés. Dans le navigateur : entrée et sortie réelles par E, inspection du toit, de la façade et de l’alignement du seuil, aucune erreur ni alerte console.

## Prompt exact

```text
Use case: stylized-concept
Asset type: ONE production alpha-transparent exterior LIBRARY BUILDING sprite for a playable top-down 2D Japanese elite-school RPG.
Input image 1: STYLE AND CAMERA REFERENCE ONLY, the existing academic building. Create a NEW, distinct smaller library matching its crisp detailed pixel-art craft, blue slate tiles, ivory limestone trim, warm burgundy brick, muted teal glass and restrained architectural finish.
Primary request: a compact rectangular campus library with a broad deep blue-slate hip roof seen from above, one central rectangular glazed skylight, a low south-facing facade with two large reading-room window bays flanking a centered entrance. Dark walnut glazed double doors exactly at horizontal center of the SOUTH/bottom wall, a simple ivory stone door surround, a tiny carved open-book emblem above the lintel (symbol only, no words), three shallow entry steps. Slight material wear, carefully authored discrete pixel clusters, fine roof tile rows and polished wood, calm dignified Japanese private-school library rather than a palace. No exterior trees or plants attached.
CAMERA AND GEOMETRY: orthographic overhead RPG camera, same roof-dominant elevated view as reference. North at top, entrance faces directly toward image bottom. All long front/eaves edges perfectly horizontal, all side footprint edges vertical. No isometric diamond, no perspective vanishing points. Broad roof occupies about70% of total visible height, short south wall25%, steps5%. The entire visible library silhouette must be approximately1.7 TIMES WIDER THAN TALL: noticeably deeper and more compact than the long academic wing. It will display at368 game pixels wide andabout216 high, fitting a352x224 collision rectangle. Keep rectangular footprint with no projecting wings.
Composition: landscape canvas, ONE complete isolated building centered with transparent margin on every side. Entire roof, facade and steps visible, not clipped. Genuine alpha transparent background outside the sprite. No floor, no surrounding pavement, no ground plane, no separate ground shadow, no surrounding scenery, no people, no other building, no furniture outside, no UI, no text, no words, no letters, no watermark. A usable map sprite, not a scene or concept sheet. Preserve the reference's crafted material definition; do not blur or make it photorealistic.
```

