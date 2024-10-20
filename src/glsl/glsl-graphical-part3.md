---
title: GLSL图形（三）
date: 2022-10-09
category:
  - GLSL
---

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
```

<div ref="part33"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = 1.0 - step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
```

<div ref="part34"></div>

```glsl
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
```

<div ref="part35"></div>

```glsl
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
```

<div ref="part36"></div>

```glsl
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

```

<div ref="part37"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float angle = atan(vUv.x,vUv.y);
    float strength = angle;
    gl_FragColor =vec4(strength,strength,strength,1);

}

```

<div ref="part38"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     float angle = atan(vUv.x-0.5,vUv.y-0.5);
     float strength = (angle+3.14)/6.28;
     gl_FragColor =vec4(strength,strength,strength,1);

}

```

<div ref="part39"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
    float angle = atan(vUv.x-0.5,vUv.y-0.5);
    float strength = (angle+3.14)/6.28;
    gl_FragColor =vec4(strength,strength,strength,alpha);

}
```

<div ref="part40"></div>

```glsl
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
```

<div ref="part41"></div>

```glsl
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
    float strength = mod(angle*10.0,1.0);

    gl_FragColor =vec4(strength,strength,strength,1);

}
```

<div ref="part42"></div>

```glsl
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
    float strength = sin(angle*100.0);
    gl_FragColor =vec4(strength,strength,strength,1);

}
```

<div ref="part43"></div>

```glsl
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
```

<div ref="part44"></div>

```glsl
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
```

<div ref="part45"></div>

```glsl
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
```

<div ref="part46"></div>

```glsl
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

```

<div ref="part47"></div>

```glsl
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

```

<div ref="part48"></div>

<script setup>
import * as THREE from 'three'
import {ref,onMounted} from 'vue'

    // 导入轨道控制器

import {
OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

const initScene = (shader)=>{
    // 1.创建场景
    const scene = new THREE.Scene()
    const clock = new THREE.Clock();
    const uniforms = {
    u_time: { type: "f", value: 1.0 },
    uTime:{type:"f",value:1.0},
    u_resolution: { type: "v2", value: new THREE.Vector2()}
    }
    // 2.创建相机
    const camera = new THREE.PerspectiveCamera(75,
    2 , 0.1, 1000);

    // 设置相机位置
    camera.position.set(0, 0, 10)
    scene.add(camera)

    // 着色器配置
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms:uniforms,
        fragmentShader: shader.fragmentShader,
        vertexShader:`
        precision lowp float;
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        }
        `,
        side: THREE.DoubleSide
    })
    // 创建平面
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), shaderMaterial)
    scene.add(floor)
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer()
    if(!__VUEPRESS_SSR__) {
<<<<<<< HEAD
        renderer.setPixelRatio( window.devicePixelRatio );
=======
        // renderer.setPixelRatio( window.devicePixelRatio );
>>>>>>> 6456c69b7aa604175684f41baf40d6eb929d17cb
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
        uniforms.uTime.value += clock.getDelta();
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    render()

}


const part33 = ref()
const part33Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part33
}

const part34 = ref()
const part34Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = 1.0 - step(0.1,abs(distance(vUv,vec2(0.5))-0.25))   ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part34
}

const part35 = ref()
const part35Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part35
}

const part36 = ref()
const part36Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part36
}


const part37 = ref()
const part37Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part37
}


const part38 = ref()
const part38Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float angle = atan(vUv.x,vUv.y);
    float strength = angle;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part38
}

const part39 = ref()
const part39Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float angle = atan(vUv.x-0.5,vUv.y-0.5);
     float strength = (angle+3.14)/6.28;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part39
}

const part40 = ref()
const part40Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
    float angle = atan(vUv.x-0.5,vUv.y-0.5);
    float strength = (angle+3.14)/6.28;
    gl_FragColor =vec4(strength,strength,strength,alpha);

}
    `,
    shaderDom:part40
}

const part41 = ref()
const part41Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part41
}

const part42 = ref()
const part42Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
    float strength = mod(angle*10.0,1.0);

    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part42
}

const part43 = ref()
const part43Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795
void main(){
    float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
    float strength = sin(angle*100.0);
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part43
}

const part44 = ref()
const part44Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part44
}

const part45 = ref()
const part45Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part45
}


const part46 = ref()
const part46Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part46
}

const part47 = ref()
const part47Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part47
}

const part48 = ref()
const part48Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part48
}

onMounted(()=>{
    initScene(part33Shader)
    initScene(part34Shader)
    initScene(part35Shader)
    initScene(part36Shader)
    initScene(part37Shader)
    initScene(part38Shader)
    initScene(part39Shader)
    initScene(part40Shader)
    initScene(part41Shader)
    initScene(part42Shader)
    initScene(part43Shader)
    initScene(part44Shader)
    initScene(part45Shader)
    initScene(part46Shader)
    initScene(part47Shader)
    initScene(part48Shader)


})
</script>
