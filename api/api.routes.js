//api para crear un nuevo usuario
import Router from 'express';
import groupRoutes from 'express-group-routes';
import { User } from '../db/models.js';
import {sequelize} from '../db/config.db.js';
const api = Router();


//api v1 
api.group("/api/v1", (router) => {

    router.post('/login', async (req, res) => {
        try {
            sequelize.sync();
            const user = await User.findOne({where: {email: req.body.email}});
            if(user){
                if(user.email === req.body.email && user.passw === req.body.passw){
                    //preguntamos si el usuario está activo

                    if(user.alta){
                        return res.status(200).json({
                            message: 'User login successfully',
                            user
                        });
                    }
                    else{//si el usuario no esta activo
                        return res.status(400).json({
                            message: 'User not active',
                        });
                    }

                }
                {
                    return res.status(400).json({
                        message: 'email or password incorrect'
                    })
                }
            }
            else{
                return res.status(404).json({
                    message: 'User not exists'
                });
            }

            

        } catch (error) {
            res.status(500).json({message: 'Error'});
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

    router.delete('/deleteUser', (req, res) => {
        if(req.query.id){
            res.status(200).send(`User ${req.query.id} deleted successfully`);

        }
        res.status(400).send('User id is required');
    });

    router.put('/subscribeUser', async (req, res) => {
        const user = await User.findByPk(req.query.id);
        if(user){
            try{
                user.alta = true;
                await user.save();
                return res.status(200).json({
                    message: "User subscribed successfully",
                    user
                });
            }
            catch(error){
                return res.status(500).json({error: error.message});
            }
        }
        return res.status(404).json({ message: 'User not found' });
    });   

    router.put('/unsubscribeUser', async (req, res) => {
        const user = await User.findByPk(req.query.id);
        if(user){
            try{
                user.alta = false;
                await user.save();
                return res.status(200).json({
                    message: "User unsubscribed successfully",
                    user
                });
            }
            catch(error){
                return res.status(500).json({error: error.message});
            }
        }
        return res.status(404).json({ message: 'User not found' });
    });

    
});

export default api;
