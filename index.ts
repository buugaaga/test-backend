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
    if(!req.body) return res.sendStatus(404)

    let user = {} as IUsers
    user.name = req.body.name
    user.age = req.body.age

    let data = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(data)

    //find max id
    let id = Math.max.apply(Math, users.map( item => item.id))
    
    user.id = id + 1
    users.push(user)

    let readyData = JSON.stringify(users)

    //rewrite users.json with new data
    fs.writeFileSync('data/users.json', 'utf8')
    res.send(user)
})


app.listen(port, () => {
    console.info('server started')
})