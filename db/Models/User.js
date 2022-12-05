import bcrypt from 'bcrypt';
import crypto from 'crypto-js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { DataTypes } from "sequelize";

import { sequelize } from "../config.db.js";

dotenv.config();
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
    },
    passw: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    alta:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    admin:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    instanceMethods: {
        generateHash: function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.passw);
        }
    },
    hooks: {
        beforeCreate: async(user) => {
            user.passw = crypto.AES.encrypt(user.passw,process.env.CRYPTO_SECRET_KEY).toString();
        },

    }

},
{
    "timestamps":false
},
);

User.prototype.validPassword =  function (password) {
    return crypto.AES.decrypt(this.passw,process.env.CRYPTO_SECRET_KEY).toString(crypto.enc.Utf8) === password;

};

User.prototype.desencryptPassword = function(password) {
    console.log(password);
    return crypto.AES.decrypt(password,process.env.CRYPTO_SECRET_KEY).toString(crypto.enc.Utf8);
}

User.prototype.generateToken = function() {
    console.log("Generando token...");
    return jwt.sign({id: this.id}, process.env.JWT_SECRET_KEY, {
        expiresIn: 86400 // expira en 1 dia
    });
}

//comprobamos el token
User.prototype.checkToken = function(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return false;
        }
        return true;
    });
}


export { User };
