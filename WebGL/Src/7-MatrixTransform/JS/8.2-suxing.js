
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

    function crtVertices(offset = 0)
    {
        var vertices = [];
        // 创建点信息
        for (let z = minPosZ ; z < maxPosZ ;z +=0.1)
        {
            for(let x = minPosX;x < maxPosX ; x+=0.1)
            {
                vertices.push(x,0,z);
            }
        }
        return vertices;
    }

    
    function updateVertices()
    {
        const {vertices } = wave
        for(let i =0; i< vertices.length ; i +=3)
        {
            const [posX,posZ] = [vertices[i],vertices[i+2]]
            const angZ = scalerZ(posZ);
            const Omega =2;
            const a = 0.05;
            const phi  = 0;
            // const a = Math.sin(angZ) * 0.1+ 0.3;
            // const phi = scalerX(posX);
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
    const gl = canvas.getContext('webgl');
    return gl;
}
var eyeVec3 = new Vector3(0.2,0.25,0.25);

/**  @param {!WebGLRenderingContext} gl */ 
function MakeShader(gl)
{
    console.log('make shader')
    const vertexData = GetVertexData();
    var FSIZE = vertexData.BYTES_PER_ELEMENT;
   // var nCount = vertexData / FSIZE 
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexData,gl.STATIC_DRAW);
    var a_Position =  gl.getAttribLocation(gl.program ,'a_Position');
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*6,0);
    var a_Color  = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttrib4f(a_Color,1.0,0.0,0.0,1.0);

    var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
    var matrix4 = new Matrix4();
    // lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) 
    console.log(matrix4.elements);
    matrix4.lookAt(new Vector3(0.0,0.0,1.0),new Vector3(1,0,0),new Vector3(0,1,0));
    //console.log(matrix4.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,matrix4.elements);

    gl.enableVertexAttribArray(a_Position);
}

/** @param {!WebGLRenderingContext} gl  */
function MakeTexture(gl,image,nIndex)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    var samplerName ='';
    if(nIndex == 0 ){
        gl.activeTexture(gl.TEXTURE0);
        g_u0 = true;
        samplerName ='u_Sampler';
    }else if(nIndex== 1)
    { 
        gl.activeTexture(gl.TEXTURE1);
        g_u1 = true;
        samplerName ='u_FlowerSampler';
    }
    console.log(samplerName);
    const textureData = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,textureData);
    gl.generateMipmap(gl.TEXTURE_2D);
    var u_sample = gl.getUniformLocation(gl.program, samplerName);
    //* 问题1：如果这里使用的多级渐变，显示不出纹理,当开启多级渐变时，浏览器提示，该花色不支持多级渐变
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); 
    // gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.GL_CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    gl.uniform1i(u_sample,nIndex);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(g_u0 && g_u1) 
    {
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }  
}
function loadTexture(gl,texture,u_Sampler,image)
{
    console.log('loadTexture');
    // 对纹理进行Y轴翻转,WEBGL纹理坐标系统的t轴的方向和PNG、BMP、JPG等格式图片的坐标系统的Y轴方向是相反的。（或者在着色器中进行翻转）
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); 
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0); //使用纹理单元时需要激活
    // 告诉WEBGL系统纹理对象使用的是哪种纹理
    gl.bindTexture(gl.TEXTURE_2D, texture);
 
    // 配置纹理填充方式
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

       // 将纹理图像分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

   // gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(u_Sampler,0);
}


function OnKeyLeft(gl,flg)
{
    eyeVec3.x += flg;
    console.log(eyeVec3);
    var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
    matrix4.lookAt(eyeVec3,new Vector3(0,0,0),new Vector3(0,1,0));
    
    gl.uniformMatrix4fv(u_ViewMatrix,false,matrix4.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,9);
}

function OnKeyBoard(gl)
{
    var f = 0.01;
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
      
        if (keyName === 'ArrowLeft') 
        {
            console.log('move left 0.01');
            OnKeyLeft(gl,f);
        }
        else if(keyName === 'ArrowRight')
        {
            OnKeyLeft(gl,-f);
        }
      
      }, false);
      
 }
export { main }