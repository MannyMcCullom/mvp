import express, { json } from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { PORT, DATABASE_URL } = process.env;

const client = new pg.Client({
    connectionString: DATABASE_URL
});

await client.connect();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get('/players', (req, res)=>{
    client.query('SELECT * FROM players ORDER BY score DESC LIMIT 10')
    .then(result=>{
        res.json(result.rows);
    })
});

app.post('/players', (req, res)=>{
    console.log(req.body)
    const name = req.body.name;
    const score = String(req.body.score);
    client
    .query("INSERT INTO players (name,score) VALUES ($1, $2) RETURNING *", [name, score])
    .then((result)=>{
        console.log(result.rows[0])
        res.json(result.rows[0]);
    });
});

app.listen(PORT, ()=>{ 
    console.log(`listening to port:${PORT}`);
});