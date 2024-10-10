//https://chat.openai.com/share/88c64e7b-418b-4894-90dd-7069a9021047
const sqlite3 = require('sqlite3').verbose();

const dbAddress = './jgptdb.sqlite3';
const debug = false;

class JudgeGPTDBManager {
    constructor(Server) {
        this.setData(Server);  // Initialize data
        this.dbAddress = dbAddress;
        this.id = 0;        // Initialize ID as null to track later

        this.initializeDB();   // Ensure table exists and get ID
        this.saveToDB();       // Save to the database upon creation

    }

    setData(Server) {
        // Players, roles, game data, and timestamps initialization
        this.players = Server.players;
        this.activeRoles = Server.activeRoles;
        this.messages = Server.messagesChat;
        this.gameCase = Server.gameCase;
        this.caseTitle = Server.caseTitle;
        this.ruling = Server.ruling;
        this.punishment = Server.punishment;
        this.winner = Server.winner;
        this.timeStart = Server.timeStart;
        this.timeSaved = Date.now();
        this.backgroundImage = Server.backgroundImage;
    }

    initializeDB() {
        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        // Create the "judge_gpt_games" table if it doesn't exist with an AUTOINCREMENT ID  --------------------------------------------------- Maybe this should be done after first message
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS judge_gpt_games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                players TEXT,
                activeRoles TEXT,
                messages TEXT,
                gameCase TEXT,
                caseTitle TEXT,
                ruling TEXT,
                punishment TEXT,
                winner TEXT,
                timeStart INTEGER,
                timeSaved INTEGER,
                backgroundImage TEXT
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

        //get highest ID
        this.GetHighestId();

        //this.getLastXEntries(5);

    }

    // Function to get the highest id from the database
    GetHighestId() {
        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        const getMaxIdSQL = `SELECT MAX(id) as max_id FROM judge_gpt_games`;
        this.db.get(getMaxIdSQL, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            this.id = row.max_id;  // Pass the result back using a callback
            console.log(this.id);
        });

        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }


    async FindLastID() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbAddress, (err) => {
                if (err) {
                    reject(err);
                }
            });

            const getMaxIdSQL = `SELECT MAX(id) as max_id FROM judge_gpt_games`;

            db.get(getMaxIdSQL, (err, row) => {
                if (err) {
                    db.close(() => {
                        reject(err);
                    });
                } else {
                    db.close((closeErr) => {
                        if (closeErr) {
                            reject(closeErr);
                        } else {
                            resolve(row.max_id);
                        }
                    });
                }
            });
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
            INSERT INTO judge_gpt_games (players, activeRoles, messages, gameCase, caseTitle, ruling, punishment, winner, timeStart, timeSaved, backgroundImage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

// Debug log for data being inserted
console.log("Inserting data into judge_gpt_games:", {
    players: JSON.stringify(this.players),
    activeRoles: JSON.stringify(this.activeRoles),
    messages: JSON.stringify(this.messages),
    gameCase: this.gameCase,
    caseTitle: this.caseTitle,
    ruling: this.ruling,
    punishment: this.punishment,
    winner: this.winner,
    timeStart: this.timeStart,
    timeSaved: this.timeSaved,
    backgroundImage: this.backgroundImage
});

        // Run the INSERT SQL command
        // The parameters provided in the second argument will replace the question marks in the SQL
        this.db.run(insertSQL,
            [
                JSON.stringify(this.players),
                JSON.stringify(this.activeRoles),
                JSON.stringify(this.messages),
                this.gameCase,
                this.caseTitle,
                this.ruling,
                this.punishment,
                this.winner,
                this.timeStart,
                this.timeSaved,
                this.backgroundImage
            ],
            function(err) {
                if (err) {
                    // Log any errors that occur during the insertion process
                    return console.error(err.message);
                }
                // Retrieve and save the last inserted row's ID to the class instance
                // this.lastID is provided by the sqlite3 library's context
                //this.id = this.lastID;

            }.bind(this)  // Ensure the callback's context (this) remains the JudgeGPTDBManager instance
        );

        // Close the database connection after the insert operation
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });



        //get highest ID
        this.GetHighestId();

        if(debug)
            console.log("Successfully saved game to database with ID:", this.id);


        //this.getLastXEntries(5);
    }


    UpdateData(Server) {
        this.setData(Server);

        console.log("UpdateData for id of : " + this.id);

        this.db = new sqlite3.Database(this.dbAddress, (err) => {
            if (err) {
                return console.error(err.message);
            }
        });

        // Log the data being sent to the database for debugging
        if(debug)
        {
            console.log("Preparing to update database with the following data:");
            console.log({
                players: JSON.stringify(this.players),
                activeRoles: JSON.stringify(this.activeRoles),
                messages: JSON.stringify(this.messages),
                gameCase: this.gameCase,
                caseTitle: this.caseTitle,
                ruling: this.ruling,
                punishment: this.punishment,
                winner: this.winner,
                timeStart: this.timeStart,
                timeSaved: this.timeSaved,
                backgroundImage: this.backgroundImage,
                id: this.id
            });
        }
        
        // Update the record corresponding to the saved ID
        const updateSQL = `
            UPDATE judge_gpt_games 
            SET players = ?, 
                activeRoles = ?, 
                messages = ?, 
                gameCase = ?, 
                caseTitle = ?, 
                ruling = ?, 
                punishment = ?, 
                winner = ?, 
                timeStart = ?, 
                timeSaved = ?,
                backgroundImage = ?
            WHERE id = ?
        `;
        this.db.run(
            updateSQL,
            [
                JSON.stringify(this.players),
                JSON.stringify(this.activeRoles),
                JSON.stringify(this.messages),
                this.gameCase,
                this.caseTitle,
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
                
                if(debug)
                    console.log("Successfully updated game in database with ID:", this.id);
            }
        );

        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });


        //this.getLastXEntries(5);
    }

    // Update GetEntryById to return a Promise
    GetEntryById(id) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbAddress, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    console.error('Error connecting to the database:', err.message);
                    reject(err);
                } else {
                    if(debug)
                        console.log('Connected to the SQLite database.');
                }
            });

            const query = `SELECT * FROM judge_gpt_games WHERE id = ?`;

            db.get(query, [id], (err, row) => {
                if (err) {
                    console.error('Error running query:', err.message);
                    reject(err);
                } else if (row) {
                    //row.max_id = this.GetHighestId();
                    if(debug)
                        console.log(`Entry with ID ${id}:`, row);
                    resolve(row);
                } else {
                    console.log(`No entry found with ID ${id}.`);
                    resolve(null);
                }
            });

            db.close((err) => {
                if (err) {
                    console.error('Error closing the database:', err.message);
                }
                if(debug)
                    console.log('Closed the database connection.');
            });
        });
    }


    getLastXEntries(x) {
        const db = new sqlite3.Database(dbAddress, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                return console.error('Error connecting to the database:', err.message);
            }
            if(debug)
                console.log('Connected to the SQLite database.');
        });

        // Assuming you have an "id" field in your table that increments with each entry
        const query = `SELECT * FROM judge_gpt_games ORDER BY id DESC LIMIT ?`; // Replace 'your_table' with your table name

        db.all(query, [x], (err, rows) => {
            if (err) {
                return console.error('Error running query:', err.message);
            }
            
            // Display the rows
            if(debug)
                console.log(`Last ${x} entries:`, rows);
        });

        db.close((err) => {
            if (err) {
                return console.error('Error closing the database:', err.message);
            }
            if(debug)
                console.log('Closed the database connection.');
        });
    }

}

module.exports = JudgeGPTDBManager;