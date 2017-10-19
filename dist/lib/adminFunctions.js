'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('../lib/db');

var _db2 = _interopRequireDefault(_db);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var administration = function () {
    function administration() {
        _classCallCheck(this, administration);
    }

    // @todo Add in limitting alongside where to stop and start.


    _createClass(administration, [{
        key: 'getUserList',
        value: function getUserList(limit) {
            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('SELECT * FROM `accounts` ORDER BY id ASC').then(function (res) {
                    var list = [];
                    res.forEach(function (el, i) {
                        list.push({ name: el.name, userName: el.userName });
                    });
                    return list;
                });
            });
        }

        /**
         * Gets a list of users with the given name associated to there account.
         * @param name
         */

    }, {
        key: 'getUserByName',
        value: function getUserByName(name) {
            return _bluebird2.default.using((0, _db2.default)(), function (connection) {
                return connection.query('SELECT * FROM `accounts` WHERE name=?', [name]).then(function (res) {
                    if (res.length > 0) {
                        var formattedList = [];

                        res.forEach(function (el, i) {
                            formattedList.push({ name: el.name, username: el.userName, index: i });
                        });

                        return {
                            msg: 'Success',
                            users: formattedList,
                            size: formattedList.length
                        };
                    }
                });
            });
        }
    }]);

    return administration;
}();

exports.default = administration;
//# sourceMappingURL=adminFunctions.js.map