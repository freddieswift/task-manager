const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//Create Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//Get all tasks?completed=false
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({ 
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
         })
        res.send(req.user.tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

//Get specific task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, user: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send()
    }
})

//update task
router.patch('/tasks/:id', auth, async (req, res) => {
    //check if the update is valid by comparing the field to be updated with the fields present on the Task model
    //if the field to be updated is not on the Task model, then return an error
    const updates = Object.keys(req.body)
    let allowedUpdates = Object.keys(Task.schema.paths)
    //cannot update id
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
        const task = await Task.findOne({ _id, user: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        
        res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

//Delete Tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, user: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    }
    catch (error) {
        res.status(500).send()
    }
})

module.exports = router