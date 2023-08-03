import express from 'express'
import { authenticationController } from '../controller/AuthenticationController'
import { productManagementController } from '../controller/ProductManagementController'


class Router {

    private readonly _routes: express.Router

    constructor () {
        this._routes = express.Router()
        this.initRoutes()
    }

    private initRoutes(): any {
        const productsManagementRoutes = productManagementController.initRoutes()
        this._routes.use(productManagementController.routeName, productsManagementRoutes)

        const authRoutes = authenticationController.initRoutes()
        this._routes.use(authenticationController.routeName, authRoutes)
    }

    get routes (): express.Router {
        return this._routes
    }
}

export const router = new Router()
