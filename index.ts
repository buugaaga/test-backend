import Express, { Application, Request, Response } from 'express'

import { usersRouter, tasksRouter } from './src/routers'

const port = process.env.PORT || 3003

const app: Application = Express()

app.use(Express.static(`${__dirname}/data`))

app.use('/api/users', usersRouter)
app.use('/api/tasks', tasksRouter)



app.listen(port, () => {
    console.info('server started')
})