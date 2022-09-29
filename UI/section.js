const express = require('express');
const app = express();

//setting up environmental variable and port numebr
const port = process.env.PORT || 4000;
const base = `${__dirname}/public`;

app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, REQUEST");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

//accessing files in public folder
app.use(express.static('public'));

app.get('/direction', (req, res) => 
{
    res.sendFile(`${base}/direction.html`)
});

app.get('/', (req, res) => 
{
    res.sendFile(`${base} /index.html`)
});

app.get('/:otherRoom', (req, res) =>  {
});

app.listen(port, () =>
{
    console.log(`port ${port}`);
});

