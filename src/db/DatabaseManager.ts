import * as mongoose from 'mongoose'

class DatabaseManager {

     private readonly uri: string

     constructor () {
         this.uri = `${process.env.DB_CONN_STRING}`
     }

     async initDb(): Promise<mongoose.Mongoose> {
         return await mongoose.connect(this.uri)
     }
}

export const db = new DatabaseManager()
