---
title: GLSL图形（二）
date: 2022-10-08
category:
  - GLSL
---

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = abs(vUv.x - 0.5) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part17"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part18"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part19"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part20"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =1.0-step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part21"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part22"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part23"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0*floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part24"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part25"></div>

```glsl
precision lowp float;
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
void main(){
     float strength = random(vUv);
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part26"></div>

```glsl
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
```

<div ref="part27"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = length(vUv);
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part28"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =1.0 - distance(vUv,vec2(0.5,0.5));
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part29"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     float strength = 1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25) ;
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part30"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     float strength = step(0.5,distance(vUv,vec2(0.5))+0.35) ;
     strength *= (1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25)) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}

```
<div ref="part31"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     float strength =  abs(distance(vUv,vec2(0.5))-0.25) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
```
<div ref="part32"></div>

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
        // renderer.setPixelRatio( window.devicePixelRatio );
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
    // part 17

const part17 = ref()
const part17Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = abs(vUv.x - 0.5) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part17
}

// part 18

const part18 = ref()
const part18Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part18
}

// part 19

const part19 = ref()
const part19Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part19
}

// part 20

const part20 = ref()
const part20Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part20
}

// part 21

const part21 = ref()
const part21Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength =1.0-step(0.2,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part21
}

const part22 = ref()
const part22Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part22
}

const part23 = ref()
const part23Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part23
}

const part24 = ref()
const part24Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = floor(vUv.x*10.0)/10.0*floor(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part24
}

const part25 = ref()
const part25Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;

void main(){
    float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part25
}

const part26 = ref()
const part26Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
void main(){
     float strength = random(vUv);
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part26
}

const part27 = ref()
const part27Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part27
}


const part28 = ref()
const part28Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = length(vUv);
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part28
}

const part29 = ref()
const part29Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;

void main(){
    float strength =1.0 - distance(vUv,vec2(0.5,0.5));
    gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part29
}

const part30 = ref()
const part30Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part30
}

const part31 = ref()
const part31Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float strength = step(0.5,distance(vUv,vec2(0.5))+0.35) ;
     strength *= (1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25)) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part31
}

const part32 = ref()
const part32Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     float strength =  abs(distance(vUv,vec2(0.5))-0.25) ;
     gl_FragColor =vec4(strength,strength,strength,1);

}
    `,
    shaderDom:part32
}

onMounted(()=>{

    initScene(part17Shader)
    initScene(part18Shader)
    initScene(part19Shader)
    initScene(part20Shader)
    initScene(part21Shader)
     initScene(part22Shader)
    initScene(part23Shader)
    initScene(part24Shader)
    initScene(part25Shader)
    initScene(part26Shader)   
    initScene(part27Shader)
    initScene(part28Shader)
    initScene(part29Shader)
    initScene(part30Shader)
    initScene(part31Shader)   
    initScene(part32Shader)



})


</script>
