import { sequelize } from "../db/config.db.js";

//importamos los modelos
import{User,Message} from '../db/models.js';


//http métodos get
export const getRegister = (req, res) => {
    res.render('register');
};
export const getLogin = (req, res) => {
    res.render('login');
};
export const getMessage = (req,res) => {
    res.render('sesionUsuario');
}
export const getUsers = async (req,res) => {
    const users = await User.findAll();
    console.log(users);
}

//http métodos post
export const postRegister = async (req, res) => {
    try {
        console.log(req.body);
        res.send('login post');
        await sequelize.sync({force:true});
        const {nombre,passw,email} = req.body;
        await User.create({
            nombre,passw,email
        });
        console.log("Datos insertados correctamente")
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

export const postLogin = async (req,res) => {
    res.render('sesionUsuario');
}

export const postMessage = async (req,res) => {
   console.log(req.body);
   try {
    await sequelize.sync(/*{force:true}*/);
    const message = req.body.message;
    await Message.create({message}); //Insertamos el mensaje en la tabla
    console.log("Datos insertados correctamente");
   } catch (error) {
    console.error(`Error: ${error}`);
    throw new Error(error); //Para que se detenga la ejecución
   }
}
