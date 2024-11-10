---
title: ThreeJS中的材质
date: 2022-01-10
category:
    - ThreeJS
---



目前ThreeJS中存在18种材质

材质描述了对象objects的外观。它们的定义方式与渲染器无关， 因此，如果您决定使用不同的渲染器，不必重写材质。

## 物体的创建

```js
// 先创建物体的图元（Geometry）
const cubeGeometry =  new THREE.SphereGeometry(5, 16, 16)
// 创建物体的材质
const cubeMaterial =   new THREE.MeshPhongMaterial({
  color: 0xFF0000,    // 红色 (也可以使用CSS的颜色字符串)
  flatShading: true,
});
// 创建物理
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
```

## 材质颜色

```js
// 1
const material = new THREE.MeshPhongMaterial({
  color: 0xFF0000,    // 红色 (也可以使用CSS的颜色字符串)
  flatShading: true,
});
// 2 j
const material = new THREE.MeshPhongMaterial();
material.color.setHSL(0, 1, .5);  // 红色
// 定义材质是否使用平面着色进行渲染
material.flatShading = true;
```
### 颜色的设置
```js
material.color.set(0x00FFFF);    // 同 CSS的 #RRGGBB 风格
material.color.set(cssString);   // 任何 CSS 颜色字符串, 比如 'purple', '#F32',
                                 // 'rgb(255, 127, 64)',
                                 // 'hsl(180, 50%, 25%)'
material.color.set(someColor)    // 其他一些 THREE.Color
material.color.setHSL(h, s, l)   // 其中 h, s, 和 l 从 0 到 1
material.color.setRGB(r, g, b)   // 其中 r, g, 和 b 从 0 到 1

const m1 = new THREE.MeshBasicMaterial({color: 0xFF0000});         // 红色
const m2 = new THREE.MeshBasicMaterial({color: 'red'});            // 红色
const m3 = new THREE.MeshBasicMaterial({color: '#F00'});           // 红色
const m4 = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'});   // 红色
const m5 = new THREE.MeshBasicMaterial({color: 'hsl(0,100%,50%)'}); // 红色
```

## 材质的区别

<!-- 
| 材质类型           | 效果与区别                                                                               | 适用场景                                       | 特殊属性                                                                                                           | 默认值                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| BasicMaterial      | 最简单的材质类型，只有漫反射颜色和高光反射高光亮度，默认情况下不会产生阴影               | 用于简单场景或测试，渲染性能较好               | 无                                                                                                                 | 无                                                                                    |
| LambertMaterial    | 漫反射颜色和反光亮度，地面、墙壁等比较粗糙物体通常使用它                                 | 用于不需要高光反射，需要高效渲染的场景         | emissive: 光亮度颜色                                                                                               | 0x000000                                                                              |
| PhongMaterial      | 拥有漫反射颜色、高光颜色和高光大小，并且可以设置光的颜色和强度等                         | 用于需要出现高光反射物体的场景                 | specular: 高光颜色, shininess: 高光大小                                                                            | specular: 0x111111, shininess: 30                                                     |
| ToonMaterial       | 类似卡通或手绘风格的材质，具有明显的边缘效果和扁平的明暗转换                             | 用于制作卡通风格的场景                         | gradientMap: 用于计算材质颜色的纹理,或直接设置colorRamp: 颜色渐变对象                                              | GradientMap: Three.js 默认提供的纹理                                                  |
| StandardMaterial   | 性能表现较好，且支持 PBR（基于物理的渲染），拥有漫反射色、金属度、粗糙度、法向贴图等属性 | 用于需要精细的纹理效果，同时不影响性能的场景   | roughness: 粗糙度, metalness: 金属度, envMap: 环境贴图纹理                                                         | roughness: 0.5, metalness: 0.5, envMap: null                                          |
| PhysicalMaterial   | 拥有漫反射色、金属度、粗糙度、法向贴图等属性，同时支持自发光和透射                       | 用于需要模拟现实光线穿透或散射效果的场景       | roughness: 粗糙度, metalness: 金属度, envMap: 环境贴图纹理， clearCoat: 透明度, clearCoatRoughness: 透明度的粗糙度 | roughness: 0.5, metalness: 0.5, envMap: null, clearCoat: 0.0, clearCoatRoughness: 0.0 |
| MeshNormalMaterial | 将物体的法向量映射到 RGB 色值，用于调试和表示物体表面的法线方向                          | 用于检查模型是否有问题，不适用于最终渲染的场景 | 无                                                                                                                 |

-->




| 材质类型           | 效果与区别                                                                               | 适用场景                                       |
| ------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------- |
| BasicMaterial      | 最简单的材质类型，只有漫反射颜色和高光反射高光亮度，默认情况下不会产生阴影               | 用于简单场景或测试，渲染性能较好               |
| LambertMaterial    | 漫反射颜色和反光亮度，地面、墙壁等比较粗糙物体通常使用它                                 | 用于不需要高光反射，需要高效渲染的场景         |
| PhongMaterial      | 拥有漫反射颜色、高光颜色和高光大小，并且可以设置光的颜色和强度等                         | 用于需要出现高光反射物体的场景                 |
| ToonMaterial       | 类似卡通或手绘风格的材质，具有明显的边缘效果和扁平的明暗转换                             | 用于制作卡通风格的场景                         |
| StandardMaterial   | 性能表现较好，且支持 PBR（基于物理的渲染），拥有漫反射色、金属度、粗糙度、法向贴图等属性 | 用于需要精细的纹理效果，同时不影响性能的场景   |
| PhysicalMaterial   | 拥有漫反射色、金属度、粗糙度、法向贴图等属性，同时支持自发光和透射                       | 用于需要模拟现实光线穿透或散射效果的场景       |
| MeshNormalMaterial | 将物体的法向量映射到 RGB 色值，用于调试和表示物体表面的法线方向                          | 用于检查模型是否有问题，不适用于最终渲染的场景 |

### 材质独有属性

| 材质类型           | 特殊属性                                                                                                           | 默认值                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| BasicMaterial      | 无                                                                                                                 | 无                                                                                    |
| LambertMaterial    | emissive: 光亮度颜色                                                                                               | 0x000000                                                                              |
| PhongMaterial      | specular: 高光颜色, shininess: 高光大小                                                                            | specular: 0x111111, shininess: 30                                                     |
| ToonMaterial       | gradientMap: 用于计算材质颜色的纹理,或直接设置colorRamp: 颜色渐变对象                                              | GradientMap: Three.js 默认提供的纹理                                                  |
| StandardMaterial   | roughness: 粗糙度, metalness: 金属度, envMap: 环境贴图纹理                                                         | roughness: 0.5, metalness: 0.5, envMap: null                                          |
| PhysicalMaterial   | roughness: 粗糙度, metalness: 金属度, envMap: 环境贴图纹理， clearCoat: 透明度, clearCoatRoughness: 透明度的粗糙度 | roughness: 0.5, metalness: 0.5, envMap: null, clearCoat: 0.0, clearCoatRoughness: 0.0 |
| MeshNormalMaterial | 无                                                                                                                 | 无                                                                                    |








## 材质常见共有属性




| 属性               | 默认值                       | 属性值类型                                                                                                                  | 作用             |
| ------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| color              | 0xffffff                     | Color                                                                                                                       | 材质颜色         |
| map                | null                         | Texture                                                                                                                     | 用于添加纹理贴图 |
| alphaMap           | null                         | Texture                                                                                                                     | 材质透明贴图     |
| transparent        | false                        | Boolean                                                                                                                     | 是否开启透明     |
| opacity            | 1                            | Number                                                                                                                      | 透明度（0~1）    |
| visible            | true                         | Boolean                                                                                                                     | 是否可见         |
| side               | THREE.FrontSide              | Enum(THREE.FrontSide, THREE.BackSide, THREE.DoubleSide)                                                                     | 材质显示的面     |
| wireframe          | false                        | Boolean                                                                                                                     | 是否渲染为线框   |
| wireframeLinewidth | 1                            | Number                                                                                                                      | 线框宽度         |
| depthTest          | true                         | Boolean                                                                                                                     | 是否开启深度测试 |
| depthWrite         | true                         | Boolean                                                                                                                     | 是否开启深度写入 |
| blending           | THREE.NormalBlending         | Enum(THREE.NormalBlending, THREE.AdditiveBlending, THREE.SubtractiveBlending, THREE.MultiplyBlending, THREE.CustomBlending) | 混合模式         |
| blendSrc           | THREE.SrcAlphaFactor         | Enum                                                                                                                        | 混合模式源算子   |
| blendDst           | THREE.OneMinusSrcAlphaFactor | Enum                                                                                                                        | 混合模式目标算子 |
| blendEquation      | THREE.AddEquation            | Enum                                                                                                                        | 混合模式方程式   |

### 基础网格材质(MeshBasicMaterial)

一个以简单着色（平面或线框）方式来绘制几何体的材质。
<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial"></iframe>

### 深度网格材质(MeshDepthMaterial)

一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远。

<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshDepthMaterial"></iframe>

### Lambert网格材质(MeshLambertMaterial)

一种非光泽表面的材质，没有镜面高光。

<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshLambertMaterial"></iframe>

### 法线网格材质(MeshNormalMaterial)

一种把法向量映射到RGB颜色的材质。
<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshNormalMaterial"></iframe>

### Phong网格材质(MeshPhongMaterial)

一种用于具有镜面高光的光泽表面的材质。

<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshPhongMaterial"></iframe>

### 标准网格材质(MeshStandardMaterial)

一种基于物理的标准材质

<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshStandardMaterial"></iframe>

### 物理网格材质(MeshPhysicalMaterial)

MeshStandardMaterial的扩展，提供了更高级的基于物理的渲染属性：

<iframe width="100%" height="420px" src="https://threejs.org/docs/scenes/material-browser.html#MeshPhysicalMaterial"></iframe>


# 参考
参考：<https://threejs.org/>
