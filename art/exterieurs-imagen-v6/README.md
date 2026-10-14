# Extérieurs — ImageGen v6

Mode : **ImageGen intégré**. Huit PNG originaux livrés dans `web/dist/assets/exterior-v6/` : sept atlas / bâtiments à transparence native et un atlas opaque de terrain. Aucune recompression, retouche ou réduction des PNG sur disque.

## Couverture réelle

Les **49 objets du campus et les 18 objets de la cour** disposent maintenant d’un asset image. Les bâtiments académique et de bibliothèque ainsi que les sakuras conservent les PNG précédents. Les autres arbres, lampadaires, bannières, panneaux, bancs, jardinières, poubelle, vélos, fontaines, bassin et grilles utilisent la passe v6. Le gymnase, la résidence et le café ont aussi une façade ImageGen.

Le gazon, les pavages, les massifs et les clôtures sont également issus des images. Les textures de sol sont répétées depuis des cellules copiées à leur résolution native. Les clôtures et les grilles se répètent sans étirement, avec découpe du dernier segment. Les sols conservent les coordonnées des chemins existants.

Le moteur compose encore ces images avec Canvas et son post-traitement WebGL. Les éclairages, ombres, repères interactifs et petits textes de destinations restent dynamiques. Le dessin procédural des décors ne sert plus que de repli si les fichiers ne sont pas encore chargés ou échouent.

## Fichiers livrés

- [Arbres verts](../../web/dist/assets/exterior-v6/trees.png) : Deux silhouettes détourées : zelkova et camphrier.
- [Signalétique et mobilier de rue](../../web/dist/assets/exterior-v6/street.png) : Lampadaire, bannières D et ANHS, panneau directionnel, tableau d’affichage, vélos.
- [Mobilier de jardin](../../web/dist/assets/exterior-v6/garden.png) : Banc, jardinière, poubelle, massif fleuri.
- [Eau et clôtures](../../web/dist/assets/exterior-v6/water.png) : Fontaine, bassin, grille de drainage et clôture.
- [Gymnase](../../web/dist/assets/exterior-v6/gym.png) : Façade extérieure du gymnase.
- [Résidence](../../web/dist/assets/exterior-v6/residence.png) : Façade extérieure de la résidence.
- [Café Sakura](../../web/dist/assets/exterior-v6/cafe.png) : Façade extérieure du café.
- [Textures de terrain](../../web/dist/assets/exterior-v6/terrain.png) : Gazon, variante de gazon plus sombre fournie en réserve, pavés et pierre claire.

## Intégration et validation

Les proportions et la définition des sources sont conservées. Les limites de cellules suivent les gouttières réellement générées, notamment pour les deux arbres et l’atlas eau/clôtures. Le masque d’ombre distingue désormais plusieurs détourages provenant du même atlas.

Les seuils du gymnase, de la résidence et du café restent alignés avec leurs portes jouables ; leurs empreintes ont été ajustées aux façades visibles. Un figurant de la cour a été éloigné d’un massif fleuri.

**60 tests passent** : chemins, collisions, accès aux personnages et activités, couverture des objets extérieurs, fichiers livrés, répétition des bandes sans étirement et repli du sol pendant le chargement. Contrôle navigateur des trois nouvelles façades, des passages, des arbres, des lampadaires, des bannières, des panneaux et de la cour ; aucune erreur ni alerte console. Les captures ont été prises dans le jeu avec le HUD temporairement masqué, puis rétabli.

- [Campus nord](campus-nord.png)
- [Gymnase, drapeau et vélos](gymnase-en-jeu.png)
- [Résidence](residence-en-jeu.png)
- [Café](cafe-en-jeu.png)
- [Cour, bassin et fontaine](cour-en-jeu.png)

## Prompts exacts

### Arbres verts

```text
Use case: stylized-concept
Asset type: production transparent sprite atlas containing TWO complete green campus trees, side by side, for a playable top-down 2D Japanese school RPG.
Primary request: two mature Japanese spring shade trees in the same visual family as meticulously crafted 32-bit Japanese adventure-game sprites. LEFT HALF: broad Japanese zelkova, organic asymmetric lobed crown, dense layered olive and sage leaves with deep forest-teal shadow pockets and soft yellow-green sunlit edges; short textured branching brown trunk visible at bottom. RIGHT HALF: slightly narrower camphor tree, rounded irregular crown with larger dark evergreen foliage clusters, individual gaps and branch silhouette, slightly leaning trunk. Natural botanical shapes, not spherical pompoms. Rich readable canopy texture, crisp intentional pixel clusters, no fuzzy painterly rendering or photorealism. Both must harmonize with detailed sakura trees, blue slate roofs and cream stone on an elite-school campus.
Camera: high orthographic overhead 2D RPG camera, look down on crowns while seeing a little trunk below, no isometric diamond, no ground plane or horizon.
Composition: landscape canvas split into TWO equal invisible vertical cells. One entire tree centered within EACH half; trunks end near bottom of each cell, crowns at top. All branches must remain in their own half with at least8% transparent margin inside each cell and a completely transparent central gutter. No grid or labels. Each tree will display at about112 game pixels wide and100-140 high, details must read at this scale.
Constraints: genuine alpha-transparent background including gaps between leaves, no separate ground shadow, no floor, no grass, no planter, no people, no attached scenery, no text, no numbers, no watermark. Exactly two reusable independent cutout sprites.
```

### Signalétique et mobilier de rue

```text
Use case: stylized-concept
Asset type: production alpha-transparent sprite atlas of SIX campus street furnishings in an exact3-column by2-row grid for a top-down2D Japanese school RPG.
Style: meticulously crafted32-bit Japanese adventure-game pixel art, deliberate crisp pixel clusters, restrained detail readable at game scale, dark blue-grey cast iron, warm ivory stone, burgundy cloth and weathered brass. Match an elite-school campus with blue slate roofs and sakura trees. High orthographic overhead RPG camera with short south-facing surfaces. No isometric angle, no perspective vanishing points.
GRID IS CRITICAL: canvas LANDSCAPE3:2, six equal rectangular cells, 3columns2rows. Each complete object centered in its OWN cell with generous20% clear transparent margin inside that cell. Entire grid boundaries, all vertical and horizontal dividers must be completely empty transparent gutters, no visible grid or cell backgrounds.
TOP LEFT: one elegant slender dark cast-iron campus lamp post, simple square ivory-glass lantern glowing faintly warm, narrow shaft and small stone foot, complete tall silhouette, no halo outside sprite, no ground shadow.
TOP CENTER: one slim dark metal pole carrying a burgundy vertical swallowtail school banner with a narrow ivory border and one large precisely drawn ivory capital letter "D" on the cloth, no other text. Entire pole and foot visible, front of cloth faces viewer/south, restrained natural fold, no diagonal perspective.
TOP RIGHT: same pole and banner design, with exact small ivory uppercase text "ANHS" on the burgundy cloth instead of D. No other text. Complete pole and foot.
BOTTOM LEFT: a campus wayfinding post in dark painted metal, three broad horizontal directional sign slats (alternating ivory and dark desaturated green), entirely BLANK faces with enough surface for real runtime labels. Slats may have arrow-shaped ends. Complete post with small foot, width roughly similar to height.
BOTTOM CENTER: an outdoor campus noticeboard in weathered walnut and dark metal, a shallow little rain canopy at top, cork surface holding three pinned blank ivory/burgundy papers, two short supporting posts visible, no lettering.
BOTTOM RIGHT: one low bicycle rack containing THREE complete compact city bicycles side by side, polished dark-silver frames, muted burgundy and sage saddle bags, seen from high overhead RPG angle. Whole ensemble long horizontal silhouette.
Constraints: exactly six isolated sprites in the specified cells, genuine alpha transparency, no scenery, no floor, no ground shadows, no additional props, no people, no logos except the requested banner letters, no watermark. No photorealism, no blurry painting.
```

### Mobilier de jardin

```text
Use case: stylized-concept
Asset type: production2x2 atlas of FOUR separate garden furnishings on true transparent alpha, for a top-down2D Japanese school RPG campus.
Art direction: refined carefully authored32-bit Japanese adventure-game pixel art, rich readable material detail with crisp pixel clusters, understated elite-school campus, warm weathered walnut, dark blue-grey iron, ivory limestone and muted sage foliage. High orthographic overhead RPG camera with short south/front surfaces, no isometric diamond or perspective.
GRID: square canvas divided into four equal invisible cells. One entire prop per quadrant, all parts remain inside that quadrant with generous15% transparent margin, center divider lines completely empty transparent gutters. No grid, no words or labels.
TOP LEFT: one long campus bench, dark walnut slatted seat and low matching backrest along its north/top edge, two elegant dark cast-iron legs and side brackets, seen mostly from above, width about3times total height. Subtle worn timber highlights. Fully isolated, no cast ground shadow.
TOP RIGHT: one long low rectangular limestone planter full of dense neatly trimmed green shrubs and a few restrained white spring flowers. Natural individual leaf shapes, deep moss shadows, stone rim weathered slightly, long horizontal footprint width about3times its height, no foliage detached outside pot.
BOTTOM LEFT: one compact dark desaturated green metal campus litter bin with a cream stone square base, small dark slot opening near top, subdued brass edging, viewed from high overhead with a short front face. Width about0.75 of height, no logos or text.
BOTTOM RIGHT: a long low rectangular spring flower bed enclosed by a thin weathered limestone border. Dark soil and a dense, naturally varied mix of pale pink, dusty burgundy, ivory and soft ochre small flowers with delicate green leaves. Viewed almost vertically from above. Width about3times its height. NO legs, no extra lawn outside its border, clean rectangular silhouette.
Constraints: exactly four complete independent sprites as assigned, genuine transparent background, no floor, no grass outside the flower bed, no walls, no other furniture, no people, no cast shadow outside objects, no text, no letters, no watermark. Clean authored pixels, never blurry painterly or photographic.
```

### Eau et clôtures

```text
Use case: stylized-concept
Asset type: production2x2 alpha-transparent atlas of FOUR outdoor map props for an overhead2D Japanese elite-school RPG.
Style: authored32-bit Japanese adventure-game pixel art, precise pixel clusters, fine ivory limestone texture, calm teal water, dark patinated iron, restrained material detail. Consistent elevated orthographic RPG camera with north at top and south at bottom, axes parallel to frame, no isometric view or perspective vanishing points.
Composition: square canvas, four equal invisible quadrants. One whole object centered inside each quadrant with generous15% clear alpha margins, empty transparent center gutters. No visible grid.
TOP LEFT: one elegant compact octagonal campus fountain with an ivory limestone rim and clear desaturated teal water basin, a SHORT central stone pedestal and shallow bowl with a tiny restrained trickle falling into the basin. Seen predominantly from above. No spray outside basin. Detailed ripples and reflected light contained in water. Full stone base included, width similar to total visible height.
TOP RIGHT: a tranquil low rectangular ornamental pond with softened stone corners, weathered ivory rim, muted teal water, three small olive lily pads and a few restrained pale-pink lotus flowers near one corner. Seen almost vertically from above. Long axis horizontal, width about1.5times height. No rocks or vegetation outside rim.
BOTTOM LEFT: one long very narrow dark iron drainage grille, horizontal slotted grate in a slim weathered stone surround, near-vertical overhead view. Width about12times height. Uniform slot pattern continues to its straight left/right edges, designed to repeat horizontally. Complete isolated strip, no ground around it.
BOTTOM RIGHT: one short straight campus fence segment, dark blue-grey wrought-iron rails with small slender vertical bars and two simple square posts capped with ivory stone, all aligned horizontally. Orthographic top-down RPG elevation with only a little post-top showing. Width about5times total height. The side posts touch exact segment ends so repeated segments can form a continuous border.
Constraints: genuine alpha transparency outside all four complete independent props, no floor, no grass, no separate ground shadows, no scene, no people, no words, no letters, no numbers, no watermark. Fine detailed sprite craft, not fuzzy paint and not photorealism.
```

### Gymnase

```text
Use case: stylized-concept
Asset type: ONE genuinely alpha-transparent GYMNASIUM exterior building sprite for a playable top-down2D Japanese elite-school campus RPG.
Primary request: a contemporary prestigious Japanese school gymnasium, compact rectangular sports hall with broad muted blue-green standing-seam metal hip roof, two long narrow frosted skylight strips, low ivory limestone and warm burgundy brick south facade, a few high teal clerestory windows, centered dark double entrance doors with a tiny abstract basketball emblem above (symbol only), two shallow stone steps. A school building with practical solid architecture, no fantasy ornaments.
Style: rich carefully authored32-bit Japanese adventure-game pixel art, precise discrete clusters and clean material edges, controlled weathering, match blue-slate academic buildings with cream stone and burgundy brick. Readable at336game pixels wide.
Camera: HIGH orthographic overhead RPG view, roof occupies about75% of total visible height, short south wall20%, steps5%. Roof/front edges exactly horizontal, side edges vertical, no vanishing points or isometric angle. North at top, south entrance EXACTLY at horizontal center of bottom edge.
Silhouette total width about1.8times total height, compact deep roof rather than a long flat facade. It fits a320x224map footprint, with the threshold at the bottom center.
Composition: landscape canvas, one complete isolated building, generous alpha margin on every side. No exterior ground, no pavement, no trees, no people, no separate ground shadow, no neighboring buildings, no text or lettering or numbers, no watermark. True alpha transparency, not a scene, not an architectural elevation.
```

### Résidence

```text
Use case: stylized-concept
Asset type: ONE alpha-transparent student RESIDENCE building sprite for a top-down2D Japanese elite-school RPG campus.
Primary request: a compact elegant modern Japanese student residence, deep rectangular slate-blue hip roof with two restrained rectangular rooflights and a short brick chimney, low visible ivory stone and muted burgundy brick south facade with several teal dorm windows, centered walnut-and-glass double doors, a tiny blank brass plaque and three shallow limestone entry steps. Simple regular residential architecture, calm lived-in dignity, not a mansion or castle.
Style: meticulous32-bit Japanese adventure-game pixel art with crisp discrete pixel clusters, detailed blue slate rows, cream stone trim, warm weathered brick and tiny walnut door details. Consistent with a refined school academic building and library.
Camera: HIGH orthographic overhead RPG view. Roof dominates75% of total visible height, one short compressed south-facing wall20%, steps5%. North at top, entry EXACTLY at horizontal center of south/bottom wall. Long roof and eaves edges horizontal, side edges vertical. No isometric diagonals, no perspective vanishing points or horizon.
Geometry: total visible sprite about1.9times wider than tall, broad deep roof, a single simple rectangular footprint without side wings, intended for368game pixels wide. Entire roof and steps complete.
Composition: landscape canvas, one isolated building centered with generous transparent margin. True alpha background. No ground plane or surrounding pavement, no vegetation, no people, no detached props, no separate ground shadow, no signs with writing, no text or letters or numbers, no watermark. Production map sprite, not a concept scene.
```

### Café Sakura

```text
Use case: stylized-concept
Asset type: ONE alpha-transparent CAFE SAKURA exterior building sprite for a top-down2D Japanese elite-school campus RPG.
Primary request: a compact refined Japanese campus cafe, broad deep muted burgundy-brown tiled hip roof, small rectangular rooflight and a discreet short chimney. Low south facade in ivory limestone, warm walnut frames, two large teal glazed cafe windows with tiny cups and warm light visible inside. Centered walnut-and-glass entrance under a short restrained ivory-and-burgundy striped canvas awning. Tiny blank cream signboard above the door, two shallow limestone entry steps. Cozy contemporary school cafe with crafted materials, not a fantasy tavern.
Style: meticulous32-bit Japanese adventure-game pixel art, clean discrete clusters, fine tile rows and worn stone, matching cream/burgundy campus buildings. Controlled rich detail readable at368game pixels across, no photorealism and no blurry paint.
Camera: HIGH orthographic overhead RPG view, roof about70% of total visible height, compressed SOUTH-facing wall25%, steps5%. All footprint edges axis-aligned, long eaves horizontal, sides vertical, no vanishing points, no isometric diamonds. North at top, door EXACTLY at horizontal center of SOUTH/bottom facade.
Geometry: total silhouette about2times wider than tall, single compact rectangle, no projecting wings. The awning must not obstruct the door or extend excessively beyond the shallow wall.
Composition: landscape canvas, one isolated complete cafe centered with clear alpha margin around every part including steps and chimney. True transparent background. No ground, no pavement, no outside tables or chairs, no trees or flowers, no people, no detached props, no ground shadow, no letters, no words, no numbers or watermark. Reusable map sprite rather than a scene.
```

### Textures de terrain

```text
Use case: stylized-concept
Asset type: opaque PRODUCTION TERRAIN TEXTURE ATLAS, exact2columns by2rows, four square seamless material tiles for a playable top-down2D Japanese school RPG.
Primary request: four carefully hand-authored pixel-art ground materials with rich small-scale detail but very low contrast and uniform illumination. Refined32-bit Japanese adventure-game craft matching cream-stone buildings and green/sakura campus trees. Direct vertical overhead view, no perspective, no objects, no cast shadows or directional gradient.
LAYOUT EXACT: square image divided into four EQUAL square quadrants. Each quadrant completely filled edge-to-edge by its material, with absolutely NO gutters, NO borders, NO grid lines, NO labels. Each quadrant is an independent square repeatable seamless tile: its own opposite edges must meet cleanly when repeated. Keep neutral evenly lit edges. No vignette.
TOP LEFT: muted olive-sage campus lawn, dominant midtone approximately#727d54, tiny varied blades and subtle darker soil pockets, delicate leaf-tip highlights, natural dense grass but no large tufts, no flowers or pebbles. Fine crafted pixel clusters, never photographic noise.
TOP RIGHT: quiet warm-grey limestone walkway paving, small rectangular slabs in staggered bonds, restrained ivory-beige stone grain, slim moss-grey seams, subtle worn edges. Dominant midtone approximately#b7b7a4. No large cracks or stains.
BOTTOM LEFT: slightly darker alternate lawn, dominant midtone approximately#68764e, same tiny-blade texture and scale as top-left, mild natural variation, no large props, no flowers.
BOTTOM RIGHT: dignified pale ivory-grey courtyard stone, evenly sized square slabs in a simple restrained arrangement, fine weathered grain, hairline grey-green seams. Dominant midtone approximately#c1bfaa. No ornament or marked lines.
Constraints: material textures only, entire image opaque, every square independently tileable, no ground features other than described materials, no trees, no shrubs, no plants sticking up, no walls, no furniture, no people, no lettering, no logos, no watermark. Crisp deliberately authored pixel clusters with fine texture, not blurred painted scenery.
```

