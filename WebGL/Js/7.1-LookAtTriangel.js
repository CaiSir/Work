
import {initShaders} from "../Utils/LoadShader.js"
import { Matrix4,Vector3 } from "https://unpkg.com/three/build/three.module.js"

var g_u1 = false,g_u0 = false;
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
    MakeShaderThree(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,9);
};

function GetVertexData()
{
    return new Float32Array([
        // 位  置   纹  理
        //  -0.5, 0.5,  0.0,1.0,
        //  -0.5,-0.5, 0.0,0.0,
        //   0.5,-0.5, 1.0,0.0,
        //   0.5, 0.5,  1.0,1.0,  
        -0.5 ,0.5,   0.0, 1.0,    0.0, 1.0,
        -0.5 ,-0.5,  0.0, 0.0,    0.0, 0.0, 
        0.5 ,0.5,    1.0, 1.0,    1.0,  1,
        0.5 ,-0.5,   1.0, 0.0,    1.0, 0.0,
    ]);
}

function GetVertexDataThree()
{
    return new Float32Array([
        0.0 ,0.5,   -0.4, 0.4,    1.0, 0.4,
        -0.5 ,-0.5,  -0.4,  0.4,   1.0, 0.4,
        0.5 ,-0.5,   -0.4, 1.0,    0.4, 0.4,

        0.5 ,0.4,   -0.2, 1.0,    0.4, 0.4,
        -0.5 ,0.4,  -0.2,  1.0,   1.0, 0.4,
        0.0 ,-0.6,   -0.2, 1.0,    1.0, 0.4,

        0.0 ,0.5,   0.0, 0.4,    0.4, 1.0,
        -0.5 ,0.5,  0.0,  0.4,   0.4, 1.0,
        0.5 ,-0.5,   0.0, 1.0,    0.4, 0.4,
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl');
    return gl;
}

/**  @param {!WebGLRenderingContext} gl */ 
function MakeShaderThree(gl)
{
    console.log('Make ShaderThree')
    const vertexData =  GetVertexDataThree();
    var FSIZE = vertexData.BYTES_PER_ELEMENT;
   // var nCount = vertexData / FSIZE 
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertexData,gl.STATIC_DRAW);
    var a_Position =  gl.getAttribLocation(gl.program ,'a_Position');
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE*6,0);
    var a_Color  = gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE* 6,FSIZE * 3);

    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ViewMatrix');
    var matrix4 = new Matrix4();
    // lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) 
    console.log(matrix4.elements);
    //matrix4.lookAt(new Vector3(0.2,0.25,0.25),new Vector3(0,0,0),new Vector3(0,1,0));
    //console.log(matrix4.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,matrix4.elements);


}


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

export { main }