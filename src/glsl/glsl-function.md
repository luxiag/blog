---
title: glsl中的函数
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


onMounted(()=>{
initScene(part1Shader)
initScene(part2Shader)
initScene(part3Shader)
initScene(part4Shader)
initScene(part5Shader)
initScene(part6Shader)




})

</script>
