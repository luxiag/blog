---
title: Cannon引擎
date: 2023-01-12
category:
  - ThreeJS
---

官方文档：https://pmndrs.github.io/cannon-es/docs/index.html

## [ApplyForces](https://pmndrs.github.io/cannon-es/docs/classes/Body.html#applyForce)

- applyForce 施加作用力。可以用作风吹动树叶，或推倒多米诺骨牌或愤怒的小鸟的受力
- applyImpulse 施加冲量。这个冲量是瞬间的，例如射出去的子弹。
- applyLocalForce 同 applyForce，不过是在物体的内部施力，对刚体的局部点施力。
- applyLocalImpulse 同 applyImpulse，不过是在物体的内部施加冲量，对刚体的局部点施加冲量

```js
cubeBody.applyLocalForce(
  new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
  new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
);
```

<div ref="cannon"></div>

<script setup> 
import {ref, onMounted} from 'vue'
import * as dat from 'lil-gui'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";


const cannon = ref();

const init = () => {



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  2,
  0.1,
  300
);

camera.position.set(0, 0, 18);
scene.add(camera);



const cubeArr = [];
//设置物体材质
const cubeWorldMaterial = new CANNON.Material('cube')


const createCube = () => {
    const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1);
    const cubeMaterial = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true 
    scene.add(cube)
    // 创建物理cube形状
    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));

    // 创建物理世界的物体
    const cubeBody = new CANNON.Body({
      shape: cubeShape,
      position: new CANNON.Vec3(0, 0, 0),
      //   小球质量
      mass: 1,
      //   物体材质
      material: cubeWorldMaterial,
    });

    cubeBody.applyLocalForce(
      new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
      new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
    );

    // 将物体添加至物理世界
    world.addBody(cubeBody);
    // 添加监听碰撞事件
    function HitEvent(e) {
      // 获取碰撞的强度
      //   console.log("hit", e);
      const impactStrength = e.contact.getImpactVelocityAlongNormal();
      if (impactStrength > 2) {
        //   重新从零开始播放
        hitSound.currentTime = 0;
        hitSound.volume = impactStrength / 12;
        hitSound.play();
      }
    }
    cubeBody.addEventListener("collide", HitEvent);
    cubeArr.push({
      mesh: cube,
      body: cubeBody,
    });
}



//添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(0, 0, 1);

dirLight.castShadow = true;
scene.add(dirLight);

if(!__VUEPRESS_SSR__){
    window.addEventListener('click',createCube);
}


const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(5, 5),
  new THREE.MeshStandardMaterial()
);

floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);


const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);


const hitSound = new Audio("/assets/audio/metalHit.mp3");


const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
const floorMaterial = new CANNON.Material("floor")
floorBody.material = floorMaterial;
// 当质量为0的时候，可以使得物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);

floorBody.position.set(0,-5,0);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI /2);

world.addBody(floorBody);

const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWorldMaterial,
  floorMaterial,
  {
    //   摩擦力
    friction: 0.1,
    // 弹性
    restitution: 0.7,
  }
);


// 讲材料的关联设置添加的物理世界
world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞的默认材料，如果材料没有设置，都用这个
world.defaultContactMaterial = defaultContactMaterial;

const renderer = new THREE.WebGLRenderer()

renderer.setSize(cannon.value.offsetWidth,cannon.value.offsetWidth/2)

renderer.shadowMap.enabled = true
cannon.value.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true 
// 设置时钟
const clock = new THREE.Clock();
const render = () => {
    let deltaTime = clock.getDelta();
    world.step(1/120,deltaTime);

    cubeArr.forEach((item) => {
        item.mesh.position.copy(item.body.position);
        item.mesh.quaternion.copy(item.body.quaternion);
    })
    renderer.render(scene,camera);
    requestAnimationFrame(render)
}
render()


if(!__VUEPRESS_SSR__){ 
    window.addEventListener('resize',()=>{
        renderer.setSize(cannon.value.offsetWidth,cannon.value.offsetWidth/2)
        renderer.setPixelRation(window.devicePixelRation)
    })
}




}

onMounted(()=>{
    init();
})
</script>
