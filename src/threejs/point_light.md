---
title: 点光源
category:
  - ThreeJS
date: 2023-01-24
---

<div ref="point"></div>

<div ref="outLine"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

const point = ref()
const init = () => {
    // 1、创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      2,
      0.1,
      1000
    );
    
    // 设置相机位置
    camera.position.set(0, 0, 20);
    scene.add(camera);
    
    const loader = new RGBELoader();
    loader.load("/assets/textures/hdr/Dosch-Space_0026_4k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
    
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    let mixer;
    gltfLoader.load("/assets/model/jianshen-min.glb", function (gltf) {
    
    });
    
    // 创建一个金属球添加到场景中
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material1 = new THREE.MeshBasicMaterial({
      color: "#ffaa33",
    });
    const sphere = new THREE.Mesh(geometry, material1);
    sphere.position.set(-5, 0, 0);
    sphere.layers.set(1);
    scene.add(sphere);
    
    
    // 创建一个正方体
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshStandardMaterial({
      emissive: 0x33ff33,
    });
    const cube = new THREE.Mesh(geometry2, material2);
    cube.position.set(5, 0, 0);
    scene.add(cube);
    
    // 创建一个纽结体
    const geometry3 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material3 = new THREE.MeshStandardMaterial({
      emissive: 0x33ff33,
    });
    const torusKnot = new THREE.Mesh(geometry3, material3);
    torusKnot.position.set(0, 0, 0);
    scene.add(torusKnot);
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(point.value.offsetWidth, point.value.offsetWidth/2);
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0xcccccc, 1);
    renderer.autoClear = false;
    
    // 添加效果合成
    const composer = new EffectComposer(renderer);
    composer.setSize(point.value.offsetWidth, point.value.offsetWidth/2);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const effect = new UnrealBloomPass(
      new THREE.Vector2(point.value.offsetWidth, point.value.offsetWidth/2),
      0,
      10,
      1
    );
    effect.threshold = 0;
    effect.strength = 3;
    effect.radius = 0.5;
    composer.addPass(effect);
    
    point.value.appendChild(renderer.domElement)
    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
    controls.enableDamping = true;
    
    
    const clock = new THREE.Clock();
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(0);
    
    function render() {
      let time = clock.getDelta();
      if (mixer) {
        // console.log(mixer);
        mixer.update(time);
      }
      controls.update();
    
      renderer.clear();
      camera.layers.set(0);
      composer.render();
      // scene.traverse(restoreMaterial);
      renderer.clearDepth();
      camera.layers.set(1);
      renderer.render(scene, camera);
      //   渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
    
    render();
    
    if(!__VUEPRESS_SSR__){
        window.addEventListener("click", () => {
          cube.layers.set(1);
        });

        // 监听画面变化，更新渲染画面
        window.addEventListener("resize", () => {
          //   更新渲染器
          renderer.setSize(point.value.offsetWidth, point.value.offsetWidth/2);
          //   设置渲染器的像素比
          renderer.setPixelRatio(window.devicePixelRatio);
        });

    }

}

const outLine = ref()

const initPoint = () => {

    // 1、创建场景
    const scene = new THREE.Scene();

    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      2,
      0.1,
      1000
    );
   

    // 设置相机位置
    camera.position.set(0, 0, 20);
    scene.add(camera);

    // 灯光
    // 环境光
    // const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
    // scene.add(light);

    // 添加hdr环境纹理
    const loader = new RGBELoader();
    loader.load("/assets/textures/hdr/Dosch-Space_0026_4k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    // 加载纹理
    const textureLoader = new THREE.TextureLoader();

    // 加载压缩的glb模型
    let material = null;
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    let mixer;
    gltfLoader.load("/assets/model/jianshen-min.glb", function (gltf) {
      // console.log(gltf);
    });

    // 创建一个金属球添加到场景中
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material1 = new THREE.MeshBasicMaterial({
      color: "#ffaa33",
    });
    const sphere = new THREE.Mesh(geometry, material1);
    sphere.position.set(-5, 0, 0);
    sphere.layers.set(1);
    scene.add(sphere);

    // 创建一个正方体
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshStandardMaterial({
      emissive: 0x33ff33,
    });
    const cube = new THREE.Mesh(geometry2, material2);
    cube.position.set(5, 0, 0);
    scene.add(cube);

    // 创建一个纽结体
    const geometry3 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material3 = new THREE.MeshStandardMaterial({
      emissive: 0x33ff33,
    });
    const torusKnot = new THREE.Mesh(geometry3, material3);
    torusKnot.position.set(0, 0, 0);
    scene.add(torusKnot);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(outLine.value.offsetWidth,outLine.value.offsetWidth/2);
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0xcccccc, 1);
    renderer.autoClear = false;

    // 添加效果合成
    const composer = new EffectComposer(renderer);
    composer.setSize(outLine.value.offsetWidth,outLine.value.offsetWidth/2);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);


    const outLinePass = new OutlinePass(
      new THREE.Vector2(outLine.value.offsetWidth,outLine.value.offsetWidth/2),
      scene,
      camera
    );
    outLinePass.edgeStrength = 3;
    outLinePass.edgeGlow = 2;
    outLinePass.edgeThickness = 3;
    outLinePass.pulsePeriod = 2;
    outLinePass.selectedObjects = [torusKnot];
    composer.addPass(outLinePass);

    // console.log(renderer);
    // 将webgl渲染的canvas内容添加到body
    outLine.value.appendChild(renderer.domElement);


    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
    controls.enableDamping = true;

    // 设置时钟
    const clock = new THREE.Clock();
    const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(0);
    const materials = {};
    function render() {
      let time = clock.getDelta();
      if (mixer) {
        // console.log(mixer);
        mixer.update(time);
      }
      controls.update();

      renderer.clear();
      camera.layers.set(0);
      composer.render();
      renderer.clearDepth();
      camera.layers.set(1);
      renderer.render(scene, camera);
      //   渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }

    render();
    if(!__VUEPRESS_SSR__){ 

        // 监听画面变化，更新渲染画面
        window.addEventListener("resize", () => {
          //   更新渲染器
          renderer.setSize(outLine.value.offsetWidth,outLine.value.offsetWidth/2);
          //   设置渲染器的像素比
          renderer.setPixelRatio(window.devicePixelRatio);
        });

        outLine.value.addEventListener("click", () => {
          cube.layers.set(1);
        });

    }



}

onMounted(()=>{
    init()
    initPoint()
})

</script>
