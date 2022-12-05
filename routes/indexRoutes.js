import {Router} from 'express';
import passport from 'passport';
//importamos todos los controladores
import {
    getLogin, 
    getRegister,
    getUsers,
    getMessage,
    postLogin, 
    postRegister,
    postMessage,
    deleteUser,
    updateUser,
    updateUserForm,
    subscriptionUser
    } 
from '../controllers/indexController.js';

//importamos los middlewares
import {isRegister} from '../middlewares/isRegister.js';
import {isLogin} from '../middlewares/isLogin.js';

//instanciamos el router
const router = Router();

//Index
router.get('/', (req, res) => {
    res.render('index');
});

//http methods get
router.get('/register', getRegister);
router.get('/login', getLogin);
router.get('/message', isLogin, getMessage);
router.get('/mostrarUsuarios',isLogin, getUsers);

//http methods post
router.post('/register', isRegister, postRegister);
//router.post('/login', isLogin, postLogin);

//post login con passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/message',
    failureRedirect: '/login',
}));
router.post('/message', isLogin, postMessage);

//http métodos delete
router.delete('/deleteUser/:id', isLogin, deleteUser);


//metodo get para eliminar un usuario
router.get('/deleteUser/:id', isLogin, deleteUser);
//metodo get para actualizar un usuario
router.get('/updateUserForm/:id', isLogin, updateUserForm);
//metodo get para dar de alta un usuario
router.get('/subscribe/:id', isLogin, subscriptionUser);
//método get para dar de baja a un usuario
router.get('/unsubscribe/:id', isLogin, subscriptionUser);

//google auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: 'http://localhost:3000/login',
    }));
//http métodos put

router.post('/updateUser/:id',isLogin, updateUser);

export default router;