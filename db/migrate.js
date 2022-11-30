import { sequelize } from "./config.db.js";
import {User} from './Models/User.js';
import {Message} from './Models/Message.js';
import {Admin} from './Models/Admin.js';


sequelize.sync({force:true}).then(() => {
    console.log('Base de datos sincronizada');
    sequelize.close();
}).catch((error) => {
    console.error(error);
    sequelize.close();
});


