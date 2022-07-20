const CryptoJS = require("crypto-js");
var pass = 'alijumaazimi';
console.log(pass);
var cpass = CryptoJS.AES.encrypt(pass,'secret key 123').toString();
console.log(cpass);
var bytes = CryptoJS.AES.decrypt(cpass, 'secret key 123');
var opass = bytes.toString(CryptoJS.enc.Utf8);
console.log(opass);
var password = 
console.log((await user.password) ==CryptoJS.AES.decrypt(password, "secret key 123").toString();)