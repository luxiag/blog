---
title: ThreeJS中的水
category:
  - ThreeJS
date: 2022-02-22
---

```js
import { Water } from "three/examples/jsm/objects/Water2";

// 创建用于水面的平面几何体
const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

// 创建 Water 对象所需的选项
const waterOptions = {
  color: '#abcdef', // 水体颜色
  scale: 4, // 波浪大小
  flowDirection: new THREE.Vector2(1, 1), // 水流方向
  textureWidth: 1024, // 纹理宽度
  textureHeight: 1024, // 纹理高度
  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。
  normalMap0: normalTexture, 
  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感
  normalMapUrl0: 'textures/waternormals.jpg',
  // 这里也可以直接将贴图赋值给 normalMap0
  envMap: cubeRenderTarget.texture, // 反射天空盒的立方体纹理
  receiveShadow: true, // 是否接收阴影
  distortionScale: 3.7, // 扭曲效果的大小
  fog: scene.fog !== undefined // 是否启用雾效果 
};

// 创建 Water 对象
const water = new THREE.Water(waterGeometry, waterOptions);

// 将 Water 对象添加到场景中
scene.add(water);
```

<div ref="waterRef"></div>

```js
import { Water } from 'three/addons/objects/Water.js';
const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );
water = new Water(
	waterGeometry,
	{
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		} ),
		sunDirection: new THREE.Vector3(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 3.7,
		fog: scene.fog !== undefined
	}
);
water.rotation.x = - Math.PI /2
function render(){
  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
}

// 落日
import { Sky } from 'three/addons/objects/Sky.js';
sun = new THREE.Vector3();
const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.unifor
skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.8;

/*
创建了一个预计算辐射度环境贴图（pre-computed radiance environment map，PMREM）生成器。
PMREMGenerator 是 Three.js 物体材质中用于实现基于物理的渲染（PBR）的重要组件之一。

在 Three.js 中，PBR 材质需要使用辐射度环境贴图来提供场景的照明信息，
而预计算辐射度环境贴图是一种预先计算和缓存辐射度环境贴图的技术，可以提高实时渲染的效率和质量。

通过传递渲染器对象作为参数，PMREMGenerator 可以根据当前场景和光照计算出辐射度环境贴图，
并将其缓存在内存中，方便后续使用。在使用 PBR 材质时，
我们可以通过调用 PMREMGenerator 的相关方法来获取需要的辐射度环境贴图。

*/ 
const pmremGenerator = new THREE.PMREMGenerator( renderer );

const parameters = {
	elevation: 2,
	azimuth: 180
};
let renderTarget;
//根据当前的太阳方位和高度来更新天空和水面的着色，使其看起来仿佛是在现实世界中受到了真实的自然光照射。
function updateSun() {
  //将 phi 和 theta 转换为弧度制
	const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
	const theta = THREE.MathUtils.degToRad( parameters.azimuth );
  // 计算太阳位置
	sun.setFromSphericalCoords( 1, phi, theta );
  // 将太阳位置应用到天空和水面
	sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
	water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
  // 释放之前的渲染
	if ( renderTarget !== undefined ) renderTarget.dispose();
  //使用 fromScene 方法从 sky 中生成一个新的渲染目标对象。
  //这个渲染目标对象是通过预计算辐射度环境贴图生成器 pmremGenerator 计算出来的
	renderTarget = pmremGenerator.fromScene( sky );
  //将渲染目标的材质设置为场景的环境贴图。
	scene.environment = renderTarget.texture;
}
```

<div ref="oceanRef" class="ocean"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 导入water
import { Water as Water2 } from "three/examples/jsm/objects/Water2";
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
let dat;
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
      const water = new Water2(waterGeometry, {
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

const oceanRef = ref()
const initOcean = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(oceanRef.value.offsetWidth,oceanRef.value.offsetWidth/2)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    oceanRef.value.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55,2,1,20000);
    camera.position.set(30,30,100);

    const sun = new THREE.Vector3();

    const waterGeometry = new THREE.PlaneGeometry(10000,10000);

    const water = new Water(waterGeometry,{
      			textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: scene.fog !== undefined
    })
    water.rotation.x = -Math.PI /2;

    scene.add(water)
		const sky = new Sky();
		sky.scale.setScalar( 10000 );
		scene.add( sky );

		const skyUniforms = sky.material.uniforms
		skyUniforms[ 'turbidity' ].value = 10;
		skyUniforms[ 'rayleigh' ].value = 2;
		skyUniforms[ 'mieCoefficient' ].value = 0.005;
		skyUniforms[ 'mieDirectionalG' ].value = 0.8
		const parameters = {
			elevation: 2,
			azimuth: 180
		};

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;
		function updateSun(){ 
			const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
			const theta = THREE.MathUtils.degToRad( parameters.azimuth )
			sun.setFromSphericalCoords( 1, phi, theta )
			sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
			water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize()
			if ( renderTarget !== undefined ) renderTarget.dispose()
			renderTarget = pmremGenerator.fromScene( sky )
			scene.environment = renderTarget.texture
    }
		updateSun();

		const geometry = new THREE.BoxGeometry( 30, 30, 30 );
		const material = new THREE.MeshStandardMaterial( { roughness: 0 } )
		const mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		const controls = new OrbitControls( camera, renderer.domElement );
		controls.maxPolarAngle = Math.PI * 0.495;
		controls.target.set( 0, 10, 0 );
		controls.minDistance = 40.0;
		controls.maxDistance = 200.0;
		controls.update();
    const gui = new dat.GUI();
    oceanRef.value.appendChild(gui.domElement)
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top="0px";
    gui.domElement.style.right="0px";
		const folderSky = gui.addFolder( 'Sky' );
		folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
		folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
		folderSky.open()
		const waterUniforms = water.material.uniforms
		const folderWater = gui.addFolder( 'Water' );
		folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
		folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
		folderWater.open();

    window.addEventListener( 'resize', onWindowResize );

		function onWindowResize() {
			// camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(oceanRef.offsetWidth,oceanRef.offsetWidth/2)
		}
		function animate() {
			requestAnimationFrame( animate );
			render();
			// stats.update();
		}
    
		function render() {
			const time = performance.now() * 0.001;
			mesh.position.y = Math.sin( time ) * 20 + 5;
			mesh.rotation.x = time * 0.5;
			mesh.rotation.z = time * 0.51;
			water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
			renderer.render( scene, camera );
		}
    animate()
}


onMounted(async ()=>{
   dat = await import('dat.gui')
    init()
    initOcean()
})
</script>
<style scoped>
  .ocean {
    position:relative;
  }
</style>