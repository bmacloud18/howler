import api from './APIClient.js';

const signin = document.getElementById('signin');
const signup = document.getElementById('signup');
const username = document.getElementById('username');
const password = document.getElementById('password');




document.addEventListener('DOMContentLoaded', function () {
    signin.addEventListener('click', e => {
        api.login(username.value, password.value).then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            document.location = "./";
            username.setCustomValidity('');
            username.reportValidity();
        }).catch((err) => {
            console.log('Username or Password Invalid');
            username.setCustomValidity('Username or Password Invalid');
            username.reportValidity();
        });
    });
    signup.addEventListener('click', e => {
       document.location = "./signup"; 
    });
});
