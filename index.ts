import Express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import { IUsers } from './types'

const port = process.env.PORT || 3000

const app: Application = Express()

const jsonParser = bodyParser.json()

app.use(Express.static(`${__dirname}/data`))

app.get('/api/users', (req, res) => {
    let content: string = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(content)
    res.send(users)
})

app.get('/api/users/:id', (req, res) => {
    let id: string = req.params.id 
    let content: string = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(content)
    let user: IUsers | undefined = users.find( item => item.id === +id)
    if(user) {
        res.send(user)
    } else {
        res.status(404).send()
    }
})

app.post('/api/users', jsonParser, (req, res) => {
    if(!req.body) res.sendStatus(404)
    
    let user = {} as IUsers
    user.name = req.body.name
    user.age = req.body.age

    let data = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(data)

    //find max id
    let id = Math.max(...users.map( item => item.id))
    
    user.id = id + 1
    users.push(user)

    let readyData = JSON.stringify(users, null, 2)

    //rewrite users.json with new data
    fs.writeFileSync('data/users.json', readyData)
    res.send(user)
})

app.delete('/api/users/:id', (req, res) => {

    let id: string = req.params.id
    let data: string = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(data)

    let index = -1
    for(let i = 0; i < users.length; i++ ) {
        if(users[i].id === +id) {
            index = i
        }
    }
    
    if (index > -1) {
        let user = users.splice(index, 1)
        let data = JSON.stringify(users, null, 2)
        fs.writeFileSync('data/users.json', data)
        res.send(user)
    } else {
        res.status(404).send()
    }
})

app.put('/api/users', jsonParser, (req, res) => {
    if(!req.body) res.status(400).send()

    var userId: string = req.body.id
    var userName: string = req.body.name
    var userAge: string = req.body.age

    let data: string = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(data)

    let user = {} as IUsers
    for (let itemObj of users) {
        if(itemObj.id === +userId) {
            user = itemObj
            break
        }
    }
    //change data of user
    if(user) {
        user.age = +userAge
        user.name = userName
        fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2))
        res.send(user)
    } else {
        res.status(400).send(user)
    }
    
})


app.listen(port, () => {
    console.info('server started')
})