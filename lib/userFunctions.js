import getSqlConnection from '../lib/db';
import Promise from 'bluebird';
import bcrypt from 'bcrypt';

/**
 * Payload Numbering
 *
 * 0 Success
 * 1 Failure
 * 10 Account Creation
 * 11 Successful Login
 */
export default class authentication {
    constructor() {

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
    registerUser(email, password) {
        return this.checkForDuplicateAccount(email).then((res) => {
            if (res.payload === 0) {
                if (password.length >= 6) {
                    return this.encryptPassword(password).then((pass) => {
                        return this.createAccount(email, pass).then(() => {
                            return {
                                msg: 'New Account Created.',
                                payload: res.payload
                            }
                        })
                    });
                } else {
                    return {
                        msg: res.msg
                    }
                }
            } else {
                return {
                    msg: res.msg
                }
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
    login(email, password) {
        return this.validateUser(email, password).then((res) => {
            return res;
        })
    }

    validateUser(email, password) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('Select id, userName, Password FROM `accounts` Where userName=?', [email]).then((_res) => {
                // Check if we have that account.
                if (_res.length > 0) {
                    return this.comparePasswords(_res[0].Password, password).then((res) => {
                        if (res) {
                            return {
                                msg: 'Success',
                                payload: 11,
                                user: {
                                    id: _res[0].id
                                }
                            }
                        } else {
                            return {
                                msg: 'Fail',
                                payload: 1
                            }
                        }
                    })
                } else {
                    return {
                        msg: 'Fail',
                        payload: 1
                    }
                }
            });
        });
    }

    /**
     * This does a simple bcrypt comparision to identify correctness.
     * @param hash
     * @param plainText
     */
    comparePasswords(hash, plainText) {
        return bcrypt.compare(plainText, hash).then((res) => {
            return res === true;
        });
    }

    /**
     * This checks for a duplicate account inside the database.
     * Payload is a boolean Int
     */
    checkForDuplicateAccount(email) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('SELECT `userName` FROM `accounts` WHERE userName=?', [email]).then((res) => {
                if (res.length === 0) {
                    return {
                        msg: 'Success',
                        payload: 0
                    }
                } else {
                    return {
                        msg: 'Fail - Duplicate Account',
                        payload: 1
                    }
                }
            }).catch((e) => {
                console.log(e);
            })
        });
    }

    /**
     * Find Account by Id
     */
    findAccountById(id) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('SELECT `id` FROM `accounts` WHERE id=?', [id]).then((res) => {
                if (res.length > 0) {
                    return true;
                } else {
                    return false;
                }
            })
        });
    }

    /**
     * This is the last part of the system.
     * All passwords should be ran through bcrypt before being inserted.
     * @param email
     * @param password
     */
    createAccount(email, password) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('INSERT INTO `accounts` (userName, Password) VALUES (?, ?)', [email, password]).then((res) => {
                return {msg: 'Success', payload: 10}
            })
        }).catch((e) => {
            console.log(e);
        });
    }

    /**
     * Encrypts plain text passwords using a safe encryption method.
     * @param password
     */
    encryptPassword(password) {
        const saltRounds = 10;

        return bcrypt.hash(password, saltRounds).then(function (hash) {
            return hash;
        });
    }
}