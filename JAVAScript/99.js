// 九九乘法
for(let i = 1;i< 10; i++)
{
    let str =""
    for(let j =1;j <=i;j++)
    {
        str += `${j} * ${i} = ${j*i}\t`
    }
    console.log(str);
}