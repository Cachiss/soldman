import {User} from '../db/models.js';
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
        const user = await User.findOne({where: {email}});
        if (user == null) {
            return done(null, false, {message: 'Email no registrado'});
        }
        if (user.passw === passw) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    } catch (error) {
        return done(error);
    }
});
