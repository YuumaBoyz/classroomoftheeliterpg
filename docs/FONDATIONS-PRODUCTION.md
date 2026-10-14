# Fondations de production

Ce document conserve les décisions de préproduction initiales. Une première démo a depuis été réalisée **en web avec Canvas 2D**, plutôt que sous Godot : voir [le jeu web](../web/README.md) et [ses vérifications](../web/VERIFICATION.md). Les sections suivantes restent le plan d'origine ; les étapes futures et le réseau ne sont pas présentés comme implémentés.

## 1. Décision structurante

Construire d'abord une **tranche solo d'une semaine**. Le système de règles doit être indépendant de la caméra et des menus pour permettre ensuite le RP.

Moteur envisagé : Godot, dont la [documentation 2D officielle](https://docs.godotengine.org/en/stable/tutorials/2d/introduction_to_2d.html) décrit les fonctions de tuiles, sprites et animations nécessaires. La version exacte sera fixée au démarrage du prototype après vérification des plugins et plateformes.

Le [multijoueur de haut niveau](https://docs.godotengine.org/en/stable/tutorials/networking/high_level_multiplayer.html) fournit des mécanismes utiles, mais les résultats d'examen et transactions nécessiteront une logique d'autorité propre au jeu.

## 2. La tranche jouable

| Inclure | Objectif de démonstration |
| --- | --- |
| Classe, couloir, bibliothèque, cour, gymnase, chambre | Six espaces reliés et interactions lisibles |
| Huit PNJ écrits | Reina, Nao, Mika, Daichi, Sora, Yui, un rival et un professeur |
| Déplacement quatre directions | Collision, profondeur des sprites et entrées |
| Sept journées courtes | Coûts en créneaux, rendez-vous, bilan |
| Compétences utiles | Académique, observation, communication et sang-froid |
| Dialogue à conditions | Au moins trois solutions à une négociation importante |
| Relation et mémoire | Promesses et réactions après l'examen |
| Téléphone réduit | Messages, agenda, carnet, wallet et classe |
| PP et dépôt | Solde disponible, montant réservé, versement et restitution |
| Examen de confiance | Binômes, préparation, notes et score collectif |
| Sauvegarde locale | Reprise avant et après une résolution sans duplication |

Les autres élèves participent au score par des dossiers et états simulés, sans demander une scène et un portrait individuels à chacun.

À réserver pour la suite : monde complet, deux autres années, voyages, personnalisation avancée, mode réseau, voix intégrales et dialogues génératifs.

## 3. Domaine de règles

**Calendar** gère journées, créneaux, fenêtres d'événements et échéances. **Roster** conserve élèves, groupes et rangs. **Economy** gère comptes et écritures. **Relationships** mémorise axes et événements. **Knowledge** suit ce que chaque personnage connaît. **Contracts** réserve et libère les dépôts. **Exams** fige les règles et produit le résultat. **Narrative** déclenche les scènes pertinentes. **Persistence** sauvegarde les états validés.

Les services reçoivent une intention explicite et retournent un résultat : accepté, refusé avec motif, ou soumis à confirmation. Le menu n'écrit jamais directement « +1000 » dans le solde d'un personnage.

Exemple de chaîne : choix « proposer un contrat » → préparation d'une offre → affichage des champs → acceptation des deux parties → vérification du solde → réservation → événement enregistré → notification.

## 4. Modèles de données minimaux

| Entité | Champs essentiels |
| --- | --- |
| Student | id, group_id, compétences, traits, disponibilités, objectifs |
| ClassGroup | id permanent, rang courant, PC, membres, mandat, compte commun |
| Relationship | source_id, cible_id, confiance, estime, proximité, ressentiment |
| Memory | participants, type, jour, contexte, visibilité |
| KnowledgeItem | id, nature, contenu, source, date, détenteurs, fiabilité |
| Account | titulaire, solde, fonds réservés |
| LedgerEntry | id unique, compte source, compte destination, montant, motif, événement |
| Contract | parties, condition mesurable, échéance, dépôt, état |
| ExamDefinition | id, version, participants, phases, règles, barème, départage |
| ExamInstance | définition figée, inscriptions, décisions, résultats, statut |
| Scene | conditions, protagonistes, texte, choix, effets, visibilité |
| Save | version de schéma, état du monde, graine de simulation, dernier événement validé |

L'OAA éventuel est une projection publique de certains résultats, pas une copie directe des six compétences privées. Les secrets et valeurs relationnelles sont exposés selon leur visibilité, pas par défaut.

## 5. États et invariants

Contrat : brouillon → proposé → accepté → dépôt réservé → accompli ou expiré → dépôt réglé. Annuler une proposition ne déplace pas de monnaie. Un contrat réglé ne peut pas être payé à nouveau.

Examen : annoncé → inscriptions → préparation → décisions closes → résolution → publié. Les règles sont figées lors de l'annonce ; toute correction de scénario est signalée avant que les décisions ne deviennent irréversibles.

Une transaction possède un identifiant et doit être appliquée une seule fois. Un montant réservé ne peut plus être dépensé ailleurs. Tous les transferts et résultats possèdent une trace. Les frais éventuels sont une écriture explicite vers un compte institutionnel.

Un savoir n'est ajouté à un personnage qu'après observation, message ou partage explicite. Un échange privé ne devient pas public par un événement graphique sans justification.

Les lettres A–D sont dérivées des scores de groupes permanents. Une permutation de classement ne change ni les comptes ni les liens sociaux. Les égalités obéissent à la règle inscrite dans la définition de l'examen.

## 6. Scènes et cartes

Chaque lieu sépare décor, collisions, zones d'interaction, points d'entrée et points de rendez-vous. L'ordre d'affichage dépend de la position des pieds des sprites. Les bâtiments et végétaux doivent laisser lisibles les passages derrière les éléments hauts.

Prévoir une seule famille de tuiles intérieures et une extérieure pour la démo. Les concepts ImageGen servent de référence d'ambiance ; les tuiles jouables nécessitent des dimensions régulières, des bords raccordables et une palette stabilisée.

Chaque PNJ important dispose au minimum de quatre directions, trois images de marche par direction et une pose d'attente. Les portraits de la démo demandent quatre expressions : neutre, sourire, tension et inquiétude. Le générateur aide à préparer les références ; la cohérence des animations exige une reprise dédiée.

## 7. Réseau et persistance RP

La première expérience réseau vise une session privée, avec hôte autoritaire et sauvegarde de session. Les clients envoient des intentions, le serveur valide et diffuse les conséquences visibles.

Le serveur décide des soldes, dépôts, inventaires, votes, connaissances et résultats. Un client ne choisit pas son score et ne reçoit pas les secrets de tous les personnages.

Un message de commande contient identifiant, auteur, type, cible et paramètres. Les répétitions après une perte de connexion retournent le même résultat au lieu d'appliquer deux paiements.

La carte et les déplacements peuvent être synchronisés séparément des décisions importantes. Les dialogues, contrats et examens utilisent des états confirmés. Une reconnexion reconstruit l'état visible du personnage et ses opérations déjà validées.

Le calendrier RP emploie une horloge partagée par phase. Les échéances préviennent les participants. Les règles de remplacement et mandat d'absence sont enregistrées avant l'examen.

Un serveur dédié et des services de comptes seraient une étape ultérieure. Leur exploitation, leur coût et leur fiabilité ne sont pas évalués par ce dossier.

## 8. Lots de production

| Lot | Livrable | Critère pour passer à la suite |
| --- | --- | --- |
| 0 — Préproduction | Bible, recherche, quatre concepts | Boucle et premier examen compréhensibles |
| 1 — Exploration | Deux pièces, déplacement, collision, interaction | Un joueur rejoint un rendez-vous sans guidage oral |
| 2 — Journée sociale | Six lieux, agenda, dialogues, carnet | Trois activités ont des coûts et des effets différents |
| 3 — Économie | Comptes, dépôt, conditions, sauvegarde | Aucun paiement doublé lors d'une reprise |
| 4 — Examen | Binômes, score, PC, mémoire relationnelle | Victoire et défaite donnent toutes deux une suite jouable |
| 5 — Démo | Semaine complète, portraits et son minimal | Deux parcours différents sont achevables sans blocage |
| 6 — Année 1 | Chapitres, autres examens, progression | Les variantes utilisent le domaine commun sans réécrire tout le moteur |
| 7 — RP privé | Serveur de session, chat, votes, déconnexion | Deux clients retrouvent le même résultat et gardent leurs informations privées |

Ces lots définissent un ordre de travail, pas un calendrier promis. Une estimation devient crédible après mesure du temps nécessaire à produire une journée et une scène complète.

## 9. Validation utile du prototype

Faire jouer quelques personnes sans leur expliquer les réponses souhaitées. Vérifier qu'elles savent pourquoi elles choisissent un partenaire, ce que leur contrat garantit et comment leur résultat affecte la classe.

Cibles provisoires : débuter un premier échange en moins de cinq minutes ; comprendre PP / PC avant l'examen ; ne pas passer plus d'un quart de la session en trajets routiniers ; expliquer au moins deux conséquences de ses décisions dans le bilan.

Les tests de règles porteront sur les points fragiles : conservation des fonds lors des transferts, dépôts non dépensables, résolution unique d'un contrat, classement avec égalité, absence d'une information non transmise, sauvegarde pendant une phase et reprise après déconnexion. Ils sont prévus pour l'implémentation, pas présentés comme déjà passés.

Une défaite doit rester intéressante. Si les testeurs rechargent chaque échange, revoir la lisibilité des intentions, les suites de l'échec et la pression économique avant d'ajouter du contenu.

## 10. Risques concrets de conception

**Trop de personnages.** Réponse : écrire huit élèves pour la démo, puis mesurer le coût réel avant de viser seize trajectoires principales.

**Le jeu devient un tableur.** Réponse : les nombres détaillés vivent dans les bilans ; la vie du campus exprime les conséquences par des personnes et des lieux.

**Une stratégie domine tout.** Réponse : rendre les compétences complémentaires et les contraintes d'équipe observables ; éviter que charisme ou richesse remplacent toutes les autres solutions.

**Le RP exige trop de présences simultanées.** Réponse : phases annoncées, PNJ de complément, remplacement et mandats d'absence limités.

**Les concepts promettent trop.** Réponse : convertir un seul intérieur en vraie carte jouable, puis valider lisibilité et cadence avant de produire tous les décors.

**Les secrets semblent arbitraires.** Réponse : sources, indices redondants et propagation explicite. La surprise doit pouvoir être comprise après coup.

## 11. État de ce dossier

La bible, les sources, les prompts et quatre concepts constituent les livrables de préproduction. La démo web ajoute désormais exploration, dialogues, activités, économie, contrats, sauvegarde, examen et épilogue. Le réseau et les années suivantes restent à développer ; l'équilibrage demande encore des retours de joueurs.
