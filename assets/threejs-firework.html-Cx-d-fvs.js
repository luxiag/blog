import{S as Z,P as O,aC as $,a as y,D as I,W as H,aD as U,T as N,m as K,q as P,r as f,aT as k,ac as C,C as _,aU as T,aV as b,aW as Q}from"./three.module-DElcEsb7.js";import{g as M}from"./index-DjKJqAo0.js";import{O as F}from"./OrbitControls-COOjmuLA.js";import{R as z}from"./RGBELoader-CbWxVjwZ.js";import{G as A}from"./GLTFLoader-Def6ni-K.js";import{W as G}from"./Water2-Ek810xfd.js";import{_ as X,i as L,l as j,c as Y,d as E,o as ee}from"./app-xakek6kx.js";const R=`
uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}

`,W=`
attribute vec3 aStep;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.xyz += (aStep*uTime);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;
    // 设置顶点大小
    gl_PointSize =uSize;   
}
`,B=`

uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}

`,q=`

attribute float aScale;
attribute vec3 aRandom;
uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.xyz+=aRandom*uTime*10.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;

    // 设置顶点大小
    gl_PointSize =uSize*aScale-(uTime*20.0);
    
}
`,te={__name:"threejs-firework.html",setup(D,{expose:g}){g();const l=L();class S{constructor(o,a,n={x:0,y:0,z:0}){this.color=new K(o),this.startGeometry=new P;const i=new Float32Array(3);i[0]=n.x,i[1]=n.y,i[2]=n.z,this.startGeometry.setAttribute("position",new f(i,3));const h=new Float32Array(3);h[0]=a.x-n.x,h[1]=a.y-n.y,h[2]=a.z-n.x,this.startGeometry.setAttribute("aStep",new f(h,3)),this.startMaterial=new y({vertexShader:W,fragmentShader:R,transparent:!0,blending:k,depthWrite:!1,uniforms:{uTime:{value:0},uSize:{value:20},uColor:{value:this.color}}}),this.startPoint=new C(this.startGeometry,this.startMaterial),this.clock=new _,this.fireworkGeometry=new P,this.FireworksCount=180+Math.floor(Math.random()*180);const u=new Float32Array(this.FireworksCount*3),c=new Float32Array(this.FireworksCount),m=new Float32Array(this.FireworksCount*3);for(let t=0;t<this.FireworksCount;t++){u[t*3+0]=a.x,u[t*3+1]=a.y,u[t*3+2]=a.z,c[t]=Math.random();let r=Math.random()*2*Math.PI,s=Math.random()*2*Math.PI,e=Math.random();m[t*3+0]=e*Math.sin(r)+e*Math.sin(s),m[t*3+1]=e*Math.cos(r)+e*Math.cos(s),m[t*3+2]=e*Math.sin(r)+e*Math.cos(s)}this.fireworkGeometry.setAttribute("position",new f(u,3)),this.fireworkGeometry.setAttribute("aScale",new f(c,1)),this.fireworkGeometry.setAttribute("aRandom",new f(m,3)),this.fireworksMaterial=new y({uniforms:{uTime:{value:0},uSize:{value:0},uColor:{value:this.color}},transparent:!0,blending:k,depthWrite:!1,vertexShader:q,fragmentShader:B}),this.fireworks=new C(this.fireworkGeometry,this.fireworksMaterial),this.linstener=new T,this.linstener1=new T,this.sound=new b(this.linstener),this.sendSound=new b(this.linstener1);const p=new Q;p.load(`/assets/audio/pow${Math.floor(Math.random()*4)+1}.ogg`,t=>{this.sound.setBuffer(t),this.sound.setLoop(!1),this.sound.setVolume(1)}),p.load("/assets/audio/send.mp3",t=>{this.sendSound.setBuffer(t),this.sendSound.setLoop(!1),this.sendSound.setVolume(1)})}addScene(o,a){o.add(this.startPoint),o.add(this.fireworks),this.scene=o}update(){const o=this.clock.getElapsedTime();if(o>.2&&o<1)!this.sendSound.isPlaying&&!this.sendSoundplay&&(this.sendSound.play(),this.sendSoundplay=!0),this.startMaterial.uniforms.uTime.value=o,this.startMaterial.uniforms.uSize.value=20;else if(o>.2){const a=o-1;if(this.startMaterial.uniforms.uSize.value=0,this.startPoint.clear(),this.startGeometry.dispose(),this.startMaterial.dispose(),!this.sound.isPlaying&&!this.play&&(this.sound.play(),this.play=!0),this.fireworksMaterial.uniforms.uSize.value=20,this.fireworksMaterial.uniforms.uTime.value=a,a>5)return this.fireworksMaterial.uniforms.uSize.value=0,this.fireworks.clear(),this.fireworkGeometry.dispose(),this.fireworksMaterial.dispose(),this.scene.remove(this.fireworks),this.scene.remove(this.startPoint),"remove"}}}const w=()=>{const d=new Z,o=new O(90,2,.1,1e3);d.add(o),new z().loadAsync("/assets/textures/hdr/2k.hdr").then(r=>{r.mapping=$,d.background=r,d.environment=r});const n=new y({vertexShader:`
  
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    vPosition = modelPosition;
    gPosition = vec4( position, 1.0 );
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    

}

  `,fragmentShader:`
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main(){
    vec4 redColor = vec4(1,0,0,1);
    vec4 yellowColor = vec4(1,1,0.5,1);
    vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);
    if(gl_FrontFacing){
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
        // gl_FragColor = vec4(1,1,1,1);
    }else{
        gl_FragColor = vec4(mixColor.xyz,1);
    }
}
  `,uniforms:{},side:I}),i=new H;i.outputEncoding=void 0,i.toneMapping=U,i.toneMappingExposure=.1;const h=new A;let u=null;h.load("/assets/model/newyears_min.glb",r=>{const s=new(void 0)(100,100);let e=new G(s,{scale:4,textureHeight:1024,textureWidth:1024});e.position.y=1,e.rotation.x=-Math.PI/2,d.add(e)}),h.load("/assets/model/flyLight.glb",r=>{u=r.scene.children[0],u.material=n;for(let s=0;s<150;s++){let e=r.scene.clone(!0),x=(Math.random()-.5)*300,J=(Math.random()-.5)*300,V=Math.random()*60+5;e.position.set(x,V,J),M.to(e.rotation,{y:2*Math.PI,duration:10+Math.random()*30,repeat:-1}),M.to(e.position,{x:"+="+Math.random()*5,y:"+="+Math.random()*20,yoyo:!0,duration:5+Math.random()*10,repeat:-1}),d.add(e)}}),i.setSize(l.value.offsetWidth,l.value.offsetWidth/2),l.value.appendChild(i.domElement),window.addEventListener("resize",()=>{i.setSize(l.value.offsetWidth,l.value.offsetWidth/2),i.setPixelRatio(window.devicePixelRatio)});const c=new F(o,i.domElement);c.enableDamping=!0;const m=new _;let p=[];function t(r){c.update(),m.getElapsedTime(),p.forEach((s,e)=>{s.update()=="remove"&&p.splice(e,1)}),requestAnimationFrame(t),i.render(d,o)}t()};j(()=>{w()});const v={fireworkRef:l,startPointFragment:R,startPointVertex:W,fireworksFragment:B,fireworksVertex:q,Fireworks:S,initFireWorkRef:w,ref:L,onMounted:j,get THREE(){return N},get gsap(){return M},get OrbitControls(){return F},get RGBELoader(){return z},get GLTFLoader(){return A},get Water(){return G}};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}},oe={ref:"fireworkRef"};function ie(D,g,l,S,w,v){return ee(),Y("div",null,[g[0]||(g[0]=E("p",null,"参考：https://threejs.org/",-1)),E("div",oe,null,512)])}const ue=X(te,[["render",ie],["__file","threejs-firework.html.vue"]]),me=JSON.parse('{"path":"/threejs/threejs-firework.html","title":"ThreeJS烟火","lang":"en-US","frontmatter":{"title":"ThreeJS烟火","category":["ThreeJS"],"date":"2022-03-13T00:00:00.000Z","description":"参考：https://threejs.org/","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/threejs/threejs-firework.html"}],["meta",{"property":"og:title","content":"ThreeJS烟火"}],["meta",{"property":"og:description","content":"参考：https://threejs.org/"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-11-03T04:27:20.000Z"}],["meta",{"property":"article:published_time","content":"2022-03-13T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-03T04:27:20.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ThreeJS烟火\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-03-13T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-03T04:27:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[],"git":{"createdTime":1682066702000,"updatedTime":1730608040000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":5},{"name":"卢祥","email":"example@qq.com","commits":2}]},"readingTime":{"minutes":3.91,"words":1173},"filePathRelative":"threejs/threejs-firework.md","localizedDate":"March 13, 2022","excerpt":"<p>参考：https://threejs.org/</p>\\n<div ref=\\"fireworkRef\\"></div>\\n","autoDesc":true}');export{ue as comp,me as data};
