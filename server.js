import getIP from "./api/getIP.js";
import url from "./api/[tableName]/url.js";
import code from "./api/[tableName]/[code].js";
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;
let serv;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/getIP', getIP);

app.get('/api/:tableName/url', url);
app.post('/api/:tableName/url', url);

app.get('/api/:tableName/:code', code);
app.delete('/api/:tableName/:code', code);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Server' });
});

serv = app.listen(port, () => console.log(`Listening on port ${port}`));
export default app; // for testing