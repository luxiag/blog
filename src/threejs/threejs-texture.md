---
title: ThreeJS中的纹理
date: 2022-10-10
category:
    - ThreeJS
---

## 纹理的使用

* **map**：漫反射纹理，用于指定材质的baseColor，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **alphaMap**：透明度纹理，用于指定材质的透明度，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **bumpMap**：凹凸贴图，可以再次深化材质的表面，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **normalMap**：法线贴图，可以为表面增加微妙的细节，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **specularMap**：镜面反射贴图，用于指定材质的specular，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **displacementMap**：高度图或位移贴图，用于模拟表面物体位移，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **roughnessMap**：粗糙度贴图，可以模拟表面的粗糙程度，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **metalnessMap**：金属度贴图，用于指定表面的金属部分，可以是THREE.Texture类型的实例对象。默认值为undefined。
* **envMap**：环境贴图，用于模拟环境反射，可以是THREE.Texture类型的实例对象或CubeTexture类型的实例对象。默认值为undefined。


```js
const loader = new THREE.TextureLoader();
 
const material = new THREE.MeshBasicMaterial({
  color: 0xFF8844,
  map: loader.load('resources/images/wall.jpg'),
});

```


```js
// 创建一个基础材质对象
const basicMaterial = new THREE.MeshBasicMaterial({
  // 设置材质的颜色为黄色
  color: "#ffff00",
  // 设置映射纹理为门的颜色纹理
  map: doorColorTexture,
  // 设置门透明度的纹理贴图
  alphaMap: doorAplhaTexture,
  // 允许材质的透明度被纹理影响
  transparent: true,
  // 设置环境遮挡纹理为门的AO纹理
  aoMap: doorAoTexture,
  // 设置AO纹理影响的强度系数
  aoMapIntensity: 1,
  // 设置门的高度贴图纹理用于使门产生凸起效果
  displacementMap: doorHeightTexture,
  // 设置凸起效果的缩放系数，值越高凸起越明显
  displacementScale: 0.1,
  // 设置材质的粗糙度为1
  roughness: 1,
  // 设置粗糙度对应的纹理贴图
  roughnessMap: roughnessTexture,
  // 设置金属度为1
  metalness: 1,
  // 设置金属度对应的纹理贴图
  metalnessMap: metalnessTexture,
  // 设置法线贴图用于制作凹凸效果
  normalMap: normalTexture,
  // 设置材质的透明度，可以通过alphaMap实现这一效果
  // opacity: 0.3,
  // 设置材质的两侧都能被渲染
  side: THREE.DoubleSide,
});
/*
在 Three.js 中，当我们需要对平面几何体进行细分（Subdivision）或进行 Parallax Mapping（视差贴图）时，为了维持高质量的视觉效果，会用到 uv2 属性。
将 uv 属性的值复制给 uv2 属性，就能够在平面几何体进行细分或者 Parallax Mapping 操作时，避免贴图失真产生的模糊或锯齿效果。
这种做法的原理是：在进行细分或 Parallax Mapping 时，需要利用旧的UV映射坐标计算新的UV映射坐标，而复制了一遍的 uv2 属性就可以提供旧的UV映射坐标了。
*/
planeGeometry.setAttribute(
"uv2",
new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

```

<div ref="textureKeyRef"></div>

## 纹理的加载
```js
const loader = new THREE.TextureLoader();
// 1
const texture = loader.load('resources/images/flower-1.jpg');
// 2
loader.load('resources/images/wall.jpg', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);  // 添加到我们要旋转的立方体数组中
});
```

### 多个纹理的加载(LoadingManager)

```js
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
 
const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];
 
loadManager.onLoad = () => {
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);
  cubes.push(cube);  // 添加到我们要旋转的立方体数组中
};

```

### 设置纹理加载进度
```js
let event = {};
event.onLoad = function () {
  console.log("图片加载完成");
};
event.onProgress = function (url, num, total) {
  console.log("图片加载完成:", url);
  console.log("图片加载进度:", num);
  console.log("图片总数:", total);
  let value = ((num / total) * 100).toFixed(2) + "%";
  console.log("加载进度的百分比：", value);
  div.innerHTML = value;
};
event.onError = function (e) {
  console.log("图片加载出现错误");
  console.log(e);
};
// 设置加载管理器
const loadingManager = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);

```
<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const textureKeyRef = ref()

const initTextureRef = () => {
 
  const scene = new THREE.Scene()


  const textureLoader = new THREE.TextureLoader();
  const doorColorTexture = textureLoader.load("/assets/textures/door/color.jpg");
  const doorAplhaTexture = textureLoader.load("/assets/textures/door/alpha.jpg");
  const doorAoTexture = textureLoader.load(
    "/assets/textures/door/ambientOcclusion.jpg"
  );
  //导入置换贴图
const doorHeightTexture = textureLoader.load("/assets/textures/door/height.jpg");
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load("/assets/textures/door/roughness.jpg");
// 导入金属贴图
const metalnessTexture = textureLoader.load("/assets/textures/door/metalness.jpg");
// 导入法线贴图
const normalTexture = textureLoader.load("/assets/textures/door/normal.jpg");

const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  roughness: 1,
  roughnessMap: roughnessTexture,
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
    //   opacity: 0.3,
  side: THREE.DoubleSide,
  });
  // 添加平面
  const planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
  const plane = new THREE.Mesh(planeGeometry, basicMaterial);
//   plane.position.set(3, 0, 0);
  
  scene.add(plane);
    planeGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
    );

  // 摄相机
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 10);
  camera.position.set(0, 0, 1) 
  scene.add(camera)

 const renderer = new THREE.WebGLRenderer();
  if(!__VUEPRESS_SSR__) {
      renderer.setPixelRatio( window.devicePixelRatio );
      window.addEventListener("resize",onWindowResize)
  }

  renderer.setSize(textureKeyRef.value.offsetWidth, textureKeyRef.value.offsetWidth/2)
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
  controls.enableDamping = true;
  textureKeyRef.value.appendChild(renderer.domElement)

  // 之后将场景和摄像机传递给渲染器来渲染出整个场景。
  renderer.render(scene, camera);

//   const light = new THREE.DirectionalLight(0xffffff, 1);
//   light.position.set(-1, 2, 4);
//   scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 0, 10);
  scene.add(directionalLight);


  function render(time) {
      controls.update();
      renderer.render(scene, camera)
      requestAnimationFrame(render)
  }
  function onWindowResize(){
    if(!__VUEPRESS_SSR__) {
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(helloCube.value.offsetWidth, helloCube.value.offsetWidth/2)

    }
  }
  render()
}
onMounted(()=>{
    initTextureRef()
})
 </script>