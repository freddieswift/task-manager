const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('', (req, res) => {
    res.send('testing')
})

//USER ROUTES

//Create User
//Get user data from request body
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//Get all users
app.get('/users', async (req, res) => {
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
app.get('/users/:id', async (req, res) => {
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
app.patch('/users/:id', async (req, res) => {
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
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//TASK ROUTES
//Create Task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send()
    }
    catch (error) {
        res.status(400).send(e)
    }
})

//Get all tasks
app.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

//Get specific task
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send()
    }
})

//update task
app.patch('/tasks/:id', async (req, res) => {
    //check if the update is valid by comparing the field to be updated with the fields present on the Task model
    //if the field to be updated is not on the Task model, then return an error
    const updates = Object.keys(req.body)
    let allowedUpdates = Object.keys(Task.schema.paths)
    allowedUpdates = allowedUpdates.filter(item => item != '_id')
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates'})
    }

    //update the task, specified by the id provided, with data provided in the request body
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port + '...')
})