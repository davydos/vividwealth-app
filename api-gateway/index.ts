import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.listen(3001, () => console.log('API Gateway listening on 3001')); 