# Première passe visuelle ImageGen — 14 octobre 2026

Mode : **ImageGen intégré**. Quatre assets finaux, dont trois détourages PNG à transparence native. Les PNG originaux ont été copiés sans retouche destructive dans `web/dist/assets/environment-v4/`.

La première version du bâtiment a été corrigée par ImageGen pour relever la caméra : plus de toit, façade plus courte. Seule la version corrigée est intégrée.

## Assets intégrés

- [Cerisier](../../web/dist/assets/environment-v4/sakura.png) : cerisiers du campus et de la cour.
- [Bâtiment académique](../../web/dist/assets/environment-v4/academic-building.png) : aile de la classe D.
- [Table de lecture](../../web/dist/assets/environment-v4/reading-table.png) : quatre tables de bibliothèque.
- [Papier du carnet](../../web/dist/assets/environment-v4/journal-paper.png) : fond du carnet ouvert avec J.

L'intégration conserve les positions, les collisions, les interactions et l'ordre de profondeur existants. Le moteur repère les limites alpha des détourages pour ignorer la marge transparente à l'affichage. Les originaux et leur alpha sont conservés. Le décor dessiné par le moteur sert de repli pendant le chargement ou si un asset échoue. Les textes d'interface restent du HTML dynamique.

## Vérification dans le jeu

Les 46 tests existants passent. Vérification visuelle dans le navigateur : bâtiment et porte du campus, tables et déplacements dans la bibliothèque, carnet ouvert avec textes HTML lisibles. Aucune erreur ou alerte dans la console lors de cette vérification.

- [Campus intégré](campus-integre.png)
- [Bibliothèque intégrée](bibliotheque-integree.png)
- [Carnet intégré](carnet-integre.png)

## Prompts exacts

### Cerisier

```text
Use case: stylized-concept
Asset type: single transparent environment sprite for a playable 2D Japanese school RPG, NOT a concept sheet and NOT a screenshot.
Primary request: one mature Japanese cherry tree in full April bloom, intended as a polished top-down RPG map prop. Hand-pixelled 1990s/early-2000s Japanese adventure-game craft, deliberate crisp pixel clusters, subtle rich material detail, organic branching, asymmetric lobes of flower canopy, muted dusty sakura pink with plum and violet shadow pockets and pale ivory peach highlights, brown textured trunk visible below canopy. A few attached small branch gaps. Contemporary Japanese school campus mood, calm afternoon.
Camera: the same orthographic overhead RPG camera used in Pokemon / 2D tile-map JRPGs; see the crown from above, some trunk visible at bottom. NO isometric diamond, NO horizon, NO ground plane, NO 3D renderer. Image is a single usable cutout object.
Composition: square canvas, ONE tree centered and fully visible with 8 percent transparent margin on every side. Rounded canopy occupies upper 70 percent and a short narrow trunk extends downward to a single clear base at 90 percent image height. Shadow on canopy itself only; no separate ground shadow. Detailed but still readable when reduced to about 110 game pixels across.
Constraints: genuine alpha transparency outside the tree including small gaps; no background color, no scenery, no floor, no planter, no people, no text, no letters, no labels, no watermark. Render the sprite with clean pixel art edges and discrete color steps, no fuzzy watercolor or soft-focus AI mush. A natural tree, not a spherical pompom.
```

### Bâtiment académique — prompt initial

```text
Use case: stylized-concept
Asset type: ONE transparent building sprite for a playable 2D top-down Japanese elite-school RPG.
Primary request: create one long prestigious Japanese senior-high-school academic building as a usable map asset. Hand-crafted pixel art with deliberate discrete pixel clusters, refined Japanese adventure-game background design, restrained late-afternoon materials: warm ivory stucco, burgundy-brown brick trim, elegant blue-slate tiled roof, muted pale-teal windows, weathered cream limestone, subtle maroon school banners without text. Contemporary real-world Japanese school architecture, not a castle. No fantasy or neon. Three understated window bays, a slightly projecting central entrance pavilion, glazed double door exactly at the HORIZONTAL CENTER of the SOUTH wall, a short two-step threshold. Two rectangular skylights on the roof and restrained roof ridges. Rich pixel shading and fine material texture, attractive at 480 game pixels wide.
CAMERA MUST BE ORTHOGRAPHIC TOP-DOWN 2D RPG: roof planes parallel to image axes, long horizontal north and south edges, straight vertical east and west edges, short SOUTH-facing wall visible below the roof. NO isometric angle, NO diagonal building, NO perspective vanishing points. The north edge is at top, SOUTH entrance faces directly toward image bottom. It must fit an existing rectangular collision footprint.
Composition: LANDSCAPE 2:1 canvas, ONE wide rectangular building centered with 5 percent transparent margin, width about twice total visible height. Entire building, roof, walls and threshold fully visible. No attached trees, no landscape, no gardens, no ground tile, no surrounding pavement, no separate cast shadow, no people or characters. True alpha-transparent cutout around building. No text, letters, numbers, signs, official logo or watermark. Not an atlas, not an illustration of a city, not a screenshot. A single production map sprite.
```

### Bâtiment académique — correction de caméra

```text
Use case: precise-object-edit
Asset type: corrected transparent top-down RPG building sprite.
Input image 1: edit target, the just generated school building. Preserve its blue slate roof, cream stone, muted burgundy brick, centered glass entrance and crisp pixel-art materials.
CHANGE ONLY THE CAMERA AND PROPORTIONS to a MUCH HIGHER overhead RPG view. The current asset shows too much frontal facade. Redraw from an orthographic camera looking almost straight down: the ROOF must occupy about 76 percent of the object's visible height; the SOUTH FACADE must be compressed into the bottom 20 percent; tiny entrance steps the remaining 4 percent. Show a large broad roof plane with roof tile texture and the two rectangular skylights. Only ONE SHORT row of front windows below the eaves. Remove the tall two-storey frontal wall. Keep the rectangular long horizontal footprint and entrance exactly horizontally centered at the bottom. No perspective vanishing points; east/west side edges must remain vertical and front eaves horizontal. Think a building tile from an overhead SNES RPG map. The result must look like a roof viewed from above, with a narrow south wall under it, NOT an architectural elevation.
Keep true transparent alpha background and a single isolated building only. No ground, people, foliage, lettering, labels or watermark. Keep the entire object uncropped with transparent margin.
```

### Table de lecture

```text
Use case: stylized-concept
Asset type: ONE alpha-transparent reading-table sprite for a top-down 2D Japanese school RPG library.
Primary request: an elegant long rectangular oak reading table seen DIRECTLY FROM ABOVE, with a continuous dark moss-green leather reading pad inset in the center, two understated brass-and-green banker lamps, a small stack of closed burgundy and blue books at one end, one open cream textbook and a pencil neatly placed toward the opposite end. Carefully crafted pixel art, crisp discrete pixel clusters and controlled warm wood grain, rich but restrained 32-bit adventure-game visual finish. Tiny bevel highlights, slight edge wear, delicate page edges, subtle cast shading ON the table only. Elite-school library, quiet serious study atmosphere.
Camera and geometry: near-vertical orthographic overhead camera, NORTH at top, table long axis perfectly horizontal and rectangular, NO perspective, NO isometric view, NO visible table legs. NORTH and SOUTH table edges exactly horizontal. Usable table sprite is about 2.75 times wider than deep. A dark thin front apron only 4 percent of the table height is allowed along bottom.
Composition: landscape 3:2 canvas with ONE single table centered and generous transparent margins. The entire table and all objects on it must be inside the cutout. No chairs, no characters, no floor, no carpet, no walls, no background color, no labels, no text that resembles writing, no watermark. Genuinely transparent alpha outside. Readable when displayed 176 pixels wide and 64 pixels deep. Texture detail must support the simple silhouette without muddy photographic noise.
```

### Papier du carnet

```text
Use case: stylized-concept
Asset type: opaque blank notebook-page background texture to be used behind real HTML text in the journal interface of a Japanese school social RPG.
Primary request: a single close-up flat scanned sheet of warm ivory Japanese notebook paper mounted in a dark desaturated burgundy cloth cover. HAND-DRAWN GAME UI art, understated contemporary stationery, convincingly tactile paper fibres, almost invisible indentations from previous writing but absolutely no legible marks. A slim indigo cloth binding strip along the LEFT edge occupying only 3 percent of width, one thin faded red vertical margin line 7 percent from left, discreet stitched paper edge and slightly dog-eared lower-right corner. Tiny worn burgundy ink-stamp abstract circular smudge confined to the bottom-right 5 percent of the page, no symbols or letters. Subtle paper wear, never grungy.
Composition: LANDSCAPE 4:3, fills entire image edge to edge. Flat orthographic front view, no perspective. The central area from x=10% to x=94%, y=6% to y=94% must remain blank, light, nearly uniform ivory (#e9e2cd), to make dark game text perfectly readable. NO ruled horizontal lines, no page spread, no central fold, no notebook props, no pen, no sketch, no decorative branches, no outer shadow. Cover frame at right/top/bottom at most 2 percent wide.
Art direction: intimate personal study notes in an elite school, practical stationery with a history, quiet and restrained. No metallic trim, no gold, no medieval ornaments, no fantasy, no glowing effects, no dashboard or web interface. No buttons, no text, no letters, no numbers, no watermark. This is a blank reusable UI surface, not a screenshot or mockup. Opaque image, no transparency.
```


