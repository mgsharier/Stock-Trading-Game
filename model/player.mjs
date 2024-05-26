import { getDb, closeDBConnection } from '../utils/db.mjs';

async function _get_players_collection (){
        let db = await getDb();
        return await db.collection('players');
};
      
async function _close_collection (){
    closeDBConnection();
};


class Player {
    constructor(name, password, gameID){
        this.name = name;
        this.password = password;
        this.gameID = gameID;
    }

    async save() { //this is an instance method. So, I would have to call on an instance. Say player1.save()
        let collection = await _get_players_collection();
        let mongoObj = await collection.insertOne(this);
        console.log('The player was inserted in the database');
        _close_collection();
        return 'Player correctly inserted in the Database.';              
    }

    static async login_credentials_match(name, password) {
        let collection = await _get_players_collection();
        let user = await collection.findOne({"name": name, "password": password});
        _close_collection();
        if (user) {
                console.log('User found')
                return true
        }
        else {
                return false
        }
}
     static async changePassword(username, oldpassword, newpassword) {
                let collection = await _get_players_collection();
                let user = await collection.findOne({"name": username, "password": oldpassword});
                if(!user) {
                    console.log('username or password incorrect')
                    return;
                }
                let updateResponse = await collection.updateOne({"name": username}, {$set: {"password": newpassword}});
                _close_collection();
                return 'password changed successfully' 
        }
}
const _Player = Player;
export { _Player as Player };

