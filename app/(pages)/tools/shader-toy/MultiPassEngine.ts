export type PassId = 'image' | 'bufA' | 'bufB' | 'bufC' | 'bufD';
export type ChannelInput = { type: 'none' } | { type: 'pass'; pass: PassId } | { type: 'texture'; name: string };

export interface ShaderPass {
    id: PassId;
    label: string;
    code: string;
    channels: [ChannelInput, ChannelInput, ChannelInput, ChannelInput];
    enabled: boolean;
}

export const PASS_ORDER: PassId[] = ['bufA', 'bufB', 'bufC', 'bufD', 'image'];
export const PASS_LABELS: Record<PassId, string> = { image: 'Image', bufA: 'Buf A', bufB: 'Buf B', bufC: 'Buf C', bufD: 'Buf D' };
export const BUILTIN_TEXTURES = ['noise', 'noise_lq', 'gray_noise'];

export function convertShadertoyCode(code: string): string {
    let converted = code;
    if (converted.includes('mainImage')) {
        converted = converted.replace(/void\s+mainImage\s*\([^)]*\)\s*\{/g, 'void main() {');
        converted = converted.replace(/fragColor/g, 'gl_FragColor');
        converted = converted.replace(/fragCoord/g, 'gl_FragCoord');
    }
    if (!converted.includes('precision')) {
        converted = 'precision mediump float;\n' + converted;
    }
    if (converted.includes('iGlobalTime') && !converted.includes('iTime')) {
        converted = converted.replace(/iGlobalTime/g, 'iTime');
    }
    if (!converted.includes('uniform float iTime')) {
        const precisionMatch = converted.match(/(precision\s+\w+\s+\w+;)/);
        if (precisionMatch) {
            converted = converted.replace(
                precisionMatch[1],
                precisionMatch[1] + '\nuniform float iTime;\nuniform vec2 iResolution;\nuniform vec4 iMouse;\nuniform int iFrame;'
            );
        }
    }
    if (!converted.includes('uniform vec4 iMouse')) {
        const timeMatch = converted.match(/uniform float iTime;/);
        if (timeMatch) {
            converted = converted.replace('uniform float iTime;', 'uniform float iTime;\nuniform vec4 iMouse;\nuniform int iFrame;');
        }
    }
    return converted;
}

export const VS = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export function makeDefaultPasses(): ShaderPass[] {
    const none: ChannelInput = { type: 'none' };
    const ch: [ChannelInput, ChannelInput, ChannelInput, ChannelInput] = [none, none, none, none];
    return [
        { id: 'image', label: 'Image', enabled: true, code: `precision mediump float;\nuniform float iTime;\nuniform vec2 iResolution;\nuniform vec4 iMouse;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / iResolution.xy;\n  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));\n  gl_FragColor = vec4(col, 1.0);\n}`, channels: [...ch] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput] },
        { id: 'bufA', label: 'Buf A', enabled: false, code: '', channels: [...ch] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput] },
        { id: 'bufB', label: 'Buf B', enabled: false, code: '', channels: [...ch] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput] },
        { id: 'bufC', label: 'Buf C', enabled: false, code: '', channels: [...ch] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput] },
        { id: 'bufD', label: 'Buf D', enabled: false, code: '', channels: [...ch] as [ChannelInput, ChannelInput, ChannelInput, ChannelInput] },
    ];
}

interface FBOData { fbo: WebGLFramebuffer; texture: WebGLTexture | null; program: WebGLProgram | null; }

function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s);
        gl.deleteShader(s);
        throw new Error(log || 'Shader compile failed');
    }
    return s;
}

function linkProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
    const vs = compileShader(gl, vsSrc, gl.VERTEX_SHADER);
    if (!vs) throw new Error('VS failed');
    const fs = compileShader(gl, fsSrc, gl.FRAGMENT_SHADER);
    if (!fs) throw new Error('FS failed');
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(p);
        gl.deleteProgram(p);
        throw new Error(log || 'Link failed');
    }
    return p;
}

function createFBO(gl: WebGLRenderingContext, w: number, h: number): FBOData {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo, texture: tex, program: null };
}

function generateNoiseTexture(gl: WebGLRenderingContext, size: number, grayscale: boolean): WebGLTexture {
    const tex = gl.createTexture()!;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = grayscale ? v : Math.random() * 255;
        data[i + 1] = grayscale ? v : Math.random() * 255;
        data[i + 2] = grayscale ? v : Math.random() * 255;
        data[i + 3] = 255;
    }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return tex;
}

export class MultiPassRenderer {
    gl: WebGLRenderingContext;
    width = 0;
    height = 0;
    fbos = new Map<PassId, [FBOData, FBOData]>();
    builtinTextures = new Map<string, WebGLTexture>();
    posBuffer: WebGLBuffer | null = null;
    error: string | null = null;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        this.builtinTextures.set('noise', generateNoiseTexture(gl, 256, false));
        this.builtinTextures.set('noise_lq', generateNoiseTexture(gl, 64, false));
        this.builtinTextures.set('gray_noise', generateNoiseTexture(gl, 256, true));
    }

    resize(w: number, h: number) {
        if (w === this.width && h === this.height) return;
        this.width = w;
        this.height = h;
        const gl = this.gl;
        for (const [id, pair] of this.fbos) {
            for (const f of pair) {
                gl.deleteFramebuffer(f.fbo);
                if (f.texture) gl.deleteTexture(f.texture);
                if (f.program) gl.deleteProgram(f.program);
            }
            this.fbos.set(id, [createFBO(gl, w, h), createFBO(gl, w, h)]);
        }
    }

    ensureFBOs(passes: ShaderPass[]) {
        const gl = this.gl;
        const needed = new Set(passes.filter(p => p.enabled && p.code.trim()).map(p => p.id));
        for (const id of needed) {
            if (!this.fbos.has(id)) {
                this.fbos.set(id, [createFBO(gl, this.width, this.height), createFBO(gl, this.width, this.height)]);
            }
        }
        for (const [id, pair] of this.fbos) {
            if (!needed.has(id)) {
                for (const f of pair) {
                    gl.deleteFramebuffer(f.fbo);
                    if (f.texture) gl.deleteTexture(f.texture);
                    if (f.program) gl.deleteProgram(f.program);
                }
                this.fbos.delete(id);
            }
        }
    }

    compile(passes: ShaderPass[]) {
        const gl = this.gl;
        this.error = null;
        this.ensureFBOs(passes);
        for (const pass of passes) {
            if (!pass.enabled || !pass.code.trim()) continue;
            const pair = this.fbos.get(pass.id);
            if (!pair) continue;
            try {
                const prog = linkProgram(gl, VS, pass.code);
                for (const f of pair) { if (f.program) gl.deleteProgram(f.program); }
                pair[0].program = prog;
                pair[1].program = prog;
            } catch (e) {
                this.error = `[${pass.label}] ${(e as Error).message}`;
                return;
            }
        }
    }

    render(passes: ShaderPass[], time: number, mouse: [number, number, number, number], frame: number, outputCanvas: HTMLCanvasElement) {
        const gl = this.gl;
        if (this.error) return;

        const enabledPasses = PASS_ORDER.filter(id => {
            const p = passes.find(pp => pp.id === id);
            return p && p.enabled && p.code.trim();
        });

        for (const passId of enabledPasses) {
            const pass = passes.find(p => p.id === passId)!;
            const pair = this.fbos.get(passId);
            if (!pair) continue;
            const prog = pair[0].program;
            if (!prog) continue;

            const isImage = passId === 'image';
            const readIdx = frame % 2;
            const writeIdx = 1 - readIdx;
            const writeFBO = isImage ? null : pair[writeIdx].fbo;

            gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO);
            gl.viewport(0, 0, isImage ? outputCanvas.width : this.width, isImage ? outputCanvas.height : this.height);
            gl.useProgram(prog);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            const posLoc = gl.getAttribLocation(prog, 'position');
            if (posLoc >= 0) {
                gl.enableVertexAttribArray(posLoc);
                gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
            }

            const tLoc = gl.getUniformLocation(prog, 'iTime');
            const rLoc = gl.getUniformLocation(prog, 'iResolution');
            const mLoc = gl.getUniformLocation(prog, 'iMouse');
            const fLoc = gl.getUniformLocation(prog, 'iFrame');
            if (tLoc) gl.uniform1f(tLoc, time);
            if (rLoc) gl.uniform2f(rLoc, isImage ? outputCanvas.width : this.width, isImage ? outputCanvas.height : this.height);
            if (mLoc) gl.uniform4f(mLoc, mouse[0], mouse[1], mouse[2], mouse[3]);
            if (fLoc) gl.uniform1i(fLoc, frame);

            for (let ch = 0; ch < 4; ch++) {
                const chInput = pass.channels[ch];
                const loc = gl.getUniformLocation(prog, `iChannel${ch}`);
                if (!loc) continue;
                gl.activeTexture(gl.TEXTURE0 + ch);
                gl.uniform1i(loc, ch);
                if (chInput.type === 'pass') {
                    const srcPair = this.fbos.get(chInput.pass);
                    if (srcPair) {
                        gl.bindTexture(gl.TEXTURE_2D, srcPair[readIdx].texture);
                    } else {
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    }
                } else if (chInput.type === 'texture') {
                    const tex = this.builtinTextures.get(chInput.name);
                    gl.bindTexture(gl.TEXTURE_2D, tex || null);
                } else {
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    destroy() {
        const gl = this.gl;
        for (const [, pair] of this.fbos) {
            for (const f of pair) {
                gl.deleteFramebuffer(f.fbo);
                if (f.texture) gl.deleteTexture(f.texture);
                if (f.program) gl.deleteProgram(f.program);
            }
        }
        for (const [, tex] of this.builtinTextures) gl.deleteTexture(tex);
        if (this.posBuffer) gl.deleteBuffer(this.posBuffer);
        this.fbos.clear();
    }
}
