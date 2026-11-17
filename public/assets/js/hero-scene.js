/**
 * Hero atmosphere: soft amber light field (pure WebGL, no library).
 * Breathes slowly and follows the pointer. Falls back to the CSS gradient.
 */
(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false }) ||
    canvas.getContext("experimental-webgl");
  if (!gl) return;

  const vert = `
    attribute vec2 a;
    void main(){ gl_Position = vec4(a, 0.0, 1.0); }
  `;

  const frag = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p); vec2 f = fract(p);
      float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p = uv; p.x *= u_res.x / u_res.y;
      float t = u_time * 0.08;

      vec2 c1 = vec2(0.62 + 0.10 * sin(t * 1.3), 0.58 + 0.08 * cos(t * 0.9));
      vec2 c2 = vec2(0.25 + 0.08 * cos(t * 0.7), 0.30 + 0.10 * sin(t * 1.1));
      c1.x *= u_res.x / u_res.y; c2.x *= u_res.x / u_res.y;
      vec2 m = u_mouse; m.x *= u_res.x / u_res.y;

      float d1 = length(p - c1);
      float d2 = length(p - c2);
      float dm = length(p - m);

      float n = noise(p * 3.0 + t) * 0.35;

      float g1 = smoothstep(0.9, 0.0, d1 + n * 0.3);
      float g2 = smoothstep(0.7, 0.0, d2 + n * 0.25);
      float gm = smoothstep(0.55, 0.0, dm);

      vec3 amber = vec3(0.85, 0.47, 0.03);
      vec3 umber = vec3(0.35, 0.16, 0.05);
      vec3 cool  = vec3(0.10, 0.11, 0.16);

      vec3 col = vec3(0.0);
      col += amber * g1 * 0.22;
      col += umber * g2 * 0.30;
      col += cool  * (1.0 - g1) * 0.20;
      col += amber * gm * 0.10;

      float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.035;
      col += grain;

      float alpha = clamp(max(g1, g2) * 0.95 + gm * 0.4 + 0.15, 0.0, 1.0);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX / window.innerWidth;
    ty = 1.0 - e.clientY / window.innerHeight;
  }, { passive: true });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  let inView = true;
  let running = !document.hidden;
  let raf = 0;
  const io = new IntersectionObserver((en) => {
    inView = en.some((x) => x.isIntersecting);
    running = inView && !document.hidden;
    if (running && !raf) raf = requestAnimationFrame(tick);
  }, { threshold: 0.01 });
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    running = inView && !document.hidden;
    if (running && !raf) raf = requestAnimationFrame(tick);
  });

  const t0 = performance.now();
  function tick(now) {
    raf = 0;
    if (!running) return;
    resize();
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, mx, my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(tick);
  }

  canvas.classList.add("is-live");
  raf = requestAnimationFrame(tick);
})();
