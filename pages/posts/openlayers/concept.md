---
title: Hello OpenLayers
date: 2023-06-16
category:
    - OpenLayers
---

参考: https://github.com/jacksplwxy/openlayers

## 基本概念

- GIS：地理信息系统（Geographic Information System或 Geo－Information system，GIS）有时又称为“地学信息系统”。它是一种特定的十分重要的空间信息系统。它是在计算机硬、软件系统支持下，对整个或部分地球表层（包括大气层）空间中的有关地理分布数据进行采集、储存、管理、运算、分析、显示和描述的技术系统。
- WebGIS：网络地理信息系统。是指工作在Web网上的GIS,是传统的GIS在网络上的延伸和发展，具有传统GIS的特点，可以实现空间数据的检索、查询、制图输出、编辑等GIS基本功能，同时也是Internet 上地理信息发布、共享和交流协作的基础。
- GeoJSON：是一种对各种地理数据结构进行编码的格式，基于Javascript对象表示法的地理空间信息数据交换格式。GeoJSON对象可以表示几何、特征或者特征集合。GeoJSON支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON里的特征包含一个几何对象和其他属性，特征集合表示一系列特征


### 坐标系

- 地理坐标系（geographic coordinate systems）：地理坐标系一般是指由经度、纬度和高度组成的坐标系，能够标示地球上的任何一个位置 
- 投影坐标系（projected coordinate systems）：地理坐标系是三维的，我们要在地图或者屏幕上显示就需要转化为二维，这被称为投影（Map projection）。显而易见的是，从三维到二维的转化，必然会导致变形和失真，失真是不可避免的，但是不同投影下会有不同的失真，这让我们可以有得选择

### GIS地理信息系统的坐标系统

- WGS-84：GPS坐标系，是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
- GCJ-02：火星坐标系，国测局02年发布的坐标体系，中国坐标偏移标准，Google Map、高德、腾讯使用
- BD-09：百度坐标系，百度自研，百度地图使用。


## Map对象
Map对象是OpenLayers中的地图对象，它是一个容器，用于存放各种图层和控件。Map对象的属性包括：

- controls：地图上的控件，如缩放控件、比例尺控件等。
- interactions：地图上的交互，如拖拽、缩放等。
- keyboardEventTarget：接收键盘事件的元素。
- layers：地图上的图层，如矢量图层、栅格图层等。
- overlays：地图上的覆盖物，如弹出框、标注等。
- pixelRatio：设备像素比率。
- renderer：渲染器类型，canvas或webgl。
- target：渲染地图的目标元素或其id。
- view：地图上的视图。
  
Map对象的方法包括：

- addLayer(layer)：向地图中添加一个图层。
- removeLayer(layer)：从地图中移除一个图层。
- addControl(control)：向地图中添加一个控件。
- removeControl(control)：从地图中移除一个控件。
- addInteraction(interaction)：向地图中添加一个交互。
- removeInteraction(interaction)：从地图中移除一个交互。


### View

### Source对象
Source对象是OpenLayers中的数据源对象，它用于获取数据并将其转换为OpenLayers可用的格式。Source对象的属性包括：

- url：数据源的URL地址。
- format：数据源的格式。
- projection：数据源的投影方式。
  
Source对象的方法包括：

- setUrl(url)：设置数据源的URL地址。
- setFormat(format)：设置数据源的格式。
- setProjection(projection)：设置数据源的投影方式。

### Layer对象
Layer对象是OpenLayers中的图层对象，它用于显示地图上的各种元素。Layer对象的属性包括：

- source：该图层所使用的数据源。
- visible：该图层是否可见。
- opacity：该图层透明度。
  
Layer对象的方法包括：

- setSource(source)：设置该图层所使用的数据源。
- setVisible(visible)：设置该图层是否可见。
- setOpacity(opacity)：设置该图层透明度。

```js
import "ol/ol.css"
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';

new Map({
  layers: [
    new TileLayer({source: new OSM()}),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
  target: 'map',
});
```

<div id="map" style="width:100%;height:300px;"></div>

<script setup>

import {onMounted} from 'vue'

import "ol/ol.css"
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';


const initMap = () => {
new Map({
  layers: [
    new TileLayer({source: new OSM()}),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
  target: 'map',
});

}
onMounted(()=>{
    initMap()
})

</script>