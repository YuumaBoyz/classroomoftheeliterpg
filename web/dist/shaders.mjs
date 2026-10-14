import {drawLocalLights} from './lighting.mjs?v=light-3';
// GPU post-processing affects the scene only; HTML controls retain their original colors.
const VERTEX=`attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FRAGMENT=`precision highp float;
varying vec2 uv; uniform sampler2D scene; uniform vec2 resolution;
uniform float outdoor; uniform float strength; uniform float warmth; uniform float exposure;
vec3 linearColor(vec2 p){return pow(max(texture2D(scene,p).rgb,vec3(0.)),vec3(2.2));}
vec3 bright(vec2 p){vec3 v=linearColor(p);return v*smoothstep(.6,.94,dot(v,vec3(.2126,.7152,.0722)));}
void main(){
 vec3 color=linearColor(uv);
 // Two bloom radii: a tight highlight and a broad, subtle optical halo.
 vec2 d=vec2(2.5)/resolution;vec3 glow=vec3(0.);
 glow+=bright(uv+d*vec2(1.,0.))+bright(uv-d*vec2(1.,0.));
 glow+=bright(uv+d*vec2(0.,1.))+bright(uv-d*vec2(0.,1.));
 glow+=.5*(bright(uv+d*vec2(5.,3.))+bright(uv+d*vec2(-5.,3.))
  +bright(uv+d*vec2(5.,-3.))+bright(uv+d*vec2(-5.,-3.)));
 color+=glow*.018*strength;
 float luminance=dot(color,vec3(.2126,.7152,.0722));
 // Sky fill is blue; direct daylight and practical lamps are warm.
 vec3 shadowTint=mix(vec3(.89,.94,1.05),vec3(.93,.96,1.04),outdoor);
 vec3 sunTint=mix(vec3(1.04,1.015,.98),vec3(1.12,1.025,.91),warmth);
 color*=mix(shadowTint,sunTint,smoothstep(.045,.65,luminance));
 color*=exposure;
 // Gentle highlight shoulder protects bright paper, skin and blossoms.
 color=color/(vec3(1.)+color*.085)*1.035;
 color=pow(max(color,vec3(0.)),vec3(1./2.2));
 vec2 p=uv-.5;float vignette=smoothstep(.18,.64,dot(p,p));
 color*=1.-vignette*.055;
 gl_FragColor=vec4(clamp(color,0.,1.),1.);
}`;

export class SceneShaders{
 constructor(source){
  this.source=source;this.canvas=document.createElement('canvas');
  this.canvas.className='scene-shaders';this.canvas.setAttribute('aria-hidden','true');
  source.after(this.canvas);this.enabled=false;
  this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.fallback();});
  this.canvas.addEventListener('webglcontextrestored',()=>this.init());
  this.init();
 }
 fallback(){this.enabled=false;this.canvas.hidden=true;this.source.style.opacity='';}
 init(){
  try{
   const gl=this.canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false});
   if(!gl)throw Error('WebGL indisponible');this.gl=gl;
   const compile=(type,code)=>{const shader=gl.createShader(type);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader;};
   const vertex=compile(gl.VERTEX_SHADER,VERTEX),fragment=compile(gl.FRAGMENT_SHADER,FRAGMENT);
   const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
   gl.deleteShader(vertex);gl.deleteShader(fragment);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
   this.program=program;gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
   const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
   this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);
   for(const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,axis,gl.CLAMP_TO_EDGE);
   for(const filter of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,filter,gl.LINEAR);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
   this.uniforms=Object.fromEntries(['scene','resolution','outdoor','strength','warmth','exposure'].map(name=>[name,gl.getUniformLocation(program,name)]));
   gl.uniform1i(this.uniforms.scene,0);this.enabled=true;
  }catch(error){console.warn('Rendu 2D conservé :',error.message);this.fallback();}
 }
 render({outdoor=false,soft=false,warmth=0,exposure=1}={}){
  if(!this.enabled)return;
  const gl=this.gl,source=this.source;
  if(gl.isContextLost()){this.fallback();return;}
  if(this.canvas.width!==source.width||this.canvas.height!==source.height){this.canvas.width=source.width;this.canvas.height=source.height;gl.viewport(0,0,source.width,source.height);}
  try{
   gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
   gl.uniform2f(this.uniforms.resolution,source.width,source.height);gl.uniform1f(this.uniforms.outdoor,outdoor?1:0);gl.uniform1f(this.uniforms.strength,soft?.35:1);
   gl.uniform1f(this.uniforms.warmth,warmth);gl.uniform1f(this.uniforms.exposure,exposure);
   gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
   this.canvas.hidden=false;source.style.opacity='0';
  }catch(error){this.fallback();}
 }
}

// Atmospheric fill is kept subtle: the ground pass already holds projected shadows.
export function drawSceneLight(c,scene,time,reduced){
 c.save();const [l,t,r,b]=scene.bounds;
 c.globalCompositeOperation='soft-light';
 const ambient=c.createLinearGradient(l,t,r,b);
 ambient.addColorStop(0,scene.outdoor?'#fff1d02b':'#c3dbee20');ambient.addColorStop(1,'#20365330');
 c.fillStyle=ambient;c.fillRect(l,t,r-l,b-t);c.restore();
 drawLocalLights(c,scene);
}
