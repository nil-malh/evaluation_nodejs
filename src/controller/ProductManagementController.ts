import express, { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { ProductModel } from '../db/models/Product'
import { IProduct } from '../interfaces/IProduct'


class ProductManagementController {

    private readonly _routeName: string

    constructor () {
        this._routeName = '/manage'
    }

    initRoutes (): express.Router {
        const router = express.Router()
        router.get('/', this.showAll.bind(this))
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

        res.render('product-management', { products});
    }
 
    private async showNewForm (req: Request, res: Response): Promise<void> {
        res.render('product-form', {
            title: 'Create a new product',
            action: req.baseUrl + req.path,
            product: undefined
        })
    }


    private async handleNewForm (req: Request, res: Response): Promise<void> {
        const newTask = new ProductModel(req.body)
        await newTask.save()
        res.redirect('/')
    }

    private async showEditForm (req: Request, res: Response): Promise<void> {
        const id = req.params.id
        const product = await ProductModel.findById(id)

        if (product) {
            res.render('product-form', {
                title: 'Edit a product',
                action: req.baseUrl + req.path,
                product: product
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

export const productManagementController = new ProductManagementController()
