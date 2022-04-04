const User = require('../models/user');
const shortId = require('shortid');

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