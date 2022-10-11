import { Sequelize, DataTypes } from "sequelize";

import { sequelize } from "./config.db.js";

export const User = sequelize.define('User', {
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
},
{
    "timestamps":false
}
);

export const Message = sequelize.define('Messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
    }
});

export const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    passw: {
        type: DataTypes.STRING,
    }},
    {
        "timestamps":false
    });


//relación uno a muchos
User.hasMany(Message);
Message.belongsTo(User);
