let howls = require('../data/howls.json');
let UserDAO = require('./UserDAO');
let FollowDAO = require('./FollowDAO');

let currentId = howls[howls.length - 1].id + 1;

module.exports = {

    getHowls: () => {
        return new Promise((resolve, reject) => {
            resolve(howls);
        });
    },

    getHowlsByOP: (userId) => {
        return new Promise((resolve, reject) => {
            let ret = [];
            for (const howl of howls) {
                if (howl.userId == userId) {
                    ret.push(howl);
                }
            }

            ret = sortHowls(ret);
            resolve(ret);
        });
    },

    getHowlsByUserFollows: (userId) => {
        return new Promise((resolve, reject) => {
            let ret = [];
            FollowDAO.getFollowIdsByUser(userId).then(following => {
                console.log(following);
                for (const howl of howls) {
                    if (howl.userId == userId || following.includes(howl.userId)) {
                        //unknown glitch was causing current user howls to push 3 times instead of 1
                        if (!ret.includes(howl)) {
                            ret.push(howl);
                        }
                    }
                }
                ret = sortHowls(ret);
                console.log(ret);
                resolve(ret)
            }).catch(() => {
                reject('user not found');
            });

            resolve(ret);
        });
    },

    post: (text, user) => {
        return new Promise((resolve, reject) => {
            let howl = {};
            howl.id = currentId;
            howl.userId = user;
            howl.datetime = new Date().toISOString();
            howl.text = text;
            howls.push(howl);
            currentId++;
            resolve(howls);
        });
    }
}

function sortHowls(howls) {
    return howls.sort(timeComparator);
}

function timeComparator(a, b) {
    let d1 = new Date(a.datetime);
    let d2 = new Date(b.datetime);

    if (d1.getTime() < d2.getTime()) {
        return 1;
    }
    else if (d1.getTime() >= d2.getTime()) {
        return -1
    }
}