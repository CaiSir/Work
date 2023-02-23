
// 封装画多边形对象。

const defAttr = () =>({
    gl:null,
    types:['POINTS'],   
    source :[],  
    sourceSize:0,   // 顶点数量
    elementBytes:4,
    categoryBytes:0,
    categorySize:0,  // 类目尺寸
    attributes:{},  
    uniforms:{},     
    
})

export default class Poly{
    constructor(attr)
    {
        Object.assign(this,defAttr(),attr);
        this.init();
    }
    init()
    {
        if(!this.gl){return ;}
        this.categorySourceSize();
        this.updateAttribute();
        this.updateUniform();
    }
    categorySourceSize()
    {
        const {attributes,elementBytes,source} = this;
        let categorySize = 0;
        Object.values(attributes).forEach(ele =>{
            const {size,index} = ele;
            categorySize+= size;
            ele.byteIndex = index * elementBytes;
        })
        this.categorySize = categorySize;
        this.categoryBytes = categorySize * elementBytes;
        this.sourceSize = source.length / categorySize;
    }

    updateAttribute()
    {
        const {gl,attributes,categoryBytes,source} = this
        const sourceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,sourceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(source),gl.STATIC_DRAW);
        for(let [key ,{size,byteIndex}] of Object.entries(attributes)){
            const attr = gl.getAttribLocation(gl.program,key);
            gl.vertexAttribPointer(attr,size,gl.FlOAT,false,categoryBytes,byteIndex);
            gl.enableVertexAttribArray(attr);
        }
    }

    updateUniform()
    {
        const {gl,uniforms} = this;
        for (let [key,{type,value}] of Object.entries(uniforms))
        {
            var unifo = gl.getUniformLocation(gl.program,key);
            console.log(gl[type]);
            if(type.includes('Matrix'))
            {
                gl[type](unifo,false,value);
            }else
            {
                gl[type](unifo,value);
            }
        }
    }

    draw(types = this.types)
    {
        const {gl,count} = this;
        for(let type of types)
        {
            gl.drawArrays(gl[type],0,count);
        }
    }
    

}

export { PolyEx }