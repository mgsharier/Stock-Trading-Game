import { getStockPrice } from '../utils/get-stock-price.mjs';
import { getDb, closeDBConnection } from '../utils/db.mjs';

async function _get_portfolios_collection (){
    let db = await getDb();
    return await db.collection('portfolios');
};

async function _close_collection (){
    closeDBConnection();
};

class Portfolio {
    constructor(username, gameID, initialcash = 10000, stocks = []){
        this.username = username;
        this.gameID = gameID;
        this.availablecash = Number(initialcash);
        this.stocks = stocks;
        this.netWorth = this.availablecash;
}

    async add() {
        let collection = await _get_portfolios_collection();
        let mongoObj = await collection.insertOne(this);
        console.log('The current players Portfolio was inserted in the database');
        _close_collection();
        return 'The current players Portfolio correctly inserted in the Database.';              
    }

    static async get(name, gameID) {
        let collection = await _get_portfolios_collection();
        let obj = await collection.findOne({ "username": name, "gameID": gameID });
        await _close_collection();
        return obj;
    }

    static async setInitialCash(gameID, initialCash) {
        let collection = await _get_portfolios_collection();
        let result = await collection.updateMany(
            { "gameID": gameID },
            { $set: { "availablecash": Number(initialCash), "netWorth": Number(initialCash) } }
        );
        if (result.modifiedCount > 0) {
            return "Initial cash has been updated.";
        } 
        else {
            return;
        }
    }

    static async buy(username, ticker, quantity, gameID) {
        let portfolio = await Portfolio.get(username, gameID);

        if (!portfolio) {
            console.log('Portfolio not found');
            return;
        }

        const stockPrice = await getStockPrice(ticker);
        const totalCost = stockPrice * Number(quantity);

        const feePerStock = 0.10; 
        const transactionFee = feePerStock * Number(quantity);
        const totalCostWithFee = totalCost + transactionFee; 
    
        if (portfolio.availablecash < totalCost) {
            console.log('Insufficient funds to buy stocks');
            return;
        }

        let stockFound = false;

        for (let stock of portfolio.stocks) {
            if (stock.ticker === ticker) {
                stock.quantity += Number(quantity); 
                stockFound = true;
                break;
            }
        }
        if (!stockFound) {
            portfolio.stocks.push({ "ticker": ticker , "quantity": Number(quantity) }); 
        }
    
        portfolio.availablecash -= totalCostWithFee;

        let netWorth = portfolio.availablecash;
        for (let stock of portfolio.stocks) {
                let stockPrice = await getStockPrice(stock.ticker);
                const totalStockPrice = stockPrice * Number(stock.quantity)
                netWorth += totalStockPrice
        }

        let collection = await _get_portfolios_collection();
        await collection.updateOne({ "username": username, "gameID": gameID }, { $set: { "stocks": portfolio.stocks, "availablecash": portfolio.availablecash, "netWorth": netWorth} });
        _close_collection(); 
        return 'Stock purchase successfully added to portfolio.';
          
    }
    
    static async sell(username, ticker, quantity, gameID) {

        let portfolio = await Portfolio.get(username, gameID);
        if (!portfolio) {
            console.log('Portfolio not found');
            return;
        }
    
        const stockPrice = await getStockPrice(ticker);
        const totalSaleAmount = stockPrice * Number(quantity);  

        const feePerStock = 0.10; 
        const transactionFee = feePerStock * Number(quantity); 
        const totalSaleAmountAfterFee = totalSaleAmount - transactionFee; 
   
        let stockFound = false;
        for (let stock of portfolio.stocks) {
            if (stock.ticker === ticker) {
                if (stock.quantity < Number(quantity)) {
                    console.log('Insufficient stock quantity to sell');
                    return;
                }
                stock.quantity -= Number(quantity);
                stockFound = true;
                break;
            }
        }

        if (!stockFound) {
                console.log('Stock not found in portfolio');
                return;
        }

        portfolio.stocks = portfolio.stocks.filter(stock => stock.quantity > 0);
        portfolio.availablecash += totalSaleAmountAfterFee; 

        let netWorth = portfolio.availablecash;
        for (let stock of portfolio.stocks) {
                let stockPrice = await getStockPrice(stock.ticker);
                const totalStockPrice = stockPrice * Number(stock.quantity)
                netWorth += totalStockPrice
        }
        let collection = await _get_portfolios_collection();
        await collection.updateOne({ "username": username, "gameID": gameID }, { $set: { "stocks": portfolio.stocks, "availablecash": portfolio.availablecash, "netWorth": netWorth} });

        _close_collection();
        return 'Stock sale successfully reflected in portfolio.'
    }    
}
const _Portfolio = Portfolio;
export { _Portfolio as Portfolio };

