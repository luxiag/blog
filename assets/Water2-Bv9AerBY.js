import{p as j,m as N,i as _,P as O,V as p,k as D,aD as U,aE as V,H as L,n as E,aF as z,Q,b as X,J as G,aG as J,X as A,s as K}from"./three.module-BzA_QsZm.js";class F extends j{constructor(b,t={}){super(b),this.isReflector=!0,this.type="Reflector",this.camera=new N;const n=this,C=t.color!==void 0?new _(t.color):new _(8355711),W=t.textureWidth||512,R=t.textureHeight||512,S=t.clipBias||0,v=t.shader||F.ReflectorShader,P=t.multisample!==void 0?t.multisample:4,l=new O,x=new p,s=new p,g=new p,y=new D,M=new p(0,0,-1),f=new U,h=new p,w=new p,e=new U,o=new D,r=this.camera,c=new V(W,R,{samples:P,type:L}),u=new E({name:v.name!==void 0?v.name:"unspecified",uniforms:z.clone(v.uniforms),fragmentShader:v.fragmentShader,vertexShader:v.vertexShader});u.uniforms.tDiffuse.value=c.texture,u.uniforms.color.value=C,u.uniforms.textureMatrix.value=o,this.material=u,this.onBeforeRender=function(a,d,i){if(s.setFromMatrixPosition(n.matrixWorld),g.setFromMatrixPosition(i.matrixWorld),y.extractRotation(n.matrixWorld),x.set(0,0,1),x.applyMatrix4(y),h.subVectors(s,g),h.dot(x)>0)return;h.reflect(x).negate(),h.add(s),y.extractRotation(i.matrixWorld),M.set(0,0,-1),M.applyMatrix4(y),M.add(g),w.subVectors(s,M),w.reflect(x).negate(),w.add(s),r.position.copy(h),r.up.set(0,1,0),r.up.applyMatrix4(y),r.up.reflect(x),r.lookAt(w),r.far=i.far,r.updateMatrixWorld(),r.projectionMatrix.copy(i.projectionMatrix),o.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),o.multiply(r.projectionMatrix),o.multiply(r.matrixWorldInverse),o.multiply(n.matrixWorld),l.setFromNormalAndCoplanarPoint(x,s),l.applyMatrix4(r.matrixWorldInverse),f.set(l.normal.x,l.normal.y,l.normal.z,l.constant);const m=r.projectionMatrix;e.x=(Math.sign(f.x)+m.elements[8])/m.elements[0],e.y=(Math.sign(f.y)+m.elements[9])/m.elements[5],e.z=-1,e.w=(1+m.elements[10])/m.elements[14],f.multiplyScalar(2/f.dot(e)),m.elements[2]=f.x,m.elements[6]=f.y,m.elements[10]=f.z+1-S,m.elements[14]=f.w,n.visible=!1;const k=a.getRenderTarget(),I=a.xr.enabled,q=a.shadowMap.autoUpdate;a.xr.enabled=!1,a.shadowMap.autoUpdate=!1,a.setRenderTarget(c),a.state.buffers.depth.setMask(!0),a.autoClear===!1&&a.clear(),a.render(d,r),a.xr.enabled=I,a.shadowMap.autoUpdate=q,a.setRenderTarget(k);const H=i.viewport;H!==void 0&&a.state.viewport(H),n.visible=!0},this.getRenderTarget=function(){return c},this.dispose=function(){c.dispose(),n.material.dispose()}}}F.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class T extends j{constructor(b,t={}){super(b),this.isRefractor=!0,this.type="Refractor",this.camera=new N;const n=this,C=t.color!==void 0?new _(t.color):new _(8355711),W=t.textureWidth||512,R=t.textureHeight||512,S=t.clipBias||0,v=t.shader||T.RefractorShader,P=t.multisample!==void 0?t.multisample:4,l=this.camera;l.matrixAutoUpdate=!1,l.userData.refractor=!0;const x=new O,s=new D,g=new V(W,R,{samples:P,type:L});this.material=new E({name:v.name!==void 0?v.name:"unspecified",uniforms:z.clone(v.uniforms),vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,transparent:!0}),this.material.uniforms.color.value=C,this.material.uniforms.tDiffuse.value=g.texture,this.material.uniforms.textureMatrix.value=s;const y=function(){const e=new p,o=new p,r=new D,c=new p,u=new p;return function(d){return e.setFromMatrixPosition(n.matrixWorld),o.setFromMatrixPosition(d.matrixWorld),c.subVectors(e,o),r.extractRotation(n.matrixWorld),u.set(0,0,1),u.applyMatrix4(r),c.dot(u)<0}}(),M=function(){const e=new p,o=new p,r=new Q,c=new p;return function(){n.matrixWorld.decompose(o,r,c),e.set(0,0,1).applyQuaternion(r).normalize(),e.negate(),x.setFromNormalAndCoplanarPoint(e,o)}}(),f=function(){const e=new O,o=new U,r=new U;return function(u){l.matrixWorld.copy(u.matrixWorld),l.matrixWorldInverse.copy(l.matrixWorld).invert(),l.projectionMatrix.copy(u.projectionMatrix),l.far=u.far,e.copy(x),e.applyMatrix4(l.matrixWorldInverse),o.set(e.normal.x,e.normal.y,e.normal.z,e.constant);const a=l.projectionMatrix;r.x=(Math.sign(o.x)+a.elements[8])/a.elements[0],r.y=(Math.sign(o.y)+a.elements[9])/a.elements[5],r.z=-1,r.w=(1+a.elements[10])/a.elements[14],o.multiplyScalar(2/o.dot(r)),a.elements[2]=o.x,a.elements[6]=o.y,a.elements[10]=o.z+1-S,a.elements[14]=o.w}}();function h(e){s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(e.projectionMatrix),s.multiply(e.matrixWorldInverse),s.multiply(n.matrixWorld)}function w(e,o,r){n.visible=!1;const c=e.getRenderTarget(),u=e.xr.enabled,a=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(g),e.autoClear===!1&&e.clear(),e.render(o,l),e.xr.enabled=u,e.shadowMap.autoUpdate=a,e.setRenderTarget(c);const d=r.viewport;d!==void 0&&e.state.viewport(d),n.visible=!0}this.onBeforeRender=function(e,o,r){r.userData.refractor!==!0&&y(r)&&(M(),h(r),f(r),w(e,o,r))},this.getRenderTarget=function(){return g},this.dispose=function(){g.dispose(),n.material.dispose()}}}T.RefractorShader={name:"RefractorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`

		uniform mat4 textureMatrix;

		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec3 color;
		uniform sampler2D tDiffuse;

		varying vec4 vUv;

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};class B extends j{constructor(b,t={}){super(b),this.isWater=!0,this.type="Water";const n=this,C=t.color!==void 0?new _(t.color):new _(16777215),W=t.textureWidth!==void 0?t.textureWidth:512,R=t.textureHeight!==void 0?t.textureHeight:512,S=t.clipBias!==void 0?t.clipBias:0,v=t.flowDirection!==void 0?t.flowDirection:new X(1,0),P=t.flowSpeed!==void 0?t.flowSpeed:.03,l=t.reflectivity!==void 0?t.reflectivity:.02,x=t.scale!==void 0?t.scale:1,s=t.shader!==void 0?t.shader:B.WaterShader,g=new G,y=t.flowMap||void 0,M=t.normalMap0||g.load("textures/water/Water_1_M_Normal.jpg"),f=t.normalMap1||g.load("textures/water/Water_2_M_Normal.jpg"),h=.15,w=h*.5,e=new D,o=new K;if(F===void 0){console.error("THREE.Water: Required component Reflector not found.");return}if(T===void 0){console.error("THREE.Water: Required component Refractor not found.");return}const r=new F(b,{textureWidth:W,textureHeight:R,clipBias:S}),c=new T(b,{textureWidth:W,textureHeight:R,clipBias:S});r.matrixAutoUpdate=!1,c.matrixAutoUpdate=!1,this.material=new E({name:s.name,uniforms:z.merge([J.fog,s.uniforms]),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,transparent:!0,fog:!0}),y!==void 0?(this.material.defines.USE_FLOWMAP="",this.material.uniforms.tFlowMap={type:"t",value:y}):this.material.uniforms.flowDirection={type:"v2",value:v},M.wrapS=M.wrapT=A,f.wrapS=f.wrapT=A,this.material.uniforms.tReflectionMap.value=r.getRenderTarget().texture,this.material.uniforms.tRefractionMap.value=c.getRenderTarget().texture,this.material.uniforms.tNormalMap0.value=M,this.material.uniforms.tNormalMap1.value=f,this.material.uniforms.color.value=C,this.material.uniforms.reflectivity.value=l,this.material.uniforms.textureMatrix.value=e,this.material.uniforms.config.value.x=0,this.material.uniforms.config.value.y=w,this.material.uniforms.config.value.z=w,this.material.uniforms.config.value.w=x;function u(d){e.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),e.multiply(d.projectionMatrix),e.multiply(d.matrixWorldInverse),e.multiply(n.matrixWorld)}function a(){const d=o.getDelta(),i=n.material.uniforms.config;i.value.x+=P*d,i.value.y=i.value.x+w,i.value.x>=h?(i.value.x=0,i.value.y=w):i.value.y>=h&&(i.value.y=i.value.y-h)}this.onBeforeRender=function(d,i,m){u(m),a(),n.visible=!1,r.matrixWorld.copy(n.matrixWorld),c.matrixWorld.copy(n.matrixWorld),r.onBeforeRender(d,i,m),c.onBeforeRender(d,i,m),n.visible=!0}}}B.WaterShader={name:"WaterShader",uniforms:{color:{type:"c",value:null},reflectivity:{type:"f",value:0},tReflectionMap:{type:"t",value:null},tRefractionMap:{type:"t",value:null},tNormalMap0:{type:"t",value:null},tNormalMap1:{type:"t",value:null},textureMatrix:{type:"m4",value:null},config:{type:"v4",value:new U}},vertexShader:`

		#include <common>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>

		uniform mat4 textureMatrix;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			vUv = uv;
			vCoord = textureMatrix * vec4( position, 1.0 );

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vToEye = cameraPosition - worldPosition.xyz;

			vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
			gl_Position = projectionMatrix * mvPosition;

			#include <logdepthbuf_vertex>
			#include <fog_vertex>

		}`,fragmentShader:`

		#include <common>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>

		uniform sampler2D tReflectionMap;
		uniform sampler2D tRefractionMap;
		uniform sampler2D tNormalMap0;
		uniform sampler2D tNormalMap1;

		#ifdef USE_FLOWMAP
			uniform sampler2D tFlowMap;
		#else
			uniform vec2 flowDirection;
		#endif

		uniform vec3 color;
		uniform float reflectivity;
		uniform vec4 config;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			#include <logdepthbuf_fragment>

			float flowMapOffset0 = config.x;
			float flowMapOffset1 = config.y;
			float halfCycle = config.z;
			float scale = config.w;

			vec3 toEye = normalize( vToEye );

			// determine flow direction
			vec2 flow;
			#ifdef USE_FLOWMAP
				flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
			#else
				flow = flowDirection;
			#endif
			flow.x *= - 1.0;

			// sample normal maps (distort uvs with flowdata)
			vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
			vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );

			// linear interpolate to get the final normal color
			float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
			vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

			// calculate normal vector
			vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );

			// calculate the fresnel term to blend reflection and refraction maps
			float theta = max( dot( toEye, normal ), 0.0 );
			float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );

			// calculate final uv coords
			vec3 coord = vCoord.xyz / vCoord.w;
			vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

			vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );
			vec4 refractColor = texture2D( tRefractionMap, uv );

			// multiply water color with the mix of both textures
			gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>

		}`};export{B as W};
