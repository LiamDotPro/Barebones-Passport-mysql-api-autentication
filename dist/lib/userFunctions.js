'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('../lib/db');

var _db2 = _interopRequireDefault(_db);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Payload Numbering
 *
 * 0 Success
 * 1 Failure
 * 10 Account Creation
 * 11 Successful Login
 */
var authentication = function () {
    function authentication() {
        _classCallCheck(this, authentication);
    }

    /**
     * List of error handling and checks.
     *
     * Duplicate Entry Test
     * length Test
     * @todo test with postman for if extra length is needed, also implenting special char check regexp
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     * @constructor
     */


    _createClass(authentication, [{
        key: 'registerUser',
        value: function registerUser(email, password) {
            var _this = this;

            return this.checkForDuplicateAccount(email).then(function (res) {
                if (res.payload === 0) {
                    if (password.length >= 6) {
                        return _this.encryptPassword(password).then(function (pass) {
                            return _this.createAccount(email, pass).then(function () {
                                return {
                                    msg: 'New Account Created.',
                                    payload: res.payload
                                };
                            });
                        });
                    } else {
                        return {
                            msg: res.msg
                        };
                    }
                } else {
                    return {
                        msg: res.msg
                    };
                }
            });
        }

        /**
         * Separate method from the attempt to validate specifically so we can add extra
         * checks and further integration later if without worrying about moving stuff
         * to methods.
         * @param email
         * @param password
         */

    }, {
        key: 'login',
        value: function login(email, password) {
            return this.validateUser(email, password).then(function (res) {
                return res;
            });
        }
    }, {
        key: 'validateUser',
        value: function validateUser(email, password) {
            var _this2 = this;

            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('Select id, userName, Password FROM `accounts` Where userName=?', [email]).then(function (_res) {
                    // Check if we have that account.
                    if (_res.length > 0) {
                        return _this2.comparePasswords(_res[0].Password, password).then(function (res) {
                            if (res) {
                                return {
                                    msg: 'Success',
                                    payload: 11,
                                    user: {
                                        id: _res[0].id
                                    }
                                };
                            } else {
                                return {
                                    msg: 'Fail',
                                    payload: 1
                                };
                            }
                        });
                    } else {
                        return {
                            msg: 'Fail',
                            payload: 1
                        };
                    }
                });
            });
        }

        /**
         * This does a simple bcrypt comparision to identify correctness.
         * @param hash
         * @param plainText
         */

    }, {
        key: 'comparePasswords',
        value: function comparePasswords(hash, plainText) {
            return _bcrypt2.default.compare(plainText, hash).then(function (res) {
                return res === true;
            });
        }

        /**
         * This checks for a duplicate account inside the database.
         * Payload is a boolean Int
         */

    }, {
        key: 'checkForDuplicateAccount',
        value: function checkForDuplicateAccount(email) {
            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('SELECT `userName` FROM `accounts` WHERE userName=?', [email]).then(function (res) {
                    if (res.length === 0) {
                        return {
                            msg: 'Success',
                            payload: 0
                        };
                    } else {
                        return {
                            msg: 'Fail - Duplicate Account',
                            payload: 1
                        };
                    }
                }).catch(function (e) {
                    console.log(e);
                });
            });
        }

        /**
         * Find Account by Id
         */

    }, {
        key: 'findAccountById',
        value: function findAccountById(id) {
            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('SELECT `id` FROM `accounts` WHERE id=?', [id]).then(function (res) {
                    if (res.length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        }

        /**
         * This is the last part of the system.
         * All passwords should be ran through bcrypt before being inserted.
         * @param email
         * @param password
         */

    }, {
        key: 'createAccount',
        value: function createAccount(email, password) {
            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('INSERT INTO `accounts` (userName, Password) VALUES (?, ?)', [email, password]).then(function (res) {
                    return { msg: 'Success', payload: 10 };
                });
            }).catch(function (e) {
                console.log(e);
            });
        }

        /**
         * Encrypts plain text passwords using a safe encryption method.
         * @param password
         */

    }, {
        key: 'encryptPassword',
        value: function encryptPassword(password) {
            var saltRounds = 10;

            return _bcrypt2.default.hash(password, saltRounds).then(function (hash) {
                return hash;
            });
        }
    }]);

    return authentication;
}();

exports.default = authentication;
//# sourceMappingURL=userFunctions.js.map