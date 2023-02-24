
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

    /* Y 方向上的坐标极值 */
    const [a1,a2] = [0.1,0.03];
    const a12 = a1 + a2;
    const [minY,maxY] = [-a12,a12];

    /*色相极值*/
    const [minH,maxH] = [0.1,0.55];

    const scalerC = ScaleLinear(minY,minH,maxY,maxH);

    const color = new Color();

    // 波浪的行和列
    const [rows,cols] = [50, 50];

    const a_Position = {size:3,index:0};
    const a_Color = {size:4,index:3};

    const categorySize = a_Position.size + a_Color.size;

    
    const wave = new PolyEx({
        gl,
        source: getSource(cols,rows,
            minPosX,maxPosX,minPosZ,maxPosZ),
        uniforms:{
            u_ViewMatrix:{
                type: 'uniformMatrix4fv',
                value : viewMatrix.elements
            },
        },
        attributes:{
            a_Position:a_Position,
            a_Color:a_Color,
        },
 
    });
    updateSource();
    render();

    var  offset = 0;
    !(function ani(){
        offset += 0.03;
        updateSource(offset)
        render();
        requestAnimationFrame(ani);
    })()

    function getSource(cols,rows,minPosX,maxPosX,minPosZ,maxPosZ)
    {
        const source =[];
        const spaceZ = (maxPosZ - minPosZ )/rows;
        const spaceX = (maxPosX- minPosX) /cols;
        for(let z = 0 ; z < rows; z++)
        {
            for (let x = 0; x< cols; x++)
            {
                const px = x * spaceX + minPosX;
                const pz = z * spaceZ + minPosZ;
                source.push(px,0, pz ,1,0,0,1);
            }
        }
        return source;
    }

    function updateSource(offset = 0)
    {
        const {source,categorySize} = wave;
        for(let i = 0; i < source.length ; i +=categorySize)
        {
            const [posX,posZ] = [source[i],source[i+2]]
            const angZ = scalerZ(posZ); // Z位置对应的弧度
            const Omega = 2;

            const a = Math.sin(angZ) * a1 + a2; // 影响波动幅度
            const phi = scalerX(posX) + offset;     // X轴的偏移值
            const y = SinFn(a,Omega,phi)(angZ); 
            source[i+1] = y;
            const h = scalerC(y);
            const {r,g,b} = color.setHSL(h,1,0.6);
            source[i+3] = r;
            source[i+4] = g;
            source[i+5] = b;
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

    function render()
    {
        wave.updateAttribute();
        gl.clear(gl.COLOR_BUFFER_BIT);
       // wave.draw();
        wave.draw('LINES');
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