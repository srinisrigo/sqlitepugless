var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin", "admin@example.com", md5("admin123456")])
                db.run(insert, ["user", "user@example.com", md5("user123456")])
            }
        })

        db.run(`CREATE TABLE tool (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number text UNIQUE, 
            name text, 
            CONSTRAINT number_unique UNIQUE (number)
            )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var i = 0; i < 26; i++) {
                    var insert = 'INSERT INTO tool (name, number) VALUES (?,?)'
                    db.run(insert, ['3600@B872634'.replace('@', alphabets.charAt(i)), 'ATX GB S@C'.replace('@', alphabets.charAt(i))])
                }
            }
        })
    }
})


module.exports = db