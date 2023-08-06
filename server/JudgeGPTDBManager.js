//https://chat.openai.com/share/88c64e7b-418b-4894-90dd-7069a9021047
const sqlite3 = require('sqlite3').verbose();

const dbAddress = './jgptdb.sqlite3';

class JudgeGPTDBManager {
    constructor(Server) {
        this.setData(Server);  // Initialize data
        this.dbAddress = dbAddress;
        this.initializeDB();   // Ensure table exists and get ID
        this.saveToDB();       // Save to the database upon creation
    }

    setData(Server) {
        // Players, roles, game data, and timestamps initialization
        this.players = Server.players;
        this.activeRoles = Server.activeRoles;
        this.messages = Server.messagesChat;
        this.gameCase = Server.gameCase;
        this.ruling = Server.ruling;
        this.punishment = Server.punishment;
        this.winner = Server.winner;
        this.timeStart = Server.timeStart;
        this.timeSaved = Date.now();
    }

    initializeDB() {
        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        // Create the "judge_gpt_games" table if it doesn't exist with an AUTOINCREMENT ID
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS judge_gpt_games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                players TEXT,
                activeRoles TEXT,
                messages TEXT,
                gameCase TEXT,
                ruling TEXT,
                punishment TEXT,
                winner TEXT,
                timeStart INTEGER,
                timeSaved INTEGER
            )
        `;
        this.db.run(createTableSQL, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }

    saveToDB() {
        // Open a new connection to the SQLite database using the provided dbAddress
        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        const insertSQL = `
            INSERT INTO judge_gpt_games (players, activeRoles, messages, gameCase, ruling, punishment, winner, timeStart, timeSaved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Run the INSERT SQL command
        // The parameters provided in the second argument will replace the question marks in the SQL
        this.db.run(insertSQL,
            [
                JSON.stringify(this.players),
                JSON.stringify(this.activeRoles),
                JSON.stringify(this.messages),
                this.gameCase,
                this.ruling,
                this.punishment,
                this.winner,
                this.timeStart,
                this.timeSaved
            ],
            function(err) {
                if (err) {
                    // Log any errors that occur during the insertion process
                    return console.error(err.message);
                }
                // Retrieve and save the last inserted row's ID to the class instance
                // this.lastID is provided by the sqlite3 library's context
                this.id = this.lastID;

                console.log("Successfully saved game to database with ID:", this.id);
            }.bind(this)  // Ensure the callback's context (this) remains the JudgeGPTDBManager instance
        );

        // Close the database connection after the insert operation
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }


    UpdateData(Server) {
        this.setData(Server);

        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
        
        // Update the record corresponding to the saved ID
        const updateSQL = `
            UPDATE judge_gpt_games 
            SET players = ?, 
                activeRoles = ?, 
                messages = ?, 
                gameCase = ?, 
                ruling = ?, 
                punishment = ?, 
                winner = ?, 
                timeStart = ?, 
                timeSaved = ?
            WHERE id = ?
        `;
        this.db.run(
            updateSQL,
            [
                JSON.stringify(this.players),
                JSON.stringify(this.activeRoles),
                JSON.stringify(this.messages),
                this.gameCase,
                this.ruling,
                this.punishment,
                this.winner,
                this.timeStart,
                this.timeSaved,
                this.id
            ],
            (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("Successfully updated game in database with ID:", this.id);
            }
        );

        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }
}

module.exports = JudgeGPTDBManager;