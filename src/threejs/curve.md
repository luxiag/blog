---
title: 曲线应用
date: 2023-01-02
category:
  - ThreeJS
---

```js
// 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
const raycaster = new THREE.Raycaster();

// 通过摄像机和鼠标位置更新射线
raycaster.setFromCamera(pointer, camera);

// 计算物体和射线的焦点
const intersects = raycaster.intersectObjects(scene.children);

moon.position.set(Math.sin(elapsed) * 8, 0, Math.cos(elapsed) * 8);

```

<div class="curve" ref="curve">

</div>

```js
  // 从一系列的点创建一条平滑的三维样条曲线。
  curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(-5, 5, 5),
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(5, -5, 5),
      new THREE.Vector3(10, 0, 10),
    ],
    true
  );
  // 使用getPoint（t）返回一组divisions+1的点
  const points = curve.getPoints(500);
  // 通过点队列设置该 BufferGeometry 的 attribute。
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject);

  const elapsed = clock.getElapsedTime();
  const time = elapsed/10%1;
  const point = curve.getPoint(time);

  moon.position.copy(point);


```

<div class="motion" ref="motion"></div>

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
const motion = ref();

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
    const EARTH_RADIUS = 5;
    const MOON_RADIUS = 0.5;

    camera = new THREE.PerspectiveCamera(75,2,0.1,200);
    camera.position.set(0, 5, -10);

    scene = new THREE.Scene();

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 0, 1);

    scene.add(dirLight);

    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);

    const earthMaterial = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/earth_atmos_2048.jpg"),
      specularMap: textureLoader.load("/assets/textures/planets/earth_specular_2048.jpg"),
      normalMap: textureLoader.load("/assets/textures/planets/earth_normal_2048.jpg"),
      normalScale: new THREE.Vector2(0.85, 0.85),
    });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    //  earth.rotation.y = +Math.PI;
    scene.add(earth);


    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/moon_1024.jpg"),
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);


    // const axesHelper = new THREE.AxesHelper( 15 );
    // axesHelper.position.set(0,0,0)
    // scene.add( axesHelper );
    // 添加提示标签
    const earthDiv = document.createElement('div');
    earthDiv.className = "label";
    earthDiv.innerHTML = "地球";
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0,6,0);
    earth.add(earthLabel);
  


      // 中国
    const chinaDiv = document.createElement('div');
    chinaDiv.className = "label1";
    chinaDiv.innerHTML = "中国";
    chinaLabel = new CSS2DObject(chinaDiv);
    chinaLabel.position.set(-1.5,2.5,-5);
    earth.add(chinaLabel);
  
    const moonDiv = document.createElement('div');
    moonDiv.className = "label";
    moonDiv.innerHTML = "月球";
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0,1,0);
    moon.add(moonLabel);

      // 实例化css2d的渲染器
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(curve.value.offsetWidth,curve.value.offsetWidth / 2);
    // document.body.appendChild(labelRenderer.domElement)
    curve.value.appendChild(labelRenderer.domElement);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.height = '100%';
    labelRenderer.domElement.style.width = '100%';
    // console.log(labelRenderer.domElement.style,'style')

    // labelRenderer.domElement.style.left = '0px';
    // labelRenderer.domElement.style.zIndex = '10';

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(curve.value.offsetWidth,curve.value.offsetWidth / 2)
    curve.value.appendChild(renderer.domElement)
    if(!__VUEPRESS_SSR__){
        renderer.setPixelRatio(window.devicePixelRatio)
        window.addEventListener("resize",onWindowResize);
    }
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;


}

function onWindowResize(){
    camera.aspect =  2;
    camera.updateProjectionMatrix();
    if(!__VUEPRESS_SSR__) {
      labelRenderer.setSize(curve.value.offsetWidth,curve.value.offsetWidth / 2);
      renderer.setSize(curve.value.offsetWidth,curve.value.offsetWidth / 2)
        // renderer.setSize(window.innerWidth,window.innerHeight)
        // labelRenderer.setSize(window.innerWidth,window.innerHeight);
    }
}

function animate(){

  labelRenderer.render(scene,camera);
  const elapsed = clock.getElapsedTime();
  moon.position.set(Math.sin(elapsed) * 8, 0, Math.cos(elapsed) * 8);
  renderer.render(scene,camera);

  
  const chinaPosition = chinaLabel.position.clone();
  // 计算出标签跟摄像机的距离
  const labelDistance = chinaPosition.distanceTo(camera.position);
  // 检测射线的碰撞
  // chinaLabel.position
  // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
  chinaPosition.project(camera);
  raycaster.setFromCamera(chinaPosition,camera);

  const intersects = raycaster.intersectObjects(scene.children,true)
  // console.log(intersects)
    // console.log(chinaLabel.element.style,'aaa')
  
  // 如果没有碰撞到任何物体，那么让标签显示
  if(intersects.length == 0){
    chinaLabel.element.style.visibility = 'initial'
    // chinaLabel.element.classList.add('visible');
    
  }else{
    // if(labelDistance)
    const minDistance = intersects[0].distance;
    if(minDistance<labelDistance){
    chinaLabel.element.style.visibility = 'hidden'
    }else{
    chinaLabel.element.style.visibility = 'initial'
    }
    
  }


  requestAnimationFrame(animate);


}


function initMotion(){
    let moon;
    let earth;
    let curve;
    let camera, scene, renderer;

    const EARTH_RADIUS = 5;
    const MOON_RADIUS = 0.5;

    camera = new THREE.PerspectiveCamera(75,2,0.1,200);
    camera.position.set(0, 5, -10);

    scene = new THREE.Scene();

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 0, 1);

    scene.add(dirLight);

    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);

    const earthMaterial = new THREE.MeshPhongMaterial({
      specular: 0x333333,
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/earth_atmos_2048.jpg"),
      specularMap: textureLoader.load("/assets/textures/planets/earth_specular_2048.jpg"),
      normalMap: textureLoader.load("/assets/textures/planets/earth_normal_2048.jpg"),
      normalScale: new THREE.Vector2(0.85, 0.85),
    });
     earth = new THREE.Mesh(earthGeometry, earthMaterial);
     earth.position.z = -4;
    //  earth.rotation.y = +Math.PI;
     scene.add(earth);


    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 5,
      map: textureLoader.load("/assets/textures/planets/moon_1024.jpg"),
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);
    // 从一系列的点创建一条平滑的三维样条曲线。
    curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10),
      ],
      true
    );
     // 在曲线里，getPoints获取51个点
    const points = curve.getPoints(500);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    renderer = new THREE.WebGLRenderer();
    if(!__VUEPRESS_SSR__) {
        renderer.setPixelRatio(window.devicePixelRatio);
        window.addEventListener("resize", onWindowResize);
    }
    renderer.setSize(motion.value.offsetWidth,motion.value.offsetWidth/ 2);
    motion.value.appendChild(renderer.domElement)
    renderer.render(scene,camera)

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;

    function onWindowResize(){
        camera.aspect =  2;
        camera.updateProjectionMatrix();
        if(!__VUEPRESS_SSR__) {
          renderer.setSize(motion.value.offsetWidth,motion.value.offsetWidth / 2);
        }
    }

    function animate(){
        renderer.render(scene, camera);

        const elapsed = clock.getElapsedTime();
        const time = elapsed/10%1;
        const point = curve.getPoint(time);
        moon.position.copy(point);

        camera.position.copy(point);
        camera.lookAt(earth.position)
        requestAnimationFrame(animate)

    }
  
    animate()

}
onMounted(()=>{
    init();
    animate();
    initMotion();
})
</script>
<style scoped>

  .curve {
    position:relative;
  }
</style>
