
// 封装画多边形对象。
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

    maps:{

    }
*/

const defAttr = () =>({
    gl:null,
    type:'POINTS',   
    source :[],  
    sourceSize:0,    // 顶点数量
    elementBytes:4,
    categorySize:0,  // 类目尺寸
    attributes:{},  
    uniforms:{},     
    maps:{}            
})
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
        this.updateMaps();
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
    
    updateMaps()
    {
        const {gl,maps} =  this;
        Object.entries(maps).forEach(([key,val],ind)=>{
            const {
                format = gl.RGB,
                image,
                wrapS,
                wrapT,
                magFilter,
                minFilter,
            } = val
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.activeTexture(gl[`TEXTURE${ind}`])
            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                format,
                format,
                gl.UNSIGNED_BYTE,
                image
              )
              wrapS&&gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                wrapS
              )
              wrapT&&gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                wrapT
              )
        
              magFilter&&gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                magFilter
              )
              // minFilter参数有最小值。  
              if (!minFilter || minFilter > 9729) {
                gl.generateMipmap(gl.TEXTURE_2D)
              }
              minFilter&&gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                minFilter
              )
      
             const u = gl.getUniformLocation(gl.program, key)
             gl.uniform1i(u, ind)

        })
        // for(let [key,val]  of  Object.entries(maps))
        // {

        // }
    }

    draw(type = this.type)
    {
        const {gl,sourceSize} = this;
        gl.drawArrays(gl[type],0,sourceSize);
    }
    

}

export { PolyEx }