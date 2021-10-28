const mongoose = require('mongoose')
const validator = require ('validator')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

mongoose.connect(connectionURL, { 
    useNewURLParser: true
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 6,
//         trim: true,
//         validate(value) {
//             if(value.includes("password")){
//                 throw new Error('Password cannot contain \'password\'')
//             }
//         }
//     }
// })

// const me = new User({
//     name: '     Ed     ',
//     email:'ED@swift.COM',
//     age: 22,
//     password: 'freddie'
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error', error)
// })

const Task = mongoose.model('Task', {
    description: {
        type: String,
        require: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description: 'Clean My Room',
    completed: false
})

task.save().then((task) => {
    console.log(task)
}).catch((error) => {
    console.log('Error', error)
})