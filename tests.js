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