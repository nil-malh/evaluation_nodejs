import 'dotenv/config'
import { App } from './core/App'
import { primeProductData, primeUserData } from './db/Primer';

// Extend SessionData
declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

primeUserData()
primeProductData()

const app = new App()
app.start()