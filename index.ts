import Express, { Application, Request, Response } from 'express';

const app: Application = Express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello im Node.js & TypeScript starter! and am Ildar');
});

app.listen(3000, _ => {
    console.info('Application listening on http://localhost:3000');
});