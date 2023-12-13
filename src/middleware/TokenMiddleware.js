const crypto = require('crypto');
const base64url = require('base64url');
const TOKEN_COOKIE_NAME = "HowlUserToken";
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever
const API_SECRET = process.env.SECRET_KEY;
exports.TokenMiddleware = (req, res, next) => {
    // We will look for the token in two places:
    // 1. A cookie in case of a browser
    // 2. The Authorization header in case of a different client
    let token = null;
    if(!req.cookies[TOKEN_COOKIE_NAME]) {
        //No cookie, so let's check Authorization header
        const authHeader = req.get('Authorization');
        if(authHeader && authHeader.startsWith("Bearer ")) {
            //Format should be "Bearer token" but we only need the token
            token = authHeader.split(" ")[1];
        }
    }
    else { //We do have a cookie with a token
        token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
    }

    if(!token) { // If we don't have a token
        res.status(401).json({error: 'Not authenticated 1'});
        return;
    }

    //If we've made it this far, we have a token. We need to validate it

    try {
        const decoded = jwtverify(token, API_SECRET);
        req.user = decoded.user;
        next(); //Make sure we call the next middleware
    }
    catch(err) { //Token is invalid
        res.status(401).json({error: 'Not authenticated 2'});
        return;
    }

};

exports.generateToken = (req, res, user) => {
    let data = {
        user: user,
        // Use the exp registered claim to expire token in 1 hour
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }

    const token = jwtsign(data, API_SECRET);
    

    //send token in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge: 2 * 60 * 1000 //This session expires in 2 minutes.. but token expires in 1 hour!
    });
};

exports.removeToken = (req, res) => {
    //send session ID in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        maxAge: -360000 //A date in the past
    });
  
};

function jwtsign(data, secret) {
    let headerdata = {
        "alg": "HS256",
        "typ": "JWT"
    }

    let header = base64url(JSON.stringify(headerdata));
    let payload = base64url(JSON.stringify(data));
    let signaturedata = header + "." + payload;

    let hmac = crypto.createHmac('sha256', secret);

    hmac.update(signaturedata);
    let signature = hmac.digest('hex');

    return signaturedata + "." + signature;
}

function jwtverify(token, secret) {
    let sections = token.split(".");

    let signaturedata = sections[0] + "." + sections[1];

    let hmac = crypto.createHmac('sha256', secret);

    hmac.update(signaturedata);
    let signature = hmac.digest('hex');

    if (signature === sections[2]) {
        return base64url.decode(sections[1]);
    }
}