import Express, { Application, Request, Response } from 'express'
// import bodyParser from 'body-parser'
// import fs from 'fs'

// import { IUser } from './types'
import { apiRouter } from './src/routers'

const port = process.env.PORT || 3000

const app: Application = Express()

// const jsonParser = bodyParser.json()

app.use(Express.static(`${__dirname}/data`))

app.use('/api', apiRouter)


app.listen(port, () => {
    console.info('server started')
})