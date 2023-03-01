
import {initShaders, ScaleLinear} from "../../../Utils/LoadShader.js"
import { PolyEx } from "/Utils/PolyEx.js"
import { Matrix4,Vector3,Quaternion,Plane,Ray,Color } from "https://unpkg.com/three/build/three.module.js"


function main()
{
    
    var gl = CreateCanvas();
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    const vsSourceStr = document.querySelector('#VertexShader').innerText;
    const fsSourceStr = document.querySelector('#FragmentShader').innerText;
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }

  //  const u_ModelMatrix = new Matrix4()
    const u_ModelMatrix = new Matrix4().lookAt(
        new Vector3(0.2,0.3,1),
        new Vector3(),
        new Vector3(0,1,0)
    ) 
    // 设置 
    var a_Position = { size:3 , index: 0 };
    var a_TextCoord = { size: 2, index :3 };
    const poly = new PolyEx({
        gl,
        source: GetVertexData(),
        attributes:{
            a_Position,
            a_TextCoord,
        },
        uniforms:{
            u_ModelMatrix: {
                type:'uniformMatrix4fv',
                value:u_ModelMatrix.elements,
            }
           
        }
    
    });

    var imgPath = "../../../img/mf.jpg";
    Render();
    ImgOnload(gl,poly,imgPath);

    var  offset = 0;
    !(function ani(){
        offset += 0.01;
        
        render();
        requestAnimationFrame(ani);
    })()


    function Render()
    {
        gl.clear(gl.COLOR_BUFFER_BIT);
        poly.draw('TRIANGLES');
    }


    function ImgOnload()
    {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var img = new Image();
        img.onload = function()
        {
            gl.activeTexture(gl.TEXTURE0);
        
            var sample2D = gl.getUniformLocation(gl.program,'u_Sampler');
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D,)
        
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img); // 指定二维纹理图像
            gl.uniform1i(sample2D,0);
            
            Render();
        };
        img.src = imgPath;
    }

};





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



function GetVertexDataIndex()
{
    return new Float32Array([
        0, 1,  2,
        1, 3,  2,
        4, 5,  6,
        5, 7,  6,
        8, 9,  10,
        9, 11, 10,
        12,13, 14,
        13,15, 14,
    ]);
}


function GetVertexData()
{
    return new Float32Array([
    //      // 第一个三角形
    // 0.5, 0.5, 0.0,   0, 0, // 右上角
    // 0.5, -0.5, 0.0,  0, 0, // 右下角
    // -0.5, 0.5, 0.0,  0, 0, // 左上角
    // // 第二个三角形
    // 0.5, -0.5, 0.0,  0, 0, // 右下角
    // -0.5, -0.5, 0.0,  0, 0,// 左下角
    // -0.5, 0.5, 0.0 , 0, 0, // 左上角


        -0.5, -0.5, -0.5, 0, 0,
        -0.5, 0.5, -0.5, 0, 0.5,
        0.5, -0.5, -0.5, 0.25, 0,
        -0.5, 0.5, -0.5, 0, 0.5,
        0.5, 0.5, -0.5, 0.25, 0.5,
        0.5, -0.5, -0.5, 0.25, 0,
  
        -0.5, -0.5, 0.5, 0.25, 0,
        0.5, -0.5, 0.5, 0.5, 0,
        -0.5, 0.5, 0.5, 0.25, 0.5,
        -0.5, 0.5, 0.5, 0.25, 0.5,
        0.5, -0.5, 0.5, 0.5, 0,
        0.5, 0.5, 0.5, 0.5, 0.5,
  
        -0.5, 0.5, -0.5, 0.5, 0,
        -0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, -0.5, 0.75, 0,
        -0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.5, 0.5, 0.75, 0.5,
        0.5, 0.5, -0.5, 0.75, 0,
  
        -0.5, -0.5, -0.5, 0, 0.5,
        0.5, -0.5, -0.5, 0.25, 0.5,
        -0.5, -0.5, 0.5, 0, 1,
        -0.5, -0.5, 0.5, 0, 1,
        0.5, -0.5, -0.5, 0.25, 0.5,
        0.5, -0.5, 0.5, 0.25, 1,
  
        -0.5, -0.5, -0.5, 0.25, 0.5,
        -0.5, -0.5, 0.5, 0.25, 1,
        -0.5, 0.5, -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5, 0.25, 1,
        -0.5, 0.5, 0.5, 0.5, 1,
        -0.5, 0.5, -0.5, 0.5, 0.5,
  
        0.5, -0.5, -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5, 0.75, 0.5,
        0.5, -0.5, 0.5, 0.5, 1,
        0.5, -0.5, 0.5, 0.5, 1,
        0.5, 0.5, -0.5, 0.75, 0.5,
        0.5, 0.5, 0.5, 0.75, 1,
      ]);
}

export { main }