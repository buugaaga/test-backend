import { ITask, IUser } from "../../types";
import fs from 'fs'

interface IExtractData {
  getData: () => ITask[] | IUser[]
}

function createGetData(path: string): IExtractData {
  return ({
    getData: () => JSON.parse(fs.readFileSync(`data/${path}.json`, 'utf8'))
  })
}

// function writeData(path: string, dataObj: ITask | IUser | {}) {

//   return {
//     write: () => {
//       fs.writeFileSync(path, dataObj)
//     }
//   }
// } 

// const isValidData = ()

//  function createUser(path: 'tasks' | 'users', dataObj: ITask | IUser) {

//   return {
//     ...writeData(path, dataObj)
//   }
// }

interface ICreateGetDataById {
  getDataById: (id: string | undefined) =>  ITask | IUser | undefined
}

function createGetDataById(path: string,): ICreateGetDataById {

  return ({
    getDataById: (id)  => {
      if(id) {
        const datas = JSON.parse(fs.readFileSync(`data/${path}.json`, 'utf8'))
        const neededObj = datas.find( (obj: ITask | IUser) => obj.id === +id)
        return neededObj
      }
      return undefined
    }
  })
}

function api(path: 'tasks' | 'users', ) {
  
  return  ({
    ...createGetData(path), 
    ...createGetDataById(path)
  })
}

export default api 





