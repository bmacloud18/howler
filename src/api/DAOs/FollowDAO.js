let follows = require('../data/follows.json');
let UserDAO = require('./UserDAO');

module.exports = {
    getFollows: () => {
        return new Promise((resolve, reject) => {
            resolve(follows);
        });
    },

    getFollowsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            followingList = follows[userId].following;
            let ret = [];
            for (const follow of followingList) {
                UserDAO.getUserById(follow).then(user => {
                    const cleanUser = {
                        id: user.id,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        avatar: user.avatar
                    }
                    //unknown glitch was causing certain objects to push 3 times instead of 1
                    if (!ret.includes(cleanUser)) {
                        ret.push(cleanUser);
                    }
                });
            }
            resolve(ret);
        });
    },

    getFollowIdsByUser: (userId) => {
        return new Promise((resolve, reject) => {
            following = follows[userId].following;
            resolve(following);
        });
    },
    
    follow: (user, newFollow) => {
        return new Promise((resolve, reject) => {
            let followingList = follows[user].following;
            if (followingList) {
                followingList.unshift(newFollow);
                UserDAO.getUserById(newFollow).then(followed => {
                    resolve(followed);
                });
                return;
            }
            else {
                reject('user not found');
            }
        });
    },

    unfollow: (user, removeFollow) => {
        return new Promise((resolve, reject) => {
            let followingList = follows[user].following;
            if (followingList) {
                let idx = followingList.indexOf(removeFollow);
                if (idx >= 0) {
                    followingList.splice(idx, 1);
                    UserDAO.getUserById(removeFollow).then(unfollowed => {
                        resolve(unfollowed);
                    });
                    return;
                }
                else {
                    reject('user not in following');
                }
            }
            else {
                reject('user not found');
            }
        });
    },

    signup: (user) => {
        return new Promise((resolve, reject) => {
            follows[user.id] = {
                "userId": user.id,
                "following": [
                ]
              };
            resolve(follows);
        });
    }
}