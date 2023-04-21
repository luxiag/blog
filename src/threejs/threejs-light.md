---
title: ThreeJS中的灯光
category:
    - ThreeJS
date: 2022-03-07
---

```js
//遍历场景中的所有对象，然后判断当前对象是否是光源对象
function toggleLights( visible ) {
	scene.traverse( function ( object ) {
		if ( object.isLight ) {
			object.visible = visible;
		}
	} );
	render();
}

```

<div ref="lightRef" class="light"></div>

```js
    const shaderMaterial = new THREE.ShaderMaterial({
        // 定义顶点着色器，用于处理顶点属性
        vertexShader: `
            precision lowp float;
            // 传递顶点位置信息到片元着色器
            varying vec4 vPosition;
            // 传递变换后的顶点位置信息到片元着色器
            varying vec4 gPosition;
            void main(){
                // 将顶点坐标从模型空间变换到世界空间
                vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
                // 将变换后的顶点坐标从世界空间变换到相机空间
                // 并传递给 varying vPosition
                vPosition = modelPosition;
                // 将顶点坐标从模型空间变换到世界空间
                // 并传递给 varying gPosition
                gPosition = vec4( position, 1.0 );
                // 将顶点坐标从模型空间变换到相机空间和投影空间
                gl_Position =  projectionMatrix * viewMatrix * modelPosition;
            }
        `,
        // 定义片元着色器，用于处理像素颜色
        fragmentShader:`
            precision lowp float;
            // 接收来自顶点着色器的变量
            varying vec4 vPosition;
            varying vec4 gPosition;

            void main(){
                // 定义红色和黄色的颜色值
                vec4 redColor = vec4(1,0,0,1);
                vec4 yellowColor = vec4(1,1,0.5,1);
                // 计算需要混合的颜色值，并传递给 gl_FragColor
                vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);

                if(gl_FrontFacing){
                    // 对于正面的面，计算并设置像素颜色
                    gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
                }else{
                    // 对于背面的面，直接设置像素颜色
                    gl_FragColor = vec4(mixColor.xyz,1);
                }
            }  
        `,
        // 传递给着色器的变量，这里为空对象
        uniforms:{},
        // 设置物体的两面都需要渲染
        side:THREE.DoubleSide
    })

    const gltfLoader = new GLTFLoader()
    let LightBox = null 

    gltfLoader.load("/assets/model/flyLight.glb",(gltf) => {
        LightBox = gltf.scene.children[1]

        LightBox.material = shaderMaterial;
        
        for (let i = 0; i < 150; i++) {
          let flyLight = gltf.scene.clone(true);
          let x = (Math.random() - 0.5) * 300;
          let z = (Math.random() - 0.5) * 300;
          let y = Math.random() * 60 + 25;
          flyLight.position.set(x, y, z);
          gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1,
          });
          gsap.to(flyLight.position, {
            x: "+=" + Math.random() * 5,
            y: "+=" + Math.random() * 20,
            yoyo: true,
            duration: 5 + Math.random() * 10,
            repeat: -1,
          });
          scene.add(flyLight);
        }

    })

```

<div ref="lanternRef"></div>

```js
function createLight(color) {

  // 定义光源强度为2
  const intensity = 2;

  // 创建一个点光源
  const light = new THREE.PointLight(color, intensity, 20);

  // 开启阴影
  light.castShadow = true;

  // 减少双面对象自身阴影
  light.shadow.bias = -0.005;

  // 创建一个球体作为光源的可视化表示
  let geometry = new THREE.SphereGeometry(0.3, 12, 6);
  let material = new THREE.MeshBasicMaterial({
    color: color
  });

  // 根据光源强度调整颜色
  material.color.multiplyScalar(intensity);

  let sphere = new THREE.Mesh(geometry, material);

  // 将球体添加到光源上
  light.add(sphere);

  // 生成纹理
  const texture = new THREE.CanvasTexture(generateTexture());

  // 设置纹理过滤器和重复方式
  texture.magFilter = THREE.NearestFilter;
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(1, 4.5);

  // 创建一个球体作为光源的光晕效果
  geometry = new THREE.SphereGeometry(2, 32, 8);
  material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide, // 双面显示
    alphaMap: texture, // 设置透明度贴图
    alphaTest: 0.5 // 设置透明度阈值
  });

  sphere = new THREE.Mesh(geometry, material);

  // 开启球体阴影和接收阴影
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  // 将球体添加到光源上
  light.add(sphere);

  // 返回创建的光源
  return light;

}
/**
 * 生成一个 2x2 的纯白色 canvas 纹理
 */
function generateTexture() {
  // 创建一个 canvas 元素，并设置它的宽高为 2
  const canvas = document.createElement( 'canvas' );
  canvas.width = 2;
  canvas.height = 2;

  // 获取 canvas 的绘制上下文，并将其填充为白色
  const context = canvas.getContext( '2d' );
  context.fillStyle = 'white';
  context.fillRect( 0, 1, 2, 1 );

  // 返回生成的纹理
  return canvas;
}
```

<div ref="pointLightRef"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from "three/examples/jsm/objects/Water2";

let dat;
const lightRef = ref()
const initLights = async () => {
    const scene =  new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, 2, 0.25, 20 );
	camera.position.set( - 2, 1.5, 3 );

    const rgbeLoader = new RGBELoader();
	const envMap = await rgbeLoader.loadAsync( '/threejs/textures/equirectangular/moonless_golf_1k.hdr ' );
	envMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = envMap;
	scene.environment = envMap;

    const loader = new GLTFLoader();
	const gltf = await loader.loadAsync( '/threejs/models/gltf/LightsPunctualLamp.glb' );
    scene.add( gltf.scene );

    const gui = new dat.GUI()
    lightRef.value.appendChild(gui.domElement)
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top="0px";
    gui.domElement.style.right="0px";
    const params = {
		punctualLightsEnabled: true
	};
    gui.add( params, 'punctualLightsEnabled' ).onChange( toggleLights );
	gui.open();
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
	// renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( lightRef.value.offsetWidth, lightRef.value.offsetWidth /2 );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.useLegacyLights = false;
	lightRef.value.appendChild( renderer.domElement );

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 2;
	controls.maxDistance = 10;
	controls.target.set( 0, 1, 0 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize );

         function onWindowResize() {
		// camera.aspect = window.innerWidth / window.innerHeight;
		// camera.updateProjectionMatrix();
		renderer.setSize( lightRef.value.offsetWidth, lightRef.value.offsetWidth /2 );
		render();
	}
	function toggleLights( visible ) {
		scene.traverse( function ( object ) {
			if ( object.isLight ) {
				object.visible = visible;
			}
		} );
		render();
	}
	function render() {
		renderer.render( scene, camera );
	}
    render()
}


const lanternRef = ref()
const initLantern = () => {
    // 初始化场景
    const scene = new THREE.Scene();

    // 创建透视相机
    const camera = new THREE.PerspectiveCamera(
      90,
      2,
      0.1,
      1000
    );
    camera.position.y = 5

    const rgbeLoader = new RGBELoader();
    rgbeLoader.loadAsync("/assets/textures/2k.hdr").then((texture) => {
        // 图像将如何应用到物体（对象）上
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            precision lowp float;
            varying vec4 vPosition;
            varying vec4 gPosition;
            void main(){
                vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

                vPosition = modelPosition;
                gPosition = vec4( position, 1.0 );
                gl_Position =  projectionMatrix * viewMatrix * modelPosition;
            }
        `,
        fragmentShader:`
            precision lowp float;
            varying vec4 vPosition;
            varying vec4 gPosition;

            void main(){
                vec4 redColor = vec4(1,0,0,1);
                vec4 yellowColor = vec4(1,1,0.5,1);
                vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);



                if(gl_FrontFacing){
                    gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
                    // gl_FragColor = vec4(1,1,1,1);
                }else{
                    gl_FragColor = vec4(mixColor.xyz,1);
                }
            }  
        `,
        uniforms:{},
        side:THREE.DoubleSide
    })

    const renderer = new THREE.WebGLRenderer()
    // 定义渲染器的输出编码。
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // 色调映射的曝光级别。
    renderer.toneMappingExposure = 0.2;


    const gltfLoader = new GLTFLoader()
    let LightBox = null 

    gltfLoader.load("/assets/model/flyLight.glb",(gltf) => {
        LightBox = gltf.scene.children[1]

        LightBox.material = shaderMaterial;
        
        for (let i = 0; i < 150; i++) {
          let flyLight = gltf.scene.clone(true);
          let x = (Math.random() - 0.5) * 300;
          let z = (Math.random() - 0.5) * 300;
          let y = Math.random() * 60 + 25;
          flyLight.position.set(x, y, z);
          gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1,
          });
          gsap.to(flyLight.position, {
            x: "+=" + Math.random() * 5,
            y: "+=" + Math.random() * 20,
            yoyo: true,
            duration: 5 + Math.random() * 10,
            repeat: -1,
          });
          scene.add(flyLight);
        }

    })

    renderer.setSize(lanternRef.value.offsetWidth,lanternRef.value.offsetWidth/2)

    if(!__VUEPRESS_SSR__) {
        window.addEventListener("resize", () => {
        //   更新渲染器
        renderer.setSize(lanternRef.value.offsetWidth,lanternRef.value.offsetWidth/2)

        //   设置渲染器的像素比例
        renderer.setPixelRatio(window.devicePixelRatio);
        });        
    }
    lanternRef.value.appendChild(renderer.domElement)

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼
    controls.enableDamping = true;
    controls.update()
    // 设置自动旋转
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    controls.maxPolarAngle = (Math.PI / 3) * 2;
    controls.minPolarAngle = (Math.PI / 3) * 2;

    const clock = new THREE.Clock();
    function animate(t) {
    //   controls.update();
      const elapsedTime = clock.getElapsedTime();

      requestAnimationFrame(animate);
      // 使用渲染器渲染相机看这个场景的内容渲染出来
      renderer.render(scene, camera);
    }

    animate();


}

const pointLightRef = ref()

const initPointLight = () => {
				const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(45,2,1,2000);
                camera.position.z = 20
				scene.add( new THREE.AmbientLight( 0x111122 ) );    
				function createLight( color ) {

					const intensity = 2;

					const light = new THREE.PointLight( color, intensity, 20 );
					light.castShadow = true;
					light.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects

					let geometry = new THREE.SphereGeometry( 0.3, 12, 6 );
					let material = new THREE.MeshBasicMaterial( { color: color } );
					material.color.multiplyScalar( intensity );
					let sphere = new THREE.Mesh( geometry, material );
					light.add( sphere );

					const texture = new THREE.CanvasTexture( generateTexture() );
					texture.magFilter = THREE.NearestFilter;
					texture.wrapT = THREE.RepeatWrapping;
					texture.wrapS = THREE.RepeatWrapping;
					texture.repeat.set( 1, 4.5 );

					geometry = new THREE.SphereGeometry( 2, 32, 8 );
					material = new THREE.MeshPhongMaterial( {
						side: THREE.DoubleSide,
						alphaMap: texture,
						alphaTest: 0.5
					} );

					sphere = new THREE.Mesh( geometry, material );
					sphere.castShadow = true;
					sphere.receiveShadow = true;
					light.add( sphere );

					return light;

				}                

				const pointLight = createLight( 0x0088ff );
				scene.add( pointLight );

				const pointLight2 = createLight( 0xff8888 );
				scene.add( pointLight2 );
				const geometry = new THREE.BoxGeometry( 30, 30, 30 );

				const material = new THREE.MeshPhongMaterial( {
					color: 0xa0adaf,
					shininess: 10,
					specular: 0x111111,
					side: THREE.BackSide
				} );

				const mesh = new THREE.Mesh( geometry, material );
				mesh.position.y = 10;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( pointLightRef.value.offsetWidth,pointLightRef.value.offsetWidth/2  );
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.BasicShadowMap;
                pointLightRef.value.appendChild(renderer.domElement)

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 10, 0 );
				controls.update();
				//

				window.addEventListener( 'resize', onWindowResize );


			function onWindowResize() {
				renderer.setSize( pointLightRef.value.offsetWidth,pointLightRef.value.offsetWidth/2  );

			}

			function generateTexture() {

				const canvas = document.createElement( 'canvas' );
				canvas.width = 2;
				canvas.height = 2;

				const context = canvas.getContext( '2d' );
				context.fillStyle = 'white';
				context.fillRect( 0, 1, 2, 1 );

				return canvas;

			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				let time = performance.now() * 0.001;

				pointLight.position.x = Math.sin( time * 0.6 ) * 9;
				pointLight.position.y = Math.sin( time * 0.7 ) * 9 + 6;
				pointLight.position.z = Math.sin( time * 0.8 ) * 9;

				pointLight.rotation.x = time;
				pointLight.rotation.z = time;

				time += 10000;

				pointLight2.position.x = Math.sin( time * 0.6 ) * 9;
				pointLight2.position.y = Math.sin( time * 0.7 ) * 9 + 6;
				pointLight2.position.z = Math.sin( time * 0.8 ) * 9;

				pointLight2.rotation.x = time;
				pointLight2.rotation.z = time;

				renderer.render( scene, camera );

				// stats.update();

			}
            animate()
}

onMounted(async ()=>{
       dat = await import('dat.gui')
    initLantern()
    initLights()
    initPointLight()
    // initFireWork()
})

</script>
<style scoped>
    .light {
        position:relative;
    }
</style>