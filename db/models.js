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