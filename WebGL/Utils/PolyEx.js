
// 封装画多边形对象。

const defAttr = () =>({
    gl:null,
    type:'POINTS',   
    source :[],  
    sourceSize:0,   // 顶点数量
    elementBytes:4,
    categorySize:0,  // 类目尺寸
    attributes:{},  
    uniforms:{},     
    
})
/*attributes:{
    key:{
            size:3,
            index:0
        },
    }
    uniforms:{
        key:{
            type:'',
            value:''
        }
    }
*/

export default class PolyEx{
    constructor(attr)
    {
        Object.assign(this,defAttr(),attr);
        this.init();
    }
    init()
    {
        if(!this.gl){return ;}
        this.calculateSize();
        this.updateAttribute();
        this.updateUniform();
    }
    calculateSize()
    {
        const {attributes,elementBytes,source} = this;
        let categorySize = 0;
        Object.values(attributes).forEach(ele =>{
            const {size,index} = ele;
            categorySize += size;
            ele.byteIndex = index*elementBytes ;
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
            var attr = gl.getAttribLocation(gl.program,key);
            gl.vertexAttribPointer(attr,size,gl.FLOAT,false,categoryBytes,byteIndex);
            gl.enableVertexAttribArray(attr);
        }
    }

    updateUniform()
    {
        const {gl,uniforms} = this;
        for (let [key,val] of Object.entries(uniforms))
        {
            const {type,value} = val
            const u = gl.getUniformLocation(gl.program,key);
            if(type.includes('Matrix'))
            {
                gl[type](u,false,value);
            }else
            {
                gl[type](u,value);
            }
        }
    }

    updateBuffer(...params) {
        const {gl,source} = this; 
        this.calculateSize();
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(source),gl.STATIC_DRAW);
        this.updateUniform();
    }
    
    draw(type = this.type)
    {
        const {gl,sourceSize} = this;
        gl.drawArrays(gl[type],0,sourceSize);
    }
    

}

export { PolyEx }