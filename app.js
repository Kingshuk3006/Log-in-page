const express = require ('express');
const bodyParser = require ('body-parser');
const db = require ('my-sql');
const path = require ('path');
const res = require ('express/lib/response');
const app = express ();

app.use (bodyParser.urlencoded ({extended: true}));

const pool = db.createPool ({
  connectionLimit: 10,
  user: 'root',
  password: '',
  host: 'localhost',
  database: 'fbuser',
});

app.get ('/', (req, res) => {
  res.sendFile (path.join (__dirname + '/form.html'));
});

app.post ('/', (req, res) => {
  pool.getConnection ((err, connection) => {
    if (err) throw err;
    let sql = `INSERT INTO user VALUES("${req.body.firstName}", "${req.body.lastName}", "${req.body.email}", "${req.body.password}")`;
    pool.query (sql, (err, rows, fields) => {
      connection.release ();
      if (!err) {
        res.sendFile (path.join (__dirname + '/saved.html')); 
      } else {
        console.log (err);
      }
    });
  });
});

app.listen (3000, () => {
  console.log ('server started at port 3000');
});
