const express = require('express')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const port = 3000
const db = new sqlite3.Database("database.db")

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.all(`SELECT users.image, entries.id, entries.title, entries.content, users.username
  FROM entries
  INNER JOIN Users 
  ON entries.author=Users.id;`, (err, rows) => {
    res.render("index", {entries: rows})
  })
})

app.get('/entry/:id', (req, res) => {
  db.all(`SELECT entries.id, entries.title, entries.content, users.username
  FROM entries
  INNER JOIN Users 
  ON entries.author=Users.id;`, (err, rows) => {
    db.get(`SELECT entries.title, entries.content, users.username
    FROM entries
    INNER JOIN Users 
    ON entries.author=Users.id WHERE entries.id = ${req.params.id}`, (err, rowEntry) => {
      console.log(`SELECT comments.title, comments.content, users.username
      FROM comments
      INNER JOIN Users 
      ON comments.author=Users.id WHERE comments.entry = ${req.params.id}`)
      db.all(`SELECT comments.content, users.username
      FROM comments
      INNER JOIN Users 
      ON comments.author=Users.id WHERE comments.entry = ${req.params.id}`, (err, rowsComments) => {
        res.render("entry", {entries: rows, entry: rowEntry, comments: rowsComments})
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})