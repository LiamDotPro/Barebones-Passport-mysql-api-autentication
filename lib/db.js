import mysql from 'promise-mysql';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'default',
    password: 'test123',
    database: 'influencer_api',
    connectionLimit: 10
});

function getSqlConnection() {
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection);
    });
}

module.exports = getSqlConnection;