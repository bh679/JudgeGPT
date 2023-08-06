const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database, or create it if it doesn't exist
let db = new sqlite3.Database('./mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  // Check if the "users" table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    // If the "users" table doesn't exist, create it
    if (!row) {
      db.run("CREATE TABLE users (id INT, name TEXT)", (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Table created successfully.");
      });
    }
  });

  // Insert sample data into the "users" table
  let stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
  stmt.run(1, "Alice");
  stmt.run(2, "Bob");
  stmt.finalize();

  // Query data from the "users" table and print to console
  db.each("SELECT id, name FROM users", (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`ID: ${row.id}, Name: ${row.name}`);
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
