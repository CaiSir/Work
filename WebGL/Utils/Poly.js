
// 封装画多边形对象。
const defAttr = () =>({
    gl:null,
    vertices :[],  // 顶点数据对象
    geoData:[],    // 模型数据，对象数据，可解析出vertices顶点数据
    size :2,       // 顶点分量的数目
    attrName :"a_Position",
    uniforms:{},     // 使用{} 代表对象的初始化
    count:0,        // 顶点个数
    types:['POINTS']   // 绘图方式
})

export default class Poly{
    constructor(attr)
    {
        Object.assign(this,defAttr(),attr);
        this.init();
    }

    init()
    {
        // ES6 解构赋值
        const {attrName,size,gl} = this;
        if(!gl)
            return;
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        this.updateBuffer(gl);
        const a_Position =  gl.getAttribLocation(gl.program ,attrName);
        gl.vertexAttribPointer(a_Position,size,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(a_Position); 
        this.updateUniform();
    }
    // 增加顶点
    addVertice(...params)
    {
        this.vertices.push(...params);
        this.updateBuffer();
    }
    
    popVertice(...params)
    {
        const {vertices,size} = this;
        const len = vertices.length;
        vertices.splice(len-size,len);
        this.updateCount();
    }

    setVertice(ind,...params)
    {
        const {vertices,size } = this;
        const i = ind * size;
        params.forEach((param,paramInd) =>{
            vertices[i+paramInd] = param;
        })
    }

    updateUniform()
    {
        const {gl,uniforms} = this;
        for(let [key,val] of Object.entries(uniforms))
        {
            const {type,value} = val;
            const u = gl.getUniformLocation(gl.program,key);
            if(type.includes('Matrix'))
            {
                gl[type](u,false,value)
            }else
            {
                gl[type](u,value);
            }

        }
    }

    updateBuffer(...params) {
        const {gl,vertices} = this; 
        this.updateCount();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    }

    updateCount()
    {
        this.count = this.vertices.length / this.size;
    }

    updateVertices(params)
    {
        const {geoData } = this;
        const vertices = [];
        geoData.forEach(data => {
            params.forEach(key =>{
                vertices.push(data[key])
            })
        })
        this.vertices = vertices;
    }
    draw(types = this.types)
    {
        const {gl,count} = this;
        for(let type of types)
        {
            gl.drawArrays(gl[type],0,count);
        }
    }

    render()
    {
        const {gl,vertices} = this; 
        
    }

}

export { Poly }