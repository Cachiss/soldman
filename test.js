import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
//return info user from token 
const token = "Bearer"+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcwMTY0MDE0LCJleHAiOjE2NzAyNTA0MTR9.r2UM6xobX1mDqDNM57ha19UZxV-_f0IklM-j1ZvYLcs"


console.log(jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
        return false;
    }
    return decoded;
}));