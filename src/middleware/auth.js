const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { tokenString } = require('../../secrets/secrets')

//verify auth token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, tokenString)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    }
    catch (error) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth