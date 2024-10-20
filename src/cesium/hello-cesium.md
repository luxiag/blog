---
title: hello cesium
category:
  - Cesium
date: 2023-03-18
---

## Viewer

```js
//Initialize the viewer widget with several custom options and mixins.
const viewer = new Cesium.Viewer("cesiumContainer", {
  //Start in Columbus Viewer
  sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
  //Use Cesium World Terrain
  terrainProvider: Cesium.createWorldTerrain(),
  //Hide the base layer picker
  baseLayerPicker: false,
  //Use OpenStreetMaps
  imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    url: "https://a.tile.openstreetmap.org/",
  }),
  skyBox: new Cesium.SkyBox({
    sources: {
      positiveX: "stars/TychoSkymapII.t3_08192x04096_80_px.jpg",
      negativeX: "stars/TychoSkymapII.t3_08192x04096_80_mx.jpg",
      positiveY: "stars/TychoSkymapII.t3_08192x04096_80_py.jpg",
      negativeY: "stars/TychoSkymapII.t3_08192x04096_80_my.jpg",
      positiveZ: "stars/TychoSkymapII.t3_08192x04096_80_pz.jpg",
      negativeZ: "stars/TychoSkymapII.t3_08192x04096_80_mz.jpg",
    },
  }),
  // Show Columbus View map with Web Mercator projection
  mapProjection: new Cesium.WebMercatorProjection(),
});

//Add basic drag and drop functionality
viewer.extend(Cesium.viewerDragDropMixin);

//Show a pop-up alert if we encounter an error when processing a dropped file
viewer.dropError.addEventListener(function (dropHandler, name, error) {
  console.log(error);
  window.alert(error);
});
```

<div id="cesiumContainer" ref="cesium"></div>

## Provider
```js
// 提供显示在椭圆体表面的图像。
imageryProvider: new Cesium.UrlTemplateImageryProvider({
   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&    scale=1&style=8&x={x{y}&z={z}",
   layer: "tdtVecBasicLayer",
   style: "default",
   format: "image/png",
   tileMatrixSetID: "GoogleMapsCompatible",
 }),
//  为一个椭圆体的表面提供地形或其他几何图形。
   terrainProvider: new Cesium.CesiumTerrainProvider({
      url: "/Cesium/terrains/gz",
    }),
```

<div id="cesiumTerrainContainer"></div>

## 坐标转换

```js
// 1/屏幕坐标系统，二维的笛卡尔坐标系，Cartesian2类型
// 2/地理坐标系统，WGS-84坐标系，Cartographic类型,经度，纬度，高度
// 3/笛卡尔空间直角坐标系，Cartesian3类型
// 角度与弧度的转换
var radians = Cesium.Math.toRadians(90);
console.log(radians);
// 弧度转角度
var degrees = Cesium.Math.toDegrees(2 * Math.PI);
console.log(degrees);

// 将经纬度转为笛卡尔坐标
var cartesian3 = Cesium.Cartesian3.fromDegrees(
  // 经度
  89.5,
  // 纬度
  20.4,
  // 高度
  100
);
console.log(cartesian3);

// 将笛卡尔坐标转为经纬度
var cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
console.log(cartographic);
```

<script setup>
import {ref,onMounted} from 'vue'
import * as Cesium from 'cesium'



const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjRjYTEwNi0zZTljLTRmMjUtYTdlYi0yYjcxNTRmNzEyNDUiLCJpZCI6MTE5MDM1LCJpYXQiOjE2NzkxNDU5NjR9.0I7z7InLhK57lctyV2bUG0vKLryYKhxYEYF0RpEN4Xw'

Cesium.Ion.defaultAccessToken = token 
// 设置cesium静态资源路径
// // 将cesium目录下的Build/Cesium4个目录拷贝到该路径
if(!__VUEPRESS_SSR__) {
window.CESIUM_BASE_URL = "/Cesium/";

}

// 设置cesium默认视角 
//  设置为China
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边的经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);

onMounted(()=>{
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
            // 天地图矢量路径图
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&  request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix=   {TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&    format=tiles&tk=30d07720fa76f07732d83c748bb84211",
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        // }),
        //   天地图影像服务
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&  request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix=   {TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&    format=tiles&tk=30d07720fa76f07732d83c748bb84211",
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        // }),
        // OSM地图,
        // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
        //   url: "https://a.tile.openstreetmap.org/",
        // }),
        // 高德矢量地图,
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&    scale=1&style=8&x={x}&y={y}&z={z}",
        //   layer: "tdtVecBasicLayer",
        //   style: "default",
        //   format: "image/png",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        // }),
    })
    viewer.cesiumWidget.creditContainer.style.display = "none"

    const viewerTerrain = new Cesium.Viewer("cesiumTerrainContainer", {
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
    // 设置地形
    // terrainProvider: Cesium.createWorldTerrain({
    //   requestVertexNormals: true,
    //   requestWaterMask: true,
    // }),
         imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&    scale=1&style=8&x={x}&y={y}&z={z}",
          layer: "tdtVecBasicLayer",
          style: "default",
          format: "image/png",
          tileMatrixSetID: "GoogleMapsCompatible",
        }),
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: "/Cesium/terrains/gz",
    }),
  });

  // 隐藏logo
  viewerTerrain.cesiumWidget.creditContainer.style.display = "none";



})
    
</script>

<style>
@import "/Cesium/Widgets/widgets.css";    
</style>
<<<<<<< HEAD
=======
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


>>>>>>> 6456c69b7aa604175684f41baf40d6eb929d17cb
