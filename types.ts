export interface IUser {
  id: number
  name?: string
  age?: number
}

export interface ITask {
  userId: number
  id: number
  title: string
  completed: boolean
}

