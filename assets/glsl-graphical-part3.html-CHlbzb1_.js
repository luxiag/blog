import{l as Q,a as X,m as Y,n as ss,o as ns,p as as,q as ls,W as os,r as ps,s as es}from"./three.module-_5Kft3IB.js";import{O as N}from"./OrbitControls-86TszHm5.js";import{_ as Fs,e as cs,g as l,f as o,r as a,i as V,o as rs}from"./app-BcLUFOMF.js";const ts={__name:"glsl-graphical-part3.html",setup(H,{expose:s}){s();const n=c=>{const r=new Q,W=new es,e={u_time:{type:"f",value:1},uTime:{type:"f",value:1},u_resolution:{type:"v2",value:new X}},F=new Y(75,2,.1,1e3);F.position.set(0,0,10),r.add(F);const J=new ss({uniforms:e,fragmentShader:c.fragmentShader,vertexShader:`
        precision lowp float;
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        }
        `,side:ns}),K=new as(new ls(10,10),J);r.add(K);const p=new os;p.setSize(c.shaderDom.value.offsetWidth,c.shaderDom.value.offsetWidth/2),p.shadowMap.enabled=!0,c.shaderDom.value.appendChild(p.domElement),p.render(r,F);const $=new N(F,p.domElement);$.enableDamping=!0,e.u_resolution.value.x=p.domElement.width,e.u_resolution.value.y=p.domElement.height;function j(){e.u_time.value+=W.getDelta(),e.uTime.value+=W.getDelta(),$.update(),p.render(r,F),requestAnimationFrame(j)}j()},t=a(),i={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:t},y=a(),v={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = 1.0 - step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:y},d=a(),m={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    vec2 waveUv = vec2(
        vUv.x,
        vUv.y+sin(vUv.x*30.0)*0.1
    );
    float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25))   ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:d},u=a(),g={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     vec2 waveUv = vec2(
         vUv.x+sin(vUv.y*30.0)*0.1,
         vUv.y+sin(vUv.x*30.0)*0.1
     );
     float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25))   ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:u},C=a(),b={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     vec2 waveUv = vec2(
         vUv.x+sin(vUv.y*100.0)*0.1,
         vUv.y+sin(vUv.x*100.0)*0.1
     );
     float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25))   ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:C},B=a(),f={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float angle = atan(vUv.x,vUv.y);
    float strength = angle;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:B},x=a(),h={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float angle = atan(vUv.x-0.5,vUv.y-0.5);
     float strength = (angle+3.14)/6.28;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:x},A=a(),D={fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
    float angle = atan(vUv.x-0.5,vUv.y-0.5);
    float strength = (angle+3.14)/6.28;
    gl_FragColor =vec4(strength,strength,strength,alpha);

}
    `,shaderDom:A},_=a(),U={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
void main(){
    //  vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
     vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
     float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
     float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
     float strength = (angle+3.14)/6.28;
     gl_FragColor =vec4(strength,strength,strength,alpha);

}
    `,shaderDom:_},w=a(),P={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
    float strength = mod(angle*10.0,1.0);

    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:w},z=a(),k={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
    float strength = sin(angle*100.0);
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:z},S=a(),T={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main(){
    float strength = noise(vUv);
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:S},L=a(),E={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main(){
    float strength = step(0.5,noise(vUv * 100.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:L},M=a(),G={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
// 噪声函数
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main(){
    float strength = sin(cnoise(vUv * 10.0)*5.0+uTime) ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,shaderDom:M},I=a(),q={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
// 噪声函数
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main(){
    float strength =1.0 - abs(cnoise(vUv * 10.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,shaderDom:I},O=a(),Z={fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
// 噪声函数
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main(){
    vec3 purpleColor = vec3(1.0, 0.0, 1.0);
    vec3 greenColor = vec3(1.0, 1.0, 1.0);
    vec3 uvColor = vec3(vUv,1.0);
    float strength = step(0.9,sin(cnoise(vUv * 10.0)*20.0))  ;


    vec3 mixColor =  mix(greenColor,uvColor,strength);
    // gl_FragColor =vec4(mixColor,1.0);
    gl_FragColor =vec4(mixColor,1.0);

}
    `,shaderDom:O};V(()=>{n(i),n(v),n(m),n(g),n(b),n(f),n(h),n(D),n(U),n(P),n(k),n(T),n(E),n(G),n(q),n(Z)});const R={initScene:n,part33:t,part33Shader:i,part34:y,part34Shader:v,part35:d,part35Shader:m,part36:u,part36Shader:g,part37:C,part37Shader:b,part38:B,part38Shader:f,part39:x,part39Shader:h,part40:A,part40Shader:D,part41:_,part41Shader:U,part42:w,part42Shader:P,part43:z,part43Shader:k,part44:S,part44Shader:T,part45:L,part45Shader:E,part46:M,part46Shader:G,part47:I,part47Shader:q,part48:O,part48Shader:Z,get THREE(){return ps},ref:a,onMounted:V,get OrbitControls(){return N}};return Object.defineProperty(R,"__isScriptSetup",{enumerable:!1,value:!0}),R}},is={ref:"part33"},ys={ref:"part34"},vs={ref:"part35"},ds={ref:"part36"},ms={ref:"part37"},us={ref:"part38"},gs={ref:"part39"},Cs={ref:"part40"},bs={ref:"part41"},Bs={ref:"part42"},fs={ref:"part43"},xs={ref:"part44"},hs={ref:"part45"},As={ref:"part46"},Ds={ref:"part47"},_s={ref:"part48"};function Us(H,s,n,t,i,y){return rs(),cs("div",null,[s[0]||(s[0]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",is,null,512),s[1]||(s[1]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",ys,null,512),s[2]||(s[2]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 waveUv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        vUv.x,</span></span>
<span class="line"><span style="color:#F8F8F2;">        vUv.y</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">30.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span></span>
<span class="line"><span style="color:#F8F8F2;">    );</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.01</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(waveUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",vs,null,512),s[3]||(s[3]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">     vec2 waveUv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">         vUv.x</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">30.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">         vUv.y</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">30.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span></span>
<span class="line"><span style="color:#F8F8F2;">     );</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.01</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(waveUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",ds,null,512),s[4]||(s[4]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">     vec2 waveUv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">         vUv.x</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(vUv.y</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">100.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">         vUv.y</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">100.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.1</span></span>
<span class="line"><span style="color:#F8F8F2;">     );</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.01</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(waveUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">))   ;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",ms,null,512),s[5]||(s[5]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(vUv.x,vUv.y);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> angle;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",us,null,512),s[6]||(s[6]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,vUv.y</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (angle</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">3.14</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">6.28</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",gs,null,512),s[7]||(s[7]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> alpha </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;">  1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,vUv.y</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (angle</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">3.14</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">6.28</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,alpha);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",Cs,null,512),s[8]||(s[8]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#6272A4;">// 旋转函数</span></span>
<span class="line"><span style="color:#FF79C6;">vec2</span><span style="color:#50FA7B;"> rotate</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> rotation</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">mid</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#50FA7B;">      cos</span><span style="color:#F8F8F2;">(rotation) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (uv.x </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> mid.x) </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> sin</span><span style="color:#F8F8F2;">(rotation) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (uv.y </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> mid.y) </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> mid.x,</span></span>
<span class="line"><span style="color:#50FA7B;">      cos</span><span style="color:#F8F8F2;">(rotation) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (uv.y </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> mid.y) </span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;"> sin</span><span style="color:#F8F8F2;">(rotation) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (uv.x </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> mid.x) </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> mid.y</span></span>
<span class="line"><span style="color:#F8F8F2;">    );</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    //  vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));</span></span>
<span class="line"><span style="color:#F8F8F2;">     vec2 rotateUv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> rotate</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">uTime</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">5.0</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> alpha </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;">  1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">distance</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)));</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(rotateUv.x</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,rotateUv.y</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">     float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (angle</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">3.14</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">6.28</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">     gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,alpha);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",bs,null,512),s[9]||(s[9]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> PI</span><span style="color:#BD93F9;"> 3.1415926535897932384626433832795</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,vUv.y</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">PI;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(angle</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",Bs,null,512),s[10]||(s[10]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> PI</span><span style="color:#BD93F9;"> 3.1415926535897932384626433832795</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> angle </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(vUv.x</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,vUv.y</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">2.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">PI);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sin</span><span style="color:#F8F8F2;">(angle</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">100.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",fs,null,512),s[11]||(s[11]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#6272A4;">// 随机函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;"> (vec2 </span><span style="color:#FFB86C;font-style:italic;">st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(st.xy,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">12.9898</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">78.233</span><span style="color:#F8F8F2;">)))</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">43758.5453123</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">// 噪声函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> noise</span><span style="color:#F8F8F2;"> (in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 i </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(_st);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 f </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(_st);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Four corners in 2D of a tile</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> a </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> b </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> c </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 u </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> f </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> f </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">3.0</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> f);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(a, b, u.x) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#F8F8F2;">            (c </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> a)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.y </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#F8F8F2;"> u.x) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#F8F8F2;">            (d </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> b) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.x </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> noise</span><span style="color:#F8F8F2;">(vUv);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",xs,null,512),s[12]||(s[12]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#6272A4;">// 随机函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;"> (vec2 </span><span style="color:#FFB86C;font-style:italic;">st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(st.xy,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">12.9898</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">78.233</span><span style="color:#F8F8F2;">)))</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">43758.5453123</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">// 噪声函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> noise</span><span style="color:#F8F8F2;"> (in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 i </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(_st);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 f </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(_st);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Four corners in 2D of a tile</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> a </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> b </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> c </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> random</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 u </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> f </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> f </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">3.0</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> f);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(a, b, u.x) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#F8F8F2;">            (c </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> a)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.y </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#F8F8F2;"> u.x) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#F8F8F2;">            (d </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> b) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.x </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> u.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">noise</span><span style="color:#F8F8F2;">(vUv </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 100.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",hs,null,512),s[13]||(s[13]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">vec4</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(vec4 </span><span style="color:#FFB86C;font-style:italic;">x</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(((x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">34.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">x, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">vec2</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">t</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">6.0</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">15.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#6272A4;">// 噪声函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> cnoise</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">P</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pf </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(Pi, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span><span style="color:#6272A4;"> // To avoid truncation effects in permutation</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 ix </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 iy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 i </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">permute</span><span style="color:#F8F8F2;">(ix) </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> iy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gx </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 0.0243902439</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span><span style="color:#6272A4;"> // 1/41 = 0.024...</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(gx) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 tx </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(gx </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gx </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> tx;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.x,gy.x);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.y,gy.y);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.z,gy.z);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.w,gy.w);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 norm </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.79284291400159</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 0.85373472095314</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g00, g00), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g01, g01), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g10, g10), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g11, g11));</span></span>
<span class="line"><span style="color:#F8F8F2;">    g00 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.x;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g01 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g10 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.z;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g11 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.w;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g00, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.x, fy.x));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g10, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.y, fy.y));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g01, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.z, fy.z));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g11, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.w, fy.w));</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 fade_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(Pf.xy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 n_x </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n00, n01), </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n10, n11), fade_xy.x);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(n_x.x, n_x.y, fade_xy.y);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#BD93F9;"> 2.3</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> n_xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cnoise</span><span style="color:#F8F8F2;">(vUv </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">5.0</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">uTime) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",As,null,512),s[14]||(s[14]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">vec4</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(vec4 </span><span style="color:#FFB86C;font-style:italic;">x</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(((x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">34.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">x, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">vec2</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">t</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">6.0</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">15.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#6272A4;">// 噪声函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> cnoise</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">P</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pf </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(Pi, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span><span style="color:#6272A4;"> // To avoid truncation effects in permutation</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 ix </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 iy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 i </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">permute</span><span style="color:#F8F8F2;">(ix) </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> iy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gx </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 0.0243902439</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span><span style="color:#6272A4;"> // 1/41 = 0.024...</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(gx) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 tx </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(gx </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gx </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> tx;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.x,gy.x);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.y,gy.y);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.z,gy.z);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.w,gy.w);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 norm </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.79284291400159</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 0.85373472095314</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g00, g00), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g01, g01), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g10, g10), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g11, g11));</span></span>
<span class="line"><span style="color:#F8F8F2;">    g00 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.x;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g01 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g10 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.z;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g11 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.w;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g00, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.x, fy.x));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g10, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.y, fy.y));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g01, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.z, fy.z));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g11, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.w, fy.w));</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 fade_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(Pf.xy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 n_x </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n00, n01), </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n10, n11), fade_xy.x);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(n_x.x, n_x.y, fade_xy.y);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#BD93F9;"> 2.3</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> n_xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cnoise</span><span style="color:#F8F8F2;">(vUv </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;">)) ;</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(strength,strength,strength,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",Ds,null,512),s[15]||(s[15]=l(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">precision lowp </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">varying</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> vUv;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> uTime;</span></span>
<span class="line"><span style="color:#FF79C6;">vec4</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(vec4 </span><span style="color:#FFB86C;font-style:italic;">x</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(((x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">34.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">x, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">vec2</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">t</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">6.0</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">15.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#6272A4;">// 噪声函数</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> cnoise</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">P</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 Pf </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(P.xyxy) </span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    Pi </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(Pi, </span><span style="color:#BD93F9;">289.0</span><span style="color:#F8F8F2;">);</span><span style="color:#6272A4;"> // To avoid truncation effects in permutation</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 ix </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 iy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pi.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.xzxz;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 fy </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Pf.yyww;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 i </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> permute</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">permute</span><span style="color:#F8F8F2;">(ix) </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> iy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gx </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> fract</span><span style="color:#F8F8F2;">(i </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 0.0243902439</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span><span style="color:#6272A4;"> // 1/41 = 0.024...</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 gy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(gx) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 tx </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> floor</span><span style="color:#F8F8F2;">(gx </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gx </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gx </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> tx;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.x,gy.x);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.y,gy.y);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.z,gy.z);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 g11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(gx.w,gy.w);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 norm </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1.79284291400159</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;"> 0.85373472095314</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g00, g00), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g01, g01), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g10, g10), </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(g11, g11));</span></span>
<span class="line"><span style="color:#F8F8F2;">    g00 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.x;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g01 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g10 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.z;</span></span>
<span class="line"><span style="color:#F8F8F2;">    g11 </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> norm.w;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n00 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g00, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.x, fy.x));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n10 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g10, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.y, fy.y));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n01 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g01, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.z, fy.z));</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n11 </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> dot</span><span style="color:#F8F8F2;">(g11, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(fx.w, fy.w));</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 fade_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> fade</span><span style="color:#F8F8F2;">(Pf.xy);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 n_x </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n00, n01), </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(n10, n11), fade_xy.x);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> n_xy </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mix</span><span style="color:#F8F8F2;">(n_x.x, n_x.y, fade_xy.y);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#BD93F9;"> 2.3</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> n_xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 purpleColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 greenColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 uvColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(vUv,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> strength </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.9</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cnoise</span><span style="color:#F8F8F2;">(vUv </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">20.0</span><span style="color:#F8F8F2;">))  ;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 mixColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">  mix</span><span style="color:#F8F8F2;">(greenColor,uvColor,strength);</span></span>
<span class="line"><span style="color:#6272A4;">    // gl_FragColor =vec4(mixColor,1.0);</span></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;">vec4</span><span style="color:#F8F8F2;">(mixColor,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),o("div",_s,null,512)])}const ks=Fs(ts,[["render",Us],["__file","glsl-graphical-part3.html.vue"]]),Ss=JSON.parse('{"path":"/glsl/glsl-graphical-part3.html","title":"GLSL图形（三）","lang":"en-US","frontmatter":{"title":"GLSL图形（三）","date":"2022-10-09T00:00:00.000Z","category":["GLSL"],"head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/glsl/glsl-graphical-part3.html"}],["meta",{"property":"og:title","content":"GLSL图形（三）"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-10-31T11:40:02.000Z"}],["meta",{"property":"article:published_time","content":"2022-10-09T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-31T11:40:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GLSL图形（三）\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-09T00:00:00.000Z\\",\\"dateModified\\":\\"2024-10-31T11:40:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"git":{"createdTime":1674274632000,"updatedTime":1730374802000,"contributors":[{"name":"luxiag","username":"luxiag","email":"luxiag@qq.com","commits":10,"url":"https://github.com/luxiag"},{"name":"卢祥","username":"卢祥","email":"example@qq.com","commits":1,"url":"https://github.com/卢祥"}]},"readingTime":{"minutes":10.36,"words":3108},"filePathRelative":"glsl/glsl-graphical-part3.md","localizedDate":"October 9, 2022","excerpt":"<div class=\\"language-glsl line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"glsl\\" data-title=\\"glsl\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#F8F8F2\\">precision lowp </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">varying</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> vUv;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">void</span><span style=\\"color:#50FA7B\\"> main</span><span style=\\"color:#F8F8F2\\">(){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">    float</span><span style=\\"color:#F8F8F2\\"> strength </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> step</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.1</span><span style=\\"color:#F8F8F2\\">,</span><span style=\\"color:#50FA7B\\">abs</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#50FA7B\\">distance</span><span style=\\"color:#F8F8F2\\">(vUv,</span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.5</span><span style=\\"color:#F8F8F2\\">))</span><span style=\\"color:#FF79C6\\">-</span><span style=\\"color:#BD93F9\\">0.25</span><span style=\\"color:#F8F8F2\\">))   ;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    gl_FragColor </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\">vec4</span><span style=\\"color:#F8F8F2\\">(strength,strength,strength,</span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{ks as comp,Ss as data};
