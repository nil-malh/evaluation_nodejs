import mongoose from 'mongoose'
import {IUser} from '../../interfaces/IUser'

const UserSchema = new mongoose.Schema<IUser>({
    email : {
        type: String,
        required: [true, "An email is required."]
    },
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est obligatoire.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire.']
    },
    name: {
       firstname: String,
       lastname: String,

    }
}, { timestamps: true })

export const UserModel = mongoose.model('User', UserSchema)
