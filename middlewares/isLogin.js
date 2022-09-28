import {User} from '../db/models.js';
import PassportLocal from 'passport-local';
import {Strategy as LocalStrategy} from 'passport-local';

export const initialize = (passport) => {
    const authenticateUser = async (email, passw, done) => {
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
    }
    passport.use(new LocalStrategy({usernameField:'email'}, authenticateUser));

}
export const isLogin = async (req,res,next) => {
    const users = await User.findAll();
    const newEmail = req.body.email;
    const newPassword = req.body.passw;
    const user = users.find(user => user.email === newEmail);
    
    passport.use(new LocalStrategy((email, passw, done) => {
        console.log(email, passw);
        if(user){
            if(user.passw === newPassword){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Contraseña incorrecta'});
            }
        }else{
            res.render('login', {error: 'Usuario no registrado'});
            console.log('Usuario no registrado');
        }
    }));
} 


