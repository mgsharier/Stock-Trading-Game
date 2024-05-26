import { strictEqual, fail } from 'assert';
import request from 'supertest';
import app from '../app.mjs';

describe('Stock Trading Game - Tests with Supertest', function(){
    describe('Test API calls', function(){
        describe('Admin Game Creation', function(){            
            it('Success 1. Feature1: Admin users that can create games', async function(){
                let data = {
                    gamename: 'Test Game 1', 
                    admincode: '3247'
                };
                let res_post = await request(app).post('/createGame')
                    .set('Content-Type', 'application/json')
                    .send(data);
                //strictEqual(typeof response.gameID, 'string');
                strictEqual(res_post.status, 200);

            });
            
            it('Fail 1. Feature1: Reject game creation with incorrect admin code', async function(){
                let data = {
                    gamename: 'Fail Game Test', 
                    admincode: 'incorrectCode'
                };
                let res_post = await request(app).post('/createGame')
                    .set('Content-Type', 'application/json')
                    .send(data);
                let response = res_post.text;
                strictEqual(response, 'The admincode is not correct');
            });
        });

        describe('Player Registration Operations', function(){            
                it('Success 2. Feature2: register players for the game', async function(){
                    let data = { 
                        name: 'Nirjon', 
                        password: 'Leavemealone@315!',
                        gameID: '3100'
                    };
                    let res_post = await request(app).post('/players')
                                      .set('Content-Type', 'application/json')
                                      .send(data);
        
                     strictEqual(res_post.text !== 'Error. Player not inserted in the database.', true);

                });

                it('Fail 2. Feature2: User Registration unsuccessful with Invalid Game ID', async function(){
                        let data = { 
                            name: 'Nirjon', 
                            password: 'Leavemealone@315!',
                            gameID: 'invalidGameID' 
                        };
                        let res_post = await request(app).post('/players')
                                              .set('Content-Type', 'application/json')
                                              .send(data);
                        strictEqual(res_post.text, 'No specific game found with this gameID');
                    });               
            });

        describe('Game Initial Cash Operation', function(){            
                it('Success 3. Feature3: provide all players a starting cash account in their portfolio', async function(){
                    let initialCashData = { 
                        gameID: '3100', 
                        initialCash: 25000
                    };

                    let res_initialCash = await request(app)
                        .post('/portfolios/giveInitialcash')
                        .set('Content-Type', 'application/json')
                        .send(initialCashData);

                    //strictEqual(res_initialCash.text, 'Initial cash has been updated.');
                    strictEqual(res_initialCash.status, 200);
                });

                it('Fail 3. Feature3: Fail to provide initial cash for a game that does not exist', async function(){
                        let initialCashData = { 
                            gameID: '4000WrongGameID', 
                            initialCash: 25000
                        };
                    
                        let res_initialCash = await request(app)
                            .post('/portfolios/giveInitialcash')
                            .set('Content-Type', 'application/json')
                            .send(initialCashData);

                    strictEqual(res_initialCash.text !== 'Initial cash has been updated.', true);
                });          
        });

        describe('Player Login Operation', function(){            
                it('Success 4. Feature4: maintain player login and profile information', async function(){
                        let loginData = { 
                                username: 'Nirjon', 
                                password: 'Leavemealone@315!'
                        };
                        let res_login = await request(app).post('/players/login')
                                        .set('Content-Type', 'application/json')
                                        .send(loginData);
                        //strictEqual(res_login.text, 'You have logged in successfully');
                        strictEqual(res_login.status, 200);
                });

                it('Fail 4. Feature4: User Login with Incorrect Password', async function(){
                        let loginData = { 
                            username: 'Nirjon', 
                            password: 'wrongpassword'
                        };
                        let res_login = await request(app).post('/players/login')
                                                    .set('Content-Type', 'application/json')
                                                    .send(loginData);
                        strictEqual(res_login.status, 401, 'Expected HTTP status 401 for authentication failure');
                    });     
        });

        describe('Player Account Password Change Operation', function(){
                it('Success 5. OptionalFeature1: Change User Password', async function(){
                        let data = {
                                username: 'Nirjon',
                                oldpassword: 'Leavemealone@315!',
                                newpassword: 'NewSecurePassword!2024'
                        }
                        let res_changePassword = await request(app).post('/players/changePassword')
                                .set('Content-Type', 'application/json')
                                .send(data);
                        strictEqual(res_changePassword.text, 'password changed successfully');
                });
                
                it('Fail 5. OptionalFeature1: Unsuccessful User Password Change with Incorrect Old Password', async function(){
                        let data = {
                                username: 'Nirjon',
                                oldpassword: 'Leavemealone@wrong!',
                                newpassword: 'NewSecurePassword!2024'
                        }
                        let res_changePassword = await request(app).post('/players/changePassword')
                                .set('Content-Type', 'application/json')
                                .send(data);
                        strictEqual(res_changePassword.status, 401, 'Expected HTTP status 401 for user detection failure');
                    }); 
            });
            
        describe('Player Portfolio Track', function(){            
                it('Success 6. Feature5 :Keep track of each players portfolio and its value', async function(){
                   let data = {
                                username: 'Nirjon', 
                                gameID: '3100'
                            };

                    let res_getPortfolio = await request(app).get('/portfolios/getmyportfolio')
                            .set('Content-Type', 'application/json')
                            .query(data);
        
                    if (res_getPortfolio.text === 'No portfolio was found') {
                        throw new Error('Expected to find a portfolio, but none was found.');
                    } 
                    else {
                        let portfolio = JSON.parse(res_getPortfolio.text);
                        strictEqual(typeof portfolio, 'object', 'Expected portfolio to be an object');
                    }
                });
                it('Fail 6. Feature5: Fetch User Portfolio Unsuccessful with nonexistent Username', async function() {
                        let data = {
                                username: 'nonexist', 
                                gameID: '3100'
                            };
                        let res_getPortfolio = await request(app).get('/portfolios/getmyportfolio')
                            .set('Content-Type', 'application/json')
                            .query(data);
                        strictEqual(res_getPortfolio.text, 'No portfolio was found');
                    });
        });

        describe('Competitors Portfolio Track', function(){            
                it('Success 7. OptionalFeature2: Fetch Competitor Portfolio', async function(){
                        
                        let data = { 
                                name: 'Sharier', 
                                password: 'Leavemealone@315!',
                                gameID: '3100'
                            };
                            await request(app).post('/players')
                                              .set('Content-Type', 'application/json')
                                              .send(data);
                        
                        let data1 = {
                                username: 'Sharier', 
                                gameID: '3100'
                        };

                        let res_getPortfolio = await request(app).get('/portfolios/getCompetitorportfolio')
                            .set('Content-Type', 'application/json')
                            .query(data1);
            
                        if (res_getPortfolio.text === 'Competitors portfolio was found') {
                                throw new Error('Expected to find a portfolio, but none was found.');
                            } 
                        else {
                                let portfolio = JSON.parse(res_getPortfolio.text);
                                strictEqual(typeof portfolio, 'object', 'Expected portfolio to be an object');
                            }
                });
                
                it('Fail 7. OptionalFeature2: Fetch Competitor Portfolio Unsuccessful Due to Nonexistent Competitor in the Specified Game', async function() {
                        let data1 = {
                                username: 'Sharierrrrr', 
                                gameID: '3100'
                        };

                        let res_getPortfolio = await request(app).get('/portfolios/getCompetitorportfolio')
                            .set('Content-Type', 'application/json')
                            .query(data1);
                        strictEqual(res_getPortfolio.text, 'Competitors portfolio was found');
                    });
        });

        describe('Player Buy Action', function(){            
                it('Success 8. Feature6: allow player buy actions at the current NYSE prices', async function(){
                    let purchaseData = { 
                        username: 'Nirjon', 
                        gameID: '3100',
                        ticker: 'AAPL',
                        quantity: 10 
                    };
                    let res_purchase = await request(app)
                        .post('/portfolios/buy')
                        .set('Content-Type', 'application/json')
                        .send(purchaseData);

                    strictEqual(res_purchase.text, 'Stock purchase successfully added to portfolio.');
                });
                
                it('Fail 8. Feature6: Do not allow player buy action with Insufficient Cash', async function(){
                        let purchaseData = { 
                            username: 'Nirjon', 
                            gameID: '3100',
                            ticker: 'AAPL', 
                            quantity: 1000000
                        };
                        
                        let res_purchase = await request(app)
                            .post('/portfolios/buy')
                            .set('Content-Type', 'application/json')
                            .send(purchaseData);
                        strictEqual(res_purchase.text, 'Purchase unsuccessful');
                });  
        });

        describe('Player Sell Operation', function() {            
                it('Success 9. Feature6: allow player sell actions at the current NYSE prices', async function() {
                    let saleData = { 
                        username: 'Nirjon', 
                        gameID: '3100',
                        ticker: 'AAPL', 
                        quantity: 5 
                    };
                    let res_sale = await request(app)
                        .post('/portfolios/sell')
                        .set('Content-Type', 'application/json')
                        .send(saleData);
                    strictEqual(res_sale.text, 'Stock sale successfully reflected in portfolio.');
                });               
            
                it('Fail 9. Feature6: Stop Sale for not having enough shares', async function() {
                    let saleData = { 
                        username: 'Nirjon', 
                        gameID: '3100',
                        ticker: 'AAPL', 
                        quantity: 30 
                    };
                    let res_sale = await request(app)
                        .post('/portfolios/sell')
                        .set('Content-Type', 'application/json')
                        .send(saleData);
                    strictEqual(res_sale.text, 'Sell unsuccessful');
                });              
            });                         

        describe('End Game and Declare Winner', function(){   
                it('Fail 10. Feature7: End Game with nonexistent GameID', async function(){
                        let data = {
                                admincode: '3247',
                                gameID: 'invalidgameID'
                        }

                        let res_endGame = await request(app).get('/games/end')
                                .set('Content-Type', 'application/json')
                                .query(data);
                        strictEqual(res_endGame.text, "No portfolios found for the given gameID.");
                    }); 

                it('Success 10. Feature7: End Game and Declare Winner', async function(){
                        const game = '3100'
                        let data = {
                                admincode: '3247',
                                gameID: '3100'
                        }
                        let res_endGame = await request(app).get('/games/end')
                                .set('Content-Type', 'application/json')
                                .query(data);
                        strictEqual(res_endGame.text.includes(`The winner of gameID ${game} is`), true);
                });               
            });   
     });
});
