---
title: Water
category:
  - ThreeJS
date: 2023-01-22
---

<div ref="waterRef"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 导入water
import { Water } from "three/examples/jsm/objects/Water2";

const waterRef = ref()
const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90,2,0.1,1000);
    camera.position.set(5,5,5)
    scene.add(camera);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync("/assets/textures/hdr/050.hdr").then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    // 加载浴缸
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("/assets/model/yugang.glb", (gltf) => {
      console.log(gltf);
      const yugang = gltf.scene.children[0];
      yugang.material.side = THREE.DoubleSide;

      const waterGeometry = gltf.scene.children[1].geometry;
      const water = new Water(waterGeometry, {
        color: "#ffffff",
        scale: 1,
        flowDirection: new THREE.Vector2(1, 1),
        textureHeight: 1024,
        textureWidth: 1024,
      });

      scene.add(water);
      scene.add(yugang);
    });

    const light = new THREE.AmbientLight(0xffffff); // soft white light
    light.intensity = 10;
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(waterRef.value.offsetWidth,waterRef.value.offsetWidth/2)

    if(!__VUEPRESS_SSR__) {
        // 监听屏幕大小改变的变化，设置渲染的尺寸
        window.addEventListener("resize", () => {
          //   更新渲染器
          renderer.setSize(waterRef.value.offsetWidth,waterRef.value.offsetWidth/2)
          //   设置渲染器的像素比例
          renderer.setPixelRatio(window.devicePixelRatio);
        });

    }
    waterRef.value.appendChild(renderer.domElement)


    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼
    controls.enableDamping = true;

    const clock = new THREE.Clock();
    function animate(t) {
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
