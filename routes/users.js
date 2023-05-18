var express = require('express');
var router = express.Router();
var db = require("./database.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sql = "select name, email from user"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.render('user/index', {title: 'Users', users: rows });
    });
});

router.get('/:id', function(req, res, next) {
  var sql = "select name, email from user where id = ?"
  var params = [req.params.id]
  db.all(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.render('user/index', {title: 'Users', users: row });
    });
});

router.post('/', function(req, res, next) {
  var errors=[]
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password)
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params =[data.name, data.email, data.password]
  db.all(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.render('user/index', {title: 'Users', id: this.lastID });
    });
});

router.patch('/:id', function(req, res, next) {
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : req.body.password ? md5(req.body.password) : undefined
  }
  db.run(
      `UPDATE user set 
         name = coalesce(?,name), 
         email = COALESCE(?,email), 
         password = coalesce(?,password) 
         WHERE id = ?`,
      [data.name, data.email, data.password, req.params.id],
      (err, result) => {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.render('user/index', {title: 'Users', data: data });
  });
});

router.delete('/:id', function(req, res, next) {
  db.run(
      'DELETE FROM user WHERE id = ?',
      req.params.id,
      function (err, result) {
          if (err){
              res.status(400).json({"error": res.message})
              return;
          }
          res.render('user/index', {title: 'Users', rows: this.changes });
  });
});

module.exports = router;
