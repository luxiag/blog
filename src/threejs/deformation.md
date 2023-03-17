---
title: 物体形变
category:
  - ThreeJS
date: 2023-02-08
---

<div ref="shape"></div>

<script setup>

import {ref,onMounted} from 'vue'
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入动画库
import gsap from "gsap";


// 1、创建场景
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

const loader = new RGBELoader();
loader.load("/assets/textures/hdr/038.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/gltf/");
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer;
let stem, petal, stem1, petal1, stem2, petal2;
gltfLoader.load("./model/f4.glb", function (gltf1) {
  console.log(gltf1);
  stem = gltf1.scene.children[0];
  petal = gltf1.scene.children[1];
  gltf1.scene.rotation.x = Math.PI;

  gltf1.scene.traverse((item) => {
    if (item.material && item.material.name == "Water") {
      item.material = new THREE.MeshStandardMaterial({
        color: "skyblue",
        depthWrite: false,
        transparent: true,
        depthTest: false,
        opacity: 0.5,
      });
    }
    if (item.material && item.material.name == "Stem") {
      stem = item;
    }
    if (item.material && item.material.name == "Petal") {
      petal = item;
    }
  });

  gltfLoader.load("./model/f2.glb", function (gltf2) {
    gltf2.scene.traverse((item) => {
      if (item.material && item.material.name == "Stem") {
        stem1 = item;
        stem.geometry.morphAttributes.position = [
          stem1.geometry.attributes.position,
        ];
        stem.updateMorphTargets();
      }
      if (item.material && item.material.name == "Petal") {
        petal1 = item;
        petal.geometry.morphAttributes.position = [
          petal1.geometry.attributes.position,
        ];
        petal.updateMorphTargets();
        console.log(petal.morphTargetInfluences);
      }

      gltfLoader.load("./model/f1.glb", function (gltf2) {
        gltf2.scene.traverse((item) => {
          if (item.material && item.material.name == "Stem") {
            stem2 = item;
            stem.geometry.morphAttributes.position.push(
              stem2.geometry.attributes.position
            );
            stem.updateMorphTargets();
          }
          if (item.material && item.material.name == "Petal") {
            petal2 = item;
            petal.geometry.morphAttributes.position.push(
              petal2.geometry.attributes.position
            );
            petal.updateMorphTargets();
            console.log(petal.morphTargetInfluences);
          }
        });
      });
    });

    gsap.to(params, {
      value: 1,
      duration: 4,
      onUpdate: function () {
        stem.morphTargetInfluences[0] = params.value;
        petal.morphTargetInfluences[0] = params.value;
      },
      onComplete: function () {
        gsap.to(params, {
          value1: 1,
          duration: 4,
          onUpdate: function () {
            stem.morphTargetInfluences[1] = params.value1;
            petal.morphTargetInfluences[1] = params.value1;
          },
        });
      },
    });
  });
  scene.add(gltf1.scene);
});


</script>
