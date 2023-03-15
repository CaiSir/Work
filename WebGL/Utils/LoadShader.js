        function initShaders(gl, vsSource, fsSource) {

            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

            // 创建着色器程序

            const shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            // 创建失败，alert
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return false;
            }
            gl.useProgram(shaderProgram);
            gl.program = shaderProgram;
            return true;
        }

        // 创建指定类型的着色器，上传 source 源码并编译
        //
        function loadShader(gl, type, source) {
            const shader = gl.createShader(type);

            // Send the source to the shader object

            gl.shaderSource(shader, source);

            // Compile the shader program

            gl.compileShader(shader);

            // See if it compiled successfully

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }


        // 线性比例尺  线性方程   y = ax + b;
        function  ScaleLinear(ax,ay,bx,by)
        {
            const delta = {
                x:bx-ax,
                y:by-ay,
            };
            const k = delta.y /delta.x;
            const b = ay -  ax*k;
            return function(x)
            {
                return k*x + b;
            }
        }

        // 加载图片
        function LoadImg(img)
        {
            return new Promise((resolve)=>
            {
                img.onload = () => { resolve(img) };
            });
        }

        function createProgram(gl, vsSource, fsSource) {
            //创建程序对象
            const program = gl.createProgram();
            //建立着色对象
            const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
            const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
            //把顶点着色对象装进程序对象中
            gl.attachShader(program, vertexShader);
            //把片元着色对象装进程序对象中
            gl.attachShader(program, fragmentShader);
            //连接webgl上下文对象和程序对象
            gl.linkProgram(program);
            return program
          }
          


export 
{
    initShaders,
    ScaleLinear,
    LoadImg,
    createProgram
}