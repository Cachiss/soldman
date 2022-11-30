import {User} from '../db/Models/User.js';
import PassportLocal from 'passport-local';
import {Strategy as LocalStrategy} from 'passport-local';

export const isLogin = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

export const isLoginCorrect = new PassportLocal({usernameField:'email'}, async (email, passw, done) => {
    try {
        const user = await User.findOne({where:{email:email}});
        if(!user) return done(null, false, {message: 'Usuario no encontrado'});
        if(!user.validPassword(passw)) return done(null, false, {message: 'Contraseña incorrecta'});
        return done(null, user);
    } catch (error) {
        console.log('Hubo un error en el query.');
        return done(error);
    }
});
