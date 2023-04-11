---
title: Hello GLSL
category:
  - GLSL
date: 2022-10-01
---
参考：《The Book of Shaders》

## Fragment Shader(片段着色器)

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
 gl_FragColor = vec4(1.0,0.0,1.0,1.0);
}

```

<div ref="helloRef"></div>

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

## uniform

每个线程和其他线程之间不能有数据交换，但我们能从 CPU 给每个线程输入数据。因为显卡的架构，所有线程的输入值必须统一（uniform），而且必须设为只读。
输入值叫做 uniform （统一值），它们的数据类型通常为：float, vec2, vec3, vec4, mat2, mat3, mat4, sampler2D and samplerCube。

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
 gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
}

```

<div ref="timeRef"></div>

## gl_FragCoord

gl_FragCoord存储了活动线程正在处理的像素或屏幕碎片的坐标。
因为每个像素的坐标都不同，所以我们把它叫做 varying **（变化值）**。

```glsl

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
vec2 st = gl_FragCoord.xy/u_resolution;
gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}

```
<div ref="fragRef"></div>



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
const helloRef = ref()

const helloShader = {
    fragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        void main(){
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }
        `,
    shaderDom:helloRef

}

const timeRef = ref()
const timeShader = {
    fragmentShader:`
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;

    void main() {
     gl_FragColor = vec4(abs(sin(u_time)),0.0,0.0,1.0);
    }
    `,
    shaderDom:timeRef
}

const fragRef = ref()

const fragShader = {
    fragmentShader:`
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;

    void main() {
     vec2 st = gl_FragCoord.xy/u_resolution;
     gl_FragColor = vec4(st.x,st.y,0.0,1.0);
    }`,
    shaderDom:fragRef
}

onMounted(()=>{
    initScene(helloShader)
    initScene(timeShader)
    initScene(fragShader)
})

</script>
