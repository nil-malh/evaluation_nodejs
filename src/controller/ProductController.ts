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
        router.get('/new', this.showNewForm.bind(this))
        router.post('/new', this.handleNewForm.bind(this))
        router.get('/:id/edit', this.showEditForm.bind(this))
        router.post('/:id/edit', this.handleEditForm.bind(this))
        router.delete('/:id', this.deleteOne.bind(this))

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

        res.render('product', { products, categories });
    }
    private async showOne(req: Request, res: Response): Promise<void> {
        const productId = req.query['product-id']; // Assuming the query parameter is 'product-id'
        
        if (!productId) {
            // Handle the case when the product-id is not provided
            res.status(400).send('Product ID is required.');
            return;
        }
    
        try {
            const product: HydratedDocument<IProduct> | null = await ProductModel.findById(productId);
            
            if (!product) {
                // Handle the case when the product is not found
                res.status(404).send('Product not found.');
                return;
            }
    
            res.render('product-page', { product }); // 'single_product' is the name of your EJS template
        } catch (error) {
            // Handle any errors that might occur during the process
            console.error('Error retrieving product:', error);
            res.status(500).send('An error occurred while retrieving the product.');
        }
    }
    private async showNewForm (req: Request, res: Response): Promise<void> {
        res.render('task-form', {
            title: 'AJOUTER UN Produit',
            action: req.baseUrl + req.path,
            btnLabel: 'AJOUTER',
            taskToUpdate: undefined
        })
    }


    private async handleNewForm (req: Request, res: Response): Promise<void> {
        const newTask = new ProductModel(req.body)
        await newTask.save()
        res.redirect('/')
    }

    private async showEditForm (req: Request, res: Response): Promise<void> {
        const id = req.params.id
        const task = await ProductModel.findById(id)

        if (task) {
            res.render('task-form', {
                title: 'MODIFIER UNE TÂCHE',
                action: req.baseUrl + req.path,
                btnLabel: 'MODIFIER',
                taskToUpdate: task
            })
        } else {
            res.redirect('/')
        }
    }

    private async handleEditForm (req: Request, res: Response): Promise<void> {
        const id = req.params.id
        await ProductModel.findByIdAndUpdate(id, { $set: req.body })
        res.redirect('/')
    }

    private async deleteOne (req: Request, res: Response): Promise<void> {
        const id = req.params.id
        const result = await ProductModel.findByIdAndDelete(id)
        res.json({
            success: Boolean(result)
        })
    }
}

export const productController = new ProductController()












