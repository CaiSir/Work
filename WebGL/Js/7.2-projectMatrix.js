
import {initShaders} from "../Utils/LoadShader.js"
import { Matrix4,Vector3 } from "https://unpkg.com/three/build/three.module.js"

var g_u1 = false,g_u0 = false;
var matrix4 = new Matrix4();
function main()
{
    var near = 1.0, far = 100.0;
    var gl = CreateCanvas();
    gl.clearColor(0.0,0.0,0.0,1.0);
    const vsSourceStr = document.querySelector('#VertexShader').innerText;
    const fsSourceStr = document.querySelector('#FragmentShader').innerText;
    if (!initShaders(gl,vsSourceStr,fsSourceStr))
    {
        console.log("initShader error")
        return;
    }

    document.onkeydown = function(event)
    {
        console.log(event.key);
        var off = 0.01;
        switch (event.key) {
            case "ArrowUp":
              // 按“↑”方向键时要做的事。
                near +=off;
              break;
            case "ArrowDown":
                near -=off;
              // 按“↓”方向键时要做的事。
              break;
            case "ArrowLeft":
                far+= off;
              // 按“←”方向键时要做的事。
              break;
            case "ArrowRight":
                far -= off;
              // 按“→”方向键时要做的事。
              break;
            case "Enter":
              // 按“回车”键时要做的事。
              break;
            case "Escape":
              // 按“ESC”键时要做的事。
              break;
            default:
              return; // 什么都没按就退出吧。
          }
        OnKeyDownOrtho(gl,near, far);
    };

    MakeShaderThree(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,9);
};


// makeOrthographic ( left : Float, right : Float, top : Float, bottom : Float, near : Float, far : Float ) : this
function OnKeyDownOrtho(gl,near,far)
{
    var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ProjectMatrix');
    console.log(matrix4.elements);
    matrix4.makeOrthographic(-1.0,1.0,-1.0,1.0,near,far);
    console.log(matrix4.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,matrix4.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,9);

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
        -0.5 ,-0.5,  0.0,  0.4,   0.4, 1.0,
        0.5 ,-0.5,   0.0, 1.0,    0.4, 0.4,
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

    var u_ViewMatrix = gl.getUniformLocation(gl.program,'u_ProjectMatrix');
    //var matrix4 = new Matrix4();
    // lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) 
    //matrix4.lookAt(new Vector3(0.2,0.25,0.25),new Vector3(0,0,0),new Vector3(0,1,0));
    //console.log(matrix4.elements);

    // makeOrthographic ( left : Float, right : Float, top : Float, bottom : Float, near : Float, far : Float ) : this

    //matrix4.lookAt(eyeVec3,new Vector3(0,0,0),new Vector3(0,1,0));

    // matrix4.rotato();
    console.log(matrix4);
    gl.uniformMatrix4fv(u_ViewMatrix,false,matrix4.elements);


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
      
        // if (event.ctrlKey) {
        //   // Even though event.key is not 'Control' (e.g., 'a' is pressed),
        //   // event.ctrlKey may be true if Ctrl key is pressed at the same time.
        //   console.log(`Combination of ctrlKey + ${keyName}`);
        // } else {
        //     console.log(`Key pressed ${keyName}`);
        // }
      }, false);
      
//       document.addEventListener('keyup', (event) => {
//         const keyName = event.key;
      
//         // As the user releases the Ctrl key, the key is no longer active,
//         // so event.ctrlKey is false.
//         if (keyName === 'Control') {
//             console.log('Control key was released');
//         }
//       }, false);
 }
export { main }