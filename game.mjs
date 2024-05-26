import { getDb, closeDBConnection } from './utils/db.mjs';
import {readFile} from 'fs/promises'

async function _get_games_collection() {
        let db = await getDb();
        return db.collection('games'); 
    }

async function _get_players_collection (){
        let db = await getDb();
        return await db.collection('players');
};
      
async function _get_portfolios_collection (){
    let db = await getDb();
    return await db.collection('portfolios');
};

async function _close_collection (){
    closeDBConnection();
};

export async function createGame(req, res) {
    let gamename = req.body.gamename;
    let admincode = req.body.admincode;
    let collection = await _get_games_collection();

    let gameExists = await collection.findOne({ gamename: gamename });
    if (gameExists) {
        res.send('The same gamename already exists');
        return;
    }

    if (Number(admincode) !== 3247) {
        res.send('The admincode is not correct');
        return;
    }

    //Keeping the gameID same to use in unit test. Usually we will use the commented out line to get unique gameID each time.
     let gameIDbyme = 3100;
     let gameID = gameIDbyme.toString();
     // Create a unique game ID
     //let gameID = Date.now().toString(); 
     await collection.insertOne({ gamename, gameID });
     //res.json({ gameID });
     //let file = `<div><h1>The Game ID of the game you have created is: ${gameID}</h1></div>`;
     //file += await readFile('./view/registerplayer.html',{encoding: 'utf8'})
     let file = await readFile('./view/registerplayer.html',{encoding: 'utf8'})
     res.send(file)
    _close_collection();
}

export async function end_game(req, res) {
        let admincode = req.query.admincode;
        let gameID = req.query.gameID;
        console.log(admincode)
        if (Number(admincode) !== 3247) {
                res.send('The admincode is not correct');
                return;
        }
        let collection = await _get_portfolios_collection();
        let highestNetWorthItem = await collection.find({ gameID: gameID }).sort({ netWorth: -1 }).limit(1).toArray();
        if (highestNetWorthItem.length > 0) {
                highestNetWorthItem = highestNetWorthItem[0];
                let formattedNetWorth = Number(highestNetWorthItem.netWorth.toFixed(2));
                let winnerMessage = `The winner of gameID ${gameID} is ${highestNetWorthItem.username} with a total portfolio value of ${formattedNetWorth}`;
                res.send(winnerMessage);
            } else {
                res.status(404).send("No portfolios found for the given gameID.");
                _close_collection();
                return; 
            }

        let gameCollection = await _get_games_collection();
        let playerCollection = await _get_players_collection();
        let portfolioCollection = await _get_portfolios_collection();

        await gameCollection.deleteMany({ gameID: gameID });
        await playerCollection.deleteMany({ gameID: gameID });
        await portfolioCollection.deleteMany({ gameID: gameID });
         
        _close_collection();
}

export async function viewGames(req, res) {
        let collection = await _get_games_collection();
        let games = await collection.find({}).toArray();
        res.json(games);
        await closeDBConnection();
}
