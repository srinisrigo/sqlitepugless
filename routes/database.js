var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
var uuid = require('uuid')
var randomWords = require('random-words')

const DBSOURCE = "db.sqlite"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE user (
            id text PRIMARY KEY,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (id, name, email, password) VALUES (?,?,?,?)'
                for (var i = 0; i < 53; i++) {
                    var uname = randomWords({ exactly: 2, minLength: 5, maxLength: 10, join: ' ' });
                    db.run(insert, [uuid.v4(), uname, uname.replace(' ','')+"@example.com", md5(uname.replace(' ','')+"123456")])
                }
            }
        })

        db.run(`CREATE TABLE tool (
            id text PRIMARY KEY,
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
                    var insert = 'INSERT INTO tool (id, number, name) VALUES (?,?,?)'
                    db.run(insert, [uuid.v4(), '3600@B872634'.replace('@', alphabets.charAt(i)), 'ATX GB S@C'.replace('@', alphabets.charAt(i))])
                }
            }
        })
    }
})


module.exports = db