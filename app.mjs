import express, { json, urlencoded } from 'express';
const app = express();
const port = 3000;

app.use(json());// support json encoded bodies
app.use(urlencoded({extended: true}));//incoming objects are strings or arrays

import {createGame, end_game, viewGames} from './game.mjs'
import {register_player, login_player, changePassword} from './controller/players.mjs';// Here we import our code with the contacts operations
import {getPortfolio, buy_action, sell_action, competitorPortfolio, giveInitialcash} from './controller/portfolios.mjs';
import { connectToDB, closeDBConnection } from './utils/db.mjs';

var server

app.post('/createGame', createGame);
app.post('/players', register_player);
app.post('/players/login', login_player);
app.post('/portfolios/giveInitialcash', giveInitialcash);
app.get('/games', viewGames);
app.post('/players/changePassword', changePassword);
app.get('/portfolios/getmyportfolio', getPortfolio);
app.get('/portfolios/getCompetitorportfolio', competitorPortfolio);
app.post('/portfolios/buy', buy_action);
app.post('/portfolios/sell', sell_action);
app.get('/games/end', end_game);

export async function createServer(){
  try {
    // we will only start our server if our database
    // starts correctly. Therefore, let's wait for
    // mongo to connect
    await connectToDB();

    // I created this callback function to capture
    // when for when we kill the server. 
    // This will avoid us to create many mongo connections
    // and use all our computer resources
    process.on('SIGINT', () => {
      console.info('SIGINT signal received.');
      console.log('Closing Mongo Client.');
      server.close(async function(){
        let msg = await closeDBConnection();
        console.log(msg);
      });
    });
    // start the server
    server = app.listen(port, () => {
      console.log('Example app listening at http://localhost:%d', port);
    });
  }catch(err){
    console.log(err)
  }
}

// createServer();

export default app