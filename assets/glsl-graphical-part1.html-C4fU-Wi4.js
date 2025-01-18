import{l as I,b as K,m as Q,n as ss,o as ns,p as as,q as ls,W as es,r as os,s as ps}from"./three.module-BzA_QsZm.js";import{O as N}from"./OrbitControls-DTSS7XTZ.js";import{_ as ts,h as a,i as V,c as rs,b as l,d as e,o as Fs}from"./app-CWCG87Uu.js";const cs={__name:"glsl-graphical-part1.html",setup(z,{expose:s}){s();const n=r=>{const F=new I,W=new ps,p={u_time:{type:"f",value:1},uTime:{type:"f",value:1},u_resolution:{type:"v2",value:new K}},t=new Q(75,2,.1,1e3);t.position.set(0,0,10),F.add(t);const H=new ss({uniforms:p,fragmentShader:r.fragmentShader,vertexShader:`
        precision lowp float;
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        }
        `,side:ns}),J=new as(new ls(10,10),H);F.add(J);const o=new es;o.setSize(r.shaderDom.value.offsetWidth,r.shaderDom.value.offsetWidth/2),o.shadowMap.enabled=!0,r.shaderDom.value.appendChild(o.domElement),o.render(F,t);const $=new N(t,o.domElement);$.enableDamping=!0,p.u_resolution.value.x=o.domElement.width,p.u_resolution.value.y=o.domElement.height;function j(){p.u_time.value+=W.getDelta(),p.uTime.value+=W.getDelta(),$.update(),o.render(F,t),requestAnimationFrame(j)}j()},c=a(),i={fragmentShader:` 
#ifdef GL_ES 
precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){ 
    gl_FragColor =vec4(vUv,0,1) ; 
} `,shaderDom:c},y=a(),d={fragmentShader:` 
#ifdef GL_ES 
precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){ 
    gl_FragColor =vec4(vUv,1,1) ; 
} `,shaderDom:y},v=a(),g={fragmentShader:`
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.x;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,shaderDom:v},m=a(),u={fragmentShader:`
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.y;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,shaderDom:m},h=a(),b={fragmentShader:`
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = 1.0-vUv.y;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,shaderDom:h},C=a(),B={fragmentShader:`
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.y * 10.0;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,shaderDom:C},f=a(),D={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //7利用通过取模达到反复效果
   float strength = mod(vUv.y * 10.0 , 1.0) ;
   gl_FragColor =vec4(strength,strength,strength,1);
}`,shaderDom:f},A=a(),U={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //8利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.5,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:A},x=a(),_={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //9利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:x},S=a(),k={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    //10利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.x * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:S},w=a(),T={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 11条纹相加
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength += step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:w},L=a(),E={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 12条纹相乘
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:L},G=a(),X={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 13条纹相减
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength -= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:G},M=a(),P={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     // 14方块图形
    float strength = step(0.2, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.2, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:M},Y=a(),q={fragmentShader:`
precision lowp float;
uniform float uTime;
varying vec2 vUv;
void main(){
    float barX = step(0.4, mod((vUv.x+uTime*0.1) * 10.0 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    //float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barY = step(0.4, mod(vUv.y * 10.0 , 1.0))*step(0.8, mod(vUv.x * 10.0 , 1.0))  ;
    float strength = barX+barY;

    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:Y},O=a(),Z={fragmentShader:`
precision lowp float;
uniform float uTime;
varying vec2 vUv;
void main(){
    float barX = step(0.4, mod((vUv.x+uTime*0.1) * 10.0 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    //float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barY = step(0.4, mod(vUv.y * 10.0 , 1.0))*step(0.8, mod(vUv.x * 10.0 , 1.0))  ;
    float strength = barX+barY;

    gl_FragColor = vec4(vUv,1,strength);
}
    `,shaderDom:O};V(()=>{n(i),n(d),n(g),n(u),n(b),n(B),n(D),n(U),n(_),n(k),n(T),n(E),n(X),n(P),n(q),n(Z)});const R={initScene:n,part1:c,part1Shader:i,part2:y,part2Shader:d,part3:v,part3Shader:g,part4:m,part4Shader:u,part5:h,part5Shader:b,part6:C,part6Shader:B,part7:f,part7Shader:D,part8:A,part8Shader:U,part9:x,part9Shader:_,part10:S,part10Shader:k,part11:w,part11Shader:T,part12:L,part12Shader:E,part13:G,part13Shader:X,part14:M,part14Shader:P,part15:Y,part15Shader:q,part16:O,part16Shader:Z,get THREE(){return os},ref:a,onMounted:V,get OrbitControls(){return N}};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}},is={ref:"part1"},ys={ref:"part2"},ds={ref:"part3"},vs={ref:"part4"},gs={ref:"part5"},ms={ref:"part6"},us={ref:"part7"},hs={ref:"part8"},bs={ref:"part9"},Cs={ref:"part10"},Bs={ref:"part11"},fs={ref:"part12"},Ds={ref:"part13"},As={ref:"part14"},Us={ref:"part15"},xs={ref:"part16"};function _s(z,s,n,c,i,y){return Fs(),rs("div",null,[s[0]||(s[0]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#BD93F9;">0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",is,null,512),s[1]||(s[1]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ys,null,512),s[2]||(s[2]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> vUv.x;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ds,null,512),s[3]||(s[3]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> vUv.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",vs,null,512),s[4]||(s[4]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">vUv.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",gs,null,512),s[5]||(s[5]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    //利用uv实现短范围内渐变</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",ms,null,512),s[6]||(s[6]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">     //7利用通过取模达到反复效果</span></span>
<span class="line"><span style="color:#FF79C6;">   float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">   gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",us,null,512),s[7]||(s[7]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">     //8利用step(edge, x)如果x &lt; edge，返回0.0，否则返回1.0</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">  mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,strength);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",hs,null,512),s[8]||(s[8]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">     //9利用step(edge, x)如果x &lt; edge，返回0.0，否则返回1.0</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">  mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">,strength);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",bs,null,512),s[9]||(s[9]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    //10利用step(edge, x)如果x &lt; edge，返回0.0，否则返回1.0</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">  mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">,strength);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Cs,null,512),s[10]||(s[10]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // 11条纹相加</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Bs,null,512),s[11]||(s[11]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // 12条纹相乘</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">*=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",fs,null,512),s[12]||(s[12]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // 13条纹相减</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">-=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Ds,null,512),s[13]||(s[13]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">     // 14方块图形</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.2</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    strength </span><span style="color:#FF79C6;">*=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.2</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",As,null,512),s[14]||(s[14]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barX </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">((vUv.x</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">uTime</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barX </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 0.2</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barY </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))  ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> barX</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">barY;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",Us,null,512),s[15]||(s[15]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barX </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">((vUv.x</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">uTime</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barX </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 0.2</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> barY </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.y </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(vUv.x </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;"> , </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">))  ;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> barX</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">barY;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,strength);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),e("div",xs,null,512)])}const Ts=ts(cs,[["render",_s],["__file","glsl-graphical-part1.html.vue"]]),Ls=JSON.parse('{"path":"/glsl/glsl-graphical-part1.html","title":"GLSL图形（一）","lang":"en-US","frontmatter":{"title":"GLSL图形（一）","date":"2022-10-07T00:00:00.000Z","category":["GLSL"],"head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/glsl/glsl-graphical-part1.html"}],["meta",{"property":"og:title","content":"GLSL图形（一）"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-10-31T11:40:02.000Z"}],["meta",{"property":"article:published_time","content":"2022-10-07T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-31T11:40:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GLSL图形（一）\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-07T00:00:00.000Z\\",\\"dateModified\\":\\"2024-10-31T11:40:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[],"git":{"createdTime":1671674066000,"updatedTime":1730374802000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":12},{"name":"卢祥","email":"example@qq.com","commits":1}]},"readingTime":{"minutes":5.36,"words":1607},"filePathRelative":"glsl/glsl-graphical-part1.md","localizedDate":"October 7, 2022","excerpt":"<div class=\\"language-glsl line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"glsl\\" data-title=\\"glsl\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#F8F8F2\\">precision lowp </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">varying</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> vUv;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">void</span><span style=\\"color:#50FA7B\\"> main</span><span style=\\"color:#F8F8F2\\">(){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    gl_FragColor </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\">vec4</span><span style=\\"color:#F8F8F2\\">(vUv,</span><span style=\\"color:#BD93F9\\">0</span><span style=\\"color:#F8F8F2\\">,</span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{Ts as comp,Ls as data};
