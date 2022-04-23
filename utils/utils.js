const getAge = (date) => {
    var day = date.split("/")[0]
    var month = date.split("/")[1]
    var year = date.split("/")[2]

    var today = new Date()
    var age = today.getFullYear() - year - 1
    if(month < today.getMonth() + 1){
        age++
    }else if(month === today.getMonth() + 1 && day <= today.getDate()){
        age++
    }

    return age
}

module.exports = {getAge}