const express = require('express');
const router = express.Router();

let UserDAO = require('./DAOs/UserDAO');
let HowlDAO = require('./DAOs/HowlDAO');
let FollowDAO = require('./DAOs/FollowDAO');

const TOKEN_COOKIE_NAME = "HowlUserToken";

const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');

const cookieParser = require('cookie-parser');
const { default: base64url } = require('base64url');
router.use(cookieParser());

//test
router.get('/', (req,  res) => {
    res.json({your_api: 'it works'});
});

//****************\\
//**User Routes**\\
//****************\\

//retrieve a user by username
router.get('/users/username/:username', TokenMiddleware, (req, res) => {
    UserDAO.getUserByUsername(req.params.username).then(user => {
        res.json(user);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

//retrieve a user by id
router.get('/users/id/:id', TokenMiddleware, (req, res) => {
    UserDAO.getUserById(req.params.id).then(user => {
        res.json(user);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

//login
router.post('/users/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username) {
        UserDAO.login(username, password).then(user => {
            generateToken(req, res, user);
            let ret = {
                user: user
            }
            res.json(ret);
        }).catch(err => {
            console.log(err);
            res.status(404).json(('user or password not found'));
        });
    }
    else {
        res.status(404).json(('user or password not found'));
    }
});

//signup
router.post('/users', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;

    if (username) {
        UserDAO.signup(username, password, first_name, last_name).then(user => {
            generateToken(req, res, user);
            let ret = {
                user: user
            }
            FollowDAO.signup(user);
            res.json(ret);
        }).catch(err => {
            res.status(404).json((err));
        });

        
    }
    else {
        res.status(404).json(('user or password not found'));
    }
});

//get logged in user
router.get('/users/current', TokenMiddleware, (req, res) => {
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        res.json(user);
    }).catch((err) => {
        console.log("not logged in");
        return res.status(401).json(("not logged in"));
    });
});

//logout
router.post('/users/logout', (req, res) => {
    removeToken(req, res);

    res.json({success: true});
});

//****************\\
//**Howl Routes**\\
//****************\\

router.get('/howls', (req, res) => {
    HowlDAO.getHowls().then(howls => {
        res.json(howls);
    });
});

//retrieve howls posted by specified user given id
router.get('/howls/users/:userId', TokenMiddleware, (req, res) => {
    HowlDAO.getHowlsByOP(req.params.userId).then(howls => {
        res.json(howls);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

//get howls posted by the currently logged in user
router.get('/howls/user', TokenMiddleware, (req, res) => {
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        HowlDAO.getHowlsByOP(user.id).then(howls => {
            res.json(howls);
        }).catch(() => {
            res.status(404).json(('user not found'));
        });
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
    
});

//get howls from the current user's following
router.get('/howls/user/following', TokenMiddleware, (req, res) => {
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        HowlDAO.getHowlsByUserFollows(user.id).then(howls => {
            console.log(howls);
            res.json(howls);
        }).catch(() => {
            res.status(404).json(('user not found'));
        });
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
});

//post a new howl as the current user with some text body
router.post('/howls', TokenMiddleware, (req, res) => {
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        HowlDAO.post(req.body.text, user.id).then(howl => {
            console.log(howl);
            res.json(howl);
        }).catch(() => {
            res.status(404).json(('error posting howl'));
        });
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
});

//*****************\\
//**Follow Routes**\\
//*****************\\

router.get('/follows', TokenMiddleware, (req, res) => {
    FollowDAO.getFollows().then(follows => {
        res.json(follows);
    });
});

//retrieve a following given a user id
router.get('/follows/users/:userId', TokenMiddleware, (req, res) => {
    FollowDAO.getFollowsByUser(req.params.userId).then(follows => {
        res.json(follows);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

//get the current user's following
router.get('/follows/user', TokenMiddleware, (req, res) => {
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        FollowDAO.getFollowsByUser(user.id).then(follows => {
            res.json(follows);
        }).catch(() => {
            res.status(404).json(('user not found'));
        });
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
});

//follow a new user as the current user
router.post('/follows/:userId', TokenMiddleware, (req, res) => {
    let follow = parseInt(req.params.userId);
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        FollowDAO.follow(user.id, follow).then(followed => {
            res.json('you followed ' + followed.first_name);
        }).catch(() => {
            res.status(404).json(('user not found'));
        })
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
});


//unfollow someone from the current user's following
router.post('/follows/unfollow/:userId', TokenMiddleware, (req, res) => {
    let unfollow = parseInt(req.params.userId);
    let token = req.cookies[TOKEN_COOKIE_NAME];
    let userdata = decodePayload(token);

    UserDAO.getUserByUsername(userdata.username).then(user => {
        FollowDAO.unfollow(user.id, unfollow).then(unfollowed => {
            res.json('you unfollowed ' + unfollowed.first_name);
        }).catch(() => {
            res.status(404).json(('follower not found'));
        });
    }).catch(() => {
        res.status(404).json(('not logged in'));
    });
});

function decodePayload(token) {
    let sections = token.split(".");

    let payloadData = sections[1];
    let payload = base64url.decode(payloadData);

    return JSON.parse(payload).user;
}

module.exports = router;