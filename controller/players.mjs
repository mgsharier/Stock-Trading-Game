import { validate_fields } from '../utils/validate-fields.mjs';
import { Player } from '../model/player.mjs';
import { Portfolio } from '../model/portfolio.mjs';
import { getDb, closeDBConnection } from '../utils/db.mjs';
import {readFile} from 'fs/promises'

async function _get_games_collection() {
    let db = await getDb();
    return db.collection('games'); 
}

async function _get_players_collection (){
        let db = await getDb();
        return await db.collection('players');
};

async function _close_collection (){
        closeDBConnection();
};

export async function register_player(req, res) {
    let name = req.body.name;
    let password = req.body.password;
    let gameID = req.body.gameID;
    let collection = await _get_games_collection();
    const game = await collection.findOne({ gameID: gameID });
    _close_collection();
    
    if (!game) {
        res.send('No specific game found with this gameID');
        return 
    }
  
    let players = await _get_players_collection();
    const player = await players.findOne({ "name": name, "gameID": gameID });
    
    if(player) {
        res.send('Same named player exist in the same game');
        return
    }

    let isValid = await validate_fields(name, password);
    if (isValid){
        let new_player = new Player(name, password, gameID);
        let new_player_portfolio = new Portfolio(name, gameID); 
        let msg = await new_player.save();
        let portfolio_response = await new_player_portfolio.add();
        //let combinedResponse = `${msg}\n${portfolio_response}`;
        //res.send(combinedResponse);
        let file=await readFile('./view/login.html',{encoding: 'utf8'})
        res.send(file)
         
    } else {
        console.log('The Player was not inserted in the database since it is not valid.');
        res.send('Error. Player not inserted in the database.');
    }
}

export async function login_player(req, res) {
        let name_to_match = req.body.username;
        let password_to_match = req.body.password;
        let user = await Player.login_credentials_match(name_to_match , password_to_match);
        if(user) {
                let file=await readFile('./view/initialcash.html',{encoding: 'utf8'})
                res.send(file)
                //res.send('You have logged in successfully')
        } else {
                res.status(401).send('Authentication failed: User not found or incorrect credentials.');
        }
}

export async function changePassword(req, res) {
        let username = req.body.username;
        let oldpassword = req.body.oldpassword;
        let newpassword = req.body.newpassword;
    
        // Calling the static method to attempt changing the password
        let response = await Player.changePassword(username, oldpassword, newpassword);
        if(response) {
            res.send(response);
        } else {
                res.status(401).send('Authentication failed: User not found or incorrect credentials.');
        }
    }
    