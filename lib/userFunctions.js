import Promise from 'bluebird';
import baseUserFunctions from "./baseUserFunctions";

/**
 * Payload Numbering
 *
 * 0 Success
 * 1 Failure
 * 10 Account Creation
 * 11 Successful Login
 */
export default class authentication extends baseUserFunctions {

    constructor() {
        super();
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
        return this.checkForDuplicateAccount(email.toLowerCase()).then((res) => {
            if (res.payload === 0) {
                if (password.length >= 6) {
                    return this.encryptPassword(password).then((pass) => {
                        return this.createAccount(email.toLowerCase(), pass).then(() => {
                            return {
                                msg: 'New Account Created.',
                                payload: res.payload
                            }
                        })
                    });
                } else {
                    return {
                        msg: 'Password not long enough'
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

}