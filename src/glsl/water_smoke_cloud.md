---
title: 水烟雾云
date: 2022-10-11
category:
  - GLSL
---

```glsl
# vertexShader
uniform vec3 uColor;
uniform float uFrequency;
uniform float uScale;
uniform float uTim
varying float vElevation;

varying vec2 vUv
// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8
precision highp float;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 
    modelPosition.z += sin((modelPosition.x+uTime) * uFrequency)*uScale ;
    modelPosition.z += cos((modelPosition.y+uTime) * uFrequency)*uScale
    vElevation = modelPosition.z;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    vUv = u
}


```

<div ref="float" class="fog_dom"></div>

```glsl
# vertexShader

precision lowp float;
uniform float uWaresFrequency;
uniform float uScale;
uniform float uNoiseFrequency;
uniform float uNoiseScale;
uniform float uXzScale;
uniform float uTime;
uniform float uXspeed;
uniform float uZspeed;
uniform float uNoiseSpeed;

// 计算出的高度传递给片元着色器
varying float vElevation;

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


//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = sin(modelPosition.x*uWaresFrequency+uTime*uXspeed)*sin(modelPosition.z*uWaresFrequency*uXzScale+uTime*uZspeed);

    elevation += -abs(cnoise(vec2(modelPosition.xz*uNoiseFrequency+uTime*uNoiseSpeed))) *uNoiseScale;

    vElevation = elevation;

    elevation *= uScale;



    modelPosition.y += elevation;

    gl_Position = projectionMatrix * viewMatrix *modelPosition;
}
```

<div ref="fog" class="fog_dom"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const fog = ref()

const vertexShader = `
precision lowp float;
uniform float uWaresFrequency;
uniform float uScale;
uniform float uNoiseFrequency;
uniform float uNoiseScale;
uniform float uXzScale;
uniform float uTime;
uniform float uXspeed;
uniform float uZspeed;
uniform float uNoiseSpeed;

// 计算出的高度传递给片元着色器
varying float vElevation;

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


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float elevation = sin(modelPosition.x*uWaresFrequency+uTime*uXspeed)*sin(modelPosition.z*uWaresFrequency*uXzScale+uTime*uZspeed);

    elevation += -abs(cnoise(vec2(modelPosition.xz*uNoiseFrequency+uTime*uNoiseSpeed))) *uNoiseScale;
    
    vElevation = elevation;
    
    elevation *= uScale;

    

    modelPosition.y += elevation;

    gl_Position = projectionMatrix * viewMatrix *modelPosition;
}

`

const fragmentShader = `
precision lowp float;

uniform vec3 uHighColor;
uniform vec3 uLowColor;
varying float vElevation;
uniform float uOpacity;

void main(){
    float a = (vElevation+1.0)/2.0;
    vec3 color = mix(uLowColor,uHighColor,a);
    gl_FragColor = vec4(color,uOpacity);
}
`

const initFog = () => {
    //创建gui对象
    const gui = new dat.GUI();

    // 初始化场景
    const scene = new THREE.Scene();

    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(
      90,
      2,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2);
    scene.add(camera);
    const params = {
        uWaresFrequency: 14,
        uScale: 0.03,
        uXzScale: 1.5,
        uNoiseFrequency: 10,
        uNoiseScale: 1.5,
        uLowColor: "#ff0000",
        uHighColor: "#ffff00",
        uXspeed: 1,
        uZspeed: 1,
        uNoiseSpeed: 1,
        uOpacity: 1,
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uWaresFrequency: {
          value: params.uWaresFrequency,
        },
        uScale: {
          value: params.uScale,
        },
        uNoiseFrequency: {
          value: params.uNoiseFrequency,
        },
        uNoiseScale: {
          value: params.uNoiseScale,
        },
        uXzScale: {
          value: params.uXzScale,
        },
        uTime: {
          value: params.uTime,
        },
        uLowColor: {
          value: new THREE.Color(params.uLowColor),
        },
        uHighColor: {
          value: new THREE.Color(params.uHighColor),
        },
        uXspeed: {
          value: params.uXspeed,
        },
        uZspeed: {
          value: params.uZspeed,
        },
        uNoiseSpeed: {
          value: params.uNoiseSpeed,
        },
        uOpacity: {
          value: params.uOpacity,
        },
      },
      transparent: true,
    });

    gui
      .add(params, "uWaresFrequency")
      .min(1)
      .max(100)
      .step(0.1)
      .onChange((value) => {
        shaderMaterial.uniforms.uWaresFrequency.value = value;
      });

    gui
      .add(params, "uScale")
      .min(0)
      .max(0.2)
      .step(0.001)
      .onChange((value) => {
        shaderMaterial.uniforms.uScale.value = value;
      });

    gui
      .add(params, "uNoiseFrequency")
      .min(1)
      .max(100)
      .step(0.1)
      .onChange((value) => {
        shaderMaterial.uniforms.uNoiseFrequency.value = value;
      });

    gui
      .add(params, "uNoiseScale")
      .min(0)
      .max(5)
      .step(0.001)
      .onChange((value) => {
        shaderMaterial.uniforms.uNoiseScale.value = value;
      });

    gui
      .add(params, "uXzScale")
      .min(0)
      .max(5)
      .step(0.1)
      .onChange((value) => {
        shaderMaterial.uniforms.uXzScale.value = value;
      });

    gui.addColor(params, "uLowColor").onFinishChange((value) => {
      shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
    });
    gui.addColor(params, "uHighColor").onFinishChange((value) => {
      shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
    });

    gui
      .add(params, "uXspeed")
      .min(0)
      .max(5)
      .step(0.001)
      .onChange((value) => {
        shaderMaterial.uniforms.uXspeed.value = value;
      });

    gui
      .add(params, "uZspeed")
      .min(0)
      .max(5)
      .step(0.001)
      .onChange((value) => {
        shaderMaterial.uniforms.uZspeed.value = value;
      });

    gui
      .add(params, "uNoiseSpeed")
      .min(0)
      .max(5)
      .step(0.001)
      .onChange((value) => {
        shaderMaterial.uniforms.uNoiseSpeed.value = value;
      });

    gui
      .add(params, "uOpacity")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((value) => {
        shaderMaterial.uniforms.uOpacity.value = value;
      });

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 1024, 1024),
      shaderMaterial
    );
    plane.rotation.x = -Math.PI / 2;

    scene.add(plane);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();

    // 设置渲染尺寸大小
    renderer.setSize(fog.value.offsetWidth,fog.value.offsetWidth/2);

    if(!__VUEPRESS_SSR__) {
        window.addEventListener("resize", () => {
            //   更新渲染器
            renderer.setSize(fog.value.offsetWidth,fog.value.offsetWidth/2);
            //   设置渲染器的像素比例
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    }
    fog.value.appendChild(renderer.domElement);
    fog.value.appendChild(gui.domElement)
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top="0px";
    gui.domElement.style.right="0px";

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼
    controls.enableDamping = true;

    const clock = new THREE.Clock();
    function animate(t) {
      const elapsedTime = clock.getElapsedTime();
      shaderMaterial.uniforms.uTime.value = elapsedTime;
      requestAnimationFrame(animate);
      // 使用渲染器渲染相机看这个场景的内容渲染出来
      renderer.render(scene, camera);
    }

    animate();



}

const float = ref()

const initFloat = () => {
  const gui = new dat.GUI();

  // console.log(THREE);
  // 初始化场景
  const scene = new THREE.Scene();

  // 创建透视相机
  const camera = new THREE.PerspectiveCamera(
    90,
    2,
    0.1,
    1000
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.position.set(0, 0, 2);
  scene.add(camera);

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/assets/textures/ca.jpeg");
  const params = {
    uFrequency: 10,
    uScale: 0.1,
  };


  // 创建着色器材质;
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      uniform vec3 uColor;
      uniform float uFrequency;
      uniform float uScale;
      uniform float uTime;

      varying float vElevation;
      varying vec2 vUv;

      // highp -2^16-2^16
      // mediump = -2^10-2^10
      // lowp -2^8-2^8
      precision highp float;
      void main(){
          vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

          modelPosition.z += sin((modelPosition.x+uTime) * uFrequency)*uScale ;
          modelPosition.z += cos((modelPosition.y+uTime) * uFrequency)*uScale ;

          vElevation = modelPosition.z;
          gl_Position =  projectionMatrix * viewMatrix * modelPosition;
          vUv = uv;

      }

    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vElevation;
      precision highp float;
      varying vec2 vUv;

      uniform sampler2D uTexture;
      void main(){
          float alpha = (vElevation+0.1)+0.8;
          vec4 textureColor = texture2D(uTexture,vUv);
          textureColor.rgb*=alpha;
          gl_FragColor = textureColor;
      }

    `,
    uniforms: {
      uColor: {
        value: new THREE.Color("purple"),
      },
      // 波浪的频率
      uFrequency: {
        value: params.uFrequency,
      },
      // 波浪的幅度
      uScale: {
        value: params.uScale,
      },
      // 动画时间
      uTime: {
        value: 0,
      },
      uTexture: {
        value: texture,
      },
    },
    side: THREE.DoubleSide,
    transparent: true,
  });

  gui
    .add(params, "uFrequency")
    .min(0)
    .max(50)
    .step(0.1)
    .onChange((value) => {
      shaderMaterial.uniforms.uFrequency.value = value;
    });
  gui
    .add(params, "uScale")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((value) => {
      shaderMaterial.uniforms.uScale.value = value;
    });
  const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 64, 64),
    shaderMaterial
  );

  scene.add(floor);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(float.value.offsetWidth, float.value.offsetWidth/2);

  float.value.appendChild(renderer.domElement)
  float.value.appendChild(gui.domElement)
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top="0px";
  gui.domElement.style.right="0px";


  if(!__VUEPRESS_SSR__) {
    window.addEventListener("resize", () => {
    //   更新渲染器
    renderer.setSize(float.value.offsetWidth, float.value.offsetWidth/2);

    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
  });
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;

  const clock = new THREE.Clock();
  function animate(t) {
    const elapsedTime = clock.getElapsedTime();
    shaderMaterial.uniforms.uTime.value = elapsedTime;
    //   console.log(elapsedTime);
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
  }

  animate();

}

onMounted(()=>{
    initFog()
    initFloat()
})

</script>

<style scoped>

    .fog_dom {
        position:relative;
    }
</style>
