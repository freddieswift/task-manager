const { MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewURLParser: true}, (error, client) => {
    if(error){
        return console.log("Unable to connect to database...")
    }
    
    const db = client.db(databaseName)

    // db.collection('users').deleteMany({
    //     age: 22
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: "Clean room"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('users').updateOne({
    //     _id: new ObjectID("6176c34fb4dbf1b24101a080")
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, { 
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // db.collection('users').findOne({ _id: new ObjectID("6176c34fb4dbf1b24101a080")}, (error, user)=>{
    //     if (error){
    //         return console.log("Unable to fetch")
    //     }

    //     console.log(user)
    // })


    // db.collection('users').find({ name: 'Fred'}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("61756d214fc321e16896fd14")}, (error, task) => {
    //     if (error){
    //         return console.log('cannot fetch')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({ completed: false}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })
})
