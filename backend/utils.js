const { v4: uuid_v4 } = require('uuid');
uuid_v4();


module.exports = {
    makeid,
}


// function makeid() {
//     let result = uuid_v4()
//     return result
// }


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
