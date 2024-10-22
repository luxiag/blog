---
title: 孔明灯
date: 2023-01-16
category:
  - ThreeJS
---


## [mapping](https://threejs.org/docs/index.html?q=textures#api/zh/constants/Textures)

定义了纹理贴图的映射模式。
```js
Texture.mapping = THREE.UVMapping;
```

## gl_FrontFacing

gl_FrontFacing变量是一个布尔值，如果当前片段是正面的一部分那么就是true，否则就是false。

```js
if(gl_FrontFacing){
     gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
     // gl_FragColor = vec4(1,1,1,1);
 }else{
     gl_FragColor = vec4(mixColor.xyz,1);
 }

```

<div ref="lantern"></div>


<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const lantern = ref()


const init = () => {
    // 初始化场景
    const scene = new THREE.Scene();

    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(
      90,
      2,
      0.1,
      1000
    );

    const rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync("/assets/textures/2k.hdr").then((texture) => {
        // 图像将如何应用到物体（对象）上
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            precision lowp float;
            varying vec4 vPosition;
            varying vec4 gPosition;
            void main(){
                vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

                vPosition = modelPosition;
                gPosition = vec4( position, 1.0 );
                gl_Position =  projectionMatrix * viewMatrix * modelPosition;
            }
        `,
        fragmentShader:`
            precision lowp float;
            varying vec4 vPosition;
            varying vec4 gPosition;

            void main(){
                vec4 redColor = vec4(1,0,0,1);
                vec4 yellowColor = vec4(1,1,0.5,1);
                vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);



                if(gl_FrontFacing){
                    gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
                    // gl_FragColor = vec4(1,1,1,1);
                }else{
                    gl_FragColor = vec4(mixColor.xyz,1);
                }
            }  
        `,
        uniforms:{},
        side:THREE.DoubleSide
    })

    const renderer = new THREE.WebGLRenderer()
    // 定义渲染器的输出编码。
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 色调映射的曝光级别。
    renderer.toneMappingExposure = 0.2;


    const gltfLoader = new GLTFLoader()
    let LightBox = null 

    gltfLoader.load("/assets/model/flyLight.glb",(gltf) => {
        LightBox = gltf.scene.children[1]

        LightBox.material = shaderMaterial;
        
        for (let i = 0; i < 150; i++) {
          let flyLight = gltf.scene.clone(true);
          let x = (Math.random() - 0.5) * 300;
          let z = (Math.random() - 0.5) * 300;
          let y = Math.random() * 60 + 25;
          flyLight.position.set(x, y, z);
          gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1,
          });
          gsap.to(flyLight.position, {
            x: "+=" + Math.random() * 5,
            y: "+=" + Math.random() * 20,
            yoyo: true,
            duration: 5 + Math.random() * 10,
            repeat: -1,
          });
          scene.add(flyLight);
        }

    })

    renderer.setSize(lantern.value.offsetWidth,lantern.value.offsetWidth/2)

    if(!__VUEPRESS_SSR__) {
        window.addEventListener("resize", () => {
        //   更新渲染器
        renderer.setSize(lantern.value.offsetWidth,lantern.value.offsetWidth/2)

        //   设置渲染器的像素比例
        renderer.setPixelRatio(window.devicePixelRatio);
        });        
    }
    lantern.value.appendChild(renderer.domElement)

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼
    controls.enableDamping = true;
    // 设置自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.maxPolarAngle = (Math.PI / 3) * 2;
    controls.minPolarAngle = (Math.PI / 3) * 2;

    const clock = new THREE.Clock();
    function animate(t) {
      controls.update();
      const elapsedTime = clock.getElapsedTime();

      requestAnimationFrame(animate);
      // 使用渲染器渲染相机看这个场景的内容渲染出来
      renderer.render(scene, camera);
    }

    animate();
}
onMounted(()=>{
    init()
})
</script>
