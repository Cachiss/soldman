import Router from 'express';
import groupRoutes from 'express-group-routes';
import crypto from 'crypto-js';
import jwt from 'jsonwebtoken';
import { User } from '../db/Models/User.js';
import { Message } from '../db/Models/Message.js';
import { Admin } from '../db/Models/Admin.js';
import {sequelize} from '../db/config.db.js';
const api = Router();


//api v1 por si queremos añadir más versiones
api.group("/api/v1", (router) => {

    router.get('/token', async (req, res) => {
        const token = req.headers.authorization||req.headers.autorization;
        console.log(req.headers);
        if (!token) {
            return res.status(401).json({
                message: 'Token no enviado'
            });
        }

        //separo el token de la palabra Bearer
        const tokenSplit = token.split(' ');
        console.log(token);

        console.log(tokenSplit[1]);

        await jwt.verify(tokenSplit[1], process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
            } else {
                const idUser = decoded.id;
                User.findOne({where: {id: idUser}})
                .then((user) => {
                    const passwordDesencrypt = crypto.AES.decrypt(user.passw,process.env.CRYPTO_SECRET_KEY).toString(crypto.enc.Utf8);
                    user.passw = passwordDesencrypt;
                    res.status(200).json({
                        message: 'Token correcto',
                        user
                    });
                }).catch((error) => {
                    console.log(error);
                    res.status(500).json({ message: 'Error interno' });
                
                }
                );

            }
        });
    });

    router.delete('/deleteMessage', async (req, res) => {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'Falta el id' });
        }
        try {
            const existe = await Message.findOne({ where: { id: id } });
            if (!existe) {
                return res.status(400).json({ message: 'No existe el mensaje' });
            }
            await Message.destroy({where: {id: id}})
            res.status(200).json({ message: 'Mensaje eliminado' });
        } catch (error) {
            return res.status(500).json({ message: 'Error interno' });
        }
    });

    router.post('/createMessage', async (req, res) => {
        const { title, message, id_user, } = req.body;
        if (!title || !message || !id_user) {
            return res.status(400).json({ message: 'Faltan datos' });
        }
        try {
            await Message.create({ title, message, id_user });
            res.status(200).json({ message: 'Mensaje creado' });
        } catch (error) {
            return res.status(500).json({ message: 'Error interno' });
        }
            
    });
    router.post('/updateMessage', async (req, res) => {
        const id = req.query.id;
        const message = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Falta el id' });
        }
        if (!message) {
            return res.status(400).json({ message: 'Falta el mensaje' });
        }
        try {
            const existe = await Message.findOne({ where: { id: id } });
            if (!existe) {
                return res.status(400).json({ message: 'No existe el mensaje' });
            }
            await Message.update({message: message}, {where: {id: id}})
            const messageUpdated = await Message.findOne({where: {id: id}});
            res.status(200).json({ message: 'Mensaje actualizado', messageUpdated });
        } catch (error) {
            return res.status(500).json({ message: 'Error interno' });
        }
    });
    router.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.passw;
        if(!email || !password) return res.status(400).json({
            message: 'Email and password are required pá'
        })

        try{
            const user = await User.findOne({where:{email: email }});
            
            if(email === user.email && user.validPassword(password)) {
                console.log("token: "+user.generateToken().toString());
                return res.status(200).json({
                    message: 'User login successfully',
                    user,
                    token: user.generateToken()
                })
            }
            return res.status(400).json({
                message: 'Email or password incorrect'
            });
            
        }
        catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    });
    

    //get all users
    router.get('/getAllusers', async (req, res) => {
        try {
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }

    });
    router.get('/getMessagesUser', async (req, res) => {
        console.log("mensaje paso aqui");
        const idUser = req.query.idUser;
        if(!idUser) return res.status(400).json({
            message: 'idUser is required'
        })
        try {
            const messages = await Message.findAll({where: {id_user: idUser}});
            if(!messages) {
                return res.status(404).json({
                    message: 'Messages not found'
                })
            }
            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }

    });


    router.get('/logout', async (req, res) => {
        //destruimos la session passport
        req.logout(); //es una funcion añadida por passport para destruir la session del usuario logueado
        
    });
    router.get('/getUser', async (req, res) => {
        if(req.query.id){
            try {
                sequelize.sync({force:false});
                const user = await User.findByPk(req.query.id);
                if (user) {
                    if(req.query.password==="desencrypt"){
                        const password = user.passw;
                        user.passw = user.desencryptPassword(password);
                    }
                    return res.status(200).json(user);
                }
                return res.status(404).json({ message: 'User not found' });
            } catch (error) {
                return res.status(500).json({error: error.message});
            }

        }
        res.status(400).send('User id is required');
    });

    router.post('/createUser',async (req, res) => {
        try{
            const name = req.body.nombre;
            const password = req.body.passw;
            const email = req.body.email;
            console.log(name, password, email);
            if(!name || !email || !password) return res.status(400).json({
                message: 'Something is empty :('
            })
            sequelize.sync({force:false}); 
            //comprobamos que el usuario no exista
            const exists = await User.findOne({ where: { email: req.body.email } });
            if (exists) {
                return res.status(400).json({ message: 'This email is already registered' });
            }
            const user = await User.create(req.body);
            return res.status(201).json({
                message: "User created successfully",
                user,
                token: user.generateToken()
            });
        }catch(error){
            return res.status(500).json({error: error.message});
        } 
    });

    router.put('/updateUser', async (req, res) => {
        if(req.query.id){
            try {
                console.log(req.body);
                const user = await User.findByPk(req.query.id);
                if (user) {
                    if(req.body.passw){
                        const newPassw = req.body.passw;
                        req.body.passw = crypto.AES.encrypt(newPassw,process.env.CRYPTO_SECRET_KEY).toString();
                    }
                    const newUser = await user.update(req.body);
                    console.log(newUser);
                    return res.status(200).json({ newUser });
                }
                return res.status(404).json({ message: 'User not found' });
            } catch (error) {
                return res.status(500).json({error: error.message});
            }            
        }
        res.status(400).send('User id is required');
    });

    router.delete('/deleteUser', async(req, res) => {
       const id = req.query.id;

       if(!id)return res.status(400).json({
        message: 'User id is required'
       });
       
       try {
            const user = await User.findByPk(id);
            if(!user)return res.status(404).json({
                message: `User (${id}) not found`
            });
            
            await user.destroy(id);
            return res.status(200).json({
                message: `User (${id}) deleted`
            });

       } catch (error) {
        res.status(400).json({message: error.message})
       }

    });

    router.put('/subscribeUser', async (req, res) => {
        const id = req.query.id; 
        //comprobamos que el query se haya pasado por la url
        if(!id){
            return res.status(400).json({message:'User id is required'});
        }
        
        //ya comprobamos que el id se pasa por la url, ahora se crea el usuario
        try{
            const user = await User.findByPk(id);
        
            //evaluamos si el usuario existe
            if(!user){
                return res.status(404).json({
                message: 'User not found'
            })
            }
            if(user.alta === true) return res.status(400).json({
                message:'User is already subscribed'
            })
        
            await user.update({alta: true});
            return res.status(200).json({
                message: 'User subscribed successfully again :)',
                user
            });
        }
        catch(error){
            return res.status(400).json({message: error.message})
        }
        
    });   

    router.put('/unsubscribeUser', async (req, res) => {
       
        const id = req.query.id; 
        if(!id){
            return res.status(400).json({message:'User id is required'});
        }
        
        //ya comprobamos que el id se pasa por la url, ahora se crea el usuario
        try{
            const user = await User.findByPk(id);
        
            //evaluamos si el usuario existe
            if(!user){
                return res.status(404).json({
                message: 'User not found'
            })
            }
            if(user.alta === false) return res.status(400).json({
                message:'User is already unsubscribed'
            })
        
            await user.update({alta: false});
            return res.status(200).json({
                message: 'User unsubscribed successfully',
                user
            });
        }
        catch(error){
            return res.status(400).json({message: error.message})
        }
    });

    router.post('/createMessage/user', async (req, res) => {
        try {
            const id= req.query.id;
            const message = req.body.message;
            sequelize.sync();
            const user = User.findByPk(id);
            
            if(!user){
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            
            await Message.create({message, UserId: id});
            return res.status(200).json({
                message: 'Message created successfully'
            }); 
        } catch (error) {
            return res.status(400).json({message:error.message})
        }
    });
});

export default api;
