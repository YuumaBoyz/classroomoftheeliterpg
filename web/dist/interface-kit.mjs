// Small, code-native illustrations and UI fragments shared by non-phone interfaces.
export const itemArt=id=>`<img class="item-art" src="assets/ui-items/${id}.svg" alt="" draggable="false">`;
export const avatar=(id='player',className='')=>`<span class="actor-avatar ${className}" aria-hidden="true"><img src="assets/sprites/${id}/down-idle.png" alt="" draggable="false"></span>`;
export const ITEM_CATEGORIES={drink:'consumables',tea:'consumables',cards:'study',gift:'gifts',kit:'study'};
export const ITEM_LABELS={drink:'ÉNERGIE',tea:'CALME',cards:'CONCENTRATION',gift:'AFFINITÉ',kit:'PRÉSENTATION'};
