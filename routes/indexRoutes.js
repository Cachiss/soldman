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
    postMessage
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
router.get('/message',getMessage);
router.get('/query',getUsers); //Ejemplo de select
router.get('/message',getMessage);

//http methods post
router.post('/register', isRegister, postRegister);
//router.post('/login', isLogin, postLogin);

//post login con passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/message',
    failureRedirect: '/login',
}));
router.post('/message',postMessage);


export default router;