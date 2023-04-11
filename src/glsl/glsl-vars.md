---
title: GLSL的变量
category:
  - GLSL
date: 2022-10-02
---


## 基本数据类型变量

1. `float`
   - 数据类型：单精度浮点数，占用 32 位（4 字节）内存。
   - 取值范围：约为 -3.4 × 10^38 到 3.4 × 10^38，可以表示的有效数字位数为 6~7 位左右。
   - 示例：

     ```glsl
     float radius = 1.0; // 声明一个单精度浮点型变量 radius
     float pi = 3.14159; // 声明一个单精度浮点型变量 pi
     float volume = 4.0 / 3.0 * pi * pow(radius, 3.0); // 计算球体的体积
     ```

2. `int`
   - 数据类型：整型变量，占用 32 位（4 字节）内存。
   - 取值范围：约为 -2.1 × 10^9 到 2.1 × 10^9。
   - 示例：

     ```glsl
     int width = 800; // 声明一个整型变量 width，表示画布的宽度
     int height = 600; // 声明一个整型变量 height，表示画布的高度
     int area = width * height; // 计算画布的面积
     ```

3. `bool`
   - 数据类型：布尔型变量，只有 true 和 false 两个值，占用 8 位（1 字节）内存。
   - 示例：

     ```glsl
     bool isBlack = true; // 声明一个布尔型变量 isBlack，表示颜色是否为黑色
     bool isWhite = false; // 声明一个布尔型变量 isWhite，表示颜色是否为白色
     ```

4. `double`
   - 数据类型：双精度浮点数，占用 64 位（8 字节）内存。
   - 取值范围：约为 -1.7 × 10^308 到 1.7 × 10^308，可以表示的有效数字位数为 15~16 位左右。
   - 示例：

     ```glsl
     double radius = 1.0; // 声明一个双精度浮点型变量 radius
     double pi = 3.14159265358979; // 声明一个双精度浮点型变量 pi
     double volume = 4.0 / 3.0 * pi * pow(radius, 3.0); // 计算球体的体积
     ```

5. `uint`
   - 数据类型：无符号整型变量，占用 32 位（4 字节）内存。
   - 取值范围：约为 0 到 4.2 × 10^9。
   - 示例：

     ```glsl
     uint num1 = 123; // 声明一个无符号整型变量 num1
     uint num2 = 456; // 声明一个无符号整型变量 num2
     uint sum = num1 + num2; // 计算 num1 和 num2 的和
     ```

<!-- | 类型  | 含义                              |
| ----- | --------------------------------- |
| vecn  | 包含 n 个 float 分量的默认向量    |
| bvecn | 包含 n 个 bool 分量的向量         |
| ivecn | 包含 n 个 int 分量的向量          |
| uvecn | 包含 n 个 unsigned int 分量的向量 |
| dvecn | 包含 n 个 double 分量的向量       | -->

<!-- | 变量类别   | 变量类型                  | 描述                               |
| ---------- | ------------------------- | ---------------------------------- |
| 空         | void                      | 用于无返回值的函数或空的参数列表   |
| 标量       | float, int, bool          | 浮点型，整型，布尔型的标量数据类型 |
| 浮点型向量 | float, vec2, vec3, vec4   | 包含 1，2，3，4 个元素的浮点型向量 |
| 整数型向量 | int, ivec2, ivec3, ivec4  | 包含 1，2，3，4 个元素的整型向量   |
| 布尔型向量 | bool, bvec2, bvec3, bvec4 | 包含 1，2，3，4 个元素的布尔型向量 |
| 矩阵       | mat2, mat3, mat4          | 尺寸为 2x2，3x3，4x4 的浮点型矩阵  |
| 纹理句柄   | sampler2D, samplerCube    | 表示 2D，立方体纹理的句柄          | -->

## 向量类型变量

1. `vec2`
   - 定义格式：`vec2(x, y)` 或 `vec2(v)`
   - 功能：表示二维向量，其中的 `x` 和 `y` 分别表示向量在 x 轴和 y 轴方向的分量。
   - 参数说明：
     - `x`, `y`：表示向量在 x 轴和 y 轴方向的分量，可以是标量、浮点数或整数；
     - `v`：表示长度为 2 的浮点型向量。
   - 示例：

     ```glsl
     /* 定义一个二维坐标点。 */
     vec2 point = vec2(1.0, 2.0);
     ```

2. `vec3`
   - 定义格式：`vec3(x, y, z)` 或 `vec3(v, z)`
   - 功能：表示三维向量，其中的 `x`、`y` 和 `z` 分别表示向量在 x 轴、y 轴和 z 轴方向的分量。
   - 参数说明：
     - `x`, `y`, `z`：表示向量在 x 轴、y 轴和 z 轴方向的分量，可以是标量、浮点数或整数；
     - `v`：表示长度为 2 或 3 的浮点型向量；
     - `z`：表示向量在 z 轴方向的分量，可以是标量、浮点数或整数。
   - 示例：

     ```glsl
     /* 定义一个颜色。 */
     vec3 color = vec3(1.0, 0.0, 0.0);
     ```

3. `vec4`
   - 定义格式：`vec4(x, y, z, w)` 或 `vec4(v, z, w)` 或 `vec4(v, w)`
   - 功能：表示四维向量，其中的 `x`、`y`、`z` 和 `w` 分别表示向量在 x 轴、y 轴、z 轴和 w 轴方向的分量。
   - 参数说明：
     - `x`, `y`, `z`, `w`：表示向量在 x 轴、y 轴、z 轴和 w 轴方向的分量，可以是标量、浮点数或整数；
     - `v`：表示长度为 2、3 或 4 的浮点型向量；
     - `z`, `w`：表示向量在 z 轴和 w 轴方向的分量，可以是标量、浮点数或整数。
   - 示例：

     ```glsl
     /* 定义一个四维坐标点。 */
     vec4 point = vec4(1.0, 2.0, 3.0, 1.0);
     ```

4. `bvec2、bvec3、bvec4`
   - 定义格式：`bvec2(x, y)`、`bvec3(x, y, z)` 或 `bvec4(x, y, z, w)`
   - 功能：表示布尔类型的向量，其中的 `x`、`y`、`z` 和 `w` 分别表示向量在不同维度上的布尔值。
   - 参数说明：
     - `x`, `y`, `z`, `w`：表示向量在不同维度上的布尔值。
   - 示例：

     ```
     /* 定义一个布尔向量。 */
     bvec3 testVec = bvec3(true, false, true);
     ```

5. `ivec2、ivec3、ivec4`
   - 定义格式：`ivec2(x, y)`、`ivec3(x, y, z)` 或 `ivec4(x, y, z, w)`
   - 功能：表示整型向量，其中的 `x`、`y`、`z` 和 `w` 分别表示向量在 x 轴、y 轴、z 轴和 w 轴方向的分量。
   - 参数说明：
     - `x`, `y`, `z`, `w`：表示向量在不同维度上的整数分量。
   - 示例：

     ```
     /* 定义一个整型向量。 */
     ivec3 pos = ivec3(1, 2, 3);
     ```

6. `uvec2、uvec3、uvec4`
   - 定义格式：`uvec2(x, y)`、`uvec3(x, y, z)` 或 `uvec4(x, y, z, w)`
   - 功能：表示无符号整型向量，其中的 `x`、`y`、`z` 和 `w` 分别表示向量在 x 轴、y 轴、z 轴和 w 轴方向的分量。
   - 参数说明：
     - `x`, `y`, `z`, `w`：表示向量在不同维度上的无符号整数分量。
   - 示例：

     ```
     /* 定义一个无符号整型向量。 */
     uvec4 indices = uvec4(0, 1, 2, 3);
     ```

7. `dvec2、dvec3、dvec4`
   - 定义格式：`dvec2(x, y)`、`dvec3(x, y, z)` 或 `dvec4(x, y, z, w)`
   - 功能：表示双精度浮点型向量，其中的 `x`、`y`、`z` 和 `w` 分别表示向量在 x 轴、y 轴、z 轴和 w 轴方向的分量。
   - 参数说明：
     - `x`, `y`, `z`, `w`：表示向量在不同维度上的双精度浮点数分量。
   - 示例：

     ```
     /* 定义一个双精度浮点型向量。 */
     dvec2 pos = dvec2(1.0, 2.0);
     ```

## 数组类型变量

1. GLSL 中的数组变量可以用来存储一组相同类型的变量。数组的长度需要在定义时指定，且长度必须是一个常量表达式，也就是在编译时就可以确定的值。
例如，定义一个长度为 5 的 float 数组：

```
float array[5];
```

2. 可以使用下标运算符（`[]`）来访问数组中的元素，从 0 开始索引。例如，访问数组 `array` 中的第三个元素：

```
float value = array[2];
```

3. GLSL 中的数组也支持循环遍历，可以使用 for 循环来遍历数组中的每一个元素。例如，遍历数组 `array` 中的所有元素并将它们相加：

```
float sum = 0.0;
for (int i = 0; i < 5; i++) {
    sum += array[i];
}
```

4. 在 GLSL 中，还可以使用数组作为函数的参数，从而方便地将一组数据传递给函数进行处理。例如，定义一个函数 `average`，求平均值并返回：

```
float average(float values[], int length) {
    float sum = 0.0;
    for (int i = 0; i < length; i++) {
        sum += values[i];
    }
    return sum / float(length);
}
```

5. 如果数组变量在着色器中不需要修改，可以将其声明为 `const` 类型。这样做可以提高代码的可读性和可维护性，因为这样声明后，代码中只有对数组的读取访问，而不会有对数组的写入行为。例如，定义一个常量数组 `colors`：

```
const vec4 colors[3] = vec4[](vec4(1.0, 0.0, 0.0, 1.0),
                               vec4(0.0, 1.0, 0.0, 1.0),
                               vec4(0.0, 0.0, 1.0, 1.0));
```

## 矩阵类型变量

1. `mat2`
   - 定义格式：`mat2(m00, m01, m10, m11)`
   - 功能：定义一个 2x2 的矩阵，用给定的数值填充矩阵。
   - 参数说明：
     - `m00`：矩阵中第一行第一列的值。
     - `m01`：矩阵中第一行第二列的值。
     - `m10`：矩阵中第二行第一列的值。
     - `m11`：矩阵中第二行第二列的值。
   - 示例：

     ```glsl
     /* 使用 mat2 定义一个 2x2 的旋转矩阵。 */
     float angle = 90.0;
     mat2 rotationMatrix = mat2(cos(angle), -sin(angle),
                                sin(angle), cos(angle));
     ```

2. `mat3`
   - 定义格式：`mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22)`
   - 功能：定义一个 3x3 的矩阵，用给定的数值填充矩阵。
   - 参数说明：
     - `m00`：矩阵中第一行第一列的值。
     - `m01`：矩阵中第一行第二列的值。
     - `m02`：矩阵中第一行第三列的值。
     - `m10`：矩阵中第二行第一列的值。
     - `m11`：矩阵中第二行第二列的值。
     - `m12`：矩阵中第二行第三列的值。
     - `m20`：矩阵中第三行第一列的值。
     - `m21`：矩阵中第三行第二列的值。
     - `m22`：矩阵中第三行第三列的值。
   - 示例：

     ```glsl
     /* 使用 mat3 定义一个 3x3 的缩放矩阵。 */
     float scaleX = 2.0;
     float scaleY = 3.0;
     mat3 scaleMatrix = mat3(scaleX,  0.0,     0.0, 
                             0.0,     scaleY,  0.0, 
                             0.0,     0.0,     1.0);
     ```

3. `mat4`
   - 定义格式：`mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)`
   - 功能：定义一个 4x4 的矩阵，用给定的数值填充矩阵。
   - 参数说明：
     - `m00`：矩阵中第一行第一列的值。
     - `m01`：矩阵中第一行第二列的值。
     - `m02`：矩阵中第一行第三列的值。
     - `m03`：矩阵中第一行第四列的值。
     - `m10`：矩阵中第二行第一列的值。
     - `m11`：矩阵中第二行第二列的值。
     - `m12`：矩阵中第二行第三列的值。
     - `m13`：矩阵中第二行第四列的值。
     - `m20`：矩阵中第三行第一列的值。
     - `m21`：矩阵中第三行第二列的值。
     - `m22`：矩阵中第三行第三列的值。
     - `m23`：矩阵中第三行第四列的值。
     - `m30`：矩阵中第四行第一列的值。
     - `m31`：矩阵中第四行第二列的值。
     - `m32`：矩阵中第四行第三列的值。
     - `m33`：矩阵中第四行第四列的值。
   - 示例：

     ```glsl
     /* 使用 mat4 定义一个 4x4 的透视投影矩阵。 */
     float fovy = radians(45.0);
     float aspect = 1.0;
     float near = 0.1;
     float far = 100.0;
     mat4 perspectiveMatrix = mat4(1.0 / (aspect * tan(fovy/2)), 0.0, 0.0,                           0.0,
                                   0.0,                        1.0 / tan(fovy/2), 0.0,          0.0,
                                   0.0,                        0.0, (-near - far) / (near - far), -1.0,
                                   0.0,                        0.0, (2.0 * near * far) / (near - far), 0.0);
     ```

4. `mat2x3`、`mat2x4`、`mat3x2`、`mat3x4`、`mat4x2`、`mat4x3`
   - 定义格式：类似 `mat2`、`mat3`、`mat4`，只是中间的 `x` 后面跟着的数字代表矩阵的列数。
   - 功能：定义不同维度的矩阵类型。
   - 示例：

     ```glsl
     /* 使用 mat3x2 定义一个 3x2 的矩阵。 */
     mat3x2 matrix = mat3x2(1.0, 0.0,
                            0.0, 1.0,
                            0.0, 0.0);
     ```

## 结构体类型变量

1. `struct`

- 使用格式：`struct <结构体名> { <成员列表> };`
- 功能：定义一个结构体类型。
- 参数说明：
  - `<结构体名>`：结构体类型的名称。
  - `<成员列表>`：结构体类型中成员的定义。
- 示例：

    ```glsl
    /* 定义一个点的结构体类型。 */
    struct Point {
      vec3 position;
      vec3 color;
    };
    ```

当我们需要管理一组相关的变量时，就可以使用结构体类型。在 GLSL 中，结构体定义方式与 C 语言类似，如下所示：

```
struct MyStruct {
   float x;
   float y;
   float z;
};
```

这个结构体定义了三个浮点数成员变量：x、y、z。我们可以用点运算符来访问结构体的成员变量：

```
MyStruct myStruct;
myStruct.x = 1.0;
myStruct.y = 2.0;
myStruct.z = 3.0;
```

在 GLSL 中，我们也可以在一个结构体中嵌套另一个结构体，例如：

```
struct Material {
   vec3 ambient;
   vec3 diffuse;
   vec3 specular;
   float shininess;
};

struct MyObject {
   vec3 position;
   vec3 rotation;
   vec3 scale;
   Material material;
};
```

这个例子中，MyObject 包含了一个 vec3 类型的 position、rotation 和 scale，以及一个 Material 类型的 material。有了这个结构体，我们就可以更方便地管理物体的位置、旋转、缩放和材质属性。

## 纹理类型变量

1. `sampler1D`
   - 表示一维纹理采样器。
   - 示例：

     ```glsl
     uniform sampler1D myTexture; // 声明一个一维纹理采样器
     float texCoord = 0.5;
     vec4 texColor = texture(myTexture, texCoord); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

2. `sampler2D`
   - 表示二维纹理采样器。
   - 示例：

     ```glsl
     uniform sampler2D myTexture; // 声明一个二维纹理采样器
     vec2 texCoord = vec2(0.5, 0.5);
     vec4 texColor = texture(myTexture, texCoord); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

3. `sampler3D`
   - 表示三维纹理采样器。
   - 示例：

     ```glsl
     uniform sampler3D myTexture; // 声明一个三维纹理采样器
     vec3 texCoord = vec3(0.5, 0.5, 0.5);
     vec4 texColor = texture(myTexture, texCoord); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

4. `samplerCube`
   - 表示立方体纹理采样器。
   - 示例：

     ```glsl
     uniform samplerCube myTexture; // 声明一个立方体纹理采样器
     vec3 texCoord = vec3(0.5, 0.5, 0.5);
     vec4 texColor = texture(myTexture, texCoord); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

5. `sampler1DShadow`
   - 表示一维纹理阴影采样器。
   - 示例：

     ```glsl
     uniform sampler1DShadow myShadow; // 声明一个一维纹理阴影采样器
     float texCoord = 0.5;
     float bias = 0.01;
     float shadowValue = texture(myShadow, vec3(texCoord, bias)); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

6. `sampler2DShadow`
   - 表示二维纹理阴影采样器。
   - 示例：

     ```glsl
     uniform sampler2DShadow myShadow; // 声明一个二维纹理阴影采样器
     vec2 texCoord = vec2(0.5, 0.5);
     float bias = 0.01;
     float shadowValue = texture(myShadow, vec3(texCoord, bias)); // 在指定纹理采样器和纹理坐标下采样纹理
     ```

## 修饰符类型变量

1. `in`
   - 使用格式：`in <type> <name>`
   - 功能：将外部数据输入到着色器中，用于顶点着色器和片元着色器中声明输入变量。输入变量的值由于渲染管线输出阶段提供。
   - 参数说明：
     - `<type>`：输入变量的类型。
     - `<name>`：输入变量的名称。
   - 示例：

     ```glsl
     /* 顶点着色器中声明一个输入变量，表示顶点位置。 */
     in vec3 vertexPosition;
     ```

2. `out`
   - 使用格式：`out <type> <name>`
   - 功能：将着色器输出发送到渲染管线的下一阶段，用于顶点着色器和片元着色器中声明输出变量。输出变量的值由着色器计算。
   - 参数说明：
    - `<type>`：输出变量的类型。
    - `<name>`：输出变量的名称。
   - 示例：

     ```glsl
     /* 顶点着色器中声明一个输出变量，表示变换后的顶点位置。 */
     out vec4 transformedPosition;
     ```

3. `uniform`
   - 使用格式：`uniform <type> <name>`
   - 功能：在顶点着色器和片元着色器中声明全局变量，并将其作为传递参数的一部分传递到着色器中。这些变量值在渲染管线的各个阶段之间保持不变。
   - 参数说明：
    - `<type>`：变量的类型。
    - `<name>`：变量的名称。
   - 示例：

     ```glsl
     /* 片元着色器中使用 uniform 声明一个颜色变量，表示物体的颜色。 */
     uniform vec4 objectColor;
     ```

4. `const`
   - 使用格式：`const <type> <name> = <value>`
   - 功能：声明在编译时就已经确定的常量。常量的值不能在程序运行期间更改。
   - 参数说明：
     - `<type>`：常量的类型。
     - `<name>`：常量的名称。
     - `<value>`：常量的值。
   - 示例：

     ```glsl
     /* 声明一个常量表示 pi 的值。 */
     const float PI = 3.1415926;
     ```

5. `attribute`
   - 使用格式：`attribute <type> <name>`
   - 功能：在顶点着色器中声明输入变量，表示每个顶点的属性。渲染管线输出阶段提供这些变量的值，并将它们传递到片元着色器中的 `varying` 变量中。
   - 参数说明：
     - `<type>`：顶点属性的类型。
     - `<name>`：顶点属性的名称。
   - 示例：

     ```glsl
     /* 顶点着色器中声明一个 attribute 变量，表示顶点法向量。 */
     attribute vec3 vertexNormal;
     ```

6. `varying`
   - 使用格式：`varying <type> <name>`
   - 功能：在顶点着色器和片元着色器之间声明变量，表示顶点属性在顶点到像素的过程中插值的结果。顶点着色器计算 `varying` 变量的值，然后通过渲染管线输出阶段传递给片元着色器。
   - 参数说明：
     - `<type>`：变量的类型。
     - `<name>`：变量的名称。
   - 示例：

     ```glsl
     /* 顶点着色器中声明一个 varying 变量，表示变换后的顶点法向量。 */
     varying vec3 transformedNormal;
     ```

### uniforms

尽管每个线程和其他线程之间不能有数据交换，但我们能从 CPU 给每个线程输入数据。因为显卡的架构，所有线程的输入值必须统一（uniform），而且必须设为只读。

```js
let uniforms = {
  u_time: { type: "f", value: 1.0 },
  u_resolution: { type: "v2", value: new THREE.Vector2() },
};

let material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}
let clock = new THREE.Clock();
function render() {
  uniforms.u_time.value += clock.getDelta();
  renderer.render(scene, camera);
}
```

## 特殊类型变量

1. `void`
   - 使用格式：`void`
   - 功能：表示无类型、无返回值的函数。通常用于定义一个不返回值的函数。
   - 参数说明：无参数。
   - 示例：

     ```glsl
     /* 定义一个不返回值的函数。 */
     void printMessage() {
         printf("Hello, world!\n");
     }
     ```

2. `function`
   - 使用格式：`return_type function_name(arguments) { function_body }`
   - 功能：定义一个可以重复使用的函数，根据传入参数不同进行不同的操作。
   - 参数说明：
     - `return_type`：函数返回值的类型。
     - `function_name`：函数名。
     - `arguments`：函数参数，用逗号分隔多个参数，每个参数包括类型和名称。
     - `function_body`：函数体，包括函数执行的代码。
   - 示例：

     ```glsl
     /* 定义一个加法函数。 */
     float add(float x, float y) {
         return x + y;
     }
     ```

3. `layout`
   - 使用格式：`layout (qualifier) type name`
   - 功能：控制变量如何被存储和传递。
   - 参数说明：
     - `qualifier`：布局限定符，例如 `location`、`binding` 等。
     - `type`：变量类型，例如 `float`、`vec2`、`vec3` 等。
     - `name`：变量名，用户自定义的标识符。
   - 示例：

     ```glsl
     /* 使用 layout 限定符标记顶点位置和颜色的位置。 */
     layout (location = 0) in vec3 position;
     layout (location = 1) in vec4 color;
     void main() {
         gl_Position = vec4(position, 1.0);
     }
     ```

4. `gl_`
   - 使用格式：内置变量有多种，例如 `gl_Position`、`gl_FragColor`、`gl_PointSize` 等。
   - 功能：内置变量由 GLSL 定义和提供，可以用于访问 OpenGL ES 渲染管线中的状态和数据。
   - 参数说明：内置变量具体用法和含义根据不同的内置变量而异。
   - 示例：

     ```glsl
     /* 使用 gl_Position 变量设置顶点位置。 */
     void main() {
         gl_Position = vec4(position, 1.0);
     }
     
     /* 使用 gl_FragColor 变量设置片元颜色。 */
     void main() {
         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
     }
     ```

## 顶点着色器变量

1. `gl_FogCoord`
   - 类型：`float`
   - 功能：雾的深度值，在雾效果中使用。
   - 示例：

     ```glsl
     /* 在片元着色器中使用 gl_FogCoord 计算雾效果。
        注意：需启用雾效果，具体方式为调用 glEnable(GL_FOG)。 */
     varying vec4 v_Position;
     uniform vec4 u_FogColor;
     uniform float u_FogNear;
     uniform float u_FogFar;
     void main() {
         // 计算顶点到相机的距离。
         float depth = length(v_Position.xyz);
         // 计算雾的深度值。
         gl_FogCoord = (depth - u_FogNear) / (u_FogFar - u_FogNear);
         // 输出颜色值。
         gl_FragColor = u_FogColor;
     }
     ```

2. `gl_ModelViewMatrix`
   - 类型：`mat4`
   - 功能：物体从模型坐标系转换到相机坐标系的矩阵。包括了模型变换和相机变换。
   - 示例：

     ```glsl
     /* 将物体从模型坐标系转换到相机坐标系。 */
     attribute vec3 a_Position;
     uniform mat4 u_ModelViewMatrix;
     uniform mat4 u_ProjectionMatrix;
     void main() {
         gl_Position = u_ProjectionMatrix * u_ModelViewMatrix * vec4(a_Position, 1.0);
     }
     ```

3. `gl_ProjectionMatrix`
   - 类型：`mat4`
   - 功能：将相机坐标系中的点投影到裁剪空间的矩阵。
   - 示例：

     ```glsl
     /* 将相机坐标系中的点投影到裁剪空间中。 */
     attribute vec3 a_Position;
     uniform mat4 u_ModelViewMatrix;
     uniform mat4 u_ProjectionMatrix;
     void main() {
         gl_Position = u_ProjectionMatrix * u_ModelViewMatrix * vec4(a_Position, 1.0);
     }
     ```

4. `gl_ModelViewProjectionMatrix`
   - 类型：`mat4`
   - 功能：将物体从模型坐标系转换到裁剪空间的矩阵。包括了模型变换、相机变换和投影变换。
   - 示例：

     ```glsl
     /* 将物体从模型坐标系转换到裁剪空间中。 */
     attribute vec3 a_Position;
     uniform mat4 u_ModelViewProjectionMatrix;
     void main() {
         gl_Position = u_ModelViewProjectionMatrix * vec4(a_Position, 1.0);
     }
     ```

5. `gl_TextureMatrix`
   - 类型：`mat4`
   - 功能：纹理坐标变换矩阵。与纹理坐标配合使用，用于实现纹理的旋转、平移和缩放等变换效果。
   - 示例：

     ```glsl
     /* 在顶点着色器中使用纹理坐标变换矩阵实现纹理旋转效果。 */
     attribute vec2 a_TexCoord;
     uniform mat4 u_TextureMatrix;
     varying vec2 v_TexCoord;
     void main() {
         v_TexCoord = (u_TextureMatrix * vec4(a_TexCoord, 0.0, 1.0)).xy;
         gl_Position = vec4(a_Position, 1.0);
     }
     ```

6. `gl_NormalMatrix`
   - 类型：`mat4`
   - 功能：法向量变换矩阵，在光照计算中使用。用于将物体表面的法向量从模型坐标系变换到相机坐标系，并保持其在坐标系中的垂直性。
   - 示例：

     ```glsl
     /* 在顶点着色器中使用法向量变换矩阵将法向量从模型坐标系变换到相机坐标系中。 */
     attribute vec3 a_Normal;
     uniform mat4 u_NormalMatrix;
     void main() {
         gl_Normal = mat3(u_NormalMatrix) * a_Normal;
         gl_Position = vec4(a_Position, 1.0);
     }
     ```

7. `gl_ModelViewMatrixInverse`
   - 类型：`mat4`。
   - 描述：模型视图矩阵的逆矩阵。用于将顶点从视图空间转换回模型空间。
   - 示例：

     ```glsl
     /* 使用 gl_ModelViewMatrixInverse 将顶点从视图空间转换回模型空间。 */
     vec4 vertexInViewSpace = gl_ModelViewMatrix * gl_Vertex;
     vec4 vertexInModelSpace = gl_ModelViewMatrixInverse * vertexInViewSpace;
     ```

8. `gl_ProjectionMatrixInverse`
   - 类型：`mat4`。
   - 描述：投影矩阵的逆矩阵。用于将顶点从裁剪空间转换回标准化设备空间。
   - 示例：

     ```glsl
     /* 使用 gl_ProjectionMatrixInverse 将顶点从裁剪空间转换回标准化设备空间。 */
     vec4 vertexInClipSpace = gl_ModelViewProjectionMatrix * gl_Vertex;
     vec4 vertexInNormalizedDeviceSpace = gl_ProjectionMatrixInverse * vertexInClipSpace;
     ```

9. `gl_ModelViewProjectionMatrixInverse`
   - 类型：`mat4`。
   - 描述：模型视图投影矩阵的逆矩阵。用于将顶点从裁剪空间转换回模型空间。
   - 示例：

     ```glsl
     /* 使用 gl_ModelViewProjectionMatrixInverse 将顶点从裁剪空间转换回模型空间。 */
     vec4 vertexInClipSpace = gl_ModelViewProjectionMatrix * gl_Vertex;
     vec4 vertexInModelSpace = gl_ModelViewProjectionMatrixInverse * vertexInClipSpace;
     ```

10. `gl_TextureMatrixInverse`

- 类型：`mat4`。
- 描述：纹理矩阵的逆矩阵。常用于对纹理坐标进行变换。
- 示例：

     ```glsl
     /* 使用 gl_TextureMatrixInverse 对纹理坐标进行变换。 */
     vec4 texCoord = gl_TextureMatrix * vec4(gl_MultiTexCoord0.xy, 0.0, 1.0);
     vec4 transformedTexCoord = gl_TextureMatrixInverse * texCoord;
     ```

11. `gl_ModelViewMatrixTranspose`

- 功能：表示模型视图变换矩阵的转置矩阵。该矩阵可以将当前顶点从模型坐标系变换到视图坐标系。
- 示例：

     ```glsl
     /* 假设需要对顶点进行模型视图变换，将模型坐标系下的顶点坐标变换到视图坐标系下，并将变换后的顶点坐标传递给片元着色器。*/
     attribute vec3 aPosition; 
     uniform mat4 uModelViewMatrix;
     uniform mat4 uProjectionMatrix;
     void main() {
         gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
     }
     ```

12. `gl_ProjectionMatrixTranspose`

- 功能：表示投影变换矩阵的转置矩阵。该矩阵可以将当前顶点从视图坐标系变换到裁剪坐标系。
- 示例：

     ```glsl
     /* 假设需要将顶点从视图坐标系变换到裁剪坐标系，并将变换后的坐标传递给片元着色器。*/
     attribute vec4 aPosition; 
     uniform mat4 uProjectionMatrix;
     void main() {
         gl_Position = uProjectionMatrix * aPosition;
     }
     ```

13. `gl_ModelViewProjectionMatrixTranspose`

- 功能：表示模型视图投影变换矩阵的转置矩阵。该矩阵可以将当前顶点从模型坐标系变换到裁剪坐标系。
- 示例：

     ```glsl
     /* 假设需要对顶点进行模型视图投影变换，将模型坐标系下的顶点坐标变换到裁剪坐标系下，并将变换后的顶点坐标传递给片元着色器。*/
     attribute vec3 aPosition;
     uniform mat4 uModelViewProjectionMatrix;
     void main() {
         gl_Position = uModelViewProjectionMatrix * vec4(aPosition, 1.0);
     }
     ```

14. `gl_TextureMatrixTranspose`

- 功能：表示纹理变换矩阵的转置矩阵。该矩阵可以将当前顶点从纹理坐标系变换到纹理单元坐标系。
- 示例：

     ```glsl
     /* 假设需要对纹理坐标进行变换，将纹理坐标系下的顶点坐标变换到纹理单元坐标系下，并将变换后的顶点坐标传递给片元着色器。*/
     attribute vec2 aTexCoord;
     uniform mat4 uTextureMatrix;
     void main() {
         gl_TexCoord[0] = uTextureMatrix * vec4(aTexCoord, 0.0, 1.0);
     }
     ```

15. `gl_ModelViewMatrixInverseTranspose`

- 功能：表示模型视图变换的逆转置矩阵，用于对法线进行变换。该矩阵可以将当前法线从模型坐标系变换到视图坐标系。
- 示例：

     ```glsl
     /* 假设需要对法线进行变换，将模型坐标系下的法线变换到视图坐标系下，并将变换后的法线传递给片元着色器。*/
     attribute vec3 aNormal;
     uniform mat4 uModelViewMatrix;
     uniform mat4 uNormalMatrix;
     void main() {
         vec3 transformedNormal = normalize(mat3(uModelViewMatrix) * uNormalMatrix * aNormal);
         // 使用变换后的法线进行接下来的计算
     }
     ```

16. `gl_ProjectionMatrixInverseTranspose`

- 功能：表示投影变换的逆转置矩阵，用于对法线进行变换。该矩阵可以将当前法线从视图坐标系变换到裁剪坐标系。
- 示例：

     ```glsl
     /* 假设需要对法线进行变换，将视图坐标系下的法线变换到裁剪坐标系下，并将变换后的法线传递给片元着色器。*/
     attribute vec3 aNormal;
     uniform mat4 uProjectionMatrix;
     uniform mat4 uNormalMatrix;
     void main() {
         vec3 transformedNormal = normalize(mat3(uProjectionMatrix) * uNormalMatrix * aNormal);
         // 使用变换后的法线进行接下来的计算
     }
     ```

17. `gl_ModelViewProjectionMatrixInverseTranspose`

- 类型：4x4 矩阵
- 功能：计算模型视图投影矩阵的逆转置矩阵，并将其传递给片元着色器，用于法线向量变换。
- 示例：

     ```glsl
     /* 将法线向量变换为视图坐标系下的向量。 */
     varying vec3 vertexNormal;
     uniform mat4 modelViewProjectionMatrix;
     uniform mat4 gl_ModelViewProjectionMatrixInverseTranspose;
     void main() {
         vec3 norm = normalize(gl_ModelViewProjectionMatrixInverseTranspose * vec4(vertexNormal, 0.0)).xyz;
         /* ... */
     }
     ```

18. `gl_TextureMatrixInverseTranspose`

- 类型：4x4 矩阵
- 功能：计算纹理矩阵的逆转置矩阵，并将其传递给片元着色器，用于法线向量变换。
- 示例：

   ```glsl
   /* 将法线向量变换为纹理坐标系下的向量。 */
   varying vec3 vertexNormal;
   varying vec2 vertexTexCoord;
   uniform mat4 textureMatrix;
   uniform mat4 gl_TextureMatrixInverseTranspose;
   void main() {
       vec3 norm = normalize(gl_TextureMatrixInverseTranspose * textureMatrix * vec4(vertexNormal, 0.0)).xyz;
       /* ... */
   }
   ```

19. `gl_DepthRangeNear`

- 类型：浮点数
- 功能：场景深度的近平面。
- 示例：

   ```glsl
   /* 计算深度值。 */
   varying vec4 vertexPosition;
   uniform float gl_DepthRangeNear;
   uniform float gl_DepthRangeFar;
   void main() {
       gl_Position = gl_ModelViewProjectionMatrix * vertexPosition;
       gl_Position.z = (gl_Position.z / gl_Position.w) * 0.5 + 0.5;
       gl_Position.z = mix(gl_DepthRangeNear, gl_DepthRangeFar, gl_Position.z);
   }
   ```

20. `gl_DepthRangeFar`

- 类型：浮点数
- 功能：场景深度的远平面。
- 示例：与 `gl_DepthRangeNear` 用法相同。

21. `gl_TexCoord[]`

- 类型：四维向量数组
- 功能：传递纹理坐标给片元着色器。
- 示例：

   ```glsl
   /* 在片元着色器中使用纹理坐标进行纹理采样。 */
   varying vec4 gl_TexCoord[4];
   uniform sampler2D texture;
   void main() {
       vec4 color = texture2D(texture, gl_TexCoord[0].xy);
       /* ... */
   }
   ```

22. `gl_FogFragCoord`

- 类型：浮点数
- 功能：计算像素与雾起点之间的距离，并将这个距离传递给片元着色器，用于计算雾的程度。
- 示例：

   ```glsl
   /* 计算与雾起点之间的距离并进行颜色混合。 */
   varying float gl_FogFragCoord;
   uniform vec4 fogColor;
   void main() {
       /* ... */
       float fogFactor = clamp((gl_FogFragCoord - fogStart) / (fogEnd - fogStart), 0.0, 1.0);
       gl_FragColor = mix(fogColor, gl_FragColor, fogFactor);
   }
   ```

23. `gl_Position`

- 类型：四维向量
- 功能：计算顶点位置的裁剪坐标，并将其传递给下一阶段的渲染管线。
- 示例：

   ```glsl
   /* 计算顶点位置的裁剪坐标。 */
   attribute vec4 position;
   uniform mat4 modelViewProjectionMatrix;
   void main() {
       gl_Position = modelViewProjectionMatrix * position;
   }
   ```

24. `gl_PointSize`

- 类型：浮点数
- 功能：设置渲染点的大小。
- 示例：

   ```glsl
   /* 设置点的大小并进行颜色混合。 */
   varying float dotSize;
   void main() {
       /* ... */
       gl_PointSize = dotSize;
   }
   ```

## 片段着色器

1. `gl_FragCoord`
   - 类型：`vec4`
   - 功能：表示当前像素的屏幕坐标，其中 `x` 和 `y` 表示像素在屏幕上的坐标值，`z` 表示深度值，`w` 固定为 1.0。
   - 示例：

     ```glsl
     /* 将当前像素的屏幕坐标传入 uniform 变量中。 */
     uniform vec4 u_screenCoord;
     void main() {
       u_screenCoord = gl_FragCoord;
       ...
     }
     ```

2. `gl_FrontFacing`
   - 类型：`bool`
   - 功能：表示当前三角形的正面朝向。如果为 `true`，表示正面朝向屏幕；如果为 `false`，表示背面朝向屏幕。
   - 示例：

     ```glsl
     /* 根据 gl_FrontFacing 来决定片元颜色。 */
     void main() {
       if (gl_FrontFacing) {
         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 正面为红色
       } else {
         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // 背面为绿色
       }
     }
     ```

3. `gl_PointCoord`
   - 类型：`vec2`
   - 功能：表示当前片元在点精灵中的坐标，取值范围为 `[0, 1]`。仅当当前渲染为点精灵时有效。
   - 示例：

     ```glsl
     /* 使用 gl_PointCoord 来计算片元颜色。 */
     void main() {
       float dist = length(gl_PointCoord - vec2(0.5));
       if (dist < 0.5) {
         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 点中心为红色
       } else {
         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // 点边缘为绿色
       }
     }
     ```

4. `gl_FragColor`
   - 类型：`vec4`
   - 功能：表示当前片元的颜色。最终渲染结果将取决于此变量的值。
   - 示例：

     ```glsl
     /* 将颜色写入 gl_FragColor 中。 */
     void main() {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
     }
     ```

5. `gl_FragDepth`
   - 类型：`float`
   - 功能：表示当前片元在深度缓冲中的深度值。如果修改此变量的值，则可以手动控制深度测试的通过情况。
   - 示例：

     ```glsl
     /* 设置深度值，确保物体不会被遮挡。 */
     void main() {
       gl_FragDepth = 0.5; // 将深度值设置为 0.5
       ...
     }
     ```

6. `gl_FragData`
   - 类型：`vec4[]`
   - 功能：表示当前片元写入的颜色值。如果使用了多个颜色缓冲，则可以使用此变量来指定写入不同的缓冲区。
   - 示例：

     ```glsl
     /* 使用多个颜色缓冲，分别写入不同的颜色值。 */
     layout(location = 0) out vec4 outColor1;
     layout(location = 1) out vec4 outColor2;
     void main() {
       outColor1 = vec4(1.0, 0.0, 0.0, 1.0); // 将红色写入第一个颜色缓冲
       outColor2 = vec4(0.0, 1.0, 0.0, 1.0); // 将绿色写入第二个颜色缓冲
       ...
     }
     ```

7. `gl_SampleMask`
   - 功能：获取多重采样缓冲区中每个样本的掩码值。掩码值确定哪些样本需要参与着色器的执行。默认情况下，所有样本的掩码值均为 `0xFF`，表示所有样本都参与着色器的执行。
   - 类型：`uint`
   - 示例：

     ```glsl
     /* 获取当前片元着色器中第 0 个样本的掩码值。*/
     uint mask = gl_SampleMask[0];
     ```

8. `gl_SampleID`
   - 功能：获取当前片元所在的样本序号。序号从 0 开始，最多可以有 GL_MAX_SAMPLES 个样本。
   - 类型：`int`
   - 示例：

     ```glsl
     /* 获取当前片元所在的样本序号。*/
     int sampleID = gl_SampleID;
     ```

9. `gl_SamplePosition`
   - 功能：获取当前片元所在样本的位置坐标。位置坐标是归一化设备坐标系下的坐标。
   - 类型：`vec2`
   - 示例：

     ```glsl
     /* 获取当前片元所在样本的位置坐标。*/
     vec2 position = gl_SamplePosition;
     ```

10. `gl_PrimitiveID`

- 功能：获取当前片元所在的图元 ID。
- 类型：`int`
- 示例：

     ```glsl
     /* 获取当前片元所在的图元 ID。*/
     int primitiveID = gl_PrimitiveID;
     ```

11. `gl_ViewportIndex`

- 功能：获取当前片元所在的视口的索引值。
- 类型：`int`
- 示例：

     ```glsl
     /* 获取当前片元所在的视口的索引值。*/
     int viewportIndex = gl_ViewportIndex;
     ```

12. `gl_Layer`

- 功能：获取当前片元所在的图元的渲染层次。
- 类型：`int`
- 示例：

     ```glsl
     /* 获取当前片元所在的图元的渲染层次。*/
     int layer = gl_Layer;
     ```

13. `gl_ClipDistance[]`

- 功能：获取当前片元到每个裁剪平面的距离值。裁剪平面是由 `gl_ClipDistance` 顶点输出变量设置的。
- 类型：`float`
- 示例：

     ```glsl
     /* 获取当前片元到第 0 个裁剪平面的距离值。*/
     float distance = gl_ClipDistance[0];
     ```

14. `gl_FragStencilRef`

- 功能：获取当前片元的模板测试参考值。参考值是由 `glStencilFuncSeparate` 函数设置的。
- 类型：`int`
- 示例：

     ```glsl
     /* 获取当前片元的模板测试参考值。*/
     int stencilRef = gl_FragStencilRef;
     ```

## 精度限定符

| 限定符  | 描述                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| highp   | 满足顶点着色语言的最低要求。对片段着色语言是可选项                                 |
| mediump | 满足片段着色语言的最低要求，其对于范围和精度的要求必须不低于 lowp 并且不高于 highp |
| lowp    | 范围和精度可低于 mediump，但仍可以表示所有颜色通道的所有颜色值                     |


1. 精度限定符的使用格式：

   ```glsl
   precision qualifier type precisionLevel;
   //例如 
   precision highp float;
   precision mediump float;
   precision lowp float;
   ```

   - `precision`：表示精度限定符的关键字。
   - `qualifier`：限定符的具体类型，包括 `lowp`、`mediump` 和 `highp`。
   - `type`：需要指定精度的数据类型，例如 `float`、`vec2`、`mat3` 等。
   - `precisionLevel`：指定数据类型的精度级别，必须是 `int` 值或常量表达式。

2. 精度限定符的作用：
   - 主要作用是控制变量存储的精度，可以用于性能优化，提高代码效率。
   - 不同的 GPU 和移动设备支持的精度级别不同，使用精度限定符可以确保在不同设备上获得一致的运行结果。

3. 精度限定符的三种类型：
   - `lowp`：代表低精度，通常用于节省 GPU 资源。
   - `mediump`：代表中等精度，通常用于平衡 GPU 资源和图像质量。
   - `highp`：代表高精度，通常用于提高图像质量，但会消耗大量 GPU 资源。

举例说明：

```glsl
precision highp float;
vec2 a [10];
```

上述代码中，`a` 数组的元素将使用 `highp` 精度级别存储，这可能会占用较多的 GPU 资源，但可以获得更高的图像精度。
