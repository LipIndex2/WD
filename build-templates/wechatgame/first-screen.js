const VS_LOGO = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Position;  
    gl_Position.z = gl_Position.z - 0.1;
    v_TexCoord = a_TexCoord;
}`;

const VS_QIU = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Position;  
    gl_Position.z = gl_Position.z - 0.12;
    v_TexCoord = a_TexCoord;
}`;

const FS_LOGO = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}`;

// attribute float a_Progress;
// varying float v_Progress;
// v_Progress = a_Progress;
const VS_PROGRESSBAR = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = a_Position;  
    gl_Position.z = gl_Position.z - 0.11;
    v_TexCoord = a_TexCoord;
}`;

//gl_FragColor = v_Progress <= u_CurrentProgress ? u_ProgressBarColor : u_ProgressBackground;
// uniform vec4 u_ProgressBarColor;
// uniform vec4 u_ProgressBackground;
//varying float v_Progress;
const FS_PROGRESSBAR = `
precision mediump float;
uniform float u_CurrentProgress;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    if (v_TexCoord.x > u_CurrentProgress){
      gl_FragColor = vec4(0,0,0,0);
    }
    else{
      gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
}`;

const options = {
  alpha: false,
  antialias: true,
  depth: true,
  stencil: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'default',
  failIfMajorPerformanceCaveat: false,
};

let gl = null;
let image = null;
let imageProg = null;
let imageQiu = null;

let program = null;
let programQiu = null;
let programProgress = null;
let rafHandle = null;
let texture = null;
let textureProg = null;
let textureQiu = null;

let vertexBuffer = null;
let vertexBufferProgress = null;
let vertexBufferQiu = null;

let progress = 0.0;
// let progressBarColor = [61 / 255, 197 / 255, 222 / 255, 1];
// let progressBackground = [100 / 255, 111 / 255, 118 / 255, 1];
let afterTick = null;
let timeHandle = null;

function initShaders(vshader, fshader) {
  return createProgram(vshader, fshader);
}

function createProgram(vshader, fshader) {
  var vertexShader = loadShader(gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl.FRAGMENT_SHADER, fshader);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    program = null;
  }
  gl.deleteShader(fragmentShader);
  gl.deleteShader(vertexShader);
  return program;
}

function loadShader(type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initVertexBuffer() {
  const widthRatio = 2 / canvas.width;
  const heightRatio = 2 / canvas.height;
  const vertices = new Float32Array([
    widthRatio, heightRatio, 1.0, 1.0,
    widthRatio, heightRatio, 1.0, 0.0,
    -widthRatio, heightRatio, 0.0, 1.0,
    -widthRatio, heightRatio, 0.0, 0.0,
  ]);
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function initProgressVertexBuffer() {
  const widthRatio = 0.405;
  const heightRatio = (window.devicePixelRatio >= 2 ? 6 : 3) / canvas.height;
  const heightOffset = -0.25;
  // const widthRatio = 2 / canvas.width;
  // const heightRatio = 2 / canvas.height;
  const vertices = new Float32Array([
    widthRatio, heightOffset - heightRatio, 1,
    widthRatio, heightOffset + heightRatio, 1,
    -widthRatio, heightOffset - heightRatio, 0,
    -widthRatio, heightOffset + heightRatio, 0,
  ]);
  vertexBufferProgress = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferProgress);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function initQiuVertexBuffer() {
  const widthRatio = 1;
  const heightRatio = (window.devicePixelRatio >= 2 ? 6 : 3) / canvas.height;
  const heightOffset = -1;
  // const widthRatio = 2 / canvas.width;
  // const heightRatio = 2 / canvas.height;
  const vertices = new Float32Array([
    widthRatio, heightOffset, 1,
    widthRatio, heightOffset, 1,
    -widthRatio, heightOffset, 0,
    -widthRatio, heightOffset, 0,
  ]);
  vertexBufferQiu = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferQiu);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function updateVertexBuffer() {
  const imgAsp = image.width / image.height;
  const canvasAsp = canvas.width / canvas.height;
  var widthRatio = image.width / canvas.width;
  var heightRatio = image.height / canvas.height;
  if (imgAsp >= canvasAsp) { //图片宽高比较大，适配高
    widthRatio *= (1.0 / heightRatio);
    heightRatio = 1.0;
  } else { //屏幕宽高比较大，适配宽
    heightRatio *= (1.0 / widthRatio);
    widthRatio = 1.0;
  }
  const vertices = new Float32Array([
    widthRatio, -heightRatio, 1.0, 1.0,
    widthRatio, heightRatio, 1.0, 0.0,
    -widthRatio, -heightRatio, 0.0, 1.0,
    -widthRatio, heightRatio, 0.0, 0.0,
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}


function updateProgVertexBuffer() {
  const imgAsp = image.width / image.height;
  const canvasAsp = canvas.width / canvas.height;
  var scale = 1.0;
  if (imgAsp >= canvasAsp) { //图片宽高比较大，适配高
    scale = canvas.height / image.height;
  } else { //屏幕宽高比较大，适配宽
    scale = canvas.width / image.width
  }
  var widthRatio = imageProg.width * scale / canvas.width;
  var heightRatio = imageProg.height * scale / canvas.height;
  var offset = 920 * scale / canvas.height;
  const vertices = new Float32Array([
    widthRatio, -heightRatio - offset, 1.0, 1.0,
    widthRatio, heightRatio - offset, 1.0, 0.0,
    -widthRatio, -heightRatio - offset, 0.0, 1.0,
    -widthRatio, heightRatio - offset, 0.0, 0.0,
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferProgress);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

var verticesQiu = new Float32Array();

function updateQiuVertexBuffer() {

  const imgAsp = image.width / image.height;
  const canvasAsp = canvas.width / canvas.height;
  var scale = 1.0;
  if (imgAsp >= canvasAsp) { //图片宽高比较大，适配高
    scale = canvas.height / image.height;
  } else { //屏幕宽高比较大，适配宽
    scale = canvas.width / image.width
  }
  var widthRatio = imageQiu.width * scale / canvas.width;
  var heightRatio = imageQiu.height * scale / canvas.height;
  var offset = 890 * scale / canvas.height;
  var offsetX = 570 * (1 - 2.05 * progress) * scale / canvas.width;

  const vertices = new Float32Array([
    widthRatio - offsetX, -heightRatio - offset, 1.0, 1.0,
    widthRatio - offsetX, heightRatio - offset, 1.0, 0.0,
    -widthRatio - offsetX, -heightRatio - offset, 0.0, 1.0,
    -widthRatio - offsetX, heightRatio - offset, 0.0, 0.0,
  ]);
  vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferQiu);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}


function loadImage(imgPath) {
  return new Promise((resolve, reject) => {
    image = new Image();
    image.premultiplyAlpha = false;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function (err) {
      reject(err);
    };
    image.src = imgPath.replace('#', '%23');
  });
}

function loadImageProg(imgProgPath) {
  return new Promise((resolve, reject) => {
    imageProg = new Image();
    imageProg.premultiplyAlpha = false;
    imageProg.onload = function () {
      resolve(imageProg);
    };
    imageProg.onerror = function (err) {
      reject(err);
    };
    imageProg.src = imgProgPath.replace('#', '%23');
  });
}

function loadImageQiu(imgProgPath) {
  return new Promise((resolve, reject) => {
    imageQiu = new Image();
    imageQiu.premultiplyAlpha = true;
    imageQiu.onload = function () {
      resolve(imageQiu);
    };
    imageQiu.onerror = function (err) {
      reject(err);
    };
    imageQiu.src = imgProgPath.replace('#', '%23');
  });
}

function initTexture() {
  var tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255]));
  return tex;
}

function updateTexture(tex, img) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
}

function draw() {
  gl.enable(gl.DEPTH_TEST);
  // gl.clear(gl.DEPTH_BUFFER_BIT);

  // console.error("DRAW!!!")
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  var uSampler = gl.getUniformLocation(program, 'u_Sampler');
  gl.uniform1i(uSampler, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var vertexFormatLength = 4;
  var aPosition = gl.getAttribLocation(program, 'a_Position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, vertexFormatLength * 4, 0);
  var aTexCoord = gl.getAttribLocation(program, 'a_TexCoord');
  gl.enableVertexAttribArray(aTexCoord);
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, vertexFormatLength * 4, vertexFormatLength * 2);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.useProgram(programProgress);
  var uCurrentProgress = gl.getUniformLocation(programProgress, 'u_CurrentProgress');
  gl.uniform1f(uCurrentProgress, progress);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureProg);
  var uProgSampler = gl.getUniformLocation(programProgress, 'u_Sampler');
  gl.uniform1i(uProgSampler, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferProgress);
  var progVertexFormatLength = 4;
  var aProgPosition = gl.getAttribLocation(programProgress, 'a_Position');
  gl.enableVertexAttribArray(aProgPosition);
  gl.vertexAttribPointer(aProgPosition, 2, gl.FLOAT, false, progVertexFormatLength * 4, 0);
  var aProgTexCoord = gl.getAttribLocation(programProgress, 'a_TexCoord');
  gl.enableVertexAttribArray(aProgTexCoord);
  gl.vertexAttribPointer(aProgTexCoord, 2, gl.FLOAT, false, progVertexFormatLength * 4, progVertexFormatLength * 2);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.flush();

  gl.useProgram(programQiu);
  var uCurrentProgress = gl.getUniformLocation(programQiu, 'u_CurrentProgress');
  gl.uniform1f(uCurrentProgress, progress);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureQiu);
  var uProgSampler = gl.getUniformLocation(programQiu, 'u_Sampler');
  gl.uniform1i(uProgSampler, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferQiu);
  var progVertexFormatLength = 4;
  var aProgPosition = gl.getAttribLocation(programQiu, 'a_Position');
  gl.enableVertexAttribArray(aProgPosition);
  gl.vertexAttribPointer(aProgPosition, 2, gl.FLOAT, false, progVertexFormatLength * 4, 0);
  var aProgTexCoord = gl.getAttribLocation(programQiu, 'a_TexCoord');
  gl.enableVertexAttribArray(aProgTexCoord);
  gl.vertexAttribPointer(aProgTexCoord, 2, gl.FLOAT, false, progVertexFormatLength * 4, progVertexFormatLength * 2);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);




  gl.finish();
}

function tick() {
  rafHandle = requestAnimationFrame(() => {
    if (progress <= 1.01) {
      draw();
      tick();
    }
    if (afterTick) {
      afterTick();
      afterTick = null;
    }
  });
}

function end() {
  clearInterval(timeHandle);
  // cc.view.resizeWithBrowserSize(true);
  //console.error(`????????!!!!!!!!!!!!!![${canvas.width},${canvas.height}]`);

  return new Promise((resolve, reject) => {
    setProgress(1).then(() => {
      cancelAnimationFrame(rafHandle);
      gl.enable(gl.SCISSOR_TEST);
      gl.useProgram(null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.deleteTexture(texture);
      gl.deleteTexture(textureProg);
      gl.deleteTexture(textureQiu);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(vertexBufferProgress);
      gl.deleteBuffer(vertexBufferQiu);
      gl.deleteProgram(program);
      gl.deleteProgram(programProgress);
      gl.deleteProgram(programQiu);
      cc.view.setDesignResolutionSize(800, 1600, 2);
      resolve();
    });
  });
}

//假进度条5秒走完
function setProgress(val) {
  val = val / 2;
  progress = val > progress ? val : progress;
  if (0 == val) {
    if (imageQiu) {
      updateQiuVertexBuffer()
    }
    timeHandle = setInterval(() => {
      if (progress <= 1)
        progress += 0.02
      else
        clearInterval(timeHandle)
      if (imageQiu) {
        updateQiuVertexBuffer()
      }
    }, 100)
  }
  return new Promise((resolve, reject) => {
    afterTick = () => {
      resolve();
    };
  });
}

function start(alpha, antialias, useWebgl2) {
  // _context["import"]("".concat('cc')).view.setDesignResolutionSize(800, 1500, 2);
  // topLevelImport('cc').view.setDesignResolutionSize(800, 1500, 2);
  options.alpha = alpha === 'true' ? true : false;
  options.antialias = antialias === 'false' ? false : true;
  if (useWebgl2 === 'true') {
    gl = window.canvas.getContext("webgl2", options);
  }
  // TODO: this is a hack method to detect whether WebGL2RenderingContext is supported
  if (gl) {
    window.WebGL2RenderingContext = true;
  } else {
    window.WebGL2RenderingContext = false;
    gl = window.canvas.getContext("webgl", options);
  }
  initVertexBuffer();
  initProgressVertexBuffer();
  initQiuVertexBuffer();
  texture = initTexture();
  textureProg = initTexture();
  textureQiu = initTexture();

  program = initShaders(VS_LOGO, FS_LOGO);
  programProgress = initShaders(VS_PROGRESSBAR, FS_PROGRESSBAR);
  programQiu = initShaders(VS_QIU, FS_LOGO);

  tick();
  return loadImage('splash.png').then(() => {
    return loadImageProg('splash_prog.png');
  }).then(() => {
    return loadImageQiu('splash_qiu.png');
  }).then(() => {
    updateVertexBuffer();
    updateTexture(texture, image);
    updateQiuVertexBuffer();
    updateTexture(textureQiu, imageQiu);
    updateProgVertexBuffer();
    updateTexture(textureProg, imageProg);
    return setProgress(0);
  });
}
module.exports = {
  start,
  end,
  setProgress
};

window['firstSceneEnd'] = end;