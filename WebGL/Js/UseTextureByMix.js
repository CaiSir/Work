
import {initShaders} from "../Utils/LoadShader.js"
import { Matrix4 } from "https://unpkg.com/three/build/three.module.js"


const vsSourceStr =
"   attribute vec4 a_Position; \
    attribute vec2 a_Color; \
    varying vec2 v_Color; \
    void main(){   \
        gl_Position =  a_Position; \
        v_Color = a_Color; \
    } \
";
const fsSourceStr =
"   precision mediump float; \
    uniform sampler2D u_sampler; \
    varying vec2 v_Color; \
    void main() { \
        gl_FragColor = texture2D(u_sampler,v_Color); \
}";

function main()
{
    
    var gl = CreateCanvas();
    var imgurl = "wall.jpg";
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }
    MakeShader(gl);
    LoadImg(imgurl)
        .then( (e) => {
            MakeTexture(gl,e);
        });
};

function GetVertexData()
{
    return new Float32Array([
        // 位  置   纹  理
        //  -0.5, 0.5,  0.0,1.0,
        //  -0.5,-0.5, 0.0,0.0,
        //   0.5,-0.5, 1.0,0.0,
        //   0.5, 0.5,  1.0,1.0,  
        -0.5,0.5,0.0,1.0,
        -0.5,-0.5,0.0,0.0,
        0.5,0.5,1.0,1.0,
        0.5,-0.5,1.0,0.0, 
    ]);
}

function LoadImg(url)
{   
    return new Promise((resolve,reject) =>
    {
        console.log('Promise');
        var img = new Image();
        img.onload = () => { resolve(img) };
        img.onerror = (e)=> { reject(e);}
        img.src = url;
        console.log(img);
    });
}

function CreateCanvas()
{
    console.log('CreateCanvas');
    const canvas = document.createElement('canvas');
    document.querySelector('body').appendChild(canvas);
    console.log(canvas);
    canvas.width = 400;
    canvas.height = 600;
    // canvas.width = window.width;
    // canvas.height = window.height;
    const gl = canvas.getContext('webgl');
    return gl;
}
/**  @param {!WebGLRenderingContext} gl */ 
function MakeShader(gl)
{
    const vertexData = GetVertexData();
    console.log(vertexData);
    var FSIZE = vertexData.BYTES_PER_ELEMENT;
    var vertexBuffer = gl.createBuffer();
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
    gl.activeTexture(gl.TEXTURE0);
    const textureData = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,textureData);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    var u_sample = gl.getUniformLocation(gl.program,'u_sampler');
    gl.uniform1i(u_sample,0);
    gl.clearColor(1.0,1.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}

export 
{
    main
}