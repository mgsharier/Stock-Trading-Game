import { Portfolio } from '../model/portfolio.mjs';
import {readFile} from 'fs/promises'

export async function giveInitialcash(req, res) {
        let gameID = req.body.gameID;
        let initialCash = req.body.initialCash;
        let msg = await Portfolio.setInitialCash(gameID, initialCash);
        if(msg) {
                //res.send(msg);
                let file=await readFile('./view/main.html',{encoding: 'utf8'})
                res.send(file)
        }
        else {
                res.send('Initial Cash could not be updated');
        }
}

export async function getPortfolio(req, res) {
        let name_to_match = req.query.username;
        let gameID = req.query.gameID;
        let user = await Portfolio.get(name_to_match, gameID);
        if(user) {
                res.send(user);  
        } else {
                res.send('No portfolio was found');
        }
}

export async function competitorPortfolio(req, res) {
        let name_to_match = req.query.username;
        let gameID = req.query.gameID;
        let user = await Portfolio.get(name_to_match, gameID);
        if(user) {
                res.send(user);  
        } else {
                res.send('Competitors portfolio was found');
        }
}

export async function buy_action(req, res) {
        let name_to_match = req.body.username;
        let gameID = req.body.gameID;
        let ticker = req.body.ticker;
        let quantity = req.body.quantity;
        let msg = await Portfolio.buy(name_to_match, ticker, quantity, gameID);
        if (msg) {
                res.send(msg);
            } 
        else {
                res.status(400).send('Purchase unsuccessful');
        }
}

export async function sell_action(req, res) {
        let name_to_match = req.body.username;
        let gameID = req.body.gameID;
        let ticker = req.body.ticker;
        let quantity = req.body.quantity;
        let msg = await Portfolio.sell(name_to_match, ticker, quantity, gameID);
        if (msg) {
                res.send(msg);
            } 
        else {
                res.status(400).send('Sell unsuccessful');
        }
}

