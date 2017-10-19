'use strict';

// getAccount().then((res) => {
//     console.log(res, ' Successful Test.');
// });

function getAccount() {
    return Promise.using(getSqlConnection(), function (connection) {
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
//# sourceMappingURL=tests.js.map