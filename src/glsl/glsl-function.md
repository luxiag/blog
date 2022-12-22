---
title: glsl中的内置函数
category:
  - glsl
---

| 参考：                                                    |
| :-------------------------------------------------------- |
| https://zhuanlan.zhihu.com/p/349296191                    |
| https://colin1994.github.io/2017/11/11/OpenGLES-Lesson04/ |
| https://learnopengl.com/Advanced-OpenGL/Advanced-GLSL     |
| https://learnopengl-cn.readthedocs.io/                    |
| https://registry.khronos.org/OpenGL-Refpages/gl4/         |
| https://thebookofshaders.com/                             |
| 《OpenGL 编程指南》                                       |

|语法 |说明|
|genType radians (genType degrees) |角度转弧度（degrees to radians）|
|genType degrees (genType radians)| 弧度转角度（radians to degrees）|
|genType sin (genType angle) |三角函数-正弦 sine|
|genType cos (genType angle) |三角函数-余弦 cosine|
|genType tan (genType angle) |三角函数-正切 tangent|
|genType asin (genType x) |反三角函数-反正弦 arc sine|
|genType atan (genType y, genType x) |反三角函数-反余弦 arc cosine|
|genType atan (genType y_over_x) 反三角函数-反正切 arc tangent|

语法 说明
genType pow (genType x, genType y) x 的 y 次方，\(x^y\)。如果 x<0，则结果是 undefined；如果 x=0 并且 y<=0，则结果是 undefined
genType exp (genType x) x 的自然指数，\(e^x\)
genType log (genType x) x 的自然对数，\(\log_ex\)，即\(\ln{x}\)x<=0 时结果是 undefined
genType exp2 (genType x) 2 的 x 次方，\(2^x\)
genType log2 (genType x) 以 2 为底，x 的自然对数，\(log_2x\)，x<=0 时结果是 undefined
genType sqrt (genType x) 对 x 进行开根号，\(\sqrt{x}\)，x<0 时结果是 undefined
genType inversesqrt (genType x) sqrt 的倒数，\(\frac{1}{\sqrt x}\)，x<=0 时结果是 undefined

genType abs (genType x) x 的绝对值
genType sign (genType x) 判断 x 是正数、负数，还是零
genType floor (genType x) 返回不大于 x 的最大整数
genType ceil (genType x) 返回不小于 x 的最小整数
genType fract (genType x) 返回 x 的小数部分，即 x-floor(x)
genType mod (genType x, genType y) 返回 x – y _ floor (x/y)
genType min (genType x, genType y) 返回 x 和 y 的较小值
genType max (genType x, genType y) 返回 x 和 y 的较大值
genType clamp (genType x, genType minVal, genType maxVal) min (max (x, minVal), maxVal)，如果 minVal > maxVal，则返回 undefined
genType mix (genType x, genType y, genType a) 返回 x _ (1−a) + y \* a

genType length (genType x) 计算向量的长度， \(\sqrt{x1^2+x2^2+...}\)
genType distance (genType p0, genType p1) p0 和 p1 之间的距离，即 length(p0-p1)
genType dot (genType x, genType y) 向量 x 与向量 y 的点积
genType cross (vec3 x, vec3 y) 向量 x 与向量 y 的叉积
genType normalize (genType x) 返回向量 x 对应的单位向量，即方向相同，长度为 1
genType faceforward(genType N, genType I, genType Nref) 如果 dot(Nref, I) < 0，则返回 N，否则返回-N
genType reflect (genType I, genType N) I 是入射光的方向，N 是反射平面的法线，返回值是反射光的方向。I – 2 _ dot(N, I) _ N。N 必须是单位向量。
genType refract(genType I, genType N, float eta) I 是入射光的方向，N 是反射平面的法线，折射率是 eta，返回值是折射后的光线的向量。I 和 N 必须是单位向量。

mat matrixCompMult (mat x, mat y) 返回矩阵 x 乘以矩阵 y 的结果。例如 result[i][j] 等于 x[i][j] _ y[i][j]。注意：如果想进行线性代数里的乘法，请使用符号“_”。

bvec lessThan(vec x, vec y) bvec lessThan(ivec x, ivec y) 判断 x<y
bvec lessThanEqual(vec x, vec y) bvec lessThanEqual(ivec x, ivec y) 判断 x<=y
bvec greaterThan(vec x, vec y) bvec greaterThan(ivec x, ivec y) 判断 x>y
bvec greaterThanEqual(vec x, vec y) bvec greaterThanEqual(ivec x, ivec y) 判断 x>=y
bvec equal(vec x, vec y) bvec equal(ivec x, ivec y) bvec equal(bvec x, bvec y) 判断 x==y
bvec notEqual(vec x, vec y) bvec notEqual(ivec x, ivec y) bvec notEqual(bvec x, bvec y) 判断 x!=y
bool any(bvec x) 判断 x 的元素是否有 true
bool all(bvec x) 判断 x 的元素是否全部为 true

vec4 texture2D (sampler2D sampler, vec2 coord) vec4 texture2D (sampler2D sampler, vec2 coord, float bias) vec4 texture2DProj (sampler2D sampler, vec3 coord) vec4 texture2DProj (sampler2D sampler, vec3 coord, float bias) vec4 texture2DProj (sampler2D sampler, vec4 coord) vec4 texture2DProj (sampler2D sampler, vec4 coord, float bias) vec4 texture2DLod (sampler2D sampler, vec2 coord, float lod) vec4 texture2DProjLod (sampler2D sampler, vec3 coord, float lod) vec4 texture2DProjLod (sampler2D sampler, vec4 coord, float lod) 使用 texture 坐标 coord 来查找当前绑定到采样器的 texture。对于函数名中含有 Proj 的函数来说，texture 的坐标（coord.s,coord.t）会先除以 coord 的最后一个坐标。对于 vec4 这种变种来说，坐标的第三个元素直接被忽略。
vec4 textureCube (samplerCube sampler, vec3 coord)vec4 textureCube (samplerCube sampler, vec3 coord, float bias)vec4 textureCubeLod (samplerCube sampler, vec3 coord, float lod) 使用 coord 这个坐标去查找当前绑定到采样器的 cube map。coord 的方向用来表示去查找 cube map 的哪一个二维平面。
