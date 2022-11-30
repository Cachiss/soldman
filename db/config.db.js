import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config(); //para poder leer el .env

//Definimos la conexión a la base de datos
export const sequelize = new Sequelize(
    process.env.DATABASE_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: process.env.DIALECT,
        port: process.env.DB_PORT,
    }
);

