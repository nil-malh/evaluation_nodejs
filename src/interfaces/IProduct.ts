import { ObjectId } from "mongoose"

export interface IProduct
{
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
        rate: number
        count: number
    }
}