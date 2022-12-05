import { DataTypes } from 'sequelize';
import {sequelize} from '../config.db.js';
export const Message = sequelize.define('Messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.STRING,
    },
    id_user: {
        type: DataTypes.INTEGER,
    }
});