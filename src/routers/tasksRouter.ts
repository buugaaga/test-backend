import { Router } from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'

import { ITask, IUser } from '../../types'

const jsonParser = bodyParser.json()

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

//ищу задачу по userId, которая находится в запросе например в таком: '/api/tasks/?userId=3'
tasksRouter.get('/', (req, res) => {
  console.log(req.query)
  if(req.query) {
    const task: ITask[] | []  = tasks.filter( obj => obj.userId === +req.query.userId)
    if(task.length > 0) {
      res.send(task)
    } else {
      res.send('у этого пользователя нет задач')
    }
  }

  res.send(tasks)
  
})

//выдает список всех задач
// tasksRouter.get('/', (req, res) => {
//   res.send(tasks)
// })

//метод POST для создания задачи
tasksRouter.post('/', jsonParser, (req, res) => {
  if(!req.body) res.sendStatus(404)

  let userId: number | undefined = +req.body.userId
  let title: string = req.body.title
  let completed: boolean = req.body.completed

  let id: number = Math.max(...tasks.map( obj => obj.id)) + 1

  let task: ITask = {
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
  let id: number = +req.params.id 
  let index = -1
  let task = {} as ITask
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
