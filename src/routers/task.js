const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

//Create Task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (error) {
        res.status(400).send(e)
    }
})

//Get all tasks
router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

//Get specific task
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(_id)

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
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findByIdAndDelete(_id)
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