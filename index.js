import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import * as dotenv from 'dotenv';

import {User} from './db/Models/User.js';
import api from './api/api.routes.js';
import routes from './routes/indexRoutes.js';
import { isLoginCorrect } from './middlewares/isLogin.js';

//instanciamos express en app
const app = express();

//configuramos dotenv para leer el .env
dotenv.config();

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

app.use(cors());
const corsOptions = {origin: false}; //para que no se bloquee el cors en el front, en producción lo quitamos

app.use('/client',express.static(path.join(__dirname,"/client")));
app.use(express.json()); //para poder recibir json en el body de las peticiones 
app.use(express.urlencoded({extended: true})); //para poder recibir datos de formularios. 

app.use(passport.initialize());
app.use(passport.session());
passport.use(isLoginCorrect); 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3005/auth/google/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        const newUser = {
            name: profile.displayName,
            passw: profile.id,
            email: profile.email,
        }
        try {
            let user = await User .findOne({
                googleId: profile.id
            })
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.log(error);
        }
    }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        if(!user) return done(null, false, {message: 'Usuario no encontrado'});
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

app.use(api); ///usamos las rutas de la api
app.use('/', routes); //para poder usar las rutas de la carpeta routes



//escuchamos en el puerto del .env
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});