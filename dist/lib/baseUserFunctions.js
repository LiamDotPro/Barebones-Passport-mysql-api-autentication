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
 * Abstract class that acts as the concrete functions for our registering api.
 */
var baseUserFunctions = function () {
    function baseUserFunctions() {
        _classCallCheck(this, baseUserFunctions);

        if (new.target === baseUserFunctions) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    /**
     * Encrypts plain text passwords using a safe encryption method.
     * @param password String
     */


    _createClass(baseUserFunctions, [{
        key: 'encryptPassword',
        value: function encryptPassword(password) {
            var saltRounds = 10;

            return _bcrypt2.default.hash(password, saltRounds).then(function (hash) {
                return hash;
            });
        }

        /**
         * Validates a user from within the database.
         * @param email
         * @param password
         */

    }, {
        key: 'validateUser',
        value: function validateUser(email, password) {
            var _this = this;

            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('Select id, userName, Password FROM `accounts` Where userName=?', [email.toLowerCase()]).then(function (_res) {
                    // Check if we have that account.
                    if (_res.length > 0) {
                        return _this.comparePasswords(_res[0].Password, password).then(function (res) {
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
                return connection.query('SELECT `userName` FROM `accounts` WHERE userName=?', [email.toLowerCase()]).then(function (res) {
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
                return connection.query('INSERT INTO `accounts` (userName, Password) VALUES (?, ?)', [email.toLowerCase(), password]).then(function (res) {
                    return { msg: 'Success', payload: 10 };
                });
            }).catch(function (e) {
                console.log(e);
            });
        }
    }]);

    return baseUserFunctions;
}();

exports.default = baseUserFunctions;
//# sourceMappingURL=baseUserFunctions.js.map