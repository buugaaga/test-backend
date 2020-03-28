import Express, { Application, Request, Response } from 'express'

import { apiRouter } from './src/routers'

const port = process.env.PORT || 3003

const app: Application = Express()

app.use(Express.static(`${__dirname}/data`))

app.use('/api', apiRouter)


app.listen(port, () => {
    console.info('server started')
})