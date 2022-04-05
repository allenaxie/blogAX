const express = require('express');
const router = express.Router();
const {signup, signin, signout, requireSignin } = require('../controllers/auth');

// validators
const {runValidation} = require('../validators');
const {userSignupValidator, userSigninValidator} = require('../validators/auth');

//  POST '/api/signup'
router.post('/signup', userSignupValidator, runValidation, signup);

//  POST '/api/signup'
router.post('/signin', userSigninValidator, runValidation, signin);

// GET '/api/signout'
router.get('/signout', signout);

// test
router.get('/secret', requireSignin, (req,res) => {
    res.json({
        message: 'you have access to the secret page'
    })
});

module.exports = router;