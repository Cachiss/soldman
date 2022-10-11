import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import {User} from './db/models.js';

import routes from './routes/indexRoutes.js';
import {PORT} from './config.js';
import { isLoginCorrect } from './middlewares/isLogin.js';


/* //importamos el archivo de configuración de la base de datos
import { sequelize } from './db/config.db.js';
sequelize.sync({force: true}); */ 

//instanciamos express en app
const app = express();

//creamos dirname para poder usar join y __dirname en un archivo de tipo module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//aplicamos las configuraciones para ejs y el motor de plantillas
app.set('view engine', 'ejs');
//indicamos donde se encuentran las vistas
app.set('views', './client');

//middlewares
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/client',express.static(path.join(__dirname,"/client")));
app.use(express.json()); //para poder recibir json en el body de las peticiones 
app.use(express.urlencoded({extended: true})); //para poder recibir datos de formularios. 

passport.use(isLoginCorrect); 

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

app.use('/', routes); //para poder usar las rutas de la carpeta routes


//iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});