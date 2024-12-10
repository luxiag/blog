import{_ as pa,h as L,i as q,q as ia,c as da,b as Z,d as S,e as va,o as Fa}from"./app-C453UOYb.js";import{p as V,V as p,i as z,aj as ba,P as ya,k as G,aD as J,m as N,aE as ua,aF as U,aG as $,n as ta,aJ as ma,aI as la,l as K,as as ha,o as ga,b as wa,aH as Ca,z as xa,W as X,at as Q,q as Ea,J as Aa,X as Ba,aR as Sa,$ as Da,r as Ma,M as Y,s as Ta}from"./three.module-BzA_QsZm.js";import{O as H}from"./OrbitControls-DTSS7XTZ.js";import{R as aa}from"./RGBELoader-DZo1sXki.js";import{G as sa}from"./GLTFLoader-CQSwUyoN.js";import{W as na}from"./Water2-Bv9AerBY.js";class ea extends V{constructor(t,a={}){super(t),this.isWater=!0;const l=this,P=a.textureWidth!==void 0?a.textureWidth:512,b=a.textureHeight!==void 0?a.textureHeight:512,k=a.clipBias!==void 0?a.clipBias:0,j=a.alpha!==void 0?a.alpha:1,n=a.time!==void 0?a.time:0,i=a.waterNormals!==void 0?a.waterNormals:null,A=a.sunDirection!==void 0?a.sunDirection:new p(.70707,.70707,0),D=new z(a.sunColor!==void 0?a.sunColor:16777215),M=new z(a.waterColor!==void 0?a.waterColor:8355711),y=a.eye!==void 0?a.eye:new p(0,0,0),o=a.distortionScale!==void 0?a.distortionScale:20,g=a.side!==void 0?a.side:ba,w=a.fog!==void 0?a.fog:!1,F=new ya,s=new p,d=new p,B=new p,m=new G,h=new p(0,0,-1),r=new J,v=new p,C=new p,x=new J,E=new G,f=new N,_=new ua(P,b),T={name:"MirrorShader",uniforms:U.merge([$.fog,$.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new G},sunColor:{value:new z(8355711)},sunDirection:{value:new p(.70707,.70707,0)},eye:{value:new p},waterColor:{value:new z(5592405)}}]),vertexShader:`
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
				}`},e=new ta({name:T.name,uniforms:U.clone(T.uniforms),vertexShader:T.vertexShader,fragmentShader:T.fragmentShader,lights:!0,side:g,fog:w});e.uniforms.mirrorSampler.value=_.texture,e.uniforms.textureMatrix.value=E,e.uniforms.alpha.value=j,e.uniforms.time.value=n,e.uniforms.normalSampler.value=i,e.uniforms.sunColor.value=D,e.uniforms.waterColor.value=M,e.uniforms.sunDirection.value=A,e.uniforms.distortionScale.value=o,e.uniforms.eye.value=y,l.material=e,l.onBeforeRender=function(c,oa,R){if(d.setFromMatrixPosition(l.matrixWorld),B.setFromMatrixPosition(R.matrixWorld),m.extractRotation(l.matrixWorld),s.set(0,0,1),s.applyMatrix4(m),v.subVectors(d,B),v.dot(s)>0)return;v.reflect(s).negate(),v.add(d),m.extractRotation(R.matrixWorld),h.set(0,0,-1),h.applyMatrix4(m),h.add(B),C.subVectors(d,h),C.reflect(s).negate(),C.add(d),f.position.copy(v),f.up.set(0,1,0),f.up.applyMatrix4(m),f.up.reflect(s),f.lookAt(C),f.far=R.far,f.updateMatrixWorld(),f.projectionMatrix.copy(R.projectionMatrix),E.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),E.multiply(f.projectionMatrix),E.multiply(f.matrixWorldInverse),F.setFromNormalAndCoplanarPoint(s,d),F.applyMatrix4(f.matrixWorldInverse),r.set(F.normal.x,F.normal.y,F.normal.z,F.constant);const u=f.projectionMatrix;x.x=(Math.sign(r.x)+u.elements[8])/u.elements[0],x.y=(Math.sign(r.y)+u.elements[9])/u.elements[5],x.z=-1,x.w=(1+u.elements[10])/u.elements[14],r.multiplyScalar(2/r.dot(x)),u.elements[2]=r.x,u.elements[6]=r.y,u.elements[10]=r.z+1-k,u.elements[14]=r.w,y.setFromMatrixPosition(R.matrixWorld);const ca=c.getRenderTarget(),ra=c.xr.enabled,fa=c.shadowMap.autoUpdate;l.visible=!1,c.xr.enabled=!1,c.shadowMap.autoUpdate=!1,c.setRenderTarget(_),c.state.buffers.depth.setMask(!0),c.autoClear===!1&&c.clear(),c.render(oa,f),l.visible=!0,c.xr.enabled=ra,c.shadowMap.autoUpdate=fa,c.setRenderTarget(ca);const I=R.viewport;I!==void 0&&c.state.viewport(I)}}}class W extends V{constructor(){const t=W.SkyShader,a=new ta({name:t.name,uniforms:U.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:ma,depthWrite:!1});super(new la(1,1,1),a),this.isSky=!0}}W.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new p},up:{value:new p(0,1,0)}},vertexShader:`
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

		}`};const Ra={__name:"threejs-water.html",setup(O,{expose:t}){t();let a;const l=L(),P=()=>{l.value.offsetWidth||(l.value.offsetWidth=800);const n=new K,i=new N(90,2,.1,1e3);i.position.set(5,5,5),n.add(i),new aa().loadAsync("./assets/textures/hdr/050.hdr").then(s=>{s.mapping=ha,n.background=s,n.environment=s}),new sa().load("./assets/models/yugang.glb",s=>{console.log(s);const d=s.scene.children[0];d.material.side=ga;const B=s.scene.children[1].geometry,m=new na(B,{color:"#ffffff",scale:1,flowDirection:new wa(1,1),textureHeight:1024,textureWidth:1024});n.add(m),n.add(d)});const M=new Ca(16777215);M.intensity=10,n.add(M);const y=new xa(16777215,.5);n.add(y);const o=new X({alpha:!0,antialias:!0});o.outputEncoding=void 0,o.toneMapping=Q,o.setSize(l.value.offsetWidth,l.value.offsetWidth/2),window.addEventListener("resize",()=>{o.setSize(l.value.offsetWidth,l.value.offsetWidth/2),o.setPixelRatio(window.devicePixelRatio)}),l.value.appendChild(o.domElement);const g=new H(i,o.domElement);g.enableDamping=!0;const w=new Ta;function F(s){w.getElapsedTime(),requestAnimationFrame(F),o.render(n,i)}F()},b=L(),k=()=>{const n=new X;n.setSize(b.value.offsetWidth,b.value.offsetWidth/2),n.toneMapping=Q,b.value.appendChild(n.domElement);const i=new K,A=new N(55,2,1,2e4);A.position.set(30,30,100);const D=new p,M=new Ea(1e4,1e4),y=new ea(M,{textureWidth:512,textureHeight:512,waterNormals:new Aa().load("./assets/textures/water/waternormals.jpg",function(e){e.wrapS=e.wrapT=Ba}),sunDirection:new p,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:i.fog!==void 0});y.rotation.x=-Math.PI/2,i.add(y);const o=new W;o.scale.setScalar(1e4),i.add(o);const g=o.material.uniforms;g.turbidity.value=10,g.rayleigh.value=2,g.mieCoefficient.value=.005,g.mieDirectionalG.value=.8;const w={elevation:2,azimuth:180},F=new Sa(n);let s;function d(){const e=Y.degToRad(90-w.elevation),c=Y.degToRad(w.azimuth);D.setFromSphericalCoords(1,e,c),o.material.uniforms.sunPosition.value.copy(D),y.material.uniforms.sunDirection.value.copy(D).normalize(),s!==void 0&&s.dispose(),s=F.fromScene(o),i.environment=s.texture}d();const B=new la(30,30,30),m=new Da({roughness:0}),h=new V(B,m);i.add(h);const r=new H(A,n.domElement);r.maxPolarAngle=Math.PI*.495,r.target.set(0,10,0),r.minDistance=40,r.maxDistance=200,r.update();const v=new a.GUI;b.value.appendChild(v.domElement),v.domElement.style.position="absolute",v.domElement.style.top="0px",v.domElement.style.right="0px";const C=v.addFolder("Sky");C.add(w,"elevation",0,90,.1).onChange(d),C.add(w,"azimuth",-180,180,.1).onChange(d),C.open();const x=y.material.uniforms,E=v.addFolder("Water");E.add(x.distortionScale,"value",0,8,.1).name("distortionScale"),E.add(x.size,"value",.1,10,.1).name("size"),E.open(),window.addEventListener("resize",f);function f(){A.updateProjectionMatrix(),n.setSize(b.offsetWidth,b.offsetWidth/2)}function _(){requestAnimationFrame(_),T()}function T(){const e=performance.now()*.001;h.position.y=Math.sin(e)*20+5,h.rotation.x=e*.5,h.rotation.z=e*.51,y.material.uniforms.time.value+=1/60,n.render(i,A)}_()};q(async()=>{a=await ia(()=>import("./dat.gui.module-DNo137I2.js"),[]),P(),k()});const j={get dat(){return a},set dat(n){a=n},waterRef:l,init:P,oceanRef:b,initOcean:k,ref:L,onMounted:q,get THREE(){return Ma},get OrbitControls(){return H},get RGBELoader(){return aa},get GLTFLoader(){return sa},get Water2(){return na},get Water(){return ea},get Sky(){return W}};return Object.defineProperty(j,"__isScriptSetup",{enumerable:!1,value:!0}),j}},Pa={ref:"waterRef"},_a={ref:"oceanRef",class:"ocean"};function Wa(O,t,a,l,P,b){return Fa(),da("div",null,[t[0]||(t[0]=Z(`<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-5cb665ff><pre class="shiki dracula vp-code" data-v-5cb665ff><code data-v-5cb665ff><span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>import</span><span style="color:#F8F8F2;" data-v-5cb665ff> { Water } </span><span style="color:#FF79C6;" data-v-5cb665ff>from</span><span style="color:#E9F284;" data-v-5cb665ff> &quot;</span><span style="color:#F1FA8C;" data-v-5cb665ff>three/examples/jsm/objects/Water2.js</span><span style="color:#E9F284;" data-v-5cb665ff>&quot;</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>// 创建用于水面的平面几何体</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> waterGeometry </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-5cb665ff>(</span><span style="color:#BD93F9;" data-v-5cb665ff>10000</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#BD93F9;" data-v-5cb665ff>10000</span><span style="color:#F8F8F2;" data-v-5cb665ff>);</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>// 创建 Water 对象所需的选项</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> waterOptions </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> {</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  color</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#E9F284;" data-v-5cb665ff> &#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>#abcdef</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 水体颜色</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  scale</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 4</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 波浪大小</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  flowDirection</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>Vector2</span><span style="color:#F8F8F2;" data-v-5cb665ff>(</span><span style="color:#BD93F9;" data-v-5cb665ff>1</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#BD93F9;" data-v-5cb665ff>1</span><span style="color:#F8F8F2;" data-v-5cb665ff>), </span><span style="color:#6272A4;" data-v-5cb665ff>// 水流方向</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  textureWidth</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 1024</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 纹理宽度</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  textureHeight</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 1024</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 纹理高度</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  normalMap0</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#F8F8F2;" data-v-5cb665ff> normalTexture, </span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  normalMapUrl0</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#E9F284;" data-v-5cb665ff> &#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 这里也可以直接将贴图赋值给 normalMap0</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  envMap</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#F8F8F2;" data-v-5cb665ff> cubeRenderTarget.texture, </span><span style="color:#6272A4;" data-v-5cb665ff>// 反射天空盒的立方体纹理</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  receiveShadow</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> true</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 是否接收阴影</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  distortionScale</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 3.7</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#6272A4;" data-v-5cb665ff>// 扭曲效果的大小</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  fog</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#F8F8F2;" data-v-5cb665ff> scene.fog </span><span style="color:#FF79C6;" data-v-5cb665ff>!==</span><span style="color:#BD93F9;" data-v-5cb665ff> undefined</span><span style="color:#6272A4;" data-v-5cb665ff> // 是否启用雾效果 </span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>};</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>// 创建 Water 对象</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> water </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>Water</span><span style="color:#F8F8F2;" data-v-5cb665ff>(waterGeometry, waterOptions);</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>// 将 Water 对象添加到场景中</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>scene.</span><span style="color:#50FA7B;" data-v-5cb665ff>add</span><span style="color:#F8F8F2;" data-v-5cb665ff>(water);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-5cb665ff><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div></div></div>`,1)),S("div",Pa,null,512),t[1]||(t[1]=Z(`<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-5cb665ff><pre class="shiki dracula vp-code" data-v-5cb665ff><code data-v-5cb665ff><span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>import</span><span style="color:#F8F8F2;" data-v-5cb665ff> { Water } </span><span style="color:#FF79C6;" data-v-5cb665ff>from</span><span style="color:#E9F284;" data-v-5cb665ff> &#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>three/addons/objects/Water.js</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> waterGeometry </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-5cb665ff>( </span><span style="color:#BD93F9;" data-v-5cb665ff>10000</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#BD93F9;" data-v-5cb665ff>10000</span><span style="color:#F8F8F2;" data-v-5cb665ff> );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>water </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#50FA7B;" data-v-5cb665ff> Water</span><span style="color:#F8F8F2;" data-v-5cb665ff>(</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> waterGeometry,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> {</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  textureWidth</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 512</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  textureHeight</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 512</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  waterNormals</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>TextureLoader</span><span style="color:#F8F8F2;" data-v-5cb665ff>().</span><span style="color:#50FA7B;" data-v-5cb665ff>load</span><span style="color:#F8F8F2;" data-v-5cb665ff>( </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff>, </span><span style="color:#FF79C6;" data-v-5cb665ff>function</span><span style="color:#F8F8F2;" data-v-5cb665ff> ( </span><span style="color:#FFB86C;font-style:italic;" data-v-5cb665ff>texture</span><span style="color:#F8F8F2;" data-v-5cb665ff> ) {</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>   texture.wrapS </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> texture.wrapT </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.RepeatWrapping;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  } ),</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  sunDirection</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>Vector3</span><span style="color:#F8F8F2;" data-v-5cb665ff>(),</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  sunColor</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 0xffffff</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  waterColor</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 0x001e0f</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  distortionScale</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 3.7</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  fog</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#F8F8F2;" data-v-5cb665ff> scene.fog </span><span style="color:#FF79C6;" data-v-5cb665ff>!==</span><span style="color:#BD93F9;" data-v-5cb665ff> undefined</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> }</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>);</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>water.rotation.x </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;" data-v-5cb665ff> -</span><span style="color:#F8F8F2;" data-v-5cb665ff> Math.</span><span style="color:#BD93F9;" data-v-5cb665ff>PI</span><span style="color:#FF79C6;" data-v-5cb665ff> /</span><span style="color:#BD93F9;" data-v-5cb665ff>2</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>function</span><span style="color:#50FA7B;" data-v-5cb665ff> render</span><span style="color:#F8F8F2;" data-v-5cb665ff>(){</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>  water.material.uniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>time</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value </span><span style="color:#FF79C6;" data-v-5cb665ff>+=</span><span style="color:#BD93F9;" data-v-5cb665ff> 1.0</span><span style="color:#FF79C6;" data-v-5cb665ff> /</span><span style="color:#BD93F9;" data-v-5cb665ff> 60.0</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>}</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>// 落日</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>import</span><span style="color:#F8F8F2;" data-v-5cb665ff> { Sky } </span><span style="color:#FF79C6;" data-v-5cb665ff>from</span><span style="color:#E9F284;" data-v-5cb665ff> &#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>three/addons/objects/Sky.js</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>sun </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>Vector3</span><span style="color:#F8F8F2;" data-v-5cb665ff>();</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> sky </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#50FA7B;" data-v-5cb665ff> Sky</span><span style="color:#F8F8F2;" data-v-5cb665ff>();</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>sky.scale.</span><span style="color:#50FA7B;" data-v-5cb665ff>setScalar</span><span style="color:#F8F8F2;" data-v-5cb665ff>( </span><span style="color:#BD93F9;" data-v-5cb665ff>10000</span><span style="color:#F8F8F2;" data-v-5cb665ff> );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>scene.</span><span style="color:#50FA7B;" data-v-5cb665ff>add</span><span style="color:#F8F8F2;" data-v-5cb665ff>( sky );</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> skyUniforms </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> sky.material.unifor</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>skyUniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>turbidity</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> 10</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>skyUniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>rayleigh</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> 2</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>skyUniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>mieCoefficient</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> 0.005</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>skyUniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>mieDirectionalG</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> 0.8</span><span style="color:#F8F8F2;" data-v-5cb665ff>;</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>/*</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>创建了一个预计算辐射度环境贴图（pre-computed radiance environment map，PMREM）生成器。</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>PMREMGenerator 是 Three.js 物体材质中用于实现基于物理的渲染（PBR）的重要组件之一。</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>在 Three.js 中，PBR 材质需要使用辐射度环境贴图来提供场景的照明信息，</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>而预计算辐射度环境贴图是一种预先计算和缓存辐射度环境贴图的技术，可以提高实时渲染的效率和质量。</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>通过传递渲染器对象作为参数，PMREMGenerator 可以根据当前场景和光照计算出辐射度环境贴图，</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>并将其缓存在内存中，方便后续使用。在使用 PBR 材质时，</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>我们可以通过调用 PMREMGenerator 的相关方法来获取需要的辐射度环境贴图。</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>*/</span><span style="color:#F8F8F2;" data-v-5cb665ff> </span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> pmremGenerator </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-5cb665ff> new</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.</span><span style="color:#50FA7B;" data-v-5cb665ff>PMREMGenerator</span><span style="color:#F8F8F2;" data-v-5cb665ff>( renderer );</span></span>
<span class="line" data-v-5cb665ff></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>const</span><span style="color:#F8F8F2;" data-v-5cb665ff> parameters </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> {</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> elevation</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 2</span><span style="color:#F8F8F2;" data-v-5cb665ff>,</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> azimuth</span><span style="color:#FF79C6;" data-v-5cb665ff>:</span><span style="color:#BD93F9;" data-v-5cb665ff> 180</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>};</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>let</span><span style="color:#F8F8F2;" data-v-5cb665ff> renderTarget;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>//根据当前的太阳方位和高度来更新天空和水面的着色，使其看起来仿佛是在现实世界中受到了真实的自然光照射。</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff>function</span><span style="color:#50FA7B;" data-v-5cb665ff> updateSun</span><span style="color:#F8F8F2;" data-v-5cb665ff>() {</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  //将 phi 和 theta 转换为弧度制</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff> const</span><span style="color:#F8F8F2;" data-v-5cb665ff> phi </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.MathUtils.</span><span style="color:#50FA7B;" data-v-5cb665ff>degToRad</span><span style="color:#F8F8F2;" data-v-5cb665ff>( </span><span style="color:#BD93F9;" data-v-5cb665ff>90</span><span style="color:#FF79C6;" data-v-5cb665ff> -</span><span style="color:#F8F8F2;" data-v-5cb665ff> parameters.elevation );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff> const</span><span style="color:#F8F8F2;" data-v-5cb665ff> theta </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#BD93F9;" data-v-5cb665ff> THREE</span><span style="color:#F8F8F2;" data-v-5cb665ff>.MathUtils.</span><span style="color:#50FA7B;" data-v-5cb665ff>degToRad</span><span style="color:#F8F8F2;" data-v-5cb665ff>( parameters.azimuth );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 计算太阳位置</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> sun.</span><span style="color:#50FA7B;" data-v-5cb665ff>setFromSphericalCoords</span><span style="color:#F8F8F2;" data-v-5cb665ff>( </span><span style="color:#BD93F9;" data-v-5cb665ff>1</span><span style="color:#F8F8F2;" data-v-5cb665ff>, phi, theta );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 将太阳位置应用到天空和水面</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> sky.material.uniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>sunPosition</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value.</span><span style="color:#50FA7B;" data-v-5cb665ff>copy</span><span style="color:#F8F8F2;" data-v-5cb665ff>( sun );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> water.material.uniforms[ </span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F1FA8C;" data-v-5cb665ff>sunDirection</span><span style="color:#E9F284;" data-v-5cb665ff>&#39;</span><span style="color:#F8F8F2;" data-v-5cb665ff> ].value.</span><span style="color:#50FA7B;" data-v-5cb665ff>copy</span><span style="color:#F8F8F2;" data-v-5cb665ff>( sun ).</span><span style="color:#50FA7B;" data-v-5cb665ff>normalize</span><span style="color:#F8F8F2;" data-v-5cb665ff>();</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  // 释放之前的渲染</span></span>
<span class="line" data-v-5cb665ff><span style="color:#FF79C6;" data-v-5cb665ff> if</span><span style="color:#F8F8F2;" data-v-5cb665ff> ( renderTarget </span><span style="color:#FF79C6;" data-v-5cb665ff>!==</span><span style="color:#BD93F9;" data-v-5cb665ff> undefined</span><span style="color:#F8F8F2;" data-v-5cb665ff> ) renderTarget.</span><span style="color:#50FA7B;" data-v-5cb665ff>dispose</span><span style="color:#F8F8F2;" data-v-5cb665ff>();</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  //使用 fromScene 方法从 sky 中生成一个新的渲染目标对象。</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  //这个渲染目标对象是通过预计算辐射度环境贴图生成器 pmremGenerator 计算出来的</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> renderTarget </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> pmremGenerator.</span><span style="color:#50FA7B;" data-v-5cb665ff>fromScene</span><span style="color:#F8F8F2;" data-v-5cb665ff>( sky );</span></span>
<span class="line" data-v-5cb665ff><span style="color:#6272A4;" data-v-5cb665ff>  //将渲染目标的材质设置为场景的环境贴图。</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff> scene.environment </span><span style="color:#FF79C6;" data-v-5cb665ff>=</span><span style="color:#F8F8F2;" data-v-5cb665ff> renderTarget.texture;</span></span>
<span class="line" data-v-5cb665ff><span style="color:#F8F8F2;" data-v-5cb665ff>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-5cb665ff><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div><div class="line-number" data-v-5cb665ff></div></div></div>`,1)),S("div",_a,null,512),t[2]||(t[2]=S("h1",{id:"参考",tabindex:"-1"},[S("a",{class:"header-anchor",href:"#参考"},[S("span",null,"参考")])],-1)),t[3]||(t[3]=S("p",null,[va("参考："),S("a",{href:"https://threejs.org/",target:"_blank",rel:"noopener noreferrer"},"https://threejs.org/")],-1))])}const Na=pa(Ra,[["render",Wa],["__scopeId","data-v-5cb665ff"],["__file","threejs-water.html.vue"]]),Ua=JSON.parse(`{"path":"/threejs/threejs-water.html","title":"ThreeJS中的水","lang":"en-US","frontmatter":{"title":"ThreeJS中的水","category":["ThreeJS"],"date":"2022-02-22T00:00:00.000Z","description":"参考 参考：https://threejs.org/","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/threejs/threejs-water.html"}],["meta",{"property":"og:title","content":"ThreeJS中的水"}],["meta",{"property":"og:description","content":"参考 参考：https://threejs.org/"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-11-10T14:15:12.000Z"}],["meta",{"property":"article:published_time","content":"2022-02-22T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-10T14:15:12.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ThreeJS中的水\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-02-22T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-10T14:15:12.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[],"git":{"createdTime":1681886614000,"updatedTime":1731248112000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":5},{"name":"卢祥","email":"example@qq.com","commits":2}]},"readingTime":{"minutes":4.51,"words":1354},"filePathRelative":"threejs/threejs-water.md","localizedDate":"February 22, 2022","excerpt":"<div class=\\"language-js line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"js\\" data-title=\\"js\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#FF79C6\\">import</span><span style=\\"color:#F8F8F2\\"> { Water } </span><span style=\\"color:#FF79C6\\">from</span><span style=\\"color:#E9F284\\"> \\"</span><span style=\\"color:#F1FA8C\\">three/examples/jsm/objects/Water2.js</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建用于水面的平面几何体</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> waterGeometry </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">PlaneGeometry</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">10000</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#BD93F9\\">10000</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建 Water 对象所需的选项</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> waterOptions </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  color</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#E9F284\\"> '</span><span style=\\"color:#F1FA8C\\">#abcdef</span><span style=\\"color:#E9F284\\">'</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 水体颜色</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  scale</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 4</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 波浪大小</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  flowDirection</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">Vector2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#BD93F9\\">1</span><span style=\\"color:#F8F8F2\\">), </span><span style=\\"color:#6272A4\\">// 水流方向</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  textureWidth</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 1024</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 纹理宽度</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  textureHeight</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 1024</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 纹理高度</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  normalMap0</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> normalTexture, </span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  normalMapUrl0</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#E9F284\\"> '</span><span style=\\"color:#F1FA8C\\">textures/waternormals.jpg</span><span style=\\"color:#E9F284\\">'</span><span style=\\"color:#F8F8F2\\">,</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // 这里也可以直接将贴图赋值给 normalMap0</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  envMap</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> cubeRenderTarget.texture, </span><span style=\\"color:#6272A4\\">// 反射天空盒的立方体纹理</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  receiveShadow</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> true</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 是否接收阴影</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  distortionScale</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#BD93F9\\"> 3.7</span><span style=\\"color:#F8F8F2\\">, </span><span style=\\"color:#6272A4\\">// 扭曲效果的大小</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  fog</span><span style=\\"color:#FF79C6\\">:</span><span style=\\"color:#F8F8F2\\"> scene.fog </span><span style=\\"color:#FF79C6\\">!==</span><span style=\\"color:#BD93F9\\"> undefined</span><span style=\\"color:#6272A4\\"> // 是否启用雾效果 </span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">};</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 创建 Water 对象</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> water </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#BD93F9\\"> THREE</span><span style=\\"color:#F8F8F2\\">.</span><span style=\\"color:#50FA7B\\">Water</span><span style=\\"color:#F8F8F2\\">(waterGeometry, waterOptions);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">// 将 Water 对象添加到场景中</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">scene.</span><span style=\\"color:#50FA7B\\">add</span><span style=\\"color:#F8F8F2\\">(water);</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{Na as comp,Ua as data};
