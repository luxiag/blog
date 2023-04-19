---
title: ThreeJS中的曲线应用
date: 2022-02-01
category:
  - ThreeJS
---


## 曲线运动

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

```

<div ref="modifierCurveRef"></div>

<script setup>

import { withBase } from '@vuepress/client'

import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
const motion = ref();

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();


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

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 5;
    // controls.maxDistance = 100;

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
        moon.position.set(Math.sin(elapsed) * 8, 0, Math.cos(elapsed) * 8);
        const point = curve.getPoint(time);
        // moon.position.copy(point);

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
    initMotion();
    initModifierCurveRef()
})
</script>
<style scoped>

  .curve {
    position:relative;
  }
</style>
