const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const helpersDb = require('./helpers-db.js');
const { MongoClient, ObjectId } = require('mongodb');

const port = process.env.PORT || 8081;
const ip = process.env.IP || '0.0.0.0';

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.send('Hampong API live');
});

app.post('/games', async (req, res) => {
    try {
        const sets = req.body.sets;
        const startingPlayer = req.body.startingPlayer;
        const playerOne = req.body.playerOne;
        const playerTwo = req.body.playerTwo;

        const dbClient = await helpersDb.getDbClient();
        const db = await dbClient.db('live');
        const colGames = await db.collection('games');

        const game = {
            sets,
            startingPlayer: Number(startingPlayer),
            playerOne,
            playerTwo,
            date: Math.floor(new Date().getTime() / 1000),
            dateReadable: new Date().toLocaleString('en-UK', { timeZone: 'Asia/Tokyo' }), // I am lazy, will want to read this later
            ip: req.socket.remoteAddress
        };

        // TODO... check IP against requests within the last 5 minutes to avoid spam
        // Maybe implement guest session tokens to help avoid non-browser bots

        const newGame = await colGames.insertOne(game);

        res.send(newGame.ops[0]);
    } catch(e) {
        console.log(e);
        res.send({error: e.message});
    }
});

app.get('/games', async (req, res) => {
    try {
        const sets = req.body.sets;
        const startingPlayer = req.body.startingPlayer;

        const dbClient = await helpersDb.getDbClient();
        const db = await dbClient.db('live');
        const colGames = await db.collection('games');

        const games = await colGames.find({}).toArray();
        // const games = await colGames.findOne({ _id: new ObjectId('62bc762e345f3234583d3702') });

        res.send(games);
    } catch(e) {
        console.log(e);
        res.send({error: e.message});
    }
});

app.listen(port, () => {
    console.log('Server running on '+ip+':'+port);
});

// Export the Express API
module.exports = app;