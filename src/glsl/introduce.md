---
title: Hello GLSL
category:
  - GLSL
date: 2022-12-01
---

<div ref="shader"></div>

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
	gl_FragColor = vec4(1.0,0.0,1.0,1.0);
}

```

## Fragment Shader(片段着色器)

**Shaders 是一系列的指令，但是这些指令会对屏幕上的每个像素同时下达。**

- shader 语言 有一个 main 函数，会在最后返回颜色值。这点和 C 语言很像。

- 最终的像素颜色取决于预设的全局变量 gl_FragColor。

- 这个类 C 语言有内建的变量（像 gl_FragColor），函数和数据类型。

- vec4 类型，可以推测这四个变元分别响应红，绿，蓝和透明度通道。

- 所有的宏都以 # 开头。预编译会在编译前一刻发生，把所有的命令复制到 #defines 里，检查#ifdef 条件句是否已被定义， #ifndef 条件句是否没有被定义。

- loat 类型在 shaders 中非常重要，所以精度非常重要。更低的精度会有更快的渲染速度，但是会以质量为代价。“低”（precision lowp float;），“高”（precision highp float;）。

- GLSL 语言规范并不保证变量会被自动转换类别。

```glsl
void main() {
    gl_FragColor = vec4(1,0,0,1);   // 出错
}
```

## GLSL

GLSL 代表 openGL Shading Language，openGL 着色语言

<iframe src="https://openglbook.com/chapter-0-preface-what-is-opengl.html" style="width:100%;" height="800px"></iframe>

<script setup>
import * as THREE from 'three'
import {ref,onMounted} from 'vue'

    // 导入轨道控制器
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'

// 1.创建场景
const scene = new THREE.Scene()

// 2.创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)


// 着色器配置
const shaderMaterial = new THREE.ShaderMaterial({
    // vertexShader: `
    // void main(){
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;
    // }
    // `,
    fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif  
    void main(){
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
    `,
    side: THREE.DoubleSide

})


// 创建平面
const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10, 640, 640), shaderMaterial)
scene.add(floor)



// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 4096;
spotLight.shadow.mapSize.height = 4096;


scene.add(spotLight);



// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器大小



const shader = ref()

onMounted(() => {
    renderer.setSize(shader.value.offsetWidth, shader.value.offsetWidth/2)
    renderer.shadowMap.enabled = true
    shader.value.appendChild(renderer.domElement)
    renderer.render(scene,camera)

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器阻尼
    controls.enableDamping = true

    function render() {
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    render()

})


</script>
