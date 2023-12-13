const express = require('express');
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

const path = require('path');
const html_dir = path.join(__dirname ,'../../templates/');

router.get('/', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
});

router.get('/userprofile', (req, res) => {
    res.sendFile(`${html_dir}userprofile.html`);
});

router.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

router.get('/signup', (req, res) => {
    res.sendFile(`${html_dir}signup.html`);
});

module.exports = router;