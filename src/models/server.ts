import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routesIncomes from "../routes/income";
import db from "../db/connection";

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';

        this.listen();
        this.middleware();
        this.routes();
        this.dbConnection();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'API Working'
            });
        });

        this.app.use('/api/incomes', routesIncomes);
    }

    middleware() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database connected');
        } catch (error) {
            console.log('Connection error: ', error);
        }
    }

}


export default Server;