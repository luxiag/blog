---
title: ThreeJS中的射线检测
category:
  - ThreeJS
date: 2023-01-08
---
参考：https://threejs.org/

## Raycaster

- `Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )`
  - origin —— 光线投射的原点向量。
  - direction —— 向射线提供方向的方向向量，应当被标准化。
  - near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
  - far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷。）

  这将创建一个新的raycaster对象。

- `.setFromCamera ( coords : Vector2, camera : Camera ) : undefined`
  - coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
  - camera —— 射线所来源的摄像机。
  
  使用一个新的原点和方向来更新射线。

- `.intersectObject ( object : Object3D, recursive : Boolean, optionalTarget : Array ) : Array`
  - object —— 检查与射线相交的物体。
  - recursive —— 若为true，则同时也会检查所有的后代。否则将只会检查对象本身。默认值为true。
  - optionalTarget — （可选）设置结果的目标数组。如果不设置这个值，则一个新的Array会被实例化；如果设置了这个值，则在每次调用之前必须清空这个数组（例如：array.length = 0;）。

  检测所有在射线与物体之间，包括或不包括后代的相交部分。返回结果时，相交部分将按距离进行排序，最近的位于第一个。
  该方法返回一个包含有交叉部分的数组:


```js
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2()
function render() {
	// 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera( pointer, camera );
	// 计算物体和射线的焦点
	const intersects = raycaster.intersectObjects( scene.children );
	for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
	renderer.render( scene, camera );
}

```

## demo

```js
// 创建一个红色的半透明方块
const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
const rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
scene.add( rollOverMesh );

// 创建一个黄色的方块，准备用于添加到场景中
const cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( '/assets/textures/square-outline-textured.png' ) } );

// 创建网格辅助线
const gridHelper = new THREE.GridHelper( 1000, 20 );
scene.add( gridHelper );

// 创建一个平面面板
raycaster = new THREE.Raycaster();
pointer = new THREE.Vector2();
const geometry = new THREE.PlaneGeometry( 1000, 1000 );
geometry.rotateX( - Math.PI / 2 );
const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
scene.add( plane );

// 用于射线检测
objects.push( plane ); // 加入物体数组

// 事件处理函数
function onPointerMove(event){
	pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( objects, false );
	if ( intersects.length > 0 ) {
		const intersect = intersects[ 0 ];
		// 将红色半透明方块移动到鼠标所在的位置
    // intersect.point 鼠标悬停点在场景中的位置
    // intersect.face.normal 三维模型子网格（intersect.face）的法向量（normal）
		rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
    // 将方块对准到悬停点的中心位置
    /*
    divideScalar( 50 )：将向量坐标除以 50，这是为了将位置信息进行规范化，使每个方块的位置都对应网格的中心点，避免出现半个方块的情况。
    floor()：将向量的每个坐标值按照四舍五入的方式转换成整数，这是确保每个网格的中心点都是整数。
    multiplyScalar( 50 )：将向量坐标乘以 50，把网格中心点的位置重新还原成一个完整的坐标系。这一步的作用是反向处理前面的操作，确保位置信息没有改变。
    addScalar( 25 )：最后加上 25，是为了让方块更好地显示在屏幕上，因为像素的起始点是在网格左上角，而不是中心点。
    
    */ 
		rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
		render();
	}      
}

function onPointerDown(event){
	pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( objects, false );
	if ( intersects.length > 0 ) {
		const intersect = intersects[ 0 ];
		// 删除方块
		if ( isShiftDown ) {
			if ( intersect.object !== plane ) {
				scene.remove( intersect.object );
				objects.splice( objects.indexOf( intersect.object ), 1 );
			}
		// 添加方块
		} else {
			const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			voxel.position.copy( intersect.point ).add( intersect.face.normal );
			voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			scene.add( voxel );
			objects.push( voxel );
		}
		render();
	}
}

```


<div ref="voxelRef"></div>

```js
const material = new THREE.MeshBasicMaterial({ // 创建网格基本材质
    wireframe: true  // wireframe 为 true 时，表示显示为线框模式，否则就是默认表示实心的
})
const redMaterial = new THREE.MeshBasicMaterial({ // 创建颜色材质，设置为红色 
    color:'#ff0000'
})

let cubeArr = []
for(let i = -5;i<5;i++) { // 创建多个立方体
    for(let j =  -5;j <5;j++) {
        for(let z = -5;z<5;z++) {
            const cube = new THREE.Mesh(cubeGeometry,material); // 创建立方体网格
            cube.position.set(i,j,z); // 设置立方体网格的位置
            scene.add(cube); // 将立方体网格添加到场景中
            cubeArr.push(cube) // 将立方体放入 cubeArr 数组中
        }
    }
}

function onPointerMove(event) {
    mouse.x = (event.clientX / window.innerWidth) *2 - 1; // 计算鼠标在屏幕上的位置，转换为 Three.js 坐标系的位置
    mouse.y = -((event.clientY / window.innerHeight)* 2 - 1);
    raycaster.setFromCamera(mouse, camera); // 从相机透视投影的位置发射一个射线，并求出射线经过的物体
    let result = raycaster.intersectObjects(cubeArr); // 射线选择器与立方体数组作为参数，返回一个对象数组 result，其中包含射线经过的物体
    result.forEach((item) => { // 遍历射线碰撞得到的所有物体，将它们的材质改为红色
      item.object.material = redMaterial;
    });
}

```

<div ref="ray"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ray = ref()

const init = () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);

    camera.position.set(0,0,20);
    scene.add(camera);

    const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({
        // 网格
        wireframe: true
    })
    const redMaterial = new THREE.MeshBasicMaterial({
        color:'#ff0000'
    })

    let cubeArr = []
    for(let i = -5;i<5;i++) {
        for(let j =  -5;j <5;j++) {
            for(let z = -5;z<5;z++) {
                const cube = new THREE.Mesh(cubeGeometry,material);
                cube.position.set(i,j,z);
                scene.add(cube);
                cubeArr.push(cube)
            }
        }
    }

    const renderer = new THREE.WebGLRenderer();
    // value.offsetWidth
    console.log(ray.value.offsetWidth,'width')
    renderer.setSize(ray.value.offsetWidth,ray.value.offsetWidth/2)
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;

    ray.value.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera,renderer.domElement);
    controls.enableDamping = true;

    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2();

    const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    if(!__VUEPRESS_SSR__) {

        ray.value.addEventListener('pointermove',(event) => {
            // console.log(event.clientX,event.clientY,'event')
            mouse.x = (event.clientX / window.innerWidth) *2 - 1;
mouse.y = -((event.clientY / window.innerHeight)* 2 - 1);
            raycaster.setFromCamera(mouse, camera);
            let result = raycaster.intersectObjects(cubeArr);
            //   console.log(result);
            //   result[0].object.material = redMaterial;
            result.forEach((item) => {
              item.object.material = redMaterial;
            });

        })
    }

    function render(){
        controls.update()
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    }
    render();

}


const voxelRef = ref()
const initVoxel = () => {
    let pointer, raycaster, isShiftDown = false;
    const objects = []
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0)
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 10000);
    camera.position.set(500,800,1300);
    camera.lookAt(0,0,0)


    const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
		const rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
		const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
		scene.add( rollOverMesh );

    const cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
		const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( '/assets/textures/square-outline-textured.png' ) } );

    const gridHelper = new THREE.GridHelper( 1000, 20 );
		scene.add( gridHelper );

    raycaster = new THREE.Raycaster();
		pointer = new THREE.Vector2();

    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
		geometry.rotateX( - Math.PI / 2 );

    const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
		scene.add( plane );

    objects.push( plane );

    const ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		scene.add( directionalLight );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(voxelRef.value.offsetWidth,voxelRef.value.offsetWidth/2)

    voxelRef.value.appendChild(renderer.domElement)

    voxelRef.value.addEventListener('pointermove',onPointerMove);
    voxelRef.value.addEventListener('pointerdown',onPointerDown);
    voxelRef.value.addEventListener('keydown',onDocumentKeyDown);
    voxelRef.value.addEventListener('keyup',onDocumentKeyUp);

    function onPointerMove(event){
				pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( objects, false );

				if ( intersects.length > 0 ) {

					const intersect = intersects[ 0 ];

					rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
					rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

					render();

				}      
    }
    function onPointerDown(event){
				pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( objects, false );

				if ( intersects.length > 0 ) {
					const intersect = intersects[ 0 ];
					// delete cube
					if ( isShiftDown ) {
						if ( intersect.object !== plane ) {
							scene.remove( intersect.object );
							objects.splice( objects.indexOf( intersect.object ), 1 );
						}
						// create cube
					} else {
						const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
						voxel.position.copy( intersect.point ).add( intersect.face.normal );
						voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
						scene.add( voxel );
						objects.push( voxel );
					}
					render();
				}
    }
    function onDocumentKeyDown(event){
        switch ( event.keyCode ) {
					case 16: isShiftDown = true; break;
				}
    }
    function onDocumentKeyUp(event){
				switch ( event.keyCode ) {
					case 16: isShiftDown = false; break;
				}
    }

    function render(){
        renderer.render(scene,camera);
    }
    render();
}

onMounted(() => {
init();
initVoxel()
})

</script>
