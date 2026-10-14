# Résidence sud — ImageGen v8

Mode : **ImageGen intégré**. Le concept a été créé en premier, puis utilisé comme référence pour les cinq atlas de production. Aucun PNG n’a été repeint, recompressé ou redimensionné sur disque. Les originaux sont conservés dans le dossier de génération.

## Carte jouable

Une seule carte continue de **1 600 × 1 216 unités**, près de trois fois la surface de l’ancienne chambre :

- Huit chambres individuelles, 101 à 108, chacune avec lit, bureau, chaise, armoire, bibliothèque et téléphone de chevet.
- Chambre du joueur : **106**, avec lit interactif, carnet et téléphone. Le réveil a lieu dans cette chambre.
- Deux grands couloirs transversaux, un axe central et un hall d’entrée avec accueil et courrier.
- Salon commun, salle d’étude, laverie, sanitaires et cuisine.
- Un plan intérieur accessible à l’accueil et depuis la carte. Choisir une pièce lance un trajet à pied.
- Trois résidents anonymes dans les espaces communs.

Les anciennes sauvegardes de la chambre unique sont repositionnées une seule fois dans la chambre 106. Les positions de la première grande carte sont converties à la nouvelle échelle ; les nouvelles positions sont conservées. Les espaces communs sont explorables ; les activités scolaires gardent leurs lieux habituels.

## Images livrées

- [Concept complet](concept.png)
- [Matériaux](../../web/dist/assets/residence-v8/materials.png) : parquet, pierre, carrelage et tapis.
- [Architecture](../../web/dist/assets/residence-v8/architecture.png) : murs, fenêtres et portes ouvertes.
- [Chambres](../../web/dist/assets/residence-v8/bedroom.png) : trois lits, bureau, armoire et chevet.
- [Salon et accueil](../../web/dist/assets/residence-v8/lounge.png) : canapé, fauteuil, table basse, télévision, comptoir et boîtes aux lettres.
- [Équipements](../../web/dist/assets/residence-v8/utilities.png) : machines à laver, cuisine, sanitaires et réfrigérateur.
- [Hall en jeu](hall-en-jeu.png)
- [Chambre 106 en jeu](chambre-106-en-jeu.png)
- [Laverie à l’échelle du joueur](laverie-echelle-joueur.png)

Les 187 objets du dortoir utilisent des images. Les plantes, chaises, bibliothèques et tables de lecture réutilisent les assets ImageGen déjà présents. Le sol est composé de textures natives répétées ; le grand concept n’est pas agrandi comme fond de jeu. Les murs répètent des bandes sans étirer leur dernière section. Chaque sprite conserve ses proportions et son alpha ; les cadrages suivent les vrais intervalles transparents des atlas, qui ne sont pas toujours des cellules uniformes.

## Proportions du personnage

La première pose du mobilier était trop grande. L’architecture a été ramenée à une échelle humaine et les meubles recalibrés individuellement, sans modifier le personnage ni les PNG. Après cadrage alpha : joueur ≈ 44 unités de haut, porte de chambre 47, lit 59, bureau 44, canapé 43, banque de trois machines 49. Le dortoir garde ses huit chambres et ses cinq espaces communs. Les collisions, le plan et les positions sauvegardées suivent cette nouvelle échelle. Les valeurs proviennent de l’[audit des sprites](echelle-sprites.json), lié aux empreintes des PNG.

## Vérification

78 tests passent, dont huit sur la résidence : accès aux treize pièces, parcours et murs, activités et réveil, migration des sauvegardes, livraison des sprites, répétition des murs et découpe native des matériaux et échelle réelle des sprites après cadrage alpha. Contrôle visuel dans le navigateur : hall, parcours vers la chambre 106, intérieur de chambre et espaces communs. Voir l’[audit d’intégrité](../qualite-rendu/integrite-assets.json) pour les dimensions et les empreintes des PNG de production.

## Prompts exacts

### concept

```text
Use case: stylized-concept
Asset type: cohesive HUGE SOUTH RESIDENCE dormitory interior design concept for a playable top-down2D Japanese elite-school RPG.
Primary request: design a genuine large student dormitory building interior, not a single bedroom. High-quality carefully authored32-bit Japanese adventure-game pixel art, crisp material clusters, ivory plaster, warm walnut door frames, honey oak bedroom floors, blue-grey and muted burgundy bedding, muted sage common-room upholstery, cream stone corridor floors and subdued burgundy runner rugs. Contemporary Japanese boarding-school residence, refined practical institution with personal lived-in rooms.
Floor plan: one huge continuous rectangular cutaway floor with EIGHT distinct single bedrooms in TWO ROWS OF FOUR. In each row two rooms lie in LEFT/WEST wing, two in RIGHT/EAST wing. A wide vertical CENTRAL SPINE corridor runs between the left and right wings from north end to the main entrance centered at SOUTH/bottom. Below each bedroom row a wide east-west CROSS CORRIDOR connects all four bedroom doors to the central spine. All bedrooms have visible open doorways on their SOUTH walls facing their cross corridor; each has a single bed, desk and chair, wardrobe, bookshelf, small rug, plant and restrained individual items. The nearest bedroom in left wing is the player's room, subtly burgundy, other rooms blue/sage. No bunk beds.
Below the second cross corridor, the SOUTH third of the building contains shared facilities: a generous communal LOUNGE in southwest with sofas, coffee tables and TV; adjacent quiet study corner with a long desk; a LAUNDRY in southeast-center with several front-load washing machines and folding counter; a communal KITCHEN/dining room in far southeast with ivory/walnut cabinets, fridge, stove and dining table. All shared rooms have north-facing open entrances to the second cross corridor. Entrance lobby at south-center of spine has a burgundy mat, mailboxes and a reception desk placed to the side leaving the route clear.
Scale: this should feel IMMENSE, a whole dormitory FLOOR with long walkable corridors and spacious separate rooms. A structural map approximately3200x2432game units, furniture kept at believable small scale relative to corridors. No people so all circulation is visible.
Camera: high orthographic overhead2D RPG, near vertical view, horizontal/vertical walls aligned exactly to frame, short north wall facades, cutaway partitions that let the floor plan be read. No isometric diamonds, no perspective vanishing points or horizon. Entire floor visible uncropped in a landscape4:3image, dark charcoal outside the footprint. Clear open passage at EVERY doorway, all corridors connected, no furniture blocking entrances. Restrained warm afternoon light, upper exterior windows.
Constraints: authored pixel-art game architecture, not a web dashboard, no UI, no text labels, no room-number writing, no letters, no watermark. No photorealism or blurry painting. A coherent large dormitory concept that will be recreated using modular background materials and separate transparent furniture sprites.
```

### materials

```text
Use case: stylized-concept. Asset type: production material atlas for the actual playable South Residence RPG interior. Reference image 1 is style reference only, not edit target. Create a square opaque texture atlas, EXACTLY FOUR SQUARE quadrants in a precise 2 by 2 grid with equal cells, no margins, no separators, no perspective, no objects, no text. Top left: seamless warm honey oak floor with fine narrow horizontal wood planks and subtle variation. Top right: seamless elegant warm ivory limestone floor with modest square tile joints, quiet neutral shading. Bottom left: seamless slate grey small square laundry floor tiles. Bottom right: a burgundy textile carpet tile with tiny restrained gold woven pattern, seamless on all edges, no outer border. Fine, crisp 32-bit Japanese school RPG painted pixel craft matching reference, natural readable material texture, not noisy. All materials strictly flat overhead orthographic, no gradient light, no cast shadows, no bevel frames. Four square texture cells fill their entire quadrants edge to edge.
```

### architecture

```text
Use case: stylized-concept. Production transparent architectural sprite atlas for the playable South Residence. Image 1 is style reference only. Square sheet, exact 2 by 2 grid of four equal cells, generous transparent gutters so each asset entirely isolated inside its own cell. Fine crisp Japanese school RPG 32-bit painted pixel craft, warm walnut and ivory plaster, dark stone wall caps, consistent orthographic top-down with modest front faces matching reference, no isometric diagonals. TOP LEFT: one long horizontal straight cutaway interior wall module, thin dark grey stone top cap, ivory plaster above walnut wainscot, flat frontal surface, seamless left/right ends without posts; wide and shallow. TOP RIGHT: one tall narrow VERTICAL cutaway wall module as seen from directly above, dark stone cap, ivory inner edge, walnut skirting, seamless top/bottom ends; tall and slender. BOTTOM LEFT: one ornate but restrained double-pane dorm window with warm walnut frame, ivory curtains, cool glass highlights, front elevation matching the north wall. BOTTOM RIGHT: one OPEN dormitory doorway with walnut jambs, no door leaf blocking the opening, entirely transparent center, limestone threshold only at bottom. Doorway wide enough for character to walk through. No ground behind any of these four assets. No floor, no labels, no numbers, no text, no cast shadow outside cells. Actual transparent background.
```

### bedroom

```text
Use case: stylized-concept. Asset type: transparent production sprite atlas of student bedroom furniture for a playable Japanese school RPG. Reference image 1 is style reference, not an edit target. EXACT three columns and two rows of SIX equal rectangular cells, landscape 3:2 sheet. Every sprite isolated and fully contained in its own cell with at least 10% transparent gutters. All six furniture pieces same camera: orthographic overhead with small visible south/front faces, no isometric diagonal angles; finely detailed crisp 32-bit painted pixel craft, warm walnut, matching reference. Top row from left to right: a single bed with walnut frame, white pillow at NORTH/top, blue-grey neatly folded duvet, footboard south; a single bed identical design with sage green duvet; a single bed identical design with burgundy duvet. Bottom row from left to right: one walnut student writing desk facing south, closed books, notebook, pen cup, small lamp, no chair; one tall walnut two-door wardrobe with brass handles, visible top surface; one low walnut bedside cabinet with a dark smartphone and a small ceramic cup on top. Beds are long north-south and viewed from above, do not turn sideways. No room, no walls, no rugs, no floor, no people, no text, no border, no labels. Real transparent background. Distinct natural textures, sharp silhouettes, no broad blurry shadows.
```

### lounge

```text
Use case: stylized-concept. Production transparent furniture sprites for the common lounge and reception of South Residence. Reference image 1 is style reference only. Landscape 3:2 sheet with SIX assets in EXACT three columns and two rows of equal cells. Every object fully inside its cell with generous 12% empty transparent gutters; objects must not cross the cell boundaries. Fine crisp Japanese school RPG painted pixel craft, camera orthographic overhead with small south-facing fronts, no isometric angles. Top left: one wide three-seat sage green fabric sofa, walnut legs, two subtly different cushions. Top middle: one matching single armchair. Top right: one low rectangular walnut coffee table, small plant and two closed books, practical open space. Bottom left: a low wide walnut TV console, modern flat dark television on top, all viewed from above. Bottom middle: a compact residence reception counter oriented VERTICALLY along north-south, long narrow footprint, writing pad, brass bell and dark office phone on its top, south/front modest visible faces. Bottom right: a small walnut bank of six brass-trimmed mailboxes, front facing south, neatly aligned cubby doors with tiny unreadable blank number plates. No floor, no rugs, no walls, no people, no text, no UI, no labels, no background shadows. Truly transparent cutouts with sharp edges, no halo.
```

### utilities

```text
Use case: stylized-concept. Production transparent utility-room sprite atlas for the playable South Residence dormitory. Reference image 1 is a style reference only. EXACT 2 by 2 grid on a square sheet, FOUR isolated compact furniture groups fully contained within their quadrant with generous transparent gutters, no overlapping cells. Fine crisp Japanese school RPG 32-bit painted pixel craft, orthographic overhead with small visible front faces, no isometric diagonal perspective. Top left: a straight horizontal bank of THREE front-loading washing machines, pale ivory metal, round dark glass doors, a folded towel and small detergent bottle on the top. Top right: a horizontal compact walnut kitchen counter, light stone worktop, metal sink on left, two-burner induction hob on right, neat utensils and one pot, cabinets beneath, no refrigerator. Bottom left: a compact communal bathroom fixture group, one white toilet with cistern on left and a square shower cubicle on right, muted grey floor pan only within cubicle, lightly frosted glass, brass fittings, no surrounding room floor. Bottom right: one ivory refrigerator with separate freezer compartment, viewed from above with front facing south, simple magnets, no readable writing. Keep recognizable practical utility equipment. No floors outside the fixtures, no walls, no room background, no people, no text, no labels, no gridlines. True alpha transparent background, sharp edges, no colored halo.
```

