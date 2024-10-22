---
title: 3D地图
category:
  - ThreeJS
date: 2023-02-22
---

<div ref="mapRef" class="map_container"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as d3 from "d3";


const mapRef = ref()

const init = () => {

const stats = new Stats();

stats.dom.style.position = "absolute"
stats.dom.style.top = 0;
stats.dom.style.left = 0;
mapRef.value.appendChild(stats.dom)
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(90,2,0.1,10000)

camera.position.set(0,0,1000);

scene.add(camera)


// 加载纹理
const map = new THREE.Object3D();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

renderer.setSize(mapRef.value.offsetWidth,mapRef.value.offsetWidth/2)


if(!__VUEPRESS_SSR__){

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {


  //   更新渲染器
renderer.setSize(mapRef.value.offsetWidth,mapRef.value.offsetWidth/2)
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});
}

mapRef.value.appendChild(renderer.domElement)

const canvas = renderer.domElement;
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  stats.update();
  const deltaTime = clock.getDelta();

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}


animate();


const projection1 = d3.geoMercator().center([116, 39]).translate([0, 0, 0]);

const loader = new THREE.FileLoader();

loader.load("/assets/JSON/10000_full.json",(data) => {
    const jsData = JSON.parse(data)
    operationData(jsData)
})

function operationData(jsondata) {
  // 全国信息
  const features = jsondata.features;

  features.forEach((feature) => {
    // 单个省份 对象
    const province = new THREE.Object3D();
    // 地址
    province.properties = feature.properties.name;
    const coordinates = feature.geometry.coordinates;
    const color = "#99ff99";

    if (feature.geometry.type === "MultiPolygon") {
      // 多个，多边形
      coordinates.forEach((coordinate) => {
        // console.log(coordinate);
        // coordinate 多边形数据
        coordinate.forEach((rows) => {
          const mesh = drawExtrudeMesh(rows, color, projection1);
          const line = lineDraw(rows, color, projection1);
          // 唯一标识
          mesh.properties = feature.properties.name;

          province.add(line);
          province.add(mesh);
        });
      });
    }

    if (feature.geometry.type === "Polygon") {
      // 多边形
      coordinates.forEach((coordinate) => {
        const mesh = drawExtrudeMesh(coordinate, color, projection1);
        const line = lineDraw(coordinate, color, projection1);
        // 唯一标识
        mesh.properties = feature.properties.name;

        province.add(line);
        province.add(mesh);
      });
    }
    map.add(province);
  });
  scene.add(map);
}

function lineDraw(polygon, color, projection) {
  const lineGeometry = new THREE.BufferGeometry();
  const pointsArray = new Array();
  polygon.forEach((row) => {
    const [x, y] = projection(row);
    // 创建三维点
    pointsArray.push(new THREE.Vector3(x, -y, 9));
  });
  // 放入多个点
  lineGeometry.setFromPoints(pointsArray);
  // 生成随机颜色
  const lineColor = new THREE.Color(
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5
  );

  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
  });
  return new THREE.Line(lineGeometry, lineMaterial);
}

// 根据经纬度坐标生成物体
function drawExtrudeMesh(polygon, color, projection) {
  const shape = new THREE.Shape();
  // console.log(polygon, projection);
  polygon.forEach((row, i) => {
    const [x, y] = projection(row);
    // console.log(row, [x, y]);
    if (i === 0) {
      // 创建起点,使用moveTo方法
      // 因为计算出来的y是反过来，所以要进行颠倒
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
  });

  // 拉伸
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 5,
    bevelEnabled: true,
  });

  // 随机颜色
  const randomColor = (0.5 + Math.random() * 0.5) * 0xffffff;
  const material = new THREE.MeshBasicMaterial({
    color: randomColor,
    transparent: true,
    opacity: 0.5,
  });
  return new THREE.Mesh(geometry, material);
}

if(!__VUEPRESS_SSR__){
// 监听鼠标
window.addEventListener("click", onRay);
}
// 全局对象
let lastPick = null;
function onRay(event) {
  let pickPosition = setPickPosition(event);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pickPosition, camera);
  // 计算物体和射线的交点
  const intersects = raycaster.intersectObjects([map], true);
  // 数组大于0 表示有相交对象
  if (intersects.length > 0) {
    if (lastPick) {
      if (lastPick.object.properties !== intersects[0].object.properties) {
        lastPick.object.material.color.set("#99ff99");
        lastPick = null;
      }
    }
    if (intersects[0].object.properties) {
      intersects[0].object.material.color.set("red");
    }
    lastPick = intersects[0];
  } else {
    if (lastPick) {
      // 复原
      if (lastPick.object.properties) {
        lastPick.object.material.color.set("yellow");
        lastPick = null;
      }
    }
  }
}

/**
 * 获取鼠标在three.js 中归一化坐标
 * */
function setPickPosition(event) {
  let pickPosition = { x: 0, y: 0 };
  // 计算后 以画布 开始为 （0，0）点
  const pos = getCanvasRelativePosition(event);
  // 数据归一化
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
  return pickPosition;
}

// 计算 以画布 开始为（0，0）点 的鼠标坐标
function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

}
onMounted(()=>{
    init()
})
 </script>
<style>

    .map_container {
        position: relative;
    }
</style>
