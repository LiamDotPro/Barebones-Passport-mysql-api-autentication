import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authenticate from './lib/userFunctions';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import admin from './lib/adminFunctions'

let app = express();

// sockets
let http = require('http').Server(app);
let io = require('socket.io')(http);

// Library Objects
let auth = new authenticate();
let administration = new admin();


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(cors());


// Passport Data

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'SomeoneOnceToldMeABetterWayToDoThis';

/**
 * This is the part with passport I'm not sure about.
 */
const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);

    // usually this would be a database call:
    auth.findAccountById(jwt_payload.id).then((res) => {
        if (res) {
            next(null, true);
        } else {
            next(null, false);
        }
    })
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(strategy);

// API Should be listening on 2000 at all times
app.listen(2000);
http.listen(2001);

/**
 * app post.
 */

app.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {

        let email = req.body.email;
        let password = req.body.password;

        auth.login(email, password).then((_res) => {
            if (_res.payload === 11) {
                let payload = {
                    id: _res.user.id
                };
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({message: 'ok', token: token});
            } else {
                res.send({
                    message: 'bad',
                    error: 'Username or Password not found.'
                })
            }
        })
    } else {
        res.send({
            message: 'bad',
            error: 'Username or Password not found.'
        })
    }
});

app.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('Success');
});

// Users
app.get('/userList', passport.authenticate('jwt', {session: false}), (req, res) => {
    administration.getUserList().then((_res) => {
        res.send(_res);
    });
});

app.post('/registerUser', passport.authenticate('jwt', {session: false}), (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (email && password) {
        auth.registerUser(email, password).then((_res) => {
            res.send(_res)
        })
    } else {
        res.send("Something went wrong...")
    }
});

/**
 * Sockets Here.
 */
io.on('connection', (socket) => {

    socket.on('test', (data) => {
        console.log(data.hello)
    })

});