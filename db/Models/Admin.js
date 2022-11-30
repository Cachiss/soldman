import { DataTypes } from 'sequelize';
import {sequelize} from '../config.db.js';
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