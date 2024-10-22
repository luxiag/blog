---
title: 自定义材质
category:
  - Cesium
date: 2023-03-28
---

## Shader 材质

```js
// 编写着色器修改材质
// https://cesium.com/downloads/cesiumjs/releases/b28/Documentation/
let material1 = new Cesium.Material({
  fabric: {
    uniforms: {
      uTime: 0,
    },
    source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          // material.diffuse = vec3(materialInput.st+uTime, 0.0);
          float strength = mod((materialInput.s-uTime) * 10.0, 1.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `,
  },
});
```

<div id="cesiumShader"></div>

## Appearance 自定义外观

```js
let appearance = new Cesium.EllipsoidSurfaceAppearance({
  fragmentShaderSource: `
    varying vec3 v_positionMC;
    varying vec3 v_positionEC;
    varying vec2 v_st;
    uniform float uTime;

    void main()
    {
        czm_materialInput materialInput;

        gl_FragColor = vec4(v_st,uTime, 1.0);
    }
    `,
});
appearance.uniforms = {
  uTime: 0,
};
```

<div id="cesiumAppearance"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as Cesium from 'cesium'
import gsap from 'gsap'
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

const initShaderViewer = () => {
    const shaderViewer = new Cesium.Viewer("cesiumShader", {
        infoBox:false
    })
    shaderViewer.cesiumWidget.creditContainer.style.display = "none";

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
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
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

  let rectGeometry1 = new Cesium.RectangleGeometry({
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
    height: 1000,
  });

  let instance2 = new Cesium.GeometryInstance({
    id: "blueRect",
    geometry: rectGeometry1,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      ),
    },
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 编写着色器修改材质
  // https://cesium.com/downloads/cesiumjs/releases/b28/Documentation/
  let material1 = new Cesium.Material({
    fabric: {
      uniforms: {
        uTime: 0,
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          // material.diffuse = vec3(materialInput.st+uTime, 0.0);
          float strength = mod((materialInput.s-uTime) * 10.0, 1.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `,
    },
  });
    gsap.to(material1.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    ease: "linear",
  });
    let appearance = new Cesium.EllipsoidSurfaceAppearance({
    material: material1,
    aboveGround: false,
    translucent: true,
  });
      let primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    appearance: appearance,
    show: true,
  });
    shaderViewer.scene.primitives.add(primitive);


}

const initAppearanceViewer = () => {

  const appearanceViewer = new Cesium.Viewer("cesiumAppearance", {
    // 是否显示信息窗口
    infoBox: false,
    // terrainProvider: Cesium.createWorldTerrain(),
  });

  // 隐藏logo
  appearanceViewer.cesiumWidget.creditContainer.style.display = "none";


  let material = new Cesium.GridMaterialProperty({
    color: Cesium.Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cesium.Cartesian2(4, 4),
    lineThickness: new Cesium.Cartesian2(4.0, 4.0),
  });



  var rectangle = appearanceViewer.entities.add({
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
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
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

  let rectGeometry1 = new Cesium.RectangleGeometry({
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
    height: 1000,
  });

  let instance2 = new Cesium.GeometryInstance({
    id: "blueRect",
    geometry: rectGeometry1,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      ),
    },
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 编写着色器修改材质
  // https://cesium.com/downloads/cesiumjs/releases/b28/Documentation/
  let material1 = new Cesium.Material({
    fabric: {
      uniforms: {
        uTime: 0,
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          // material.diffuse = vec3(materialInput.st+uTime, 0.0);
          float strength = mod((materialInput.st.x-uTime) * 10.0, 1.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `,
    },
  });


  // 设定几何体都是与地球的椭球体平行
  //假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存

  let appearance = new Cesium.EllipsoidSurfaceAppearance({
    fragmentShaderSource: `
    varying vec3 v_positionMC;
    varying vec3 v_positionEC;
    varying vec2 v_st;
    uniform float uTime;

    void main()
    {
        czm_materialInput materialInput;

        gl_FragColor = vec4(v_st,uTime, 1.0);
    }
    `,
  });
  appearance.uniforms = {
    uTime: 0,
  };

  gsap.to(appearance.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });

  // 04-图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    appearance: appearance,
    show: true,
  });
  // 05-添加到viewer
  appearanceViewer.scene.primitives.add(primitive);
}

onMounted(()=>{


    initShaderViewer()
    initAppearanceViewer()


})
</script>
<style>
@import "/Cesium/Widgets/widgets.css";    
</style>
