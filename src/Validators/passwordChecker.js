const checkPassword = (pass) =>{
    if(pass.length < 8){
        return false;
    }

    let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "1234567890";
    let charecter = "~`!@#$%^&*()_-+={}[]";

    let res1 = false;
    let res2 = false;
    let res3 = false;

    for(let i=0; i<pass.length; i++){

        if(alphabets.includes(pass[i])){
            res1 = true;
        }

        if(numbers.includes(pass[i])){
            res2 = true;
        }

        if(charecter.includes(pass[i])){
            res3 = true;
        }
    }

    return res1&&res2&&res3 ? true : false;
}

module.exports={
    checkPassword
}