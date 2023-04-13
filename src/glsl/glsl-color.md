---
title: GLSL中的颜色
date: 2022-10-06
category:
  - GLSL
---

 部分参考： 《OpenGL 编程指南》、《The Book of Shader》

## 混合颜色

![](./images/429000703041012323.png)

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}


```

<div ref="mixRef"></div>

## 渐变

![](./images/126001303041012323.png)

```glsl
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

/*

生成一条直线
pct.x => x轴坐标 当st.y = stx.x 放回 1 
*/
float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    // pct.r = smoothstep(0.0,1.0, st.x);
    // pct.g = sin(st.x*PI);
    // pct.b = pow(st.x,0.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}


```

<div ref="fadeRef"></div>

```glsl

varying vec2 v_uv;
uniform float u_time;
void main(){
       vec3 col = 0.5 + 0.5*cos(u_time+v_uv.xyx+vec3(0,2,4));
       gl_FragColor = vec4(col,1.0);
   }

```

<div ref="colorFadeRef"> </div>

## HSB

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // We map x (0.0 - 1.0) to the hue (0.0 - 1.0)
    // And the y (0.0 - 1.0) to the brightness
    color = hsb2rgb(vec3(st.x,1.0,st.y));

    gl_FragColor = vec4(color,1.0);
}


```

<div ref="hsbRef"></div>

```glsl
#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}
```

<div ref="rgbRef"></div>

## 落日

```glsl
//来源：https://www.shadertoy.com/view/ldS3Wm
// License: CC BY 4.0
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec4 iDate;

#define ANIMATE_CLOUDS 0

const float R0 = 6360e3;
const float Ra = 6380e3;
const int steps = 128;
const int stepss = 8;
const float g = .76;
const float g2 = g * g;
const float Hr = 8e3;
const float Hm = 1.2e3;
const float I = 10.;

uniform float u_time;


vec3 C = vec3(0., -R0, 0.);
vec3 bM = vec3(21e-6);
vec3 bR = vec3(5.8e-6, 13.5e-6, 33.1e-6);
vec3 Ds = normalize(vec3(0., .09, -1.));

float noise(in vec2 v) { return textureLod(iChannel0, (v+.5)/256., 0.).r; }

// by iq
float noise(in vec3 v) {
 vec3 p = floor(v);
    vec3 f = fract(v);
 //f = f*f*(3.-2.*f);
 
 vec2 uv = (p.xy+vec2(37.,17.)*p.z) + f.xy;
 vec2 rg = textureLod( iChannel0, (uv+.5)/256., 0.).yx;
 return mix(rg.x, rg.y, f.z);
}

float fnoise(in vec3 v) {
#if ANIMATE_CLOUDS
 return
  .55 * noise(v) +
  .225 * noise(v*2. + t *.4) +
  .125 * noise(v*3.99) +
  .0625 * noise(v*8.9);
#else
 return
  .55 * noise(v) +
  .225 * noise(v*2.) +
  .125 * noise(v*3.99) +
  .0625 * noise(v*8.9);
#endif
}

float cloud(vec3 p) {
 float cld = fnoise(p*2e-4);
 cld = smoothstep(.4+.04, .6+.04, cld);
 cld *= cld * 40.;
 return cld;
}

void densities(in vec3 pos, out float rayleigh, out float mie) {
 float h = length(pos - C) - R0;
 rayleigh =  exp(-h/Hr);

 float cld = 0.;
 if (5e3 < h && h < 10e3) {
  cld = cloud(pos+vec3(23175.7, 0.,-t*3e3));
  cld *= sin(3.1415*(h-5e3)/5e3);
 }
 mie = exp(-h/Hm) + cld;
}

float escape(in vec3 p, in vec3 d, in float R) {
 vec3 v = p - C;
 float b = dot(v, d);
 float c = dot(v, v) - R*R;
 float det2 = b * b - c;
 if (det2 < 0.) return -1.;
 float det = sqrt(det2);
 float t1 = -b - det, t2 = -b + det;
 return (t1 >= 0.) ? t1 : t2;
}

// this can be explained: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
vec3 scatter(vec3 o, vec3 d) {
 float L = escape(o, d, Ra); 
 float mu = dot(d, Ds);
 float opmu2 = 1. + mu*mu;
 float phaseR = .0596831 * opmu2;
 float phaseM = .1193662 * (1. - g2) * opmu2 / ((2. + g2) * pow(1. + g2 - 2.*g*mu, 1.5));
 
 float depthR = 0., depthM = 0.;
 vec3 R = vec3(0.), M = vec3(0.);
 
 float dl = L / float(steps);
 for (int i = 0; i < steps; ++i) {
  float l = float(i) * dl;
  vec3 p = o + d * l;

  float dR, dM;
  densities(p, dR, dM);
  dR *= dl; dM *= dl;
  depthR += dR;
  depthM += dM;

  float Ls = escape(p, Ds, Ra);
  if (Ls > 0.) {
   float dls = Ls / float(stepss);
   float depthRs = 0., depthMs = 0.;
   for (int j = 0; j < stepss; ++j) {
    float ls = float(j) * dls;
    vec3 ps = p + Ds * ls;
    float dRs, dMs;
    densities(ps, dRs, dMs);
    depthRs += dRs * dls;
    depthMs += dMs * dls;
   }
   
   vec3 A = exp(-(bR * (depthRs + depthR) + bM * (depthMs + depthM)));
   R += A * dR;
   M += A * dM;
  } else {
   return vec3(0.);
  }
 }
 
 return I * (R * bR * phaseR + M * bM * phaseM);
}

void main(  ) {
 if (iMouse.z > 0.) {
  float ph = 3.3 * (1. - iMouse.y / iResolution.y);
  Ds = normalize(vec3(iMouse.x / iResolution.x - .5, sin(ph), cos(ph)));
 }
 
 vec2 uv = gl_FragCoord.xy / iResolution.xy * 2. - 1.;
 uv.x *= iResolution.x / iResolution.y;
 
 vec3 O = vec3(uv * .1, 0.) + vec3(0., 25e2, 0.);
 vec3 D = normalize(vec3(uv, -2.));
 
 float att = 1.;
 if (D.y < -.02) {
  float L = - O.y / D.y;
  O = O + D * L;
  
  D.y = -D.y;
  D = normalize(D+vec3(0.,.003*sin(t+6.2831*noise(O.xz*.8+vec2(0.,-t*3e3))),0.));
  att = .6;
 }
 
 vec3 color = att * scatter(O, D);

 float env = pow(1. - smoothstep(.5, iResolution.x / iResolution.y, length(uv*.8)), .3);
 gl_FragColor = vec4(env * pow(color, vec3(.4)), 1.);
}
```

<div ref="sunsetRef"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

const initScene = (shader)=>{
    // 1.创建场景
    const scene = new THREE.Scene()
    const clock = new THREE.Clock();
    const uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2()}
    }
    // 2.创建相机
    const camera = new THREE.PerspectiveCamera(75,
    2 , 0.1, 1000);

    // 设置相机位置
    camera.position.set(0, 0, 20)
    scene.add(camera)

    // 着色器配置
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms:uniforms,
            vertexShader:`
        precision lowp float;
        varying vec2 v_uv;
        void main(){
            v_uv = uv;
            gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4( position, 1.0 );
        }
        `,
        fragmentShader: shader.fragmentShader,
        side: THREE.DoubleSide
    })
    // 创建平面
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), shaderMaterial)
    floor.position.set(0,0,0)
    scene.add(floor)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer()
    if(!__VUEPRESS_SSR__) {
        renderer.setPixelRatio( window.devicePixelRatio );
    }
    // 设置渲染器大小

    renderer.setSize(shader.shaderDom.value.offsetWidth, shader.shaderDom.value.offsetWidth/2)
    renderer.shadowMap.enabled = true
    shader.shaderDom.value.appendChild(renderer.domElement)
    renderer.render(scene,camera)
        // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器阻尼
    controls.enableDamping = true
    uniforms.u_resolution.value.x = renderer.domElement.width
    uniforms.u_resolution.value.y = renderer.domElement.height
    function render() {
        uniforms.u_time.value += clock.getDelta();
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    render()

}

const initShaderToy = (shader) => {
        // 1.创建场景
    const scene = new THREE.Scene()
    const clock = new THREE.Clock();
    const uniforms = {
        iResolution: { value: new THREE.Vector3() },
        iTime: { value: 0 },
        iTimeDelta: { value: 0 },
        iFrameRate: { value: 60 },
        iFrame: { value: 0 },
        iChannelTime: { value: [0, 0, 0, 0] },
        iChannelResolution: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
        iMouse: { value: new THREE.Vector4() },
        iChannel0: { value: new THREE.Texture() },
        iChannel1: { value: new THREE.Texture() },
        iChannel2: { value: new THREE.Texture() },
        iChannel3: { value: new THREE.Texture() },
        iDate: { value: new THREE.Vector4() }
    }
    // 2.创建相机
    const camera = new THREE.PerspectiveCamera(75,
    2 , 0.1, 1000);

    // 设置相机位置
    camera.position.set(0, 0, 20)
    scene.add(camera)

    // 着色器配置
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms:uniforms,
            vertexShader:`
        precision lowp float;
        varying vec2 v_uv;
        void main(){
            v_uv = uv;
            gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4( position, 1.0 );
        }
        `,
        fragmentShader: shader.fragmentShader,
        side: THREE.DoubleSide
    })
    // 创建平面
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), shaderMaterial)
    floor.position.set(0,0,0)
    scene.add(floor)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer()
    if(!__VUEPRESS_SSR__) {
        renderer.setPixelRatio( window.devicePixelRatio );
    }
    // 设置渲染器大小

    renderer.setSize(shader.shaderDom.value.offsetWidth, shader.shaderDom.value.offsetWidth/2)
    renderer.shadowMap.enabled = true
    shader.shaderDom.value.appendChild(renderer.domElement)
    renderer.render(scene,camera)
        // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器阻尼
    controls.enableDamping = true
    const textureLoader = new THREE.TextureLoader();
    shaderMaterial.uniforms.iResolution.value.set(shader.shaderDom.value.offsetWidth, shader.shaderDom.value.offsetWidth/2,1);

    // shaderMaterial.uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    // shaderMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    shaderMaterial.uniforms.iChannel0.value = textureLoader.load("/assets/textures/ca.jpeg");;
    if(!__VUEPRESS_SSR__) {
        shader.shaderDom.value.addEventListener('mousemove',(event) => {
            // console.log(event.clientX,event.clientY,'event')
            shaderMaterial.uniforms.iMouse.value.set(event.clientX, event.clientY, 0, 0);

        })
    }

    function render() {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
        const now = new Date();
        const time = now.getTime() * 0.001;
        shaderMaterial.uniforms.iTime.value += clock.getDelta();
        shaderMaterial.uniforms.iDate.value.set(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          time
        );

    }

    render()
}
const mixRef = ref()
const mixShader = {
        shaderDom:mixRef,
        fragmentShader:`
# ifdef GL_ES
precision mediump float;
# endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(u_time));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}
`}

const fadeRef = ref()
const fadeShader = {
    shaderDom:fadeRef,
    fragmentShader:`
    #ifdef GL_ES
precision mediump float;
# endif

# define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    // pct.r = smoothstep(0.0,1.0, st.x);
    // pct.g = sin(st.x*PI);
    // pct.b = pow(st.x,0.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}

    `
}

const hsbRef = ref()
const hsbShader = {
    shaderDom:hsbRef,
    fragmentShader:`
    #ifdef GL_ES
precision mediump float;
# endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // We map x (0.0 - 1.0) to the hue (0.0 - 1.0)
    // And the y (0.0 - 1.0) to the brightness
    color = hsb2rgb(vec3(st.x,1.0,st.y));

    gl_FragColor = vec4(color,1.0);
}

    `
}

const rgbRef = ref()
const rgbShader = {
    shaderDom:rgbRef,
    fragmentShader:`
    #ifdef GL_ES
precision mediump float;
# endif

# define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}

    `

}

const colorFadeRef = ref()

const colorFadeShader = {
    shaderDom:colorFadeRef,
    fragmentShader:`
    varying vec2 v_uv;
uniform float u_time;
void main(){
       vec3 col = 0.5 + 0.5*cos(u_time+v_uv.xyx+vec3(0,2,4));
       gl_FragColor = vec4(col,1.0);
   }

    `
}

const sunsetRef = ref()
const sunsetShader = {
shaderDom:sunsetRef,
fragmentShader:`

//来源：https://www.shadertoy.com/view/ldS3Wm
// License: CC BY 4.0
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec4 iDate;

# define ANIMATE_CLOUDS 0
# define t iTime

const float R0 = 6360e3;
const float Ra = 6380e3;
const int steps = 128;
const int stepss = 8;
const float g = .76;
const float g2 = g * g;
const float Hr = 8e3;
const float Hm = 1.2e3;
const float I = 10.;

varying vec2 v_uv;

vec3 C = vec3(0., -R0, 0.);
vec3 bM = vec3(21e-6);
vec3 bR = vec3(5.8e-6, 13.5e-6, 33.1e-6);
vec3 Ds = normalize(vec3(0., .09, -1.));

float noise(in vec2 v) { return textureLod(iChannel0, (v+.5)/256., 0.).r; }

// by iq
float noise(in vec3 v) {
 vec3 p = floor(v);
    vec3 f = fract(v);
 //f = f*f*(3.-2.*f);

 vec2 uv = (p.xy+vec2(37.,17.)*p.z) + f.xy;
 vec2 rg = textureLod( iChannel0, (uv+.5)/256., 0.).yx;
 return mix(rg.x, rg.y, f.z);
}

float fnoise(in vec3 v) {
# if ANIMATE_CLOUDS
 return
  .55 *noise(v) +
.225* noise(v*2. + t*.4) +
  .125 *noise(v*3.99) +
  .0625 *noise(v*8.9);
# else
 return
  .55 *noise(v) +
.225* noise(v*2.) +
.125* noise(v*3.99) +
.0625* noise(v*8.9);
# endif
}

float cloud(vec3 p) {
 float cld = fnoise(p*2e-4);
 cld = smoothstep(.4+.04, .6+.04, cld);
cld*= cld * 40.;
 return cld;
}

void densities(in vec3 pos, out float rayleigh, out float mie) {
 float h = length(pos - C) - R0;
 rayleigh =  exp(-h/Hr);

 float cld = 0.;
 if (5e3 < h && h < 10e3) {
  cld = cloud(pos+vec3(23175.7, 0.,-t*3e3));
cld*= sin(3.1415*(h-5e3)/5e3);
 }
 mie = exp(-h/Hm) + cld;
}

float escape(in vec3 p, in vec3 d, in float R) {
 vec3 v = p - C;
 float b = dot(v, d);
 float c = dot(v, v) - R*R;
float det2 = b* b - c;
 if (det2 < 0.) return -1.;
 float det = sqrt(det2);
 float t1 = -b - det, t2 = -b + det;
 return (t1 >= 0.) ? t1 : t2;
}

// this can be explained: http://www.scratchapixel.com/lessons/3d-advanced-lessons/simulating-the-colors-of-the-sky/atmospheric-scattering/
vec3 scatter(vec3 o, vec3 d) {
 float L = escape(o, d, Ra);
 float mu = dot(d, Ds);
 float opmu2 = 1. + mu*mu;
float phaseR = .0596831* opmu2;
 float phaseM = .1193662 *(1. - g2)* opmu2 / ((2. + g2) *pow(1. + g2 - 2.*g*mu, 1.5));

 float depthR = 0., depthM = 0.;
 vec3 R = vec3(0.), M = vec3(0.);

 float dl = L / float(steps);
 for (int i = 0; i < steps; ++i) {
  float l = float(i) *dl;
vec3 p = o + d* l;

  float dR, dM;
  densities(p, dR, dM);
  dR *= dl; dM*= dl;
  depthR += dR;
  depthM += dM;

  float Ls = escape(p, Ds, Ra);
  if (Ls > 0.) {
   float dls = Ls / float(stepss);
   float depthRs = 0., depthMs = 0.;
   for (int j = 0; j < stepss; ++j) {
    float ls = float(j) *dls;
vec3 ps = p + Ds* ls;
    float dRs, dMs;
    densities(ps, dRs, dMs);
    depthRs += dRs *dls;
depthMs += dMs* dls;
   }

   vec3 A = exp(-(bR *(depthRs + depthR) + bM* (depthMs + depthM)));
   R += A *dR;
M += A* dM;
  } else {
   return vec3(0.);
  }
 }

 return I *(R* bR *phaseR + M* bM * phaseM);
}

void main() {
 if (iMouse.z > 0.) {
  float ph = 3.3 * (1. - iMouse.y / iResolution.y);
  Ds = normalize(vec3(iMouse.x / iResolution.x - .5, sin(ph), cos(ph)));
 }

//  vec2 uv = gl_FragCoord.xy / iResolution.xy *2. - 1.;
vec2 uv = v_uv;
// uv.x*= iResolution.x / iResolution.y;

 vec3 O = vec3(uv * .1, 0.) + vec3(0., 25e2, 0.);
 vec3 D = normalize(vec3(uv, -2.));

 float att = 1.;
 if (D.y < -.02) {
  float L = - O.y / D.y;
  O = O + D * L;
  
  D.y = -D.y;
  D = normalize(D+vec3(0.,.003*sin(t+6.2831*noise(O.xz*.8+vec2(0.,-t*3e3))),0.));
  att = .6;
 }

 vec3 color = att * scatter(O, D);

 float env = pow(1. - smoothstep(.5, iResolution.x / iResolution.y, length(uv*.8)), .3);
    // gl_FragColor = vec4(env*pow(color, vec3(.4)), 1.);
    gl_FragColor = vec4(color,1.0);
}
`
}
onMounted(()=>{
    initScene(mixShader)
    initScene(fadeShader)
    initScene(hsbShader)
    initScene(rgbShader)
    initScene(colorFadeShader)
    initShaderToy(sunsetShader)
})
</script>
