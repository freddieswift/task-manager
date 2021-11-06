const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
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

//Get user profile

router.get('/users/me', auth,  async (req, res) => {
    //get user from authentication middleware
    res.send(req.user)
})

//Get specific user
//Get id of user to find from paremter in URL
//If user is found, send the user data as response

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send()
        }
        res.send(user)
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//update user

router.patch('/users/:id', async (req, res) => {

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

    //update the user, specified by the id provided, with data provided in the request body
    //first find the user, apply the updates to user object and save user object

    const _id = req.params.id
    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})


//Delete User
//If delete is successful, send the data of the user that has been deleted

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if (!user){
            res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(500).send()
    }
})

module.exports = router