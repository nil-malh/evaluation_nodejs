import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../db/models/User'

class AuthenticationController {

    private readonly _routeName: string

    constructor () {
        this._routeName = '/auth'
    }

    initRoutes (): express.Router {
        const router = express.Router()

        router.get('/signup', this.showFormSignUp.bind(this))
        router.post('/signup', this.handleFormSignUp.bind(this))
        router.get('/signin', this.showFormSignIn.bind(this))
        router.post('/signin', this.handleFormSignIn.bind(this))
        router.get('/signout', this.signOut.bind(this))

        return router
    }

    get routeName (): string {
        return this._routeName
    }

    private async showFormSignUp (req: Request, res: Response): Promise<void> {
        res.render('auth-form', {
            title: 'INSCRIPTION',
            action: req.baseUrl + req.path,
            btnActionLabel: 'S\'INSCRIRE',
            btnOtherActionLabel: 'SE CONNECTER',
            otherActionHref: `${req.baseUrl}/signin`,
            errMsg: ''
        })
    }

    private async handleFormSignUp (req: Request, res: Response): Promise<void> {
        const { username, password } = req.body
        const countUser = await UserModel.countDocuments({ username })
        if (countUser === 0) {
            const passwordHashed = this.hashPassword(password)
            const user = new UserModel({
                username,
                password: passwordHashed
            })
            await user.save()
            res.redirect('/admin/auth/signin')
        } else {
            res.render('auth-form', {
                title: 'INSCRIPTION',
                action: req.baseUrl + req.path,
                btnActionLabel: 'S\'INSCRIRE',
                btnOtherActionLabel: 'SE CONNECTER',
                otherActionHref: `${req.baseUrl}/signin`,
                errMsg: 'Le nom d\'utilisateur est déjà pris.'
            })
        }
    }

    private async showFormSignIn (req: Request, res: Response): Promise<void> {
        res.render('auth-form', {
            title: 'CONNEXION',
            action: req.baseUrl + req.path,
            btnActionLabel: 'SE CONNECTER',
            btnOtherActionLabel: 'S\'INSCRIRE',
            otherActionHref: `${req.baseUrl}/signup`,
            errMsg: ''
        })
    }

    private async handleFormSignIn (req: Request, res: Response): Promise<void> {
        const { username, password } = req.body
        const user = await UserModel.findOne({ username })
        if (user) {
            const passwordMatched = this.comparePassword(password, user.password)
            if (passwordMatched) {
                // Return important !
                // le res n'est pas un return
                req.session.userId = user._id.toString()
                return res.redirect('/admin/tasks')
            }
        }
        res.render('auth-form', {
            title: 'CONNEXION',
            action: req.baseUrl + req.path,
            btnActionLabel: 'SE CONNECTER',
            btnOtherActionLabel: 'S\'INSCRIRE',
            otherActionHref: `${req.baseUrl}/signup`,
            errMsg: 'Les identifiants ne correspondent pas.'
        })
    }

    private async signOut (req: Request, res: Response): Promise<void> {
        req.session.userId = undefined
        res.redirect('/admin/auth/signin')
    }

    private hashPassword (plainPassword: string): string {
        return bcrypt.hashSync(plainPassword, parseInt(process.env.SALT_ROUNDS!))
    }

    private comparePassword (plainPasswordToCompare: string, passwordKnown: string): boolean {
        return bcrypt.compareSync(plainPasswordToCompare, passwordKnown)
    }
}

export const authenticationController = new AuthenticationController()
