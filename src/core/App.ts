import express, { Express } from 'express'
import session from 'express-session'
import { Mongoose } from 'mongoose'
import path from 'path'
import { db } from '../db/DatabaseManager'
import { router } from './Router'
import { authenticationGuard } from '../guard/AuthenticationGuard'
import { productController } from '../controller/ProductController'


export class App {

    private app!: Express

    async start (): Promise<void> {
        // Connect DB first
        await this.connectDb()

        // Then start the server
        this.app = express()

        // Configure it !
        this.initRenderEngine()
        this.initMiddlewares()

        this.initRouter()

        this.app.listen(process.env.PORT, () => {
            console.info(`Server started on port ${process.env.PORT} !`)
        })

    }

    private async connectDb (): Promise<Mongoose> {
        return await db.initDb()
    }

    private initRenderEngine (): void {
        // Pour dire qu'on va utiliser EJS avec la fonction render
        this.app.set('view engine', 'ejs')
        // Pour dire que le fichier de vues par défaut n'est pas le bon
        // et qu'on veut en utiliser un autre
        this.app.set('views', path.join(__dirname, '..', '..','src' , 'view'))
    }

    private initMiddlewares (): void {
        // Pour les formulaires POST
        this.app.use(express.urlencoded({ extended: true }))
        // Pour les requêtes API ou AJAX
        this.app.use(express.json())
        // trust first proxy
        this.app.set('trust proxy', 1)
        // Pour la gestion des sessions + cookies
        this.app.use(session({
            secret: process.env.SECRET_SESSION!,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, maxAge: parseInt(process.env.MAX_AGE_SESSION!) }
        }))
    }

    private initRouter (): void {
   
        this.app.use('/admin', authenticationGuard.isLogged, router.routes)


        const productRoutes = productController.initRoutes(); // Call the method to get the Router instance
        this.app.use(productController.routeName, productRoutes);
        
        // When no route match
        this.app.use((req, res) => {
            res.redirect('/products')
        })
    }

}
