import { Router } from 'express'

import { usersRouter } from './usersRouter'
import { tasksRouter } from './tasksRouter'

export const apiRouter = Router()

apiRouter.use('/users/', usersRouter)
apiRouter.use('/tasks/', tasksRouter)


