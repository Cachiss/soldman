//set the dtatbase connection with sequelize
import { Sequelize } from "sequelize";
export const sequelize = new Sequelize('soldman', 'root', 'peluchin100X.', {
    host: 'localhost',
    dialect: 'mysql'
});
