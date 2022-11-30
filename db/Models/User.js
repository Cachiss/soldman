import bcrypt from 'bcrypt';
import { DataTypes } from "sequelize";

import { sequelize } from "../config.db.js";

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
    }
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
            const salt = await bcrypt.genSalt(10);
            user.passw = await bcrypt.hash(user.passw, salt);
        }
    }

},
{
    "timestamps":false
},
);

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passw);
};

export { User };
