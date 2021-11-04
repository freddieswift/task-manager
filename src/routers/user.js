const express = require('express')
const User = require('../models/user')

const router = new express.Router()

//Create User
//Get user data from request body
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    }
    catch (error) {
        res.status(400).send()
    }
})

//Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (error) {
        res.status(500).send(users)
    }
})

//Get specific user
//Get id of user to find from paremter in URL
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
    allowedUpdates = allowedUpdates.filter(item => item != '_id')
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    ////update the user, specified by the id provided, with data provided in the request body
    const _id = req.params.id
    try {
        const user = await User.findById(_id)

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()
        
        if (!user) {
            return res.send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})


//Delete User
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