    const mongoose = require("mongoose");
    const CryptoJS = require("crypto-js");
    const { productSchema } = require("./product");

    // const PasswordValidator = require("password-validator");
    // var passSchema = new PasswordValidator();
    // passSchema
    // .is().min(8)
    // .is().max(20)
    // .has().uppercase()
    // .has().lowercase()
    // .has().digits(2)
    // .has().not().spaces();
    const userSchema = mongoose.Schema({
        name: {
            required: true,
            type: String,
            trim: true,
        },
        email: {
            required: true,
            type: String,
            trim: true,
            validate: {
                validator: (value) => {
                    const re =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return value.match(re);
                },
                message: "Please enter a valid email address!",
            },
        },
        password: {
            required: true,
            type: String,
            validate: {
                validator: (value) => {
                    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    var bytes = CryptoJS.AES.decrypt(value, 'secret key 123');
                    var opass = bytes.toString(CryptoJS.enc.Utf8);
                    return opass.match(re);
                },
                message: "Please enter a valid password!",
            }

        },
        address: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'user',
        },
        cart: [
            {
                product: productSchema,
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ]
    });

    const User = mongoose.model('User', userSchema);
    module.exports = User;