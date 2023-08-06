const sqlite3 = require('sqlite3').verbose();

class JudgeGPTDBManager {
    constructor(Server, db) {
        this.setData(Server);  // Initialize data
        this.db = db;          // Store database connection
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

    saveToDB() {
        const insertSQL = `
            INSERT INTO judge_gpt_games (players, activeRoles, messages, gameCase, ruling, punishment, winner, timeStart, timeSaved)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        this.db.run(
            insertSQL,
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
                    return console.error(err.message);
                }
                // Update the instance's ID with the last inserted row's ID
                this.id = this.lastID;
                console.log("Successfully saved game to database.");
            }
        );
    }

    UpdateData(Server) {
        // Update instance data
        this.setData(Server);
        
        // Update database record
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
                console.log("Successfully updated game in database.");
            }
        );
    }
}

module.exports = JudgeGPTDBManager;
