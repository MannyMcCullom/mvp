import express, { json } from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

const port = process.env.PORT;

const database_url = process.env.DATABASE_URL;

const client = new pg.Client({
    connectionString: database_url
});

// app.use(json())

await client.connect();

app.get('/users', (req, res)=>{
    client.query('SELECT * FROM users')
    .then(result=>{
        console.log(result.rows)
        console.log(JSON.stringify(result.rows))
        const p = document.createElement('div');
        // p.innerText = JSON.stringify(result.rows);
        // document.body.append(p);
    })
    res.send('Good');
});

app.listen(port, ()=>{
    console.log(`listening to port:${port}`);
});