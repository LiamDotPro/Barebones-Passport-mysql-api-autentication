import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import getSqlConnection from './lib/db';
import Promise from 'bluebird';
import path from 'path';
import authenticate from './lib/userFunctions';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';


let app = express();
let auth = new authenticate();


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
    }
});

app.get('/secret', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('Success');
});


/**
 * test
 **/

// getAccount().then((res) => {
//     console.log(res, ' Successful Test.');
// });

function getAccount() {
    return Promise.using(getSqlConnection(), (connection) => {
        return connection.query('Select * from accounts').then((res) => {
            return res;
        });
    });
}

// testDuplicateName();


function testDuplicateName() {
    auth.checkForDuplicateAccount('uno').then((res) => {
        console.log(res);
    });
}

// createAccount();

function createAccount() {
    auth.registerUser('alonso@gmail.com', '123test').then((res) => {
        console.log(res);
    });
}

// encryptPassword();

function encryptPassword() {
    auth.encryptPassword('lala').then((res) => {
        console.log(res);
    })
}

// loginUser();

function loginUser() {

    auth.login('alonso@gmail.com', '123test').then((res) => {
        console.log(res);
    })

}