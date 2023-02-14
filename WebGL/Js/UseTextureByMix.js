
import {initShaders} from "../Utils/LoadShader.js"
import { Matrix4 } from "https://unpkg.com/three/build/three.module.js"


const vsSourceStr =
"   attribute  vec4 a_Position; \
    attribute vec2 a_Color; \
    varying vec2 v_Color; \
    void main(){   \
         g_Position =  a_Position; \
         v_Color = a_Color; \
    } \
";
const fsSourceStr =
"   uniform sample2d u_texture; \
    varying vec2 v_Color; \
    void main() { \
        g_FragColor = texture2D(u_texture,v_Color); \
}";

function main()
{
    
    var gl = CreateCanvas();
    var imgurl = 'img/wall.jpg';
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }
    MakeShader(gl);
    LoadImg(imgurl)
        .then(e => {
            MakeTexture(gl,e);
        });
};

function GetVertexData()
{
    return new Float32Array([
        // 位  置   纹  理
         -0.5, 0.5,  1.0,1.0,
         -0.5,-0.5, 1.0,1.0,
          0.5,-0.5, 1.0,1.0,
          0.5, 0.5,  1.0,1.0,   
    ]);
}

function LoadImg(url)
{   
    return new Promise((resolve,reject) =>
    {
        var img = new Image();
        img.onload = () => { resolve(url) };
        img.onerror = (e)=> { reject(e);}
        img.src = url;
    });
}

function CreateCanvas()
{
    const canvas = document.createElement('canvas');
    document.querySelector('body').appendChild(canvas);
    canvas.width = window.width;
    canvas.height = window.height;
    const gl = canvas.getContext('webgl');
    return gl;
}
/**  @param {!WebGLRenderingContext} gl */ 
function MakeShader(gl)
{
    const vertexData = GetVertexData();
    var FSIZE = vertexData.BYTES_PER_ELEMENT;
    var vertexBuffer = gl.CreateBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexData,gl.STATIC_DRAW);
    var a_Position =  gl.getAttribLocation(gl.program ,'a_Position');
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
    var a_Color = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
}

/** @param {!WebGLRenderingContext} gl  */
function MakeTexture(gl,image)
{
    const textureData = gl.createTexture();
    var u_sample = gl.getUniformLocation(gl.program,'u_texture');
    gl.uniform1i(u_sample,0);
    gl.bindTexture(gl.ARRAY_BUFFER,textureData);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.RGB,image);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.activeTexture(gl.TEXTURE0);
    gl.clearColor(1.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export {main}