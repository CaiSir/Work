
import {initShaders, ScaleLinear} from "../../../Utils/LoadShader.js"
import { Poly } from "/Utils/Poly.js"
import { Matrix4,Vector3 } from "https://unpkg.com/three/build/three.module.js"


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
    const viewMatrix = new Matrix4().lookAt(
        new Vector3(0.2,0.3,1),
        new Vector3(),
        new Vector3(0,1,0)
    )
    // const viewMatrix = new Matrix4();
    /* x,z 方向的空间坐标极值 */
    const [minPosX,maxPosX,minPosZ,maxPosZ] = [
        -0.7,0.8,-1, 1
    ]
   
    // x,z方向的弧度极值
    const [minAngX,maxAngX,minAngZ,maxAngZ] = [
        0, Math.PI * 4, 0, Math.PI * 2 
    ]

    const scalerX = ScaleLinear(minPosX,minAngX,maxPosX,maxAngX);
    const scalerZ= ScaleLinear(minPosZ,minAngZ,maxPosZ,maxAngZ);

    const wave = new Poly({
        gl,
        vertices: crtVertices(),
        uniforms:{
            u_ViewMatrix:{
                type: 'uniformMatrix4fv',
                value : viewMatrix.elements
            }
        },
        size:3,
    });
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateVertices();
    wave.updateBuffer();
    wave.draw();

    var offset = 0;
    (function ani(){
        offset += 0.03;
        updateVertices(offset)
        wave.updateBuffer();
        gl.clear(gl.COLOR_BUFFER_BIT);
        wave.draw();
        requestAnimationFrame(ani);
    })()


    function crtVertices(offset = 0)
    {
        var vertices = [];
        // 创建点信息
        for (let z = minPosZ ; z < maxPosZ ;z +=0.03)
        {
            for(let x = minPosX;x < maxPosX ; x+=0.03)
            {
                vertices.push(x,0,z);
            }
        }
        return vertices;
    }

    
    function updateVertices(offset = 0)
    {
        const { vertices } = wave
        for(let i = 0; i < vertices.length ; i +=3)
        {
            const [posX,posZ] = [vertices[i],vertices[i+2]]
            const angZ = scalerZ(posZ); // Z位置对应的弧度
            const Omega = 2;
            //const a = 0.05;
            //const phi  = 0;
            const a = Math.sin(angZ) * 0.05 + 0.03; // 影响波动幅度
            const phi = scalerX(posX) + offset;     // X轴的偏移值
            vertices[i+1] = SinFn(a,Omega,phi)(angZ);
            
        }

    }

    /* 
        y= ASin(wX+phi)
    */
    function SinFn(a,Omega,phi)
    {
        return function(x){
            return a * Math.sin(Omega * x + phi);
        }
    }

 
};




function GetVertexData()
{
    return new Float32Array([
         0.0,  0.0,  0.0, 
         2.0,  5.0, -15.0, 
        -1.5, -2.2, -2.5,  
        -3.8, -2.0, -12.3,  
         2.4, -0.4, -3.5,  
        -1.7,  3.0, -7.5,  
         1.3, -2.0, -2.5,  
         1.5,  2.0, -2.5, 
         1.5,  0.2, -1.5, 
        -1.3,  1.0, -1.5  
    ]);
}

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


export { main }