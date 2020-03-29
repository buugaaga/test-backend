import Express, { Router, Request, Response } from 'express'
import fs from 'fs'
// import bodyParser from 'body-parser'

import { ITask, IUser } from '../../types'

const jsonParser = Express.json()

export const tasksRouter = Router()

const tasksData: string = fs.readFileSync('data/tasks.json', 'utf8')
const tasks: ITask[] = JSON.parse(tasksData)
const usersData: string = fs.readFileSync('data/users.json', 'utf8')
const users: IUser = JSON.parse(usersData)

// ищу задачу по id например '/api/tasks/2'
tasksRouter.get('/:id', (req, res) => {
  const task: ITask | undefined = tasks.find( obj => obj.id === +req.params.id)
  if(task) {
    res.send(task)
  } else {
    res.send('нет задачи с таким номером')
  }
})

// выдает список всех задач
tasksRouter.get('/', (req, res) => {
  if(req.query.userId) {
    const filteredTasksByUserId = tasks.filter( obj => obj.userId === +req.query.userId)
    res.send(filteredTasksByUserId)
  }
  res.send(tasks)
})

//метод POST для создания задачи
tasksRouter.post('/', jsonParser, (req, res) => {
  if(!req.body) res.sendStatus(404)

  const { userId, title, completed }: ITask = req.body

 // find max id value in the tasks arr and add one
  const id: number = Math.max(...tasks.map( obj => obj.id)) + 1

  const task: ITask = {
    userId,
    id,
    title,
    completed
  }

  tasks.push(task)
  fs.writeFileSync('data/tasks.json', JSON.stringify(tasks, null, 2))
  res.send(task)
})

//метод DELETE по id, например: '/api/tasks/3'
tasksRouter.delete('/:id', (req, res) => {
  const id: number = +req.params.id 

  let task = {} as ITask
  let index = -1
  for(let i = 0; i < tasks.length; i++ ) {
    if(tasks[i].id === id) {
      index = i
      task = tasks[i]
      break
    }
  }
  if(index > 0) {
    tasks.splice(index, 1)
    res.send(task)
  } else {
    res.sendStatus(404)
  }
})

tasksRouter.put('/', jsonParser, (req: Request, res: Response) => {
  if(!req.body) res.sendStatus(404)

  const { id, title, completed }: Request['body'] = req.body

  const findedTaskById: ITask | undefined = tasks.find( obj => obj.id === +id)

  if(!findedTaskById) res.sendStatus(404)

  let index = -1
  let task = {} as ITask

  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id === id) {
      tasks[i].title = title
      tasks[i].completed = completed
      task = tasks[i]
      break
    }
  }
  fs.writeFileSync('data/tasks.json', JSON.stringify(tasks, null, 2))
  res.send(task)
})
