import Router from 'express';
import groupRoutes from 'express-group-routes';
import { User } from '../db/models.js';
import { Message } from '../db/models.js';
import {sequelize} from '../db/config.db.js';
const api = Router();


//api v1 por si queremos añadir más versiones
api.group("/api/v1", (router) => {

    router.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.passw;
        if(!email || !password) return res.status(400).json({
            message: 'Email and password are required'
        })

        try{
            const user = await User.findOne({where:{email: email }});
            
            if(email === user.email && password === user.passw) {
                return res.status(200).json({
                    message: 'User login successfully',
                    user
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
            sequelize.sync({force:false});
            const users = await User.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }

    });

    router.get('/getUser', async (req, res) => {
        if(req.query.id){
            try {
                sequelize.sync({force:false});
                const user = await User.findByPk(req.query.id);
                if (user) {
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
            const name = req.body.email;
            const email = req.body.email;
            const password = req.body.email;

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
            });
        }catch(error){
            return res.status(500).json({error: error.message});
        } 
    });

    router.put('/updateUser', async (req, res) => {
        if(req.query.id){
            try {
                sequelize.sync({force:false});
                const [updated] = await User.update(req.body, {
                    where: { id: req.query.id }
                });
                if (updated) {
                    const updatedUser = await User.findByPk(req.query.id);
                    return res.status(200).json({ user: updatedUser });
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
            const user = await user.findByPk(id);
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
        
            await user.update({alta: false});
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

    router.post('/createMessage/{id}', async (req, res) => {
        try {
            const id= req.params;
            const message = req.body.message;
            sequelize.sync();
            const user = User.findByPk(id);
            
            if(!user){
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            
            await Message.create({message});
            return res.status(200).json({
                message: 'Message created successfully'
            }); 
        } catch (error) {
            return res.status(400).json({message:error.message})
        }
    });
});

export default api;
