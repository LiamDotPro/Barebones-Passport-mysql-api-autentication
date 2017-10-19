'use strict';

var _promiseMysql = require('promise-mysql');

var _promiseMysql2 = _interopRequireDefault(_promiseMysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = _promiseMysql2.default.createPool({
    host: 'localhost',
    user: 'default',
    password: 'test123',
    database: 'influencer_api',
    connectionLimit: 10
});

function getSqlConnection() {
    return pool.getConnection().disposer(function (connection) {
        pool.releaseConnection(connection);
    });
}

module.exports = getSqlConnection;
//# sourceMappingURL=db.js.map