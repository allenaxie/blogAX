const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req,res) => {
    // search database for user based on email
    User.findOne({ email: req.body.email }).exec((err, user) => {
        // if a user signed up with the same email already
        if (user) {
            return res.status(400).json({
                error: 'Email is already taken. Please use another email address.'
            });
        }
        
        // if user doesn't exist yet
        const { name, email, password } = req.body
        let username = shortId.generate()
        let profile = `${process.env.CLIENT_URL}/profile/${username}`

        // create new user
        let newUser = new User({ name, email, password, profile, username })
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json({ 
                message: 'Signup success!'
            })
        })
    })
};

exports.signin = (req,res) => {
    const { email, password } = req.body
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        // if error or user does not exist in database
        if(err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup."
            })
        }
        // authenticate 
        // if email and password does not match
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match."
            })
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {expiresIn:'1d'} );

        res.cookie('token', token, {expiresIn: '1d'})
        const { _id, username, name, email, role} = user
        return res.json({
            token, 
            // leave out hashed_password from json data
            user: {_id, username, name, email, role }
        })
    });
};

exports.signout = (req,res) => {
    // clear token from cookies
    res.clearCookie('token');
    res.json({
        message: "Signout success!"
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
});
