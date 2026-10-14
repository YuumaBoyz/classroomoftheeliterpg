// Match the screen's physical pixels, including Retina / mobile densities above 2x.
export function canvasResolution(width,height,density=1){
 const dpr=Number.isFinite(density)&&density>0?density:1;
 const pixelWidth=Math.max(1,Math.round(width*dpr)),pixelHeight=Math.max(1,Math.round(height*dpr));
 return{width:pixelWidth,height:pixelHeight,scaleX:pixelWidth/Math.max(1,width),scaleY:pixelHeight/Math.max(1,height),dpr};
}

// Keep the original cutout's proportions. Layout width and floor anchor stay fixed.
export function artworkFrame(bounds,frame,anchorY=1){
 const [, ,sourceWidth,sourceHeight]=bounds,[x,y,width,height]=frame;
 const paintedHeight=width*sourceHeight/sourceWidth;
 return[x,y+(height-paintedHeight)*anchorY,width,paintedHeight];
}
