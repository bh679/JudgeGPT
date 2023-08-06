const sqlite3 = require('sqlite3').verbose();
const JudgeGPTDBManager = require('./JudgeGPTDBManager');

// Connect to the SQLite database, or create it if it doesn't exist
let db = new sqlite3.Database('./mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create the "judge_gpt_games" table if it doesn't exist
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS judge_gpt_games (
    id INTEGER PRIMARY KEY,
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
db.run(createTableSQL, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Table checked/created successfully.");
});

// Example usage: Create a new game record
const exampleServer = {
  players: { Alice: 'Role1', Bob: 'Role2', Charlie: 'Role3' },
  activeRoles: { Alice: 'Role1', Bob: 'Role2' },
  messagesChat: [{ sender: 'Alice', message: 'Hello!' }, { sender: 'Bob', message: 'Hi Alice!' }],
  gameCase: 'Sample Case',
  ruling: 'Sample Ruling',
  punishment: 'Sample Punishment',
  winner: 'Alice',
  timeStart: Date.now() - 60000 // 1 minute ago
};

const gameManager = new JudgeGPTDBManager(exampleServer, db);

// Later on, you can update the game data
const updatedServerData = {
  // ... (some updated data)
};
gameManager.UpdateData(updatedServerData);

// Remember to close the database connection when done
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
