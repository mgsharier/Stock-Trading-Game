## Updates from Part 2 Readme

1. **Location of the Demo Video:**
   The demo video showcasing the project can be found at [https://drive.google.com/file/d/15iv--XXqTcE9z_hhzcyfvNZw4ryxLUoP/view?usp=sharing].
`Note:` Please select 1080p from the settings (bottom right side) for optimal viewing quality.
   

2. **Running the Server:**
   To run the server, execute `node server.mjs` from your terminal. Then, navigate to `creategame.html` and go live from there. This process has been demonstrated at the beginning of the game walkthrough video.

3. **Database Name:**
   The database used for this project is named `stockgame-db`. Deleting this database will automatically remove the associated collection files.

3. **Project Status:**
The project is currently in a stable state with all required and optional features implemented successfully. Both unit tests and the video walkthrough demonstrate the functionality of 7 required features and 2 optional features.

## The Layout of the Repository

The repository for this Node.js and Express.js-based stock trading simulation application is organized into several key components for efficient development and maintenance:

- **`app.mjs`**: The main file that initializes the Express server and sets up API routes.

- **`game.mjs`**: Contains logic for game functionalities, including starting and ending games, and determining the winner.

- **`controller/` directory**: Holds the controllers which manage players, portfolios, and the logic for API endpoints.

- **`model/` directory**: Includes the data models for players and portfolios, defining how data interacts with the MongoDB database.

- **`utils/` directory**: Provides utility functions such as establishing a database connection (`db.mjs`), fetching real-time stock prices (`get_stock_price.mjs`), and validating input fields (`validate_fields`).

- **`view/` directory**: Contains frontend code files, including HTML, CSS, and JavaScript.

- **`tests` directory**: Contains a suite of tests designed to verify the application's functionality and ensure everything operates as expected.


## Architecture Overview

This Node.js project is set up like a plan called Model-View-Controller (MVC), but with some mixing:

- **Model**: It's where information about players and their portfolios is kept and managed.

- **View**: This section is now implemented and will display all content in a visually appealing manner to the user.

- **Controller**: This part deals with the app's logic, like responding to what users do, and works with the Model part. There are specific files for handling player and portfolio actions.

- **`game.mjs`**: The file game.mjs does a bit of both Model and Controller jobs, which is not the usual way but works for this project.  



## API/HTTP Requests & Services 
### POST /createGame

**Description:**
This service allows admin users to create games. Upon successful creation, it returns a gameID which can be used by other players to join the game. Admins need to provide their admin code to create the game. If an incorrect admin code is provided, the game creation will be rejected.

**Feature Supported:**
Admin users that can create games. (Mandatory Feature 1)

**Unit tests:** 'Admin Game Creation'


### GET /games

**Description:**
This service retrieves information about all the available games on the server, including their game names and game IDs. Users can utilize this information to choose which game to join and copy the corresponding game ID.

**Feature Supported:**
This feature provides convenience to players by allowing them to obtain game IDs.

**Unit tests:**
No unit tests for this feature as it is not one of those mandatory 9 features of this project. However, it has been verified using Postman.


### POST /players

**Description:**
This service allows players to register for a game by providing their username, password, and the gameID they wish to join. Prior to registration, players can view available games and their corresponding codes using the GET /games API endpoint.

**Feature Supported:**
Registering players for a game. (Mandatory Feature 2)

**Unit tests:**
'Player Registration Operations'  


### POST /portfolios/giveInitialcash

**Description:**
This service allows the admin to set the desired amount as initial cash for all the players of a particular game.

**Feature Supported:**
Providing all players with a starting cash in their portfolio. (Mandatory Feature 3)

**Unit tests:**
 'Game Initial Cash Operation'


### POST /players/login

**Description:**
This endpoint allows players to log in by providing the correct credentials (username and password). If incorrect credentials are provided, access to the game will be denied.

**Feature Supported:**
Maintain player login and profile information. (Mandatory Feature 4)

**Unit tests:**
'Player Login Operation'



### POST /players/changePassword

**Description:**

This endpoint allows players to change their password. To do so, they must provide their username and both their old password and the new password in the request body. If the username and old password are correct, the endpoint will update the password to the new one.

**Feature Supported:**
Profile Management through Password Change. (Optional Feature 1)

**Unit tests:**
'Player Account Password Change Operation'


### GET /portfolios/getmyportfolio

**Description:**

This endpoint is designed to display a player's portfolio, including their net worth, based on their username and a specific game ID. By using the username and the game ID as a query parameters, player can access and review their portfolio details within the system.

**Feature Supported:**

- Monitoring and managing each player's portfolio and its overall value.  
 (Mandatory Feature 5)

**Unit Tests:**
'Player Portfolio Track'


### POST /portfolios/buy

**Description:**

This endpoint facilitates the purchase of stocks by players. It requires the player's username, the game ID they are participating in, the ticker symbol of the stock they wish to buy, and the quantity of shares. The system verifies if the player has sufficient funds to make the purchase and utilizes a real-time stock price API to determine the current price of the specified stock.

**Feature Supported:**

- Enables players to execute buy actions based on real-time New York Stock Exchange (NYSE) prices.  (Mandatory Feature 6 - Part1)

**Unit tests:**
'Player Buy Action'

### POST /portfolios/sell

**Description:**

This endpoint is designed to enable players to sell stocks. It requires information such as the player's username, the game ID they are engaged in, the ticker symbol of the stock they intend to sell, and the number of shares to be sold. The system checks if the player owns enough shares for the sale and uses a real-time stock price API to fetch the current market price of the chosen stock.

**Feature Supported:**

- Allows players to carry out stock sell actions at current New York Stock Exchange (NYSE) prices.  (Mandatory Feature 6 - Part2)

**Unit tests:**
'Player Sell Operation'



### GET /portfolios/getCompetitorportfolio

**Description:**

This endpoint allows players to view a competitor's portfolio, including their net worth, by using the competitor name and the game ID as query parameters. This feature enables players to access and evaluate the portfolio details of any competitor participating in the same game.

**Feature Supported:**

- Enables optional viewing of competitors' portfolios. (Optional Feature 2)

**Unit Tests:**
'Competitors Portfolio Track'


### GET /games/end

**Description:**

This endpoint allows an administrator to conclude a game by specifying the gameID and admin code as query parameters. Upon execution, the game, along with its player data and portfolios, is removed from the database. The endpoint then announces the winner's name and their final net worth, effectively bringing the game to an end.

**Feature Supported:**

- Facilitates the declaration of a winner and the conclusion of the game.  
(Mandatory Feature 7)

**Unit Tests:**
'End Game and Declare Winner'

## Set up and Run server for testing
Please ensure the following packages are installed:
- express
- mocha
- mongodb
- prompt-sync

Run npm install to install the dependencies. MongoDB should be active. You do not need to run the server. After installing all the mentioned packages, just run app-tests.mjs

## Running Unit Tests and Test Coverage
To run the unit tests, execute the tests using the following command:
- npx mocha tests/app-tests.mjs

Note: All test cases are currently passing. However, the project uses a stock API with a limited number of calls (25 per day or fewer). If the API limit is exceeded, the `get-stock-price.mjs` file in the `utils` folder will detect this and return a default value of 10 for any stock instead of the real-time value. This change was made to ensure that failures in tests related to buying or selling stocks are not due to issues with the real-time stock API call.