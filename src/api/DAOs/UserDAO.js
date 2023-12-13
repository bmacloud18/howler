let users = require('../data/users.json');
const crypto = require('crypto');


module.exports = {

    getUserByUsername: (username) => {
        return new Promise((resolve, reject) => {
            let user = users.find(user => user.username == username);
            if (user) {
                resolve(user);
            }
            else {
                reject('user not found');
            }
        });
    },

    login: (username, password) => {
        return new Promise((resolve, reject) => {
            let user = users.find(user => user.username == username);
            let salt = user.salt;
            let pwd = user.password;
            let passwordValid = true;

            if (salt && pwd) {
                let hash = crypto.createHash('sha256');
                hash.update(password);
                hash.update(salt);
                let computedHash = hash.digest('hex');

                passwordValid = computedHash == pwd;
            }


            
            if (user && passwordValid) {
                resolve(getFilteredUser(user));
            }
            else {
                reject('username or password incorrect');
            }
        });
    },

    signup: (username, password, first_name, last_name) => {
        return new Promise((resolve, reject) => {
            let user = users.find(user => user.username == username);
            if (user) {
                reject('username is taken');
            }
            else {
                let newSalt = crypto.randomBytes(128);
                let saltHex = newSalt.toString('hex');


                let hash = crypto.createHash('sha256');
                hash.update(password);
                hash.update(saltHex);
                let computedPassword = hash.digest('hex');

                let newUser = {
                    "id": users[users.length - 1].id + 1,
                    "first_name": first_name,
                    "last_name": last_name,
                    "username": username,
                    "avatar": "images/defaultpfp.jpg",
                    "password": computedPassword,
                    "salt": saltHex
                }
                console.log(newUser);
                users.push(newUser);
                resolve(getFilteredUser(newUser));
            }
        });
    },

    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            let user = users.find(user => user.id == id);
            if(user) {
                resolve(getFilteredUser(user));
            }
            else {
                reject('user not found');
            }
        });
    }
}

function getFilteredUser(user) {
    return {
      "id": user.id,
      "first_name": user.first_name,
      "last_name": user.last_name,
      "username": user.username,
      "avatar": user.avatar
    }
  }