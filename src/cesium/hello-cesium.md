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
window.CESIUM_BASE_URL = "/Cesium/";

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
