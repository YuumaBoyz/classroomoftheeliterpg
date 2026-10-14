// Decode a fresh blob to avoid empty/corrupt browser cache entries after asset updates.
export async function loadArtwork(path){
 for(let attempt=0;attempt<2;attempt++){
  try{
   const response=await fetch(path,{cache:'no-store'});
   if(!response.ok)throw Error(`${path} : HTTP ${response.status}`);
   const url=URL.createObjectURL(await response.blob()),image=new Image();
   try{image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}
  }catch(error){if(attempt===1)throw error;}
 }
}
