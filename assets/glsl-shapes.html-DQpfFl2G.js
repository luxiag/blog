import{l as O,a as $,m as W,n as z,o as P,p as N,q,W as I,ay as U,ak as m,V as v,G as J,r as Q,s as H}from"./three.module-_5Kft3IB.js";import{O as g}from"./OrbitControls-86TszHm5.js";import{_ as X,e as Y,g as i,f as F,r as c,i as V,o as K}from"./app-Dt3FNJM0.js";const ss="/blog/assets/894001203041232323-Ch6aHHJ3.png",ns="/blog/assets/453001303041232323-3ybriALr.png",ls={__name:"glsl-shapes.html",setup(Z,{expose:s}){s();const o=n=>{const e=new O,h=new H,t={u_time:{type:"f",value:1},u_resolution:{type:"v2",value:new $(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2)}},a=new W(75,2,.1,1e3);a.position.set(0,0,20),e.add(a);const p=new z({uniforms:t,fragmentShader:n.fragmentShader,side:P}),d=new N(new q(100,100),p);d.position.set(0,0,0),e.add(d);const l=new I;l.setSize(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2),l.shadowMap.enabled=!0,n.shaderDom.value.appendChild(l.domElement),l.render(e,a);const y=new g(a,l.domElement);y.enableDamping=!0,t.u_resolution.value;function u(){t.u_time.value+=h.getDelta(),y.update(),l.render(e,a),requestAnimationFrame(u)}u()},b=n=>{const e=new O,h=new H,t={iResolution:{value:new v},iTime:{value:0},iTimeDelta:{value:0},iFrameRate:{value:60},iFrame:{value:0},iChannelTime:{value:[0,0,0,0]},iChannelResolution:{value:[new v,new v,new v,new v]},iMouse:{value:new U},iChannel0:{value:new m},iChannel1:{value:new m},iChannel2:{value:new m},iChannel3:{value:new m},iDate:{value:new U}},a=new W(75,2,.1,1e3);a.position.set(0,0,20),e.add(a);const p=new z({uniforms:t,vertexShader:`
        precision lowp float;
        varying vec2 v_uv;
        void main(){
            v_uv = uv;
            gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4( position, 1.0 );
        }
        `,fragmentShader:n.fragmentShader,side:P}),d=new N(new q(100,100),p);d.position.set(0,0,0),e.add(d);const l=new I;l.setSize(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2),l.shadowMap.enabled=!0,n.shaderDom.value.appendChild(l.domElement),l.render(e,a);const y=new g(a,l.domElement);y.enableDamping=!0;const u=new J;p.uniforms.iResolution.value.set(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2,1),p.uniforms.iChannel0.value=u.load("/assets/textures/ca.jpeg"),n.shaderDom.value.addEventListener("mousemove",r=>{p.uniforms.iMouse.value.set(r.clientX,r.clientY,0,0)});function M(){y.update(),l.render(e,a),requestAnimationFrame(M);const r=new Date,j=r.getTime()*.001;p.uniforms.iTime.value+=h.getDelta(),p.uniforms.iDate.value.set(r.getFullYear(),r.getMonth(),r.getDate(),j)}M()},C=c(),f={shaderDom:C,fragmentShader:`
     #ifdef GL_ES
precision mediump float;
# endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // bottom-left
    vec2 bl = step(vec2(0.1),st);
    float pct = bl.x * bl.y;

    // top-right
    // vec2 tr = step(vec2(0.1),1.0-st);
    // pct *= tr.x* tr.y;

    color = vec3(pct);

    gl_FragColor = vec4(color,1.0);
}
     `},B=c(),_={shaderDom:B,fragmentShader:`
# ifdef GL_ES
precision mediump float;
# endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
 vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    pct = distance(st,vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    vec3 color = vec3(pct);

 gl_FragColor = vec4( color, 1.0 );
}
    `},A=c(),x={shaderDom:A,fragmentShader:`
    #ifdef GL_ES
    precision mediump float;
    # endif
    uniform vec2 u_resolution;  
    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec4 color = vec4(0.129, 0.588, 0.953, 1.0);

        if (uv.x < 0.6 && uv.y < 0.6) {
            gl_FragColor = color;
        } else {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            // gl_FragColor = color;
        }
    }

    `},D=c(),S={shaderDom:D,fragmentShader:`
# ifdef GL_ES
precision mediump float;
# endif
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iDate;

void main() {
 vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
    float tau = 3.1415926535*2.0;
    float a = atan(p.x,p.y);
    float r = length(p)*0.75;
    vec2 uv = vec2(a/tau,r);

 //get the color
 float xCol = (uv.x - (iTime / 3.0)) * 3.0;
 xCol = mod(xCol, 3.0);
 vec3 horColour = vec3(0.25, 0.25, 0.25);

 if (xCol < 1.0) {
  
  horColour.r += 1.0 - xCol;
  horColour.g += xCol;
 }
 else if (xCol < 2.0) {
  
  xCol -= 1.0;
  horColour.g += 1.0 - xCol;
  horColour.b += xCol;
 }
 else {
  
  xCol -= 2.0;
  horColour.b += 1.0 - xCol;
  horColour.r += xCol;
 }

 // draw color beam
 uv = (2.0 *uv) - 1.0;
 float beamWidth = (0.7+0.5*cos(uv.x*10.0*tau*0.15*clamp(floor(5.0 + 10.0*cos(iTime)), 0.0, 10.0)))* abs(1.0 / (30.0 *uv.y));
 vec3 horBeam = vec3(beamWidth);
gl_FragColor = vec4((( horBeam)* horColour), 1.0);
}

    `},w=c(),T={shaderDom:w,fragmentShader:`
    #ifdef GL_ES
precision mediump float;
# endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
vec2 dist =_st-vec2(0.5);
 return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(){
 vec2 st = gl_FragCoord.xy/u_resolution.xy;

 vec3 color = vec3(circle(st,0.9));

 gl_FragColor = vec4( color, 1.0 );
}

    `},R=c(),k={shaderDom:R,fragmentShader:`
    #ifdef GL_ES
precision mediump float;
# endif

# define PI 3.14159265359
# define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;
  vec3 color = vec3(0.0);
  float d = 0.0;

  // Remap the space to -1. to 1.
  st = st *2.-1.;

  // Number of sides of your shape
  int N = 3;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);

  color = vec3(1.0-smoothstep(.4,.41,d));
  // color = vec3(d);

  gl_FragColor = vec4(color,1.0);
}

    `},L=c(),E={shaderDom:L,fragmentShader:`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float f = cos(a*3.);
    // f = abs(cos(a*3.));
    // f = abs(cos(a*2.5))*.5+.3;
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

    color = vec3( 1.-smoothstep(f,f+0.02,r) );

    gl_FragColor = vec4(color, 1.0);
}
    
    `};V(()=>{o(f),o(_),o(x),b(S),o(T),o(k),o(E)});const G={initScene:o,initShaderToy:b,rectangularRef:C,rectangularShader:f,circleRef:B,circleShader:_,rectangularRef2:A,rectangularShader2:x,circleRef2:D,circleShader2:S,whiteCircleRef:w,whiteCircleShader:T,whiteTriangleRef:R,whiteTriangleShader:k,cloverRef:L,cloverShader:E,ref:c,onMounted:V,get THREE(){return Q},get OrbitControls(){return g}};return Object.defineProperty(G,"__isScriptSetup",{enumerable:!1,value:!0}),G}},as={ref:"rectangularRef"},es={ref:"rectangularRef2"},os={ref:"circleRef"},ps={ref:"circleRef2"},cs={ref:"whiteCircleRef"},rs={ref:"whiteTriangleRef"},is={ref:"cloverRef"};function Fs(Z,s,o,b,C,f){return K(),Y("div",null,[s[0]||(s[0]=i(`<p>部分参考： 《OpenGL 编程指南》、《The Book of Shader》</p><h2 id="长方形" tabindex="-1"><a class="header-anchor" href="#长方形"><span>长方形</span></a></h2><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv - 2015</span></span>
<span class="line"><span style="color:#6272A4;">// http://patriciogonzalezvivo.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_mouse;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // bottom-left</span></span>
<span class="line"><span style="color:#6272A4;">    // step 比0.1大 1  小 0</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 bl </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> step</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#F8F8F2;">),st);</span></span>
<span class="line"><span style="color:#6272A4;">    //放大边框</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> pct </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> bl.x </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> bl.y;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // top-right</span></span>
<span class="line"><span style="color:#6272A4;">    // vec2 tr = step(vec2(0.1),1.0-st);</span></span>
<span class="line"><span style="color:#6272A4;">    // pct *= tr.x * tr.y;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(pct);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)),F("div",as,null,512),s[1]||(s[1]=i(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;"># endif</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;  </span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">() {</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy </span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;"> u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec4 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.129</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.588</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.953</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (uv.x </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 0.6</span><span style="color:#FF79C6;"> &amp;&amp;</span><span style="color:#F8F8F2;"> uv.y </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 0.6</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> color;</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">        gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#6272A4;">        // gl_FragColor = color;</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),F("div",es,null,512),s[2]||(s[2]=i(`<h2 id="圆" tabindex="-1"><a class="header-anchor" href="#圆"><span>圆</span></a></h2><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv - 2015</span></span>
<span class="line"><span style="color:#6272A4;">// http://patriciogonzalezvivo.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_mouse;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> pct </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // a. The DISTANCE from the pixel to the center</span></span>
<span class="line"><span style="color:#F8F8F2;">    pct </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> distance</span><span style="color:#F8F8F2;">(st,</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // b. The LENGTH of the vector</span></span>
<span class="line"><span style="color:#6272A4;">    //    from the pixel to the center</span></span>
<span class="line"><span style="color:#6272A4;">    // vec2 toCenter = vec2(0.5)-st;</span></span>
<span class="line"><span style="color:#6272A4;">    // pct = length(toCenter);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // c. The SQUARE ROOT of the vector</span></span>
<span class="line"><span style="color:#6272A4;">    //    from the pixel to the center</span></span>
<span class="line"><span style="color:#6272A4;">    // vec2 tC = vec2(0.5)-st;</span></span>
<span class="line"><span style="color:#6272A4;">    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(pct);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;"> gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">( color, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;"> );</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)),F("div",os,null,512),s[3]||(s[3]=i(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">//作者：https://www.shadertoy.com/view/XdlSDs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;"># ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;"># endif</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec3</span><span style="color:#F8F8F2;"> iResolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> iTime;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec4</span><span style="color:#F8F8F2;"> iDate;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">() {</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec2 p </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">2.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">gl_FragCoord.xy</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">iResolution.xy)</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">iResolution.y;</span></span>
<span class="line"><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> tau </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 3.1415926535</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> a </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(p.x,p.y);</span></span>
<span class="line"><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">(p)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.75</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(a</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">tau,r);</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#6272A4;"> //get the color</span></span>
<span class="line"><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> xCol </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (uv.x </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> (iTime </span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;"> 3.0</span><span style="color:#F8F8F2;">)) </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;"> 3.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;"> xCol </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(xCol, </span><span style="color:#BD93F9;">3.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec3 horColour </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (xCol </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">  </span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.r </span><span style="color:#FF79C6;">+=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.g </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;"> }</span></span>
<span class="line"><span style="color:#FF79C6;"> else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (xCol </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">  </span></span>
<span class="line"><span style="color:#F8F8F2;">  xCol </span><span style="color:#FF79C6;">-=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.g </span><span style="color:#FF79C6;">+=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.b </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;"> }</span></span>
<span class="line"><span style="color:#FF79C6;"> else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">  </span></span>
<span class="line"><span style="color:#F8F8F2;">  xCol </span><span style="color:#FF79C6;">-=</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.b </span><span style="color:#FF79C6;">+=</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#FF79C6;"> -</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;">  horColour.r </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> xCol;</span></span>
<span class="line"><span style="color:#F8F8F2;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;"> // draw color beam</span></span>
<span class="line"><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">2.0</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;">uv) </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> beamWidth </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">0.7</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.5</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(uv.x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">10.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">tau</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.15</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">clamp</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">floor</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">5.0</span><span style="color:#FF79C6;"> +</span><span style="color:#BD93F9;"> 10.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(iTime)), </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">)))</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;"> abs</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;"> /</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">30.0</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;">uv.y));</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec3 horBeam </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(beamWidth);</span></span>
<span class="line"><span style="color:#F8F8F2;">gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">((( horBeam)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> horColour), </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),F("div",ps,null,512),s[4]||(s[4]=i(`<h2 id="距离场" tabindex="-1"><a class="header-anchor" href="#距离场"><span>距离场</span></a></h2><p>通过“空间距离”来重新解释什么是图形。这种技巧被称之为“距离场”</p><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv - 2015</span></span>
<span class="line"><span style="color:#6272A4;">// http://patriciogonzalezvivo.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_mouse;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> circle</span><span style="color:#F8F8F2;">(in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">, in </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> _radius</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 dist </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> _st</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;"> return</span><span style="color:#BD93F9;"> 1.</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(_radius</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">(_radius</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.01</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#F8F8F2;">                         _radius</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">(_radius</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.01</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#50FA7B;">                         dot</span><span style="color:#F8F8F2;">(dist,dist)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">4.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;"> vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;"> vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">circle</span><span style="color:#F8F8F2;">(st,</span><span style="color:#BD93F9;">0.9</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;"> gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">( color, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;"> );</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)),F("div",cs,null,512),s[5]||(s[5]=i(`<div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> PI</span><span style="color:#BD93F9;"> 3.14159265359</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> TWO_PI</span><span style="color:#BD93F9;"> 6.28318530718</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_mouse;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">// Reference to</span></span>
<span class="line"><span style="color:#6272A4;">// http://thndl.com/square-shaped-shaders.html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">  vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">  st.x </span><span style="color:#FF79C6;">*=</span><span style="color:#F8F8F2;"> u_resolution.x</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">  vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">  float</span><span style="color:#F8F8F2;"> d </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">  // Remap the space to -1. to 1.</span></span>
<span class="line"><span style="color:#F8F8F2;">  st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> st </span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">2.</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">1.</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">  // Number of sides of your shape</span></span>
<span class="line"><span style="color:#FF79C6;">  int</span><span style="color:#F8F8F2;"> N </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 3</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">  // Angle and radius from the current pixel</span></span>
<span class="line"><span style="color:#FF79C6;">  float</span><span style="color:#F8F8F2;"> a </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(st.x,st.y)</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">PI;</span></span>
<span class="line"><span style="color:#FF79C6;">  float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> TWO_PI</span><span style="color:#FF79C6;">/float</span><span style="color:#F8F8F2;">(N);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">  // Shaping function that modulate the distance</span></span>
<span class="line"><span style="color:#F8F8F2;">  d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> cos</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">floor</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">.5</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">a</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">r)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">r</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">a)</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">length</span><span style="color:#F8F8F2;">(st);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">  color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">.4</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">.41</span><span style="color:#F8F8F2;">,d));</span></span>
<span class="line"><span style="color:#6272A4;">  // color = vec3(d);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">  gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)),F("div",rs,null,512),s[6]||(s[6]=i('<h2 id="极坐标下的图形" tabindex="-1"><a class="header-anchor" href="#极坐标下的图形"><span>极坐标下的图形</span></a></h2><figure><img src="'+ss+'" alt="Robert Mangold - Untitled (2008)" tabindex="0" loading="lazy"><figcaption>Robert Mangold - Untitled (2008)</figcaption></figure><figure><img src="'+ns+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">y </span><span style="color:#FF79C6;">=</span><span style="color:#8BE9FD;"> cos</span><span style="color:#F8F8F2;">(x</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">3.</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#6272A4;">//y = abs(cos(x*3.));</span></span>
<span class="line"><span style="color:#6272A4;">//y = abs(cos(x*2.5))*0.5+0.3;</span></span>
<span class="line"><span style="color:#6272A4;">//y = abs(cos(x*12.)*sin(x*3.))*.8+.1;</span></span>
<span class="line"><span style="color:#6272A4;">//y = smoothstep(-.5,1., cos(x*10.))*0.2+0.5;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv - 2015</span></span>
<span class="line"><span style="color:#6272A4;">// http://patriciogonzalezvivo.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_mouse;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 pos </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">st;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">(pos)</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> a </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> atan</span><span style="color:#F8F8F2;">(pos.y,pos.x);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> f </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> cos</span><span style="color:#F8F8F2;">(a</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">3.</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#6272A4;">    // f = abs(cos(a*3.));</span></span>
<span class="line"><span style="color:#6272A4;">    // f = abs(cos(a*2.5))*.5+.3;</span></span>
<span class="line"><span style="color:#6272A4;">    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;</span></span>
<span class="line"><span style="color:#6272A4;">    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">1.</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(f,f</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.02</span><span style="color:#F8F8F2;">,r) );</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)),F("div",is,null,512)])}const vs=X(ls,[["render",Fs],["__file","glsl-shapes.html.vue"]]),us=JSON.parse('{"path":"/glsl/glsl-shapes.html","title":"GLSL中的形状","lang":"en-US","frontmatter":{"title":"GLSL中的形状","date":"2022-10-06T00:00:00.000Z","category":["GLSL"],"description":"部分参考： 《OpenGL 编程指南》、《The Book of Shader》 长方形 圆 距离场 通过“空间距离”来重新解释什么是图形。这种技巧被称之为“距离场” 极坐标下的图形 Robert Mangold - Untitled (2008)Robert Mangold - Untitled (2008)","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/glsl/glsl-shapes.html"}],["meta",{"property":"og:title","content":"GLSL中的形状"}],["meta",{"property":"og:description","content":"部分参考： 《OpenGL 编程指南》、《The Book of Shader》 长方形 圆 距离场 通过“空间距离”来重新解释什么是图形。这种技巧被称之为“距离场” 极坐标下的图形 Robert Mangold - Untitled (2008)Robert Mangold - Untitled (2008)"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-10-31T11:40:02.000Z"}],["meta",{"property":"article:published_time","content":"2022-10-06T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-31T11:40:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GLSL中的形状\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-06T00:00:00.000Z\\",\\"dateModified\\":\\"2024-10-31T11:40:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"git":{"createdTime":1681195440000,"updatedTime":1730374802000,"contributors":[{"name":"luxiag","username":"luxiag","email":"luxiag@qq.com","commits":8,"url":"https://github.com/luxiag"},{"name":"卢祥","username":"卢祥","email":"example@qq.com","commits":1,"url":"https://github.com/卢祥"}]},"readingTime":{"minutes":6.28,"words":1884},"filePathRelative":"glsl/glsl-shapes.md","localizedDate":"October 6, 2022","excerpt":"<p>部分参考： 《OpenGL 编程指南》、《The Book of Shader》</p>\\n<h2>长方形</h2>\\n<div class=\\"language-glsl line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"glsl\\" data-title=\\"glsl\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#6272A4\\">// Author @patriciogv - 2015</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// http://patriciogonzalezvivo.com</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">#ifdef</span><span style=\\"color:#50FA7B\\"> GL_ES</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">precision mediump </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">#endif</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">uniform</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> u_resolution;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">uniform</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> u_mouse;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">uniform</span><span style=\\"color:#FF79C6\\"> float</span><span style=\\"color:#F8F8F2\\"> u_time;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">void</span><span style=\\"color:#50FA7B\\"> main</span><span style=\\"color:#F8F8F2\\">(){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec2 st </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> gl_FragCoord.xy</span><span style=\\"color:#FF79C6\\">/</span><span style=\\"color:#F8F8F2\\">u_resolution.xy;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec3 color </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec3</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.0</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // bottom-left</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // step 比0.1大 1  小 0</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec2 bl </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> step</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.1</span><span style=\\"color:#F8F8F2\\">),st);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    //放大边框</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">    float</span><span style=\\"color:#F8F8F2\\"> pct </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> bl.x </span><span style=\\"color:#FF79C6\\">*</span><span style=\\"color:#F8F8F2\\"> bl.y;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // top-right</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // vec2 tr = step(vec2(0.1),1.0-st);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // pct *= tr.x * tr.y;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    color </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec3</span><span style=\\"color:#F8F8F2\\">(pct);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    gl_FragColor </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec4</span><span style=\\"color:#F8F8F2\\">(color,</span><span style=\\"color:#BD93F9\\">1.0</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{vs as comp,us as data};
