//import google strategy from passport
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { User } from '../db/Models/User.js';

export const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3005/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({where: {email: profile.emails[0].value}});
        if(user) return done(null, user);
        const newUser = await User.create({
            name: profile.displayName,
            passw: profile.id,
            email: profile.emails[0].value,
        });
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
});