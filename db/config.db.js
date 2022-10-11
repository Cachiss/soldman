import { Sequelize } from "sequelize";
    //Definimos la conexión a la base de datos
export const sequelize = new Sequelize('soldman', 'root', 'peluchin100X.', {
    host: 'localhost',
    dialect: 'mysql'
});

