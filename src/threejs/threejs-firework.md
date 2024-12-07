---
title: ThreeJS烟火
category:
  - ThreeJS
date: 2022-03-13
---







`Fragment`
```glsl
uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}
```

`Vertex`

```glsl
attribute vec3 aStep;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.xyz += (aStep*uTime);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;
    // 设置顶点大小
    gl_PointSize =uSize;
}
```

`Fireworks`
```js

class Fireworks {

    constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    // console.log("创建烟花：", color, to);
    this.color = new THREE.Color(color);

    // 创建烟花发射的球点
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    );

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.x;
    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(astepArray, 3)
    );

    // 设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: { value: this.color },
      },
    });

    // console.log(this.startGeometry);
    // 创建烟花点球
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);

    // 开始计时
    this.clock = new THREE.Clock();

    // 创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    this.FireworksCount = 180 + Math.floor(Math.random() * 180);
    const positionFireworksArray = new Float32Array(this.FireworksCount * 3);
    const scaleFireArray = new Float32Array(this.FireworksCount);
    const directionArray = new Float32Array(this.FireworksCount * 3);
    for (let i = 0; i < this.FireworksCount; i++) {
      // 一开始烟花位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;
      //   设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random();
      //   设置四周发射的角度

      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);

      //   console.log(
      //     directionArray[i * 3 + 0],
      //     directionArray[i * 3 + 1],
      //     directionArray[i * 3 + 2]
      //   );
    }
    this.fireworkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionFireworksArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleFireArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(directionArray, 3)
    );

    this.fireworksMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: fireworksVertex,
      fragmentShader: fireworksFragment,
    });

    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );

    // 创建音频
    this.linstener = new THREE.AudioListener();
    this.linstener1 = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.linstener);
    this.sendSound = new THREE.Audio(this.linstener1);

    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1);
      }
    );

    audioLoader.load(`./assets/audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(1);
    });
  }
  //   添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  //   update变量
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    // console.log(elapsedTime);
    if (elapsedTime > 0.2 && elapsedTime < 1) {
      if (!this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else if (elapsedTime > 0.2) {
      const time = elapsedTime - 1;
      //   让点元素消失
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeometry.dispose();
      this.startMaterial.dispose();
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }
      //设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
      //   console.log(time);
      this.fireworksMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireworkGeometry.dispose();
        this.fireworksMaterial.dispose();
        this.scene.remove(this.fireworks);
        this.scene.remove(this.startPoint);
        return "remove";
      }
    }
  }
}

```

<div ref="fireworkRef"></div>


# 参考
参考：<https://threejs.org/>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Water } from "three/examples/jsm/objects/Water2.js";

const fireworkRef = ref()
const startPointFragment = `
uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}

`
const startPointVertex = `
attribute vec3 aStep;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.xyz += (aStep*uTime);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;
    // 设置顶点大小
    gl_PointSize =uSize;
}
`

const fireworksFragment = `

uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    gl_FragColor = vec4(uColor,strength);
}

`
const fireworksVertex = `

attribute float aScale;
attribute vec3 aRandom;
uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.xyz+=aRandom*uTime*10.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position =  projectionMatrix * viewPosition;

    // 设置顶点大小
    gl_PointSize =uSize*aScale-(uTime*20.0);

}
`

class Fireworks {

    constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    // console.log("创建烟花：", color, to);
    this.color = new THREE.Color(color);

    // 创建烟花发射的球点
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    );

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.x;
    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(astepArray, 3)
    );

    // 设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: { value: this.color },
      },
    });

    // console.log(this.startGeometry);
    // 创建烟花点球
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);

    // 开始计时
    this.clock = new THREE.Clock();

    // 创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    this.FireworksCount = 180 + Math.floor(Math.random() * 180);
    const positionFireworksArray = new Float32Array(this.FireworksCount * 3);
    const scaleFireArray = new Float32Array(this.FireworksCount);
    const directionArray = new Float32Array(this.FireworksCount * 3);
    for (let i = 0; i < this.FireworksCount; i++) {
      // 一开始烟花位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;
      //   设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random();
      //   设置四周发射的角度

      let theta = Math.random() * 2 * Math.PI;
      let beta = Math.random() * 2 * Math.PI;
      let r = Math.random();

      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);

      //   console.log(
      //     directionArray[i * 3 + 0],
      //     directionArray[i * 3 + 1],
      //     directionArray[i * 3 + 2]
      //   );
    }
    this.fireworkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionFireworksArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleFireArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(directionArray, 3)
    );

    this.fireworksMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: { value: this.color },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: fireworksVertex,
      fragmentShader: fireworksFragment,
    });

    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );

    // 创建音频
    this.linstener = new THREE.AudioListener();
    this.linstener1 = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.linstener);
    this.sendSound = new THREE.Audio(this.linstener1);

    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1);
      }
    );

    audioLoader.load(`./assets/audio/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(1);
    });
  }
  //   添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  //   update变量
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    // console.log(elapsedTime);
    if (elapsedTime > 0.2 && elapsedTime < 1) {
      if (!this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else if (elapsedTime > 0.2) {
      const time = elapsedTime - 1;
      //   让点元素消失
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeometry.dispose();
      this.startMaterial.dispose();
      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }
      //设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
      //   console.log(time);
      this.fireworksMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireworkGeometry.dispose();
        this.fireworksMaterial.dispose();
        this.scene.remove(this.fireworks);
        this.scene.remove(this.startPoint);
        return "remove";
      }
    }
  }
}
const initFireWorkRef = () => {
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  2,
  0.1,
  1000
);
scene.add(camera);

const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./assets/textures/2k.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    vPosition = modelPosition;
    gPosition = vec4( position, 1.0 );
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;

}

  `,
  fragmentShader: `
precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main(){
    vec4 redColor = vec4(1,0,0,1);
    vec4 yellowColor = vec4(1,1,0.5,1);
    vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);
    if(gl_FrontFacing){
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
        // gl_FragColor = vec4(1,1,1,1);
    }else{
        gl_FragColor = vec4(mixColor.xyz,1);
    }
}
  `,
  uniforms: {},
  side: THREE.DoubleSide,
  //   transparent: true,
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1;

const gltfLoader = new GLTFLoader();
let LightBox = null;

gltfLoader.load("./assets/models/newyears_min.glb", (gltf) => {
  // scene.add(gltf.scene);

  //   创建水面
  // const waterGeometry = new THREE.PlaneBufferGeometry(100, 100);
  // let water = new Water(waterGeometry, {
  //   scale: 4,
  //   textureHeight: 1024,
  //   textureWidth: 1024,
  // });
  // water.position.y = 1;
  // water.rotation.x = -Math.PI / 2;
  // scene.add(water);
});

gltfLoader.load("./assets/models/flyLight.glb", (gltf) => {

  LightBox = gltf.scene.children[0];
  LightBox.material = shaderMaterial;

  for (let i = 0; i < 150; i++) {
    let flyLight = gltf.scene.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 5;
    flyLight.position.set(x, y, z);
    gsap.to(flyLight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    gsap.to(flyLight.position, {
      x: "+=" + Math.random() * 5,
      y: "+=" + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1,
    });
    scene.add(flyLight);
  }
});

// 设置渲染尺寸大小
renderer.setSize(fireworkRef.value.offsetWidth, fireworkRef.value.offsetWidth/2);
fireworkRef.value.appendChild(renderer.domElement)

// 设置创建烟花函数
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
  let position = {
    x: (Math.random() - 0.5) * 40,
    z: -(Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
  };

  // 随机生成颜色和烟花放的位置
  let firework = new Fireworks(color, position);
  firework.addScene(scene, camera);
  fireworks.push(firework);
};

  // 监听点击事件
  fireworkRef.value.addEventListener("click", createFireworks);

if(!__VUEPRESS_SSR__) {
// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {

  // 设置渲染尺寸大小
  renderer.setSize(fireworkRef.value.offsetWidth, fireworkRef.value.offsetWidth/2);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);

});

}
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.1;

const clock = new THREE.Clock();
// 管理烟花
let fireworks = [];
function animate(t) {
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  //   console.log(fireworks);
  fireworks.forEach((item, i) => {
    const type = item.update();
    if (type == "remove") {
      fireworks.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();

}

onMounted(()=>{
    initFireWorkRef()
})

</script>
