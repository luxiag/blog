---
title: ThreeJS中的效果合成器
category:
  - ThreeJS
date: 2022-03-02
---


```js
//outline pass 创建高亮轮廓
// 创建 Outline Pass，传入轮廓边框的大小，场景以及相机
const outLinePass = new OutlinePass(
  new THREE.Vector2(outLine.value.offsetWidth,outLine.value.offsetWidth/2), // 轮廓边框大小
  scene, // 场景
  camera // 相机
);

// 设置轮廓边框的强度
outLinePass.edgeStrength = 3;

// 设置轮廓边框的炫光强度
outLinePass.edgeGlow = 2;

// 设置轮廓边框的粗细
outLinePass.edgeThickness = 3;

// 设置轮廓边框的动画效果周期（单位为秒）
outLinePass.pulsePeriod = 2;

// 设置需要进行轮廓边框高亮的物体，这里只选择了一个 torusKnot
outLinePass.selectedObjects = [torusKnot];

// 将 Outline Pass 添加到渲染的 Pass 中
composer.addPass(outLinePass);

// renderPass
/*
RenderPass 是 Three.js 中的一个渲染器通道，它用于将场景中的一部分物体单独渲染到屏幕上。RenderPass 可以用于实现多种效果，
例如描边（Outline）、后期处理（Post-processing）、阴影等。

Renderer 是 Three.js 中的渲染器，它是实现 Three.js 渲染功能的核心组件。
Renderer 主要负责将场景中的对象转换成可视图像，并输出到屏幕或者图片等媒介上。它支持多种渲染方式，例如 Canvas、WebGL、SVG等。

简单来讲，RenderPass 是 Renderer 的一种子组件，它主要用于实现某些特殊效果的渲染流程，
而 Renderer 则是 Three.js 的主渲染器，它负责将所有物体渲染到屏幕上或其他媒介上。
*/
//EffectComposer
/*
EffectComposer 是 Three.js 中用于实现后期处理（post-processing）效果的函数。
它可以将场景、相机和渲染器作为参数，并且可以将不同的 RenderPass 串联起来，形成连续的后期处理效果。
具体来说，EffectComposer 中会包含多个用于控制后期处理流程的渲染通道，如 RenderPass、ShaderPass 等。

实现后期处理效果一般需要多次渲染，其中第一次是将场景渲染到纹理（render-to-texture）中，然后应用渲染通道，最终将结果渲染到屏幕上。

*/
const composer = new EffectComposer(renderer);
composer.setSize(outLine.value.offsetWidth,outLine.value.offsetWidth/2);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
composer.render();
```

<div ref="outLine">
</div>

`UnrealBloomPass`
实现逼真的bloom（即景物周围余晖）效果

- `new THREE.Vector2( window.innerWidth, window.innerHeight )`：表示渲染的分辨率大小。
- `strength`：效果强度，默认值为1。
- `radius`：半径大小，默认值为0。
- `threshold`：阈值大小，影响只有高于这个值的颜色才会产生bloom效果，默认值为0。

```js
// 定义两个场景用于渲染全屏普通场景和只有发光效果的场景
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
// 定义一个全局变量，用于标识需要渲染发光效果的物体
const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

// 定义一个黑色材质，用于替换发光物体原来的材质
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

// 定义后期处理参数
const params = {
 exposure: 1, // 曝光度
 bloomStrength: 5, // 发光强度
 bloomThreshold: 0, // 亮度阈值，用于发光对象的选择
 bloomRadius: 0, // 发光的扩散半径
 scene: 'Scene with Glow' // 默认场景类型
};
// 创建 UnrealBloomPass 后期处理器，用于实现物体发光效果
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

// 创建一个普通场景渲染器
const renderScene = new RenderPass( scene, camera );

// 创建渲染器，用于渲染只有发光效果的场景
const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

// 初始化场景
function setupScene() {
 scene.traverse( disposeMaterial );
 scene.children.length = 0;

 const geometry = new THREE.IcosahedronGeometry( 1, 15 );

 for ( let i = 0; i < 50; i ++ ) {
  const color = new THREE.Color();
  color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

  const material = new THREE.MeshBasicMaterial( { color: color } );
  const sphere = new THREE.Mesh( geometry, material );
  sphere.position.x = Math.random() * 10 - 5;
  sphere.position.y = Math.random() * 10 - 5;
  sphere.position.z = Math.random() * 10 - 5;
  sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 );
  sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
  scene.add( sphere );
  if ( Math.random() < 0.25 ) sphere.layers.enable( BLOOM_SCENE );
 }

 render();
}

// 渲染发光效果
function render(  ) {
  camera.layers.set( BLOOM_SCENE );
  bloomComposer.render();
  camera.layers.set( ENTIRE_SCENE );
}
function onPointerDown( event ) {
 mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
 mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
 raycaster.setFromCamera( mouse, camera );
 const intersects = raycaster.intersectObjects( scene.children, false );
 if ( intersects.length > 0 ) {
  const object = intersects[ 0 ].object;
  object.layers.toggle( BLOOM_SCENE );
  render();
 }
}
//渲染不同的场景
//
// 渲染函数，根据 params 中定义的场景类型选择不同的渲染方式
function render() {
 switch ( params.scene ) {
  case 'Scene only':
   renderer.render( scene, camera );
   break;
  case 'Glow only':
   renderBloom( false );
   break;
  case 'Scene with Glow':
  default:
   // render scene with bloom
   renderBloom( true );

   // render the entire scene, then render bloom scene on top
   finalComposer.render();
   break;
 }
}
// 渲染发光效果
function renderBloom( mask ) {
 if ( mask === true ) { // 只渲染发光物体
  scene.traverse( darkenNonBloomed );
  bloomComposer.render();
  scene.traverse( restoreMaterial );
 } else { // 渲染整个场景包括发光效果
  camera.layers.set( BLOOM_SCENE );
  bloomComposer.render();
  camera.layers.set( ENTIRE_SCENE );
 }
}
function darkenNonBloomed( obj ) {
 if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
  materials[ obj.uuid ] = obj.material;
  obj.material = darkMaterial;
 }
}
function restoreMaterial( obj ) {
 if ( materials[ obj.uuid ] ) {
  obj.material = materials[ obj.uuid ];
  delete materials[ obj.uuid ];
 }
}



```

<div ref="bloomRef" class="bloom"></div>



# 参考
参考：<https://threejs.org/>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";

let dat;

// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const outLine = ref()

const initPoint = () => {

    // 1、创建场景
    const scene = new THREE.Scene();

    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      2,
      0.1,
      100
    );

    // 设置相机位置
    camera.position.set(0, 0, 20);
    scene.add(camera);

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
    // renderer.setClearColor(0xcccccc, 1);
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

const bloomRef = ref()

const initBloom = () => {
   const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

   const bloomLayer = new THREE.Layers();
   bloomLayer.set( BLOOM_SCENE );

   const params = {
    exposure: 1,
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0,
    scene: 'Scene with Glow'
   };

   const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
   const materials = {};
   const renderer = new THREE.WebGLRenderer( { antialias: true } );

   renderer.setSize( bloomRef.value.offsetWidth, bloomRef.value.offsetWidth/2 );
   renderer.toneMapping = THREE.ReinhardToneMapping;
   bloomRef.value.appendChild(renderer.domElement)

   const scene = new THREE.Scene();

   const camera = new THREE.PerspectiveCamera( 40, 2, 1, 200 );
   camera.position.set( 0, 0, 20 );
   camera.lookAt( 0, 0, 0 );

   const controls = new OrbitControls( camera, renderer.domElement );
   controls.maxPolarAngle = Math.PI * 0.5;
   controls.minDistance = 1;
   controls.maxDistance = 100;
   controls.addEventListener( 'change', render );

   scene.add( new THREE.AmbientLight( 0x404040 ) );

   const renderScene = new RenderPass( scene, camera );

   const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
   bloomPass.threshold = params.bloomThreshold;
   bloomPass.strength = params.bloomStrength;
   bloomPass.radius = params.bloomRadius;

   const bloomComposer = new EffectComposer( renderer );
   bloomComposer.renderToScreen = false;
   bloomComposer.addPass( renderScene );
   bloomComposer.addPass( bloomPass );

   const finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
     uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
     },
     vertexShader: `
         varying vec2 vUv;

         void main() {

          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

         }
          `,
     fragmentShader: `
         uniform sampler2D baseTexture;
         uniform sampler2D bloomTexture;

         varying vec2 vUv;

         void main() {

          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

         }
          `,
     defines: {}
    } ), 'baseTexture'
   );
   finalPass.needsSwap = true;

   const finalComposer = new EffectComposer( renderer );
   finalComposer.addPass( renderScene );
   finalComposer.addPass( finalPass );

   const raycaster = new THREE.Raycaster();

   const mouse = new THREE.Vector2();

   bloomRef.value.addEventListener( 'pointerdown', onPointerDown );

      const gui = new dat.GUI()
      gui.domElement.style.position = 'absolute';
      gui.domElement.style.top="0px";
      gui.domElement.style.right="0px";
      bloomRef.value.appendChild(gui.domElement)

   gui.add( params, 'scene', [ 'Scene with Glow', 'Glow only', 'Scene only' ] ).onChange( function ( value ) {

    switch ( value )  {

     case 'Scene with Glow':
      bloomComposer.renderToScreen = false;
      break;
     case 'Glow only':
      bloomComposer.renderToScreen = true;
      break;
     case 'Scene only':
      // nothing to do
      break;

    }

    render();

   } );

   const folder = gui.addFolder( 'Bloom Parameters' );

   folder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

    renderer.toneMappingExposure = Math.pow( value, 4.0 );
    render();

   } );

   folder.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

    bloomPass.threshold = Number( value );
    render();

   } );

   folder.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {

    bloomPass.strength = Number( value );
    render();

   } );

   folder.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    bloomPass.radius = Number( value );
    render();

   } );

   setupScene();

   function onPointerDown( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children, false );
    if ( intersects.length > 0 ) {

     const object = intersects[ 0 ].object;
     object.layers.toggle( BLOOM_SCENE );
     render();

    }

   }

   window.onresize = function () {

    const width =bloomRef.value.offsetWidth;
    const height = bloomRef.value.offsetWidth/2;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

    bloomComposer.setSize( width, height );
    finalComposer.setSize( width, height );

    render();

   };

   function setupScene() {

    scene.traverse( disposeMaterial );
    scene.children.length = 0;

    const geometry = new THREE.IcosahedronGeometry( 1, 15 );

    for ( let i = 0; i < 50; i ++ ) {

     const color = new THREE.Color();
     color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

     const material = new THREE.MeshBasicMaterial( { color: color } );
     const sphere = new THREE.Mesh( geometry, material );
     sphere.position.x = Math.random() * 10 - 5;
     sphere.position.y = Math.random() * 10 - 5;
     sphere.position.z = Math.random() * 10 - 5;
     sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 );
     sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
     scene.add( sphere );

     if ( Math.random() < 0.25 ) sphere.layers.enable( BLOOM_SCENE );

    }

    render();

   }

   function disposeMaterial( obj ) {

    if ( obj.material ) {

     obj.material.dispose();

    }

   }

   function render() {

    switch ( params.scene ) {

     case 'Scene only':
      renderer.render( scene, camera );
      break;
     case 'Glow only':
      renderBloom( false );
      break;
     case 'Scene with Glow':
     default:
      // render scene with bloom
      renderBloom( true );

      // render the entire scene, then render bloom scene on top
      finalComposer.render();
      break;

    }

   }

   function renderBloom( mask ) {

    if ( mask === true ) {

     scene.traverse( darkenNonBloomed );
     bloomComposer.render();
     scene.traverse( restoreMaterial );

    } else {

     camera.layers.set( BLOOM_SCENE );
     bloomComposer.render();
     camera.layers.set( ENTIRE_SCENE );

    }

   }

   function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

     materials[ obj.uuid ] = obj.material;
     obj.material = darkMaterial;

    }

   }

   function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

     obj.material = materials[ obj.uuid ];
     delete materials[ obj.uuid ];

    }

   }
}

onMounted(async()=>{
    dat = await import('dat.gui')
    initPoint()
    initBloom()
})

</script>
<style scoped>
  .bloom {
    position:relative;
  }
</style>
