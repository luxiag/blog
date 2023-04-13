---
title: cesium物体
category:
  - Cesium
date: 2023-03-22
---

## [entities](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/)

```js
// 创建一个点
var point = viewer.entities.add({
  // 定位点
  position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 700),
  // 点
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 4,
  },
});

// 添加文字标签和广告牌
var label = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 750),
  label: {
    text: "广州塔",
    font: "24px sans-serif",
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 4,
    // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    // 设置文字的偏移量
    pixelOffset: new Cesium.Cartesian2(0, -24),
    // 设置文字的显示位置,LEFT /RIGHT /CENTER
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    // 设置文字的显示位置
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  },
  billboard: {
    image: "./texture/gzt.png",
    width: 50,
    height: 50,
    // 设置广告牌的显示位置
    verticalOrigin: Cesium.VerticalOrigin.TOP,
    // 设置广告牌的显示位置
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
  },
});

// 添加3D模型
const airplane = viewer.entities.add({
  name: "Airplane",
  position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1500),
  model: {
    uri: "./model/Air.glb",
    // 设置飞机的最小像素
    minimumPixelSize: 128,
    // 设置飞机的轮廓
    silhouetteSize: 5,
    // 设置轮廓的颜色
    silhouetteColor: Cesium.Color.WHITE,
    // 设置相机距离模型多远的距离显示
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
  },
});

// 使用entity创建矩形
const rectangle = viewer.entities.add({
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      90,
      // 南边维度
      20,
      // 东边经度
      110,
      // 北边维度
      30
    ),
    material: Cesium.Color.RED.withAlpha(0.5),
  },
});

// 设置材质
// 网格纹理
let material = new Cesium.GridMaterialProperty({
  color: Cesium.Color.YELLOW,
  cellAlpha: 0.2,
  lineCount: new Cesium.Cartesian2(4, 4),
  lineThickness: new Cesium.Cartesian2(4.0, 4.0),
});
const rectangle = viewer.entities.add({
  id: "entityRect",
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      90,
      // 南边维度
      20,
      // 东边经度
      110,
      // 北边维度
      30
    ),
    // 设置entity材质，MaterialProperty
    // material: Cesium.Color.RED.withAlpha(0.5),
    material: material,
  },
});

// 设置折线
// 设置发光飞线效果
let material = new Cesium.PolylineGlowMaterialProperty({
  // 设置发光程度
  glowPower: 0.8,
  // 尾椎缩小程度
  taperPower: 0.7,
  color: Cesium.Color.RED,
});

const redLine = viewer.entities.add({
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
    width: 20,
    material: material,
  },
});
```

<div id="cesiumEntities"></div>

## primitives

```js
// 添加3D建筑
const osmBuildings = viewer.scene.primitives.add(
  new Cesium.createOsmBuildings()
);

// primivite创建矩形
// 01-创建几何体
let rectGeometry = new Cesium.RectangleGeometry({
  rectangle: Cesium.Rectangle.fromDegrees(
    // 西边的经度
    115,
    // 南边维度
    20,
    // 东边经度
    135,
    // 北边维度
    30
  ),
  // 距离表面高度
  height: 0,
  vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
});

// 02-创建几何体实例
let instance = new Cesium.GeometryInstance({
  id: "blueRect",
  geometry: rectGeometry,
  attributes: {
    color: Cesium.ColorGeometryInstanceAttribute.fromColor(
      Cesium.Color.RED.withAlpha(0.5)
    ),
  },
});

// 03-设置外观
let appearance = new Cesium.PerInstanceColorAppearance({
  flat: true,
});
// 04-图元
let primitive = new Cesium.Primitive({
  geometryInstances: instance,
  appearance: appearance,
});
// 05-添加到viewer
viewer.scene.primitives.add(primitive);

// 动态修改图元颜色
setInterval(() => {
  let attributes = primitive.getGeometryInstanceAttributes("blueRect");
  attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
    // Cesium.Color.YELLOW.withAlpha(0.5)
    Cesium.Color.fromRandom({
      alpha: 0.5,
    })
  );
}, 2000);

// 拾取
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (movement) {
  // console.log(movement);
  // scene.pick选中物体
  var pickedObject = viewer.scene.pick(movement.position);
  console.log(pickedObject);
  if (Cesium.defined(pickedObject) && typeof pickedObject.id == "string") {
    // console.log(pickedObject.id);
    let attributes = primitive.getGeometryInstanceAttributes(pickedObject.id);
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
      Cesium.Color.YELLOW.withAlpha(0.5)
    );
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// primitives材质

let material1 = new Cesium.Material.fromType("Water", {
  baseWaterColor: Cesium.Color.AQUA.withAlpha(0.8),
  distortion: 0.25,
  normalMap: "./Assets/Textures/waterNormals.jpg",
});

console.log(material1);

// 设定几何体都是与地球的椭球体平行
//假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
let appearance = new Cesium.EllipsoidSurfaceAppearance({
  material: material1,
  aboveGround: false,
  translucent: true,
});
```

<div id="cesiumPrimitives"></div>

### RectangleGeometry

![]./(./images/0409171155.png)

<script setup>
import {ref,onMounted} from 'vue'
import * as Cesium from "cesium";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjRjYTEwNi0zZTljLTRmMjUtYTdlYi0yYjcxNTRmNzEyNDUiLCJpZCI6MTE5MDM1LCJpYXQiOjE2NzkxNDU5NjR9.0I7z7InLhK57lctyV2bUG0vKLryYKhxYEYF0RpEN4Xw'

Cesium.Ion.defaultAccessToken = token
// 设置 cesium 静态资源路径
// // 将 cesium 目录下的 Build/Cesium4 个目录拷贝到该路径
if(!__VUEPRESS_SSR__) {
window.CESIUM_BASE_URL = "/Cesium/";

}

// 设置 cesium 默认视角
// 设置为 China
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
    const viewerEntities = new Cesium.Viewer("cesiumEntities",{
    // 是否显示信息窗口
    infoBox: false,
    })
      // 生成广州塔的位置,113.3191, 23.109
  const position2 = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000);

  // flyto,让相机飞往某个地方
  viewerEntities.camera.flyTo({
    destination: position2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
     // 隐藏logo
     viewerEntities.cesiumWidget.creditContainer.style.display = "none";
     // 创建一个点
     const point = viewerEntities.entities.add({
       // 定位点
       position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 700),
       // 点
       point: {
         pixelSize: 10,
         color: Cesium.Color.RED,
         outlineColor: Cesium.Color.WHITE,
         outlineWidth: 4,
       },
     });
      // 添加文字标签和广告牌
  const label = viewerEntities.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 750),
    label: {
      text: "广州塔",
      font: "24px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 4,
      // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      // 设置文字的偏移量
      pixelOffset: new Cesium.Cartesian2(0, -24),
      // 设置文字的显示位置,LEFT /RIGHT /CENTER
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      // 设置文字的显示位置
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
    billboard: {
      image: "/Cesium/texture/gzt.png",
      width: 50,
      height: 50,
      // 设置广告牌的显示位置
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      // 设置广告牌的显示位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    },
  });


  // 添加3D模型
  const airplane = viewerEntities.entities.add({
    name: "Airplane",
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1500),
    model: {
      uri: "/Cesium/model/Air.glb",
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 5,
      // 设置轮廓的颜色
      silhouetteColor: Cesium.Color.WHITE,
      // 设置相机距离模型多远的距离显示
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
    },
  });
    // 网格纹理
  let material = new Cesium.GridMaterialProperty({
    color: Cesium.Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cesium.Cartesian2(4, 4),
    lineThickness: new Cesium.Cartesian2(4.0, 4.0),
  });

  let material2 = new Cesium.PolylineGlowMaterialProperty({
    // 设置发光程度
    glowPower: 0.8,
    // 尾椎缩小程度
    taperPower: 0.7,
    color: Cesium.Color.RED,
  });
    // 使用entity创建矩形
  const rectangle = viewerEntities.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30
      ),
      // material: Cesium.Color.RED.withAlpha(0.5),
       material: material,
    },
  });
   viewerEntities.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      width: 20,
      material: material2,
    },
  });









  // Primitives
    const viewerPrimitives = new Cesium.Viewer("cesiumPrimitives", {
    // 是否显示信息窗口
    infoBox: false,
  });
  
  // flyto,让相机飞往某个地方
  viewerPrimitives.camera.flyTo({
    destination: position2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
  // 添加3D建筑
  const osmBuildings = viewerPrimitives.scene.primitives.add(
    new Cesium.createOsmBuildings()
  );
   // primivite创建矩形
  // 01-创建几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  });

  let rectGeometry2 = new Cesium.RectangleGeometry({
 
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      140,
      // 南边维度
      20,
      // 东边经度
      160,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
  });

  // 02-创建几何体实例
  let instance = new Cesium.GeometryInstance({
        id: "redRect",
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.RED.withAlpha(0.5)
      ),
    },
  });
    let instance2 = new Cesium.GeometryInstance({
        id: "blueRect",
    geometry: rectGeometry2,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      ),
    },
  });

    // 03-设置外观
  // let appearance = new Cesium.PerInstanceColorAppearance({
  //   flat: true,
  // });
  // appearance 材质
    let material1 = new Cesium.Material.fromType("Water", {
    baseWaterColor: Cesium.Color.AQUA.withAlpha(0.8),
    distortion: 0.25,
    normalMap: "/Cesium/Assets/Textures/waterNormals.jpg",
  });
    let appearance = new Cesium.EllipsoidSurfaceAppearance({
    material: material1,
    aboveGround: false,
    translucent: true,
  });
  // 04-图元
  let primitive = new Cesium.Primitive({
    // 单个图元 
    // geometryInstances: instance,
    // 多个图元
     geometryInstances: [instance, instance2],
    appearance: appearance,
    show:true,
  });
  // 05-添加到viewer
  viewerPrimitives.scene.primitives.add(primitive);
    // 动态修改图元颜色
  // 动态修改图元颜色
  setInterval(() => {
    let attributes = primitive.getGeometryInstanceAttributes("blueRect");
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
      // Cesium.Color.YELLOW.withAlpha(0.5)
      Cesium?.Color.fromRandom({
        alpha: 0.5,
      })
    );
  }, 2000);
  
    // 拾取
  var handler = new Cesium.ScreenSpaceEventHandler(viewerPrimitives.scene.canvas);
  handler.setInputAction(function (movement) {
    // console.log(movement);
    // scene.pick选中物体
    var pickedObject = viewerPrimitives.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && typeof pickedObject.id == "string") {
      // console.log(pickedObject.id);
      let attributes = primitive.getGeometryInstanceAttributes(pickedObject.id);
      attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
        Cesium.Color.YELLOW.withAlpha(0.5)
      );
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
})

</script>
<style>
@import "/Cesium/Widgets/widgets.css";    
</style>
