import Express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import { IUsers } from './types'

const port = process.env.PORT || 3000

const app: Application = Express()

// const jsonParser = bodyParser.json()

app.use(Express.static(`${__dirname}/data`))

app.get('/api/users', (req, res) => {
    let content: string = fs.readFileSync('data/users.json', 'utf8')
    let users: IUsers[] = JSON.parse(content)
    res.send(users)
})


app.listen(port, () => {
    console.info('server started')
})