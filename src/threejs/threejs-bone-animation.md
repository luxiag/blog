---
title: ThreeJS中的动画
category:
  - ThreeJS
date: 2022-03-22
---

## 动画类型

| 动画类型                                     | 描述                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 帧动画 (Frame Animation)                     | 将一系列图片按照顺序播放，形成动画效果，类似于传统手绘动画。                                                   |
| 逐帧动画 (Sprite Animation)                  | 通过改变精灵纹理的位置或贴图来模拟运动，常用于游戏中的人物、道具等的动画效果。                                 |
| 骨骼动画 (Skeletal Animation)                | 通过骨骼的动画变化来模拟角色的运动，将角色的形态分解成多个骨骼，并通过调整骨骼的变换来实现动画效果。           |
| 形状关键帧动画 (Morph Target Animation)      | 通过调整网格顶点的位置、法线和颜色等属性，来模拟物体的形变和运动，比如角色的面部表情、物体的形变等。           |
| 粒子动画 (Particle Animation)                | 通过控制一组小粒子的运动轨迹、大小、透明度等属性，来模拟各种自然现象，比如烟雾、火花、雨滴等。                 |
| 基于物理引擎的动画 (Physics-based Animation) | 通过物理引擎模拟物体的运动、碰撞、重力、弹性等物理特性，来实现更加真实的动画效果，常用于游戏中的角色、物体等。 |

## ThreeJS 中的动画类

1. `AnimationMixer`

   - 使用格式：`const mixer = new AnimationMixer( object : Object3D )`
   - 功能：管理和混合场景中的动画数据。
   - 参数说明：
     - `object`：要添加动画数据的 `Object3D` 对象。
   - 示例：
     ```js
     const mixer = new THREE.AnimationMixer(mesh);
     ```

2. `AnimationClip`

   - 使用格式：`AnimationClip( name : String, duration : Number, tracks : Array )`
   - 功能：表示一个包含一组 `AnimationTrack` 的动画片段。
   - 参数说明：
     - `name`：动画片段的名称。
     - `duration`：动画片段的持续时间（秒）。
     - `tracks`：包含 `AnimationTrack` 对象的数组。
   - 示例：
     ```js
     const clip = THREE.AnimationClip.CreateFromMorphTargetSequence(
       "morph",
       geometry.morphAttributes.position,
       30
     );
     ```

3. `AnimationAction`

   - 使用格式：`AnimationAction( mixer : AnimationMixer, clip : AnimationClip, localRoot : Object3D )`
   - 功能：表示一个 `AnimationClip` 在 `AnimationMixer` 中的播放实例。
   - 参数说明：
     - `mixer`：`AnimationMixer` 对象。
     - `clip`：`AnimationClip` 对象。
     - `localRoot`：本地根对象，动画中的对象将相对于此对象移动。
   - 示例：
     ```js
     const action = mixer.clipAction(clip);
     ```

4. `AnimationObjectGroup`

   - 使用格式：`AnimationObjectGroup( ...objects : Object3D[] )`
   - 功能：管理多个对象的动画。
   - 参数说明：
     - `objects`：要添加到 `AnimationObjectGroup` 的 `Object3D` 对象。
   - 示例：
     ```js
     const group = new THREE.AnimationObjectGroup(mesh1, mesh2);
     const clip = THREE.AnimationClip.CreateFromAction(animationAction);
     clip.tracks.shift(); // 移除第一条跟踪轨迹
     group.clipAction(clip).play(); // 播放动画
     ```

5. `KeyframeTrack`
   - 使用格式：`KeyframeTrack( name : String, times : Array, values : Array, interpolation : InterpolationModes )`
   - 功能：表示动画的关键帧序列。
   - 参数说明：
     - `name`：关键帧序列的名称。
     - `times`：关键帧时间的数组。
     - `values`：与关键帧相关联的值的数组。
     - `interpolation`：插值模式，默认为 `THREE.InterpolateLinear`。
   - 示例：
     ```js
     const times = [0, 1, 2];
     const values = [0, 1, 0];
     const track = new THREE.NumberKeyframeTrack(".opacity", times, values);
     ```

动画的运行是通过 AnimationMixer 类实现的。当一个模型需要播放动画时，我们需要将模型的动画剪辑（AnimationClip）添加到 AnimationMixer 实例中，然后通过 mixer.clipAction() 方法获取一个动画动作（AnimationAction）实例，调用 play() 方法播放动画，AnimationAction 的更新又通过 AnimationMixer.update() 方法实现。

- 创建动画剪辑（AnimationClip），并将其包含的动画轨迹（AnimationTrack）绑定到场景中的对象上。
- 创建动画混合器（AnimationMixer），并将动画剪辑添加到混合器中。
- 调用混合器的 update 方法，更新当前时间下各个对象的状态。
- 将更新后的状态应用到场景中的对象上，使动画动起来。

```js
// 使用GLTFLoader加载模型
loader.load("models/gltf/Soldier.glb", function (gltf) {
  // 获取模型
  model = gltf.scene;
  // 将模型添加到场景中
  scene.add(model);

  // 遍历模型内的所有对象
  model.traverse(function (object) {
    // 如果对象是网格，则开启阴影投射
    if (object.isMesh) object.castShadow = true;
  });

  // 创建骨骼辅助对象，用于调试和查看骨骼结构
  skeleton = new THREE.SkeletonHelper(model);
  // 设置骨骼辅助对象为不可见
  skeleton.visible = false;
  // 将骨骼辅助对象添加到场景中
  scene.add(skeleton);

  // 创建面板
  createPanel();

  // 获取模型的动画数组
  const animations = gltf.animations;

  // 创建动画混合器
  mixer = new THREE.AnimationMixer(model);

  // 获取模型的不同动作，并将其加入动画混合器中
  idleAction = mixer.clipAction(animations[0]);
  walkAction = mixer.clipAction(animations[3]);
  runAction = mixer.clipAction(animations[1]);

  // 将不同动作保存在数组中
  actions = [idleAction, walkAction, runAction];

  // 激活所有动作
  activateAllActions();

  // 调用动画循环函数
  animate();
});

function activateAllActions() {
  setWeight(idleAction, settings["modify idle weight"]);
  setWeight(walkAction, settings["modify walk weight"]);
  setWeight(runAction, settings["modify run weight"]);

  actions.forEach(function (action) {
    action.play();
  });
}

function setWeight(action, weight) {
  // 设置动画的权重值
  action.enabled = true; // 启用当前动画
  action.setEffectiveTimeScale(1); // 设置动画播放速度为正常速度
  action.setEffectiveWeight(weight); // 设置动画权重值
}

function animation(){
	let mixerUpdateDelta = clock.getDelta();
	mixer.update( mixerUpdateDelta );
}
```

<div ref="blendingRef" class="ref"></div>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let dat;


const blendingRef = ref()
const initBlending = () => {

			let scene, renderer, camera, stats;
			let model, skeleton, mixer, clock;

			const crossFadeControls = [];

			let idleAction, walkAction, runAction;
			let idleWeight, walkWeight, runWeight;
			let actions, settings;

			let singleStepMode = false;
			let sizeOfNextStep = 0;

			init();

			function init() {

				// const container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 45, 2, 1, 1000 );
				camera.position.set( 1, 2, - 3 );
				camera.lookAt( 0, 1, 0 );

				clock = new THREE.Clock();

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( - 3, 10, - 10 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 2;
				dirLight.shadow.camera.bottom = - 2;
				dirLight.shadow.camera.left = - 2;
				dirLight.shadow.camera.right = 2;
				dirLight.shadow.camera.near = 0.1;
				dirLight.shadow.camera.far = 40;
				scene.add( dirLight );

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const loader = new GLTFLoader();
				loader.load( '/threejs/models/gltf/Soldier.glb', function ( gltf ) {

					model = gltf.scene;
					scene.add( model );

					model.traverse( function ( object ) {

						if ( object.isMesh ) object.castShadow = true;

					} );

					//

					skeleton = new THREE.SkeletonHelper( model );
					skeleton.visible = false;
					scene.add( skeleton );

					//

					createPanel();


					//

					const animations = gltf.animations;

					mixer = new THREE.AnimationMixer( model );

					idleAction = mixer.clipAction( animations[ 0 ] );
					walkAction = mixer.clipAction( animations[ 3 ] );
					runAction = mixer.clipAction( animations[ 1 ] );

					actions = [ idleAction, walkAction, runAction ];

					activateAllActions();

					animate();

				} );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( blendingRef.value.offsetWidth ,blendingRef.value.offsetWidth/2  );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.shadowMap.enabled = true;
				blendingRef.value.appendChild( renderer.domElement );

				// stats = new Stats();
				// container.appendChild( stats.dom );

				window.addEventListener( 'resize', onWindowResize );

			}

			function createPanel() {

				const panel = new GUI( { width: 310 } );
                blendingRef.value.appendChild(panel.domElement)
                panel.domElement.style.position = 'absolute'
                panel.domElement.style.right = 0;
                panel.domElement.style.top = 0;
                panel.domElement.style.bottom = 0;
				const folder1 = panel.addFolder( 'Visibility' );
				const folder2 = panel.addFolder( 'Activation/Deactivation' );
				const folder3 = panel.addFolder( 'Pausing/Stepping' );
				const folder4 = panel.addFolder( 'Crossfading' );
				const folder5 = panel.addFolder( 'Blend Weights' );
				const folder6 = panel.addFolder( 'General Speed' );

				settings = {
					'show model': true,
					'show skeleton': false,
					'deactivate all': deactivateAllActions,
					'activate all': activateAllActions,
					'pause/continue': pauseContinue,
					'make single step': toSingleStepMode,
					'modify step size': 0.05,
					'from walk to idle': function () {

						prepareCrossFade( walkAction, idleAction, 1.0 );

					},
					'from idle to walk': function () {

						prepareCrossFade( idleAction, walkAction, 0.5 );

					},
					'from walk to run': function () {

						prepareCrossFade( walkAction, runAction, 2.5 );

					},
					'from run to walk': function () {

						prepareCrossFade( runAction, walkAction, 5.0 );

					},
					'use default duration': true,
					'set custom duration': 3.5,
					'modify idle weight': 0.0,
					'modify walk weight': 1.0,
					'modify run weight': 0.0,
					'modify time scale': 1.0
				};

				folder1.add( settings, 'show model' ).onChange( showModel );
				folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
				folder2.add( settings, 'deactivate all' );
				folder2.add( settings, 'activate all' );
				folder3.add( settings, 'pause/continue' );
				folder3.add( settings, 'make single step' );
				folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );
				crossFadeControls.push( folder4.add( settings, 'from walk to idle' ) );
				crossFadeControls.push( folder4.add( settings, 'from idle to walk' ) );
				crossFadeControls.push( folder4.add( settings, 'from walk to run' ) );
				crossFadeControls.push( folder4.add( settings, 'from run to walk' ) );
				folder4.add( settings, 'use default duration' );
				folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
				folder5.add( settings, 'modify idle weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					setWeight( idleAction, weight );

				} );
				folder5.add( settings, 'modify walk weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					setWeight( walkAction, weight );

				} );
				folder5.add( settings, 'modify run weight', 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {

					setWeight( runAction, weight );

				} );
				folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

				folder1.open();
				folder2.open();
				folder3.open();
				folder4.open();
				folder5.open();
				folder6.open();

			}


			function showModel( visibility ) {

				model.visible = visibility;

			}


			function showSkeleton( visibility ) {

				skeleton.visible = visibility;

			}


			function modifyTimeScale( speed ) {

				mixer.timeScale = speed;

			}


			function deactivateAllActions() {

				actions.forEach( function ( action ) {

					action.stop();

				} );

			}

			function activateAllActions() {

				setWeight( idleAction, settings[ 'modify idle weight' ] );
				setWeight( walkAction, settings[ 'modify walk weight' ] );
				setWeight( runAction, settings[ 'modify run weight' ] );

				actions.forEach( function ( action ) {

					action.play();

				} );

			}

			function pauseContinue() {

				if ( singleStepMode ) {

					singleStepMode = false;
					unPauseAllActions();

				} else {

					if ( idleAction.paused ) {

						unPauseAllActions();

					} else {

						pauseAllActions();

					}

				}

			}

			function pauseAllActions() {

				actions.forEach( function ( action ) {

					action.paused = true;

				} );

			}

			function unPauseAllActions() {

				actions.forEach( function ( action ) {

					action.paused = false;

				} );

			}

			function toSingleStepMode() {

				unPauseAllActions();

				singleStepMode = true;
				sizeOfNextStep = settings[ 'modify step size' ];

			}

			function prepareCrossFade( startAction, endAction, defaultDuration ) {

				// Switch default / custom crossfade duration (according to the user's choice)

				const duration = setCrossFadeDuration( defaultDuration );

				// Make sure that we don't go on in singleStepMode, and that all actions are unpaused

				singleStepMode = false;
				unPauseAllActions();

				// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
				// else wait until the current action has finished its current loop

				if ( startAction === idleAction ) {

					executeCrossFade( startAction, endAction, duration );

				} else {

					synchronizeCrossFade( startAction, endAction, duration );

				}

			}

			function setCrossFadeDuration( defaultDuration ) {

				// Switch default crossfade duration <-> custom crossfade duration

				if ( settings[ 'use default duration' ] ) {

					return defaultDuration;

				} else {

					return settings[ 'set custom duration' ];

				}

			}

			function synchronizeCrossFade( startAction, endAction, duration ) {

				mixer.addEventListener( 'loop', onLoopFinished );

				function onLoopFinished( event ) {

					if ( event.action === startAction ) {

						mixer.removeEventListener( 'loop', onLoopFinished );

						executeCrossFade( startAction, endAction, duration );

					}

				}

			}

			function executeCrossFade( startAction, endAction, duration ) {

				// Not only the start action, but also the end action must get a weight of 1 before fading
				// (concerning the start action this is already guaranteed in this place)

				setWeight( endAction, 1 );
				endAction.time = 0;

				// Crossfade with warping - you can also try without warping by setting the third parameter to false

				startAction.crossFadeTo( endAction, duration, true );

			}

			// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
			// the start action's timeScale to ((start animation's duration) / (end animation's duration))

			function setWeight( action, weight ) {

				action.enabled = true;
				action.setEffectiveTimeScale( 1 );
				action.setEffectiveWeight( weight );

			}

			// Called by the render loop

			function updateWeightSliders() {

				settings[ 'modify idle weight' ] = idleWeight;
				settings[ 'modify walk weight' ] = walkWeight;
				settings[ 'modify run weight' ] = runWeight;

			}

			// Called by the render loop

			function updateCrossFadeControls() {

				if ( idleWeight === 1 && walkWeight === 0 && runWeight === 0 ) {

					crossFadeControls[ 0 ].disable();
					crossFadeControls[ 1 ].enable();
					crossFadeControls[ 2 ].disable();
					crossFadeControls[ 3 ].disable();

				}

				if ( idleWeight === 0 && walkWeight === 1 && runWeight === 0 ) {

					crossFadeControls[ 0 ].enable();
					crossFadeControls[ 1 ].disable();
					crossFadeControls[ 2 ].enable();
					crossFadeControls[ 3 ].disable();

				}

				if ( idleWeight === 0 && walkWeight === 0 && runWeight === 1 ) {

					crossFadeControls[ 0 ].disable();
					crossFadeControls[ 1 ].disable();
					crossFadeControls[ 2 ].disable();
					crossFadeControls[ 3 ].enable();

				}

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				// Render loop

				requestAnimationFrame( animate );

				idleWeight = idleAction.getEffectiveWeight();
				walkWeight = walkAction.getEffectiveWeight();
				runWeight = runAction.getEffectiveWeight();

				// Update the panel values if weights are modified from "outside" (by crossfadings)

				updateWeightSliders();

				// Enable/disable crossfade controls according to current weight values

				updateCrossFadeControls();

				// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

				let mixerUpdateDelta = clock.getDelta();

				// If in single step mode, make one step and then do nothing (until the user clicks again)

				if ( singleStepMode ) {

					mixerUpdateDelta = sizeOfNextStep;
					sizeOfNextStep = 0;

				}

				// Update the animation mixer, the stats panel, and render this frame

				mixer.update( mixerUpdateDelta );

				// stats.update();

				renderer.render( scene, camera );

			}
}


onMounted(async ()=> {
    dat = await import('dat.gui')
    initBlending()
})

</script>
