---
title: 射线检测
category:
  - ThreeJS
date: 2023-01-08
---

## Raycaster

```js
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
//   检测所有在射线与物体之间，包括或不包括后代的相交部分。
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }

  renderer.render(scene, camera);
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
    scene.add(axesHelper);

    if(!__VUEPRESS_SSR__) {
        
        window.addEventListener('mousemove',(event) => {
            console.log(event.clientX,event.clientY,'event')
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
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

onMounted(() => {
init();
})


</script>
