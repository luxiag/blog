import{_ as pa,e as ia,h as q,f as S,j as va,r as L,i as Z,G as Fa,o as ba}from"./app-DPJYBgB6.js";import{p as V,V as p,i as z,ao as ya,P as ua,k as G,ay as J,m as N,az as ma,aA as U,aB as $,n as ta,aF as fa,aD as la,l as K,as as ha,o as ga,a as wa,aC as Ca,A as xa,W as X,at as Q,q as Ea,G as Aa,_ as Ba,aR as Sa,a4 as Da,r as Ma,s as Ta,b as Y}from"./three.module-_5Kft3IB.js";import{O as H}from"./OrbitControls-86TszHm5.js";import{R as aa}from"./RGBELoader-DKsNqSAJ.js";import{G as sa}from"./GLTFLoader--m4klZzU.js";import{W as na}from"./Water2-BkR9J0ye.js";class ea extends V{constructor(t,a={}){super(t),this.isWater=!0;const l=this,P=a.textureWidth!==void 0?a.textureWidth:512,y=a.textureHeight!==void 0?a.textureHeight:512,k=a.clipBias!==void 0?a.clipBias:0,j=a.alpha!==void 0?a.alpha:1,n=a.time!==void 0?a.time:0,i=a.waterNormals!==void 0?a.waterNormals:null,A=a.sunDirection!==void 0?a.sunDirection:new p(.70707,.70707,0),D=new z(a.sunColor!==void 0?a.sunColor:16777215),M=new z(a.waterColor!==void 0?a.waterColor:8355711),u=a.eye!==void 0?a.eye:new p(0,0,0),o=a.distortionScale!==void 0?a.distortionScale:20,g=a.side!==void 0?a.side:ya,w=a.fog!==void 0?a.fog:!1,b=new ua,s=new p,v=new p,B=new p,f=new G,h=new p(0,0,-1),c=new J,F=new p,C=new p,x=new J,E=new G,r=new N,_=new ma(P,y),T={name:"MirrorShader",uniforms:U.merge([$.fog,$.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new G},sunColor:{value:new z(8355711)},sunDirection:{value:new p(.70707,.70707,0)},eye:{value:new p},waterColor:{value:new z(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},e=new ta({name:T.name,uniforms:U.clone(T.uniforms),vertexShader:T.vertexShader,fragmentShader:T.fragmentShader,lights:!0,side:g,fog:w});e.uniforms.mirrorSampler.value=_.texture,e.uniforms.textureMatrix.value=E,e.uniforms.alpha.value=j,e.uniforms.time.value=n,e.uniforms.normalSampler.value=i,e.uniforms.sunColor.value=D,e.uniforms.waterColor.value=M,e.uniforms.sunDirection.value=A,e.uniforms.distortionScale.value=o,e.uniforms.eye.value=u,l.material=e,l.onBeforeRender=function(d,oa,R){if(v.setFromMatrixPosition(l.matrixWorld),B.setFromMatrixPosition(R.matrixWorld),f.extractRotation(l.matrixWorld),s.set(0,0,1),s.applyMatrix4(f),F.subVectors(v,B),F.dot(s)>0)return;F.reflect(s).negate(),F.add(v),f.extractRotation(R.matrixWorld),h.set(0,0,-1),h.applyMatrix4(f),h.add(B),C.subVectors(v,h),C.reflect(s).negate(),C.add(v),r.position.copy(F),r.up.set(0,1,0),r.up.applyMatrix4(f),r.up.reflect(s),r.lookAt(C),r.far=R.far,r.updateMatrixWorld(),r.projectionMatrix.copy(R.projectionMatrix),E.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),E.multiply(r.projectionMatrix),E.multiply(r.matrixWorldInverse),b.setFromNormalAndCoplanarPoint(s,v),b.applyMatrix4(r.matrixWorldInverse),c.set(b.normal.x,b.normal.y,b.normal.z,b.constant);const m=r.projectionMatrix;x.x=(Math.sign(c.x)+m.elements[8])/m.elements[0],x.y=(Math.sign(c.y)+m.elements[9])/m.elements[5],x.z=-1,x.w=(1+m.elements[10])/m.elements[14],c.multiplyScalar(2/c.dot(x)),m.elements[2]=c.x,m.elements[6]=c.y,m.elements[10]=c.z+1-k,m.elements[14]=c.w,u.setFromMatrixPosition(R.matrixWorld);const da=d.getRenderTarget(),ca=d.xr.enabled,ra=d.shadowMap.autoUpdate;l.visible=!1,d.xr.enabled=!1,d.shadowMap.autoUpdate=!1,d.setRenderTarget(_),d.state.buffers.depth.setMask(!0),d.autoClear===!1&&d.clear(),d.render(oa,r),l.visible=!0,d.xr.enabled=ca,d.shadowMap.autoUpdate=ra,d.setRenderTarget(da);const I=R.viewport;I!==void 0&&d.state.viewport(I)}}}class W extends V{constructor(){const t=W.SkyShader,a=new ta({name:t.name,uniforms:U.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:fa,depthWrite:!1});super(new la(1,1,1),a),this.isSky=!0}}W.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new p},up:{value:new p(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const Ra={__name:"threejs-water.html",setup(O,{expose:t}){t();let a;const l=L(),P=()=>{l.value.offsetWidth||(l.value.offsetWidth=800);const n=new K,i=new N(90,2,.1,1e3);i.position.set(5,5,5),n.add(i),new aa().loadAsync("./assets/textures/hdr/050.hdr").then(s=>{s.mapping=ha,n.background=s,n.environment=s}),new sa().load("./assets/models/yugang.glb",s=>{console.log(s);const v=s.scene.children[0];v.material.side=ga;const B=s.scene.children[1].geometry,f=new na(B,{color:"#ffffff",scale:1,flowDirection:new wa(1,1),textureHeight:1024,textureWidth:1024});n.add(f),n.add(v)});const M=new Ca(16777215);M.intensity=10,n.add(M);const u=new xa(16777215,.5);n.add(u);const o=new X({alpha:!0,antialias:!0});o.outputEncoding=void 0,o.toneMapping=Q,o.setSize(l.value.offsetWidth,l.value.offsetWidth/2),window.addEventListener("resize",()=>{o.setSize(l.value.offsetWidth,l.value.offsetWidth/2),o.setPixelRatio(window.devicePixelRatio)}),l.value.appendChild(o.domElement);const g=new H(i,o.domElement);g.enableDamping=!0;const w=new Ta;function b(s){w.getElapsedTime(),requestAnimationFrame(b),o.render(n,i)}b()},y=L(),k=()=>{const n=new X;n.setSize(y.value.offsetWidth,y.value.offsetWidth/2),n.toneMapping=Q,y.value.appendChild(n.domElement);const i=new K,A=new N(55,2,1,2e4);A.position.set(30,30,100);const D=new p,M=new Ea(1e4,1e4),u=new ea(M,{textureWidth:512,textureHeight:512,waterNormals:new Aa().load("./assets/textures/water/waternormals.jpg",function(e){e.wrapS=e.wrapT=Ba}),sunDirection:new p,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:i.fog!==void 0});u.rotation.x=-Math.PI/2,i.add(u);const o=new W;o.scale.setScalar(1e4),i.add(o);const g=o.material.uniforms;g.turbidity.value=10,g.rayleigh.value=2,g.mieCoefficient.value=.005,g.mieDirectionalG.value=.8;const w={elevation:2,azimuth:180},b=new Sa(n);let s;function v(){const e=Y.degToRad(90-w.elevation),d=Y.degToRad(w.azimuth);D.setFromSphericalCoords(1,e,d),o.material.uniforms.sunPosition.value.copy(D),u.material.uniforms.sunDirection.value.copy(D).normalize(),s!==void 0&&s.dispose(),s=b.fromScene(o),i.environment=s.texture}v();const B=new la(30,30,30),f=new Da({roughness:0}),h=new V(B,f);i.add(h);const c=new H(A,n.domElement);c.maxPolarAngle=Math.PI*.495,c.target.set(0,10,0),c.minDistance=40,c.maxDistance=200,c.update();const F=new a.GUI;y.value.appendChild(F.domElement),F.domElement.style.position="absolute",F.domElement.style.top="0px",F.domElement.style.right="0px";const C=F.addFolder("Sky");C.add(w,"elevation",0,90,.1).onChange(v),C.add(w,"azimuth",-180,180,.1).onChange(v),C.open();const x=u.material.uniforms,E=F.addFolder("Water");E.add(x.distortionScale,"value",0,8,.1).name("distortionScale"),E.add(x.size,"value",.1,10,.1).name("size"),E.open(),window.addEventListener("resize",r);function r(){A.updateProjectionMatrix(),n.setSize(y.offsetWidth,y.offsetWidth/2)}function _(){requestAnimationFrame(_),T()}function T(){const e=performance.now()*.001;h.position.y=Math.sin(e)*20+5,h.rotation.x=e*.5,h.rotation.z=e*.51,u.material.uniforms.time.value+=1/60,n.render(i,A)}_()};Z(async()=>{a=await Fa(()=>import("./dat.gui.module-DNo137I2.js"),[]),P(),k()});const j={get dat(){return a},set dat(n){a=n},waterRef:l,init:P,oceanRef:y,initOcean:k,ref:L,onMounted:Z,get THREE(){return Ma},get OrbitControls(){return H},get RGBELoader(){return aa},get GLTFLoader(){return sa},get Water2(){return na},get Water(){return ea},get Sky(){return W}};return Object.defineProperty(j,"__isScriptSetup",{enumerable:!1,value:!0}),j}},Pa={ref:"waterRef"},_a={ref:"oceanRef",class:"ocean"};function Wa(O,t,a,l,P,y){return ba(),ia("div",null,[t[0]||(t[0]=q(`<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-602a9bcd><pre class="shiki dracula vp-code" data-v-602a9bcd><code data-v-602a9bcd><span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>import</span><span style="color:#F8F8F2;" data-v-602a9bcd> { Water } </span><span style="color:#FF79C6;" data-v-602a9bcd>from</span><span style="color:#E9F284;" data-v-602a9bcd> &quot;</span><span style="color:#F1FA8C;" data-v-602a9bcd>three/examples/jsm/objects/Water2.js</span><span style="color:#E9F284;" data-v-602a9bcd>&quot;</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>// 创建用于水面的平面几何体</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> waterGeometry </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-602a9bcd>(</span><span style="color:#BD93F9;" data-v-602a9bcd>10000</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#BD93F9;" data-v-602a9bcd>10000</span><span style="color:#F8F8F2;" data-v-602a9bcd>);</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>// 创建 Water 对象所需的选项</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> waterOptions </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> {</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  color</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#E9F284;" data-v-602a9bcd> &#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>#abcdef</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 水体颜色</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  scale</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 4</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 波浪大小</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  flowDirection</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>Vector2</span><span style="color:#F8F8F2;" data-v-602a9bcd>(</span><span style="color:#BD93F9;" data-v-602a9bcd>1</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#BD93F9;" data-v-602a9bcd>1</span><span style="color:#F8F8F2;" data-v-602a9bcd>), </span><span style="color:#6272A4;" data-v-602a9bcd>// 水流方向</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  textureWidth</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 1024</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 纹理宽度</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  textureHeight</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 1024</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 纹理高度</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  normalMap0</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#F8F8F2;" data-v-602a9bcd> normalTexture, </span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  normalMapUrl0</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#E9F284;" data-v-602a9bcd> &#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 这里也可以直接将贴图赋值给 normalMap0</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  envMap</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#F8F8F2;" data-v-602a9bcd> cubeRenderTarget.texture, </span><span style="color:#6272A4;" data-v-602a9bcd>// 反射天空盒的立方体纹理</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  receiveShadow</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> true</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 是否接收阴影</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  distortionScale</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 3.7</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#6272A4;" data-v-602a9bcd>// 扭曲效果的大小</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  fog</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#F8F8F2;" data-v-602a9bcd> scene.fog </span><span style="color:#FF79C6;" data-v-602a9bcd>!==</span><span style="color:#BD93F9;" data-v-602a9bcd> undefined</span><span style="color:#6272A4;" data-v-602a9bcd> // 是否启用雾效果 </span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>};</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>// 创建 Water 对象</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> water </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>Water</span><span style="color:#F8F8F2;" data-v-602a9bcd>(waterGeometry, waterOptions);</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>// 将 Water 对象添加到场景中</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>scene.</span><span style="color:#50FA7B;" data-v-602a9bcd>add</span><span style="color:#F8F8F2;" data-v-602a9bcd>(water);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-602a9bcd><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div></div></div>`,1)),S("div",Pa,null,512),t[1]||(t[1]=q(`<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-602a9bcd><pre class="shiki dracula vp-code" data-v-602a9bcd><code data-v-602a9bcd><span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>import</span><span style="color:#F8F8F2;" data-v-602a9bcd> { Water } </span><span style="color:#FF79C6;" data-v-602a9bcd>from</span><span style="color:#E9F284;" data-v-602a9bcd> &#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>three/addons/objects/Water.js</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> waterGeometry </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-602a9bcd>( </span><span style="color:#BD93F9;" data-v-602a9bcd>10000</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#BD93F9;" data-v-602a9bcd>10000</span><span style="color:#F8F8F2;" data-v-602a9bcd> );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>water </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#50FA7B;" data-v-602a9bcd> Water</span><span style="color:#F8F8F2;" data-v-602a9bcd>(</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> waterGeometry,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> {</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  textureWidth</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 512</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  textureHeight</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 512</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  waterNormals</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>TextureLoader</span><span style="color:#F8F8F2;" data-v-602a9bcd>().</span><span style="color:#50FA7B;" data-v-602a9bcd>load</span><span style="color:#F8F8F2;" data-v-602a9bcd>( </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd>, </span><span style="color:#FF79C6;" data-v-602a9bcd>function</span><span style="color:#F8F8F2;" data-v-602a9bcd> ( </span><span style="color:#FFB86C;font-style:italic;" data-v-602a9bcd>texture</span><span style="color:#F8F8F2;" data-v-602a9bcd> ) {</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>   texture.wrapS </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> texture.wrapT </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.RepeatWrapping;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  } ),</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  sunDirection</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>Vector3</span><span style="color:#F8F8F2;" data-v-602a9bcd>(),</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  sunColor</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 0xffffff</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  waterColor</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 0x001e0f</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  distortionScale</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 3.7</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  fog</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#F8F8F2;" data-v-602a9bcd> scene.fog </span><span style="color:#FF79C6;" data-v-602a9bcd>!==</span><span style="color:#BD93F9;" data-v-602a9bcd> undefined</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> }</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>);</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>water.rotation.x </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;" data-v-602a9bcd> -</span><span style="color:#F8F8F2;" data-v-602a9bcd> Math.</span><span style="color:#BD93F9;" data-v-602a9bcd>PI</span><span style="color:#FF79C6;" data-v-602a9bcd> /</span><span style="color:#BD93F9;" data-v-602a9bcd>2</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>function</span><span style="color:#50FA7B;" data-v-602a9bcd> render</span><span style="color:#F8F8F2;" data-v-602a9bcd>(){</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>  water.material.uniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>time</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value </span><span style="color:#FF79C6;" data-v-602a9bcd>+=</span><span style="color:#BD93F9;" data-v-602a9bcd> 1.0</span><span style="color:#FF79C6;" data-v-602a9bcd> /</span><span style="color:#BD93F9;" data-v-602a9bcd> 60.0</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>}</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>// 落日</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>import</span><span style="color:#F8F8F2;" data-v-602a9bcd> { Sky } </span><span style="color:#FF79C6;" data-v-602a9bcd>from</span><span style="color:#E9F284;" data-v-602a9bcd> &#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>three/addons/objects/Sky.js</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>sun </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>Vector3</span><span style="color:#F8F8F2;" data-v-602a9bcd>();</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> sky </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#50FA7B;" data-v-602a9bcd> Sky</span><span style="color:#F8F8F2;" data-v-602a9bcd>();</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>sky.scale.</span><span style="color:#50FA7B;" data-v-602a9bcd>setScalar</span><span style="color:#F8F8F2;" data-v-602a9bcd>( </span><span style="color:#BD93F9;" data-v-602a9bcd>10000</span><span style="color:#F8F8F2;" data-v-602a9bcd> );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>scene.</span><span style="color:#50FA7B;" data-v-602a9bcd>add</span><span style="color:#F8F8F2;" data-v-602a9bcd>( sky );</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> skyUniforms </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> sky.material.unifor</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>skyUniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>turbidity</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> 10</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>skyUniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>rayleigh</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> 2</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>skyUniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>mieCoefficient</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> 0.005</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>skyUniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>mieDirectionalG</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> 0.8</span><span style="color:#F8F8F2;" data-v-602a9bcd>;</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>/*</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>创建了一个预计算辐射度环境贴图（pre-computed radiance environment map，PMREM）生成器。</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>PMREMGenerator 是 Three.js 物体材质中用于实现基于物理的渲染（PBR）的重要组件之一。</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>在 Three.js 中，PBR 材质需要使用辐射度环境贴图来提供场景的照明信息，</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>而预计算辐射度环境贴图是一种预先计算和缓存辐射度环境贴图的技术，可以提高实时渲染的效率和质量。</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>通过传递渲染器对象作为参数，PMREMGenerator 可以根据当前场景和光照计算出辐射度环境贴图，</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>并将其缓存在内存中，方便后续使用。在使用 PBR 材质时，</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>我们可以通过调用 PMREMGenerator 的相关方法来获取需要的辐射度环境贴图。</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>*/</span><span style="color:#F8F8F2;" data-v-602a9bcd> </span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> pmremGenerator </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-602a9bcd> new</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.</span><span style="color:#50FA7B;" data-v-602a9bcd>PMREMGenerator</span><span style="color:#F8F8F2;" data-v-602a9bcd>( renderer );</span></span>
<span class="line" data-v-602a9bcd></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>const</span><span style="color:#F8F8F2;" data-v-602a9bcd> parameters </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> {</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> elevation</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 2</span><span style="color:#F8F8F2;" data-v-602a9bcd>,</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> azimuth</span><span style="color:#FF79C6;" data-v-602a9bcd>:</span><span style="color:#BD93F9;" data-v-602a9bcd> 180</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>};</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>let</span><span style="color:#F8F8F2;" data-v-602a9bcd> renderTarget;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>//根据当前的太阳方位和高度来更新天空和水面的着色，使其看起来仿佛是在现实世界中受到了真实的自然光照射。</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd>function</span><span style="color:#50FA7B;" data-v-602a9bcd> updateSun</span><span style="color:#F8F8F2;" data-v-602a9bcd>() {</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  //将 phi 和 theta 转换为弧度制</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd> const</span><span style="color:#F8F8F2;" data-v-602a9bcd> phi </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.MathUtils.</span><span style="color:#50FA7B;" data-v-602a9bcd>degToRad</span><span style="color:#F8F8F2;" data-v-602a9bcd>( </span><span style="color:#BD93F9;" data-v-602a9bcd>90</span><span style="color:#FF79C6;" data-v-602a9bcd> -</span><span style="color:#F8F8F2;" data-v-602a9bcd> parameters.elevation );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd> const</span><span style="color:#F8F8F2;" data-v-602a9bcd> theta </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#BD93F9;" data-v-602a9bcd> THREE</span><span style="color:#F8F8F2;" data-v-602a9bcd>.MathUtils.</span><span style="color:#50FA7B;" data-v-602a9bcd>degToRad</span><span style="color:#F8F8F2;" data-v-602a9bcd>( parameters.azimuth );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 计算太阳位置</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> sun.</span><span style="color:#50FA7B;" data-v-602a9bcd>setFromSphericalCoords</span><span style="color:#F8F8F2;" data-v-602a9bcd>( </span><span style="color:#BD93F9;" data-v-602a9bcd>1</span><span style="color:#F8F8F2;" data-v-602a9bcd>, phi, theta );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 将太阳位置应用到天空和水面</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> sky.material.uniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>sunPosition</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value.</span><span style="color:#50FA7B;" data-v-602a9bcd>copy</span><span style="color:#F8F8F2;" data-v-602a9bcd>( sun );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> water.material.uniforms[ </span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F1FA8C;" data-v-602a9bcd>sunDirection</span><span style="color:#E9F284;" data-v-602a9bcd>&#39;</span><span style="color:#F8F8F2;" data-v-602a9bcd> ].value.</span><span style="color:#50FA7B;" data-v-602a9bcd>copy</span><span style="color:#F8F8F2;" data-v-602a9bcd>( sun ).</span><span style="color:#50FA7B;" data-v-602a9bcd>normalize</span><span style="color:#F8F8F2;" data-v-602a9bcd>();</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  // 释放之前的渲染</span></span>
<span class="line" data-v-602a9bcd><span style="color:#FF79C6;" data-v-602a9bcd> if</span><span style="color:#F8F8F2;" data-v-602a9bcd> ( renderTarget </span><span style="color:#FF79C6;" data-v-602a9bcd>!==</span><span style="color:#BD93F9;" data-v-602a9bcd> undefined</span><span style="color:#F8F8F2;" data-v-602a9bcd> ) renderTarget.</span><span style="color:#50FA7B;" data-v-602a9bcd>dispose</span><span style="color:#F8F8F2;" data-v-602a9bcd>();</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  //使用 fromScene 方法从 sky 中生成一个新的渲染目标对象。</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  //这个渲染目标对象是通过预计算辐射度环境贴图生成器 pmremGenerator 计算出来的</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> renderTarget </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> pmremGenerator.</span><span style="color:#50FA7B;" data-v-602a9bcd>fromScene</span><span style="color:#F8F8F2;" data-v-602a9bcd>( sky );</span></span>
<span class="line" data-v-602a9bcd><span style="color:#6272A4;" data-v-602a9bcd>  //将渲染目标的材质设置为场景的环境贴图。</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd> scene.environment </span><span style="color:#FF79C6;" data-v-602a9bcd>=</span><span style="color:#F8F8F2;" data-v-602a9bcd> renderTarget.texture;</span></span>
<span class="line" data-v-602a9bcd><span style="color:#F8F8F2;" data-v-602a9bcd>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-602a9bcd><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div><div class="line-number" data-v-602a9bcd></div></div></div>`,1)),S("div",_a,null,512),t[2]||(t[2]=S("h1",{id:"参考",tabindex:"-1"},[S("a",{class:"header-anchor",href:"#参考"},[S("span",null,"参考")])],-1)),t[3]||(t[3]=S("p",null,[va("参考："),S("a",{href:"https://threejs.org/",target:"_blank",rel:"noopener noreferrer"},"https://threejs.org/")],-1))])}const Na=pa(Ra,[["render",Wa],["__scopeId","data-v-602a9bcd"],["__file","threejs-water.html.vue"]]),Ua=JSON.parse(`{"path":"/threejs/threejs-water.html","title":"ThreeJS中的水","lang":"en-US","frontmatter":{"title":"ThreeJS中的水","category":["ThreeJS"],"date":"2022-02-22T00:00:00.000Z","description":"参考 参考：https://threejs.org/","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/threejs/threejs-water.html"}],["meta",{"property":"og:title","content":"ThreeJS中的水"}],["meta",{"property":"og:description","content":"参考 参考：https://threejs.org/"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-11-10T14:15:12.000Z"}],["meta",{"property":"article:published_time","content":"2022-02-22T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-10T14:15:12.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ThreeJS中的水\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-02-22T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-10T14:15:12.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"git":{"createdTime":1681886614000,"updatedTime":1731248112000,"contributors":[{"name":"卢祥","username":"卢祥","email":"example@qq.com","commits":2,"url":"https://github.com/卢祥"},{"name":"luxiag","username":"luxiag","email":"luxiag@qq.com","commits":5,"url":"https://github.com/luxiag"}]},"readingTime":{"minutes":4.51,"words":1354},"filePathRelative":"threejs/threejs-water.md","localizedDate":"February 22, 2022","excerpt":"<div class=\\"language-js line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"js\\" data-title=\\"js\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#FF79C6\\">import</span><span style=\\"color:#F8F8F2\\"> { Water } </span><span style=\\"color:#FF79C6\\">from</span><span style=\\"color:#E9F284\\"> \\"</span><span style=\\"color:#F1FA8C\\">three/examples/jsm/objects/Water2.js</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建用于水面的平面几何体</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> waterGeometry </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">PlaneGeometry</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">10000</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#BD93F9\\">10000</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建 Water 对象所需的选项</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> waterOptions </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  color</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#E9F284\\"> '</span><span style=\\"color:#F1FA8C\\">#abcdef</span><span style=\\"color:#E9F284\\">'</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 水体颜色</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  scale</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 4</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 波浪大小</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  flowDirection</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">Vector2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">), </span><span style=\\"color:#6272A4\\">// 水流方向</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  textureWidth</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 1024</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 纹理宽度</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  textureHeight</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 1024</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 纹理高度</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  normalMap0</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> normalTexture, </span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  normalMapUrl0</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#E9F284\\"> '</span><span style=\\"color:#F1FA8C\\">textures/waternormals.jpg</span><span style=\\"color:#E9F284\\">'</span><span style=\\"color:#F8F8F2\\">,</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 这里也可以直接将贴图赋值给 normalMap0</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  envMap</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> cubeRenderTarget.texture, </span><span style=\\"color:#6272A4\\">// 反射天空盒的立方体纹理</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  receiveShadow</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> true</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 是否接收阴影</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  distortionScale</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 3.7</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 扭曲效果的大小</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  fog</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> scene.fog </span><span style=\\"color:#FF79C6\\">!==</span><span style=\\"color:#BD93F9\\"> undefined</span><span style=\\"color:#6272A4\\"> // 是否启用雾效果 </span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">};</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建 Water 对象</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> water </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">Water</span><span style=\\"color:#F8F8F2\\">(waterGeometry, waterOptions);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 将 Water 对象添加到场景中</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">scene.</span><span style=\\"color:#50FA7B\\">add</span><span style=\\"color:#F8F8F2\\">(water);</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{Na as comp,Ua as data};
