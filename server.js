import express, { json } from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();

app.use(express.static("public"));
app.use(express.json());

dotenv.config();

const port = process.env.PORT;

const database_url = process.env.DATABASE_URL;

const client = new pg.Client({
    connectionString: database_url
});


await client.connect();

app.get('/', (req, res)=>{
    res.send('Homepage');
});

app.get('/users', (req, res)=>{
    client.query('SELECT * FROM users')
    .then(result=>{
        res.json(result.rows);
    })
});

app.listen(port, ()=>{
    console.log(`listening to port:${port}`);
});