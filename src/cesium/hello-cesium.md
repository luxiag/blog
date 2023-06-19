---
title: hello cesium
category:
  - Cesium
date: 2023-03-18
---

## Viewer
当进行 Cesium 开发时，Viewer 组件是一个必不可少的组件，它是一个包含了场景、相机、渲染器以及其他各种 Cesium 组件的容器，也是开发者和用户可以看到和交互的主要界面。以下是一些 Viewer 组件中常见的 API 和元素控制：

1. 场景控制：Viewer 组件中包含的场景对象可以通过以下 API 进行控制：

- `viewer.scene.globe`: 可以控制三维球形地球的相关属性，例如地形、图像、水面等。
- `viewer.scene.skyBox`: 可以控制场景中的天空盒子。
- `viewer.scene.sun`: 可以控制场景中的太阳位置。

2. 相机控制：Viewer 组件中包含的相机对象可以通过以下 API 进行控制：

- `viewer.camera.flyTo`: 可以飞到指定的位置和方向。
- `viewer.camera.setView`: 可以设置相机的位置和方向。
- `viewer.camera.lookAt`: 可以设置相机的焦点和方向。
- `viewer.camera.zoomIn`: 可以将相机拉近。

3. 图层控制：Viewer 组件中可以添加和控制多个图层。以下是一些相关的 API：

- `viewer.imageryLayers.addImageryProvider`: 可以添加地图图层。
- `viewer.dataSources.add`: 可以添加数据源。

4. 实体控制：Viewer 组件中可以添加和控制多个实体。以下是一些相关的 API：

- `viewer.entities.add`: 可以添加实体。
- `viewer.entities.getById`: 可以根据 ID 获取实体。
- `viewer.entities.remove`: 可以移除指定的实体。

5. 事件控制：Viewer 组件中可以通过以下 API 来控制事件：

- `viewer.screenSpaceEventHandler`: 可以监听鼠标或触摸屏事件。
- `viewer.clock.onTick`: 可以监听时间变化事件。


6. 控件：Viewer组件中提供了一些常见的控件，例如，导航控件（Navigation widget）、时间轴控件（Timeline widget）和全屏控件（Fullscreen widget）。这些控件都有对应的API可以在代码中进行操作。

- Navigation widget: 这个控件提供了一些基本的导航功能，例如缩放、平移、旋转和倾斜视图。它可以通过Viewer的实例调用实现，如下：

```javascript
viewer.navigationHelpButton.show();
viewer.navigationInstructionsInitiallyVisible = false;
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000;
```

- Timeline widget: 这个控件提供了一个时间轴，可以查看和比较不同时间的数据。它也可以通过Viewer的实例进行控制，如下：

```javascript
viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
viewer.timeline.addEventListener('settime', function(e) {
    viewer.clock.currentTime = e.timeJulian;
    viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
});
```

- Fullscreen widget: 这个控件提供了全屏显示Cesium Viewer的功能，可以通过Viewer的实例进行控制，如下：

```javascript
viewer.fullscreenButton.show();
```


```javascript
var navigation = new Cesium.NavigationControl({
  camera: viewer.camera,
  canvas: viewer.canvas
});
viewer.extend(navigation, {
  bottom: "100px",
  left: "10px"
});
```
```js
const viewer = new Cesium.Viewer("cesiumContainer", {
   terrainProvider: Cesium.createWorldTerrain(),
 });
```

<iframe src="/cesium/examples/hello-cesium.html"></iframe>



## [ConstructorOptionswidgets](https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html#.ConstructorOptions)

```js
const viewer = new Cesium.Viewer("cesiumContainer",{
    // 是否显示信息窗口
    infoBox: false,
    // 是否显示查询按钮
    geocoder: false,
    // 不显示home按钮
    homeButton: false,
    // 控制查看器的显示模式
    sceneModePicker: false,
    // 是否显示图层选择
    baseLayerPicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否播放动画
    animation: false,
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
        // 设置天空盒
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "/Cesium/texture/sky/px.jpg",
        negativeX: "/Cesium/texture/sky/nx.jpg",
        positiveY: "/Cesium/texture/sky/ny.jpg",
        negativeY: "/Cesium/texture/sky/py.jpg",
        positiveZ: "/Cesium/texture/sky/pz.jpg",
        negativeZ: "/Cesium/texture/sky/nz.jpg",
      },
    }),
     // Show Columbus View map with Web Mercator projection
   mapProjection: new Cesium.WebMercatorProjection(),
})

```

<iframe src="/cesium/examples/hello-cesium-constructorOptionswidgets.html"></iframe>

## 


<script setup>

    
</script>
<style>

  iframe {
    width:100%;
    height:500px;
  }
</style>


