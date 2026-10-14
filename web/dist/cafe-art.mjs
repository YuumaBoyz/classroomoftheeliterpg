// Separate ImageGen furniture derived from the Sakura room concept.
const src=name=>`assets/cafe-v7/${name}.png`;
const footprint=o=>[o.x,o.y,o.w,o.h];
export const CAFE_ART=Object.freeze({
 cafeCounter:{src:src('counter'),frame:footprint},
 cafeTableCoffee:{src:src('seating'),cell:[0,0,.5,.5],frame:footprint},
 cafeTableTea:{src:src('seating'),cell:[.5,0,.5,.5],frame:footprint},
 cafeChairNorth:{src:src('seating'),cell:[0,.5,.5,.5],frame:footprint},
 cafeChairSouth:{src:src('seating'),cell:[.5,.5,.5,.5],frame:footprint},
 cafeBanquette:{src:src('banquette'),frame:footprint},
 cafeVending:{src:src('props'),cell:[0,0,.5,.5],frame:footprint},
 cafeShop:{src:src('props'),cell:[.5,0,.5,.5],frame:footprint},
 cafePlants:{src:src('props'),cell:[0,.5,.5,.5],frame:footprint},
 cafeChalkboard:{src:src('props'),cell:[.5,.5,.5,.5],frame:footprint}
});
export const CAFE_GROUND=Object.freeze({
 src:src('room'),opaque:true,
 floor:[168/1484,190/1060,1375/1484,912/1060],
 // Align the concept's doorway exactly with the south-center playable threshold.
 centerX:742/1484
});
