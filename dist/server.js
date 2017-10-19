'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _db = require('./lib/db');

var _db2 = _interopRequireDefault(_db);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _userFunctions = require('./lib/userFunctions');

var _userFunctions2 = _interopRequireDefault(_userFunctions);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var auth = new _userFunctions2.default();

app.use('/public', _express2.default.static(_path2.default.join(__dirname, 'public')));

app.use((0, _morgan2.default)('dev'));
app.use((0, _cors2.default)());

// Passport Data

var ExtractJwt = _passportJwt2.default.ExtractJwt;
var JwtStrategy = _passportJwt2.default.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'SomeoneOnceToldMeABetterWayToDoThis';

/**
 * This is the part with passport I'm not sure about.
 */
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);

    // usually this would be a database call:
    auth.findAccountById(jwt_payload.id).then(function (res) {
        if (res) {
            next(null, true);
        } else {
            next(null, false);
        }
    });
});

app.use(_bodyParser2.default.urlencoded({
    extended: true
}));

app.use(_bodyParser2.default.json());
app.use(_passport2.default.initialize());
_passport2.default.use(strategy);

// API Should be listening on 2000 at all times
app.listen(2000);

/**
 * app post.
 */

app.post('/login', function (req, res) {
    if (req.body.email && req.body.password) {

        var email = req.body.email;
        var password = req.body.password;

        auth.login(email, password).then(function (_res) {
            if (_res.payload === 11) {
                var payload = {
                    id: _res.user.id
                };
                var token = _jsonwebtoken2.default.sign(payload, jwtOptions.secretOrKey);
                res.json({ message: 'ok', token: token });
            } else {
                res.send({
                    message: 'bad',
                    error: 'Username or Password not found.'
                });
            }
        });
    }
});

app.get('/secret', _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
    res.send('Success');
});

/**
 * test
 **/

// getAccount().then((res) => {
//     console.log(res, ' Successful Test.');
// });

function getAccount() {
    return _bluebird2.default.using((0, _db2.default)(), function (connection) {
        return connection.query('Select * from accounts').then(function (res) {
            return res;
        });
    });
}

// testDuplicateName();


function testDuplicateName() {
    auth.checkForDuplicateAccount('uno').then(function (res) {
        console.log(res);
    });
}

// createAccount();

function createAccount() {
    auth.registerUser('alonso@gmail.com', '123test').then(function (res) {
        console.log(res);
    });
}

// encryptPassword();

function encryptPassword() {
    auth.encryptPassword('lala').then(function (res) {
        console.log(res);
    });
}

// loginUser();

function loginUser() {

    auth.login('alonso@gmail.com', '123test').then(function (res) {
        console.log(res);
    });
}
//# sourceMappingURL=server.js.map