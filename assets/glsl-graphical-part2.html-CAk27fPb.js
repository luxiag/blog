import{S as Q,V as X,P as Y,a as ss,D as ns,M as as,b as ls,W as es,O as z,T as os,C as ps}from"./OrbitControls-BJWANvCS.js";import{_ as ts,i as a,l as H,c as rs,a as l,d as e,o as Fs}from"./app-Dlgm_vOi.js";const cs={__name:"glsl-graphical-part2.html",setup(J,{expose:s}){s();const n=r=>{const F=new Q,$=new ps,p={u_time:{type:"f",value:1},uTime:{type:"f",value:1},u_resolution:{type:"v2",value:new X}},t=new Y(75,2,.1,1e3);t.position.set(0,0,10),F.add(t);const I=new ss({uniforms:p,fragmentShader:r.fragmentShader,vertexShader:`
        precision lowp float;
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        }
        `,side:ns}),K=new as(new ls(10,10),I);F.add(K);const o=new es;o.setSize(r.shaderDom.value.offsetWidth,r.shaderDom.value.offsetWidth/2),o.shadowMap.enabled=!0,r.shaderDom.value.appendChild(o.domElement),o.render(F,t);const j=new z(t,o.domElement);j.enableDamping=!0,p.u_resolution.value.x=o.domElement.width,p.u_resolution.value.y=o.domElement.height;function N(){p.u_time.value+=$.getDelta(),p.uTime.value+=$.getDelta(),j.update(),o.render(F,t),requestAnimationFrame(N)}N()},c=a(),i={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = abs(vUv.x - 0.5) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:c},y=a(),d={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:y},v=a(),g={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:v},m=a(),u={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:m},h=a(),b={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =1.0-step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:h},C=a(),B={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:C},f=a(),A={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:f},D=a(),U={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0*floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:D},x=a(),_={fragmentShader:`
precision lowp float;
varying vec2 vUv;

void main(){
    float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:x},k=a(),S={fragmentShader:`
precision lowp float;
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
void main(){
     float strength = random(vUv);
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:k},w=a(),T={fragmentShader:`
precision lowp float;
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
void main(){
    float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
    strength = random(vec2(strength,strength));
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:w},L=a(),M={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = length(vUv);
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:L},E=a(),P={fragmentShader:`
precision lowp float;
varying vec2 vUv;

void main(){
    float strength =1.0 - distance(vUv,vec2(0.5,0.5));
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:E},G=a(),O={fragmentShader:`
precision lowp float;
varying vec2 vUv;
// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
void main(){
     float strength = 1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25) ;
     gl_FragColor =vec4(strength,strength,strength,1);


}
    `,shaderDom:G},Z=a(),q={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float strength = step(0.5,distance(vUv,vec2(0.5))+0.35) ;
     strength *= (1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25)) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:Z},R=a(),V={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float strength =  abs(distance(vUv,vec2(0.5))-0.25) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:R};H(()=>{n(i),n(d),n(g),n(u),n(b),n(B),n(A),n(U),n(_),n(S),n(T),n(M),n(P),n(O),n(q),n(V)});const W={initScene:n,part17:c,part17Shader:i,part18:y,part18Shader:d,part19:v,part19Shader:g,part20:m,part20Shader:u,part21:h,part21Shader:b,part22:C,part22Shader:B,part23:f,part23Shader:A,part24:D,part24Shader:U,part25:x,part25Shader:_,part26:k,part26Shader:S,part27:w,part27Shader:T,part28:L,part28Shader:M,part29:E,part29Shader:P,part30:G,part30Shader:O,part31:Z,part31Shader:q,part32:R,part32Shader:V,get THREE(){return os},ref:a,onMounted:H,get OrbitControls(){return z}};return Object.defineProperty(W,"__isScriptSetup",{enumerable:!1,value:!0}),W}},is={ref:"part17"},ys={ref:"part18"},ds={ref:"part19"},vs={ref:"part20"},gs={ref:"part21"},ms={ref:"part22"},us={ref:"part23"},hs={ref:"part24"},bs={ref:"part25"},Cs={ref:"part26"},Bs={ref:"part27"},fs={ref:"part28"},As={ref:"part29"},Ds={ref:"part30"},Us={ref:"part31"},xs={ref:"part32"};function _s(J,s,n,c,i,y){return Fs(),rs("div",null,[s[0]||(s[0]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",is,null,512),s[1]||(s[1]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">min</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">), </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ys,null,512),s[2]||(s[2]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">max</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">), </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">))  ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ds,null,512),s[3]||(s[3]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.2</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">max</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">), </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">)))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",vs,null,512),s[4]||(s[4]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.2</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">max</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">), </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">)))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",gs,null,512),s[5]||(s[5]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ms,null,512),s[6]||(s[6]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",us,null,512),s[7]||(s[7]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">floor</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",hs,null,512),s[8]||(s[8]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> ceil</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">ceil</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",bs,null,512),s[9]||(s[9]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;"> (vec2 </span><span style="color:#FFB86C;font-style:italic;">st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(st.xy,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">12.9898</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">78.233</span><span style="color:#F8F8F2;">)))</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">43758.5453123</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(vUv);</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Cs,null,512),s[10]||(s[10]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;"> (vec2 </span><span style="color:#FFB86C;font-style:italic;">st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(st.xy,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">12.9898</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">78.233</span><span style="color:#F8F8F2;">)))</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">43758.5453123</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> ceil</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">ceil</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(strength,strength));</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Bs,null,512),s[11]||(s[11]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">(vUv);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",fs,null,512),s[12]||(s[12]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",As,null,512),s[13]||(s[13]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Ds,null,512),s[14]||(s[14]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.35</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     strength </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Us,null,512),s[15]||(s[15]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">  abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",xs,null,512)])}const ws=ts(cs,[["render",_s],["__file","glsl-graphical-part2.html.vue"]]),Ts=JSON.parse('{"path":"/glsl/glsl-graphical-part2.html","title":"GLSL图形（二）","lang":"en-US","frontmatter":{"title":"GLSL图形（二）","date":"2022-10-08T00:00:00.000Z","category":["GLSL"],"head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/glsl/glsl-graphical-part2.html"}],["meta",{"property":"og:title","content":"GLSL图形（二）"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-10-31T11:40:02.000Z"}],["meta",{"property":"article:published_time","content":"2022-10-08T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-31T11:40:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GLSL图形（二）\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-08T00:00:00.000Z\\",\\"dateModified\\":\\"2024-10-31T11:40:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[],"git":{"createdTime":1674098925000,"updatedTime":1730374802000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":12},{"name":"卢祥","email":"example@qq.com","commits":1}]},"readingTime":{"minutes":4.34,"words":1302},"filePathRelative":"glsl/glsl-graphical-part2.md","localizedDate":"October 8, 2022","excerpt":"<div class=\\"language-glsl line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"glsl\\" data-title=\\"glsl\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#F8F8F2\\">precision lowp </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">varying</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> vUv;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">void</span><span style=\\"color:#50FA7B\\"> main</span><span style=\\"color:#F8F8F2\\">(){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">    float</span><span style=\\"color:#F8F8F2\\"> strength </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> abs</span><span style=\\"color:#F8F8F2\\">(vUv.x </span><span style=\\"color:#FF79C6\\">-</span><span style=\\"color:#BD93F9\\"> 0.5</span><span style=\\"color:#F8F8F2\\">) ;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    gl_FragColor </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\">vec4</span><span style=\\"color:#F8F8F2\\">(strength,strength,strength,</span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{ws as comp,Ts as data};
