
import {initShaders, ScaleLinear,LoadImg} from "../../../Utils/LoadShader.js"
import {Track} from "../../../Utils/Track.js"
import { PolyEx } from "/Utils/PolyEx.js"
import { Matrix4,Vector3,Quaternion,Plane,Ray,Color } from "https://unpkg.com/three/build/three.module.js"

const vsSourceStr = 
`
    attribute vec4 a_Position;
    attribute vec2 a_Pin;
    varying vec2 v_Pin;
    void main(){
        gl_Position = a_Position;
        v_Pin= a_Pin;
    }
`
const fsSourceStr =
`
    precision mediump float;
    uniform sampler2D u_Sampler;
    uniform sampler2D u_Pattern;
    uniform float u_Ratio;
    varying vec2 v_Pin;
    void main(){
        vec4 o = texture2D(u_Sampler,v_Pin);
        vec4 p = texture2D(u_Pattern,v_Pin);
        gl_FragColor = mix(o,p,u_Ratio);
    }  
`

function CreateCanvas()
{
    console.log('CreateCanvas');
    const canvas = document.createElement('canvas');
    document.querySelector('body').appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    const gl = canvas.getContext('webgl');
    return gl;
}

function GetVertexData()
{
    return new Float32Array([
        -0.4, 0.8, 0, 1,
        -0.4, -0.8, 0, 0,
        0.4, 0.8, 1, 1,
        0.4, -0.8, 1, 0,
      ]);
}

function main()
{
    
    var gl = CreateCanvas();
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.CULL_FACE);
    // gl.enable(gl.DEPTH_TEST);
    
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }
    
    let n = 0
    let len = 5
    const obj = { ratio: 0 }
    let track = null;

    const vertexDatas = GetVertexData();
    const vSize = vertexDatas.BYTES_PER_ELEMENT;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexDatas,gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    gl.vertexAttribPointer(a_Position,2 ,gl.FLOAT,false, vSize*4, 0);
    var a_Pin = gl.getAttribLocation(gl.program,'a_Pin');
    gl.vertexAttribPointer(a_Pin,2,gl.FLOAT,false, vSize*4,vSize*2);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Pin);
    LoadingImg();
   

    function LoadingImg(){
        n++;
        var i1 = n % len
        var i2 = (n + 1) % len
        var oriImg = new Image();
        oriImg.src = `../../../img/pattern${i1}.jpg`;
        var patternImg = new Image();
        patternImg.src = `../../../img/pattern${i2}.jpg`;

        Promise.all([
            LoadImg(oriImg),
            LoadImg(patternImg)
        ]).then(()=>{
            changeImg(oriImg,patternImg);
            ani();
        })
    }

    function Render()
    {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }

    function changeImg(...imgs) {
        obj.ratio = 0
      
        // rect.maps = {
        //   u_Sampler: { image: imgs[0] },
        //   u_Pattern: { image: imgs[1] },
        // }
        // var uRatio = gl.getUniformLocation(gl.program,'u_Ratio');
        // gl.uniform1i(uRatio,obj.ratio);
        imgLoad(imgs[0],0,'u_Sampler');
        imgLoad(imgs[1],1,'u_Pattern');
        // rect.updateMaps()
        track = new Track(obj);
        track.start = new Date();
        track.timeLen = 1500;
        track.onEnd = LoadingImg
        track.keyMap = new Map([
          [
            "ratio",
            [
              [0, 0],
              [1000, 1]
            ],
          ],
        ]);
      }

/**
 * 
 * @param {Image} img 
 * @param {Number} ind 
 * @param {String} val 
 * @returns 
 */
    function imgLoad(img,ind,val){

        var uValue = gl.getUniformLocation(gl.program,val);
        if(!uValue){
            console.log(`获取不到这个uniform: ${val}`);
            return;
        }
        gl.activeTexture(gl[`TEXTURE${ind}`]);
        const texture =  gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
       // gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.UNSIGNED_BYTE,img);
    //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    
        gl.uniform1i(uValue,ind);
    }



      function ani()
      {
        track.update(new Date())
        var u_Ratio = gl.getUniformLocation(gl.program,'u_Ratio');
        gl.uniform1f(u_Ratio,obj.ratio);
        console.log(obj.ratio);
        Render()
        requestAnimationFrame(ani)
      }

};
export { main }