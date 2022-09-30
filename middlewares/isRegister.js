import {User} from '../db/models.js';

export const isRegister = async (req, res, next) => {
    const users = await User.findAll();
    const newEmail = req.body.email;
    const user = users.find(user => user.email === newEmail);
    if (user) {
        res.render('register', { error: 'Usuario ya registrado' });
        console.log('Usuario ya registrado');
    } else {
        next();
    }
}
