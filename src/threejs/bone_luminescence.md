---
title: 骨骼发光
category:
  - ThreeJS
date: 2023-02-04
---

<div ref="bone"> </div>

<script setup>
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import {ref,onMounted} from 'vue'
import gsap from "gsap";

const bone = ref()

const init = () => {
    const scene = new THREE.Scene();

    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      2,
      0.1,
      1000
    );
    // 设置相机位置
    camera.position.set(0, 0, 20);
    scene.add(camera);
    // 添加hdr环境纹理
    const loader = new RGBELoader();
    loader.load("/assets/textures/hdr/038.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });


    // 加载纹理
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/assets/textures/cloth_pos.png");
    const normalMap = textureLoader.load("/assets/textures/cloth_norm.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.2, 0.2);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(0.2, 0.2);
    texture.offset.set(0, 0);

    gsap.to(texture.offset, {
      x: 1,
      y: 1,
      duration: 1,
      repeat: -1,
      onUpdate: function () {
        // console.log(texture.offset);
        texture.needsUpdate = true;
      },
    });


    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/draco/gltf/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    let mixer;
    gltfLoader.load("/assets/model/jianshen-min.glb", function (gltf) {
      scene.add(gltf.scene);
    //   gltf.scene.position.x +=2;
      gltf.scene.traverse(function (child) {
        if (child.name == "Body") {
          console.log(child);
        }
        if (child.name == "Floor") {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
          });
          console.log(child);
        }
        if (child.isMesh) {
        //   child.material.depthWrite = true;
        //   child.material.normalScale = new THREE.Vector2(1, 1);
        //   child.material.side = THREE.FrontSide;
        //   child.material.transparent = false;
        //   child.material.vertexColors = false;

        child.material = new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        normalMap: normalMap,
      });
        }
      });
      // 设置动画
      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();

      // 添加平行光;
      const light = new THREE.DirectionalLight(0xffffff, 2);
      light.position.set(0, 100, 100);
      scene.add(light);
      // 添加点光源
      // const pointLight = new THREE.PointLight(0xffffff, 10);
      // pointLight.position.set(0, 100, 100);
    })
    let mixer2
    gltfLoader.load("/assets/model/jianshen-min.glb", function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.position.x +=2;
      gltf.scene.traverse(function (child) {
        if (child.name == "Body") {
          console.log(child);
        }
        if (child.name == "Floor") {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
          });
          console.log(child);
        }
        if (child.isMesh) {
          child.material.depthWrite = true;
          child.material.normalScale = new THREE.Vector2(1, 1);
          child.material.side = THREE.FrontSide;
          child.material.transparent = false;
          child.material.vertexColors = false;

        }
      });
      // 设置动画
      mixer2 = new THREE.AnimationMixer(gltf.scene);
      const action = mixer2.clipAction(gltf.animations[0]);
      action.play();

      // 添加平行光;
      const light = new THREE.DirectionalLight(0xffffff, 2);
      light.position.set(0, 100, 100);
      scene.add(light);
      // 添加点光源
      // const pointLight = new THREE.PointLight(0xffffff, 10);
      // pointLight.position.set(0, 100, 100);
    })
    // 创建一个金属球添加到场景中
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material1 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
    });
    const sphere = new THREE.Mesh(geometry, material1);
    sphere.position.set(-2, 0, 0);
    scene.add(sphere);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(bone.value.offsetWidth, bone.value.offsetWidth/2);
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0xcccccc, 1);

    bone.value.appendChild(renderer.domElement)

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
    controls.enableDamping = true;

    // 设置时钟
    const clock = new THREE.Clock();

    function render() {
      let time = clock.getDelta();
      if (mixer) {
        // console.log(mixer);
        mixer.update(time);
       
      }
      if(mixer2) {
         mixer2.update(time)
      }
      controls.update();
      renderer.render(scene, camera);
      //   渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }

    render();

    if(!__VUEPRESS_SSR__) {
        renderer.setSize(bone.value.offsetWidth, bone.value.offsetWidth/2);
          //   设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio);
    }

}

onMounted(()=>{
    init()
})





</script>
