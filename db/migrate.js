import { sequelize } from "./config.db.js";

sequelize.sync({force:false});