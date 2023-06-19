---
title: Cesium中的摄像机
category:
  - Cesium
date: 2023-03-20
---

## flyTo

```js
// flyto,让相机飞往某个地方

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
});

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
  orientation: {
    heading: Cesium.Math.toRadians(20.0),
    pitch: Cesium.Math.toRadians(-35.0),
    roll: 0.0,
  },
});
```

<iframe src="/cesium/examples/camera-cesium-flyto.html"></iframe>


## [setView](https://cesium.com/learn/cesiumjs/ref-doc/Camera.html?classFilter=camera)

设置摄像机的位置、方向和变换。

```js
// 瞬间到达指定位置和视角

// 1. 设置相机在地球上指定经纬度的高度视角
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0), // 设置相机在地球上指定经纬度的高度视角
});

// 2. 设置相机在地球上指定经纬度的位置和方向
viewer.camera.setView({
  destination: cartesianPosition, // 设置相机在地球上指定经纬度的位置
  orientation: {
    heading: Cesium.Math.toRadians(90.0), // 方向，单位为弧度，0.0为正北，正值表示向东，负值表示向西
    pitch: Cesium.Math.toRadians(-90), // 俯仰角，单位为弧度，正值表示往上看，负值表示往下看
    roll: 0.0, // 滚动角，单位为弧度，表示围绕视线轴旋转
  },
});

// 3. 设置相机方向，视角位置不变
viewer.camera.setView({
  orientation: {
    heading: Cesium.Math.toRadians(90.0), // 方向，单位为弧度，0.0为正北，正值表示向东，负值表示向西
    pitch: Cesium.Math.toRadians(-90), // 俯仰角，单位为弧度，正值表示往上看，负值表示往下看
    roll: 0.0, // 滚动角，单位为弧度，表示围绕视线轴旋转
  },
});

// 4. 设置相机在地球上指定经纬度范围的高度视角
viewer.camera.setView({
  destination: Cesium.Rectangle.fromDegrees(west, south, east, north), // 设置相机在地球上指定经纬度范围的高度视角
});

// 5. 设置相机在地球上指定经纬度的位置和方向，使用单位向量
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0), // 设置相机在地球上指定经纬度的位置
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.04231243104240401, // 相机视线的方向向量的x分量
      -0.20123236049443421, // 相机视线的方向向量的y分量
      -0.97862924300734 // 相机视线的方向向量的z分量
    ),
    up: new Cesium.Cartesian3(
      -0.47934589305293746, // 相机向上的方向向量的x分量
      -0.8553216253114552, // 相机向上的方向向量的y分量
      0.1966022179118339 // 相机向上的方向向量的z分量
    ),
  },
});
```

## move

```js
// 通过按键移动相机
document.addEventListener("keydown", (e) => {
  // console.log(e);
  // 获取相机离地面的高度
  var height = viewer.camera.positionCartographic.height;
  var moveRate = height / 100;
  if (e.key == "w") {
    // 设置相机向前移动
    viewer.camera.moveForward(moveRate);
  } else if (e.key == "s") {
    // 设置相机向后移动
    viewer.camera.moveBackward(moveRate);
  } else if (e.key == "a") {
    // 设置相机向左移动
    viewer.camera.moveLeft(moveRate);
  } else if (e.key == "d") {
    // 设置相机向右移动
    viewer.camera.moveRight(moveRate);
  } else if (e.key == "q") {
    // 设置相机向左旋转相机
    viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
  } else if (e.key == "e") {
    // 设置相机向右旋转相机
    viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
  } else if (e.key == "r") {
    // 设置相机向上旋转相机
    viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
  } else if (e.key == "f") {
    // 设置相机向下旋转相机
    viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
  } else if (e.key == "g") {
    // 向左逆时针翻滚
    viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
  } else if (e.key == "h") {
    // 向右顺时针翻滚
    viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
  }
});
```

<iframe ref="cameraCesiumRef" src="/cesium/examples/camera-cesium-move.html"></iframe>

## [CesiumNavigationEs6](https://www.npmjs.com/package/cesium-navigation-es6)

```js
import {  Viewer,Rectangle} from "cesium";
import 'cesium/Build/Cesium/Widgets/widgets.css';

const viewer = new Viewer("cesiumContainer",{
    animation:false,
    timeline:false
});

const options = {};
// 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
// options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50)
options.defaultResetView = new Cartographic(CesiumMath.toRadians(111.50623801848565), CesiumMath.toRadians(2.8997206760441205), 8213979.400955964)
//相机方向
options.orientation = {
    heading: CesiumMath.toRadians(350.94452087411315),
    pitch: CesiumMath.toRadians(-66.6402342251215),
    roll: CesiumMath.toRadians(360)
}
//相机延时
options.duration = 4//默认为3s

// 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
options.enableCompass= true;
// 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
options.enableZoomControls= true;
// 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
options.enableDistanceLegend= true;
// 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
options.enableCompassOuterRing= true;

//修改重置视图的tooltip
options.resetTooltip = "重置视图";
//修改放大按钮的tooltip
options.zoomInTooltip = "放大";
//修改缩小按钮的tooltip
options.zoomOutTooltip = "缩小";

//如需自定义罗盘控件，请看下面的自定义罗盘控件
new CesiumNavigation(viewer, options);

```

<iframe ref="cameraCesiumRef" src="/cesium/examples/camera-cesium-navigation.html"></iframe>



<script setup>





</script>

<style>

  iframe {
    width:100%;
    height:500px;
  }
</style>
