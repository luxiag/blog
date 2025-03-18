import{l as O,a as V,m as T,n as M,o as R,p as k,q as L,W as H,ay as E,ak as v,V as i,G as W,r as N,s as P}from"./three.module-_5Kft3IB.js";import{O as h}from"./OrbitControls-86TszHm5.js";import{_ as j,e as Z,f as u,g as m,r as y,i as G,o as Y}from"./app-Bd-A8UqK.js";const $="/blog/assets/957004303041232323-D7B8SY2a.png",X="/blog/assets/400004802041452323-B5sQwPYD.png",Q="/blog/assets/709004802041452323-CY6iu9wk.png",U="/blog/assets/394005002041452323-BjWQWAuR.png",J={__name:"glsl-matrices.html",setup(I,{expose:l}){l();const c=n=>{const o=new O,f=new P,F={u_time:{type:"f",value:1},u_resolution:{type:"v2",value:new V}},a=new T(75,2,.1,1e3);a.position.set(0,0,20),o.add(a);const p=new M({uniforms:F,vertexShader:`
        precision lowp float;
        varying vec2 v_uv;
        void main(){
            v_uv = uv;
            gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4( position, 1.0 );
        }
        `,fragmentShader:n.fragmentShader,side:R}),t=new k(new L(100,100),p);t.position.set(0,0,0),o.add(t);const s=new H;s.setSize(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2),s.shadowMap.enabled=!0,n.shaderDom.value.appendChild(s.domElement),s.render(o,a);const r=new h(a,s.domElement);r.enableDamping=!0,F.u_resolution.value.x=s.domElement.width,F.u_resolution.value.y=s.domElement.height;function d(){F.u_time.value+=f.getDelta(),r.update(),s.render(o,a),requestAnimationFrame(d)}d()},C=n=>{const o=new O,f=new P,F={iResolution:{value:new i},iTime:{value:0},iTimeDelta:{value:0},iFrameRate:{value:60},iFrame:{value:0},iChannelTime:{value:[0,0,0,0]},iChannelResolution:{value:[new i,new i,new i,new i]},iMouse:{value:new E},iChannel0:{value:new v},iChannel1:{value:new v},iChannel2:{value:new v},iChannel3:{value:new v},iDate:{value:new E}},a=new T(75,2,.1,1e3);a.position.set(0,0,20),o.add(a);const p=new M({uniforms:F,vertexShader:`
        precision lowp float;
        varying vec2 v_uv;
        void main(){
            v_uv = uv;
            gl_Position = projectionMatrix *viewMatrix* modelMatrix * vec4( position, 1.0 );
        }
        `,fragmentShader:n.fragmentShader,side:R}),t=new k(new L(100,100),p);t.position.set(0,0,0),o.add(t);const s=new H;s.setSize(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2),s.shadowMap.enabled=!0,n.shaderDom.value.appendChild(s.domElement),s.render(o,a);const r=new h(a,s.domElement);r.enableDamping=!0;const d=new W;p.uniforms.iResolution.value.set(n.shaderDom.value.offsetWidth,n.shaderDom.value.offsetWidth/2,1),p.uniforms.iChannel0.value=d.load("/assets/textures/ca.jpeg"),n.shaderDom.value.addEventListener("mousemove",e=>{p.uniforms.iMouse.value.set(e.clientX,e.clientY,0,0)});function w(){r.update(),s.render(o,a),requestAnimationFrame(w);const e=new Date,q=e.getTime()*.001;p.uniforms.iTime.value+=f.getDelta(),p.uniforms.iDate.value.set(e.getFullYear(),e.getMonth(),e.getDate(),q)}w()},B=y(),b={shaderDom:B,fragmentShader:`
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float newCross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) + box(_st, vec2(_size/4.,_size));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // To move the cross we move the space
    // -1 到 1 
    vec2 translate = vec2(cos(u_time),sin(u_time));
    // z坐标移动
    st += translate*0.35;

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(newCross(st,0.25));

    gl_FragColor = vec4(color,1.0);
}
    `},A=y(),_={shaderDom:A,fragmentShader:`
    #ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float newCross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( sin(u_time)*PI ) * st;
    // move it back to the original place
    st += vec2(0.5);

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(newCross(st,0.4));

    gl_FragColor = vec4(color,1.0);
}
    
    `},g=y(),D={shaderDom:g,fragmentShader:`
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float newCross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    st -= vec2(0.5);
    st = scale( vec2(sin(u_time)+1.0) ) * st;
    st += vec2(0.5);

    // Show the coordinates of the space on the background
    // color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(newCross(st,0.2));

    gl_FragColor = vec4(color,1.0);
}
    
    `},x=y(),z={shaderDom:x,fragmentShader:`
# ifdef GL_ES
precision mediump float;
# endif
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iDate;
//Sci-fi radar based on the work of gmunk for Oblivion
//http://work.gmunk.com/OBLIVION-GFX

#define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
#define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
#define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
#define M_PI 3.1415926535897932384626433832795

#define blue1 vec3(0.74,0.95,1.00)
#define blue2 vec3(0.87,0.98,1.00)
#define blue3 vec3(0.35,0.76,0.83)
#define blue4 vec3(0.953,0.969,0.89)
#define red   vec3(1.00,0.38,0.227)

#define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))

float movingLine(vec2 uv, vec2 center, float radius)
{
    //angle of the line
    float theta0 = 90.0 * iTime;
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if(r<radius)
    {
        //compute the distance to the line theta=theta0
        vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                            -sin(theta0*M_PI/180.0));
        float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
    	d = normalize(d);
        //compute gradient based on angle difference to theta0
   	 	float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
        float gradient = clamp(1.0-theta/90.0,0.0,1.0);
        return SMOOTH(l,1.0)+0.5*gradient;
    }
    else return 0.0;
}

float circle(vec2 uv, vec2 center, float radius, float width)
{
    float r = length(uv - center);
    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
}

float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    if( abs(d.y) > opening )
	    return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    else
        return 0.0;
}
float circle3(vec2 uv, vec2 center, float radius, float width)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    d = normalize(d);
    float theta = 180.0*(atan(d.y,d.x)/M_PI);
    return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
        mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
        (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
}

float triangles(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
         + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
         + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
         + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
}

float _cross(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    int x = int(d.x);
    int y = int(d.y);
    float r = sqrt( dot( d, d ) );
    if( (r<radius) && ( (x==y) || (x==-y) ) )
        return 1.0;
    else return 0.0;
}
float dots(vec2 uv, vec2 center, float radius)
{
    vec2 d = uv - center;
    float r = sqrt( dot( d, d ) );
    if( r <= 2.5 )
        return 1.0;
    if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
        return 1.0;
    else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
        return 0.5;
    else
	    return 0.0;
}
float bip1(vec2 uv, vec2 center)
{
    return SMOOTH(length(uv - center),3.0);
}
float bip2(vec2 uv, vec2 center)
{
    float r = length(uv - center);
    float R = 8.0+mod(87.0*iTime, 80.0);
    return (0.5-0.5*cos(30.0*iTime)) * SMOOTH(r,5.0)
        + SMOOTH(6.0,r)-SMOOTH(8.0,r)
        + smoothstep(max(8.0,R-20.0),R,r)-SMOOTH(R,r);
}
void main(  )
{
    vec3 finalColor;
	vec2 uv = gl_FragCoord.xy;
    //center of the image
    vec2 c = iResolution.xy/2.0;
    finalColor = vec3( 0.3*_cross(uv, c, 240.0) );
    finalColor += ( circle(uv, c, 100.0, 1.0)
                  + circle(uv, c, 165.0, 1.0) ) * blue1;
    finalColor += (circle(uv, c, 240.0, 2.0) );//+ dots(uv,c,240.0)) * blue4;
    finalColor += circle3(uv, c, 313.0, 4.0) * blue1;
    finalColor += triangles(uv, c, 315.0 + 30.0*sin(iTime)) * blue2;
    finalColor += movingLine(uv, c, 240.0) * blue3;
    finalColor += circle(uv, c, 10.0, 1.0) * blue3;
    finalColor += 0.7 * circle2(uv, c, 262.0, 1.0, 0.5+0.2*cos(iTime)) * blue3;
    if( length(uv-c) < 240.0 )
    {
        //animate some bips with random movements
    	vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*iTime);
   		finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*iTime)+0.15*iTime);
        finalColor += bip1(uv, c+p) * vec3(1,1,1);
        p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*iTime+7.0)+0.2*iTime);
        finalColor += bip2(uv,c+p) * red;
    }

    gl_FragColor = vec4( finalColor, 1.0 );
}    
    
    `};G(()=>{c(b),c(_),c(D),C(z)});const S={initScene:c,initShaderToy:C,translationRef:B,translationShader:b,rotateRef:A,rotateShader:_,scaleRef:g,scaleShader:D,radarRef:x,radarShader:z,ref:y,onMounted:G,get THREE(){return N},get OrbitControls(){return h}};return Object.defineProperty(S,"__isScriptSetup",{enumerable:!1,value:!0}),S}},K={ref:"translationRef"},ss={ref:"rotateRef"},ns={ref:"scaleRef"},as={ref:"radarRef"};function ls(I,l,c,C,B,b){return Y(),Z("div",null,[l[0]||(l[0]=u('<h2 id="平移" tabindex="-1"><a class="header-anchor" href="#平移"><span>平移</span></a></h2><figure><img src="'+$+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> box</span><span style="color:#F8F8F2;">(in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">, in vec2 </span><span style="color:#FFB86C;font-style:italic;">_size</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#F8F8F2;">    _size </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> _size</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _st);</span></span>
<span class="line"><span style="color:#F8F8F2;">    uv </span><span style="color:#FF79C6;">*=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                    _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#50FA7B;">                    vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">_st);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> uv.x</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">uv.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#8BE9FD;"> cross</span><span style="color:#F8F8F2;">(in vec2 _st, </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;"> _size){</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;">  box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size,_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">)) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#50FA7B;">            box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">,_size));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // To move the cross we move the space</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 translate </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(u_time),</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(u_time));</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> translate</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.35</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Show the coordinates of the space on the background</span></span>
<span class="line"><span style="color:#6272A4;">    // color = vec3(st.x,st.y,0.0);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Add the shape on the foreground</span></span>
<span class="line"><span style="color:#F8F8F2;">    color </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cross</span><span style="color:#F8F8F2;">(st,</span><span style="color:#BD93F9;">0.25</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)),m("div",K,null,512),l[1]||(l[1]=u('<h2 id="旋转" tabindex="-1"><a class="header-anchor" href="#旋转"><span>旋转</span></a></h2><figure><img src="'+X+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="'+Q+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> PI</span><span style="color:#BD93F9;"> 3.14159265359</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">mat2</span><span style="color:#50FA7B;"> rotate2d</span><span style="color:#F8F8F2;">(</span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> _angle</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mat2</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(_angle),</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(_angle),</span></span>
<span class="line"><span style="color:#50FA7B;">                sin</span><span style="color:#F8F8F2;">(_angle),</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(_angle));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> box</span><span style="color:#F8F8F2;">(in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">, in vec2 </span><span style="color:#FFB86C;font-style:italic;">_size</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#F8F8F2;">    _size </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> _size</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _st);</span></span>
<span class="line"><span style="color:#F8F8F2;">    uv </span><span style="color:#FF79C6;">*=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                    _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#50FA7B;">                    vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">_st);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> uv.x</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">uv.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#8BE9FD;"> cross</span><span style="color:#F8F8F2;">(in vec2 _st, </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;"> _size){</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;">  box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size,_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">)) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#50FA7B;">            box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">,_size));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // move space from the center to the vec2(0.0)</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">-=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#6272A4;">    // rotate the space</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> rotate2d</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(u_time)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">PI ) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> st;</span></span>
<span class="line"><span style="color:#6272A4;">    // move it back to the original place</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Show the coordinates of the space on the background</span></span>
<span class="line"><span style="color:#6272A4;">    // color = vec3(st.x,st.y,0.0);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Add the shape on the foreground</span></span>
<span class="line"><span style="color:#F8F8F2;">    color </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cross</span><span style="color:#F8F8F2;">(st,</span><span style="color:#BD93F9;">0.4</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4)),m("div",ss,null,512),l[2]||(l[2]=u('<h2 id="缩放" tabindex="-1"><a class="header-anchor" href="#缩放"><span>缩放</span></a></h2><figure><img src="'+U+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">#endif</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> PI</span><span style="color:#BD93F9;"> 3.14159265359</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec2</span><span style="color:#F8F8F2;"> u_resolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> u_time;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">mat2</span><span style="color:#50FA7B;"> scale</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">_scale</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> mat2</span><span style="color:#F8F8F2;">(_scale.x,</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#BD93F9;">                0.0</span><span style="color:#F8F8F2;">,_scale.y);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> box</span><span style="color:#F8F8F2;">(in vec2 </span><span style="color:#FFB86C;font-style:italic;">_st</span><span style="color:#F8F8F2;">, in vec2 </span><span style="color:#FFB86C;font-style:italic;">_size</span><span style="color:#F8F8F2;">){</span></span>
<span class="line"><span style="color:#F8F8F2;">    _size </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> _size</span><span style="color:#FF79C6;">*</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#F8F8F2;">                        _st);</span></span>
<span class="line"><span style="color:#F8F8F2;">    uv </span><span style="color:#FF79C6;">*=</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(_size,</span></span>
<span class="line"><span style="color:#F8F8F2;">                    _size</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.001</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#50FA7B;">                    vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">_st);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> uv.x</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">uv.y;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#8BE9FD;"> cross</span><span style="color:#F8F8F2;">(in vec2 _st, </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;"> _size){</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;">  box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size,_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">)) </span><span style="color:#FF79C6;">+</span></span>
<span class="line"><span style="color:#50FA7B;">            box</span><span style="color:#F8F8F2;">(_st, </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(_size</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">4.</span><span style="color:#F8F8F2;">,_size));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 st </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">u_resolution.xy;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 color </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">-=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> scale</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(u_time)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> st;</span></span>
<span class="line"><span style="color:#F8F8F2;">    st </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Show the coordinates of the space on the background</span></span>
<span class="line"><span style="color:#6272A4;">    // color = vec3(st.x,st.y,0.0);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // Add the shape on the foreground</span></span>
<span class="line"><span style="color:#F8F8F2;">    color </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cross</span><span style="color:#F8F8F2;">(st,</span><span style="color:#BD93F9;">0.2</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">(color,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)),m("div",ns,null,512),l[3]||(l[3]=u(`<h2 id="雷达" tabindex="-1"><a class="header-anchor" href="#雷达"><span>雷达</span></a></h2><div class="language-glsl line-numbers-mode" data-highlighter="shiki" data-ext="glsl" data-title="glsl" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">//作者： https://www.shadertoy.com/view/4s2SRt</span></span>
<span class="line"><span style="color:#FF79C6;"># ifdef</span><span style="color:#50FA7B;"> GL_ES</span></span>
<span class="line"><span style="color:#F8F8F2;">precision mediump </span><span style="color:#FF79C6;">float</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;"># endif</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec3</span><span style="color:#F8F8F2;"> iResolution;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> float</span><span style="color:#F8F8F2;"> iTime;</span></span>
<span class="line"><span style="color:#FF79C6;">uniform</span><span style="color:#FF79C6;"> vec4</span><span style="color:#F8F8F2;"> iDate;</span></span>
<span class="line"><span style="color:#6272A4;">//Sci-fi radar based on the work of gmunk for Oblivion</span></span>
<span class="line"><span style="color:#6272A4;">//http://work.gmunk.com/OBLIVION-GFX</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">r</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">R</span><span style="color:#F8F8F2;">) (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(R</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,R</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, r))</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> RANGE</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">a</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">b</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">x</span><span style="color:#F8F8F2;">) ( </span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(a,x)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(b,x)) )</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> RS</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">a</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">b</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">x</span><span style="color:#F8F8F2;">) ( </span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(a</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,a</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,x)</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">(b</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,b</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,x)) )</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> M_PI</span><span style="color:#BD93F9;"> 3.1415926535897932384626433832795</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> blue1</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.74</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.95</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.00</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> blue2</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.87</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.98</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.00</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> blue3</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.35</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.76</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.83</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> blue4</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.953</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.969</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.89</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> red</span><span style="color:#50FA7B;">   vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.00</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.38</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.227</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">#define</span><span style="color:#50FA7B;"> MOV</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">a</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">b</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">c</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">d</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">t</span><span style="color:#F8F8F2;">) (</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(a</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(t)</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">b</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t)), c</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(t)</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">d</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(t))))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> movingLine</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#6272A4;">    //angle of the line</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> theta0 </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 90.0</span><span style="color:#FF79C6;"> *</span><span style="color:#F8F8F2;"> iTime;</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sqrt</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">( d, d ) );</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;">radius)</span></span>
<span class="line"><span style="color:#F8F8F2;">    {</span></span>
<span class="line"><span style="color:#6272A4;">        //compute the distance to the line theta=theta0</span></span>
<span class="line"><span style="color:#F8F8F2;">        vec2 p </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> radius</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">vec2</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(theta0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">M_PI</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">180.0</span><span style="color:#F8F8F2;">),</span></span>
<span class="line"><span style="color:#FF79C6;">                            -</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(theta0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">M_PI</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">180.0</span><span style="color:#F8F8F2;">));</span></span>
<span class="line"><span style="color:#FF79C6;">        float</span><span style="color:#F8F8F2;"> l </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">( d </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> p</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">clamp</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(d,p)</span><span style="color:#FF79C6;">/</span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">(p,p), </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) );</span></span>
<span class="line"><span style="color:#F8F8F2;">    	d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> normalize</span><span style="color:#F8F8F2;">(d);</span></span>
<span class="line"><span style="color:#6272A4;">        //compute gradient based on angle difference to theta0</span></span>
<span class="line"><span style="color:#FF79C6;">   	 	float</span><span style="color:#F8F8F2;"> theta </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> mod</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">180.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">atan</span><span style="color:#F8F8F2;">(d.y,d.x)</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">M_PI</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">theta0,</span><span style="color:#BD93F9;">360.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">        float</span><span style="color:#F8F8F2;"> gradient </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> clamp</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">theta</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">90.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(l,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.5</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">gradient;</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span><span style="color:#FF79C6;"> return</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> circle</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> width</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">(uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius)</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> circle2</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> width</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> opening</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sqrt</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">( d, d ) );</span></span>
<span class="line"><span style="color:#F8F8F2;">    d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> normalize</span><span style="color:#F8F8F2;">(d);</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.y) </span><span style="color:#FF79C6;">&gt;</span><span style="color:#F8F8F2;"> opening )</span></span>
<span class="line"><span style="color:#FF79C6;">	    return</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius)</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius);</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> circle3</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> width</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sqrt</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">( d, d ) );</span></span>
<span class="line"><span style="color:#F8F8F2;">    d </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> normalize</span><span style="color:#F8F8F2;">(d);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> theta </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 180.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">atan</span><span style="color:#F8F8F2;">(d.y,d.x)</span><span style="color:#FF79C6;">/</span><span style="color:#F8F8F2;">M_PI);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">2.1</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(theta</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">45.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">)) </span><span style="color:#FF79C6;">*</span></span>
<span class="line"><span style="color:#50FA7B;">        mix</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">step</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">45.0</span><span style="color:#F8F8F2;">, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(theta, </span><span style="color:#BD93F9;">180.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">90.0</span><span style="color:#F8F8F2;">)) ) </span><span style="color:#FF79C6;">*</span></span>
<span class="line"><span style="color:#F8F8F2;">        (</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius)</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(r</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">width</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">,radius));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> triangles</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> RS</span><span style="color:#F8F8F2;">(</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, d.x</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">7.0</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">d.x</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius,</span><span style="color:#BD93F9;">9.0</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">d.x</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.y)))</span></span>
<span class="line"><span style="color:#FF79C6;">         +</span><span style="color:#50FA7B;"> RS</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">, d.x</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">radius) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">7.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">d.x</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius,</span><span style="color:#BD93F9;">9.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">d.x</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.y)))</span></span>
<span class="line"><span style="color:#FF79C6;">         +</span><span style="color:#50FA7B;"> RS</span><span style="color:#F8F8F2;">(</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, d.y</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">7.0</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">d.y</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius,</span><span style="color:#BD93F9;">9.0</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">d.y</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.x)))</span></span>
<span class="line"><span style="color:#FF79C6;">         +</span><span style="color:#50FA7B;"> RS</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">0.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">, d.y</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">radius) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">1.0</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">smoothstep</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">7.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">d.y</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius,</span><span style="color:#BD93F9;">9.0</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">d.y</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">radius, </span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.x)));</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> _cross</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    int</span><span style="color:#F8F8F2;"> x </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;"> int</span><span style="color:#F8F8F2;">(d.x);</span></span>
<span class="line"><span style="color:#FF79C6;">    int</span><span style="color:#F8F8F2;"> y </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;"> int</span><span style="color:#F8F8F2;">(d.y);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sqrt</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">( d, d ) );</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">( (r</span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;">radius) </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> ( (x</span><span style="color:#FF79C6;">==</span><span style="color:#F8F8F2;">y) </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> (x</span><span style="color:#FF79C6;">==-</span><span style="color:#F8F8F2;">y) ) )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span><span style="color:#FF79C6;"> return</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> dots</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">, </span><span style="color:#FF79C6;">float</span><span style="color:#FFB86C;font-style:italic;"> radius</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 d </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center;</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> sqrt</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">dot</span><span style="color:#F8F8F2;">( d, d ) );</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">( r </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#BD93F9;"> 2.5</span><span style="color:#F8F8F2;"> )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">( ( r</span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> radius) </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> ( (</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.y</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">&lt;=</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> ( </span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(d.x</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">50.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 2.0</span><span style="color:#F8F8F2;"> ) ) )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#BD93F9;"> 1.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> ( (</span><span style="color:#50FA7B;">abs</span><span style="color:#F8F8F2;">(d.y</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.5</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">&lt;=</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> ( r </span><span style="color:#FF79C6;">&gt;=</span><span style="color:#BD93F9;"> 50.0</span><span style="color:#F8F8F2;"> ) </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> ( r </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 115.0</span><span style="color:#F8F8F2;"> ) )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span><span style="color:#BD93F9;"> 0.5</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span></span>
<span class="line"><span style="color:#FF79C6;">	    return</span><span style="color:#BD93F9;"> 0.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> bip1</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">length</span><span style="color:#F8F8F2;">(uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center),</span><span style="color:#BD93F9;">3.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">float</span><span style="color:#50FA7B;"> bip2</span><span style="color:#F8F8F2;">(vec2 </span><span style="color:#FFB86C;font-style:italic;">uv</span><span style="color:#F8F8F2;">, vec2 </span><span style="color:#FFB86C;font-style:italic;">center</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> r </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> length</span><span style="color:#F8F8F2;">(uv </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> center);</span></span>
<span class="line"><span style="color:#FF79C6;">    float</span><span style="color:#F8F8F2;"> R </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 8.0</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">mod</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">87.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime, </span><span style="color:#BD93F9;">80.0</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;">0.5</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">0.5</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">30.0</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime)) </span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(r,</span><span style="color:#BD93F9;">5.0</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">        +</span><span style="color:#50FA7B;"> SMOOTH</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">6.0</span><span style="color:#F8F8F2;">,r)</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">,r)</span></span>
<span class="line"><span style="color:#FF79C6;">        +</span><span style="color:#50FA7B;"> smoothstep</span><span style="color:#F8F8F2;">(</span><span style="color:#50FA7B;">max</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">8.0</span><span style="color:#F8F8F2;">,R</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">20.0</span><span style="color:#F8F8F2;">),R,r)</span><span style="color:#FF79C6;">-</span><span style="color:#50FA7B;">SMOOTH</span><span style="color:#F8F8F2;">(R,r);</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">void</span><span style="color:#50FA7B;"> main</span><span style="color:#F8F8F2;">(  )</span></span>
<span class="line"><span style="color:#F8F8F2;">{</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec3 finalColor;</span></span>
<span class="line"><span style="color:#F8F8F2;">	vec2 uv </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> gl_FragCoord.xy;</span></span>
<span class="line"><span style="color:#6272A4;">    //center of the image</span></span>
<span class="line"><span style="color:#F8F8F2;">    vec2 c </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> iResolution.xy</span><span style="color:#FF79C6;">/</span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">( </span><span style="color:#BD93F9;">0.3</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">_cross</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">240.0</span><span style="color:#F8F8F2;">) );</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> ( </span><span style="color:#50FA7B;">circle</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">100.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">                  +</span><span style="color:#50FA7B;"> circle</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">165.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) ) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue1;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#F8F8F2;"> (</span><span style="color:#50FA7B;">circle</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">240.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">2.0</span><span style="color:#F8F8F2;">) );</span><span style="color:#6272A4;">//+ dots(uv,c,240.0)) * blue4;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> circle3</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">313.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">4.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue1;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> triangles</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">315.0</span><span style="color:#FF79C6;"> +</span><span style="color:#BD93F9;"> 30.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(iTime)) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue2;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> movingLine</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">240.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue3;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> circle</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">10.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue3;</span></span>
<span class="line"><span style="color:#F8F8F2;">    finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#BD93F9;"> 0.7</span><span style="color:#FF79C6;"> *</span><span style="color:#50FA7B;"> circle2</span><span style="color:#F8F8F2;">(uv, c, </span><span style="color:#BD93F9;">262.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">0.5</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.2</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">cos</span><span style="color:#F8F8F2;">(iTime)) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> blue3;</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;">( </span><span style="color:#50FA7B;">length</span><span style="color:#F8F8F2;">(uv</span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;">c) </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 240.0</span><span style="color:#F8F8F2;"> )</span></span>
<span class="line"><span style="color:#F8F8F2;">    {</span></span>
<span class="line"><span style="color:#6272A4;">        //animate some bips with random movements</span></span>
<span class="line"><span style="color:#F8F8F2;">    	vec2 p </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 130.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">MOV</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.3</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.4</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">3.0</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.1</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime);</span></span>
<span class="line"><span style="color:#F8F8F2;">   		finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> bip1</span><span style="color:#F8F8F2;">(uv, c</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">p) </span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">        p </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 130.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">MOV</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.9</span><span style="color:#F8F8F2;">,</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">1.1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.7</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">0.8</span><span style="color:#F8F8F2;">,</span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;">2.0</span><span style="color:#FF79C6;">+</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.15</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime);</span></span>
<span class="line"><span style="color:#F8F8F2;">        finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> bip1</span><span style="color:#F8F8F2;">(uv, c</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">p) </span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;"> vec3</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">        p </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 50.0</span><span style="color:#FF79C6;">*</span><span style="color:#50FA7B;">MOV</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1.54</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.7</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.37</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;">1.8</span><span style="color:#F8F8F2;">,</span><span style="color:#50FA7B;">sin</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0.1</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">7.0</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;">0.2</span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;">iTime);</span></span>
<span class="line"><span style="color:#F8F8F2;">        finalColor </span><span style="color:#FF79C6;">+=</span><span style="color:#50FA7B;"> bip2</span><span style="color:#F8F8F2;">(uv,c</span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;">p) </span><span style="color:#FF79C6;">*</span><span style="color:#F8F8F2;"> red;</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">    gl_FragColor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> vec4</span><span style="color:#F8F8F2;">( finalColor, </span><span style="color:#BD93F9;">1.0</span><span style="color:#F8F8F2;"> );</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)),m("div",as,null,512)])}const Fs=j(J,[["render",ls],["__file","glsl-matrices.html.vue"]]),cs=JSON.parse('{"path":"/glsl/glsl-matrices.html","title":"GLSL中的矩阵","lang":"en-US","frontmatter":{"title":"GLSL中的矩阵","date":"2022-10-13T00:00:00.000Z","category":["GLSL"],"description":"平移 旋转 缩放 雷达","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/glsl/glsl-matrices.html"}],["meta",{"property":"og:title","content":"GLSL中的矩阵"}],["meta",{"property":"og:description","content":"平移 旋转 缩放 雷达"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2024-10-31T11:40:02.000Z"}],["meta",{"property":"article:published_time","content":"2022-10-13T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-10-31T11:40:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"GLSL中的矩阵\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-10-13T00:00:00.000Z\\",\\"dateModified\\":\\"2024-10-31T11:40:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"git":{"createdTime":1681348776000,"updatedTime":1730374802000,"contributors":[{"name":"luxiag","username":"luxiag","email":"luxiag@qq.com","commits":8,"url":"https://github.com/luxiag"},{"name":"卢祥","username":"卢祥","email":"example@qq.com","commits":1,"url":"https://github.com/卢祥"}]},"readingTime":{"minutes":9.49,"words":2848},"filePathRelative":"glsl/glsl-matrices.md","localizedDate":"October 13, 2022","excerpt":"<h2>平移</h2>\\n<figure><figcaption></figcaption></figure>\\n<div class=\\"language-glsl line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"glsl\\" data-title=\\"glsl\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#6272A4\\">// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">#ifdef</span><span style=\\"color:#50FA7B\\"> GL_ES</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">precision mediump </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">#endif</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">uniform</span><span style=\\"color:#FF79C6\\"> vec2</span><span style=\\"color:#F8F8F2\\"> u_resolution;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">uniform</span><span style=\\"color:#FF79C6\\"> float</span><span style=\\"color:#F8F8F2\\"> u_time;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#50FA7B\\"> box</span><span style=\\"color:#F8F8F2\\">(in vec2 </span><span style=\\"color:#FFB86C;font-style:italic\\">_st</span><span style=\\"color:#F8F8F2\\">, in vec2 </span><span style=\\"color:#FFB86C;font-style:italic\\">_size</span><span style=\\"color:#F8F8F2\\">){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    _size </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.5</span><span style=\\"color:#F8F8F2\\">) </span><span style=\\"color:#FF79C6\\">-</span><span style=\\"color:#F8F8F2\\"> _size</span><span style=\\"color:#FF79C6\\">*</span><span style=\\"color:#BD93F9\\">0.5</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec2 uv </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> smoothstep</span><span style=\\"color:#F8F8F2\\">(_size,</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">                        _size</span><span style=\\"color:#FF79C6\\">+</span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.001</span><span style=\\"color:#F8F8F2\\">),</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">                        _st);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    uv </span><span style=\\"color:#FF79C6\\">*=</span><span style=\\"color:#50FA7B\\"> smoothstep</span><span style=\\"color:#F8F8F2\\">(_size,</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">                    _size</span><span style=\\"color:#FF79C6\\">+</span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.001</span><span style=\\"color:#F8F8F2\\">),</span></span>\\n<span class=\\"line\\"><span style=\\"color:#50FA7B\\">                    vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">1.0</span><span style=\\"color:#F8F8F2\\">)</span><span style=\\"color:#FF79C6\\">-</span><span style=\\"color:#F8F8F2\\">_st);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">    return</span><span style=\\"color:#F8F8F2\\"> uv.x</span><span style=\\"color:#FF79C6\\">*</span><span style=\\"color:#F8F8F2\\">uv.y;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#8BE9FD\\"> cross</span><span style=\\"color:#F8F8F2\\">(in vec2 _st, </span><span style=\\"color:#FF79C6\\">float</span><span style=\\"color:#F8F8F2\\"> _size){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">    return</span><span style=\\"color:#50FA7B\\">  box</span><span style=\\"color:#F8F8F2\\">(_st, </span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(_size,_size</span><span style=\\"color:#FF79C6\\">/</span><span style=\\"color:#BD93F9\\">4.</span><span style=\\"color:#F8F8F2\\">)) </span><span style=\\"color:#FF79C6\\">+</span></span>\\n<span class=\\"line\\"><span style=\\"color:#50FA7B\\">            box</span><span style=\\"color:#F8F8F2\\">(_st, </span><span style=\\"color:#50FA7B\\">vec2</span><span style=\\"color:#F8F8F2\\">(_size</span><span style=\\"color:#FF79C6\\">/</span><span style=\\"color:#BD93F9\\">4.</span><span style=\\"color:#F8F8F2\\">,_size));</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">void</span><span style=\\"color:#50FA7B\\"> main</span><span style=\\"color:#F8F8F2\\">(){</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec2 st </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> gl_FragCoord.xy</span><span style=\\"color:#FF79C6\\">/</span><span style=\\"color:#F8F8F2\\">u_resolution.xy;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec3 color </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec3</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#BD93F9\\">0.0</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // To move the cross we move the space</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    vec2 translate </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec2</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#50FA7B\\">cos</span><span style=\\"color:#F8F8F2\\">(u_time),</span><span style=\\"color:#50FA7B\\">sin</span><span style=\\"color:#F8F8F2\\">(u_time));</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    st </span><span style=\\"color:#FF79C6\\">+=</span><span style=\\"color:#F8F8F2\\"> translate</span><span style=\\"color:#FF79C6\\">*</span><span style=\\"color:#BD93F9\\">0.35</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // Show the coordinates of the space on the background</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // color = vec3(st.x,st.y,0.0);</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // Add the shape on the foreground</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    color </span><span style=\\"color:#FF79C6\\">+=</span><span style=\\"color:#50FA7B\\"> vec3</span><span style=\\"color:#F8F8F2\\">(</span><span style=\\"color:#50FA7B\\">cross</span><span style=\\"color:#F8F8F2\\">(st,</span><span style=\\"color:#BD93F9\\">0.25</span><span style=\\"color:#F8F8F2\\">));</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">    gl_FragColor </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#50FA7B\\"> vec4</span><span style=\\"color:#F8F8F2\\">(color,</span><span style=\\"color:#BD93F9\\">1.0</span><span style=\\"color:#F8F8F2\\">);</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{Fs as comp,cs as data};
