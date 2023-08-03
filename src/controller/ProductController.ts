import express, { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { ProductModel } from '../db/models/Product'
import { IProduct } from '../interfaces/IProduct'


class ProductController {

    private readonly _routeName: string

    constructor () {
        this._routeName = '/products'
    }

    initRoutes (): express.Router {
        const router = express.Router()
        router.get('/', this.showAll.bind(this))
        router.get('/page',this.showOne.bind(this))

        return router
    }

    get routeName (): string {
        return this._routeName
    }
    private async showAll(req: Request, res: Response): Promise<void> {
        const categoryToDisplay = req.query.category;
        const sort = req.query.sort; // Assuming you're passing the category as a query parameter
        let query = {};
    
        if (categoryToDisplay) {
            query = { category: categoryToDisplay };
        }
    
        let sortOptions: any = {};
        if (sort === 'asc') {
            sortOptions.price = 1;
        } else if (sort === 'desc') {
            sortOptions.price = -1;
        }

        const products: HydratedDocument<IProduct>[] = await ProductModel.find(query)
            .sort(sortOptions);
        const categories: string[] = await ProductModel.distinct('category'); // Fetch categories

        res.render('product', { products, categories, req });
    }
    private async showOne(req: Request, res: Response): Promise<void> {
        const productId = req.query['product-id']; // Assuming the query parameter is 'product-id'
        
        if (!productId) {
            res.status(400).send('Product ID is required.');
            return;
        }
    
        try {
            const product: HydratedDocument<IProduct> | null = await ProductModel.findById(productId);
            
            if (!product) {
                res.status(404).send('Product not found.');
                return;
            }
    
            res.render('product-page', { product }); 
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).send('An error occurred while retrieving the product.');
        }
    }
}

export const productController = new ProductController()












