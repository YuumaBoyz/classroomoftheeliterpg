# HUD v2 — Habillage ImageGen

Générés le 13 octobre 2026 avec l’outil **ImageGen intégré**, puis copiés dans les assets du jeu. Les originaux ont été conservés. Aucun mode CLI/API n’a été utilisé.

- [Cadre de panneau](../../web/dist/assets/hud-panel-v2.png) : 1536 × 1024, opaque.
- [Blason](../../web/dist/assets/hud-crest-v2.png) : 1254 × 1254, canal alpha transparent.
- [Aperçu bureau](apercu-bureau.png) : 1280 × 720.
- [Aperçu mobile](apercu-mobile.png) : 390 × 844.

Le cadre est affiché en neuf tranches dans `web/dist/hud.css`, avec des coins de taille fixe. Le calendrier, l’objectif, le profil, les menus et la mini-carte partagent le même habillage. Le texte et les jauges sont du HTML dynamique. Le stress possède désormais sa propre jauge ; le blason ouvre le profil et le solde ouvre le portefeuille. La barre d’objectif indique les jours écoulés de la semaine, pas le taux de réussite de l’examen.

Vérification : 11 tests de règles réussis, syntaxe JavaScript valide, inspection visuelle à 1280 × 720, 390 × 844 et 320 × 568, ouverture du profil et du portefeuille depuis leurs nouveaux boutons.

## Prompt final — Cadre

```text
Use case: stylized-concept
Asset type: production-ready 9-slice HUD panel skin for a 2D Japanese elite-school social RPG, NOT a screenshot or mockup.
Primary request: ONE single blank rectangular UI panel, straight orthographic front view, landscape 3:2 composition. The panel fills the entire image edge to edge; perfectly sharp rectangular outer boundary, no surrounding margin. Premium restrained academic design: very dark midnight navy enamel interior, subtle fine paper grain, thin champagne-gold double-line border, four tiny exquisitely engraved geometric corners, restrained burgundy inset line, small art deco diamond detail at each corner. Fine lines, refined precision, calm understated prestige.
Composition: all ornamental details and all gold lines must stay inside the outermost 7 percent of the image on each side. The entire central 86 percent is completely blank, nearly uniform dark navy (#13232f), with only very subtle material grain. Corners are identical and symmetrical. Top and bottom middle edges straight, no crest, no centered ornament, no gradient bright spots. This asset will be sliced into nine regions in CSS; edges stretch, corners must stay intact.
Materials/textures: matte dark lacquer, hairline brushed champagne metal, subtle wine-red edge. Polished Japanese social-strategy RPG interface, sophisticated, never medieval fantasy.
Text: NONE. No letters, no numbers, no icons, no symbols in the center, no characters, no pictorial scenery, no buttons, no drop shadow outside the panel, no watermark.
Opaque background. Single usable blank UI panel texture only.
```

## Prompt final — Blason

```text
Use case: stylized-concept
Asset type: one transparent production HUD crest, original elite Japanese school social RPG.
Primary request: one elegant small academic blazer badge: a symmetrical burgundy enamel shield with a champagne-gold rim, one refined interlocking geometric diamond motif in the center, two tiny stylized ginkgo branches hugging the lower shield, sophisticated art deco school-uniform insignia. Polished but restrained, thin engraved metal, rich crimson enamel, compact readable silhouette at 64 pixels tall.
Composition: the single shield occupies 80 percent of a square image, centered, fully visible, front view orthographic, no perspective. True transparent background outside the badge. Clean crisp silhouette. No surrounding plaque, no ground, no scene, no cast shadows outside, no extra icons.
Text: NONE. Absolutely no letters, numbers, words, logos, or watermark. No crowns, weapons, swords, fantasy objects. Original academic insignia for a dark-navy / burgundy / champagne HUD.
```

