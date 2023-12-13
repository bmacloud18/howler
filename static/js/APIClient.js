import HTTPClient from "./HTTPClient.js";

const API_BASE = './api';

export default {

    getCurrentUser: () => {
        return HTTPClient.get(API_BASE+'/users/current');
    },

    login: (username, password) => {
        let data = {
            username: username,
            password: password
        }

        return HTTPClient.post(API_BASE+`/users/login`, data);
    },

    signup: (username, password, first_name, last_name) => {
        let data = {
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name
        }

        return HTTPClient.post(API_BASE+`/users`, data);
    },

    logout: () => {
        return HTTPClient.post(API_BASE+`/users/logout`, {});
    },

    getUserByUsername: (username) => {
        return HTTPClient.get(API_BASE+`/users/username/${username}`)
    },

    getUserById: (id) => {
        return HTTPClient.get(API_BASE+`/users/id/${id}`)
    },

    getHowls: () => {
        return HTTPClient.get(API_BASE+`/howls`);
    },

    //op should be a user id
    getHowlsByOP: (op) => {
        return HTTPClient.get(API_BASE+`/howls/users/${op}`);
    },

    //used to populate user home page
    getHowlsByFollowing: () => {
        return HTTPClient.get(API_BASE+`/howls/user/following`);
    },

    post: (howl) => {
        return HTTPClient.post(API_BASE+`/howls`, howl);
    },

    //user should be a user id
    follow: (user) => {
        return HTTPClient.post(API_BASE+`/follows/${user}`);
    },

    //user should be a user id
    unfollow: (user) => {
        return HTTPClient.post(API_BASE+`/follows/unfollow/${user}`);
    },

    getFollowing: () => {
        return HTTPClient.get(API_BASE+`/follows/user`);
    },

    getFollowingByUser: (user) => {
        return HTTPClient.get(API_BASE+`/follows/users/${user}`);
    }

}