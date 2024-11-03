import{_ as pa,i as j,l as I,q as da,c as va,a as q,d as Z,o as Fa}from"./app-CbGq5X0e.js";import{M as H,e as i,m as z,aq as ua,c as ma,n as L,j as J,P as N,aX as ya,aY as U,aZ as K,a as ta,a_ as fa,aK as oa,S as $,aC as ha,D as ga,V as ba,A as wa,p as Ca,W as X,aD as Y,b as xa,l as Ea,a5 as Sa,ba as Aa,a8 as Ba,T as Da,d as Q,C as Ma}from"./three.module-DElcEsb7.js";import{O as G}from"./OrbitControls-COOjmuLA.js";import{R as aa}from"./RGBELoader-CbWxVjwZ.js";import{G as sa}from"./GLTFLoader-Def6ni-K.js";import{W as ea}from"./Water2-Ek810xfd.js";class na extends H{constructor(p,a={}){super(p),this.isWater=!0;const r=this,_=a.textureWidth!==void 0?a.textureWidth:512,m=a.textureHeight!==void 0?a.textureHeight:512,W=a.clipBias!==void 0?a.clipBias:0,k=a.alpha!==void 0?a.alpha:1,e=a.time!==void 0?a.time:0,d=a.waterNormals!==void 0?a.waterNormals:null,S=a.sunDirection!==void 0?a.sunDirection:new i(.70707,.70707,0),B=new z(a.sunColor!==void 0?a.sunColor:16777215),D=new z(a.waterColor!==void 0?a.waterColor:8355711),y=a.eye!==void 0?a.eye:new i(0,0,0),t=a.distortionScale!==void 0?a.distortionScale:20,b=a.side!==void 0?a.side:ua,w=a.fog!==void 0?a.fog:!1,u=new ma,s=new i,v=new i,A=new i,h=new L,g=new i(0,0,-1),l=new J,F=new i,C=new i,x=new J,E=new L,c=new N,R=new ya(_,m),M={name:"MirrorShader",uniforms:U.merge([K.fog,K.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new L},sunColor:{value:new z(8355711)},sunDirection:{value:new i(.70707,.70707,0)},eye:{value:new i},waterColor:{value:new z(5592405)}}]),vertexShader:`
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
				}`},n=new ta({name:M.name,uniforms:U.clone(M.uniforms),vertexShader:M.vertexShader,fragmentShader:M.fragmentShader,lights:!0,side:b,fog:w});n.uniforms.mirrorSampler.value=R.texture,n.uniforms.textureMatrix.value=E,n.uniforms.alpha.value=k,n.uniforms.time.value=e,n.uniforms.normalSampler.value=d,n.uniforms.sunColor.value=B,n.uniforms.waterColor.value=D,n.uniforms.sunDirection.value=S,n.uniforms.distortionScale.value=t,n.uniforms.eye.value=y,r.material=n,r.onBeforeRender=function(o,la,T){if(v.setFromMatrixPosition(r.matrixWorld),A.setFromMatrixPosition(T.matrixWorld),h.extractRotation(r.matrixWorld),s.set(0,0,1),s.applyMatrix4(h),F.subVectors(v,A),F.dot(s)>0)return;F.reflect(s).negate(),F.add(v),h.extractRotation(T.matrixWorld),g.set(0,0,-1),g.applyMatrix4(h),g.add(A),C.subVectors(v,g),C.reflect(s).negate(),C.add(v),c.position.copy(F),c.up.set(0,1,0),c.up.applyMatrix4(h),c.up.reflect(s),c.lookAt(C),c.far=T.far,c.updateMatrixWorld(),c.projectionMatrix.copy(T.projectionMatrix),E.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),E.multiply(c.projectionMatrix),E.multiply(c.matrixWorldInverse),u.setFromNormalAndCoplanarPoint(s,v),u.applyMatrix4(c.matrixWorldInverse),l.set(u.normal.x,u.normal.y,u.normal.z,u.constant);const f=c.projectionMatrix;x.x=(Math.sign(l.x)+f.elements[8])/f.elements[0],x.y=(Math.sign(l.y)+f.elements[9])/f.elements[5],x.z=-1,x.w=(1+f.elements[10])/f.elements[14],l.multiplyScalar(2/l.dot(x)),f.elements[2]=l.x,f.elements[6]=l.y,f.elements[10]=l.z+1-W,f.elements[14]=l.w,y.setFromMatrixPosition(T.matrixWorld);const ca=o.getRenderTarget(),ra=o.xr.enabled,ia=o.shadowMap.autoUpdate;r.visible=!1,o.xr.enabled=!1,o.shadowMap.autoUpdate=!1,o.setRenderTarget(R),o.state.buffers.depth.setMask(!0),o.autoClear===!1&&o.clear(),o.render(la,c),r.visible=!0,o.xr.enabled=ra,o.shadowMap.autoUpdate=ia,o.setRenderTarget(ca);const O=T.viewport;O!==void 0&&o.state.viewport(O)}}}class P extends H{constructor(){const p=P.SkyShader,a=new ta({name:p.name,uniforms:U.clone(p.uniforms),vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,side:fa,depthWrite:!1});super(new oa(1,1,1),a),this.isSky=!0}}P.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new i},up:{value:new i(0,1,0)}},vertexShader:`
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

		}`};const Ta={__name:"threejs-water.html",setup(V,{expose:p}){p();let a;const r=j(),_=()=>{const e=new $,d=new N(90,2,.1,1e3);d.position.set(5,5,5),e.add(d),new aa().loadAsync("/assets/textures/hdr/050.hdr").then(s=>{s.mapping=ha,e.background=s,e.environment=s}),new sa().load("/assets/model/yugang.glb",s=>{console.log(s);const v=s.scene.children[0];v.material.side=ga;const A=s.scene.children[1].geometry,h=new ea(A,{color:"#ffffff",scale:1,flowDirection:new ba(1,1),textureHeight:1024,textureWidth:1024});e.add(h),e.add(v)});const D=new wa(16777215);D.intensity=10,e.add(D);const y=new Ca(16777215,.5);e.add(y);const t=new X({alpha:!0,antialias:!0});t.outputEncoding=void 0,t.toneMapping=Y,t.setSize(r.value.offsetWidth,r.value.offsetWidth/2),window.addEventListener("resize",()=>{t.setSize(r.value.offsetWidth,r.value.offsetWidth/2),t.setPixelRatio(window.devicePixelRatio)}),r.value.appendChild(t.domElement);const b=new G(d,t.domElement);b.enableDamping=!0;const w=new Ma;function u(s){w.getElapsedTime(),requestAnimationFrame(u),t.render(e,d)}u()},m=j(),W=()=>{const e=new X;e.setSize(m.value.offsetWidth,m.value.offsetWidth/2),e.toneMapping=Y,m.value.appendChild(e.domElement);const d=new $,S=new N(55,2,1,2e4);S.position.set(30,30,100);const B=new i,D=new xa(1e4,1e4),y=new na(D,{textureWidth:512,textureHeight:512,waterNormals:new Ea().load("textures/waternormals.jpg",function(n){n.wrapS=n.wrapT=Sa}),sunDirection:new i,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:d.fog!==void 0});y.rotation.x=-Math.PI/2,d.add(y);const t=new P;t.scale.setScalar(1e4),d.add(t);const b=t.material.uniforms;b.turbidity.value=10,b.rayleigh.value=2,b.mieCoefficient.value=.005,b.mieDirectionalG.value=.8;const w={elevation:2,azimuth:180},u=new Aa(e);let s;function v(){const n=Q.degToRad(90-w.elevation),o=Q.degToRad(w.azimuth);B.setFromSphericalCoords(1,n,o),t.material.uniforms.sunPosition.value.copy(B),y.material.uniforms.sunDirection.value.copy(B).normalize(),s!==void 0&&s.dispose(),s=u.fromScene(t),d.environment=s.texture}v();const A=new oa(30,30,30),h=new Ba({roughness:0}),g=new H(A,h);d.add(g);const l=new G(S,e.domElement);l.maxPolarAngle=Math.PI*.495,l.target.set(0,10,0),l.minDistance=40,l.maxDistance=200,l.update();const F=new a.GUI;m.value.appendChild(F.domElement),F.domElement.style.position="absolute",F.domElement.style.top="0px",F.domElement.style.right="0px";const C=F.addFolder("Sky");C.add(w,"elevation",0,90,.1).onChange(v),C.add(w,"azimuth",-180,180,.1).onChange(v),C.open();const x=y.material.uniforms,E=F.addFolder("Water");E.add(x.distortionScale,"value",0,8,.1).name("distortionScale"),E.add(x.size,"value",.1,10,.1).name("size"),E.open(),window.addEventListener("resize",c);function c(){S.updateProjectionMatrix(),e.setSize(m.offsetWidth,m.offsetWidth/2)}function R(){requestAnimationFrame(R),M()}function M(){const n=performance.now()*.001;g.position.y=Math.sin(n)*20+5,g.rotation.x=n*.5,g.rotation.z=n*.51,y.material.uniforms.time.value+=1/60,e.render(d,S)}R()};I(async()=>{a=await da(()=>import("./dat.gui.module-DNo137I2.js"),[]),_(),W()});const k={get dat(){return a},set dat(e){a=e},waterRef:r,init:_,oceanRef:m,initOcean:W,ref:j,onMounted:I,get THREE(){return Da},get OrbitControls(){return G},get RGBELoader(){return aa},get GLTFLoader(){return sa},get Water2(){return ea},get Water(){return na},get Sky(){return P}};return Object.defineProperty(k,"__isScriptSetup",{enumerable:!1,value:!0}),k}},_a={ref:"waterRef"},Ra={ref:"oceanRef",class:"ocean"};function Pa(V,p,a,r,_,m){return Fa(),va("div",null,[p[0]||(p[0]=q(`<p data-v-ca126180>参考：<a href="https://threejs.org/" target="_blank" rel="noopener noreferrer" data-v-ca126180>https://threejs.org/</a></p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-ca126180><pre class="shiki dracula vp-code" data-v-ca126180><code data-v-ca126180><span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>import</span><span style="color:#F8F8F2;" data-v-ca126180> { Water } </span><span style="color:#FF79C6;" data-v-ca126180>from</span><span style="color:#E9F284;" data-v-ca126180> &quot;</span><span style="color:#F1FA8C;" data-v-ca126180>three/examples/jsm/objects/Water2.js</span><span style="color:#E9F284;" data-v-ca126180>&quot;</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>// 创建用于水面的平面几何体</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> waterGeometry </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-ca126180>(</span><span style="color:#BD93F9;" data-v-ca126180>10000</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#BD93F9;" data-v-ca126180>10000</span><span style="color:#F8F8F2;" data-v-ca126180>);</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>// 创建 Water 对象所需的选项</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> waterOptions </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> {</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  color</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#E9F284;" data-v-ca126180> &#39;</span><span style="color:#F1FA8C;" data-v-ca126180>#abcdef</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 水体颜色</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  scale</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 4</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 波浪大小</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  flowDirection</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>Vector2</span><span style="color:#F8F8F2;" data-v-ca126180>(</span><span style="color:#BD93F9;" data-v-ca126180>1</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#BD93F9;" data-v-ca126180>1</span><span style="color:#F8F8F2;" data-v-ca126180>), </span><span style="color:#6272A4;" data-v-ca126180>// 水流方向</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  textureWidth</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 1024</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 纹理宽度</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  textureHeight</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 1024</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 纹理高度</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 水面的法线贴图。其作用是用于模拟水面波浪之间的交互以及光照效果，增加水面的真实感。</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  normalMap0</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#F8F8F2;" data-v-ca126180> normalTexture, </span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 法线贴图是一种让表面产生凹凸感觉的纹理，用以增加真实感</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  normalMapUrl0</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#E9F284;" data-v-ca126180> &#39;</span><span style="color:#F1FA8C;" data-v-ca126180>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 这里也可以直接将贴图赋值给 normalMap0</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  envMap</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#F8F8F2;" data-v-ca126180> cubeRenderTarget.texture, </span><span style="color:#6272A4;" data-v-ca126180>// 反射天空盒的立方体纹理</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  receiveShadow</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> true</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 是否接收阴影</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  distortionScale</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 3.7</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#6272A4;" data-v-ca126180>// 扭曲效果的大小</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  fog</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#F8F8F2;" data-v-ca126180> scene.fog </span><span style="color:#FF79C6;" data-v-ca126180>!==</span><span style="color:#BD93F9;" data-v-ca126180> undefined</span><span style="color:#6272A4;" data-v-ca126180> // 是否启用雾效果 </span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>};</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>// 创建 Water 对象</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> water </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>Water</span><span style="color:#F8F8F2;" data-v-ca126180>(waterGeometry, waterOptions);</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>// 将 Water 对象添加到场景中</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>scene.</span><span style="color:#50FA7B;" data-v-ca126180>add</span><span style="color:#F8F8F2;" data-v-ca126180>(water);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-ca126180><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div></div></div>`,2)),Z("div",_a,null,512),p[1]||(p[1]=q(`<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;" data-v-ca126180><pre class="shiki dracula vp-code" data-v-ca126180><code data-v-ca126180><span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>import</span><span style="color:#F8F8F2;" data-v-ca126180> { Water } </span><span style="color:#FF79C6;" data-v-ca126180>from</span><span style="color:#E9F284;" data-v-ca126180> &#39;</span><span style="color:#F1FA8C;" data-v-ca126180>three/addons/objects/Water.js</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> waterGeometry </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>PlaneGeometry</span><span style="color:#F8F8F2;" data-v-ca126180>( </span><span style="color:#BD93F9;" data-v-ca126180>10000</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#BD93F9;" data-v-ca126180>10000</span><span style="color:#F8F8F2;" data-v-ca126180> );</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>water </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#50FA7B;" data-v-ca126180> Water</span><span style="color:#F8F8F2;" data-v-ca126180>(</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> waterGeometry,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> {</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  textureWidth</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 512</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  textureHeight</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 512</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  waterNormals</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>TextureLoader</span><span style="color:#F8F8F2;" data-v-ca126180>().</span><span style="color:#50FA7B;" data-v-ca126180>load</span><span style="color:#F8F8F2;" data-v-ca126180>( </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>textures/waternormals.jpg</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180>, </span><span style="color:#FF79C6;" data-v-ca126180>function</span><span style="color:#F8F8F2;" data-v-ca126180> ( </span><span style="color:#FFB86C;font-style:italic;" data-v-ca126180>texture</span><span style="color:#F8F8F2;" data-v-ca126180> ) {</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>   texture.wrapS </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> texture.wrapT </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.RepeatWrapping;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  } ),</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  sunDirection</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>Vector3</span><span style="color:#F8F8F2;" data-v-ca126180>(),</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  sunColor</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 0xffffff</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  waterColor</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 0x001e0f</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  distortionScale</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 3.7</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  fog</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#F8F8F2;" data-v-ca126180> scene.fog </span><span style="color:#FF79C6;" data-v-ca126180>!==</span><span style="color:#BD93F9;" data-v-ca126180> undefined</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> }</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>);</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>water.rotation.x </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;" data-v-ca126180> -</span><span style="color:#F8F8F2;" data-v-ca126180> Math.</span><span style="color:#BD93F9;" data-v-ca126180>PI</span><span style="color:#FF79C6;" data-v-ca126180> /</span><span style="color:#BD93F9;" data-v-ca126180>2</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>function</span><span style="color:#50FA7B;" data-v-ca126180> render</span><span style="color:#F8F8F2;" data-v-ca126180>(){</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>  water.material.uniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>time</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value </span><span style="color:#FF79C6;" data-v-ca126180>+=</span><span style="color:#BD93F9;" data-v-ca126180> 1.0</span><span style="color:#FF79C6;" data-v-ca126180> /</span><span style="color:#BD93F9;" data-v-ca126180> 60.0</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>}</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>// 落日</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>import</span><span style="color:#F8F8F2;" data-v-ca126180> { Sky } </span><span style="color:#FF79C6;" data-v-ca126180>from</span><span style="color:#E9F284;" data-v-ca126180> &#39;</span><span style="color:#F1FA8C;" data-v-ca126180>three/addons/objects/Sky.js</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>sun </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>Vector3</span><span style="color:#F8F8F2;" data-v-ca126180>();</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> sky </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#50FA7B;" data-v-ca126180> Sky</span><span style="color:#F8F8F2;" data-v-ca126180>();</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>sky.scale.</span><span style="color:#50FA7B;" data-v-ca126180>setScalar</span><span style="color:#F8F8F2;" data-v-ca126180>( </span><span style="color:#BD93F9;" data-v-ca126180>10000</span><span style="color:#F8F8F2;" data-v-ca126180> );</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>scene.</span><span style="color:#50FA7B;" data-v-ca126180>add</span><span style="color:#F8F8F2;" data-v-ca126180>( sky );</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> skyUniforms </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> sky.material.unifor</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>skyUniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>turbidity</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> 10</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>skyUniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>rayleigh</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> 2</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>skyUniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>mieCoefficient</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> 0.005</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>skyUniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>mieDirectionalG</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> 0.8</span><span style="color:#F8F8F2;" data-v-ca126180>;</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>/*</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>创建了一个预计算辐射度环境贴图（pre-computed radiance environment map，PMREM）生成器。</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>PMREMGenerator 是 Three.js 物体材质中用于实现基于物理的渲染（PBR）的重要组件之一。</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>在 Three.js 中，PBR 材质需要使用辐射度环境贴图来提供场景的照明信息，</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>而预计算辐射度环境贴图是一种预先计算和缓存辐射度环境贴图的技术，可以提高实时渲染的效率和质量。</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>通过传递渲染器对象作为参数，PMREMGenerator 可以根据当前场景和光照计算出辐射度环境贴图，</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>并将其缓存在内存中，方便后续使用。在使用 PBR 材质时，</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>我们可以通过调用 PMREMGenerator 的相关方法来获取需要的辐射度环境贴图。</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>*/</span><span style="color:#F8F8F2;" data-v-ca126180> </span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> pmremGenerator </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#FF79C6;font-weight:bold;" data-v-ca126180> new</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.</span><span style="color:#50FA7B;" data-v-ca126180>PMREMGenerator</span><span style="color:#F8F8F2;" data-v-ca126180>( renderer );</span></span>
<span class="line" data-v-ca126180></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>const</span><span style="color:#F8F8F2;" data-v-ca126180> parameters </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> {</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> elevation</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 2</span><span style="color:#F8F8F2;" data-v-ca126180>,</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> azimuth</span><span style="color:#FF79C6;" data-v-ca126180>:</span><span style="color:#BD93F9;" data-v-ca126180> 180</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>};</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>let</span><span style="color:#F8F8F2;" data-v-ca126180> renderTarget;</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>//根据当前的太阳方位和高度来更新天空和水面的着色，使其看起来仿佛是在现实世界中受到了真实的自然光照射。</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180>function</span><span style="color:#50FA7B;" data-v-ca126180> updateSun</span><span style="color:#F8F8F2;" data-v-ca126180>() {</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  //将 phi 和 theta 转换为弧度制</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180> const</span><span style="color:#F8F8F2;" data-v-ca126180> phi </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.MathUtils.</span><span style="color:#50FA7B;" data-v-ca126180>degToRad</span><span style="color:#F8F8F2;" data-v-ca126180>( </span><span style="color:#BD93F9;" data-v-ca126180>90</span><span style="color:#FF79C6;" data-v-ca126180> -</span><span style="color:#F8F8F2;" data-v-ca126180> parameters.elevation );</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180> const</span><span style="color:#F8F8F2;" data-v-ca126180> theta </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#BD93F9;" data-v-ca126180> THREE</span><span style="color:#F8F8F2;" data-v-ca126180>.MathUtils.</span><span style="color:#50FA7B;" data-v-ca126180>degToRad</span><span style="color:#F8F8F2;" data-v-ca126180>( parameters.azimuth );</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 计算太阳位置</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> sun.</span><span style="color:#50FA7B;" data-v-ca126180>setFromSphericalCoords</span><span style="color:#F8F8F2;" data-v-ca126180>( </span><span style="color:#BD93F9;" data-v-ca126180>1</span><span style="color:#F8F8F2;" data-v-ca126180>, phi, theta );</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 将太阳位置应用到天空和水面</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> sky.material.uniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>sunPosition</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value.</span><span style="color:#50FA7B;" data-v-ca126180>copy</span><span style="color:#F8F8F2;" data-v-ca126180>( sun );</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> water.material.uniforms[ </span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F1FA8C;" data-v-ca126180>sunDirection</span><span style="color:#E9F284;" data-v-ca126180>&#39;</span><span style="color:#F8F8F2;" data-v-ca126180> ].value.</span><span style="color:#50FA7B;" data-v-ca126180>copy</span><span style="color:#F8F8F2;" data-v-ca126180>( sun ).</span><span style="color:#50FA7B;" data-v-ca126180>normalize</span><span style="color:#F8F8F2;" data-v-ca126180>();</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  // 释放之前的渲染</span></span>
<span class="line" data-v-ca126180><span style="color:#FF79C6;" data-v-ca126180> if</span><span style="color:#F8F8F2;" data-v-ca126180> ( renderTarget </span><span style="color:#FF79C6;" data-v-ca126180>!==</span><span style="color:#BD93F9;" data-v-ca126180> undefined</span><span style="color:#F8F8F2;" data-v-ca126180> ) renderTarget.</span><span style="color:#50FA7B;" data-v-ca126180>dispose</span><span style="color:#F8F8F2;" data-v-ca126180>();</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  //使用 fromScene 方法从 sky 中生成一个新的渲染目标对象。</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  //这个渲染目标对象是通过预计算辐射度环境贴图生成器 pmremGenerator 计算出来的</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> renderTarget </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> pmremGenerator.</span><span style="color:#50FA7B;" data-v-ca126180>fromScene</span><span style="color:#F8F8F2;" data-v-ca126180>( sky );</span></span>
<span class="line" data-v-ca126180><span style="color:#6272A4;" data-v-ca126180>  //将渲染目标的材质设置为场景的环境贴图。</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180> scene.environment </span><span style="color:#FF79C6;" data-v-ca126180>=</span><span style="color:#F8F8F2;" data-v-ca126180> renderTarget.texture;</span></span>
<span class="line" data-v-ca126180><span style="color:#F8F8F2;" data-v-ca126180>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;" data-v-ca126180><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div><div class="line-number" data-v-ca126180></div></div></div>`,1)),Z("div",Ra,null,512)])}const Na=pa(Ta,[["render",Pa],["__scopeId","data-v-ca126180"],["__file","threejs-water.html.vue"]]),Ua=JSON.parse('{"path":"/threejs/threejs-water.html","title":"ThreeJS中的水","lang":"en-US","frontmatter":{"title":"ThreeJS中的水","category":["ThreeJS"],"date":"2022-02-22T00:00:00.000Z","description":"参考：https://threejs.org/","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/threejs/threejs-water.html"}],["meta",{"property":"og:title","content":"ThreeJS中的水"}],["meta",{"property":"og:description","content":"参考：https://threejs.org/"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-11-03T04:27:20.000Z"}],["meta",{"property":"article:published_time","content":"2022-02-22T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-03T04:27:20.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ThreeJS中的水\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-02-22T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-03T04:27:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[],"git":{"createdTime":1681886614000,"updatedTime":1730608040000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":4},{"name":"卢祥","email":"example@qq.com","commits":2}]},"readingTime":{"minutes":4.49,"words":1348},"filePathRelative":"threejs/threejs-water.md","localizedDate":"February 22, 2022","excerpt":"<p>参考：<a href=\\"https://threejs.org/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://threejs.org/</a></p>","autoDesc":true}');export{Na as comp,Ua as data};
