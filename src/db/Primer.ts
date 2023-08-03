import {UserModel} from "./models/User"
import { IUser } from "../interfaces/IUser";
import { IProduct } from "../interfaces/IProduct";
import bcrypt from 'bcrypt'
import { ProductModel } from "./models/Product";



export async function primeUserData()
{
    const userFilePath = `${process.env.USERFILE_PATH}`
    var json = require(userFilePath);
    var users: Array<IUser> = JSON.parse(JSON.stringify(json));

    for(let user of users){
        const username = user.username
        const countUser = await UserModel.countDocuments({ username })
            if (countUser == 0){
                console.log("User already appened to DB")
                user.password = bcrypt.hashSync(user.password, parseInt(process.env.SALT_ROUNDS!))
                const userModel = new UserModel(user);
                userModel.save()
            }

    }

}


export async function primeProductData()
{
    const productFilePath = `${process.env.PRODUCTFILE_PATH}`
    var json = require(productFilePath);
    var products: Array<IProduct> = JSON.parse(JSON.stringify(json));

    for(let product of products){
        const productTitle = product.title
        const countProduct = await UserModel.countDocuments({ productTitle })
            if (countProduct == 0){
                const productModel = new ProductModel(product);
                productModel.save()
            }

    }

}
