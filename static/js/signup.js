import api from './APIClient.js';

const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
const username = document.getElementById('username');
const password = document.getElementById('password');
const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');




document.addEventListener('DOMContentLoaded', function () {
    signup.addEventListener('click', e => {
        api.signup(username.value, password.value, first_name.value, last_name.value).then(user => {
            document.location = "./";
            username.setCustomValidity('');
            username.reportValidity();
        }).catch((err) => {
            username.setCustomValidity('Username is taken');
            username.reportValidity();
            console.log(err);
        });
    });
    signin.addEventListener('click', e => {
        document.location = "./login";
    });
});
