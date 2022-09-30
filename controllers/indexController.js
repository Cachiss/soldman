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
//mostramos los usuarios en la vista
export const getUsers = async (req,res) => {
    //pasamos los datos a la vista ejs para mostrarlos
    try{
        const users = await User.findAll();
        res.render('mostrarUsuarios',{users});
    }
    catch(e){
        console.error(e);
        throw new Error (e);
    }
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
    req.session.user = req.body;
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


//http métodos delete

export const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        await User.destroy({
            where: {id}
        });
        console.log("Usuario eliminado correctamente");
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}