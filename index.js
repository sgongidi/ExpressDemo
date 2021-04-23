// Express app instance
import Express, { json } from 'express';
const app = Express()

// JSON parsing middleware
app.use(json())

// get request to base API
app.get('/', (req, res) => res.send('<h1>Hello COMP-523</h1>'))

// post request to base API
app.post('/', (req, res) => {
    res.send("Successful post request")
})


let users = [{
    "id": 0,
    "first": "randy",
    "last": "sievers",
    "email": "randy@email.com"
}, {
    "id": 1,
    "first": "jada",
    "last": "pfeiffer",
    "email": "jada@email.com"
}, {
    "id": 2,
    "first": "clayton",
    "last": "saunders",
    "email": "clayton@email.com"
}]

// simulated async db action
const getUsersFromDB = () => new Promise(resolve => setTimeout(() => resolve(users), 500))

// get all users
app.get('/users', async (req, res) => {
    const users = await getUsersFromDB()
    console.log(users)
    return res.send(users)
})

// get user by id
app.get('/users/:id', (req, res) => {
    for(let i = 0; i < users.length; i++) {
        if(users[i].id.toString() === req.params.id) {
            console.log(users[i])
            return res.send(users[i])
        }
    }
    return res.status(404).send("User not found")
})

// create new user
app.post('/users', (req, res) => {
    let { user } = req.body
    if (!user) {
        return res.status(400).send("Must include a user object")
    }
    user.id = users[users.length - 1].id + 1
    users.push(user)
    console.log(users)
    return res.send("New User Created")
})

// update user object
app.put('/users', (req, res) => {
    if (!req.body.user) {
        return res.status(400).send("Must include a user")
    }
    for (let i = 0; i < users.length; i++) {
        if(users[i].id === req.body.user.id) {
            users.splice(i, 1, req.body.user)
            console.log(users)
            return res.send("User updated")
        }
    }
    return res.status(404).send("User not found")
})

// delete user by id
app.delete('/users', (req, res) => {
    if (!req.body.id) {
        return res.status(400).send("Must include an id")
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === req.body.id) {
            users.splice(i, 1)
            console.log(users)
            return res.send("User deleted")
        }
    }
    return res.status(404).send("User not found")
})

const port = 3000
const callback = () => console.log(`App listening at http://localhost:${port}`)
app.listen(port, callback)