# Bibliothèque — assets ImageGen v5

Mode de création : **ImageGen intégré**, six PNG originaux copiés dans le projet, dont cinq avec transparence native. Aucun PNG généré n’a été repeint ou découpé sur disque. La table de lecture de la passe v4 reste utilisée.

## Assets livrés

- [Salle, sol et murs](../../web/dist/assets/library-v5/room.png)
- [Rayonnage mural](../../web/dist/assets/library-v5/wall-bookcase.png)
- [Rayonnage double face](../../web/dist/assets/library-v5/book-stack.png)
- [Siège de lecture](../../web/dist/assets/library-v5/reading-chair.png)
- [Comptoir d’accueil](../../web/dist/assets/library-v5/reception-desk.png)
- [Atlas catalogue, chariot, retours et plantes](../../web/dist/assets/library-v5/library-props.png)

L’atlas de mobilier contient quatre cellules. Le chargeur ne décode l’image qu’une fois et repère les limites alpha séparément dans chaque cellule pour éviter de prendre le sprite voisin. Les huit sièges partagent une seule texture, retournée verticalement selon le côté de la table.

Le sol, le tapis, les murs et les fenêtres sont une image. Son affichage en neuf sections aligne les jonctions sol/mur avec les limites de déplacement du mapping. Les meubles gardent leurs rectangles de collision, leur ordre de profondeur et les interactions. Canvas affiche les PNG ; le dessin procédural de la salle et des meubles sert uniquement de repli pendant le chargement ou en cas d’échec. Les petits index des rayons et repères d’interaction restent dessinés par le moteur.

## Validation

52 tests passent, dont trois contrôles ajoutés : absence de mélange entre cellules de l’atlas, continuité du fond de salle et alignement avec les limites de déplacement, présence des assets pour chaque meuble. Les tests existants vérifient aussi l’accès aux activités et aux personnages.

Vérification dans le navigateur : entrée, circulation entre les tables, allée de Reina et mur nord. Aucune erreur ni alerte console pendant le contrôle.

- [Accueil en jeu](accueil-en-jeu.png)
- [Espace de lecture en jeu](lecture-en-jeu.png)
- [Rayonnages et mur nord en jeu](rayonnages-en-jeu.png)

## Prompts exacts

### Salle, sol et murs

```text
Use case: stylized-concept
Asset type: production background plate for a playable top-down 2D Japanese elite-school RPG library, an EMPTY room shell with no furniture.
Primary request: a beautifully authored pixel-art library room, oak parquet, ivory plaster walls with dark walnut dado panelling, tall quiet blue-grey glazed windows along the north and west walls, understated classical Japanese private-school architecture, warm afternoon daylight. Deliberate crisp pixel clusters, 32-bit Japanese adventure-game craft, muted warm amber timber, deep moss green and burgundy accents. Clean material definition at game scale, not a painterly blur.
Camera: orthographic overhead RPG camera, x/y axes parallel to image edges, no isometric view, no horizon, no vanishing point. Show a narrow north wall band at the top and cutaway side walls, floor seen straight from above.
GEOMETRY is critical: landscape canvas aspect 7:5, representing a 1120 by 800 game-unit room. The walkable floor is the exact rectangle x=64 to1056 and y=112 to736, in those normalized coordinates. The north wall occupies y=48 to112, slim side walls x=40 to64 and1056 to1080. Dark charcoal background outside the room. South wall is cut away, a small recessed doorway and three shallow steps ONLY at x=524 to596, y=736 to758. No solid wall across south edge. Entire room fits inside image.
Floor: long warm honey-oak parquet planks, seams irregularly staggered, restrained grain and subtle wear. A large rectangular desaturated deep moss reading carpet occupies EXACTLY x=112 to656,y=240 to624, with a fine ivory border and very subtle woven pattern. Rest of floor blank. Clear open east side for book aisles. Gentle window light patches confined to left floor edge; no large contrast glare.
Constraints: absolutely NO furniture, NO bookshelves, NO tables, NO chairs, NO plants, NO lamps, NO people, NO UI, NO signs, NO lettering, NO text, NO watermark. This is a reusable empty game room plate behind separately placed sprite furniture, not a screenshot and not a concept scene. Opaque full image.
```

### Rayonnage mural

```text
Use case: stylized-concept
Asset type: ONE transparent wall-bookcase sprite for the library of a playable top-down 2D Japanese school RPG.
Primary request: a long, low walnut library bookcase with six connected bays, each bay containing two shelves tightly filled with individually varied cloth-bound books. Muted burgundy, deep moss, desaturated indigo, old ivory and ochre book spines. Brass shelf pins and little blank ivory labels. A few books lean and two stacks lie horizontally, restrained lived-in asymmetry. Fine warm timber grain, clean joinery and soft edge wear. Keep a broad single uninterrupted rectangular silhouette.
Style: carefully hand-crafted pixel-art Japanese adventure game, crisp discrete pixel clusters, same rich understated 32-bit aesthetic as an oak-parquet school library. Detailed at 544 game pixels wide, not photorealistic or painterly.
Camera: high orthographic top-down RPG view, axes parallel to frame, narrow wooden top surface and a SHORT south-facing visible book-filled facade. Width to TOTAL visible height approximately 6:1. Straight horizontal top and bottom; vertical sides, no isometric diagonals or perspective. It will stand along the north wall at 544 pixels wide and84 pixels tall, with its base on an existing collision rectangle.
Composition: landscape canvas, ONE complete wide cabinet centered, generous clear alpha margin. No cut-off edges, no detached props, no ground shadow, no floor, no wall, no people, no surroundings, no cast shadow beyond the sprite. GENUINE transparent background, no text or letters or numbers, no watermark. Only ONE horizontal bookcase, no atlas.
```

### Rayonnage double face

```text
Use case: stylized-concept
Asset type: ONE alpha-transparent north-south library book-stack sprite for an overhead 2D RPG.
Primary request: a single LONG NARROW double-sided walnut library bookcase aisle seen almost vertically from ABOVE. Its long axis runs exactly TOP TO BOTTOM of the image. A narrow continuous walnut top/spine runs vertically in the middle, with shallow rows of tightly packed book tops visible along BOTH long sides. Books appear as thin multicolored cloth rectangles, dusty burgundy, old ivory, indigo, moss green, ochre. Solid dark wood end caps top and bottom, small blank brass plate on the bottom cap. Beautiful joinery, subtly worn edges, no clutter outside the rectangular silhouette.
Geometry: total visible sprite HEIGHT is EIGHT times its WIDTH, a very narrow long rectangle. This is a top-down FLOOR-PLAN style shelf, NOT a front-facing bookshelf tower, NOT a tall display cabinet. The viewer sees the TOPS of books and the wood top cap. Long edges absolutely vertical, short edges horizontal. At runtime it will be 48pixels wide and376pixels long. Keep the same width for entire length.
Style: authored 32-bit Japanese school adventure-game pixel art, crisp discrete pixels, warm walnut to match an oak-parquet library, restrained rich materials readable at small scale. Do not use photorealism or fuzzy painterly rendering.
Composition: portrait canvas, one isolated long shelf centered with generous genuine transparent margin. Entire shelf visible. No other furniture, no people, no floor, no room, no isometric angle, no ground shadow, no words, no letters, no numbers, no watermark. True alpha transparency.
```

### Siège de lecture

```text
Use case: stylized-concept
Asset type: ONE transparent reading-chair sprite for a top-down 2D Japanese school RPG library.
Primary request: one sturdy elegant walnut library chair with a muted moss-green leather upholstered square seat, restrained brass tacks and a curved walnut backrest. Subtle leather creases and polished worn wood corners. No arms. A practical student reading chair, not a throne. High quality carefully authored pixel art, clean discrete pixel clusters, warm walnut and deep moss consistent with a refined 32-bit Japanese adventure-game library.
Camera: high orthographic overhead view, almost vertically down, axes aligned exactly with image. The backrest is along the BOTTOM/south edge, the chair faces NORTH/toward the TOP of the image. Seat occupies most of the silhouette, two short legs barely visible below, no perspective vanishing points, no isometric diagonals.
Composition: square canvas, ONE chair centered, complete isolated sprite with transparent margin, square footprint (will display at 28 by28 game pixels). Clean silhouette legible at that size. Genuine alpha background, no shadow outside the object, no floor, no rug, no table, no other props, no people, no labels, no text, no watermark.
```

### Comptoir d’accueil

```text
Use case: stylized-concept
Asset type: ONE transparent librarian reception desk sprite for a top-down 2D Japanese school RPG.
Primary request: a long low walnut reception desk seen from a high overhead RPG camera. A broad warm oak countertop, central moss-green leather blotter, small ledger open at LEFT, restrained stacks of burgundy/ivory books, a small modern dark-grey circulation terminal at RIGHT with a subdued teal screen, a brass date stamp beside the ledger. A few catalogue slips, carefully arranged. Narrow paneled south-facing front apron below the top. Understated functional private-school library furnishing.
Geometry: long axis exactly horizontal, orthographic axes aligned with image, near vertical view. Width to total visible height about FOUR TO ONE. At runtime the full object will occupy 224 by62 pixels. No visible high frontal facade, no big legs, no perspective or isometric diagonals. Countertop occupies90% of image-object height, front apron only10%.
Style: hand-crafted rich pixel art, discrete clean clusters, warm walnut and oak, muted burgundy/moss/ivory books, fine worn edge highlights, 32-bit Japanese adventure-game library. Clear shapes when reduced to224px wide, no fuzzy paint, no photorealism.
Composition: landscape canvas, ONE isolated complete desk centered with genuine transparent margin all round. No chairs, no people, no floor, no room, no other detached objects, no shadow outside silhouette, no legible writing, no letters, no logos, no watermark. Alpha transparent background.
```

### Atlas catalogue, chariot, retours et plantes

```text
Use case: stylized-concept
Asset type: a PRODUCTION 2x2 sprite atlas, four isolated library furnishing sprites on genuine transparent background, for an overhead 2D Japanese school RPG.
Primary request: four practical library props in matching warm walnut, moss green, burgundy and ivory, rich authored crisp 32-bit pixel art. High orthographic overhead RPG camera, same near-top-down angle for every object, axes aligned to frame. All objects complete, detached from each other. Each must remain entirely inside its own quadrant with at least15 percent empty transparent margin INSIDE that quadrant. Center each object at its quadrant's exact center. The center horizontal line and center vertical line MUST be completely empty transparent gutters. No visible grid or labels.
TOP LEFT QUADRANT: a small square walnut card-catalogue cabinet, six brass-handled index drawers on a SHORT south face and broad wooden top seen from above, one small neat index-card tray on top. About square silhouette.
TOP RIGHT QUADRANT: a compact square two-level brass-framed book trolley on four tiny dark castors, near-top-down view, warm wood shelf with a few burgundy, ivory and indigo book stacks, a curved handle on north edge. About square silhouette.
BOTTOM LEFT QUADRANT: a low rectangular desaturated moss-green metal library book-return box, narrow dark slot on its top, simple blank brass plate on short south face. Width to height about 1.6:1. No lettering.
BOTTOM RIGHT QUADRANT: a rectangular low ivory ceramic planter box containing two lush restrained indoor ferns, viewed from above, individually readable dark sage and olive fronds, walnut feet barely visible, width to height about1.5:1. No overhanging fronds outside this quadrant's margin.
Style: clean pixel clusters, precise functional silhouettes, subtle worn edges and fine material definition, not photorealism, not blurry paint. Looks good at forty to sixty game pixels per object.
Constraints: exactly FOUR objects, one per quadrant as specified. No floor, no walls, no scene, no other objects, no people, no background fill, no ground shadows, NO text, NO words, NO numbers, NO watermark. GENUINE transparent alpha between and around all sprites. Square canvas.
```

