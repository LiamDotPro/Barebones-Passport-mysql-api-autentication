import getSqlConnection from '../lib/db';
import Promise from 'bluebird';

export default class administration {

    constructor() {

    }

    // @todo Add in limitting alongside where to stop and start.
    getUserList(limit) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('SELECT * FROM `accounts` ORDER BY id ASC').then((res) => {
                let list = [];
                res.forEach((el, i) => {
                    list.push({name: el.name, userName: el.userName})
                });
                return list;
            })
        })
    }

    /**
     * Gets a list of users with the given name associated to there account.
     * @param name
     */
    getUserByName(name) {
        return Promise.using(getSqlConnection(), (connection) => {
            return connection.query('SELECT * FROM `accounts` WHERE name=?', [name]).then((res) => {
                if (res.length > 0) {
                    let formattedList = [];

                    res.forEach((el, i) => {
                        formattedList.push({name: el.name, username: el.userName, index: i});
                    });

                    return {
                        msg: 'Success',
                        users: formattedList,
                        size: formattedList.length
                    }
                }

            })
        })
    }

}
