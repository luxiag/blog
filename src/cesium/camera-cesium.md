---
title: cesium相机
category:
  - Cesium
date: 2023-03-19
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

<div id="cesiumFlyTo"></div>

## [setView](https://cesium.com/learn/cesiumjs/ref-doc/Camera.html?classFilter=camera)

设置摄像机的位置、方向和变换。

```js
// 瞬间到达指定位置，视角
// 1. Set position with a top-down view
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
});

// 2 Set view with heading, pitch and roll
viewer.camera.setView({
  destination: cartesianPosition,
  orientation: {
    heading: Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
    pitch: Cesium.Math.toRadians(-90), // default value (looking down)
    roll: 0.0, // default value
  },
});

// 3. Change heading, pitch and roll with the camera position remaining the same.
viewer.camera.setView({
  orientation: {
    heading: Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
    pitch: Cesium.Math.toRadians(-90), // default value (looking down)
    roll: 0.0, // default value
  },
});

// 4. View rectangle with a top-down view
viewer.camera.setView({
  destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
});

// 5. Set position with an orientation using unit vectors.
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.04231243104240401,
      -0.20123236049443421,
      -0.97862924300734
    ),
    up: new Cesium.Cartesian3(
      -0.47934589305293746,
      -0.8553216253114552,
      0.1966022179118339
    ),
  },
});
```

<div id="cesiumSetView"></div>

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

<div id="cesiumMove"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as Cesium from "cesium";
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


onMounted(() => {
  // 生成position是天安门的位置
  const position = Cesium.Cartesian3.fromDegrees(116.393428, 39.90923, 100);
  const viewerFlyTo = new Cesium.Viewer("cesiumFlyTo", {
    // 是否显示信息窗口
    infoBox: false,
  });
  viewerFlyTo.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-20),
      roll: 0,
    },
  });
  const viewerSetView = new Cesium.Viewer("cesiumSetView", {
    // 是否显示信息窗口
    infoBox: false,
  });
viewerSetView.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.04231243104240401,
      -0.20123236049443421,
      -0.97862924300734
    ),
    up: new Cesium.Cartesian3(
      -0.47934589305293746,
      -0.8553216253114552,
      0.1966022179118339
    ),
  },
});

  const viewer = new Cesium.Viewer("cesiumMove", {
    // 是否显示信息窗口
    infoBox: false,
  });

  if(!__VUEPRESS_SSR__) {
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
  }


});
</script>

<style>
@import "/Cesium/Widgets/widgets.css";    
</style>
