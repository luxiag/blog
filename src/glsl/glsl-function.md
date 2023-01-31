---
title: GLSL中的函数
date: 2022-10-03
category:
  - GLSL
---

| 参考：                                                    |
| :-------------------------------------------------------- |
| https://zhuanlan.zhihu.com/p/349296191                    |
| https://colin1994.github.io/2017/11/11/OpenGLES-Lesson04/ |
| https://learnopengl.com/Advanced-OpenGL/Advanced-GLSL     |
| https://learnopengl-cn.readthedocs.io/                    |
| https://registry.khronos.org/OpenGL-Refpages/gl4/         |
| 《OpenGL 编程指南》                                       |

## 自定义函数

自定义函数规则和 C 语言差不多，每个 shader 中必须有一个 main 函数。

```glsl

// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


```

## 内置函数

### 角和三角函数

| 语法                                | 说明                             |
| ----------------------------------- | -------------------------------- |
| genType radians (genType degrees)   | 角度转弧度（degrees to radians） |
| genType degrees (genType radians)   | 弧度转角度（radians to degrees） |
| genType sin (genType angle)         | 三角函数-正弦 sine               |
| genType cos (genType angle)         | 三角函数-余弦 cosine             |
| genType tan (genType angle)         | 三角函数-正切 tangent            |
| genType asin (genType x)            | 反三角函数-反正弦 arc sine       |
| genType atan (genType y, genType x) | 反三角函数-反余弦 arc cosine     |
| genType atan (genType y_over_x)     | 反三角函数-反正切 arc tangent    |

### 指数函数

| 语法                               | 说明                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| genType pow (genType x, genType y) | x 的 y 次方，\(x^y\)。如果 x<0，则结果是 undefined；如果 x=0 并且 y<=0，则结果是 undefined |
| genType exp (genType x)            | x 的自然指数，\(e^x\)                                                                      |
| genType log (genType x)            | x 的自然对数，\(\log_ex\)，即\(\ln{x}\)x<=0 时结果是 undefined                             |
| genType exp2 (genType x)           | 2 的 x 次方，\(2^x\)                                                                       |
| genType log2 (genType x)           | 以 2 为底，x 的自然对数，\(log_2x\)，x<=0 时结果是 undefined                               |
| genType sqrt (genType x)           | 对 x 进行开根号，\(\sqrt{x}\)，x<0 时结果是 undefined                                      |
| genType inversesqrt (genType x)    | sqrt 的倒数，\(\frac{1}{\sqrt x}\)，x<=0 时结果是 undefined                                |

### 通用函数

| 语法                                                      | 说明                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| genType abs (genType x)                                   | x 的绝对值                                                            |
| genType sign (genType x)                                  | 判断 x 是正数、负数，还是零                                           |
| genType floor (genType x)                                 | 返回不大于 x 的最大整数                                               |
| genType ceil (genType x)                                  | 返回不小于 x 的最小整数                                               |
| genType fract (genType x)                                 | 返回 x 的小数部分，即 x-floor(x)                                      |
| genType mod (genType x, genType y)                        | 返回 x – y \* floor (x/y)                                             |
| genType min (genType x, genType y)                        | 返回 x 和 y 的较小值                                                  |
| genType max (genType x, genType y)                        | 返回 x 和 y 的较大值                                                  |
| genType clamp (genType x, genType minVal, genType maxVal) | min (max (x, minVal), maxVal)，如果 minVal > maxVal，则返回 undefined |
| genType mix (genType x, genType y, genType a)             | 返回 x _ (1−a) + y _ a                                                |

### 几何函数

| 语法                                                    | 说明                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| genType length (genType x)                              | 计算向量的长度， \(\sqrt{x1^2+x2^2+...}\)                                                               |
| genType distance (genType p0, genType p1)               | p0 和 p1 之间的距离，即 length(p0-p1)                                                                   |
| genType dot (genType x, genType y)                      | 向量 x 与向量 y 的点积                                                                                  |
| genType cross (vec3 x, vec3 y)                          | 向量 x 与向量 y 的叉积                                                                                  |
| genType normalize (genType x)                           | 返回向量 x 对应的单位向量，即方向相同，长度为 1                                                         |
| genType faceforward(genType N, genType I, genType Nref) | 如果 dot(Nref, I) < 0，则返回 N，否则返回-N                                                             |
| genType reflect (genType I, genType N)                  | I 是入射光的方向，N 是反射平面的法线，返回值是反射光的方向。I – 2 _ dot(N, I) _ N。N 必须是单位向量。   |
| genType refract(genType I, genType N, float eta)        | I 是入射光的方向，N 是反射平面的法线，折射率是 eta，返回值是折射后的光线的向量。I 和 N 必须是单位向量。 |

### 矩阵函数

| 语法                              | 说明                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| mat matrixCompMult (mat x, mat y) | 返回矩阵 x 乘以矩阵 y 的结果。例如 result[i][j] 等于 x[i][j] _ y[i][j]。注意：如果想进行线性代数里的乘法，请使用符号“_”。 |

### 向量关系函数

| 语法                                                                                    | 说明                         |
| --------------------------------------------------------------------------------------- | ---------------------------- |
| bvec lessThan(vec x, vec y) bvec lessThan(ivec x, ivec y)                               | 判断 x<y                     |
| bvec lessThanEqual(vec x, vec y) bvec lessThanEqual(ivec x, ivec y)                     | 判断 x<=y                    |
| bvec greaterThan(vec x, vec y) bvec greaterThan(ivec x, ivec y)                         | 判断 x>y                     |
| bvec greaterThanEqual(vec x, vec y) bvec greaterThanEqual(ivec x, ivec y)               | 判断 x>=y                    |
| bvec equal(vec x, vec y) bvec equal(ivec x, ivec y) bvec equal(bvec x, bvec y)          | 判断 x==y                    |
| bvec notEqual(vec x, vec y) bvec notEqual(ivec x, ivec y) bvec notEqual(bvec x, bvec y) | 判断 x!=y                    |
| bool any(bvec x)                                                                        | 判断 x 的元素是否有 true     |
| bool all(bvec x)                                                                        | 判断 x 的元素是否全部为 true |
| bool not(bvec x)                                                                        | 返回 x 的向量逻辑补码。      |

### Texture 查找函数

纹理查询的最终目的是从 sampler 中提取指定坐标的颜色信息。
