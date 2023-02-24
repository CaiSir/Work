
import {initShaders, ScaleLinear} from "../../../Utils/LoadShader.js"
import { PolyEx } from "/Utils/PolyEx.js"
import { Matrix4,Vector3,Quaternion,Plane,Ray,Color } from "https://unpkg.com/three/build/three.module.js"


function main()
{
    
    var gl = CreateCanvas();
    gl.clearColor(0.0,0.0,0.0,1.0);
    const vsSourceStr = document.querySelector('#VertexShader').innerText;
    const fsSourceStr = document.querySelector('#FragmentShader').innerText;
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }
    const u_ModelMatrix = new Matrix4();
    // 设置 
    var a_Position = { size:3 , index: 0};
    var a_TextCoord = {size: 2, index :3};
    const poly = new PolyEx({
        gl,
        source: GetVertexData(),
        attributes:{
            a_Position,
            a_TextCoord,
        },
        uniforms:{
            type:'uniformMatrix4fv',
            value:u_ModelMatrix.elements,
        }
    
    });

    Render();
    
    function Render()
    {
        gl.clear(COLOR_BIT_BUFFER);
        poly.draw();
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