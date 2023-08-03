import mongoose from 'mongoose'
import {IProduct} from '../../interfaces/IProduct'

const ProductSchema = new mongoose.Schema<IProduct>({
    title : {
        type: String,
        required: [true, "A title is required."]
    },
    price: {
        type: Number,
        required: [true, 'A price is required'],
    },
    description: {
        type: String,
        required: [true, 'A description is required']
    },
    category: {
        type: String,
        required: [true, "A category is required "]
    },
    image: {
        type: String,
        required: false
    },
    rating: {
       rate: Number,
       count: Number,

    }
}, { timestamps: true })

export const ProductModel = mongoose.model('Product', ProductSchema)
