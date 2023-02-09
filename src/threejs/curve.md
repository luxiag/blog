---
title: 曲线应用
date: 2022-02-09
category:
  - ThreeJS
---

<div ref="curve">

</div>

<script setup>
import { withBase } from '@vuepress/client'

import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const curve = ref();

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

let moon;
let earth;
let chinaPosition;
let chinaLabel;
let chinaDiv;

let camera, scene, renderer, labelRenderer;
const raycaster = new THREE.Raycaster();



function init() {
    // 半径
    const EARTH_RADIUS = 1;
    const MOON_RADIUS = 0.27;

    camera = new THREE.PerspectiveCamera(45,1,0.1,200);
    camera.position.set(0, 5, -10);

    scene = new THREE.Scene();

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 0, -1);
    scene.add(dirLight);

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);

    const earthMaterial = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/earth_atmos_2048.jpg"),
      specularMap: textureLoader.load("/assets/textures/planets/earth_specular_2048.jpg"),
      normalMap: textureLoader.load("/assets/textures/planets/earth_normal_2048.jpg"),
      normalScale: new THREE.Vector2(0.85, 0.85),
    });
     const earth = new THREE.Mesh(earthGeometry, earthMaterial);
     // earth.rotation.y = Math.PI;
     scene.add(earth);


    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/moon_1024.jpg"),
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // 添加提示标签
    const earthDiv = document.createElement('div');
    earthDiv.className = "label";
    earthDiv.innerHTML = "地球";
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0,1,0);
    earth.add(earthLabel);
  
  
      // 中国
    const chinaDiv = document.createElement('div');
    chinaDiv.className = "label1";
    chinaDiv.innerHTML = "中国";
    chinaLabel = new CSS2DObject(chinaDiv);
    chinaLabel.position.set(-0.3,0.5,-0.9);
    earth.add(chinaLabel);
  
    const moonDiv = document.createElement('div');
    moonDiv.className = "label";
    moonDiv.innerHTML = "月球";
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0,0.3,0);
    moon.add(moonLabel);

      // 实例化css2d的渲染器
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(labelRenderer.domElement)
    curve.value.appendChild(labelRenderer.domElement);
    labelRenderer.domElement.style.position = 'fixed';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.zIndex = '10';

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(curve.value.offsetWidth,curve.value.offsetHeight)
    if(!__VUEPRESS_SSR__){
        renderer.setPixelRatio(window.devicePixelRatio)
        window.addEventListener("resize",onWindowResize);
    }

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;

    console.log(curve.value,'curve')
}

function onWindowResize(){
    camera.aspect = curve.value.offsetWidth / curve.value.offsetHeight;
    camera.updateProjectionMatrix();
    if(!__VUEPRESS_SSR__) {
        renderer.setSize(window.innerWidth,window.innerHeight)
        labelRenderer.setSize(window.innerWidth,window.innerHeight);
    }
}

function animate(){
    requestAnimationFrame(animate);

    labelRenderer.render(scene,camera);
    renderer.render(scene,camera)

}
onMounted(()=>{
    init();
    animate();
})
</script>
