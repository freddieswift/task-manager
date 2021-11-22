const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')

//multer config options - file size = 1mb
const upload = multer({ 
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.pdf')) {
            return cb(new Error('Please upload a pdf'))
        }
        cb(undefined, true)
    }
 })

//Create User
//Get user data from request body
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        //generateAuthToken saves the user with auth token so user does not have to log in after registration
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//login user using email and password
//checks whether there is a user with the email provided and whether the password provided
//matched the password stored for that user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //generateAuthToken saves user with auth token generated
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    }
    catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (error) {
        res.status(500).send()
    }
})

//Get user profile
router.get('/users/me', auth,  async (req, res) => {
    //get user from authentication middleware
    res.send(req.user)
})

//update user
router.patch('/users/me', auth, async (req, res) => {

    //checks if the update is valid by comparing the field to be updated with the fields present on the User model
    //if the field to be updated is not on the User model, then return an error

    const updates = Object.keys(req.body)
    let allowedUpdates = Object.keys(User.schema.paths)

    //cannot update id

    allowedUpdates = allowedUpdates.filter(item => item != '_id')
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//Delete User
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch (error) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})

module.exports = router