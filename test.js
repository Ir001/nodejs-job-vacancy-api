let getSalary = (str)=>{
    let regex = /Rp\. (.*?) Juta - Rp\. (.*?) Juta/gm;
    let data = regex.exec(str);
    if(data == null){
        return {
            secret : true,
            min : 0,
            max : 0,
        }
    }
    return {
        secret : false,
        min : parseFloat(`${data[1]}000000`),
        max : parseFloat(`${data[2]}000000`),
    }
}
console.log(getSalary('Rp. 5 Juta - Rp. 10 Juta'))
console.log(getSalary(undefined))
console.log(getSalary(''))
console.log(getSalary(null))