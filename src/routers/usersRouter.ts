import Express, { Router, Request, Response } from 'express'
import fs from 'fs'

import { IUser } from '../../types'
import api from '../utils'


const jsonParser = Express.json()

export const usersRouter = Router()

const apiUser = api('users')

// const data: string = fs.readFileSync('data/users.json', 'utf8')
const users: IUser[] = apiUser.getData()

usersRouter.get('/:id', (req: Request, res: Response) => {
  const { id }: Request["params"] = req.params
  // const user: IUser | undefined = users.find( item => item.id === +id)
  const user = apiUser.getDataById(id)
  if(user) {
      res.send(user)
  } else {
      res.status(404).send()
  }
})

usersRouter.use('/', (req, res) => {
  res.send(users)
})

usersRouter.post('/', jsonParser, (req, res) => {
  if(!req.body) res.sendStatus(404)
  
  const user = {} as IUser
  user.name = req.body.name
  user.age = req.body.age

  //find max id value in the users arr
  let id = Math.max(...users.map( item => item.id))
  
  user.id = id + 1
  users.push(user)

  const readyData = JSON.stringify(users, null, 2)

  //rewrite users.json with new data
  fs.writeFileSync('data/users.json', readyData)
  res.send(user)
})

usersRouter.delete('/:id', (req, res) => {

  let id: number = +req.params.id

  let index = -1
  for(let i = 0; i < users.length; i++ ) {
      if(users[i].id === +id) {
          index = i
      }
  }
  
  if (index > -1) {
      const user = users.splice(index, 1)
      const data = JSON.stringify(users, null, 2)
      fs.writeFileSync('data/users.json', data)
      res.send(user)
  } else {
      res.status(404).send()
  }
})

usersRouter.put('/', jsonParser, (req: Request, res: Response) => {
  if(!req.body) res.status(400).send()

  const { id: userId, name: userName, age: userAge }: Request['body'] = req.body

  let user = {} as IUser
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

