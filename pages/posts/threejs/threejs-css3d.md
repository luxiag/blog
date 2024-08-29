---
title: ThreeJS中的CSS
category: 
    - ThreeJS
date: 2022-04-12
---
参考：https://threejs.org/

```js
const createTag = (object3d) => {
    // 创建各个区域的元素
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
}

```


<div class="scene" ref="sceneRef">
  <div class="btn-list">
    <div @click="showWall"><a>厂房外形展示</a></div>
    <div @click="showAll"><a>厂房分层展开</a></div>
    <div @click="showFloor1"><a>展示第一层楼</a></div>
    <div @click="showFloor2"><a>展示第二层楼</a></div>
  </div>
  <!-- <div class="css3d-render" ref="css3dRef"></div> -->
</div>

```js
const targets = { table: [], sphere: [], helix: [], grid: [] };
// table
for ( let i = 0; i < table.length; i += 5 ) {
	const element = document.createElement( 'div' );
	element.className = 'element';
	element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
	const number = document.createElement( 'div' );
	number.className = 'number';
	number.textContent = ( i / 5 ) + 1;
	element.appendChild( number );
	const symbol = document.createElement( 'div' );
	symbol.className = 'symbol';
	symbol.textContent = table[ i ];
	element.appendChild( symbol );
	const details = document.createElement( 'div' );
	details.className = 'details';
	details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
	element.appendChild( details );
	const objectCSS = new CSS3DObject( element );
	objectCSS.position.x = Math.random() * 4000 - 2000;
	objectCSS.position.y = Math.random() * 4000 - 2000;
	objectCSS.position.z = Math.random() * 4000 - 2000;
	scene.add( objectCSS );
	objects.push( objectCSS );
	//
	const object = new THREE.Object3D();
	object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
	object.position.y = - ( table[ i + 4 ] * 180 ) + 990;
	targets.table.push( object );
}

// sphere

const vector = new THREE.Vector3();

for (let i = 0, l = objects.length; i < l; i++) {
  const phi = Math.acos(-1 + (2 * i) / l);
  const theta = Math.sqrt(l * Math.PI) * phi;

  const object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets.sphere.push(object);
}
// helix

for (let i = 0, l = objects.length; i < l; i++) {
  const theta = i * 0.175 + Math.PI;
  const y = -(i * 8) + 450;

  const object = new THREE.Object3D();

  object.position.setFromCylindricalCoords(900, theta, y);

  vector.x = object.position.x * 2;
  vector.y = object.position.y;
  vector.z = object.position.z * 2;

  object.lookAt(vector);

  targets.helix.push(object);
}

// grid

for (let i = 0; i < objects.length; i++) {
  const object = new THREE.Object3D();

  object.position.x = (i % 5) * 400 - 800;
  object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
  object.position.z = Math.floor(i / 25) * 1000 - 2000;

  targets.grid.push(object);
}

function transform( targets, duration ) {

TWEEN.removeAll();

for ( let i = 0; i < objects.length; i ++ ) {

    const object = objects[ i ];
    const target = targets[ i ];

    new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

    new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

}

new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}
```

<div ref="elementTableRef" class="elementTable">
		<div id="menu">
			<button id="table">TABLE</button>
			<button id="sphere">SPHERE</button>
			<button id="helix">HELIX</button>
			<button id="grid">GRID</button>
		</div>
</div>



<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'
import gsap from "gsap";
import  {TWEEN }from 'three/examples/jsm/libs/tween.module.min.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import TWEEN from 'three/addons/libs/tween.module.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import Mitt from "mitt";

const eventHub = new Mitt();

const sceneRef = ref()
// const css3dRef = ref()
const showWall = () => {
  eventHub.emit("showWall");
};

const showFloor1 = () => {
  eventHub.emit("showFloor1");
};

const showFloor2 = () => {
  eventHub.emit("showFloor2");
};
let open = false;
const showAll = () => {
  if (open) {
    eventHub.emit("hideAll");
    open = false;
  } else {
    eventHub.emit("showAll");
    open = true;
  }
};

const initScene = () => {
    const scene = new THREE.Scene()
    const rgbeloader = new RGBELoader()

    rgbeloader.loadAsync('/assets/textures/2k.hdr').then(texture => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture
        scene.environment = texture
    })

    const light = new THREE.DirectionalLight(0xffffff,2);
    light.position.set(10,100,10);
    scene.add(light)

    const camera = new THREE.PerspectiveCamera(75,2,1,10000)
    camera.position.set(100,100,300)
    scene.add(camera)
    const css3dRender = new CSS3DRenderer();
    css3dRender.setSize(sceneRef.value.offsetWidth,sceneRef.value.offsetWidth/2)
    const renderer = new THREE.WebGLRenderer({
      // 设置抗锯齿
      antialias: true,
      // 设置物理灯光模拟效果
      physicallyCorrectLights: true,
      // 设置对数深度缓冲区
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(sceneRef.value.offsetWidth,sceneRef.value.offsetWidth/2)
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    sceneRef.value.appendChild(renderer.domElement)

    css3dRender.domElement.style.position = 'absolute';
    css3dRender.domElement.style.top = '0'
    sceneRef.value.appendChild(css3dRender.domElement)

    renderer.render(scene,camera)
    const controls = new OrbitControls(camera,css3dRender.domElement)
    // 设置控制器阻尼
    controls.enableDamping = true;
    function animate(t) {
      controls.update();
      const elapsedTime = clock.getElapsedTime();
      requestAnimationFrame(animate);
      // 使用渲染器渲染相机看这个场景的内容渲染出来
      renderer.render(scene, camera);
      css3dRender.render(scene,camera)
    }

    animate();
    if(!__VUEPRESS_SSR__) {
      window.addEventListener("resize",()=>{
        camera.updateProjectionMatrix();
        renderer.setSize(sceneRef.value.offsetWidth,sceneRef.value.offsetWidth/2)
        renderer.setPixelRatio(window.devicePixelRatio)
      })
    }
    return {scene,controls,renderer,camera}
}

const clock = new THREE.Clock();
const initAnimate = (scene,controls,renderer,camera) => {
  const delta = clock.getDelta()
  controls.update();
  renderer.render(scene,camera)
  requestAnimationFrame(() => {
    initAnimate(controls)
  })
}

const createTag = (object3d) => {
    // 创建各个区域的元素
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
}

const createFactory = (scene) => {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/assets/draco/");
    dracoLoader.setDecoderConfig({type: "js"});
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    let floor1Group;
    let floor2Group;
    let wallGroup;
    const floor2Tags = []
    gltfLoader.load("/assets/model/floor2.glb",(gltf) => {
        let array = ["小型会议室", "核心科技室", "科技展台", "设计总监办公室"];
        floor2Group = gltf.scene
        gltf.scene.traverse((child) => {
          if(child.isMesh) {
            child.material.emissiveIntensity = 15;
          }
          if(array.indexOf(child.name) != -1) {
            const css3dObject = createTag(child)
            css3dObject.visible = false
            floor2Tags.push(css3dObject)
            floor2Group.add(css3dObject);

          }
        })
        floor2Group.visible = false
        scene.add(floor2Group)
    })
    gltfLoader.load("/assets/model/floor1.glb",(gltf) => {
      floor1Group = gltf.scene;
      gltf.scene.traverse((child) => {
          if(child.isMesh) {
            child.material.emissiveIntensity = 5
          }
      })
      floor1Group.visible = false;
      scene.add(gltf.scene)
    })

    gltfLoader.load("/assets/model/wall.glb",(gltf) => {
      scene.add(gltf.scene)
      wallGroup = gltf.scene
    })
}

class Factory {
  constructor(scene,camera) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.scene = scene;
    this.floor1Group;
    this.floor2Group;
    this.wallGroup;
    this.floor2Tags = [];
    this.camera = camera
    gltfLoader.load("/assets/model/floor2.glb", (gltf) => {
      console.log(gltf);
      this.floor2Group = gltf.scene;

      let array = ["小型会议室", "核心科技室", "科技展台", "设计总监办公室"];
      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 15;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
        if (array.indexOf(child.name) != -1) {
          // console.log("小型会议室", child);
          const css3dObject = this.createTag(child);
          css3dObject.visible = false;
          this.floor2Tags.push(css3dObject);
          this.floor2Group.add(css3dObject);
        }
      });
      this.floor2Group.visible = false;

      scene.add(this.floor2Group);
    });

    gltfLoader.load("/assets/model/floor1.glb", (gltf) => {
      console.log(gltf);
      this.floor1Group = gltf.scene;

      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 5;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
      });
      this.floor1Group.visible = false;
      scene.add(gltf.scene);
    });

    gltfLoader.load("/assets/model/wall.glb", (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene);
      this.wallGroup = gltf.scene;
    });


    this.initEvent();
  }

  update(time) {
    if (this.mixer) {
      // console.log(time);
      this.mixer.update(time);
    }
  }

  createTag(object3d) {
    // 创建各个区域的元素
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
    // scene.add(objectCSS3D);
  }

  showFloor1() {
    this.floor1Group.visible = true;
  }
  showFloor2() {
    this.floor2Group.visible = true;
    // this.fighterGroup.visible = true;
    this.floor2Tags.forEach((tag) => {
      tag.visible = true;
    });
  }

  hideFloor1() {
    this.floor1Group.visible = false;
  }
  hideFloor2() {
    this.floor2Group.visible = false;
    // this.fighterGroup.visible = false;
    this.floor2Tags.forEach((tag) => {
      tag.visible = false;
    });
  }

  hideWall() {
    this.wallGroup.visible = false;
  }
  showWall() {
    this.wallGroup.visible = true;
  }
  initEvent() {
    eventHub.on("showFloor1", () => {
      this.showFloor1();
      this.hideWall();
      this.hideFloor2();
    });
    eventHub.on("showFloor2", () => {
      this.showFloor2();
      this.hideWall();
      this.hideFloor1();
    });
    eventHub.on("showWall", () => {
      this.showWall();
      this.hideFloor1();
      this.hideFloor2();
    });
    eventHub.on("showAll", () => {
      this.showFloor1();
      this.showFloor2();
      this.showWall();
      gsap.to(this.wallGroup.position, {
        y: 200,
        duration: 1,
      });
      gsap.to(this.floor2Group.position, {
        y: 50,
        duration: 1,
        delay: 1,
      });
    });
    eventHub.on("hideAll", () => {
      gsap.to(this.wallGroup.position, {
        y: 0,
        duration: 1,
        delay: 1,
        onComplete: () => {
          this.hideFloor1();
          this.hideFloor2();
        },
      });
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      });
    });
  }

}

const elementTableRef = ref()

const initElementTable = () => {
            let camera, scene, renderer;
			let controls;

			const objects = [];
			const targets = { table: [], sphere: [], helix: [], grid: [] };
				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 3000;

				scene = new THREE.Scene();      
                scene.background =new THREE.Color(0x000000);
                
				// table

				for ( let i = 0; i < table.length; i += 5 ) {

					const element = document.createElement( 'div' );
					element.className = 'element';
					element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

					const number = document.createElement( 'div' );
					number.className = 'number';
					number.textContent = ( i / 5 ) + 1;
					element.appendChild( number );

					const symbol = document.createElement( 'div' );
					symbol.className = 'symbol';
					symbol.textContent = table[ i ];
					element.appendChild( symbol );

					const details = document.createElement( 'div' );
					details.className = 'details';
					details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
					element.appendChild( details );

					const objectCSS = new CSS3DObject( element );
					objectCSS.position.x = Math.random() * 4000 - 2000;
					objectCSS.position.y = Math.random() * 4000 - 2000;
					objectCSS.position.z = Math.random() * 4000 - 2000;
					scene.add( objectCSS );

					objects.push( objectCSS );

					//

					const object = new THREE.Object3D();
					object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
					object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

					targets.table.push( object );

				}      
				// sphere

				const vector = new THREE.Vector3();

				for ( let i = 0, l = objects.length; i < l; i ++ ) {

					const phi = Math.acos( - 1 + ( 2 * i ) / l );
					const theta = Math.sqrt( l * Math.PI ) * phi;

					const object = new THREE.Object3D();

					object.position.setFromSphericalCoords( 800, phi, theta );

					vector.copy( object.position ).multiplyScalar( 2 );

					object.lookAt( vector );

					targets.sphere.push( object );

				}
				// helix

				for ( let i = 0, l = objects.length; i < l; i ++ ) {

					const theta = i * 0.175 + Math.PI;
					const y = - ( i * 8 ) + 450;

					const object = new THREE.Object3D();

					object.position.setFromCylindricalCoords( 900, theta, y );

					vector.x = object.position.x * 2;
					vector.y = object.position.y;
					vector.z = object.position.z * 2;

					object.lookAt( vector );

					targets.helix.push( object );

				}

				// grid

				for ( let i = 0; i < objects.length; i ++ ) {

					const object = new THREE.Object3D();

					object.position.x = ( ( i % 5 ) * 400 ) - 800;
					object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
					object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

					targets.grid.push( object );

				}                
 				renderer = new CSS3DRenderer();
                renderer.setSize(elementTableRef.value.offsetWidth,elementTableRef.value.offsetWidth/2);
                elementTableRef.value.appendChild(renderer.domElement)               

				controls = new TrackballControls( camera, renderer.domElement );
				controls.minDistance = 500;
				controls.maxDistance = 6000;
				controls.addEventListener( 'change', render );
				const buttonTable = document.getElementById( 'table' );
				buttonTable.addEventListener( 'click', function () {

					transform( targets.table, 2000 );

				} );

				const buttonSphere = document.getElementById( 'sphere' );
				buttonSphere.addEventListener( 'click', function () {

					transform( targets.sphere, 2000 );

				} );

				const buttonHelix = document.getElementById( 'helix' );
				buttonHelix.addEventListener( 'click', function () {

					transform( targets.helix, 2000 );

				} );

				const buttonGrid = document.getElementById( 'grid' );
				buttonGrid.addEventListener( 'click', function () {

					transform( targets.grid, 2000 );

				} );

				transform( targets.table, 2000 );

				//

				window.addEventListener( 'resize', onWindowResize );

			function transform( targets, duration ) {

				TWEEN.removeAll();

				for ( let i = 0; i < objects.length; i ++ ) {

					const object = objects[ i ];
					const target = targets[ i ];

					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

					new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

				}

				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();

			}

			function onWindowResize() {

				renderer.setSize(elementTableRef.value.offsetWidth,elementTableRef.value.offsetWidth/2);

				render();

			}

			function animate() {

				requestAnimationFrame( animate );

				TWEEN.update();

				controls.update();

			}

			function render() {

				renderer.render( scene, camera );

			}
            animate()
}

onMounted(()=>{
  const {scene,controls,renderer,camera} = initScene()
  const city = new Factory(scene)

  initElementTable()
})
			const table = [
				'H', 'Hydrogen', '1.00794', 1, 1,
				'He', 'Helium', '4.002602', 18, 1,
				'Li', 'Lithium', '6.941', 1, 2,
				'Be', 'Beryllium', '9.012182', 2, 2,
				'B', 'Boron', '10.811', 13, 2,
				'C', 'Carbon', '12.0107', 14, 2,
				'N', 'Nitrogen', '14.0067', 15, 2,
				'O', 'Oxygen', '15.9994', 16, 2,
				'F', 'Fluorine', '18.9984032', 17, 2,
				'Ne', 'Neon', '20.1797', 18, 2,
				'Na', 'Sodium', '22.98976...', 1, 3,
				'Mg', 'Magnesium', '24.305', 2, 3,
				'Al', 'Aluminium', '26.9815386', 13, 3,
				'Si', 'Silicon', '28.0855', 14, 3,
				'P', 'Phosphorus', '30.973762', 15, 3,
				'S', 'Sulfur', '32.065', 16, 3,
				'Cl', 'Chlorine', '35.453', 17, 3,
				'Ar', 'Argon', '39.948', 18, 3,
				'K', 'Potassium', '39.948', 1, 4,
				'Ca', 'Calcium', '40.078', 2, 4,
				'Sc', 'Scandium', '44.955912', 3, 4,
				'Ti', 'Titanium', '47.867', 4, 4,
				'V', 'Vanadium', '50.9415', 5, 4,
				'Cr', 'Chromium', '51.9961', 6, 4,
				'Mn', 'Manganese', '54.938045', 7, 4,
				'Fe', 'Iron', '55.845', 8, 4,
				'Co', 'Cobalt', '58.933195', 9, 4,
				'Ni', 'Nickel', '58.6934', 10, 4,
				'Cu', 'Copper', '63.546', 11, 4,
				'Zn', 'Zinc', '65.38', 12, 4,
				'Ga', 'Gallium', '69.723', 13, 4,
				'Ge', 'Germanium', '72.63', 14, 4,
				'As', 'Arsenic', '74.9216', 15, 4,
				'Se', 'Selenium', '78.96', 16, 4,
				'Br', 'Bromine', '79.904', 17, 4,
				'Kr', 'Krypton', '83.798', 18, 4,
				'Rb', 'Rubidium', '85.4678', 1, 5,
				'Sr', 'Strontium', '87.62', 2, 5,
				'Y', 'Yttrium', '88.90585', 3, 5,
				'Zr', 'Zirconium', '91.224', 4, 5,
				'Nb', 'Niobium', '92.90628', 5, 5,
				'Mo', 'Molybdenum', '95.96', 6, 5,
				'Tc', 'Technetium', '(98)', 7, 5,
				'Ru', 'Ruthenium', '101.07', 8, 5,
				'Rh', 'Rhodium', '102.9055', 9, 5,
				'Pd', 'Palladium', '106.42', 10, 5,
				'Ag', 'Silver', '107.8682', 11, 5,
				'Cd', 'Cadmium', '112.411', 12, 5,
				'In', 'Indium', '114.818', 13, 5,
				'Sn', 'Tin', '118.71', 14, 5,
				'Sb', 'Antimony', '121.76', 15, 5,
				'Te', 'Tellurium', '127.6', 16, 5,
				'I', 'Iodine', '126.90447', 17, 5,
				'Xe', 'Xenon', '131.293', 18, 5,
				'Cs', 'Caesium', '132.9054', 1, 6,
				'Ba', 'Barium', '132.9054', 2, 6,
				'La', 'Lanthanum', '138.90547', 4, 9,
				'Ce', 'Cerium', '140.116', 5, 9,
				'Pr', 'Praseodymium', '140.90765', 6, 9,
				'Nd', 'Neodymium', '144.242', 7, 9,
				'Pm', 'Promethium', '(145)', 8, 9,
				'Sm', 'Samarium', '150.36', 9, 9,
				'Eu', 'Europium', '151.964', 10, 9,
				'Gd', 'Gadolinium', '157.25', 11, 9,
				'Tb', 'Terbium', '158.92535', 12, 9,
				'Dy', 'Dysprosium', '162.5', 13, 9,
				'Ho', 'Holmium', '164.93032', 14, 9,
				'Er', 'Erbium', '167.259', 15, 9,
				'Tm', 'Thulium', '168.93421', 16, 9,
				'Yb', 'Ytterbium', '173.054', 17, 9,
				'Lu', 'Lutetium', '174.9668', 18, 9,
				'Hf', 'Hafnium', '178.49', 4, 6,
				'Ta', 'Tantalum', '180.94788', 5, 6,
				'W', 'Tungsten', '183.84', 6, 6,
				'Re', 'Rhenium', '186.207', 7, 6,
				'Os', 'Osmium', '190.23', 8, 6,
				'Ir', 'Iridium', '192.217', 9, 6,
				'Pt', 'Platinum', '195.084', 10, 6,
				'Au', 'Gold', '196.966569', 11, 6,
				'Hg', 'Mercury', '200.59', 12, 6,
				'Tl', 'Thallium', '204.3833', 13, 6,
				'Pb', 'Lead', '207.2', 14, 6,
				'Bi', 'Bismuth', '208.9804', 15, 6,
				'Po', 'Polonium', '(209)', 16, 6,
				'At', 'Astatine', '(210)', 17, 6,
				'Rn', 'Radon', '(222)', 18, 6,
				'Fr', 'Francium', '(223)', 1, 7,
				'Ra', 'Radium', '(226)', 2, 7,
				'Ac', 'Actinium', '(227)', 4, 10,
				'Th', 'Thorium', '232.03806', 5, 10,
				'Pa', 'Protactinium', '231.0588', 6, 10,
				'U', 'Uranium', '238.02891', 7, 10,
				'Np', 'Neptunium', '(237)', 8, 10,
				'Pu', 'Plutonium', '(244)', 9, 10,
				'Am', 'Americium', '(243)', 10, 10,
				'Cm', 'Curium', '(247)', 11, 10,
				'Bk', 'Berkelium', '(247)', 12, 10,
				'Cf', 'Californium', '(251)', 13, 10,
				'Es', 'Einstenium', '(252)', 14, 10,
				'Fm', 'Fermium', '(257)', 15, 10,
				'Md', 'Mendelevium', '(258)', 16, 10,
				'No', 'Nobelium', '(259)', 17, 10,
				'Lr', 'Lawrencium', '(262)', 18, 10,
				'Rf', 'Rutherfordium', '(267)', 4, 7,
				'Db', 'Dubnium', '(268)', 5, 7,
				'Sg', 'Seaborgium', '(271)', 6, 7,
				'Bh', 'Bohrium', '(272)', 7, 7,
				'Hs', 'Hassium', '(270)', 8, 7,
				'Mt', 'Meitnerium', '(276)', 9, 7,
				'Ds', 'Darmstadium', '(281)', 10, 7,
				'Rg', 'Roentgenium', '(280)', 11, 7,
				'Cn', 'Copernicium', '(285)', 12, 7,
				'Nh', 'Nihonium', '(286)', 13, 7,
				'Fl', 'Flerovium', '(289)', 14, 7,
				'Mc', 'Moscovium', '(290)', 15, 7,
				'Lv', 'Livermorium', '(293)', 16, 7,
				'Ts', 'Tennessine', '(294)', 17, 7,
				'Og', 'Oganesson', '(294)', 18, 7
			];
</script>
<style lang="less" scoped>
  .scene {
    position:relative;
    .btn-list {
      position:absolute;
      width:100%;
      display:flex;
      z-index:11;
      >div {
        flex:1;
        text-align:center;
        color: #1976D2;
        padding:5px 0;
        cursor:pointer;
      }
    }
    .css3d-render {
        position:absolute;
        left:0;
        top:0;
    }

  }

:deep(.scene){
     .elementTag::before {
  content: "";
  display: block;
  position: absolute;
  width: 100px;
  height: 1px;
  background: rgb(127 177 255 / 75%);
  bottom: 0;
  right: -100px;
  transform: rotate(30deg);
  transform-origin: 0 0;
}

.elementTag::after {
  content: "";
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgb(127 177 255 / 75%);
  bottom: -65px;
  right: -105px;
}

.elementContent {
  background-color: rgba(20, 143, 221, 0.68);
  box-shadow: 0 0 12px rgba(0, 128, 255, 0.75);
  border: 1px solid rgba(127, 177, 255, 0.75);
  padding: 20px;
  color: #efefef;
}

.elementContent h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}
  .elementTag {
  position: relative;
  left: -30px;
  top: 15px;
}
  }

:deep(.elementTable) {
    position:relative;
    background:#000;
  			#menu {
				position: absolute;
				bottom: 20px;
				width: 100%;
                 z-index:11;
				text-align: center;
            .element {
				width: 120px;
				height: 160px;
				box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
				border: 1px solid rgba(127,255,255,0.25);
				font-family: Helvetica, sans-serif;
				text-align: center;
				line-height: normal;
				cursor: default;
               
			}

			.element:hover {
				box-shadow: 0px 0px 12px rgba(0,255,255,0.75);
				border: 1px solid rgba(127,255,255,0.75);
			}

				.element .number {
					position: absolute;
					top: 20px;
					right: 20px;
					font-size: 12px;
					color: rgba(127,255,255,0.75);
				}

				.element .symbol {
					position: absolute;
					top: 40px;
					left: 0px;
					right: 0px;
					font-size: 60px;
					font-weight: bold;
					color: rgba(255,255,255,0.75);
					text-shadow: 0 0 10px rgba(0,255,255,0.95);
				}

				.element .details {
					position: absolute;
					bottom: 15px;
					left: 0px;
					right: 0px;
					font-size: 12px;
					color: rgba(127,255,255,0.75);
				}

			button {
				color: rgba(127,255,255,0.75);
				background: transparent;
				outline: 1px solid rgba(127,255,255,0.75);
				border: 0px;
				padding: 5px 10px;
				cursor: pointer;
			}

			button:hover {
				background-color: rgba(0,255,255,0.5);
			}

			button:active {
				color: #000000;
				background-color: rgba(0,255,255,0.75);
			}  
			}


}
</style>
