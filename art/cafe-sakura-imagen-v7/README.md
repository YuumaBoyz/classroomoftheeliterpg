# Café Sakura — concept puis sprites ImageGen v7

Mode : **ImageGen intégré**. La vue d’ensemble a été générée d’abord, puis utilisée comme référence pour tous les sprites. Le décor vide a été obtenu par une édition ImageGen de cette même vue, en retirant le mobilier. Aucun PNG n’a été recompressé, redimensionné ou repeint sur disque.

## Direction visuelle

Un café japonais de campus, chaleureux et contemporain : noyer, cuir bordeaux, pierre et carrelage ivoire, parquet miel, vitrages bleu-vert et touches de fleurs de sakura. Cinq tables, une banquette près des fenêtres à l’ouest, un comptoir à espresso et pâtisseries au nord, une petite supérette au nord-est, une allée dégagée depuis l’entrée sud.

[Concept original](concept.png)

## Fichiers livrés

- [Vue d’ensemble](concept.png) : vue de direction artistique conservée hors du chargement du jeu.
- [Salle vide, murs et sol](../../web/dist/assets/cafe-v7/room.png)
- [Comptoir équipé](../../web/dist/assets/cafe-v7/counter.png)
- [Tables et chaises](../../web/dist/assets/cafe-v7/seating.png)
- [Supérette et accessoires](../../web/dist/assets/cafe-v7/props.png)
- [Banquette des fenêtres](../../web/dist/assets/cafe-v7/banquette.png)

Les cinq PNG de production contiennent le fond de salle opaque, un comptoir et une banquette à transparence native, plus deux atlas détourés : deux tables, deux orientations de chaise, distributeur, étagère de la supérette, plantes et ardoise. La poubelle réutilise l’asset extérieur déjà livré. Les **33 objets du café** utilisent maintenant des assets image.

## Intégration

`web/dist/cafe-art.mjs` définit les détourages et les cellules d’atlas. Le chargeur partage chaque image entre ses sprites, conserve la résolution originale, repère l’alpha dans chaque cellule et affiche les objets sans étirer leurs proportions. La salle est découpée à l’affichage pour aligner murs et sol avec les collisions ; une jonction supplémentaire en x=742 dans la source aligne le centre de la porte peinte avec le seuil jouable x=560.

Les cinq tables conservent leur disposition et chaque chaise reste un objet distinct. La banquette a son propre rectangle de collision. Le comptoir a une profondeur adaptée au nouvel asset. L’étagère et le distributeur ont été séparés pour éviter leur chevauchement. Les menus du mur sont inclus dans le décor de salle ; l’ancien panneau procédural superposé a été retiré.

Le moteur compose encore les images avec Canvas et WebGL ; lumières, ombres et repères d’interaction restent dynamiques. Le dessin procédural précédent sert de repli au chargement ou si une image échoue.

## Vérification

**70 tests passent.** Trois nouveaux contrôles couvrent les assets des 33 objets, la continuité du fond et l’alignement du seuil, et l’accès au comptoir / à la supérette. Les tests existants vérifient aussi les chemins, les collisions et les déplacements des PNJ.

Vérification dans le navigateur : circulation entre les tables, comptoir et supérette ouverts depuis leurs emplacements, inspection des fenêtres, sièges et appareils. Aucun achat ni créneau consommé pendant le contrôle. Aucune erreur ni alerte console. Captures prises dans le jeu avec le HUD temporairement masqué, puis rétabli.

- [Comptoir en jeu](comptoir-en-jeu.png)
- [Salle et banquette en jeu](salle-en-jeu.png)

## Prompts exacts

### Vue d’ensemble

```text
Use case: stylized-concept
Asset type: art direction concept of the INTERIOR CAFE SAKURA for an existing playable top-down2D Japanese elite-school RPG, one cohesive finished room view.
Primary request: reimagine the Sakura as a warm contemporary Japanese campus kissaten, intimate and believable, refined authored32-bit Japanese adventure-game pixel art with crisp deliberate clusters and rich small material detail. Walnut joinery, burgundy leather seats, warm ivory plaster, muted teal glazing, cream square tiles and honey oak floor, a few restrained sakura-pink accents, small quiet plants. No fantasy or ornate gold. Afternoon sunlight from west windows, cozy brass wall sconces, purposeful everyday objects.
Layout must match existing gameplay: landscape rectangular room representing1120x800game units. Walkable floor x64..1056,y112..736. North wall at top with a long straight counter centered in the top band from x224 to928,y144..224: pale ivory stone countertop on paneled walnut base, espresso machine, grinder, cup stacks, pastry display, small payment terminal. Three small framed blank menus behind the counter. Small convenience shelf and compact burgundy drink vending machine in the far northeast corner. WEST wall has tall wood-framed windows and one long burgundy upholstered banquette running vertically x96..144,y272..592. FIVE little walnut cafe tables at positions around x208,y352; x448,y352; x720,y352; x208,y560; x720,y560; each with4matching simple chairs at north/south edges, coffee cups, a few folded paper napkins. Broad clear central aisle from south-center entrance at x560,y736 to counter; open middle gap, no table at x448,y560. Small plants in southwest and southeast corners. One little blank chalkboard near the northeast shop area. No people to obstruct design.
Camera: high orthographic overhead2D RPG cutaway, room edges axis-aligned, floor viewed nearly vertically, north wall shallow visible facade, no isometric diamond, no architectural perspective or horizon. Layout legible as a playable game map. Keep furniture at consistent scale, generous walking gaps. Whole room fully visible including centered south threshold.
Composition: landscape7:5, one complete room, dark neutral outside cutaway walls. The result will guide a matching empty room plate and separate transparent furniture sprites, so make forms cleanly separable. Rich authored pixels, no blur, no photorealism, no generic web interface or dashboard, no UI, no labels, no words, no letters, no watermark.
```

### Salle vide, murs et sol

```text
Use case: precise-object-edit
Asset type: empty room background plate derived from the supplied Cafe Sakura interior concept.
Input image1 is the design reference and edit target. KEEP its exact orthographic overhead camera, entire cutaway room silhouette, warm ivory plaster, walnut wall panelling, west windows showing sakura outside, brass sconces, honey-oak parquet and north cream-tiled floor band, centered south threshold with burgundy mat, and the same pixel-art material quality.
REMOVE every freestanding object from the floor: all tables, chairs, banquette, plants, chalkboard, vending machine, shop cabinet, and the ENTIRE counter including countertop, appliances, shelves, cups and pastry display. Fill the vacated spaces naturally with uninterrupted floor / wall. The north wall can retain THREE blank black framed menu boards and sconces ONLY. No countertop, no sink, no low cabinets, no furniture left at all. No plants anywhere inside the floor.
The result is an EMPTY room shell to place separately generated interactive sprite furniture over. The WHOLE north floor band, from left to right and about24%of the interior floor depth, is warm ivory square tile; the remainder is honey oak parquet. Restrained west window sunlight on floor, no dark furniture-shaped ghost shadows. All previously occupied floor areas must be clean blank material. Keep doorway centered at bottom. No lettering, people, UI, labels or watermark. Opaque landscape7:5, full room visible and uncropped. No change of camera or architectural style.
```

### Comptoir équipé

```text
Use case: stylized-concept
Asset type: ONE production alpha-transparent espresso COUNTER sprite for the Cafe Sakura of a playable top-down2D Japanese school RPG.
Input image1: visual style reference ONLY, the Cafe Sakura concept. Match its walnut joinery, ivory stone, equipment, restrained burgundy accents and rich precise pixel-art finish. Generate a NEW isolated sprite.
Subject: one long straight complete cafe serving counter, warm ivory stone worktop on paneled walnut base, stainless espresso machine with two brewing heads at left-of-center, small black grinder and cup stacks to its left, neat saucers and kettle at center, a low glass display of tiny croissants and pastries at right-of-center, compact dark payment terminal at far right. Discreet brass fittings, slight wear, useful cafe objects. NOT an L-shaped counter: simple long straight rectangle. No separate back counter or sink behind it.
Camera: HIGH orthographic overhead2D RPG view, predominantly see countertop and tops of appliances; a very short south-facing walnut paneled apron below. Straight horizontal top and bottom silhouette, vertical end edges, no isometric diagonals, no perspective. Appliances remain within the outer rectangular silhouette and must not rise into a huge front elevation.
Critical proportions: total visible WIDTH is about6TIMES total visible HEIGHT (including equipment and apron). Broad countertop85%of object depth and short apron15%. It will display at704game pixels wide andapproximately120high; make small cups and pastries readable. Entrance/playable interaction takes place below south edge.
Composition: wide landscape canvas, ONE counter centered, entirely visible with generous transparent margin. True alpha background around it. No chairs, stools, floor, walls, plants, people, ceiling lights, text, logos, letters, numbers or watermark. Clean discrete32-bit pixel clusters, no photorealistic noise and no blurry painting.
```

### Tables et chaises

```text
Use case: stylized-concept
Asset type: production2x2 alpha-transparent sprite atlas of cafe tables and chairs for a playable top-down2D Japanese school RPG.
Input image1 is STYLE REFERENCE ONLY, the Sakura cafe concept. Match its warm walnut table grain, burgundy leather seats and precise32-bit pixel-art detail, but create isolated reusable props.
Composition: square canvas divided into four equal invisible cells, one complete sprite centered in EACH quadrant with at least15% transparent margin. No visible grid, center vertical and horizontal gutters fully transparent. No sprite parts cross quadrant boundaries.
TOP LEFT: one rectangular walnut cafe table, horizontal long axis, seen almost vertically from above, two small white porcelain coffee cups on saucers, tiny vase with one short sakura twig near center, one folded ivory napkin. Width about1.8times total height. No chairs or legs sticking out. Short south/front wooden apron below tabletop. Fine realistic-to-pixel wood grain, subtle wear.
TOP RIGHT: second table of exactly same dimensions and design, with one white tea cup and saucer, a small plate holding a dorayaki and one folded burgundy notebook, restrained asymmetrical arrangement. NO chairs. Horizontal1.8:1 rectangle.
BOTTOM LEFT: one simple WALNUT CHAIR with burgundy leather square seat and low burgundy upholstered backrest along BOTTOM/south edge. Chair faces NORTH/towards top. Seen almost vertically from above. Square silhouette, two short rear feet, no arms. Clean useful furniture readable at28game pixels.
BOTTOM RIGHT: SAME walnut and burgundy chair, same size and camera, but backrest along TOP/north edge, facing SOUTH/towards bottom. Do not rotate into side view. Exactly opposite orientation, consistent highlights.
Constraints: true alpha background, exactly4complete separate sprites as specified. No floor, rug, scene, ground shadows, people, words, letters, labels, watermark. Deliberate crisp pixel clusters, no blur, no photorealism. The tables will display112pixels wide andabout64deep, chairs28square, details must stay legible.
```

### Supérette et accessoires

```text
Use case: stylized-concept
Asset type: production2x2 alpha-transparent sprite atlas of FOUR small cafe furnishings for a playable top-down2D Japanese school RPG.
Input image1: Cafe Sakura concept as STYLE REFERENCE ONLY. Match warm walnut, burgundy, ivory, brass and lush restrained green plants with authored crisp32-bit Japanese adventure-game pixels. Generate isolated reusable items.
Camera: high orthographic overhead RPG angle, see tops and compressed south faces, axis-aligned footprint, no isometric diamonds or vanishing perspective.
Layout: square canvas split into FOUR equal invisible quadrants. Exactly ONE complete prop centered within each quadrant, generous15%clear alpha margins inside each quadrant, all central gutters completely empty transparent, no cell borders or grid.
TOP LEFT: compact upright burgundy drink vending machine with subdued teal glass front, three small rows of individual bottles and cans in moss, ivory and burgundy, dark payment strip on right, small pickup slot below. No logos or lettering, height about1.6times width. Broad top visible at overhead camera, do not make a tall front elevation.
TOP RIGHT: small walnut convenience cabinet, shallow glass door / open display with neat tea packets, biscuits, dorayaki and tiny plain paper bags, short ivory counter top, two lower wood doors with brass pulls. No text on packaging. Width roughly same as height, strong square silhouette.
BOTTOM LEFT: a low walnut planter stand holding two ivory ceramic pots, one lush broadleaf green houseplant and one little sakura-pink flowering plant. Seen high from above, all foliage contained within square footprint, natural asymmetric leaves, no separate shadows.
BOTTOM RIGHT: a small walnut A-frame chalkboard, dark moss-black blank writing surface with just three discreet off-white horizontal chalk strokes and one little sakura flower doodle, no letters or numbers. Top-down RPG angle, two short feet visible, total height about1.5times width. Practical campus cafe sign, not medieval ornament.
Constraints: true alpha transparency around and between all four sprites. No floor, walls, tables, other objects, cast shadows outside silhouette, people, text, letters, labels or watermark. No photorealistic noise, no blurry painting. Props will display40..70game pixels wide.
```

### Banquette des fenêtres

```text
Use case: stylized-concept
Asset type: ONE complete transparent BANQUETTE sprite for the west window wall of Cafe Sakura in a top-down2D Japanese school RPG.
Input image1 is STYLE REFERENCE ONLY, the Cafe Sakura concept. Match the burgundy leather window banquette, walnut frame, brass fittings and crisp authored32-bit pixel-art material finish.
Subject: a long narrow straight upholstered cafe banquette running vertically NORTH-SOUTH along the LEFT/west wall. Rich muted burgundy leather seat cushions with six subtle stitched divisions along its length, slim low matching backrest runs along LEFT/west long edge, warm walnut base and tiny short wood feet. The open seating side faces RIGHT/east towards tables. Only one straight seating strip, no corners or return section. Subtle wear and leather highlights, restrained and practical.
Camera is almost VERTICAL overhead orthographic RPG view: mainly see long seat surface; a thin backrest band along LEFT edge. It is NOT a frontal view of a tall sofa turned on its side. Long edges exactly vertical, short edges horizontal, no isometric perspective.
Critical silhouette: TOTAL HEIGHT approximately6.5TIMES total WIDTH, a long narrow rectangular vertical strip. Will display48game pixels wide andaround320long. Entire object complete with transparent margin all round.
Portrait canvas. Genuine alpha transparency. No wall, windows, floor, carpet, plants, tables, people, detached props, ground shadow, text, labels or watermark. Crisp discrete pixel clusters, no blurred paint, no photorealism.
```

