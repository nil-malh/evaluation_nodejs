import { NextFunction, Request, Response } from 'express'

class AuthenticationGuard {

    isLogged (req: Request, res: Response, next: NextFunction): void {
        if (req.session.userId) { // Si je suis connecté
            if (req.path.includes('auth') && !req.path.includes('signout')) { // Si j'essaye d'accéder à un form de connexion/inscription
                res.redirect('/products')
            } else {
                next()
            }
        } else {
            if (req.path.includes('auth') && !req.path.includes('signout') ) { // Si j'essaye d'accéder à un form de connexion/inscription
                next()
            } else {
                res.redirect('/admin/auth/signin')
            }
        }
    }

}

export const authenticationGuard = new AuthenticationGuard()
