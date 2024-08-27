---
title: ThreeJS中的曲线应用
date: 2023-01-02
category:
  - ThreeJS
---

## 球体生成

```js
// 半径
const EARTH_RADIUS = 5;
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
const earthMaterial = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 5,
  map: textureLoader.load("/assets/textures/planets/earth_atmos_2048.jpg"),
  specularMap: textureLoader.load("/assets/textures/planets/earth_specular_2048.jpg"),
  normalMap: textureLoader.load("/assets/textures/planets/earth_normal_2048.jpg"),
  normalScale: new THREE.Vector2(0.85, 0.85),
});
earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth)

```
### SphereGeometry
```js
SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
radius — 球体半径，默认为1。
widthSegments — 水平分段数（沿着经线分段），最小值为3，默认值为32。
heightSegments — 垂直分段数（沿着纬线分段），最小值为2，默认值为16。
phiStart — 指定水平（经线）起始角度，默认值为0。。
phiLength — 指定水平（经线）扫描角度的大小，默认值为 Math.PI * 2。
thetaStart — 指定垂直（纬线）起始角度，默认值为0。
thetaLength — 指定垂直（纬线）扫描角度大小，默认值为 Math.PI。

```

### MeshPhongMaterial




```js
// 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
const raycaster = new THREE.Raycaster();

// 通过摄像机和鼠标位置更新射线
raycaster.setFromCamera(pointer, camera);

// 计算物体和射线的焦点
const intersects = raycaster.intersectObjects(scene.children);

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

```

<div class="motion" ref="motion"></div>

```js
const curveHandles = []; // 曲线控制点数组
  // 初始化曲线控制点，设置成立方样条曲线
  const initialPoints = [
    { x: 1, y: 0, z: -1 },
    { x: 1, y: 0, z: 1 },
    { x: -1, y: 0, z: 1 },
    { x: -1, y: 0, z: -1 },
  ];
  const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const boxMaterial = new THREE.MeshBasicMaterial();
  for (const handlePos of initialPoints) {
    const handle = new THREE.Mesh(boxGeometry, boxMaterial);
    handle.position.copy(handlePos);
    curveHandles.push(handle);
    scene.add(handle);
  }

   // 创建立方样条曲线
 const curve = new THREE.CatmullRomCurve3(
   curveHandles.map((handle) => handle.position)
 );
 curve.curveType = "centripetal"; // 曲线类型(切向加速调整)
 curve.closed = true; // 是否封闭
 // 创建曲线并根据关键点更新线条
 const points = curve.getPoints(50);
 const line = new THREE.LineLoop(
   new THREE.BufferGeometry().setFromPoints(points),
   new THREE.LineBasicMaterial({ color: 0x00ff00 })
 );
 scene.add(line);
 // 加载字体并创建 3D 文本
 const loader = new FontLoader();
 loader.load("fonts/helvetiker_regular.typeface.json", function (font) {
   const geometry = new TextGeometry("Hello three.js!", {
     font: font,
     size: 0.2,
     height: 0.05,
     curveSegments: 12,
     bevelEnabled: true,
     bevelThickness: 0.02,
     bevelSize: 0.01,
     bevelOffset: 0,
     bevelSegments: 5,
   });
   geometry.rotateX(Math.PI);
   const material = new THREE.MeshStandardMaterial({
     color: 0x99ffff,
   });
   const objectToCurve = new THREE.Mesh(geometry, material);
   /*
   
   
   */
   flow = new Flow(objectToCurve);
   flow.updateCurve(0, curve);
   scene.add(flow.object3D);
 });
 // 创建射线对象
 rayCaster = new THREE.Raycaster();
 // 创建变换控制器对象
 control = new TransformControls(camera, renderer.domElement);
 control.addEventListener("dragging-changed", function (event) {
   if (!event.value) {
     const points = curve.getPoints(50);
     line.geometry.setFromPoints(points);
     flow.updateCurve(0, curve);
   }
 });

  // 逐帧动画函数
function animate() {
  requestAnimationFrame(animate);

  // 判断是否点击场景
  if (action === ACTION_SELECT) {
    rayCaster.setFromCamera(mouse, camera);
    action = ACTION_NONE;
    const intersects = rayCaster.intersectObjects(curveHandles, false);
    if (intersects.length) {
      const target = intersects[0].object;
      control.attach(target);
      scene.add(control);
    }
  }

  // 曲线模拟器运动
  if (flow) {
    flow.moveAlongCurve(0.001);
  }

  // 渲染场景
  render();
}
```

<!-- <div ref="modifierCurveRef"></div> -->

<iframe src="/threejs/examples/webgl_modifier_curve.html" :height="width/2" :width="width"></iframe>

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
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
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

const width = ref(900)

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

const modifierCurveRef = ref()

const initModifierCurveRef = () => {
			const ACTION_SELECT = 1, ACTION_NONE = 0;
			const curveHandles = [];
			const mouse = new THREE.Vector2();

			let stats;
			let scene,
				camera,
				renderer,
				rayCaster,
				control,
				flow,
				action = ACTION_NONE;

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera(
					40,
					2,
					1,
					1000
				);
				camera.position.set( 2, 2, 4 );
				camera.lookAt( scene.position );

				const initialPoints = [
					{ x: 1, y: 0, z: - 1 },
					{ x: 1, y: 0, z: 1 },
					{ x: - 1, y: 0, z: 1 },
					{ x: - 1, y: 0, z: - 1 },
				];

				const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
				const boxMaterial = new THREE.MeshBasicMaterial();

				for ( const handlePos of initialPoints ) {

					const handle = new THREE.Mesh( boxGeometry, boxMaterial );
					handle.position.copy( handlePos );
					curveHandles.push( handle );
					scene.add( handle );

				}
				const curve = new THREE.CatmullRomCurve3(
					curveHandles.map( ( handle ) => handle.position )
				);
				curve.curveType = 'centripetal';
				curve.closed = true;

				const points = curve.getPoints( 50 );
				const line = new THREE.LineLoop(
					new THREE.BufferGeometry().setFromPoints( points ),
					new THREE.LineBasicMaterial( { color: 0x00ff00 } )
				);

				scene.add( line );

				//

				const light = new THREE.DirectionalLight( 0xffaa33 );
				light.position.set( - 10, 10, 10 );
				light.intensity = 1.0;
				scene.add( light );

				const light2 = new THREE.AmbientLight( 0x003973 );
				light2.intensity = 1.0;
				scene.add( light2 );

				//
				const loader = new FontLoader();
				loader.load('/fonts/helvetiker_regular.typeface.json', function ( font ) {
          const geometry = new TextGeometry( 'Hello three.js!', {
                font:font,
				  	    size: 0.2,
				  	    height: 0.05,
				  	    curveSegments: 12,
				  	    bevelEnabled: true,
				  	    bevelThickness: 0.02,
				  	    bevelSize: 0.01,
				  	    bevelOffset: 0,
				  	    bevelSegments: 5,
				  } );
				  geometry.rotateX( Math.PI );
				  const material = new THREE.MeshStandardMaterial( {
				  	color: 0x99ffff
				  } );
				  const objectToCurve = new THREE.Mesh( geometry, material );


				  flow = new Flow( objectToCurve );
				  flow.updateCurve( 0, curve );
				  scene.add( flow.object3D );

        })

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				// renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( modifierCurveRef.value.offsetWidth, modifierCurveRef.value.offsetWidth /2  );
				// document.body.appendChild( renderer.domElement );
        modifierCurveRef.value.appendChild(renderer.domElement);

				renderer.domElement.addEventListener( 'pointerdown', onPointerDown );

				rayCaster = new THREE.Raycaster();
				control = new TransformControls( camera, renderer.domElement );
				control.addEventListener( 'dragging-changed', function ( event ) {

					if ( ! event.value ) {

						const points = curve.getPoints( 50 );
						line.geometry.setFromPoints( points );
						flow.updateCurve( 0, curve );

					}
				window.addEventListener( 'resize', onWindowResize );
				} );


			function onWindowResize() {

				// camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( modifierCurveRef.value.offsetWidth, modifierCurveRef.value.offsetWidth /2 );

			}

			function onPointerDown( event ) {

				action = ACTION_SELECT;
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			function animate() {

				requestAnimationFrame( animate );
				if ( action === ACTION_SELECT ) {

					rayCaster.setFromCamera( mouse, camera );
					action = ACTION_NONE;
					const intersects = rayCaster.intersectObjects( curveHandles, false );
          console.log(intersects,'a')
					if ( intersects.length ) {

						const target = intersects[ 0 ].object;
						control.attach( target );
						scene.add( control );

					}

				}

				if ( flow ) {

					flow.moveAlongCurve( 0.001 );

				}

				render();

			}

			function render() {

				renderer.render( scene, camera );

				// stats.update();

			}
      animate()
}

onMounted(()=>{
    init();
    animate();
    initMotion();
    // initModifierCurveRef()
    width.value = motion.value.offsetWidth
})
</script>
<style scoped>

  .curve {
    position:relative;
  }
</style>
