# Résidence sud — portes, intimité, armoires et sommeil

## Comportement livré

Les treize pièces (huit chambres et cinq espaces communs) ont chacune une porte. Le contenu de la pièce occupée est visible ; toutes les autres sont couvertes par un plafond opaque. Les couloirs restent visibles. Ce filtrage concerne le sol, les tapis, les meubles, les PNJ, leurs ombres, les interactions et le plan. Ouvrir une porte ne révèle pas la pièce : il faut franchir le seuil. Quitter la pièce la masque à nouveau.

Les portes ont trois états persistants : ouvertes, fermées, fermées à clé. Une porte fermée bloque les déplacements à pied, au clic et les PNJ. On ne peut pas fermer sur un occupant, verrouiller une porte ouverte, ni déverrouiller sans la bonne clé. Le trousseau de cette démo contient les treize clés pour garder toutes les pièces explorables. Le plan amène maintenant à la porte, sans contourner sa serrure.

Les huit armoires s’ouvrent et se ferment. Leur rangement est séparé du sac : déposer ou reprendre un objet transfère réellement une unité, sans création ni suppression. Chaque armoire a 24 places et les limites du sac restent actives. Les clés, portes et objets rangés sont sauvegardés, y compris après une nuit.

Le lit personnel de la chambre 106 propose : s’allonger sans coût, se lever avec E ou un déplacement, faire une sieste une fois par jour (1 créneau, énergie +25 plafonnée à 100, stress −12 plafonné à 0), ou dormir jusqu’au lendemain avec le système de nuit existant. Le vendredi conserve son blocage tant que l’examen n’est pas passé. Le réveil reste dans la chambre 106.

## Asset ImageGen

Mode : **ImageGen intégré**. [Atlas livré](../../web/dist/assets/residence-v9/interactions.png) : une porte fermée et une armoire ouverte, dérivées des références architecturales et mobilières existantes. [Lit occupé](../../web/dist/assets/residence-v9/resting-bed.png) : le joueur réellement allongé sous la couette, dérivé du lit et de son sprite. PNG natifs avec alpha, copiés sans retouche, réduction ni recompression. Originaux conservés sous `exec-a43992cb-7863-408f-b91d-705d34cddc7e.png` et `exec-79eb6dc3-0806-48db-ad5e-d47fd79abf1a.png` dans le dossier de génération. Le plafond utilise un fragment opaque du parement de pierre ImageGen déjà livré.

### Prompt exact

```text
Use case: stylized-concept. Asset type: two native transparent game sprites for South Residence. Input image 1 is architectural style reference; input image 2 is furniture style reference. Neither is an edit target. A landscape sheet with exactly TWO separated sprites side by side, generous transparent space between them. LEFT HALF: the same walnut dorm doorway as bottom right of image 1, same ivory plaster jambs, walnut wainscot, dark charcoal stone cap, identical front orthographic shape and proportions, but now CLOSED with a solid walnut paneled door leaf filling the opening and a small brass handle and keyhole on the right. Must read as an actual closed opaque door, no window. RIGHT HALF: the same walnut wardrobe as bottom middle of image 2, identical tall cabinet proportions and small top surface, but its two wooden doors are open revealing tidy folded linens on shelves and a few hanging school uniforms. No character, no floor, no room, no text, no labels, no gridlines, no shadow or colored halo outside sprites. Fine crisp Japanese school RPG 32-bit painted pixel craft; orthographic overhead with visible south-facing fronts, never isometric. Real alpha transparent background. Each sprite wholly contained in its half and not touching sheet edges.
```

### Prompt exact — lit occupé

```text
Use case: stylized-concept. Production transparent game sprite. Reference 1 is the existing furniture design, specifically the blue duvet single bed in its TOP LEFT cell. Reference 2 is the exact player character identity. Generate ONE isolated occupied version of that blue bed, full bed visible, long axis strictly north-south, pillow at north/top, walnut headboard and footboard exactly matching reference 1. The same small chibi male student from reference 2 is lying flat on his back SLEEPING in the bed: tousled brown hair, eyes gently CLOSED, head rests on the white pillow at top, head and a little burgundy collar above the blue duvet, body and legs covered by the duvet, arms relaxed under blanket. He must clearly be lying under the bedding, never sitting, never standing. Match reference 2 face, hair, proportions and sharp painted pixel sprite look. Match reference 1 bed walnut, blue-grey stitched duvet and white pillow, perspective orthographic overhead with small south-facing footboard, no isometric tilt. Whole bed occupies a tall narrow silhouette with ample transparent margin, portrait composition. No ground, no room, no extra furniture, no letters, no Z symbols, no icons, no UI. Real transparent alpha, sharp edges without a halo.
```

## Captures réelles

- [Couloirs et pièces masquées](couloirs-pieces-masquees.png)
- [Chambre occupée dévoilée](chambre-devoilee.png)
- [Porte fermée à clé](serrure.png)
- [Rangement dans une armoire](armoire-rangement.png)
- [Choix de repos](lit-options.png)
- [Joueur sous la couette en jeu](repos-en-jeu.png)
- [Sieste limitée à une par jour](sieste-limitee.png)
- [Réveil au jour suivant](reveil-jour-suivant.png)

## Validation

88 tests passent, dont dix tests des nouveaux systèmes : treize portes, collision et navigation avec serrures, PNJ bloqués, masquage du monde et du plan, plafonds opaques, huit armoires et transferts persistants, validation des sauvegardes, sieste et nuit, sprites natifs avec alpha. Vérification visuelle dans le navigateur : serrure verrouillée puis déverrouillée, franchissement du seuil et remasquage ; armoire ouverte et transfert aller-retour d’un objet ; joueur sous la couette puis relevé ; sieste consommant un créneau et désactivée après usage ; nuit terminée avec réveil au jour suivant dans la chambre 106. Les vérifications de rangement et sommeil utilisent une partie synthétique séparée sur localhost. Aucune erreur ni alerte console pendant le contrôle final.

