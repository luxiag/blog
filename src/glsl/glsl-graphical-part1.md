---
title: GLSL图形（一）
date: 2022-10-10
category:
  - GLSL
---

```glsl
precision lowp float;

varying vec2 vUv;
void main(){
    gl_FragColor =vec4(vUv,0,1);
}
```

<div ref="part1"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    gl_FragColor =vec4(vUv,1,1);
}
```

<div ref="part2"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = vUv.x;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part3"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = vUv.y;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part4"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    float strength = 1.0-vUv.y;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part5"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    //利用uv实现短范围内渐变
    float strength = vUv.y * 10.0;
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part6"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     //7利用通过取模达到反复效果
   float strength = mod(vUv.y * 10.0 , 1.0) ;
   gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part7"> </div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     //8利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.5,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}

```

<div ref="part8"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     //9利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}

```

<div ref="part9"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    //10利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.x * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part10"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    // 11条纹相加
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength += step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part11"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    // 12条纹相乘
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part12"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
    // 13条纹相减
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength -= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part13"></div>

```glsl
precision lowp float;
varying vec2 vUv;
void main(){
     // 14方块图形
    float strength = step(0.2, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.2, mod(vUv.y * 10.0 , 1.0)) ;
     gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part14"></div>

```glsl
precision lowp float;
uniform float uTime;
varying vec2 vUv;

void main(){
    float barX = step(0.4, mod((vUv.x+uTime*0.1) * 10.0 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barY = step(0.4, mod(vUv.y * 10.0 , 1.0))*step(0.8, mod(vUv.x * 10.0 , 1.0))  ;
    float strength = barX+barY;

    gl_FragColor =vec4(strength,strength,strength,1);
}
```

<div ref="part15"></div>

```glsl
precision lowp float;
uniform float uTime;
varying vec2 vUv;
void main(){
    float barX = step(0.4, mod((vUv.x+uTime*0.1) * 10.0 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    float barY = step(0.4, mod(vUv.y * 10.0 , 1.0))*step(0.8, mod(vUv.x * 10.0 , 1.0))  ;
    float strength = barX+barY;

    gl_FragColor = vec4(vUv,1,strength);
}
```

<div ref="part16"></div>

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
    float strength =min(abs(vUv.x - 0.5), abs(vUv.y - 0.5))  ;
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
        uniforms.uTime.value += clock.getDelta();
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    render()

}
// par1
const part1 = ref()

const part1Shader = {
fragmentShader: ` 
#ifdef GL_ES 
precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){ 
    gl_FragColor =vec4(vUv,0,1) ; 
} `,
shaderDom:part1

}
// par2

const part2 = ref()

const part2Shader = {
fragmentShader: ` 
#ifdef GL_ES 
precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){ 
    gl_FragColor =vec4(vUv,1,1) ; 
} `,
shaderDom:part2

}
// part 3

const part3 = ref()

const part3Shader = {
fragmentShader: `
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.x;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,
shaderDom:part3

}

// part4

const part4 = ref()

const part4Shader = {
fragmentShader: `
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.y;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,
shaderDom:part4

}

// part 5

const part5 = ref()

const part5Shader = {
fragmentShader: `
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = 1.0-vUv.y;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,
shaderDom:part5

}
// part6 

const part6 = ref()

const part6Shader = {
fragmentShader: `
 #ifdef GL_ES 
 precision mediump float; 
#endif 
varying vec2 vUv; 
void main(){  
    float strength = vUv.y * 10.0;
     gl_FragColor =vec4(strength,strength,strength,1);; 
} `,
shaderDom:part6

}

//  part7
const part7 = ref()

const part7Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //7利用通过取模达到反复效果
   float strength = mod(vUv.y * 10.0 , 1.0) ;
   gl_FragColor =vec4(strength,strength,strength,1);
}`,
    shaderDom:part7
}

// part8

const part8 = ref()
const part8Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //8利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.5,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part8
}

// part 9
const part9 = ref()
const part9Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     //9利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.y * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part9
}

// part 10

const part10 = ref()
const part10Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    //10利用step(edge, x)如果x < edge，返回0.0，否则返回1.0
    float strength =  mod(vUv.x * 10.0 , 1.0) ;
    strength = step(0.8,strength);
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part10
}


// part 11

const part11 = ref()
const part11Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 11条纹相加
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength += step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part11
}

// part 12

const part12 = ref()
const part12Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 12条纹相乘
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part12
}

// part 13

const part13 = ref()
const part13Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
    // 13条纹相减
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0)) ;
    strength -= step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part13
}

// part 14

const part14 = ref()
const part14Shader = {
    fragmentShader:`
precision lowp float;
varying vec2 vUv;
void main(){
     // 14方块图形
    float strength = step(0.2, mod(vUv.x * 10.0 , 1.0)) ;
    strength *= step(0.2, mod(vUv.y * 10.0 , 1.0)) ;
    gl_FragColor =vec4(strength,strength,strength,1);
}
    `,
    shaderDom:part14
}

// part 15

const part15 = ref()
const part15Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part15
}

// part 16

const part16 = ref()
const part16Shader = {
    fragmentShader:`
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
    `,
    shaderDom:part16
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

onMounted(()=>{
initScene(part1Shader)
initScene(part2Shader)
initScene(part3Shader)
initScene(part4Shader)
initScene(part5Shader)
initScene(part6Shader)
initScene(part7Shader)
initScene(part8Shader)
initScene(part9Shader)
initScene(part10Shader)
    initScene(part11Shader)
    initScene(part12Shader)
    initScene(part13Shader)
    initScene(part14Shader)
    initScene(part15Shader)
    initScene(part16Shader)
    // initScene(part17Shader)
    // initScene(part18Shader)
    // initScene(part19Shader)
    // initScene(part20Shader)
    // initScene(part21Shader)
// setTimeout(()=>{

// },5000)









})

</script>
