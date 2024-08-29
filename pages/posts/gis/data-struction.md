---
title: GIS中的数据格式
date: 2023-04-23
category: 
    - GIS
---

## GeoJSON

GeoJSON总是由一个单独的对象组成。这个对象（指的是下面的GeoJSON对象）表示几何、要素或者要素集合。

- GeoJSON对象可能有任意数目成员（键值对）。
- GeoJSON对象必须有一个名字为"type"的成员。这个成员的值是由GeoJSON对象的类型所确定的字符串。
- type成员的值必须是下面之一："Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature", 或者 "FeatureCollection"。
- GeoJSON对象可能有一个可选的"crs"成员，它的值必须是一个坐标参考系统的对象。
- GeoJSON对象可能有一个"bbox"成员，它的值必须是边界框数组。

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [102.0, 0.5]
  },
  "properties": {
    "name": "Somewhere",
    "description": "This is a point feature"
  }
}

```

### Geometry

- Point：一个点由一个坐标对表示。
```json
{
  "type": "Point",
  "coordinates": [100.0, 0.0]
}
```

- LineString：一条线由一组坐标对组成。
```json
{
  "type": "LineString",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

- Polygon：一个多边形由一组环组成，每个环由一组坐标对组成。外环表示多边形的外部边界，内环表示多边形的内部区域。
```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ],
    [
      [100.2, 0.2],
      [100.8, 0.2],
      [100.8, 0.8],
      [100.2, 0.8],
      [100.2, 0.2]
    ]
  ]
}
```

- MultiPoint：多个点的集合。
```json
{
  "type": "MultiPoint",
  "coordinates": [
    [100.0, 0.0],
    [101.0, 1.0]
  ]
}
```

- MultiLineString：多个线的集合。
```json
{
  "type": "MultiLineString",
  "coordinates": [
    [
      [100.0, 0.0],
      [101.0, 1.0]
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0]
    ]
  ]
}
```

- MultiPolygon：多个多边形的集合。
```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ]
    ],
    [
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2]
      ],
      [
        [100.4, 0.4],
        [100.6, 0.4],
        [100.6, 0.6],
        [100.4, 0.6],
        [100.4, 0.4]
      ]
    ]
  ]
}
```

- GeometryCollection：各种几何类型的集合，可以包含点、线、面等多种类型的几何形状。
```json
{
  "type": "GeometryCollection",
  "geometries": [
    {
      "type": "Point",
      "coordinates": [100.0, 0.0]
    },
    {
      "type": "LineString",
      "coordinates": [
        [101.0, 0.0],
        [102.0, 1.0]
      ]
    }
  ]
}
```

- Feature：在几何形状基础上附加属性信息，表示现实世界中的一个实体，如城市、湖泊等。
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [100.0, 0.0]
  },
  "properties": {
    "name": "City",
    "population": 100000
  }
}
```

- FeatureCollection：在多个 Feature 的基础上组成的集合。
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [100.0, 0.0]
      },
      "properties": {
        "name": "City",
        "population": 100000
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [101.0, 0.0],
          [102.0, 1.0]
        ]
      },
      "properties": {
        "name": "River",
        "length": 100
      }
    }
  ]
}
```

